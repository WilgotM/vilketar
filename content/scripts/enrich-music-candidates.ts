import { readFile, writeFile } from "fs/promises";
import path from "path";

type MusicCandidate = {
  appleArtworkUrl?: string | null;
  appleMatchArtist: string | null;
  appleMatchTitle: string | null;
  applePreviewUrl?: string | null;
  appleTrackId: number | null;
  appleTrackViewUrl?: string | null;
  artist: string;
  needsReview: boolean;
  reviewReason: string | null;
  spotifyReleaseDate: string;
  spotifyTrackId: string;
  spotifyUri: string;
  title: string;
  wikidataQid: string | null;
  wikipediaTitle: string | null;
  year: number;
  yearConfidence: string;
  yearSource: string | null;
};

type ItunesTrack = {
  artistName?: string;
  artworkUrl100?: string;
  collectionName?: string;
  previewUrl?: string;
  releaseDate?: string;
  trackExplicitness?: string;
  trackId?: number;
  trackName?: string;
  trackTimeMillis?: number;
  trackViewUrl?: string;
};

const CANDIDATES_FILE = path.join(
  process.cwd(),
  "content/music/vilketar-music-candidates.json",
);
const CONCURRENCY = 1;
const SEARCH_LIMIT = 25;
const REQUEST_INTERVAL_MS = 3_200;
const RETRY_DELAYS_MS = [3_200, 6_400, 12_800];
const VERSION_WORDS =
  /\b(remaster(?:ed)?|deluxe|radio edit|single version|edit|album version|original version|mono|stereo|bonus track|feat(?:uring)?\.?\s+[^)\]]+|from .+ soundtrack)\b/giu;
const REISSUE_WORDS =
  /\b(remaster(?:ed)?|deluxe|radio edit|single version|edit|album version|bonus track)\b/iu;
const UNWANTED_VERSION_WORDS =
  /\b(karaoke|tribute|instrumental|cover|live|remix|sped up|slowed|re-recorded)\b/iu;

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .replaceAll(/&/g, " and ")
    .replaceAll(VERSION_WORDS, " ")
    .replaceAll(/[()[\]{}]/g, " ")
    .replaceAll(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function firstArtist(value: string): string {
  return value.split(";")[0]?.trim() || value;
}

function releaseYear(track: ItunesTrack): number | null {
  const year = Number(track.releaseDate?.slice(0, 4));
  return Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : null;
}

function matchScore(candidate: MusicCandidate, track: ItunesTrack): number {
  const candidateTitle = normalize(candidate.title);
  const resultTitle = normalize(track.trackName ?? "");
  const candidateArtist = normalize(firstArtist(candidate.artist));
  const resultArtist = normalize(track.artistName ?? "");

  if (!candidateTitle || !resultTitle || !candidateArtist || !resultArtist) {
    return -Infinity;
  }

  let score = 0;
  if (candidateTitle === resultTitle) score += 8;
  else if (
    candidateTitle.includes(resultTitle) ||
    resultTitle.includes(candidateTitle)
  )
    score += 4;
  else return -Infinity;

  if (candidateArtist === resultArtist) score += 8;
  else if (
    candidateArtist.includes(resultArtist) ||
    resultArtist.includes(candidateArtist)
  )
    score += 4;
  else return -Infinity;

  if (track.previewUrl) score += 3;
  if (track.trackId) score += 1;

  const inputHasSpecialVersion = UNWANTED_VERSION_WORDS.test(candidate.title);
  const resultHasSpecialVersion = UNWANTED_VERSION_WORDS.test(
    `${track.trackName ?? ""} ${track.collectionName ?? ""}`,
  );
  if (!inputHasSpecialVersion && resultHasSpecialVersion) score -= 8;

  const year = releaseYear(track);
  if (year !== null) {
    const difference = Math.abs(year - candidate.year);
    score += Math.max(0, 3 - difference / 4);
  }

  return score;
}

function chooseTrack(
  candidate: MusicCandidate,
  tracks: ItunesTrack[],
): ItunesTrack | null {
  const ranked = tracks
    .map((track) => ({ score: matchScore(candidate, track), track }))
    .filter(({ score, track }) => score >= 15 && !!track.previewUrl)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return (
        (releaseYear(left.track) ?? Number.MAX_SAFE_INTEGER) -
        (releaseYear(right.track) ?? Number.MAX_SAFE_INTEGER)
      );
    });

  return ranked[0]?.track ?? null;
}

