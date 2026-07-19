import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getCurrentUtcDateKey, DAILY_DIFFICULTY } from "../../lib/daily";
import { createDailyCardQueue } from "../../lib/daily-game";
import {
  getDailyHistoryWindow,
  getDailyScheduleTheme,
} from "../../lib/daily-schedule";
import { collectLeafDeckIds, createDeckNodeMap } from "../../lib/deck-tree";
import { Card } from "../../types/cards";
import { DeckNode } from "../../types/decks";
import { PreparedCard } from "../../types/game";

const PUBLIC_DECKS_DIR = path.join(process.cwd(), "public/decks");
const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

function parseArgs(): { dateKey: string; force: boolean } {
  const dateArg = process.argv.find((arg) => arg.startsWith("--date="));
  return {
    dateKey: dateArg?.replace("--date=", "") ?? getCurrentUtcDateKey(),
    force: process.argv.includes("--force"),
  };
}

async function loadCardsByDeckId(
  deckIds: string[],
): Promise<Map<string, Card[]>> {
  const entries = await Promise.all(
    deckIds.map(async (deckId) => {
      const cards = await readJson<Card[]>(
        path.join(PUBLIC_DECKS_DIR, `${deckId}.json`),
      );
      return [deckId, cards] as const;
    }),
  );

  return new Map(entries);
}

type DailyGameHistoryRow = {
  card_qids: string[];
  date_key: string;
};

async function loadRecentCardQids(
  supabase: SupabaseClient<any, "public">,
  dateKey: string,
  scheduledDeckId: string,
): Promise<Set<string>> {
  const response = await supabase
    .from("daily_games")
    .select("date_key, card_qids")
    .lt("date_key", dateKey)
    .order("date_key", { ascending: false })
    .limit(90)
    .returns<DailyGameHistoryRow[]>();

  if (response.error) {
    throw response.error;
  }

  const recentRows = (response.data ?? [])
    .filter((row) => {
      const themeDeckId = getDailyScheduleTheme(row.date_key).deckId ?? "all";
      return themeDeckId === scheduledDeckId;
    })
    .slice(
      0,
      getDailyHistoryWindow(scheduledDeckId === "all" ? null : scheduledDeckId),
    );

  return new Set(recentRows.flatMap((row) => row.card_qids));
}

async function main(): Promise<void> {
  const { dateKey, force } = parseArgs();

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const deckTree = await readJson<DeckNode>(
    path.join(PUBLIC_DECKS_DIR, "index.json"),
  );
  const deckMap = createDeckNodeMap(deckTree);
  const scheduledDeckId = getDailyScheduleTheme(dateKey).deckId ?? deckTree.id;
  const selectedRootDeck = deckMap.get(scheduledDeckId);

  if (!selectedRootDeck) {
    throw new Error(`Missing scheduled daily deck: ${scheduledDeckId}`);
  }

  const cardsByDeckId = await loadCardsByDeckId(
    collectLeafDeckIds(selectedRootDeck),
  );
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
    },
  });

  if (!force) {
    const existing = await supabase
      .from("daily_games")
      .select("date_key, card_qids")
      .eq("date_key", dateKey)
      .maybeSingle<DailyGameHistoryRow>();

    if (existing.error) {
      throw existing.error;
    }

    if (existing.data) {
      console.log(
        `Daily game ${dateKey} is already locked with ${existing.data.card_qids.length} cards.`,
      );
      return;
    }
  }

  const recentCardQids = await loadRecentCardQids(
    supabase,
    dateKey,
    scheduledDeckId,
  );
  const cards = createDailyCardQueue(
    selectedRootDeck,
    cardsByDeckId,
    DAILY_DIFFICULTY,
    dateKey,
    null,
    { excludedQids: recentCardQids },
  );
  const cardQids = cards.map((card) => card.qid);
  const cardSnapshots = cards.map((card) => toCardSnapshot(card));

  if (cardQids.length < 2) {
    throw new Error(`Not enough cards to lock ${dateKey}.`);
  }

  const response = await supabase.from("daily_games").upsert({
    card_snapshots: cardSnapshots,
    card_qids: cardQids,
    date_key: dateKey,
    updated_at: new Date().toISOString(),
  });

  if (response.error) {
    throw response.error;
  }

  console.log(`Locked daily game ${dateKey} with ${cardQids.length} cards.`);
}

function toCardSnapshot(card: PreparedCard): Card {
  return {
    fact: card.fact,
    image: card.image,
    pageViews: card.pageViews,
    qid: card.qid,
    subtitle: card.subtitle,
    title: card.title,
    wikipediaSlug: card.wikipediaSlug,
    year: card.year,
  };
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
