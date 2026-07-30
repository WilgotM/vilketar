import { Card } from "../types/cards";
import { getUtcDateKeyDaysBefore } from "./daily";
import { DailyOverride } from "./daily-game";
import {
  createDailyOpeningProtection,
  DailyOpeningProtection,
} from "./daily-opening-protection";
import { supabase, supabaseRest } from "./supabase";

interface DailyOverrideRow {
  card_snapshots?: Card[] | null;
  card_qids: string[];
  date_key: string;
}

type DailyGameHistoryRow = Pick<
  DailyOverrideRow,
  "card_qids" | "card_snapshots" | "date_key"
>;

function mapDailyOverride(row: DailyOverrideRow | null): DailyOverride | null {
  if (!row) {
    return null;
  }

  return {
    cardQids: row.card_qids,
    cards: row.card_snapshots ?? undefined,
    dateKey: row.date_key,
  };
}

export async function loadDailyOverride(
  dateKey: string,
): Promise<DailyOverride | null> {
  if (supabase) {
    const response = await supabase
      .from("daily_games")
      .select("date_key, card_qids, card_snapshots")
      .eq("date_key", dateKey)
      .maybeSingle<DailyOverrideRow>();

    if (!response.error) {
      return mapDailyOverride(response.data);
    }
  }

  const rows = await supabaseRest<DailyOverrideRow[]>("daily_games", {
    searchParams: {
      card_qids: "not.is.null",
      date_key: `eq.${dateKey}`,
      select: "date_key,card_qids,card_snapshots",
    },
  });

  return mapDailyOverride(rows?.[0] ?? null);
}

/**
 * Last-resort repeat protection for a day that was not locked in time.
 *
 * The scheduled lock normally makes the queue stable and applies the
 * editorial theme rules. If it is unavailable, keep the first 20 cards fresh
 * against the previous seven calendar days in the fallback queue.
 */
export async function loadRecentDailyOpeningProtection(
  dateKey: string,
): Promise<DailyOpeningProtection> {
  let rows: DailyGameHistoryRow[] | null = null;
  const startDateKey = getUtcDateKeyDaysBefore(dateKey, 7);

  if (supabase) {
    const response = await supabase
      .from("daily_games")
      .select("date_key, card_qids, card_snapshots")
      .gte("date_key", startDateKey)
      .lt("date_key", dateKey)
      .order("date_key", { ascending: false })
      .returns<DailyGameHistoryRow[]>();

    if (!response.error) {
      rows = response.data ?? [];
    }
  }

  if (!rows) {
    rows = await supabaseRest<DailyGameHistoryRow[]>("daily_games", {
      searchParams: {
        and: `(date_key.gte.${startDateKey},date_key.lt.${dateKey})`,
        order: "date_key.desc",
        select: "date_key,card_qids,card_snapshots",
      },
    });
  }

  return createDailyOpeningProtection(rows ?? []);
}
