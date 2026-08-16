export type LeagueRankingEntry = {
  displayName: string;
  lastCompletedAt: string | null;
  scoreCard: number[];
  weekScore: number;
};

export type LeagueTieBreak = {
  detail: string;
  shortDetail: string;
};

const scorePositionLabels = [
  "bästa",
  "näst bästa",
  "tredje bästa",
  "fjärde bästa",
  "femte bästa",
  "sjätte bästa",
  "sjunde bästa",
];

function normalizedScoreCard(entry: LeagueRankingEntry): number[] {
  return [...(entry.scoreCard ?? [])].sort((left, right) => right - left);
}

function compareScoreCards(
  left: LeagueRankingEntry,
  right: LeagueRankingEntry,
): number {
  const leftScores = normalizedScoreCard(left);
  const rightScores = normalizedScoreCard(right);
  const scoreCount = Math.max(leftScores.length, rightScores.length);

  for (let index = 0; index < scoreCount; index += 1) {
    const difference = (rightScores[index] ?? -1) - (leftScores[index] ?? -1);
    if (difference !== 0) {
      return difference;
    }
  }

  return 0;
}

function completedAtValue(value: string | null): number {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

export function compareLeagueEntries(
  left: LeagueRankingEntry,
  right: LeagueRankingEntry,
): number {
  return (
    right.weekScore - left.weekScore ||
    compareScoreCards(left, right) ||
    completedAtValue(left.lastCompletedAt) -
      completedAtValue(right.lastCompletedAt) ||
    left.displayName.localeCompare(right.displayName, "sv")
  );
}

export function rankLeagueEntries<T extends LeagueRankingEntry>(
  entries: T[],
): T[] {
  return [...entries].sort(compareLeagueEntries);
}

export function getLeagueTieBreak(
  winner: LeagueRankingEntry,
  runnerUp: LeagueRankingEntry | null,
): LeagueTieBreak | null {
  if (!runnerUp || winner.weekScore !== runnerUp.weekScore) {
    return null;
  }

  const winnerScores = normalizedScoreCard(winner);
  const runnerUpScores = normalizedScoreCard(runnerUp);
  const scoreCount = Math.max(winnerScores.length, runnerUpScores.length);

  for (let index = 0; index < scoreCount; index += 1) {
    const winnerScore = winnerScores[index] ?? -1;
    const runnerUpScore = runnerUpScores[index] ?? -1;
    if (winnerScore === runnerUpScore) {
      continue;
    }

    const positionLabel =
      scorePositionLabels[index] ?? `dagresultat ${index + 1}`;
    return {
      detail: `${positionLabel} dagsresultatet var ${winnerScore} mot ${runnerUpScore}`,
      shortDetail: `${positionLabel} dag ${winnerScore}–${runnerUpScore}`,
    };
  }

  if (
    completedAtValue(winner.lastCompletedAt) !==
    completedAtValue(runnerUp.lastCompletedAt)
  ) {
    return {
      detail: "sista spelet avslutades först efter en identisk resultatrad",
      shortDetail: "blev klar först",
    };
  }

  return {
    detail: "namnordning avgjorde efter identisk resultatrad och sluttid",
    shortDetail: "namnordning avgjorde",
  };
}
