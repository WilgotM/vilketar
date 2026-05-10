import { GameDifficulty } from "../types/game";
import { GameMode } from "../types/routes";
import { supabaseRest } from "./supabase";

type SaveRemoteScoreInput = {
  deckId?: string;
  deckTitle?: string;
  difficulty: GameDifficulty;
  mode: GameMode;
  resultPattern?: string;
  score: number;
};

export async function saveRemoteScore(input: SaveRemoteScoreInput) {
  await supabaseRest("leaderboard_scores", {
    body: {
      deck_id: input.deckId ?? null,
      deck_title: input.deckTitle ?? null,
      difficulty: input.difficulty,
      mode: input.mode === "free-play" ? "free-play" : "daily",
      result_pattern: input.resultPattern ?? null,
      score: input.score,
    },
    method: "POST",
  });
}
