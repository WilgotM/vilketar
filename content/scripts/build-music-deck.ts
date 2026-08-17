import { readFile, writeFile } from "fs/promises";
import path from "path";
import { Card } from "../../types/cards";
import { DeckDifficultyCounts, DeckNode } from "../../types/decks";
import {
  applyCardImageOverride,
  readCardImageOverrides,
} from "../card-image-overrides";
import { LEGACY_SONG_CARD_TITLES } from "../music/legacy-song-card-migrations";

type MusicCandidate = {
  appleArtworkUrl?: string | null;
  applePreviewUrl?: string | null;
  appleTrackId: number | null;
  appleTrackViewUrl?: string | null;
  artist: string;
  spotifyArtworkUrl?: string | null;
  spotifyPreviewUrl?: string | null;
  spotifyTrackId: string;
  title: string;
  year: number;
};

const MUSIC_DECK_ID = "all-entertainment-music";
const CLASSICS_DECK_ID = "all-swedish-classics-all";
const CANDIDATES_FILE = path.join(
  process.cwd(),
  "content/music/vilketar-music-candidates.json",
);
const MUSIC_DECK_FILE = path.join(
  process.cwd(),
  `public/decks/${MUSIC_DECK_ID}.json`,
);
const CLASSICS_DECK_FILE = path.join(
  process.cwd(),
  `public/decks/${CLASSICS_DECK_ID}.json`,
);
const INDEX_FILE = path.join(process.cwd(), "public/decks/index.json");
const VERSION_SUFFIX =
  /\s*(?:[-–—]\s*)?(?:\(|\[)?(?:\d{4}\s+)?(?:remaster(?:ed)?|re-recorded|radio edit|\d+\s*["”']?\s*single version|single version|album version|edit|original mix|original version|deluxe)(?:\s+\d{4})?(?:\)|\])?\s*$/iu;
const VERSION_GROUP =
  /\s*[([][^)\]]*(?:remaster(?:ed)?|re-recorded|radio edit|single version|album version|original mix|original version|deluxe)[^)\]]*[)\]]/giu;
const FEATURE_GROUP = /\s*[([]feat(?:uring)?\.?\s+[^)\]]+[)\]]/giu;
const SOUNDTRACK_SUFFIX =
  /\s*[-–—]?\s*from\s+(?:the\s+)?["“”']?.+?soundtrack["“”']?\s*$/iu;

function cleanTitle(title: string): string {
  return title
    .replaceAll(VERSION_GROUP, "")
    .replaceAll(FEATURE_GROUP, "")
    .replace(SOUNDTRACK_SUFFIX, "")
    .replace(VERSION_SUFFIX, "")
    .replace(VERSION_SUFFIX, "")
    .trim();
}

function cleanArtist(artist: string): string {
  return artist
    .split(";")
    .map((name) => name.trim())
    .filter(Boolean)
    .join(" & ");
}

function countDifficulty(cards: Card[]): DeckDifficultyCounts {
  return {
    easy: cards.length,
    normal: cards.length,
    hard: cards.length,
  };
}

function addCounts(
  left: DeckDifficultyCounts,
  right: DeckDifficultyCounts,
): DeckDifficultyCounts {
  return {
    easy: left.easy + right.easy,
    normal: left.normal + right.normal,
    hard: left.hard + right.hard,
  };
}

function toCard(candidate: MusicCandidate): Card {
  const title = cleanTitle(candidate.title);
  const artist = cleanArtist(candidate.artist);
  const artworkUrl =
    candidate.appleArtworkUrl ?? candidate.spotifyArtworkUrl ?? null;
  return {
    fact: `”${title}” framförs av ${artist}.`,
    image: artworkUrl ?? "",
    music: {
      appleTrackId: candidate.appleTrackId,
      appleTrackViewUrl: candidate.appleTrackViewUrl ?? null,
      artist,
      artworkUrl,
      previewUrl:
        candidate.applePreviewUrl ?? candidate.spotifyPreviewUrl ?? null,
      spotifyTrackId: candidate.spotifyTrackId,
    },
    pageViews: 300_000,
    qid: `spotify:${candidate.spotifyTrackId}`,
    subtitle: artist,
    title,
    wikipediaSlug: null,
    year: candidate.year,
  };
}

function findNode(root: DeckNode, id: string): DeckNode | null {
  if (root.id === id) return root;
  for (const child of root.children ?? []) {
    const match = findNode(child, id);
    if (match) return match;
  }
  return null;
}

function hydrateCounts(node: DeckNode): DeckDifficultyCounts {
  if (!node.children?.length) return node.difficultyCounts;
  node.difficultyCounts = node.children.reduce(
    (sum, child) => addCounts(sum, hydrateCounts(child)),
    { easy: 0, normal: 0, hard: 0 },
  );
  return node.difficultyCounts;
}

async function main() {
  const candidates = JSON.parse(
    await readFile(CANDIDATES_FILE, "utf8"),
  ) as MusicCandidate[];
  const imageOverrides = await readCardImageOverrides();
  const seen = new Set<string>();
  const cards = candidates.flatMap((candidate) => {
    const key = `${cleanTitle(candidate.title).toLocaleLowerCase("sv-SE")}::${candidate.artist.toLocaleLowerCase("sv-SE")}`;
    if (
      seen.has(key) ||
      !Number.isInteger(candidate.year) ||
      candidate.year < 1900 ||
      candidate.year > new Date().getUTCFullYear()
    ) {
      return [];
    }
    seen.add(key);
    return [applyCardImageOverride(toCard(candidate), imageOverrides)];
  });

  await writeFile(MUSIC_DECK_FILE, `${JSON.stringify(cards, null, 2)}\n`);

  const classics = JSON.parse(
    await readFile(CLASSICS_DECK_FILE, "utf8"),
  ) as Card[];
  const remainingClassics = classics.filter(
    (card) => !LEGACY_SONG_CARD_TITLES.has(card.title),
  );
  await writeFile(
    CLASSICS_DECK_FILE,
    `${JSON.stringify(remainingClassics, null, 2)}\n`,
  );

  const index = JSON.parse(await readFile(INDEX_FILE, "utf8")) as DeckNode;
  const musicNode = findNode(index, MUSIC_DECK_ID);
  if (!musicNode) throw new Error(`Missing ${MUSIC_DECK_ID} in deck index`);
  musicNode.difficultyCounts = countDifficulty(cards);
  const classicsNode = findNode(index, CLASSICS_DECK_ID);
  if (!classicsNode)
    throw new Error(`Missing ${CLASSICS_DECK_ID} in deck index`);
  classicsNode.difficultyCounts = countDifficulty(remainingClassics);
  hydrateCounts(index);
  await writeFile(INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`);

  console.log(
    `Built ${cards.length} music cards and removed ${classics.length - remainingClassics.length} legacy song cards from ${CLASSICS_DECK_ID}.`,
  );
}

await main();
