import { PlayedCard } from "../types/cards";
import { GameState, PreparedCard } from "../types/game";
import { PartyGameState, PartyTeam } from "../types/party";
import { checkCorrect, drawNextCard, preloadCard } from "./game-selection";

const MAX_MISTAKES = 3;

function cloneGameForUpdate(game: GameState): GameState {
  return {
    ...game,
    decks: game.decks.map((deck) => ({
      ...deck,
      cards: deck.cards,
    })),
    played: [...game.played],
    recentDeckIds: [...game.recentDeckIds],
    usedQids: new Set(game.usedQids),
    usedYears: new Set(game.usedYears),
  };
}

function toPlayedCard(
  card: PreparedCard,
  correct: boolean,
  placementIndex: number,
): PlayedCard {
  return {
    ...card,
    played: {
      correct,
      justPlaced: true,
      placementIndex,
      showDate: true,
    },
  };
}

function getNextPlacementIndex(played: PlayedCard[]): number {
  return (
    played.reduce((maxPlacementIndex, card, index) => {
      return Math.max(maxPlacementIndex, card.played.placementIndex ?? index);
    }, -1) + 1
  );
}

function countActiveTeams(teams: PartyTeam[]): number {
  return teams.filter((team) => !team.eliminated).length;
}

function findWinnerTeamId(teams: PartyTeam[]): string | null {
  const activeTeams = teams.filter((team) => !team.eliminated);
  return activeTeams.length === 1 ? activeTeams[0].id : null;
}

function getNextActiveTeamIndex(
  teams: PartyTeam[],
  currentIndex: number,
): number {
  if (countActiveTeams(teams) <= 1) {
    return currentIndex;
  }

  for (let offset = 1; offset <= teams.length; offset += 1) {
    const index = (currentIndex + offset) % teams.length;
    if (!teams[index].eliminated) {
      return index;
    }
  }

  return currentIndex;
}

function drawUpcomingCards(game: GameState): {
  deckExhausted: boolean;
  game: GameState;
} {
  const next = game.nextButOne;
  const nextGame: GameState = {
    ...game,
    imageCache: [],
    next,
    nextButOne: null,
  };
  const nextButOne = drawNextCard(nextGame);

  return {
    deckExhausted: next === null && nextButOne === null,
    game: {
      ...nextGame,
      imageCache: [
        next ? preloadCard(next) : null,
        nextButOne ? preloadCard(nextButOne) : null,
      ].filter((image): image is HTMLImageElement => image !== null),
      nextButOne,
    },
  };
}

export function normalizePartyTeamNames(
  teamNames: readonly string[],
): string[] {
  return teamNames
    .map((teamName) => teamName.trim())
    .filter((teamName) => teamName.length > 0)
    .slice(0, 8);
}

export function createPartyGameState(
  game: GameState,
  teamNames: readonly string[],
): PartyGameState {
  const normalizedTeamNames = normalizePartyTeamNames(teamNames);
  const teams = normalizedTeamNames.map((name, index) => ({
    eliminated: false,
    id: `team-${index + 1}`,
    mistakes: 0,
    name,
  }));

  if (teams.length < 2) {
    throw new Error("Party mode needs at least two teams");
  }

  let seededGame = cloneGameForUpdate(game);
  let deckExhausted = seededGame.next === null;

  if (seededGame.played.length === 0 && seededGame.next) {
    const openingCard = toPlayedCard(seededGame.next, true, 0);
    seededGame = {
      ...seededGame,
      played: [openingCard],
    };
    const drawn = drawUpcomingCards(seededGame);
    seededGame = drawn.game;
    deckExhausted = drawn.deckExhausted;
  }

  return {
    activeTeamIndex: 0,
    deckExhausted,
    game: seededGame,
    lastResult: null,
    teams,
    winnerTeamId: null,
  };
}

export function placePartyCard(
  state: PartyGameState,
  requestedIndex: number,
): PartyGameState {
  const currentCard = state.game.next;
  const currentTeam = state.teams[state.activeTeamIndex];

  if (
    !currentCard ||
    !currentTeam ||
    currentTeam.eliminated ||
    state.winnerTeamId !== null
  ) {
    return state;
  }

  const clampedIndex = Math.max(
    0,
    Math.min(state.game.played.length, requestedIndex),
  );
  const game = cloneGameForUpdate(state.game);
  const played = [...game.played];
  const { correct, delta } = checkCorrect(played, currentCard, clampedIndex);
  const finalIndex = correct ? clampedIndex : clampedIndex + delta;
  const placedCard = toPlayedCard(
    currentCard,
    correct,
    getNextPlacementIndex(played),
  );

  played.splice(finalIndex, 0, placedCard);

  const teams = state.teams.map((team, index) => {
    if (index !== state.activeTeamIndex || correct) {
      return team;
    }

    const mistakes = team.mistakes + 1;
    return {
      ...team,
      eliminated: mistakes >= MAX_MISTAKES,
      mistakes,
    };
  });
  const drawn = drawUpcomingCards({
    ...game,
    badlyPlaced: null,
    imageCache: [],
    next: null,
    nextButOne: game.nextButOne,
    played,
  });
  const winnerTeamId = findWinnerTeamId(teams);

  return {
    activeTeamIndex:
      winnerTeamId === null
        ? getNextActiveTeamIndex(teams, state.activeTeamIndex)
        : state.activeTeamIndex,
    deckExhausted: drawn.deckExhausted,
    game: drawn.game,
    lastResult: {
      correct,
      placedCard,
      teamId: currentTeam.id,
      teamName: currentTeam.name,
    },
    teams,
    winnerTeamId,
  };
}

export function getActivePartyTeam(state: PartyGameState): PartyTeam {
  return state.teams[state.activeTeamIndex];
}
