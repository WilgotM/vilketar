import Image from "next/image";
import Link from "next/link";
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
import { disableLeaguePushNotifications } from "../lib/push-notifications";
import { getShareResults } from "../lib/share";
import LeagueWorkspace from "./league-workspace";
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

type IconProps = {
  size?: number;
};

function ChevronIcon({ size = 16 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d="m8 10 4 4 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}

type LeagueFormPanelProps = {
  busy?: boolean;
  children: React.ReactNode;
  description: React.ReactNode;
  title: React.ReactNode;
};

function LeagueFormPanel({
  busy = false,
  children,
  description,
  title,
}: LeagueFormPanelProps) {
  return (
    <section aria-busy={busy || undefined} className={styles.formPanel}>
      <div className={styles.formLead}>
        <div className={styles.formHeading}>
          <h1 className={styles.formTitle}>{title}</h1>
          <p className={styles.helperText}>{description}</p>
        </div>
      </div>
      <div className={styles.formBody}>{children}</div>
    </section>
  );
}

type LeagueFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  monospaced?: boolean;
};

function LeagueField({
  label,
  monospaced = false,
  ...inputProps
}: LeagueFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <input
        {...inputProps}
        className={monospaced ? styles.codeInput : styles.input}
      />
    </label>
  );
}

type LeagueFormActionProps = {
  disabled?: boolean;
  onClick: () => void;
  text: string;
  tone?: "primary" | "secondary";
};

function LeagueFormAction({
  disabled = false,
  onClick,
  text,
  tone = "primary",
}: LeagueFormActionProps) {
  return (
    <button
      className={
        tone === "primary"
          ? styles.formPrimaryAction
          : styles.formSecondaryAction
      }
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  );
}

type ProfileIdentityEditorProps = {
  avatarDataUrl: string | null;
  busy: boolean;
  displayName: string;
  onAvatarChange: React.ChangeEventHandler<HTMLInputElement>;
  onRemoveAvatar?: () => void;
  pickerLabel: string;
};

