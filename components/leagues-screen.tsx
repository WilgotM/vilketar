import classNames from "classnames";
import { motion } from "motion/react";
import Image from "next/image";
import React from "react";
import { getCurrentUtcDateKey } from "../lib/daily";
import { loadDailyGameSnapshot } from "../lib/daily-storage";
import {
  createLeague,
  deleteLeagueAccount,
  deleteLeague,
  ensureLeagueProfile,
  getLeagueAuthState,
  getLeagueProfile,
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
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    if (error.code === "email_exists" || error.code === "user_already_exists") {
      return "Det finns redan ett konto med den e-postadressen. Logga in med det kontot istället.";
    }

    if (error.code === "invalid_credentials") {
      return "E-post eller lösenord stämmer inte.";
    }

    if (
      error.code === "manual_linking_disabled" ||
      error.code === "identity_already_exists"
    ) {
      return "Supabase tillåter inte att anonyma konton kopplas till e-post ännu. Slå på manuell länkning i Auth-inställningarna.";
    }
  }

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

    if (
      error.message.includes("Manual linking is disabled") ||
      error.message.includes("Identity is already linked")
    ) {
      return "Supabase tillåter inte att anonyma konton kopplas till e-post ännu. Slå på manuell länkning i Auth-inställningarna.";
    }

    if (error.message.includes("User already registered")) {
      return "Det finns redan ett konto med den e-postadressen. Logga in med det kontot istället.";
    }

    return error.message;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return getFriendlyError(new Error(error.message));
  }

  return "Något gick fel. Försök igen om en stund.";
}

function todayLabel(score: number | null): string {
  if (score === null) {
    return "Inte spelat idag";
  }

  return `${score} p idag`;
}

type Tab =
  | "list"
  | "create"
  | "join"
  | "account"
  | "login"
  | "forgot"
  | "profile"
  | "verify-email";

type BusyAction =
  | "account-delete"
  | "account-save"
  | "avatar"
  | "create"
  | "join"
  | "login"
  | "password-reset"
  | "password-update"
  | "profile"
  | "profile-bootstrap"
  | "remove-league"
  | "remove-member"
  | "rename"
  | "sign-out";

const emptyAuthState: LeagueAuthState = {
  email: "",
  isAnonymous: false,
  isSignedIn: false,
};

const avatarSize = 160;
const maxAvatarBytes = 48 * 1024;

function byteLength(value: string): number {
  return Math.ceil((value.length * 3) / 4);
}

