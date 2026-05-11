import { PlayedCard } from "./cards";
import { GameState } from "./game";
import { SelectionRoute } from "./routes";

export interface PartyTeam {
  eliminated: boolean;
  id: string;
  mistakes: number;
  name: string;
}

export interface PartyTurnResult {
  correct: boolean;
  placedCard: PlayedCard;
  teamId: string;
  teamName: string;
}

export interface PartyGameState {
  activeTeamIndex: number;
  deckExhausted: boolean;
  game: GameState;
  lastResult: PartyTurnResult | null;
  teams: PartyTeam[];
  winnerTeamId: string | null;
}

export interface PartySetup {
  mode: "device" | "tv";
  seed: string;
  selectionRoute: SelectionRoute;
  teamNames: string[];
}