function ProfileIdentityEditor({
  avatarDataUrl,
  busy,
  displayName,
  onAvatarChange,
  onRemoveAvatar,
  pickerLabel,
}: ProfileIdentityEditorProps) {
  return (
    <div className={styles.profileIdentity}>
      <div className={styles.avatarPreviewLarge}>
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
          <span>{displayName.trim().charAt(0).toUpperCase() || "?"}</span>
        )}
      </div>
      <div className={styles.profileImageActions}>
        <label className={styles.avatarPicker}>
          <input
            accept="image/*"
            className={styles.hiddenFileInput}
            disabled={busy}
            onChange={onAvatarChange}
            type="file"
          />
          {pickerLabel}
        </label>
        {avatarDataUrl && onRemoveAvatar ? (
          <button
            className={styles.smallAction}
            disabled={busy}
            onClick={onRemoveAvatar}
            type="button"
          >
            Ta bort bild
          </button>
        ) : null}
      </div>
    </div>
  );
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
  const configured = isLeaguesConfigured();
  const [displayName, setDisplayName] = React.useState("");
  const [avatarDataUrl, setAvatarDataUrl] = React.useState<string | null>(null);
  const [profileStatusText, setProfileStatusText] = React.useState<
    string | null
  >(null);
  const [profileReady, setProfileReady] = React.useState(false);
  const [authReady, setAuthReady] = React.useState(!configured);
  const [profileLoaded, setProfileLoaded] = React.useState(!configured);
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
  const profileMenuRef = React.useRef<HTMLDetailsElement>(null);
  const savedNameHandledRef = React.useRef(false);
  const busy = busyAction !== null;

  const [activeTab, setActiveTab] = React.useState<Tab>("list");

  const openTab = React.useCallback((nextTab: Tab) => {
    profileMenuRef.current?.removeAttribute("open");
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
    try {
      const nextAuthState = await getLeagueAuthState();
      setAuthState(nextAuthState);
      if (nextAuthState.email) {
        setAccountEmail(nextAuthState.email);
      }
    } finally {
      setAuthReady(true);
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
    if (!configured || !authReady) {
      return;
    }

    if (!authState.isSignedIn) {
      setProfileLoaded(true);
      return;
    }

    setProfileLoaded(false);
    void getLeagueProfile()
      .then((profile) => {
        if (!profile) {
          return;
        }
        setDisplayName(profile.displayName);
        setAvatarDataUrl(profile.avatarDataUrl);
        setProfileReady(true);
      })
      .catch(() => undefined)
      .finally(() => {
        setProfileLoaded(true);
      });
  }, [authReady, authState.isSignedIn, configured]);

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
      await disableLeaguePushNotifications();
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
      await disableLeaguePushNotifications();
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

  const isBootstrapping =
    configured &&
    (!authReady || (authState.isSignedIn && !profileReady && !profileLoaded));

  return (
    <PageShell>
      <div className={styles.screen}>
        {profileReady && activeTab === "list" ? (
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <h1 className={styles.title}>Vänligor</h1>
              <p className={styles.intro}>Spela veckan tillsammans</p>
            </div>
            <details className={styles.profileMenu} ref={profileMenuRef}>
              <summary
                aria-label="Öppna profil och konto"
                className={styles.profileTrigger}
              >
                <span className={styles.profileTriggerAvatar}>
                  {avatarDataUrl ? (
                    <Image
                      alt=""
                      className={styles.avatarImage}
                      height={44}
                      src={avatarDataUrl}
                      unoptimized
                      width={44}
                    />
                  ) : (
                    displayName.trim().charAt(0).toUpperCase() || "?"
                  )}
                </span>
                <ChevronIcon />
              </summary>
              <div className={styles.profileDropdown}>
                <div className={styles.profileDropdownName}>{displayName}</div>
                <button
                  className={styles.profileDropdownAction}
                  onClick={() => openTab("profile")}
                  type="button"
                >
                  Profil
                </button>
                <button
                  className={styles.profileDropdownAction}
                  onClick={() => openTab("account")}
                  type="button"
                >
                  Konto
                </button>
              </div>
            </details>
          </section>
        ) : null}

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
          <LeagueFormPanel
            description="Hämta dina ligor och fortsätt där du slutade."
            title="Välkommen tillbaka"
          >
            <LeagueField
              autoComplete="email"
              inputMode="email"
              label="E-postadress"
              onChange={(event) => setAccountEmail(event.target.value)}
              placeholder="namn@exempel.se"
              type="email"
              value={accountEmail}
            />
            <LeagueField
              autoComplete="current-password"
              label="Lösenord"
              onChange={(event) => setAccountPassword(event.target.value)}
              placeholder="Skriv ditt lösenord"
              type="password"
              value={accountPassword}
            />
            <LeagueFormAction
              disabled={busy}
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
          </LeagueFormPanel>
        ) : activeTab === "forgot" ? (
          <LeagueFormPanel
            description="Vi skickar en säker länk så att du kan välja ett nytt lösenord."
            title="Återställ lösenord"
          >
            <LeagueField
              autoComplete="email"
              inputMode="email"
              label="E-postadress"
              onChange={(event) => setAccountEmail(event.target.value)}
              placeholder="namn@exempel.se"
              type="email"
              value={accountEmail}
            />
            <LeagueFormAction
              disabled={busy}
              onClick={onSendPasswordReset}
              text={
                busyAction === "password-reset"
                  ? "Skickar..."
                  : "Skicka återställningsmejl"
              }
              tone="secondary"
            />
            <div className={styles.formDivider}>
              <span className={styles.formDividerLabel}>
                Har du redan öppnat länken?
              </span>
            </div>
            <LeagueField
              autoComplete="new-password"
              label="Nytt lösenord"
              onChange={(event) => setAccountPassword(event.target.value)}
              placeholder="Välj ett nytt lösenord"
              type="password"
              value={accountPassword}
            />
            <LeagueFormAction
              disabled={busy}
              onClick={onUpdatePassword}
              text={
                busyAction === "password-update"
                  ? "Sparar..."
                  : "Spara nytt lösenord"
              }
            />
          </LeagueFormPanel>
        ) : isBootstrapping ? (
          <LeagueFormPanel
            busy
            description="Hämtar din inloggning och profil."
            title="Laddar vänligor..."
          >
            <div className={styles.loadingTrack}>
              <span className={styles.loadingIndicator} />
            </div>
          </LeagueFormPanel>
        ) : !profileReady ? (
          <LeagueFormPanel
            description="Välj namnet dina vänner ser i ligan. Du behöver ingen e-post för att börja."
            title="Skapa din spelarprofil"
          >
            <ProfileIdentityEditor
              avatarDataUrl={avatarDataUrl}
              busy={busy}
              displayName={displayName}
              onAvatarChange={onAvatarChange}
              pickerLabel="Lägg till bild"
            />
            {profileStatusText ? (
              <div className={styles.inlineStatus}>{profileStatusText}</div>
            ) : null}
            <LeagueField
              autoComplete="nickname"
              label="Ditt namn"
              maxLength={40}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Till exempel Ingrid"
              value={displayName}
            />
            <LeagueFormAction
              disabled={busy}
              onClick={saveName}
              text={
                busyAction === "profile" || busyAction === "profile-bootstrap"
                  ? "Sparar..."
                  : "Fortsätt"
              }
            />
            <button
              className={styles.textAction}
              onClick={() => {
                openTab("login");
              }}
              type="button"
            >
              Jag har redan konto
            </button>
          </LeagueFormPanel>
        ) : (
          <>
            {activeTab === "list" ? (
              <LeagueWorkspace
                busy={busy}
                copyText={copyText}
                editingLeagueId={editingLeagueId}
                editingLeagueName={editingLeagueName}
                leagues={leagues}
                onCopyCode={copyCode}
                onCreate={() => openTab("create")}
                onDeleteLeague={onDeleteLeague}
                onEditingLeagueIdChange={setEditingLeagueId}
                onEditingLeagueNameChange={setEditingLeagueName}
                onJoin={() => openTab("join")}
                onRemoveMember={onRemoveMember}
                onRenameLeague={onRenameLeague}
              />
            ) : null}

            {activeTab === "profile" && (
              <LeagueFormPanel
                description="Så här syns du för alla i dina ligor."
                title="Din spelarprofil"
              >
                <ProfileIdentityEditor
                  avatarDataUrl={avatarDataUrl}
                  busy={busy}
                  displayName={displayName}
                  onAvatarChange={onAvatarChange}
                  onRemoveAvatar={() => {
                    setAvatarDataUrl(null);
                    setProfileStatusText("Bilden tas bort när du sparar.");
                  }}
                  pickerLabel="Byt bild"
                />
                <LeagueField
                  autoComplete="nickname"
                  label="Ditt namn"
                  maxLength={40}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Ditt namn"
                  value={displayName}
                />
                <LeagueFormAction
                  disabled={busy}
                  onClick={saveName}
                  text={busyAction === "profile" ? "Sparar..." : "Spara profil"}
                />
                {profileStatusText ? (
                  <div className={styles.inlineStatus}>{profileStatusText}</div>
                ) : null}
              </LeagueFormPanel>
            )}

            {activeTab === "create" && (
              <LeagueFormPanel
                description="Du får en kod som är enkel att dela med vännerna."
                title="Skapa en ny liga"
              >
                <LeagueField
                  autoComplete="off"
                  label="Ligans namn"
                  maxLength={48}
                  onChange={(event) => setLeagueName(event.target.value)}
                  placeholder="Till exempel Familjen"
                  value={leagueName}
                />
                <LeagueFormAction
                  disabled={busy}
                  onClick={onCreateLeague}
                  text={busyAction === "create" ? "Skapar..." : "Skapa liga"}
                />
                <p className={styles.formFootnote}>
                  Du blir automatiskt ligans administratör.
                </p>
              </LeagueFormPanel>
            )}

            {activeTab === "account" && (
              <LeagueFormPanel
                description={
                  authState.isAnonymous
                    ? "Frivilligt, men gör att ligorna följer med om du byter telefon."
                    : "Använd samma e-post för att logga in på en annan enhet."
                }
                title={
                  authState.isAnonymous ? "Spara ditt konto" : "Ditt konto"
                }
              >
                {authState.isAnonymous ? (
                  <>
                    <LeagueField
                      autoComplete="email"
                      inputMode="email"
                      label="E-postadress"
                      onChange={(event) => setAccountEmail(event.target.value)}
                      placeholder="namn@exempel.se"
                      type="email"
                      value={accountEmail}
                    />
                    <LeagueField
                      autoComplete="new-password"
                      label="Välj lösenord"
                      onChange={(event) =>
                        setAccountPassword(event.target.value)
                      }
                      placeholder="Minst sex tecken"
                      type="password"
                      value={accountPassword}
                    />
                    <LeagueFormAction
                      disabled={busy}
                      onClick={onSaveAccount}
                      text={
                        busyAction === "account-save"
                          ? "Sparar..."
                          : "Spara konto"
                      }
                    />
                    <p className={styles.legalText}>
                      Genom att spara kontot godkänner du våra{" "}
                      <Link href="/villkor" target="_blank">
                        användarvillkor
                      </Link>{" "}
                      och samtycker till att vi behandlar din e-post enligt vår{" "}
                      <Link href="/integritet" target="_blank">
                        integritetspolicy
                      </Link>
                      .
                    </p>
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
                    <div className={styles.accountIdentity}>
                      <span className={styles.accountIdentityLabel}>
                        Inloggad som
                      </span>
                      <strong className={styles.accountIdentityValue}>
                        {authState.email || "Inloggat konto"}
                      </strong>
                    </div>
                    <LeagueField
                      autoComplete="new-password"
                      label="Nytt lösenord"
                      onChange={(event) =>
                        setAccountPassword(event.target.value)
                      }
                      placeholder="Välj ett nytt lösenord"
                      type="password"
                      value={accountPassword}
                    />
                    <LeagueFormAction
                      disabled={busy}
                      onClick={onSaveAccount}
                      text={
                        busyAction === "account-save"
                          ? "Sparar..."
                          : "Spara lösenord"
                      }
                    />
                    <LeagueFormAction
                      disabled={busy}
                      onClick={onSignOut}
                      text={
                        busyAction === "sign-out" ? "Loggar ut..." : "Logga ut"
                      }
                      tone="secondary"
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
              </LeagueFormPanel>
            )}

            {activeTab === "join" && (
              <LeagueFormPanel
                description="Skriv in koden du fått av en vän. Du kan vara med i flera ligor samtidigt."
                title="Gå med i en liga"
              >
                <LeagueField
                  autoCapitalize="characters"
                  autoComplete="off"
                  label="Ligakod"
                  maxLength={6}
                  monospaced
                  onChange={(event) =>
                    setJoinCode(event.target.value.toUpperCase())
                  }
                  placeholder="ABC123"
                  value={joinCode}
                />
                <LeagueFormAction
                  disabled={busy}
                  onClick={onJoinLeague}
                  text={busyAction === "join" ? "Går med..." : "Gå med i liga"}
                />
                <p className={styles.formFootnote}>
                  Koden består av sex bokstäver och siffror.
                </p>
              </LeagueFormPanel>
            )}

            {activeTab === "verify-email" && (
              <LeagueFormPanel
                description="Öppna länken vi skickade för att säkra ditt konto."
                title="Kolla din e-post"
              >
                <div className={styles.verifyAddress}>
                  <span className={styles.accountIdentityLabel}>
                    Länken skickades till
                  </span>
                  <strong className={styles.accountIdentityValue}>
                    {accountEmail}
                  </strong>
                </div>
                <p className={styles.formFootnote}>
                  Du kan stänga appen under tiden. När du kommer tillbaka loggar
                  du bara in med din e-post och ditt nya lösenord.
                </p>
                <LeagueFormAction
                  disabled={busy}
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
                    busyAction === "login" ? "Kollar..." : "Jag har verifierat"
                  }
                />
              </LeagueFormPanel>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
