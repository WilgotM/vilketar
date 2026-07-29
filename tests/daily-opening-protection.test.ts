import assert from "node:assert/strict";
import { test } from "node:test";
import { getUtcDateKeyDaysBefore } from "../lib/daily";
import {
  createDailyOpeningProtection,
  DAILY_OPENING_CARD_COUNT,
  normalizeDailyCardTitle,
} from "../lib/daily-opening-protection";

test("daily opening protection only includes the first twenty cards", () => {
  const cardQids = Array.from(
    { length: DAILY_OPENING_CARD_COUNT + 1 },
    (_, index) => `Q${index + 1}`,
  );
  const protection = createDailyOpeningProtection([
    {
      card_qids: cardQids,
      card_snapshots: cardQids.map((qid, index) => ({
        qid,
        title: `Kort ${index + 1}`,
      })),
    },
  ]);

  assert.equal(protection.qids.size, DAILY_OPENING_CARD_COUNT);
  assert.equal(protection.titles.size, DAILY_OPENING_CARD_COUNT);
  assert.ok(protection.qids.has("Q20"));
  assert.ok(!protection.qids.has("Q21"));
  assert.ok(protection.titles.has("kort 20"));
  assert.ok(!protection.titles.has("kort 21"));
});

test("daily opening protection normalizes visible titles", () => {
  assert.equal(
    normalizeDailyCardTitle("  En   Svensk  Fråga "),
    "en svensk fråga",
  );
});

test("daily opening cooldown includes the previous occurrence of a weekday", () => {
  assert.equal(getUtcDateKeyDaysBefore("2026-07-28", 7), "2026-07-21");
});
