import { readFile, writeFile } from "fs/promises";
import path from "path";

type MusicCandidate = {
  artist: string;
  needsReview: boolean;
  reviewReason: string | null;
  spotifyReleaseDate: string;
  spotifyTrackId: string;
  title: string;
  year: number;
  yearConfidence: string;
  yearSource: string | null;
  [key: string]: unknown;
};

type MusicBrainzRecording = {
  "artist-credit"?: Array<{ name?: string }>;
  "first-release-date"?: string;
  id?: string;
  score?: number;
  title?: string;
};

type YearOverride = {
  source: string;
  year: number;
};

const CANDIDATES_FILE = path.join(
  process.cwd(),
  "content/music/vilketar-music-candidates.json",
);
const OVERRIDES_FILE = path.join(
  process.cwd(),
  "content/music/year-overrides.json",
);
const REQUEST_INTERVAL_MS = 1_100;
const VERSION_WORDS =
  /\b(remaster(?:ed)?|re-recorded|deluxe|radio edit|\d+\s*["”']?\s*single version|single version|edit|album version|original mix|original version|mono|stereo|bonus track|digitally remastered|feat(?:uring)?\.?\s+[^)\]]+)\b/giu;

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .replaceAll(/&/g, " and ")
    .replaceAll(VERSION_WORDS, " ")
    .replaceAll(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function escapeQuery(value: string): string {
  return value.replaceAll(/[\\"]/g, (match) => `\\${match}`);
}

function searchableTitle(value: string): string {
  return value
    .replaceAll(VERSION_WORDS, " ")
    .replaceAll(/[()[\]{}]/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();
}

function firstArtist(value: string): string {
  return value.split(";")[0]?.trim() || value;
}

function releaseYear(recording: MusicBrainzRecording): number | null {
  const year = Number(recording["first-release-date"]?.slice(0, 4));
  return Number.isInteger(year) && year >= 1900 && year <= 2100 ? year : null;
}

function chooseRecording(
  candidate: MusicCandidate,
  recordings: MusicBrainzRecording[],
): MusicBrainzRecording | null {
  const expectedTitle = normalize(candidate.title);
  const expectedArtist = normalize(firstArtist(candidate.artist));

  return (
    recordings
      .filter((recording) => {
        const artist = normalize(
          (recording["artist-credit"] ?? [])
            .map((credit) => credit.name ?? "")
            .join(" "),
        );
        const title = normalize(recording.title ?? "");
        return (
          (recording.score ?? 0) >= 80 &&
          title === expectedTitle &&
          (artist.includes(expectedArtist) ||
            expectedArtist.includes(artist)) &&
          releaseYear(recording) !== null
        );
      })
      .sort((left, right) => {
        const yearDifference =
          (releaseYear(left) ?? 9999) - (releaseYear(right) ?? 9999);
        if (yearDifference !== 0) return yearDifference;
        return (right.score ?? 0) - (left.score ?? 0);
      })[0] ?? null
  );
}

async function fetchRecordings(
  candidate: MusicCandidate,
): Promise<MusicBrainzRecording[]> {
  const query = `recording:"${escapeQuery(searchableTitle(candidate.title))}" AND artist:"${escapeQuery(firstArtist(candidate.artist))}"`;
  const params = new URLSearchParams({ fmt: "json", limit: "25", query });
  const response = await fetch(
    `https://musicbrainz.org/ws/2/recording/?${params}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "VilketAr/0.1 (https://xn--vilketr-jxa.se; contact: github.com/WilgotM/vilketar)",
      },
    },
  );
  if (!response.ok) throw new Error(`MusicBrainz returned ${response.status}`);
  const data = (await response.json()) as {
    recordings?: MusicBrainzRecording[];
  };
  return data.recordings ?? [];
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function applyOverride(
  candidate: MusicCandidate,
  overrides: Record<string, YearOverride>,
): boolean {
  const override = overrides[candidate.spotifyTrackId];
  if (!override) return false;
  candidate.year = override.year;
  candidate.yearConfidence = "manually-verified";
  candidate.yearSource = override.source;
  return true;
}

async function main() {
  const candidates = JSON.parse(
    await readFile(CANDIDATES_FILE, "utf8"),
  ) as MusicCandidate[];
  const overrides = JSON.parse(
    await readFile(OVERRIDES_FILE, "utf8"),
  ) as Record<string, YearOverride>;
  if (process.argv.includes("--overrides-only")) {
    const applied = candidates.filter((candidate) =>
      applyOverride(candidate, overrides),
    ).length;
    await writeFile(
      CANDIDATES_FILE,
      `${JSON.stringify(candidates, null, 2)}\n`,
    );
    console.log(`Applied ${applied} manual year overrides.`);
    return;
  }
  let verified = 0;

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    const spotifyYear = Number(candidate.spotifyReleaseDate.slice(0, 4));
    const baselineYear =
      Number.isInteger(spotifyYear) && spotifyYear >= 1900
        ? spotifyYear
        : candidate.year;
    candidate.year = baselineYear;
    candidate.yearConfidence = "spotify-catalog";
    candidate.yearSource = null;
    try {
      const recordings = await fetchRecordings(candidate);
      const match = chooseRecording(candidate, recordings);
      const year = match ? releaseYear(match) : null;
      if (match?.id && year !== null && year <= baselineYear) {
        candidate.year = year;
        candidate.yearConfidence = "verified-musicbrainz";
        candidate.yearSource = `https://musicbrainz.org/recording/${match.id}`;
        verified += 1;
      }
    } catch (error) {
      candidate.needsReview = true;
      candidate.reviewReason = `Årsuppslag misslyckades: ${error instanceof Error ? error.message : String(error)}`;
    }

    applyOverride(candidate, overrides);

    if ((index + 1) % 25 === 0 || index === candidates.length - 1) {
      await writeFile(
        CANDIDATES_FILE,
        `${JSON.stringify(candidates, null, 2)}\n`,
      );
      console.log(
        `Verified ${verified} years after ${index + 1}/${candidates.length} songs`,
      );
    }
    await sleep(REQUEST_INTERVAL_MS);
  }
}

await main();
