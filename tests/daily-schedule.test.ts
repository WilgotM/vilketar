import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getDailyScheduleTheme,
  getDailyScheduleWeek,
  getDailyScheduleWeekday,
} from "../lib/daily-schedule";

test("daily schedule assigns recurring theme days", () => {
  assert.deepEqual(getDailyScheduleTheme("2026-05-26"), {
    deckId: "all-sport-sportogonblick",
    label: "Sport",
    shortLabel: "Sport",
  });
  assert.deepEqual(getDailyScheduleTheme("2026-05-29"), {
    deckId: "all-entertainment-music",
    label: "Musik",
    shortLabel: "Musik",
  });
  assert.deepEqual(getDailyScheduleTheme("2026-05-30"), {
    deckId: "all-swedish-classics-all",
    label: "Svenska klassiker",
    shortLabel: "Klassiker",
  });
});

test("daily schedule keeps ordinary days on the full deck", () => {
  assert.deepEqual(getDailyScheduleTheme("2026-05-27"), {
    deckId: null,
    label: "Vanligt",
    shortLabel: "Vanligt",
  });
});

test("daily schedule week is shown from monday to sunday", () => {
  assert.deepEqual(
    getDailyScheduleWeek().map((day) => day.dayLabel),
    ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"],
  );
  assert.equal(getDailyScheduleWeekday("2026-05-30"), 6);
});
