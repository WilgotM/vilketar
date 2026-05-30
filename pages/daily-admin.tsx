import Head from "next/head";
import React from "react";
import { useDecks } from "../components/deck-provider";
import { DAILY_DIFFICULTY, getCurrentUtcDateKey } from "../lib/daily";
import {
  DAILY_CARD_COUNT,
  createDailyCardQueue,
  createDailySearchCards,
} from "../lib/daily-game";
import { collectLeafDeckIds, createDeckNodeListMap } from "../lib/deck-tree";
import {
  filterCardsBySelectionRoute,
  resolveSelectionDeck,
} from "../lib/game-state";
import { supabase } from "../lib/supabase";
import { Card } from "../types/cards";
import { PreparedCard } from "../types/game";
import * as styles from "../styles/daily-admin.css";

const DAY_COUNT = 10;
const ADMIN_CARD_COUNT = DAILY_CARD_COUNT;
const ADMIN_USERNAME = "Wilgot10";
const ADMIN_PASSWORD = "Elfsborg10";
const ADMIN_RPC_KEY = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`;
const ADMIN_SESSION_KEY = "daily-admin:unlocked";

interface DailyGameRow {
  card_qids: string[];
  date_key: string;
  updated_at: string;
}

interface DayPlan {
  cards: PreparedCard[];
  dateKey: string;
  isToday: boolean;
  override: DailyGameRow | null;
}

function addUtcDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatDate(dateKey: string): string {
  return new Intl.DateTimeFormat("sv-SE", {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(new Date(`${dateKey}T00:00:00.000Z`));
}

function DailyAdminHead() {
  return (
    <Head>
      <title>Daily admin</title>
      <meta name="robots" content="noindex,nofollow" />
    </Head>
  );
}

export default function DailyAdminPage() {
  const { deckNodes, loadDecks, rootDeckId } = useDecks();
  const todayKey = React.useMemo(() => getCurrentUtcDateKey(), []);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [cardsByDeckId, setCardsByDeckId] = React.useState<Map<
    string,
    Card[]
  > | null>(null);
  const [overrides, setOverrides] = React.useState<Map<string, DailyGameRow>>(
    () => new Map(),
  );
  const [selectedSlot, setSelectedSlot] = React.useState<{
    dateKey: string;
    index: number;
  } | null>(null);
  const [query, setQuery] = React.useState("");

  const dateKeys = React.useMemo(
    () =>
      Array.from({ length: DAY_COUNT }, (_entry, index) =>
        addUtcDays(todayKey, index),
      ),
    [todayKey],
  );

  React.useEffect(() => {
    if (!supabase) {
      setStatus("Supabase saknar publika miljövariabler.");
      setLoading(false);
      return;
    }

    setIsAdmin(localStorage.getItem(ADMIN_SESSION_KEY) === "true");
    setLoading(false);
  }, []);

  React.useEffect(() => {
    if (!isAdmin || !deckNodes || !rootDeckId) {
      return;
    }

    const nextDeckNodes = deckNodes;
    const nextRootDeckId = rootDeckId;
    let cancelled = false;
    async function loadData() {
      const deckNodeMap = createDeckNodeListMap(nextDeckNodes);
      const rootDeck = deckNodeMap.get(nextRootDeckId);
      if (!rootDeck) {
        return;
      }
      const leafIds = collectLeafDeckIds(rootDeck);
      const nextCardsByDeckId = await loadDecks(leafIds);
      const overrideResponse = supabase
        ? await supabase
            .from("daily_games")
            .select("date_key, card_qids, updated_at")
            .gte("date_key", todayKey)
            .lte("date_key", addUtcDays(todayKey, DAY_COUNT - 1))
        : { data: null };

      if (cancelled) {
        return;
      }

      setCardsByDeckId(nextCardsByDeckId);
      setOverrides(
        new Map(
          ((overrideResponse.data as DailyGameRow[] | null) ?? []).map(
            (row) => [row.date_key, row],
          ),
        ),
      );
    }

    void loadData();
    return () => {
      cancelled = true;
    };
  }, [deckNodes, isAdmin, loadDecks, rootDeckId, todayKey]);

  const selectedRootDeck = React.useMemo(() => {
    if (!deckNodes || !rootDeckId) {
      return null;
    }
    return resolveSelectionDeck(deckNodes, "daily", null, rootDeckId);
  }, [deckNodes, rootDeckId]);

  const allCards = React.useMemo(() => {
    if (!selectedRootDeck || !cardsByDeckId) {
      return [];
    }
    return createDailySearchCards(
      selectedRootDeck,
      filterCardsBySelectionRoute(cardsByDeckId, null),
      DAILY_DIFFICULTY,
    );
  }, [cardsByDeckId, selectedRootDeck]);

  const plans = React.useMemo<DayPlan[]>(() => {
    if (!selectedRootDeck || !cardsByDeckId) {
      return [];
    }

    return dateKeys.map((dateKey) => {
      const override = overrides.get(dateKey) ?? null;
      return {
        cards: createDailyCardQueue(
          selectedRootDeck,
          filterCardsBySelectionRoute(cardsByDeckId, null),
          DAILY_DIFFICULTY,
          dateKey,
          override
            ? {
                cardQids: override.card_qids,
                dateKey,
              }
            : null,
        ),
        dateKey,
        isToday: dateKey === todayKey,
        override,
      };
    });
  }, [cardsByDeckId, dateKeys, overrides, selectedRootDeck, todayKey]);

  const searchResults = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return allCards.slice(0, 30);
    }

    return allCards
      .filter((card) => {
        return [
          card.title,
          card.subtitle,
          String(card.year),
          card.wikipediaSlug,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .slice(0, 40);
  }, [allCards, query]);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) {
      return;
    }

    if (username.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      setStatus("Fel användarnamn eller lösenord.");
      return;
    }

    localStorage.setItem(ADMIN_SESSION_KEY, "true");
    setIsAdmin(true);
    setStatus("Inloggad.");
  }

  async function saveOverride(dateKey: string, qids: string[]) {
    if (!supabase || dateKey <= todayKey) {
      return;
    }

    const response = await supabase.rpc("app_admin_upsert_daily_game", {
      p_admin_key: ADMIN_RPC_KEY,
      p_card_qids: qids,
      p_date_key: dateKey,
    });

    if (response.error) {
      setStatus(response.error.message);
      return;
    }

    setOverrides((current) => {
      const next = new Map(current);
      next.set(dateKey, {
        card_qids: qids,
        date_key: dateKey,
        updated_at: new Date().toISOString(),
      });
      return next;
    });
    setStatus("Sparat.");
  }

  async function resetDate(dateKey: string) {
    if (!supabase || dateKey <= todayKey) {
      return;
    }

    const response = await supabase.rpc("app_admin_delete_daily_game", {
      p_admin_key: ADMIN_RPC_KEY,
      p_date_key: dateKey,
    });
    if (response.error) {
      setStatus(response.error.message);
      return;
    }

    setOverrides((current) => {
      const next = new Map(current);
      next.delete(dateKey);
      return next;
    });
    setStatus("Återställt till algoritmen.");
  }

  function savePlan(dateKey: string) {
    const plan = plans.find((entry) => entry.dateKey === dateKey);
    if (!plan || plan.isToday) {
      return;
    }

    void saveOverride(
      plan.dateKey,
      plan.cards.slice(0, ADMIN_CARD_COUNT).map((entry) => entry.qid),
    );
  }

  function replaceSelectedSlot(card: PreparedCard) {
    if (!selectedSlot) {
      return;
    }
    const plan = plans.find((entry) => entry.dateKey === selectedSlot.dateKey);
    if (!plan || plan.isToday) {
      return;
    }

    const nextQids = plan.cards
      .slice(0, ADMIN_CARD_COUNT)
      .map((entry) => entry.qid);
    nextQids[selectedSlot.index] = card.qid;
    void saveOverride(plan.dateKey, nextQids);
  }

  if (!supabase) {
    return (
      <main className={styles.page}>
        <DailyAdminHead />
        <section className={styles.loginPanel}>
          <h1 className={styles.title}>Daily admin</h1>
          <p className={styles.status}>Supabase är inte konfigurerat.</p>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <DailyAdminHead />
        <p className={styles.status}>Laddar...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className={styles.page}>
        <DailyAdminHead />
        <form className={styles.loginPanel} onSubmit={signIn}>
          <p className={styles.eyebrow}>VilketÅr</p>
          <h1 className={styles.title}>Daily admin</h1>
          <p className={styles.subtitle}>
            Logga in med ditt användarnamn och lösenord för att hantera dagliga
            deck.
          </p>
          <input
            className={styles.input}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Användarnamn"
            type="text"
            value={username}
          />
          <input
            className={styles.input}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Lösenord"
            type="password"
            value={password}
          />
          <button className={styles.button} type="submit">
            Logga in
          </button>
          {status ? <p className={styles.status}>{status}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <DailyAdminHead />
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Daily admin</p>
            <h1 className={styles.title}>Kommande spel</h1>
            <p className={styles.subtitle}>
              Dagens spel är låst. Morgondagen och framåt kan justeras eller
              återställas till den seedade slumpen.
            </p>
          </div>
          <div className={styles.toolbar}>
            <button
              className={styles.secondaryButton}
              onClick={() => {
                localStorage.removeItem(ADMIN_SESSION_KEY);
                setIsAdmin(false);
                setPassword("");
                setStatus("");
              }}
              type="button"
            >
              Logga ut
            </button>
          </div>
        </header>
        {status ? <p className={styles.status}>{status}</p> : null}
        <section className={styles.layout}>
          <div className={styles.dayGrid}>
            {plans.map((plan) => (
              <article className={styles.dayCard} key={plan.dateKey}>
                <div className={styles.dayHeader}>
                  <div>
                    <h2 className={styles.dayTitle}>
                      {formatDate(plan.dateKey)}
                    </h2>
                    <p className={styles.status}>
                      {plan.dateKey} ·{" "}
                      {Math.min(plan.cards.length, ADMIN_CARD_COUNT)} kort
                    </p>
                  </div>
                  <span
                    className={
                      plan.override ? styles.overrideBadge : styles.badge
                    }
                  >
                    {plan.isToday
                      ? "Låst idag"
                      : plan.override
                        ? "Ändrad"
                        : "Algoritm"}
                  </span>
                </div>
                <div className={styles.cardList}>
                  {plan.cards.slice(0, ADMIN_CARD_COUNT).map((card, index) => (
                    <div
                      className={styles.dailyCardRow}
                      key={`${plan.dateKey}:${index}:${card.qid}`}
                    >
                      <div className={styles.cardIndex}>{index + 1}</div>
                      <div>
                        <div className={styles.cardTitle}>{card.title}</div>
                        <div className={styles.cardMeta}>
                          {card.year} · {card.subtitle ?? card.deckId}
                        </div>
                      </div>
                      <button
                        className={styles.secondaryButton}
                        disabled={plan.isToday}
                        onClick={() =>
                          setSelectedSlot({ dateKey: plan.dateKey, index })
                        }
                        type="button"
                      >
                        Byt
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.toolbar}>
                  <button
                    className={styles.secondaryButton}
                    disabled={plan.isToday}
                    onClick={() => savePlan(plan.dateKey)}
                    type="button"
                  >
                    {plan.override ? "Spara om 100 kort" : "Spara 100 kort"}
                  </button>
                  <button
                    className={styles.dangerButton}
                    disabled={plan.isToday || !plan.override}
                    onClick={() => resetDate(plan.dateKey)}
                    type="button"
                  >
                    Återställ
                  </button>
                </div>
              </article>
            ))}
          </div>
          <aside className={styles.searchPanel}>
            <div>
              <h2 className={styles.dayTitle}>Sök kort</h2>
              <p className={styles.status}>
                {selectedSlot
                  ? `Vald plats: ${selectedSlot.dateKey}, kort ${selectedSlot.index + 1}`
                  : "Välj en plats i listan först."}
              </p>
            </div>
            <input
              className={styles.input}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sök titel, årtal eller Wikipedia..."
              value={query}
            />
            <div className={styles.searchResults}>
              {searchResults.map((card) => (
                <button
                  className={styles.searchResult}
                  disabled={!selectedSlot}
                  key={card.qid}
                  onClick={() => replaceSelectedSlot(card)}
                  type="button"
                >
                  <span className={styles.cardTitle}>{card.title}</span>
                  <span className={styles.cardMeta}>
                    {card.year} · {card.subtitle ?? card.deckId}
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
