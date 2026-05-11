import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createPartyGameState,
  getActivePartyTeam,
  placePartyCard,
} from "../lib/party-state";
import { PlayedCard } from "../types/cards";
import { GameState, PreparedCard } from "../types/game";
import { PartyGameState } from "../types/party";

function createCard(qid: string, year: number): PreparedCard {
  return {
    deckId: "test-deck",
    deckThemeHue: 120,
    fact: `${qid} fact`,
    id: `test-deck:${qid}`,
    image: "",
    pageViews: 1_000_000,
    qid,
    rank: 1,
    spacingBucket: 0,
    subtitle: "Testkort",
    title: `${qid} titel`,
    wikipediaSlug: qid,
    year,
    yearBucket: 0,
  };
}

function createPlayedCard(qid: string, year: number): PlayedCard {
  return {
    ...createCard(qid, year),
    played: {
      correct: true,
      placementIndex: 0,
      showDate: true,
    },
  };
}

function createGameState(next: PreparedCard | null): GameState {
  return {
    badlyPlaced: null,
    difficulty: "easy",
    imageCache: [],
    lives: 3,
    next,
    nextButOne: null,
    decks: [],
    played: [createPlayedCard("Q1900", 1900), createPlayedCard("Q1930", 1930)],
    random: () => 0,
    recentDeckIds: [],
    selectedRootDeck: null,
    usedQids: new Set<string>(),
    usedYears: new Set<number>(),
  };
}

function createPartyState(next: PreparedCard): PartyGameState {
  return createPartyGameState(createGameState(next), ["Lag 1", "Lag 2"]);
}

function withNext(state: PartyGameState, next: PreparedCard): PartyGameState {
  return {
    ...state,
    game: {
      ...state.game,
      next,
    },
    winnerTeamId: null,
  };
}

function withNextForTeam(
  state: PartyGameState,
  next: PreparedCard,
  activeTeamIndex: number,
): PartyGameState {
  return {
    ...withNext(state, next),
    activeTeamIndex,
  };
}

test("correct placement gives no mistake and advances the turn", () => {
  const state = createPartyState(createCard("Q1940", 1940));
  const nextState = placePartyCard(state, 2);

  assert.equal(nextState.lastResult?.correct, true);
  assert.equal(nextState.teams[0].mistakes, 0);
  assert.equal(getActivePartyTeam(nextState).name, "Lag 2");
});

test("incorrect placement adds one mistake and inserts card at the correct year", () => {
  const state = createPartyState(createCard("Q1910", 1910));
  const nextState = placePartyCard(state, 2);

  assert.equal(nextState.lastResult?.correct, false);
  assert.equal(nextState.teams[0].mistakes, 1);
  assert.deepEqual(
    nextState.game.played.map((card) => card.year),
    [1900, 1910, 1930],
  );
});

test("a team is eliminated after three mistakes", () => {
  let state = createPartyState(createCard("Q1910", 1910));

  state = placePartyCard(state, 2);
  state = placePartyCard(
    withNextForTeam(state, createCard("Q1911", 1911), 0),
    3,
  );
  state = placePartyCard(
    withNextForTeam(state, createCard("Q1912", 1912), 0),
    4,
  );

  assert.equal(state.teams[0].eliminated, true);
  assert.equal(state.teams[0].mistakes, 3);
});

test("eliminated teams are skipped", () => {
  const state = createPartyState(createCard("Q1910", 1910));
  const nextState = placePartyCard(
    {
      ...state,
      teams: [
        state.teams[0],
        { ...state.teams[1], eliminated: true, mistakes: 3 },
        { eliminated: false, id: "team-3", mistakes: 0, name: "Lag 3" },
      ],
    },
    2,
  );

  assert.equal(getActivePartyTeam(nextState).name, "Lag 3");
});

test("the game ends when only one team remains", () => {
  const state = createPartyState(createCard("Q1910", 1910));
  const nextState = placePartyCard(
    {
      ...state,
      teams: [{ ...state.teams[0], mistakes: 2 }, state.teams[1]],
    },
    2,
  );

  assert.equal(nextState.teams[0].eliminated, true);
  assert.equal(nextState.winnerTeamId, "team-2");
});
