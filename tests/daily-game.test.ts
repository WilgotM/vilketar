import assert from "node:assert/strict";
import { test } from "node:test";
import { createDailyCardQueue, DAILY_CARD_COUNT } from "../lib/daily-game";
import { Card } from "../types/cards";
import { DeckNode } from "../types/decks";

const deck: DeckNode = {
  difficultyCounts: {
    easy: 5,
    hard: 5,
    normal: 5,
  },
  frequency: 1,
  id: "daily-test",
  minScore: 0,
  slug: "daily-test",
  themeHue: 0,
  title: "Daily Test",
};

function card(qid: string, title: string, year: number): Card {
  return {
    fact: `${title} händer.`,
    image: `${qid}.jpg`,
    pageViews: 100_000,
    qid,
    subtitle: null,
    title,
    wikipediaSlug: title.replace(/\s+/g, "_"),
    year,
  };
}

const cardsByDeckId = new Map<string, Card[]>([
  [
    deck.id,
    [
      card("Q1", "Kort A", 1901),
      card("Q2", "Kort B", 1902),
      card("Q3", "Kort C", 1903),
      card("Q4", "Kort D", 1904),
      card("Q5", "Kort A", 1905),
    ],
  ],
]);

test("daily queue is stable for the same date and changes across dates", () => {
  const first = createDailyCardQueue(deck, cardsByDeckId, "hard", "2026-05-23");
  const second = createDailyCardQueue(
    deck,
    cardsByDeckId,
    "hard",
    "2026-05-23",
  );
  const nextDay = createDailyCardQueue(
    deck,
    cardsByDeckId,
    "hard",
    "2026-05-24",
  );

  assert.deepEqual(
    first.map((entry) => entry.qid),
    second.map((entry) => entry.qid),
  );
  assert.notDeepEqual(
    first.map((entry) => entry.qid),
    nextDay.map((entry) => entry.qid),
  );
});

test("daily queue avoids repeated visible titles", () => {
  const queue = createDailyCardQueue(deck, cardsByDeckId, "hard", "2026-05-23");
  const titles = queue.map((entry) => entry.title);

  assert.equal(titles.filter((title) => title === "Kort A").length, 1);
});

test("daily queue allows different cards from the same year", () => {
  const queue = createDailyCardQueue(
    deck,
    new Map([
      [deck.id, [card("Q1", "Kort A", 1958), card("Q2", "Kort B", 1958)]],
    ]),
    "hard",
    "2026-05-23",
  );

  assert.deepEqual(queue.map((entry) => entry.qid).sort(), ["Q1", "Q2"]);
});

test("daily override places chosen cards first", () => {
  const queue = createDailyCardQueue(
    deck,
    cardsByDeckId,
    "hard",
    "2026-05-23",
    {
      cardQids: ["Q3", "Q2"],
      dateKey: "2026-05-23",
    },
  );

  assert.deepEqual(
    queue.slice(0, 2).map((entry) => entry.qid),
    ["Q3", "Q2"],
  );
});

test("daily queue keeps recent opening cards out of the opening", () => {
  const queue = createDailyCardQueue(
    deck,
    cardsByDeckId,
    "hard",
    "2026-05-23",
    null,
    { openingExcludedQids: new Set(["Q1", "Q2", "Q3"]) },
  );

  assert.ok(!["Q1", "Q2", "Q3"].includes(queue[0]?.qid ?? ""));
});

test("daily queue keeps recent cards out of the opening when fresh cards exist", () => {
  const cards = Array.from({ length: DAILY_CARD_COUNT + 20 }, (_, index) => {
    const number = index + 1;
    return card(`Q${number}`, `Kort ${number}`, 1900 + number);
  });
  const recentQids = new Set(cards.slice(0, 10).map((entry) => entry.qid));

  const queue = createDailyCardQueue(
    deck,
    new Map([[deck.id, cards]]),
    "hard",
    "2026-05-23",
    null,
    { openingExcludedQids: recentQids },
  );

  assert.ok(queue.slice(0, 20).every((entry) => !recentQids.has(entry.qid)));
  assert.ok(queue.slice(20).some((entry) => recentQids.has(entry.qid)));
});

test("daily queue protects a repeated visible title in the opening", () => {
  const cards = Array.from({ length: 25 }, (_, index) => {
    const number = index + 1;
    return card(`Q${number}`, `Kort ${number}`, 1900 + number);
  });

  const queue = createDailyCardQueue(
    deck,
    new Map([[deck.id, cards]]),
    "hard",
    "2026-05-23",
    null,
    { openingExcludedTitles: new Set(["  kOrT   1 "]) },
  );

  assert.ok(queue.slice(0, 20).every((entry) => entry.title !== "Kort 1"));
  assert.ok(queue.slice(20).some((entry) => entry.title === "Kort 1"));
});
