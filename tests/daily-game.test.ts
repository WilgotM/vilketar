import assert from "node:assert/strict";
import { test } from "node:test";
import { createDailyCardQueue } from "../lib/daily-game";
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

test("daily queue prefers cards that were not used recently", () => {
  const queue = createDailyCardQueue(
    deck,
    cardsByDeckId,
    "hard",
    "2026-05-23",
    null,
    { excludedQids: new Set(["Q1", "Q2", "Q3"]) },
  );

  assert.ok(!["Q1", "Q2", "Q3"].includes(queue[0]?.qid ?? ""));
});
