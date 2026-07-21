import { Card } from "../types/cards";

type MusicCardData = NonNullable<Card["music"]>;

type ItunesTrack = {
  artistName?: string;
  artworkUrl100?: string;
  previewUrl?: string;
  trackId?: number;
  trackName?: string;
  trackViewUrl?: string;
};

type ItunesResponse = {
  results?: ItunesTrack[];
};

export type MusicPreview = {
  appleTrackViewUrl: string | null;
  artworkUrl: string | null;
  previewUrl: string;
};

const previewCache = new Map<string, Promise<MusicPreview | null>>();
const resolvedPreviewCache = new Map<string, MusicPreview>();
const VERSION_WORDS =
  /\b(remaster(?:ed)?|deluxe|radio edit|single version|edit|album version|original mix|original version|mono|stereo|bonus track|feat(?:uring)?\.?\s+[^)\]]+)\b/giu;
const HARD_UNWANTED_VERSION_WORDS =
  /\b(karaoke|tribute|instrumental|cover|re-recorded)\b/iu;
const ALTERNATE_VERSION_WORDS = /\b(live|remix|sped up|slowed)\b/iu;

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

function cacheKey(music: MusicCardData, title: string): string {
  return `${music.spotifyTrackId}:${title}`;
}

function scoreTrack(
  music: MusicCardData,
  title: string,
  track: ItunesTrack,
): number {
  const expectedTitle = normalize(title);
  const resultTitle = normalize(track.trackName ?? "");
  const expectedArtist = normalize(music.artist);
  const expectedArtistParts = music.artist
    .split(/\s*&\s*/u)
    .map(normalize)
    .filter(Boolean);
  const resultArtist = normalize(track.artistName ?? "");
  if (!track.previewUrl || !expectedTitle || !resultTitle) return -Infinity;

  let score = 0;
  if (expectedTitle === resultTitle) score += 8;
  else if (
    expectedTitle.includes(resultTitle) ||
    resultTitle.includes(expectedTitle)
  )
    score += 4;
  else return -Infinity;

  if (expectedArtist === resultArtist) score += 8;
  else if (
    expectedArtist.includes(resultArtist) ||
    resultArtist.includes(expectedArtist) ||
    expectedArtistParts.some(
      (artist) =>
        artist.includes(resultArtist) || resultArtist.includes(artist),
    )
  )
    score += 4;
  else return -Infinity;

  if (HARD_UNWANTED_VERSION_WORDS.test(track.trackName ?? "")) {
    return -Infinity;
  }
  if (ALTERNATE_VERSION_WORDS.test(track.trackName ?? "")) score -= 4;
  return score;
}

function searchWithJsonp(
  music: MusicCardData,
  title: string,
): Promise<MusicPreview | null> {
  return new Promise((resolve) => {
    const callbackName = `__vilketArItunes${Date.now()}${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const globalCallbacks = window as unknown as Record<
      string,
      ((response: ItunesResponse) => void) | undefined
    >;
    let completed = false;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      delete globalCallbacks[callbackName];
      script.remove();
    };
    const finish = (value: MusicPreview | null) => {
      if (completed) return;
      completed = true;
      cleanup();
      resolve(value);
    };
    const timeoutId = window.setTimeout(() => finish(null), 12_000);

    globalCallbacks[callbackName] = (response) => {
      const best = (response.results ?? [])
        .map((track) => ({ score: scoreTrack(music, title, track), track }))
        .filter(({ score }) => score >= 4)
        .sort((left, right) => right.score - left.score)[0]?.track;
      if (!best?.previewUrl) {
        finish(null);
        return;
      }

      finish({
        appleTrackViewUrl: best.trackViewUrl ?? null,
        artworkUrl:
          best.artworkUrl100?.replace(/100x100bb/u, "600x600bb") ?? null,
        previewUrl: best.previewUrl,
      });
    };
    script.onerror = () => finish(null);
    const params = new URLSearchParams({
      callback: callbackName,
      country: "SE",
      entity: "song",
      limit: "50",
      term: `${music.artist.split(/\s*&\s*/u)[0] ?? music.artist} ${title}`,
    });
    script.src = `https://itunes.apple.com/search?${params}`;
    document.head.appendChild(script);
  });
}

export function resolveMusicPreview(
  music: MusicCardData,
  title: string,
): Promise<MusicPreview | null> {
  const key = cacheKey(music, title);
  if (music.previewUrl) {
    const preview = {
      appleTrackViewUrl: music.appleTrackViewUrl,
      artworkUrl: music.artworkUrl,
      previewUrl: music.previewUrl,
    };
    resolvedPreviewCache.set(key, preview);
    return Promise.resolve(preview);
  }

  const cached = previewCache.get(key);
  if (cached) return cached;

  const request = searchWithJsonp(music, title).then((preview) => {
    if (preview) resolvedPreviewCache.set(key, preview);
    return preview;
  });
  previewCache.set(key, request);
  return request;
}

export function getCachedMusicPreview(
  music: MusicCardData,
  title: string,
): MusicPreview | null {
  if (music.previewUrl) {
    return {
      appleTrackViewUrl: music.appleTrackViewUrl,
      artworkUrl: music.artworkUrl,
      previewUrl: music.previewUrl,
    };
  }
  return resolvedPreviewCache.get(cacheKey(music, title)) ?? null;
}
