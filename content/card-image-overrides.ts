import { readFile } from "fs/promises";
import path from "path";
import { Card } from "../types/cards";

export type CardImageOverride = {
  image: string;
  previousImages?: Record<string, string>;
  savedAt?: string;
  sourceTitle?: string;
  sourceUrl?: string;
};

type OverrideFile = {
  cards?: Record<string, CardImageOverride>;
  version?: number;
};

export function cardImageOverrideKey(card: Pick<Card, "qid" | "year">): string {
  return `${card.qid}:${card.year}`;
}

export async function readCardImageOverrides(
  rootPath = process.cwd(),
): Promise<Record<string, CardImageOverride>> {
  try {
    const value = JSON.parse(
      await readFile(
        path.join(rootPath, "content", "card-image-overrides.json"),
        "utf8",
      ),
    ) as OverrideFile;

    return value.cards ?? {};
  } catch {
    return {};
  }
}

export function getCardImageOverride(
  overrides: Readonly<Record<string, CardImageOverride>>,
  card: Pick<Card, "qid" | "year">,
): CardImageOverride | null {
  return overrides[cardImageOverrideKey(card)] ?? null;
}

export function applyCardImageOverride<
  T extends Pick<Card, "qid" | "year"> & { image: string | null },
>(card: T, overrides: Readonly<Record<string, CardImageOverride>>): T {
  const override = getCardImageOverride(overrides, card);
  return override ? { ...card, image: override.image } : card;
}
