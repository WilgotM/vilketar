import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getLeagueTieBreak,
  rankLeagueEntries,
  type LeagueRankingEntry,
} from "../lib/league-ranking";

function entry(
  displayName: string,
  weekScore: number,
  scoreCard: number[],
  lastCompletedAt: string,
): LeagueRankingEntry {
  return { displayName, lastCompletedAt, scoreCard, weekScore };
}

test("league ranking uses the best daily result when weekly scores tie", () => {
  const wilgot = entry(
    "Wilgot",
    49,
    [12, 8, 8, 7, 5, 5, 4],
    "2026-08-16T11:02:56Z",
  );
  const jonas = entry(
    "JonasM",
    49,
    [11, 8, 8, 6, 6, 5, 5],
    "2026-08-16T11:30:15Z",
  );

  assert.deepEqual(
    rankLeagueEntries([jonas, wilgot]).map(({ displayName }) => displayName),
    ["Wilgot", "JonasM"],
  );
  assert.deepEqual(getLeagueTieBreak(wilgot, jonas), {
    detail: "bästa dagsresultatet var 12 mot 11",
    shortDetail: "bästa dag 12–11",
  });
});

test("league ranking compares the next-best result when the best result ties", () => {
  const anna = entry("Anna", 20, [10, 7, 3], "2026-08-16T12:00:00Z");
  const bo = entry("Bo", 20, [10, 6, 4], "2026-08-16T11:00:00Z");

  assert.equal(rankLeagueEntries([bo, anna])[0]?.displayName, "Anna");
  assert.equal(
    getLeagueTieBreak(anna, bo)?.detail,
    "näst bästa dagsresultatet var 7 mot 6",
  );
});

test("league ranking uses completion time only for identical score cards", () => {
  const early = entry("Östen", 20, [10, 6, 4], "2026-08-16T10:00:00Z");
  const late = entry("Anna", 20, [10, 6, 4], "2026-08-16T11:00:00Z");

  assert.equal(rankLeagueEntries([late, early])[0]?.displayName, "Östen");
  assert.equal(getLeagueTieBreak(early, late)?.shortDetail, "blev klar först");
});

test("league tie-break explanation is omitted when total scores differ", () => {
  const winner = entry("Anna", 21, [10, 7, 4], "2026-08-16T10:00:00Z");
  const runnerUp = entry("Bo", 20, [12, 8], "2026-08-16T09:00:00Z");

  assert.equal(getLeagueTieBreak(winner, runnerUp), null);
});
