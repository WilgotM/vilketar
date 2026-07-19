export const DAILY_TUTORIAL_STORAGE_KEY = "daily-game:tutorial:v1";
export const DAILY_SHARE_TUTORIAL_STORAGE_KEY = "daily-game:share-tutorial:v1";

export type DailyTutorialStatus = "completed" | "skipped";

export function loadDailyTutorialStatus(): DailyTutorialStatus | null {
  try {
    const value = window.localStorage.getItem(DAILY_TUTORIAL_STORAGE_KEY);
    return value === "completed" || value === "skipped" ? value : null;
  } catch {
    return null;
  }
}

export function saveDailyTutorialStatus(status: DailyTutorialStatus) {
  try {
    window.localStorage.setItem(DAILY_TUTORIAL_STORAGE_KEY, status);
  } catch {
    // Tutorialen ska aldrig kunna blockera spelet om lagring saknas.
  }
}

export function loadDailyShareTutorialStatus(): DailyTutorialStatus | null {
  try {
    const value = window.localStorage.getItem(DAILY_SHARE_TUTORIAL_STORAGE_KEY);
    return value === "completed" || value === "skipped" ? value : null;
  } catch {
    return null;
  }
}

export function saveDailyShareTutorialStatus(status: DailyTutorialStatus) {
  try {
    window.localStorage.setItem(DAILY_SHARE_TUTORIAL_STORAGE_KEY, status);
  } catch {
    // Delningsguiden ska aldrig kunna blockera resultatvyn.
  }
}

export function shouldStartDailyShareTutorial(
  status: DailyTutorialStatus | null,
): boolean {
  return status === null;
}

export function shouldStartDailyTutorial(input: {
  playedCardCount: number;
  restoredFromSnapshot: boolean;
  status: DailyTutorialStatus | null;
}): boolean {
  if (input.status !== null) {
    return false;
  }

  if (!input.restoredFromSnapshot) {
    return input.playedCardCount <= 1;
  }

  // Visa inte en ny guide mitt i ett spel som fortsatts från en annan enhet.
  return input.playedCardCount <= 1;
}
