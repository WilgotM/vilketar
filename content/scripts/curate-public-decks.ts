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

// Public decks are player-facing content, not a raw Wikimedia archive. A card
// should be broadly recognisable before it is allowed into any game mode.
const DEFAULT_MIN_PAGE_VIEWS = DIFFICULTY_MIN_PAGE_VIEWS.normal;

const BLOCKED_DECK_PATTERNS = [
  /^all-people-famous-deaths-/u,
  /^all-leaders-(?!rulers-europe-sweden$)/u,
  /^all-sport-(teams|stadiums)$/u,
  /^all-engineering-(weapons|military-vehicles)$/u,
  /^all-technology-computing-(engines|languages|systems)$/u,
];

const DECK_MIN_PAGE_VIEWS: Array<[RegExp, number]> = [
  [/^all-swedish-classics-all$/, 220_000],
  [/^all-sweden/, 220_000],
  [/^all-sport-(sportogonblick|svensk-sport)$/, 180_000],
  [/^all-history-(wars|nations|eras)$/, 150_000],
  [/^all-history-battles$/, 100_000],
  [/^all-leaders-rulers-europe-sweden$/, 100_000],
  [/^all-entertainment-(music|songs)$/, 220_000],
  [/^all-entertainment-/, 100_000],
  [/^all-technology-websites$/, 250_000],
  [/^all-technology-mobile-apps$/, 200_000],
  [/^all-technology-/, 100_000],
  [/^all-business-media$/, 200_000],
  [/^all-art-/, 100_000],
  [/^all-architecture-/, 100_000],
  [/^all-engineering-/, 100_000],
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
  /Anna[’']s Archive/i,
  /Disambig_grey\.svg/i,
  /Lockheed Martin F-35/i,
  /flyger för första gången/i,
  /första flygningen/i,
  /^XXXX lanseras(?:\n|$)/i,
  /Fresh and Fit Podcast|France Musique|Library Genesis|Sci-Hub|4Chan|\bVK\b|Wayback Machine/i,
  /National Basketball Association.*grundas|Saudi Aramco grundas|BYD Auto grundas/i,
  /Kry grundas|Google Play grundas/i,
  /Alfred Nobel uppfinner dynamiten|Dynamiten patenteras|Bluetooth utvecklas|Första implanterbara pacemakern opereras in/i,
  /klubbfotboll|fotbollsarena/i,
  /Tre Kronor vinner OS-finalen mot Finland/i,
  /Tre Kronor tar dubbeln/i,
  /Anja Pärson vinner OS-guld/i,
  /Stefan Holm vinner OS-guld/i,
  /Tomas Brolin gör mål i VM/i,
  /Tomas Ravelli räddar straff/i,
  /Jan-Ove Waldner vinner OS-guld/i,
  /Sverige tar OS-silver i damfotboll/i,
  /Färjestad vinner SM-guld|Frölunda blir europeiska mästare/i,
  /Allsvenskan spelas första gången|Svenska cupen startar/i,
  /Henrik Larsson avgör i Barcelona/i,
  /Sverige slår ut Kanada i VM/i,
  /Sverige vinner VM-brons i fotboll efter seger mot Västtyskland/i,
  /Sverige tar OS-silver i damfotboll/i,
  /Tre Kronor vinner VM-guld.*Globen/i,
  /Tre Kronor vinner VM-guld hemma/i,
  /Tre Kronor vinner hockey-VM/i,
  /Tre Kronor vinner VM-guld/i,
  /^Tre Kronor tar OS-guld\n/iu,
  /Gunde Svan vinner OS-guld/i,
  /Charlotte Kalla vinner OS-guld/i,
  /Carolina Klüft vinner OS-guld/i,
  /Mats Sundin blir draftad först/i,
  /Annika Sörenstam blir världsstjärna/i,
  /Marta slår igenom i Sverige/i,
  /Pia Sundhage tar över landslaget|Pia Sundhage blir landslagsikon/i,
  /Lotta Schelin blir landslagsstjärna/i,
  /första fotbollslandskamp|Damallsvenskan startar|Umeå IK vinner/i,
  /blir världsstjärna|landslagsdebuterar|NHL-debuterar/i,
  /Sverige vinner OS-guld i fotboll/i,
  /Jonas Gardell slår igenom/i,
  /Petra Mede leder Melodifestivalen|Gina Dirawi leder Melodifestivalen/i,
  /Ulf Lundell romandebuterar|Okej börjar ges ut|ZTV börjar sända/i,
  /ABBA The Museum öppnar/i,
  /Avicii slår igenom/i,
  /Loreen vinner Eurovision igen/i,
  /Carola slår igenom/i,
  /Basshunter slår igenom/i,
  /Charlotte Perrelli vinner Eurovision/i,
  /Lisa Nilsson slår igenom/i,
  /blir (statsminister|partiledare|finansminister|talman|utrikesminister)/i,
  /Atlas Copco|LKAB|SKF|SCA|Boliden|Securitas|SSAB|Assa Abloy|Stora Enso|Skatteverket|Försäkringskassan/i,
  /Osmanska riket etableras|Tysk-romerska riket grundas|Bysantinska riket grundas|Brittiska imperiet grundas/i,
];

function isBlockedDeck(deckId: string): boolean {
  return BLOCKED_DECK_PATTERNS.some((pattern) => pattern.test(deckId));
}

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

function isThemeImageMismatch(deckId: string, card: Card): boolean {
  const image = card.image ?? "";
  const haystack = `${card.title}\n${card.subtitle ?? ""}\n${card.fact}`;

  if (/Disambig_grey\.svg/i.test(image)) return true;

  if (
    deckId === "all-sport-sportogonblick" &&
    /Olympic_flag\.svg/i.test(image) &&
    !/OS|olymp/i.test(haystack)
  ) {
    return true;
  }

  if (
    deckId === "all-entertainment-music" &&
    /ABBA_-_TopPop_1974_5\.png/i.test(image) &&
    !/ABBA|Mamma Mia/i.test(haystack)
  ) {
    return true;
  }

  if (
    deckId === "all-swedish-classics-all" &&
    /Flag_of_Sweden\.svg/i.test(image) &&
    !/Sverige|svensk/i.test(haystack)
  ) {
    return true;
  }

  return false;
}

function isCategoryMismatch(deckId: string, card: Card): boolean {
  if (deckId !== "all-leaders-rulers-europe-sweden") return false;

  const text = `${card.title}\n${card.subtitle ?? ""}`;
  return !/kung|drottning|regent|kronprinsess|kungligt slott|slottsteater/i.test(
    text,
  );
}

function dedupeCards(cards: Card[]): Card[] {
  const seen = new Set<string>();
  return cards.filter((card) => {
    const key = `${card.qid}:${card.year}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
    const curatedCards = isBlockedDeck(deckId)
      ? []
      : dedupeCards(
          cards.filter((card) => {
            return (
              (card.pageViews ?? 0) >= minPageViews &&
              !isBlocked(card) &&
              !isThemeImageMismatch(deckId, card) &&
              !isCategoryMismatch(deckId, card)
            );
          }),
        );

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
