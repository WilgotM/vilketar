import { Card } from "../types/cards";
import { DeckNode } from "../types/decks";
import { GameDifficulty, GameState, PreparedCard } from "../types/game";
import { filterCardsByDifficulty, hasDeckForDifficulty } from "./create-state";
import { DIFFICULTY_MIN_PAGE_VIEWS } from "./free-play-difficulty-rules";
import { preloadImage, prepareDecks } from "./game-selection";
import { createSeededRandom } from "./seeded-random";

export const DAILY_CARD_COUNT = 100;

export interface DailyOverride {
  cardQids: string[];
  dateKey: string;
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
  ).sort((left, right) => {
    const leftViews = left.pageViews ?? 0;
    const rightViews = right.pageViews ?? 0;
    return (
      rightViews - leftViews || left.title.localeCompare(right.title, "sv")
    );
  });
}

function normalizeVisibleTitle(title: string): string {
  return title.trim().replace(/\s+/g, " ").toLocaleLowerCase("sv-SE");
}

function uniqueDailyCandidates(cards: PreparedCard[]): PreparedCard[] {
  const usedQids = new Set<string>();
  const usedTitles = new Set<string>();
  return cards.filter((card) => {
    const titleKey = normalizeVisibleTitle(card.title);
    if (usedQids.has(card.qid) || usedTitles.has(titleKey)) {
      return false;
    }
    usedQids.add(card.qid);
    usedTitles.add(titleKey);
    return true;
  });
}

export function createDailyCardQueue(
  selectedRootDeck: DeckNode,
  cardsByDeckId: ReadonlyMap<string, Card[]>,
  difficulty: GameDifficulty,
  dateKey: string,
  override?: DailyOverride | null,
): PreparedCard[] {
  const random = createSeededRandom(`daily:${dateKey}`);
  const allCards = uniqueDailyCandidates(
    getAllEligibleCards(selectedRootDeck, cardsByDeckId, difficulty, random),
  );
  const cardsByQid = new Map(allCards.map((card) => [card.qid, card]));
  const overrideCards =
    override?.cardQids
      .map((qid) => cardsByQid.get(qid) ?? null)
      .filter((card): card is PreparedCard => card !== null) ?? [];
  const shuffledCards = shuffle(allCards, random);
  const selectedCards: PreparedCard[] = [];
  const usedQids = new Set<string>();
  const usedYears = new Set<number>();

  for (const card of [...overrideCards, ...shuffledCards]) {
    if (usedQids.has(card.qid) || usedYears.has(card.year)) {
      continue;
    }

    selectedCards.push(card);
    usedQids.add(card.qid);
    usedYears.add(card.year);

    if (selectedCards.length >= DAILY_CARD_COUNT) {
      break;
    }
  }

  return selectedCards;
}

export async function createDailyGameState(
  selectedRootDeck: DeckNode,
  cardsByDeckId: ReadonlyMap<string, Card[]>,
  difficulty: GameDifficulty,
  dateKey: string,
  override?: DailyOverride | null,
): Promise<GameState> {
  const dailyQueue = createDailyCardQueue(
    selectedRootDeck,
    cardsByDeckId,
    difficulty,
    dateKey,
    override,
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
    imageCache: [preloadImage(firstCard.image), preloadImage(secondCard.image)],
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