async function compressAvatar(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Välj en bildfil.");
  }

  const imageUrl = URL.createObjectURL(file);
  try {
    const image = new window.Image();
    image.src = imageUrl;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = avatarSize;
    canvas.height = avatarSize;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Kunde inte läsa bilden.");
    }

    const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
    const sourceX = (image.naturalWidth - sourceSize) / 2;
    const sourceY = (image.naturalHeight - sourceSize) / 2;
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      avatarSize,
      avatarSize,
    );

    const mimeType = canvas
      .toDataURL("image/webp")
      .startsWith("data:image/webp")
      ? "image/webp"
      : "image/jpeg";
    const qualities = [0.78, 0.66, 0.54, 0.42];
    for (const quality of qualities) {
      const dataUrl = canvas.toDataURL(mimeType, quality);
      if (byteLength(dataUrl) <= maxAvatarBytes) {
        return dataUrl;
      }
    }

    throw new Error("Bilden blev för stor. Testa en enklare bild.");
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export default function LeaguesScreen() {
  const todayDateKey = React.useMemo(() => getCurrentUtcDateKey(), []);
  const [displayName, setDisplayName] = React.useState("");
  const [avatarDataUrl, setAvatarDataUrl] = React.useState<string | null>(null);
  const [profileStatusText, setProfileStatusText] = React.useState<
    string | null
  >(null);
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
  const [busyAction, setBusyAction] = React.useState<BusyAction | null>(null);
  const [copyText, setCopyText] = React.useState("Kopiera kod");
  const [error, setError] = React.useState<string | null>(null);
  const configured = isLeaguesConfigured();
  const savedNameHandledRef = React.useRef(false);
  const busy = busyAction !== null;

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
    setBusyAction("profile-bootstrap");
    setError(null);
    void ensureLeagueProfile({ avatarDataUrl: null, displayName: storedName })
      .then(() => {
        setDisplayName(storedName);
        setProfileReady(true);
        void refreshAuthState();
      })
      .catch((caughtError: unknown) => {
        setError(getFriendlyError(caughtError));
      })
      .finally(() => {
        setBusyAction(null);
      });
  }, [configured, profileReady, refreshAuthState]);

  React.useEffect(() => {
    if (!configured || !authState.isSignedIn) {
      return;
    }

    void getLeagueProfile()
      .then((profile) => {
        if (!profile) {
          return;
        }
        setDisplayName(profile.displayName);
        setAvatarDataUrl(profile.avatarDataUrl);
        setProfileReady(true);
      })
      .catch(() => undefined);
  }, [authState.isSignedIn, configured]);

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
    setBusyAction("profile");
    setError(null);
    setProfileStatusText(null);
    try {
      await ensureLeagueProfile({ avatarDataUrl, displayName });
      setProfileReady(true);
      await refreshAuthState();
      await refreshLeagues();
      setProfileStatusText("Profilen är sparad.");
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusyAction(null);
    }
  }, [avatarDataUrl, displayName, refreshAuthState, refreshLeagues]);

  const onAvatarChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) {
        return;
      }

      setBusyAction("avatar");
      setError(null);
      setProfileStatusText("Komprimerar bilden...");
      try {
        const nextAvatarDataUrl = await compressAvatar(file);
        setAvatarDataUrl(nextAvatarDataUrl);
        setProfileStatusText("Bilden är redo. Tryck Spara profil.");
      } catch (caughtError) {
        setProfileStatusText(null);
        setError(getFriendlyError(caughtError));
      } finally {
        setBusyAction(null);
      }
    },
    [],
  );

  const onSaveAccount = React.useCallback(async () => {
    setBusyAction("account-save");
    setError(null);
    setStatusText(null);
    try {
      const nextAuthState = await saveLeagueAccount({
        email: accountEmail,
        password: accountPassword,
      });
      setAuthState(nextAuthState);
      setAccountPassword("");

      if (authState.isAnonymous) {
        openTab("verify-email");
      } else {
        setStatusText("Kontot är sparat.");
        returnToList();
      }
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusyAction(null);
    }
  }, [
    accountEmail,
    accountPassword,
    authState.isAnonymous,
    openTab,
    returnToList,
  ]);

  const onSignIn = React.useCallback(async () => {
    setBusyAction("login");
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
      setBusyAction(null);
    }
  }, [accountEmail, accountPassword, refreshLeagues, returnToList]);

  const onSendPasswordReset = React.useCallback(async () => {
    setBusyAction("password-reset");
    setError(null);
    setStatusText(null);
    try {
      await sendLeaguePasswordReset(accountEmail);
      setStatusText("Mejlet är skickat. Öppna länken och välj nytt lösenord.");
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusyAction(null);
    }
  }, [accountEmail]);

  const onUpdatePassword = React.useCallback(async () => {
    setBusyAction("password-update");
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
      setBusyAction(null);
    }
  }, [accountPassword, refreshAuthState, returnToList]);

  const onSignOut = React.useCallback(async () => {
    setBusyAction("sign-out");
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
      setBusyAction(null);
    }
  }, [returnToList]);

  const onDeleteAccount = React.useCallback(async () => {
    const confirmed = window.confirm(
      "Ta bort ditt konto? Dina ligor, resultat, profil och enheter tas bort permanent.",
    );
    if (!confirmed) {
      return;
    }

    setBusyAction("account-delete");
    setError(null);
    setStatusText(null);
    try {
      await deleteLeagueAccount();
      setAccountEmail("");
      setAccountPassword("");
      setAvatarDataUrl(null);
      setDisplayName("");
      setProfileReady(false);
      setLeagues([]);
      setAuthState(emptyAuthState);
      returnToList();
      setStatusText("Kontot är borttaget.");
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusyAction(null);
    }
  }, [returnToList]);

  const onCreateLeague = React.useCallback(async () => {
    setBusyAction("create");
    setError(null);
    try {
      await createLeague(leagueName);
      setLeagueName(defaultLeagueName);
      await refreshLeagues();
      returnToList();
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusyAction(null);
    }
  }, [leagueName, refreshLeagues, returnToList]);

  const onJoinLeague = React.useCallback(async () => {
    setBusyAction("join");
    setError(null);
    try {
      await joinLeague(joinCode);
      setJoinCode("");
      await refreshLeagues();
      returnToList();
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusyAction(null);
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
      setBusyAction("rename");
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
        setBusyAction(null);
      }
    },
    [editingLeagueName, replaceLeague],
  );

  const onRemoveMember = React.useCallback(
    async (league: League, memberId: string) => {
      setBusyAction("remove-member");
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
        setBusyAction(null);
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

    setBusyAction("remove-league");
    setError(null);
    try {
      await deleteLeague(league.id);
      setLeagues((currentLeagues) =>
        currentLeagues.filter((item) => item.id !== league.id),
      );
    } catch (caughtError) {
      setError(getFriendlyError(caughtError));
    } finally {
      setBusyAction(null);
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
              disabled={busy}
              fullWidth
              onClick={onSignIn}
              text={busyAction === "login" ? "Loggar in..." : "Logga in"}
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
              disabled={busy}
              fullWidth
              minimal
              onClick={onSendPasswordReset}
              text={
                busyAction === "password-reset"
                  ? "Skickar..."
                  : "Skicka återställningsmejl"
              }
            />
            <input
              className={styles.input}
              onChange={(event) => setAccountPassword(event.target.value)}
              placeholder="Nytt lösenord"
              type="password"
              value={accountPassword}
            />
            <Button
              disabled={busy}
              fullWidth
              onClick={onUpdatePassword}
              text={
                busyAction === "password-update"
                  ? "Sparar..."
                  : "Spara nytt lösenord"
              }
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
            <div className={styles.profileEditor}>
              <div className={styles.avatarPreview}>
                {avatarDataUrl ? (
                  <Image
                    alt=""
                    className={styles.avatarImage}
                    height={160}
                    src={avatarDataUrl}
                    unoptimized
                    width={160}
                  />
                ) : (
                  <span>
                    {displayName.trim().charAt(0).toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <label className={styles.avatarPicker}>
                <input
                  accept="image/*"
                  className={styles.hiddenFileInput}
                  disabled={busy}
                  onChange={onAvatarChange}
                  type="file"
                />
                Lägg till bild
              </label>
            </div>
            {profileStatusText ? (
              <div className={styles.inlineStatus}>{profileStatusText}</div>
            ) : null}
            <div className={styles.formGrid}>
              <input
                className={styles.input}
                maxLength={40}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Till exempel: Ingrid"
                value={displayName}
              />
              <Button
                disabled={busy}
                onClick={saveName}
                text={
                  busyAction === "profile" || busyAction === "profile-bootstrap"
                    ? "Sparar..."
                    : "Fortsätt"
                }
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
                <section className={styles.quickActions}>
                  <button
                    className={styles.actionCard}
                    onClick={() => openTab("profile")}
                  >
                    <div className={styles.actionIcon}>
                      {avatarDataUrl ? (
                        <Image
                          alt=""
                          className={styles.actionAvatar}
                          height={40}
                          src={avatarDataUrl}
                          unoptimized
                          width={40}
                        />
                      ) : (
                        <span>
                          {displayName.trim().charAt(0).toUpperCase() || "?"}
                        </span>
                      )}
                    </div>
                    <span>Profil</span>
                  </button>

                  <button
                    className={styles.actionCard}
                    onClick={() => openTab("create")}
                  >
                    <div className={styles.actionIcon}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                    </div>
                    <span>Skapa</span>
                  </button>

                  <button
                    className={styles.actionCard}
                    onClick={() => openTab("join")}
                  >
                    <div className={styles.actionIcon}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                    </div>
                    <span>Gå med</span>
                  </button>

                  <button
                    className={styles.actionCard}
                    onClick={() => openTab("account")}
                  >
                    <div className={styles.actionIcon}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    </div>
                    <span>Konto</span>
                  </button>
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
                                  <span className={styles.memberAvatar}>
                                    {member.avatarDataUrl ? (
                                      <Image
                                        alt=""
                                        className={styles.avatarImage}
                                        height={32}
                                        src={member.avatarDataUrl}
                                        unoptimized
                                        width={32}
                                      />
                                    ) : (
                                      member.displayName
                                        .trim()
                                        .charAt(0)
                                        .toUpperCase() || "?"
                                    )}
                                  </span>
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

            {activeTab === "profile" && (
              <>
                <section className={styles.panel}>
                  <div>
                    <h2 className={styles.formTitle}>Din profil</h2>
                    <p className={styles.helperText}>
                      Det här namnet och bilden syns för alla i dina ligor.
                    </p>
                  </div>
                  <div className={styles.profileEditor}>
                    <div className={styles.avatarPreview}>
                      {avatarDataUrl ? (
                        <Image
                          alt=""
                          className={styles.avatarImage}
                          height={160}
                          src={avatarDataUrl}
                          unoptimized
                          width={160}
                        />
                      ) : (
                        <span>
                          {displayName.trim().charAt(0).toUpperCase() || "?"}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <label className={styles.avatarPicker}>
                        <input
                          accept="image/*"
                          className={styles.hiddenFileInput}
                          disabled={busy}
                          onChange={onAvatarChange}
                          type="file"
                        />
                        Byt bild
                      </label>
                      {avatarDataUrl ? (
                        <button
                          className={styles.smallAction}
                          disabled={busy}
                          onClick={() => {
                            setAvatarDataUrl(null);
                            setProfileStatusText(
                              "Bilden tas bort när du sparar.",
                            );
                          }}
                          type="button"
                        >
                          Ta bort bild
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <input
                    className={styles.input}
                    maxLength={40}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Ditt namn"
                    value={displayName}
                  />
                  <Button
                    disabled={busy}
                    fullWidth
                    onClick={saveName}
                    text={
                      busyAction === "profile" ? "Sparar..." : "Spara profil"
                    }
                  />
                  {profileStatusText ? (
                    <div className={styles.inlineStatus}>
                      {profileStatusText}
                    </div>
                  ) : null}
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
                    disabled={busy}
                    fullWidth
                    onClick={onCreateLeague}
                    text={busyAction === "create" ? "Skapar..." : "Skapa liga"}
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
                        disabled={busy}
                        fullWidth
                        onClick={onSaveAccount}
                        text={
                          busyAction === "account-save"
                            ? "Sparar..."
                            : "Spara konto"
                        }
                      />
                      <button
                        className={styles.textAction}
                        disabled={busy}
                        onClick={onSignOut}
                        type="button"
                      >
                        Logga ut från anonymt konto
                      </button>
                    </>
                  ) : (
                    <>
                      <div className={styles.savedAccountBox}>
                        {authState.email || "Inloggat konto"}
                      </div>
                      <input
                        className={styles.input}
                        onChange={(event) =>
                          setAccountPassword(event.target.value)
                        }
                        placeholder="Nytt lösenord"
                        type="password"
                        value={accountPassword}
                      />
                      <Button
                        disabled={busy}
                        fullWidth
                        onClick={onSaveAccount}
                        text={
                          busyAction === "account-save"
                            ? "Sparar..."
                            : "Spara lösenord"
                        }
                      />
                      <Button
                        disabled={busy}
                        fullWidth
                        minimal
                        onClick={onSignOut}
                        text={
                          busyAction === "sign-out"
                            ? "Loggar ut..."
                            : "Logga ut"
                        }
                      />
                    </>
                  )}
                  <div className={styles.dangerZone}>
                    <div>
                      <h3 className={styles.dangerTitle}>Ta bort konto</h3>
                      <p className={styles.helperText}>
                        Tar permanent bort din profil, dina ligor, medlemskap,
                        sparade enheter och dagliga resultat.
                      </p>
                    </div>
                    <button
                      className={styles.dangerButton}
                      disabled={busy}
                      onClick={onDeleteAccount}
                      type="button"
                    >
                      {busyAction === "account-delete"
                        ? "Tar bort..."
                        : "Ta bort konto"}
                    </button>
                  </div>
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
                    disabled={busy}
                    fullWidth
                    onClick={onJoinLeague}
                    text={
                      busyAction === "join" ? "Går med..." : "Gå med i liga"
                    }
                  />
                </section>
              </>
            )}

            {activeTab === "verify-email" && (
              <motion.section
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, type: "spring" }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4rem 1rem",
                  gap: "2rem",
                  textAlign: "center",
                  minHeight: "60vh",
                }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "50%",
                    padding: "2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "#a8c7fa" }}
                  >
                    <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    <path d="M19 16v6" />
                    <path d="M16 19h6" />
                  </svg>
                </motion.div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: "bold",
                      margin: 0,
                    }}
                  >
                    Kolla din e-post
                  </h2>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      lineHeight: 1.6,
                      maxWidth: "400px",
                      margin: "0 auto",
                    }}
                  >
                    Vi har skickat en länk till <strong>{accountEmail}</strong>.
                    Klicka på länken för att bekräfta ditt konto.
                  </p>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                      maxWidth: "400px",
                      margin: "0 auto",
                    }}
                  >
                    Om du stänger appen under tiden är det ingen fara. Du kan
                    bara öppna appen igen och logga in med din e-post och ditt
                    nya lösenord.
                  </p>
                </div>

                <div
                  style={{
                    width: "100%",
                    maxWidth: "320px",
                    marginTop: "1rem",
                  }}
                >
                  <Button
                    disabled={busy}
                    fullWidth
                    onClick={async () => {
                      setBusyAction("login");
                      setError(null);
                      try {
                        const state = await getLeagueAuthState();
                        setAuthState(state);
                        if (state.isAnonymous) {
                          setError(
                            "Vi väntar fortfarande på att du ska klicka på länken i mejlet. Om du stänger appen kan du bara logga in igen sedan.",
                          );
                        } else {
                          returnToList();
                        }
                      } catch (err) {
                        setError(getFriendlyError(err));
                      } finally {
                        setBusyAction(null);
                      }
                    }}
                    text={
                      busyAction === "login"
                        ? "Kollar..."
                        : "Jag har verifierat"
                    }
                  />
                </div>
              </motion.section>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
