import { GameDifficulty } from "../types/game";

function getHighscoreStorageKey(path: string, difficulty: GameDifficulty) {
  return `highscore:${path}:${difficulty}`;
}

export function loadHighscore(
  path: string,
  difficulty: GameDifficulty,
): number {
  try {
    const storedValue = Number(
      localStorage.getItem(getHighscoreStorageKey(path, difficulty)) ?? "0",
    );

    return Number.isFinite(storedValue) && storedValue >= 0
      ? Math.floor(storedValue)
      : 0;
  } catch {
    return 0;
  }
}

export function saveHighscore(
  path: string,
  difficulty: GameDifficulty,
  score: number,
) {
  try {
    localStorage.setItem(
      getHighscoreStorageKey(path, difficulty),
      String(score),
    );
  } catch {
    // High scores are optional and must not interrupt the game.
  }
}
