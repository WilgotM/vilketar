import classNames from "classnames";
import { motion } from "motion/react";
import Link from "next/link";
import React from "react";
import { getCurrentUtcDateKey } from "../lib/daily";
import { loadDailyGameSnapshot } from "../lib/daily-storage";
import {
  createLeague,
  deleteLeague,
  ensureLeagueProfile,
  getLeagueAuthState,
  getMyLeagues,
  isLeaguesConfigured,
  joinLeague,
  League,
  LeagueAuthState,
  loadStoredDisplayName,
  removeLeagueMember,
  saveLeagueAccount,
  sendLeaguePasswordReset,
  signInToLeagueAccount,
  signOutLeagueAccount,
  submitDailyLeagueResult,
  updateLeaguePassword,
  updateLeagueName,
} from "../lib/leagues";
import { getShareResults } from "../lib/share";
import Button from "./button";
import PageShell from "./page-shell";
import * as styles from "../styles/leagues-screen.css";

const defaultLeagueName = "Min liga";

function getFriendlyError(error: unknown): string {
  if (error instanceof Error && error.message) {
    if (error.message.includes("Anonymous sign-ins are disabled")) {
      return "Anonym inloggning är inte påslagen i Supabase ännu.";
    }

    if (error.message.includes("Invalid login credentials")) {
      return "E-post eller lösenord stämmer inte.";
    }

    if (error.message.includes("Password should be")) {
      return "Välj ett lite längre lösenord.";
    }

    if (error.message.includes("Unable to validate email address")) {
      return "Kontrollera att e-postadressen är rätt skriven.";
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

type Tab = "list" | "create" | "join" | "account" | "login" | "forgot";

const emptyAuthState: LeagueAuthState = {
  email: "",
  isAnonymous: false,
  isSignedIn: false,
};

export default function LeaguesScreen() {
  const todayDateKey = React.useMemo(() => getCurrentUtcDateKey(), []);
  const [displayName, setDisplayName] = React.useState("");
  const [profileReady, setProfileReady] = React.useState(false);
  const [leagues, setLeagues] = React.useState<League[]>([]);
  const [leagueName, setLeagueName] = React.useState(defaultLeagueName);
  const [joinCode, setJoinCode] = React.useState("");
  const [accountEmail, setAccountEmail] = React.useState("");
  const [accountPassword, setAccountPassword] = React.useState("");
  const [authState, setAuthState] =
    React.useState<LeagueAuthState>(emptyAuthState);
  const [statusText, setStatusText] = React.useState<string | null>(null);
  const [editingLeagueId, setEditingLeagueId] = React.useState<string | null>(
    null,
  );
  const [editingLeagueName, setEditingLeagueName] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [copyText, setCopyText] = React.useState("Kopiera kod");
  const [error, setError] = React.useState<string | null>(null);
  const configured = isLeaguesConfigured();
  const savedNameHandledRef = React.useRef(false);

  const [activeTab, setActiveTab] = React.useState<Tab>("list");

  const openTab = React.useCallback((nextTab: Tab) => {
    setError(null);
    setActiveTab(nextTab);
    if (typeof window !== "undefined" && nextTab !== "list") {
      window.history.pushState(
        { leaguesTab: nextTab },
        "",
        window.location.href,
      );
    }
  }, []);

  const returnToList = React.useCallback(() => {
    setActiveTab("list");
    if (typeof window !== "undefined") {
      window.history.replaceState(
        { ...(window.history.state ?? {}), leaguesTab: "list" },
        "",
        window.location.href,
      );
    }
  }, []);

  const refreshAuthState = React.useCallback(async () => {
    const nextAuthState = await getLeagueAuthState();
    setAuthState(nextAuthState);
    if (nextAuthState.email) {
      setAccountEmail(nextAuthState.email);
    }
  }, []);

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
        void refreshAuthState();
      })
      .catch((caughtError: unknown) => {
        setError(getFriendlyError(caughtError));
      })
      .finally(() => {
        setBusy(false);
      });
  }, [configured, profileReady, refreshAuthState]);

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

  React.useEffect(() => {
    if (!configured) {
      return;
    }

    void refreshAuthState();
  }, [configured, refreshAuthState]);

  React.useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const tab = (event.state as { leaguesTab?: Tab } | null)?.leaguesTab;
      setError(null);
      setActiveTab(tab ?? "list");
    };

    window.history.replaceState(
      { ...(window.history.state ?? {}), leaguesTab: "list" },
      "",
      window.location.href,
    );
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const saveName = React.useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await ensureLeagueProfile(displayName);
      setProfileReady(true);
      await refreshAuthState();
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusy(false);
    }
  }, [displayName, refreshAuthState]);

  const onSaveAccount = React.useCallback(async () => {
    setBusy(true);
    setError(null);
    setStatusText(null);
    try {
      const nextAuthState = await saveLeagueAccount({
        email: accountEmail,
        password: accountPassword,
      });
      setAuthState(nextAuthState);
      setAccountPassword("");
      setStatusText(
        "Klart. Om Supabase kräver bekräftelse får du ett mejl med en länk.",
      );
      returnToList();
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusy(false);
    }
  }, [accountEmail, accountPassword, returnToList]);

  const onSignIn = React.useCallback(async () => {
    setBusy(true);
    setError(null);
    setStatusText(null);
    try {
      const nextAuthState = await signInToLeagueAccount({
        email: accountEmail,
        password: accountPassword,
      });
      setAuthState(nextAuthState);
      setAccountPassword("");
      setProfileReady(true);
      await refreshLeagues();
      returnToList();
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusy(false);
    }
  }, [accountEmail, accountPassword, refreshLeagues, returnToList]);

  const onSendPasswordReset = React.useCallback(async () => {
    setBusy(true);
    setError(null);
    setStatusText(null);
    try {
      await sendLeaguePasswordReset(accountEmail);
      setStatusText("Mejlet är skickat. Öppna länken och välj nytt lösenord.");
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusy(false);
    }
  }, [accountEmail]);

  const onUpdatePassword = React.useCallback(async () => {
    setBusy(true);
    setError(null);
    setStatusText(null);
    try {
      await updateLeaguePassword(accountPassword);
      setAccountPassword("");
      setStatusText("Lösenordet är ändrat.");
      await refreshAuthState();
      setProfileReady(true);
      returnToList();
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusy(false);
    }
  }, [accountPassword, refreshAuthState, returnToList]);

  const onSignOut = React.useCallback(async () => {
    setBusy(true);
    setError(null);
    setStatusText(null);
    try {
      await signOutLeagueAccount();
      setProfileReady(false);
      setLeagues([]);
      setAuthState(emptyAuthState);
      returnToList();
      setStatusText("Du är utloggad.");
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusy(false);
    }
  }, [returnToList]);

  const onCreateLeague = React.useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await createLeague(leagueName);
      setLeagueName(defaultLeagueName);
      await refreshLeagues();
      returnToList();
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusy(false);
    }
  }, [leagueName, refreshLeagues, returnToList]);

  const onJoinLeague = React.useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await joinLeague(joinCode);
      setJoinCode("");
      await refreshLeagues();
      returnToList();
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusy(false);
    }
  }, [joinCode, refreshLeagues, returnToList]);

  const replaceLeague = React.useCallback((nextLeague: League) => {
    setLeagues((currentLeagues) =>
      currentLeagues.map((league) =>
        league.id === nextLeague.id ? nextLeague : league,
      ),
    );
  }, []);

  const onRenameLeague = React.useCallback(
    async (league: League) => {
      setBusy(true);
      setError(null);
      try {
        const nextLeague = await updateLeagueName({
          leagueId: league.id,
          name: editingLeagueName,
        });
        replaceLeague(nextLeague);
        setEditingLeagueId(null);
      } catch (caughtError) {
        setError(getFriendlyError(caughtError));
      } finally {
        setBusy(false);
      }
    },
    [editingLeagueName, replaceLeague],
  );

  const onRemoveMember = React.useCallback(
    async (league: League, memberId: string) => {
      setBusy(true);
      setError(null);
      try {
        const nextLeague = await removeLeagueMember({
          leagueId: league.id,
          memberId,
        });
        if (nextLeague) {
          replaceLeague(nextLeague);
        } else {
          setLeagues((currentLeagues) =>
            currentLeagues.filter((item) => item.id !== league.id),
          );
        }
      } catch (caughtError) {
        setError(getFriendlyError(caughtError));
      } finally {
        setBusy(false);
      }
    },
    [replaceLeague],
  );

  const onDeleteLeague = React.useCallback(async (league: League) => {
    const confirmed = window.confirm(
      `Ta bort ${league.name}? Alla i ligan förlorar ligan.`,
    );
    if (!confirmed) {
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await deleteLeague(league.id);
      setLeagues((currentLeagues) =>
        currentLeagues.filter((item) => item.id !== league.id),
      );
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusy(false);
    }
  }, []);

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
        {statusText ? <div className={styles.status}>{statusText}</div> : null}

        {activeTab === "login" ? (
          <section className={styles.panel}>
            <div>
              <h2 className={styles.formTitle}>Logga in</h2>
              <p className={styles.helperText}>
                Har du sparat ditt konto kan du hämta dina ligor här.
              </p>
            </div>
            <input
              className={styles.input}
              inputMode="email"
              onChange={(event) => setAccountEmail(event.target.value)}
              placeholder="E-postadress"
              type="email"
              value={accountEmail}
            />
            <input
              className={styles.input}
              onChange={(event) => setAccountPassword(event.target.value)}
              placeholder="Lösenord"
              type="password"
              value={accountPassword}
            />
            <Button
              fullWidth
              onClick={onSignIn}
              text={busy ? "Loggar in..." : "Logga in"}
            />
            <button
              className={styles.textAction}
              onClick={() => {
                openTab("forgot");
              }}
              type="button"
            >
              Jag har glömt lösenordet
            </button>
          </section>
        ) : activeTab === "forgot" ? (
          <section className={styles.panel}>
            <div>
              <h2 className={styles.formTitle}>Glömt lösenord?</h2>
              <p className={styles.helperText}>
                Skriv din e-post så skickar vi en länk. Om du redan öppnat
                länken kan du välja ett nytt lösenord här.
              </p>
            </div>
            <input
              className={styles.input}
              inputMode="email"
              onChange={(event) => setAccountEmail(event.target.value)}
              placeholder="E-postadress"
              type="email"
              value={accountEmail}
            />
            <Button
              fullWidth
              minimal
              onClick={onSendPasswordReset}
              text={busy ? "Skickar..." : "Skicka återställningsmejl"}
            />
            <input
              className={styles.input}
              onChange={(event) => setAccountPassword(event.target.value)}
              placeholder="Nytt lösenord"
              type="password"
              value={accountPassword}
            />
            <Button
              fullWidth
              onClick={onUpdatePassword}
              text={busy ? "Sparar..." : "Spara nytt lösenord"}
            />
          </section>
        ) : !profileReady ? (
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
            <button
              className={styles.textAction}
              onClick={() => {
                openTab("login");
              }}
              type="button"
            >
              Jag har redan konto
            </button>
          </section>
        ) : (
          <>
            {activeTab === "list" && (
              <>
                <section className={styles.tabMenu}>
                  <Button
                    fullWidth
                    onClick={() => {
                      openTab("create");
                    }}
                    text="Skapa ny liga"
                  />
                  <Button
                    fullWidth
                    minimal
                    onClick={() => {
                      openTab("join");
                    }}
                    text="Gå med i liga"
                  />
                </section>

                <section className={styles.accountNudge}>
                  <div>
                    <div className={styles.accountNudgeLabel}>
                      Rekommenderas
                    </div>
                    <h2 className={styles.accountNudgeTitle}>
                      {authState.isAnonymous
                        ? "Spara ditt konto"
                        : "Ditt konto är sparat"}
                    </h2>
                    <p className={styles.helperText}>
                      {authState.isAnonymous
                        ? "Med e-post och lösenord kan du hitta dina ligor igen på en annan mobil eller surfplatta."
                        : authState.email
                          ? `Inloggad som ${authState.email}. Dina ligor följer med.`
                          : "Dina ligor följer med när du är inloggad."}
                    </p>
                  </div>
                  <button
                    className={styles.accountNudgeButton}
                    onClick={() => {
                      openTab("account");
                    }}
                    type="button"
                  >
                    {authState.isAnonymous ? "Spara konto" : "Hantera konto"}
                  </button>
                  {!authState.isAnonymous ? (
                    <Link className={styles.deviceLink} href="/devices">
                      Mina enheter
                    </Link>
                  ) : null}
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
                      (a, b) => b.weekScore - a.weekScore,
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
                          <div className={styles.leagueTitleStack}>
                            {editingLeagueId === league.id ? (
                              <div className={styles.renameRow}>
                                <input
                                  aria-label="Nytt liganamn"
                                  className={styles.compactInput}
                                  maxLength={48}
                                  onChange={(event) =>
                                    setEditingLeagueName(event.target.value)
                                  }
                                  value={editingLeagueName}
                                />
                                <button
                                  className={styles.smallAction}
                                  disabled={busy}
                                  onClick={() => void onRenameLeague(league)}
                                  type="button"
                                >
                                  Spara
                                </button>
                              </div>
                            ) : (
                              <h2 className={styles.leagueTitle}>
                                {league.name}
                              </h2>
                            )}
                            <div className={styles.memberCount}>
                              {league.members.length} spelare
                            </div>
                          </div>
                          <div className={styles.codeActions}>
                            <div className={styles.codeBox}>
                              {league.joinCode}
                            </div>
                            <button
                              className={classNames(
                                styles.smallAction,
                                styles.copyAction,
                              )}
                              onClick={() => void copyCode(league.joinCode)}
                              type="button"
                            >
                              {copyText}
                            </button>
                          </div>
                        </div>

                        <div className={styles.manageBar}>
                          {league.canManage ? (
                            <>
                              <button
                                className={styles.textAction}
                                disabled={busy}
                                onClick={() => {
                                  setEditingLeagueId(league.id);
                                  setEditingLeagueName(league.name);
                                }}
                                type="button"
                              >
                                Byt namn
                              </button>
                              <button
                                className={styles.textActionDanger}
                                disabled={busy}
                                onClick={() => void onDeleteLeague(league)}
                                type="button"
                              >
                                Ta bort liga
                              </button>
                            </>
                          ) : (
                            <button
                              className={styles.textActionDanger}
                              disabled={busy}
                              onClick={() => {
                                const currentMember = league.members.find(
                                  (member) => member.isCurrentUser,
                                );
                                if (currentMember) {
                                  void onRemoveMember(
                                    league,
                                    currentMember.memberId,
                                  );
                                }
                              }}
                              type="button"
                            >
                              Lämna liga
                            </button>
                          )}
                        </div>

                        {league.firstWeekIsShort ? (
                          <div className={styles.notice}>
                            Den här ligan skapades mitt i veckan. Första
                            omgången räknas därför från skapelsedagen till
                            söndag.
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
                              <div className={styles.memberRank}>
                                {index + 1}
                              </div>
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
                              <div className={styles.scoreCell}>
                                <div className={styles.score}>
                                  {member.weekScore}
                                </div>
                                {league.canManage && !member.isCurrentUser ? (
                                  <button
                                    className={styles.kickButton}
                                    disabled={busy}
                                    onClick={() =>
                                      void onRemoveMember(
                                        league,
                                        member.memberId,
                                      )
                                    }
                                    type="button"
                                  >
                                    Ta bort
                                  </button>
                                ) : null}
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

            {activeTab === "account" && (
              <>
                <section className={styles.panel}>
                  <div>
                    <h2 className={styles.formTitle}>
                      {authState.isAnonymous ? "Spara kontot" : "Ditt konto"}
                    </h2>
                    <p className={styles.helperText}>
                      {authState.isAnonymous
                        ? "Det här är frivilligt. Det gör bara att ligorna inte försvinner om du byter telefon eller rensar webbläsaren."
                        : "Du kan logga in med samma e-post på en annan enhet."}
                    </p>
                  </div>
                  {authState.isAnonymous ? (
                    <>
                      <input
                        className={styles.input}
                        inputMode="email"
                        onChange={(event) =>
                          setAccountEmail(event.target.value)
                        }
                        placeholder="E-postadress"
                        type="email"
                        value={accountEmail}
                      />
                      <input
                        className={styles.input}
                        onChange={(event) =>
                          setAccountPassword(event.target.value)
                        }
                        placeholder="Välj lösenord"
                        type="password"
                        value={accountPassword}
                      />
                      <Button
                        fullWidth
                        onClick={onSaveAccount}
                        text={busy ? "Sparar..." : "Spara konto"}
                      />
                    </>
                  ) : (
                    <>
                      <div className={styles.savedAccountBox}>
                        {authState.email || "Inloggat konto"}
                      </div>
                      <Button
                        fullWidth
                        minimal
                        onClick={onSignOut}
                        text={busy ? "Loggar ut..." : "Logga ut"}
                      />
                    </>
                  )}
                </section>
              </>
            )}

            {activeTab === "join" && (
              <>
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
