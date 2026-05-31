import { PlayedCard } from "../types/cards";
import { GameDifficulty } from "../types/game";
import { GameMode, SelectionRoute } from "../types/routes";
import { getSelectionRouteShareLabel } from "./categories";
import { DEFAULT_SITE_URL } from "./seo";

const PRODUCTION_ORIGIN = DEFAULT_SITE_URL;
const SHARE_BRAND_LABEL = "#VilketÅr";
const SHARE_RESULT_CORRECT = "🟩";
const SHARE_RESULT_INCORRECT = "🟥";

export function getDifficultyLabel(difficulty: GameDifficulty): string {
  if (difficulty === "easy") {
    return "Lätt";
  }

  if (difficulty === "normal") {
    return "Normal";
  }

  return "Svår";
}

function getShareOrigin(): string {
  if (typeof window === "undefined") {
    return PRODUCTION_ORIGIN;
  }

  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return PRODUCTION_ORIGIN;
  }

  return window.location.origin;
}

export function buildShareUrl(path: string): string {
  return `${getShareOrigin()}${path}`;
}

export function getShareResults(played: PlayedCard[]): boolean[] {
  return played
    .map((item, index) => ({
      item,
      placementIndex: item.played.placementIndex ?? index,
    }))
    .sort((left, right) => {
      return left.placementIndex - right.placementIndex;
    })
    .map(({ item }) => item.played.correct);
}

export function getRankLabel(score: number): string {
  if (score >= 20) {
    return "Guld";
  }

  if (score >= 10) {
    return "Silver";
  }

  if (score >= 1) {
    return "Brons";
  }

  return "Ingen";
}

function buildResultRow(results?: boolean[]): string | null {
  if (!results || results.length === 0) {
    return null;
  }

  return results
    .map((result) => (result ? SHARE_RESULT_CORRECT : SHARE_RESULT_INCORRECT))
    .join("");
}

function formatShareDate(dateKey?: string): string {
  if (!dateKey) {
    return "";
  }

  const date = new Date(`${dateKey}T00:00:00.000Z`);
  const parts = new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).formatToParts(date);
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";

  return `${day} ${month} ${year}`.trim();
}

export function buildShareText(args: {
  dateKey?: string;
  difficulty: GameDifficulty;
  highscore?: number;
  mode: GameMode;
  path: string;
  results?: boolean[];
  score: number;
  selectionRoute?: SelectionRoute;
}): string {
  const {
    dateKey,
    difficulty,
    highscore,
    mode,
    path,
    results,
    score,
    selectionRoute,
  } = args;
  const url = buildShareUrl(path);
  const resultRow = buildResultRow(results);

  if (mode === "daily") {
    const lines = [
      `${SHARE_BRAND_LABEL} / Dagens spel ${formatShareDate(dateKey)}`,
    ];

    if (resultRow) {
      lines.push("", resultRow);
    }

    lines.push("", `Poäng / ${score} / ${getRankLabel(score)}`, "", url);
    return lines.join("\n");
  }

  const titleParts = [SHARE_BRAND_LABEL];

  if (selectionRoute) {
    titleParts.push(getSelectionRouteShareLabel(selectionRoute));
  }

  titleParts.push(getDifficultyLabel(difficulty));

  const lines = [titleParts.join(" / ")];

  if (resultRow) {
    lines.push("", resultRow);
  }

  lines.push("", `Poäng / ${score} / ${getRankLabel(score)}`);

  if (typeof highscore === "number") {
    lines.push(`Bäst / ${highscore} / ${getRankLabel(highscore)}`);
  }

  lines.push("", url);
  return lines.join("\n");
}
