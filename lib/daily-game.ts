import { Card } from "../types/cards";
import { DeckNode } from "../types/decks";
import { GameDifficulty, GameState, PreparedCard } from "../types/game";
import { filterCardsByDifficulty, hasDeckForDifficulty } from "./create-state";
import {
  DAILY_OPENING_CARD_COUNT,
  normalizeDailyCardTitle,
} from "./daily-opening-protection";
import { DIFFICULTY_MIN_PAGE_VIEWS } from "./free-play-difficulty-rules";
import { preloadCard, prepareDecks } from "./game-selection";
import { createSeededRandom } from "./seeded-random";

export const DAILY_CARD_COUNT = 100;
const DAILY_MUSIC_SHARE = 0.1;
const MUSIC_DECK_ID = "all-entertainment-music";

export interface DailyOverride {
  cardQids: string[];
  cards?: Card[];
  dateKey: string;
}

export interface DailyQueueOptions {
  /** Cards that may not appear in the opening of today's daily queue. */
  openingExcludedQids?: ReadonlySet<string>;
  /** Visible question titles that may not appear in the opening. */
  openingExcludedTitles?: ReadonlySet<string>;
}

function shuffle<T>(entries: T[], random: () => number): T[] {
  const shuffled = [...entries];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function getAllEligibleCards(
  selectedRootDeck: DeckNode,
  cardsByDeckId: ReadonlyMap<string, Card[]>,
  difficulty: GameDifficulty,
  random: () => number,
): PreparedCard[] {
  const filteredCardsByDeckId = filterCardsByDifficulty(
    selectedRootDeck,
    difficulty,
    cardsByDeckId,
  );

  return prepareDecks(selectedRootDeck, filteredCardsByDeckId, random)
    .flatMap((deck) => deck.cards)
    .filter((card) => {
      return (
        card.pageViews !== null &&
        card.pageViews >= DIFFICULTY_MIN_PAGE_VIEWS[difficulty]
      );
    });
}

export function createDailySearchCards(
  selectedRootDeck: DeckNode,
  cardsByDeckId: ReadonlyMap<string, Card[]>,
  difficulty: GameDifficulty,
): PreparedCard[] {
  return uniqueDailyCandidates(
    getAllEligibleCards(
      selectedRootDeck,
      cardsByDeckId,
      difficulty,
      createSeededRandom("daily-search"),
    ),
  )
    .filter((card) => isDailyEditorialCard(card, selectedRootDeck))
    .sort((left, right) => {
      const leftViews = left.pageViews ?? 0;
      const rightViews = right.pageViews ?? 0;
      return (
        rightViews - leftViews || left.title.localeCompare(right.title, "sv")
      );
    });
}

function uniqueDailyCandidates(cards: PreparedCard[]): PreparedCard[] {
  const usedQids = new Set<string>();
  const usedTitles = new Set<string>();
  return cards.filter((card) => {
    const titleKey = normalizeDailyCardTitle(card.title);
    if (usedQids.has(card.qid) || usedTitles.has(titleKey)) {
      return false;
    }
    usedQids.add(card.qid);
    usedTitles.add(titleKey);
    return true;
  });
}

function mixDefaultDailyCandidates(
  cards: PreparedCard[],
  selectedRootDeck: DeckNode,
  random: () => number,
): PreparedCard[] {
  if (selectedRootDeck.id !== "all") {
    return shuffle(cards, random);
  }

  const musicCards = cards.filter((card) => card.deckId === MUSIC_DECK_ID);
  const otherCards = cards.filter((card) => card.deckId !== MUSIC_DECK_ID);
  const remainingMusicCards = shuffle(musicCards, random);
  const remainingOtherCards = shuffle(otherCards, random);
  const selectedCards: PreparedCard[] = [];

  while (
    selectedCards.length < DAILY_CARD_COUNT &&
    (remainingMusicCards.length > 0 || remainingOtherCards.length > 0)
  ) {
    const preferMusic = random() < DAILY_MUSIC_SHARE;
    const preferredCards = preferMusic
      ? remainingMusicCards
      : remainingOtherCards;
    const fallbackCards = preferMusic
      ? remainingOtherCards
      : remainingMusicCards;
    const card = preferredCards.pop() ?? fallbackCards.pop();

    if (card) {
      selectedCards.push(card);
    }
  }

  return shuffle(selectedCards, random);
}

function isDailyEditorialCard(
  card: PreparedCard,
  selectedRootDeck: DeckNode,
): boolean {
  // The themed daily decks are curated separately. The editorial filter is
  // only for the broad default deck, where the raw Wikimedia pool is widest.
  if (selectedRootDeck.id !== "all") {
    return true;
  }

  // These sources are useful in free play, but are too database-like for the
  // welcoming, cross-generational daily game.
  if (
    card.deckId.startsWith("all-people-famous-deaths-") ||
    card.deckId.startsWith("all-leaders-") ||
    card.deckId.startsWith("all-engineering-") ||
    card.deckId.startsWith("all-technology-") ||
    card.deckId === "all-sport-teams" ||
    card.deckId === "all-sport-stadiums"
  ) {
    return false;
  }

  // Keep the occasional iconic event, while dropping technical catalogue
  // entries that are hard to recognise around a family table.
  return !/(?:första flygningen|flyger för första gången|franchise grundas|F\.C\.|Club de Fútbol)/iu.test(
    card.title,
  );
}

function getSpacingBucket(year: number): number {
  if (year >= 1950) {
    return 0;
  }
  if (year >= 1850) {
    return 1;
  }
  if (year >= 1500) {
    return 2;
  }
  if (year >= 500) {
    return 3;
  }
  return 4;
}

function prepareOverrideCards(
  selectedRootDeck: DeckNode,
  cards: readonly Card[],
  difficulty: GameDifficulty,
): PreparedCard[] {
  return cards
    .filter((card) => {
      return (
        card.pageViews !== null &&
        card.pageViews >= DIFFICULTY_MIN_PAGE_VIEWS[difficulty]
      );
    })
    .map((card, index) => ({
      ...card,
      deckId: selectedRootDeck.id,
      deckThemeHue: selectedRootDeck.themeHue,
      id: `daily-override:${card.qid}:${index}`,
      rank: index + 1,
      spacingBucket: getSpacingBucket(card.year),
      yearBucket: 0,
    }));
}

export function createDailyCardQueue(
  selectedRootDeck: DeckNode,
  cardsByDeckId: ReadonlyMap<string, Card[]>,
  difficulty: GameDifficulty,
  dateKey: string,
  override?: DailyOverride | null,
  options: DailyQueueOptions = {},
): PreparedCard[] {
  const random = createSeededRandom(`daily:${dateKey}`);
  const allCards = uniqueDailyCandidates(
    getAllEligibleCards(selectedRootDeck, cardsByDeckId, difficulty, random),
  ).filter((card) => isDailyEditorialCard(card, selectedRootDeck));
  const dailyCandidates = mixDefaultDailyCandidates(
    allCards,
    selectedRootDeck,
    random,
  );
  const cardsByQid = new Map(allCards.map((card) => [card.qid, card]));
  const snapshotOverrideCards = override?.cards
    ? prepareOverrideCards(selectedRootDeck, override.cards, difficulty)
    : [];
  const qidOverrideCards =
    override?.cardQids
      .map((qid) => cardsByQid.get(qid) ?? null)
      .filter((card): card is PreparedCard => card !== null) ?? [];
  const overrideCards =
    snapshotOverrideCards.length > 0 ? snapshotOverrideCards : qidOverrideCards;
  const selectedCards: PreparedCard[] = [];
  const usedQids = new Set<string>();

  const addCard = (card: PreparedCard): void => {
    if (usedQids.has(card.qid) || selectedCards.length >= DAILY_CARD_COUNT) {
      return;
    }

    selectedCards.push(card);
    usedQids.add(card.qid);
  };

  // A deliberate admin override is authoritative and stays at the front.
  for (const card of overrideCards) {
    addCard(card);
  }

  const openingSlots = Math.max(
    0,
    DAILY_OPENING_CARD_COUNT - selectedCards.length,
  );
  const openingExcludedTitles = options.openingExcludedTitles
    ? new Set(
        Array.from(options.openingExcludedTitles, normalizeDailyCardTitle),
      )
    : undefined;
  const isExcludedFromOpening = (card: PreparedCard): boolean => {
    return (
      options.openingExcludedQids?.has(card.qid) ||
      openingExcludedTitles?.has(normalizeDailyCardTitle(card.title)) ||
      false
    );
  };
  const openingCandidates = shuffle(
    dailyCandidates.filter(
      (card) => !usedQids.has(card.qid) && !isExcludedFromOpening(card),
    ),
    random,
  );

  for (const card of openingCandidates.slice(0, openingSlots)) {
    addCard(card);
  }

  // This should only be needed if a deck becomes unusually small. It keeps a
  // playable queue instead of failing the daily game.
  if (selectedCards.length < DAILY_OPENING_CARD_COUNT) {
    for (const card of shuffle(dailyCandidates, random)) {
      addCard(card);
      if (selectedCards.length >= DAILY_OPENING_CARD_COUNT) {
        break;
      }
    }
  }

  // Recent opening cards are deliberately allowed back from position 21.
  for (const card of shuffle(dailyCandidates, random)) {
    addCard(card);
  }

  return selectedCards;
}

export async function createDailyGameState(
  selectedRootDeck: DeckNode,
  cardsByDeckId: ReadonlyMap<string, Card[]>,
  difficulty: GameDifficulty,
  dateKey: string,
  override?: DailyOverride | null,
  options: DailyQueueOptions = {},
): Promise<GameState> {
  const dailyQueue = createDailyCardQueue(
    selectedRootDeck,
    cardsByDeckId,
    difficulty,
    dateKey,
    override,
    options,
  );
  const [firstCard, secondCard, ...remainingCards] = dailyQueue;

  if (!firstCard || !secondCard) {
    throw new Error("Not enough valid cards to start a daily game");
  }

  if (!hasDeckForDifficulty(selectedRootDeck, difficulty, cardsByDeckId)) {
    throw new Error("No valid cards available for this deck and difficulty");
  }

  const random = createSeededRandom(`daily-state:${dateKey}`);
  const filteredCardsByDeckId = filterCardsByDifficulty(
    selectedRootDeck,
    difficulty,
    cardsByDeckId,
  );

  return {
    badlyPlaced: null,
    decks: prepareDecks(selectedRootDeck, filteredCardsByDeckId, random),
    difficulty,
    dailyQueue: remainingCards,
    imageCache: [preloadCard(firstCard), preloadCard(secondCard)],
    lives: 3,
    next: firstCard,
    nextButOne: secondCard,
    played: [],
    random,
    recentDeckIds: [],
    selectedRootDeck,
    usedQids: new Set([firstCard.qid, secondCard.qid]),
    usedYears: new Set([firstCard.year, secondCard.year]),
  };
}
