import { Card } from "../types/cards";
import { DailyOverride } from "./daily-game";
import { supabase, supabaseRest } from "./supabase";

interface DailyOverrideRow {
  card_snapshots?: Card[] | null;
  card_qids: string[];
  date_key: string;
}

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
