import { DailyGameSnapshot } from "../types/routes";

const DAILY_SNAPSHOT_STORAGE_KEY = "daily:snapshot";
const DAILY_PROGRESS_STORAGE_PREFIX = "daily:progress-started:";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPreparedCard(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.deckId === "string" &&
    typeof value.qid === "string" &&
    typeof value.title === "string" &&
    typeof value.year === "number" &&
    Number.isFinite(value.year)
  );
}

function isPlayedCard(value: unknown): boolean {
  if (!isPreparedCard(value) || !isRecord(value)) {
    return false;
  }

  const played = value.played;
  return (
    isRecord(played) &&
    typeof played.correct === "boolean" &&
    typeof played.showDate === "boolean"
  );
}

export function loadDailyGameSnapshot(): DailyGameSnapshot | null {
  try {
    const rawValue = localStorage.getItem(DAILY_SNAPSHOT_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as unknown;
    if (!isRecord(parsed)) {
      return null;
    }

    const typedSnapshot = parsed as unknown as DailyGameSnapshot;
    const deckCursors = Array.isArray(
      (typedSnapshot as DailyGameSnapshot & { packCursors?: unknown[] })
        .deckCursors,
    )
      ? typedSnapshot.deckCursors
      : Array.isArray(
            (typedSnapshot as DailyGameSnapshot & { packCursors?: unknown[] })
              .packCursors,
          )
        ? ((
            typedSnapshot as DailyGameSnapshot & {
              packCursors?: typeof typedSnapshot.deckCursors;
            }
          ).packCursors ?? [])
        : null;
    const recentDeckIds =
      typedSnapshot.recentDeckIds ??
      (typedSnapshot as DailyGameSnapshot & { recentPackIds?: string[] })
        .recentPackIds ??
      [];
    if (
      typeof typedSnapshot.dateKey !== "string" ||
      !Number.isInteger(typedSnapshot.lives) ||
      typedSnapshot.lives < 0 ||
      typedSnapshot.lives > 3 ||
      deckCursors === null ||
      !deckCursors.every(
        (deck) =>
          isRecord(deck) &&
          typeof deck.id === "string" &&
          Number.isInteger(deck.drawCursor) &&
          deck.drawCursor >= 0,
      ) ||
      !Array.isArray(typedSnapshot.played) ||
      !typedSnapshot.played.every(isPlayedCard) ||
      (typedSnapshot.lives < 3 && typedSnapshot.played.length === 0) ||
      (typedSnapshot.next !== null && !isPreparedCard(typedSnapshot.next)) ||
      (typedSnapshot.nextButOne !== null &&
        !isPreparedCard(typedSnapshot.nextButOne)) ||
      (typedSnapshot.dailyQueue !== undefined &&
        (!Array.isArray(typedSnapshot.dailyQueue) ||
          !typedSnapshot.dailyQueue.every(isPreparedCard))) ||
      (typedSnapshot.randomState !== null &&
        typedSnapshot.randomState !== undefined &&
        (typeof typedSnapshot.randomState !== "number" ||
          !Number.isFinite(typedSnapshot.randomState))) ||
      !Array.isArray(recentDeckIds) ||
      !recentDeckIds.every((deckId) => typeof deckId === "string")
    ) {
      return null;
    }

    return {
      ...typedSnapshot,
      deckCursors,
      randomState: typedSnapshot.randomState ?? null,
      recentDeckIds,
    };
  } catch {
    return null;
  }
}

export function saveDailyGameSnapshot(snapshot: DailyGameSnapshot) {
  try {
    localStorage.setItem(DAILY_SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // The game can continue in memory when storage is unavailable or full.
  }
}

export function clearDailyGameSnapshot() {
  try {
    localStorage.removeItem(DAILY_SNAPSHOT_STORAGE_KEY);
  } catch {
    // Nothing else is required when storage is unavailable.
  }
}

export function hasStartedDailyGameProgress(dateKey: string): boolean {
  try {
    return (
      localStorage.getItem(`${DAILY_PROGRESS_STORAGE_PREFIX}${dateKey}`) ===
      "true"
    );
  } catch {
    return false;
  }
}

export function markStartedDailyGameProgress(dateKey: string) {
  try {
    localStorage.setItem(`${DAILY_PROGRESS_STORAGE_PREFIX}${dateKey}`, "true");
  } catch {
    // Progress markers are optional and must not interrupt the game.
  }
}