async function searchItunes(candidate: MusicCandidate): Promise<ItunesTrack[]> {
  const params = new URLSearchParams({
    country: "SE",
    entity: "song",
    limit: String(SEARCH_LIMIT),
    term: `${firstArtist(candidate.artist)} ${candidate.title}`,
  });
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?${params}`,
        {
          headers: {
            "User-Agent":
              "VilketAr/0.1 (https://xn--vilketr-jxa.se; music preview metadata)",
          },
        },
      );
      if (!response.ok) {
        throw new Error(`iTunes returned ${response.status}`);
      }

      const data = (await response.json()) as { results?: ItunesTrack[] };
      return data.results ?? [];
    } catch (error) {
      lastError = error;
      const delay = RETRY_DELAYS_MS[attempt];
      if (delay === undefined) break;
      await sleep(delay);
    }
  }

  throw lastError;
}

function artworkUrl(track: ItunesTrack): string | null {
  return (
    track.artworkUrl100?.replace(/100x100bb/u, "600x600bb") ??
    track.artworkUrl100 ??
    null
  );
}

async function enrich(candidate: MusicCandidate): Promise<MusicCandidate> {
  if (
    candidate.appleTrackId &&
    candidate.applePreviewUrl &&
    candidate.appleTrackViewUrl
  ) {
    return candidate;
  }

  try {
    const tracks = await searchItunes(candidate);
    const match = chooseTrack(candidate, tracks);
    if (!match?.trackId || !match.previewUrl) {
      return {
        ...candidate,
        appleTrackId: null,
        appleMatchTitle: null,
        appleMatchArtist: null,
        applePreviewUrl: null,
        appleArtworkUrl: null,
        appleTrackViewUrl: null,
        needsReview: true,
        reviewReason: "Ingen säker spelbar träff i svenska Apple-katalogen.",
      };
    }

    const appleYear = releaseYear(match);
    const spotifyLooksLikeReissue = REISSUE_WORDS.test(candidate.title);
    const useAppleYear =
      appleYear !== null &&
      (spotifyLooksLikeReissue || appleYear <= candidate.year);
    const resolvedYear = useAppleYear ? appleYear : candidate.year;

    return {
      ...candidate,
      appleTrackId: match.trackId,
      appleMatchTitle: match.trackName ?? candidate.title,
      appleMatchArtist: match.artistName ?? candidate.artist,
      applePreviewUrl: match.previewUrl,
      appleArtworkUrl: artworkUrl(match),
      appleTrackViewUrl: match.trackViewUrl ?? null,
      year: resolvedYear,
      yearSource: match.trackViewUrl ?? candidate.yearSource,
      yearConfidence: useAppleYear ? "apple-catalog" : candidate.yearConfidence,
      needsReview: false,
      reviewReason: null,
    };
  } catch (error) {
    return {
      ...candidate,
      needsReview: true,
      reviewReason: `Apple-uppslag misslyckades: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

async function main() {
  const candidates = JSON.parse(
    await readFile(CANDIDATES_FILE, "utf8"),
  ) as MusicCandidate[];
  const enriched = new Array<MusicCandidate>(candidates.length);
  let cursor = 0;
  let completed = 0;

  async function worker() {
    while (cursor < candidates.length) {
      const index = cursor;
      cursor += 1;
      enriched[index] = await enrich(candidates[index]);
      completed += 1;
      if (completed % 25 === 0 || completed === candidates.length) {
        console.log(`Matched ${completed}/${candidates.length} songs`);
      }
      await sleep(REQUEST_INTERVAL_MS);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  await writeFile(CANDIDATES_FILE, `${JSON.stringify(enriched, null, 2)}\n`);

  const matched = enriched.filter((candidate) => candidate.appleTrackId).length;
  console.log(
    `Finished: ${matched}/${enriched.length} playable Apple matches.`,
  );
}

await main();
