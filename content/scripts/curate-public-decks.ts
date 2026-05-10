import { readFile, readdir, writeFile } from "fs/promises";
import path from "path";
import { Card } from "../../types/cards";
import { DeckDifficultyCounts, DeckNode } from "../../types/decks";

const PUBLIC_DECKS_DIR = path.join(process.cwd(), "public/decks");
const INDEX_FILE = path.join(PUBLIC_DECKS_DIR, "index.json");

const DIFFICULTY_MIN_PAGE_VIEWS = {
  easy: 250_000,
  normal: 100_000,
  hard: 50_000,
} satisfies DeckDifficultyCounts;

const DEFAULT_MIN_PAGE_VIEWS = DIFFICULTY_MIN_PAGE_VIEWS.hard;

const DECK_MIN_PAGE_VIEWS: Array<[RegExp, number]> = [
  [/^all-sweden/, 15_000],
  [/^all-sport-svensk-sport$/, 15_000],
  [/^all-history-(wars|nations|eras)$/, 150_000],
  [/^all-history-battles$/, 100_000],
  [/^all-leaders-rulers-/, 75_000],
  [/^all-leaders-politicians-/, 75_000],
  [/^all-leaders-rulers-europe-sweden$/, 25_000],
  [/^all-entertainment-(music|books|video-games)$/, 50_000],
  [/^all-technology-video-games$/, 50_000],
  [/^all-entertainment-(films|tv)$/, 75_000],
  [/^all-art-(paintings|sculptures)$/, 50_000],
  [/^all-architecture-/, 50_000],
  [/^all-engineering-(military-vehicles|weapons|space|rail)$/, 75_000],
  [/^all-sport-(teams|stadiums)$/, 50_000],
];

const BANNED_CARD_PATTERNS = [
  /Nagorno-Karabach/i,
  /Mysore/i,
  /Natufisk/i,
  /Snörkeramisk/i,
  /Ubaid/i,
  /Fatimiderna/i,
  /Umayyaderna/i,
  /Abbasiderna/i,
  /Joseon/i,
  /Mercia/i,
  /Pahlavidynastin/i,
  /Sasaniderna/i,
  /Akemeniderriket/i,
];

function getDeckMinPageViews(deckId: string): number {
  return (
    DECK_MIN_PAGE_VIEWS.find(([pattern]) => pattern.test(deckId))?.[1] ??
    DEFAULT_MIN_PAGE_VIEWS
  );
}

function isBlocked(card: Card): boolean {
  const haystack = `${card.title}\n${card.subtitle ?? ""}\n${card.fact}`;
  return BANNED_CARD_PATTERNS.some((pattern) => pattern.test(haystack));
}

function countDifficulty(cards: Card[]): DeckDifficultyCounts {
  const qids = {
    easy: new Set<string>(),
    normal: new Set<string>(),
    hard: new Set<string>(),
  };

  for (const card of cards) {
    const pageViews = card.pageViews ?? 0;

    if (pageViews >= DIFFICULTY_MIN_PAGE_VIEWS.hard) {
      qids.hard.add(card.qid);
    }

    if (pageViews >= DIFFICULTY_MIN_PAGE_VIEWS.normal) {
      qids.normal.add(card.qid);
    }

    if (pageViews >= DIFFICULTY_MIN_PAGE_VIEWS.easy) {
      qids.easy.add(card.qid);
    }
  }

  return {
    easy: qids.easy.size,
    normal: qids.normal.size,
    hard: qids.hard.size,
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

async function main() {
  const fileNames = (await readdir(PUBLIC_DECKS_DIR)).filter(
    (fileName) => fileName.endsWith(".json") && fileName !== "index.json",
  );
  const countsByDeckId = new Map<string, DeckDifficultyCounts>();
  let removedCards = 0;
  let remainingCards = 0;

  for (const fileName of fileNames) {
    const deckId = fileName.replace(/\.json$/, "");
    const filePath = path.join(PUBLIC_DECKS_DIR, fileName);
    const cards = JSON.parse(await readFile(filePath, "utf8")) as Card[];
    const minPageViews = getDeckMinPageViews(deckId);
    const curatedCards = cards.filter((card) => {
      return (card.pageViews ?? 0) >= minPageViews && !isBlocked(card);
    });

    removedCards += cards.length - curatedCards.length;
    remainingCards += curatedCards.length;
    countsByDeckId.set(deckId, countDifficulty(curatedCards));

    await writeFile(filePath, `${JSON.stringify(curatedCards, null, 2)}\n`);
  }

  const index = JSON.parse(await readFile(INDEX_FILE, "utf8")) as DeckNode;

  function hydrateCounts(node: DeckNode): DeckDifficultyCounts {
    const ownCounts =
      countsByDeckId.get(node.id) ??
      ({
        easy: 0,
        normal: 0,
        hard: 0,
      } satisfies DeckDifficultyCounts);

    const childCounts = (node.children ?? []).reduce(
      (sum, child) => addCounts(sum, hydrateCounts(child)),
      {
        easy: 0,
        normal: 0,
        hard: 0,
      } satisfies DeckDifficultyCounts,
    );

    node.difficultyCounts = addCounts(ownCounts, childCounts);
    return node.difficultyCounts;
  }

  hydrateCounts(index);
  await writeFile(INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`);

  console.log(
    `Curated public decks: removed ${removedCards} cards, kept ${remainingCards}.`,
  );
}

await main();
