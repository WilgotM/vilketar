import classNames from "classnames";
import { motion } from "motion/react";
import React from "react";
import { getCurrentUtcDateKey } from "../lib/daily";
import { loadDailyGameSnapshot } from "../lib/daily-storage";
import {
  createLeague,
  ensureLeagueProfile,
  getMyLeagues,
  isLeaguesConfigured,
  joinLeague,
  League,
  loadStoredDisplayName,
  submitDailyLeagueResult,
} from "../lib/leagues";
import { getShareResults } from "../lib/share";
import Button from "./button";
import PageShell from "./page-shell";
import * as buttonStyles from "../styles/button.css";
import * as styles from "../styles/leagues-screen.css";

const defaultLeagueName = "Min liga";

function getFriendlyError(error: unknown): string {
  if (error instanceof Error && error.message) {
    if (error.message.includes("Anonymous sign-ins are disabled")) {
      return "Anonym inloggning är inte påslagen i Supabase ännu.";
    }

    return error.message;
  }

  return "Något gick fel. Försök igen om en stund.";
}

function todayLabel(score: number | null): string {
  if (score === null) {
    return "Inte spelat idag";
  }

  return `${score} p idag`;
}

type Tab = "list" | "create" | "join";

export default function LeaguesScreen() {
  const todayDateKey = React.useMemo(() => getCurrentUtcDateKey(), []);
  const [displayName, setDisplayName] = React.useState("");
  const [profileReady, setProfileReady] = React.useState(false);
  const [leagues, setLeagues] = React.useState<League[]>([]);
  const [leagueName, setLeagueName] = React.useState(defaultLeagueName);
  const [joinCode, setJoinCode] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [copyText, setCopyText] = React.useState("Kopiera kod");
  const [error, setError] = React.useState<string | null>(null);
  const configured = isLeaguesConfigured();
  const savedNameHandledRef = React.useRef(false);

  const [activeTab, setActiveTab] = React.useState<Tab>("list");

  const refreshLeagues = React.useCallback(async () => {
    const nextLeagues = await getMyLeagues(todayDateKey);
    setLeagues(nextLeagues);
  }, [todayDateKey]);

  React.useEffect(() => {
    setDisplayName(loadStoredDisplayName());
  }, []);

  React.useEffect(() => {
    if (!configured || profileReady || savedNameHandledRef.current) {
      return;
    }

    const storedName = loadStoredDisplayName();
    if (!storedName) {
      return;
    }

    savedNameHandledRef.current = true;
    setBusy(true);
    setError(null);
    void ensureLeagueProfile(storedName)
      .then(() => {
        setDisplayName(storedName);
        setProfileReady(true);
      })
      .catch((caughtError: unknown) => {
        setError(getFriendlyError(caughtError));
      })
      .finally(() => {
        setBusy(false);
      });
  }, [configured, profileReady]);

  React.useEffect(() => {
    if (!profileReady) {
      return;
    }

    const snapshot = loadDailyGameSnapshot();
    const completedToday =
      snapshot && snapshot.dateKey === todayDateKey && snapshot.lives <= 0;
    if (!completedToday) {
      void refreshLeagues();
      return;
    }

    const results = getShareResults(snapshot.played);
    const resultPattern = results
      .map((result) => (result ? "1" : "0"))
      .join("");
    const score =
      snapshot.played.filter((item) => item.played.correct).length - 1;

    void submitDailyLeagueResult({
      dateKey: todayDateKey,
      resultPattern,
      score,
    })
      .catch(() => undefined)
      .finally(() => {
        void refreshLeagues();
      });
  }, [profileReady, refreshLeagues, todayDateKey]);

  const saveName = React.useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await ensureLeagueProfile(displayName);
      setProfileReady(true);
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusy(false);
    }
  }, [displayName]);

  const onCreateLeague = React.useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await createLeague(leagueName);
      setLeagueName(defaultLeagueName);
      await refreshLeagues();
      setActiveTab("list");
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusy(false);
    }
  }, [leagueName, refreshLeagues]);

  const onJoinLeague = React.useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await joinLeague(joinCode);
      setJoinCode("");
      await refreshLeagues();
      setActiveTab("list");
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusy(false);
    }
  }, [joinCode, refreshLeagues]);

  const copyCode = React.useCallback(async (code: string) => {
    await navigator?.clipboard?.writeText(code);
    setCopyText("Kopierad");
    window.setTimeout(() => {
      setCopyText("Kopiera kod");
    }, 1800);
  }, []);

  return (
    <PageShell>
      <div className={styles.screen}>
        <section className={styles.hero}>
          <div className={styles.eyebrow}>Vänligor</div>
          <h1 className={styles.title}>Spela veckan tillsammans</h1>
          <p className={styles.intro}>
            Spela dagens spel och jämför dina poäng med vänner och familj.
          </p>
        </section>

        {!configured ? (
          <div className={styles.error}>
            Supabase saknar `NEXT_PUBLIC_SUPABASE_URL` eller
            `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Lägg in dem innan ligor kan
            användas.
          </div>
        ) : null}

        {error ? <div className={styles.error}>{error}</div> : null}

        {!profileReady ? (
          <section className={styles.panel}>
            <div>
              <h2 className={styles.formTitle}>Vad ska du heta?</h2>
              <p className={styles.helperText}>
                Det här är namnet dina vänner ser i ligan. Ingen e-post och
                inget lösenord behövs.
              </p>
            </div>
            <div className={styles.formGrid}>
              <input
                className={styles.input}
                maxLength={40}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Till exempel: Ingrid"
                value={displayName}
              />
              <Button
                onClick={saveName}
                text={busy ? "Sparar..." : "Fortsätt"}
              />
            </div>
          </section>
        ) : (
          <>
            {activeTab === "list" && (
              <>
                <section className={styles.tabMenu}>
                  <Button
                    fullWidth
                    onClick={() => {
                      setError(null);
                      setActiveTab("create");
                    }}
                    text="Skapa ny liga"
                  />
                  <Button
                    fullWidth
                    minimal
                    onClick={() => {
                      setError(null);
                      setActiveTab("join");
                    }}
                    text="Gå med i liga"
                  />
                </section>

                <section className={styles.leagueList}>
                  {leagues.length === 0 ? (
                    <div className={styles.empty}>
                      Du är inte med i någon liga ännu. Skapa en liga eller
                      skriv in en kod från en vän.
                    </div>
                  ) : null}

                  {leagues.map((league) => {
                    const sortedMembers = [...league.members].sort(
                      (a, b) => b.weekScore - a.weekScore
                    );

                    return (
                      <motion.article
                        animate={{ opacity: 1, y: 0 }}
                        className={styles.leagueCard}
                        initial={{ opacity: 0, y: 10 }}
                        key={league.id}
                        transition={{ duration: 0.22 }}
                      >
                        <div className={styles.leagueHeader}>
                          <h2 className={styles.leagueTitle}>{league.name}</h2>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className={styles.codeBox}>{league.joinCode}</div>
                            <button
                              className={classNames(
                                buttonStyles.button,
                                buttonStyles.minimal,
                              )}
                              onClick={() => void copyCode(league.joinCode)}
                              style={{ padding: '4px 12px', minHeight: 'auto', fontSize: '12px' }}
                              type="button"
                            >
                              <span className={buttonStyles.content}>
                                <span className={buttonStyles.label}>
                                  {copyText}
                                </span>
                              </span>
                            </button>
                          </div>
                        </div>

                        {league.firstWeekIsShort ? (
                          <div className={styles.notice}>
                            Den här ligan skapades mitt i veckan. Första omgången
                            räknas därför från skapelsedagen till söndag.
                          </div>
                        ) : null}

                        {league.previousWeekWinner ? (
                          <div className={styles.winner}>
                            <div className={styles.winnerLabel}>
                              Förra veckans vinnare
                            </div>
                            <div className={styles.winnerName}>
                              {league.previousWeekWinner.displayName}
                            </div>
                            <div className={styles.helperText}>
                              {league.previousWeekWinner.totalScore} poäng
                            </div>
                          </div>
                        ) : null}

                        <div className={styles.memberList}>
                          <div className={styles.memberListHeader}>
                            <div>#</div>
                            <div>Namn</div>
                            <div style={{ textAlign: "right" }}>P</div>
                          </div>
                          {sortedMembers.map((member, index) => (
                            <div
                              className={styles.memberRow}
                              key={member.memberId}
                            >
                              <div className={styles.memberRank}>{index + 1}</div>
                              <div className={styles.memberInfo}>
                                <div className={styles.memberName}>
                                  {member.displayName}
                                  {member.isCurrentUser ? (
                                    <span className={styles.youBadge}>du</span>
                                  ) : null}
                                </div>
                                <div className={styles.today}>
                                  {todayLabel(member.todayScore)}
                                </div>
                              </div>
                              <div className={styles.score}>
                                {member.weekScore}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.article>
                    );
                  })}
                </section>
              </>
            )}

            {activeTab === "create" && (
              <>
                <section className={styles.tabMenuSingle}>
                  <Button
                    fullWidth
                    minimal
                    onClick={() => {
                      setError(null);
                      setActiveTab("list");
                    }}
                    text="Tillbaka till mina ligor"
                  />
                </section>
                <section className={styles.panel}>
                  <div>
                    <h2 className={styles.formTitle}>Skapa ny liga</h2>
                    <p className={styles.helperText}>
                      Välj ett namn för ligan. Du får en kod som du kan dela med
                      dina vänner.
                    </p>
                  </div>
                  <input
                    className={styles.input}
                    maxLength={48}
                    onChange={(event) => setLeagueName(event.target.value)}
                    value={leagueName}
                  />
                  <Button
                    fullWidth
                    onClick={onCreateLeague}
                    text={busy ? "Skapar..." : "Skapa liga"}
                  />
                </section>
              </>
            )}

            {activeTab === "join" && (
              <>
                <section className={styles.tabMenuSingle}>
                  <Button
                    fullWidth
                    minimal
                    onClick={() => {
                      setError(null);
                      setActiveTab("list");
                    }}
                    text="Tillbaka till mina ligor"
                  />
                </section>
                <section className={styles.panel}>
                  <div>
                    <h2 className={styles.formTitle}>Gå med i liga</h2>
                    <p className={styles.helperText}>
                      Skriv in koden du fått av din vän. Du kan vara med i flera
                      ligor samtidigt.
                    </p>
                  </div>
                  <input
                    className={styles.input}
                    maxLength={6}
                    onChange={(event) =>
                      setJoinCode(event.target.value.toUpperCase())
                    }
                    placeholder="ABC123"
                    value={joinCode}
                  />
                  <Button
                    fullWidth
                    onClick={onJoinLeague}
                    text={busy ? "Går med..." : "Gå med i liga"}
                  />
                </section>
              </>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
