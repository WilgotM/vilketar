import Head from "next/head";
import React from "react";
import { useDecks } from "../components/deck-provider";
import { DAILY_DIFFICULTY, getCurrentUtcDateKey } from "../lib/daily";
import {
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
const VISIBLE_CARD_COUNT = 12;

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
  const [email, setEmail] = React.useState("");
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
    const client = supabase;

    let cancelled = false;
    async function loadSession() {
      const session = await client.auth.getSession();
      if (cancelled) {
        return;
      }

      const userId = session.data.session?.user.id;
      if (!userId) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const admin = await client
        .from("daily_admins")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();
      setIsAdmin(!admin.error && Boolean(admin.data));
      setLoading(false);
    }

    void loadSession();
    const subscription = client.auth.onAuthStateChange(() => {
      setLoading(true);
      void loadSession();
    });

    return () => {
      cancelled = true;
      subscription.data.subscription.unsubscribe();
    };
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
    if (!supabase || !email.trim()) {
      return;
    }

    const response = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo:
          typeof window === "undefined" ? undefined : window.location.href,
      },
    });
    setStatus(
      response.error
        ? response.error.message
        : "Kolla mailen och öppna inloggningslänken.",
    );
  }

  async function saveOverride(dateKey: string, qids: string[]) {
    if (!supabase || dateKey <= todayKey) {
      return;
    }

    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    if (!userId) {
      return;
    }

    const response = await supabase.from("daily_games").upsert({
      card_qids: qids,
      date_key: dateKey,
      updated_by: userId,
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

    const response = await supabase
      .from("daily_games")
      .delete()
      .eq("date_key", dateKey);
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

  function replaceSelectedSlot(card: PreparedCard) {
    if (!selectedSlot) {
      return;
    }
    const plan = plans.find((entry) => entry.dateKey === selectedSlot.dateKey);
    if (!plan || plan.isToday) {
      return;
    }

    const nextQids = plan.cards
      .slice(0, VISIBLE_CARD_COUNT)
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
            Logga in med en mailadress som finns i Supabase-tabellen
            daily_admins.
          </p>
          <input
            className={styles.input}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="namn@example.com"
            type="email"
            value={email}
          />
          <button className={styles.button} type="submit">
            Skicka magisk länk
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
              onClick={() => supabase?.auth.signOut()}
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
                    <p className={styles.status}>{plan.dateKey}</p>
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
                  {plan.cards
                    .slice(0, VISIBLE_CARD_COUNT)
                    .map((card, index) => (
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
