import { Card } from "../types/cards";

/**
 * Most players experience the opening of a daily game, rather than its full
 * 100-card queue. Keep that part fresh without unnecessarily removing cards
 * from later in the game.
 */
export const DAILY_OPENING_CARD_COUNT = 20;

export interface DailyOpeningHistoryRow {
  card_qids: string[];
  card_snapshots?: Pick<Card, "qid" | "title">[] | null;
}

export interface DailyOpeningProtection {
  qids: Set<string>;
  titles: Set<string>;
}

export function normalizeDailyCardTitle(title: string): string {
  return title.trim().replace(/\s+/g, " ").toLocaleLowerCase("sv-SE");
}

/**
 * Build the opening-only cooldown from historical daily queues. Older rows
 * without snapshots still receive QID protection.
 */
export function createDailyOpeningProtection(
  rows: readonly DailyOpeningHistoryRow[],
): DailyOpeningProtection {
  const qids = new Set<string>();
  const titles = new Set<string>();

  for (const row of rows) {
    for (const qid of row.card_qids.slice(0, DAILY_OPENING_CARD_COUNT)) {
      qids.add(qid);
    }

    for (const card of (row.card_snapshots ?? []).slice(
      0,
      DAILY_OPENING_CARD_COUNT,
    )) {
      titles.add(normalizeDailyCardTitle(card.title));
    }
  }

  return { qids, titles };
}
