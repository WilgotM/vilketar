import React from "react";
import * as styles from "../styles/pwa-install-prompt.css";

const DISMISSED_KEY = "vilketar-pwa-install-dismissed-at";
const INSTALLED_KEY = "vilketar-pwa-installed-at";
const VISITED_DAYS_KEY = "vilketar-pwa-visited-days";
const REQUIRED_VISITED_DAYS = 5;
const DISMISS_DAYS = 21;

function getLocalDateKey() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

function recordVisitedDay() {
  const today = getLocalDateKey();
  const storedDays = safeGetItem(VISITED_DAYS_KEY);
  let visitedDays: string[] = [];

  if (storedDays) {
    try {
      const parsed = JSON.parse(storedDays);
      if (Array.isArray(parsed)) {
        visitedDays = parsed.filter(
          (value): value is string => typeof value === "string",
        );
      }
    } catch {
      // Ignore malformed visit history and start a new one.
    }
  }

  if (!visitedDays.includes(today)) {
    visitedDays.push(today);
    safeSetItem(VISITED_DAYS_KEY, JSON.stringify(visitedDays));
  }

  return visitedDays.length;
}

function isDismissedRecently() {
  if (typeof window === "undefined") {
    return true;
  }

  const value = safeGetDismissedAt();
  if (!value) {
    return false;
  }

  const dismissedAt = Number(value);
  if (!Number.isFinite(dismissedAt)) {
    return false;
  }

  return Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

function isKnownInstalled() {
  if (typeof window === "undefined") {
    return true;
  }

  return safeGetItem(INSTALLED_KEY) !== null;
}

function isStandalone() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isIosSafari() {
  if (typeof window === "undefined") {
    return false;
  }

  const ua = window.navigator.userAgent;
  const isIos =
    /iPad|iPhone|iPod/.test(ua) ||
    (window.navigator.platform === "MacIntel" &&
      window.navigator.maxTouchPoints > 1);
  const isWebKit = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);

  return isIos && isWebKit;
}

function isLikelyAndroid() {
  if (typeof window === "undefined") {
    return false;
  }

  return /Android/i.test(window.navigator.userAgent);
}

function dismiss() {
  safeSetItem(DISMISSED_KEY, String(Date.now()));
}

function rememberInstalled() {
  safeSetItem(INSTALLED_KEY, String(Date.now()));
}

function safeSetItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Safari private browsing can reject storage; closing should still work.
  }
}

function safeGetDismissedAt() {
  return safeGetItem(DISMISSED_KEY);
}

function safeGetItem(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function getServiceWorkerUrl() {
  try {
    const nextData = document.getElementById("__NEXT_DATA__")?.textContent;
    if (!nextData) {
      return "/service-worker.js";
    }

    const parsed = JSON.parse(nextData) as { buildId?: unknown };
    return typeof parsed.buildId === "string"
      ? `/service-worker.js?v=${encodeURIComponent(parsed.buildId)}`
      : "/service-worker.js";
  } catch {
    return "/service-worker.js";
  }
}

function AppGlyph() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt="VilketÅr logotyp"
      className={styles.appIconImage}
      draggable={false}
      src="/logo-with-bg.svg"
    />
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <path
        d="M12 16V4m0 0L8 8m4-4 4 4M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] =
    React.useState<BeforeInstallPromptEvent | null>(null);
  const [showIosPrompt, setShowIosPrompt] = React.useState(false);
  const [hasUserIntent, setHasUserIntent] = React.useState(false);
  const [hasVisitedEnoughDays, setHasVisitedEnoughDays] = React.useState(false);
  const pendingInstallEvent = React.useRef<BeforeInstallPromptEvent | null>(
    null,
  );

  React.useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register(getServiceWorkerUrl(), { updateViaCache: "none" })
      .then((registration) => {
        registration.update().catch(() => null);

        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
      })
      .catch(() => {
        // Installation still works as a normal website if registration fails.
      });
  }, []);

  React.useEffect(() => {
    const visitedDays = recordVisitedDay();
    setHasVisitedEnoughDays(visitedDays >= REQUIRED_VISITED_DAYS);
  }, []);

  React.useEffect(() => {
    const standalone = isStandalone();
    document.documentElement.toggleAttribute("data-pwa-standalone", standalone);

    if (standalone) {
      rememberInstalled();
    }
  }, []);

  React.useEffect(() => {
    const markIntent = () => {
      setHasUserIntent(true);
    };
    const intentTimer = window.setTimeout(markIntent, 6500);

    window.addEventListener("pointerdown", markIntent, { once: true });
    window.addEventListener("keydown", markIntent, { once: true });

    return () => {
      window.clearTimeout(intentTimer);
      window.removeEventListener("pointerdown", markIntent);
      window.removeEventListener("keydown", markIntent);
    };
  }, []);

  React.useEffect(() => {
    if (isStandalone() || isKnownInstalled() || isDismissedRecently()) {
      return;
    }

    const onBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      if (!isLikelyAndroid()) {
        return;
      }

      event.preventDefault();
      pendingInstallEvent.current = event;
      if (!hasVisitedEnoughDays) {
        return;
      }

      if (hasUserIntent) {
        setInstallEvent(event);
      } else {
        const showWhenReady = () => {
          setInstallEvent(event);
        };
        window.addEventListener("pointerdown", showWhenReady, { once: true });
        window.setTimeout(showWhenReady, 6500);
      }
    };

    if (pendingInstallEvent.current && hasVisitedEnoughDays) {
      if (hasUserIntent) {
        setInstallEvent(pendingInstallEvent.current);
      } else {
        const showWhenReady = () => {
          if (pendingInstallEvent.current) {
            setInstallEvent(pendingInstallEvent.current);
          }
        };
        window.addEventListener("pointerdown", showWhenReady, { once: true });
        window.setTimeout(showWhenReady, 6500);
      }
    }

    const onAppInstalled = () => {
      rememberInstalled();
      setInstallEvent(null);
      setShowIosPrompt(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    const iosTimer = window.setTimeout(() => {
      setShowIosPrompt(
        hasVisitedEnoughDays &&
          hasUserIntent &&
          isIosSafari() &&
          !isStandalone() &&
          !isKnownInstalled() &&
          !isDismissedRecently(),
      );
    }, 1200);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      window.clearTimeout(iosTimer);
    };
  }, [hasUserIntent, hasVisitedEnoughDays]);

  const close = React.useCallback(() => {
    dismiss();
    setInstallEvent(null);
    setShowIosPrompt(false);
  }, []);

  const install = React.useCallback(async () => {
    if (!installEvent) {
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice.catch(() => null);
    if (choice?.outcome === "accepted") {
      rememberInstalled();
    }
    setInstallEvent(null);
  }, [installEvent]);

  if (installEvent) {
    return (
      <aside className={styles.prompt} role="status" aria-live="polite">
        <div className={styles.topRow}>
          <div className={styles.appIcon}>
            <AppGlyph />
          </div>
          <div className={styles.copy}>
            <p className={styles.title}>Lägg VilketÅr på hemskärmen</p>
            <p className={styles.text}>
              Starta snabbare, spela helskärm och öppna direkt från din
              hemskärm.
            </p>
          </div>
          <button
            aria-label="Stäng"
            className={styles.closeButton}
            onClick={close}
            type="button"
          >
            <CloseIcon />
          </button>
        </div>
        <button
          className={styles.installButton}
          onClick={install}
          type="button"
        >
          Lägg till som app
        </button>
      </aside>
    );
  }

  if (showIosPrompt) {
    return (
      <aside className={styles.prompt} role="status" aria-live="polite">
        <div className={styles.topRow}>
          <div className={styles.appIcon}>
            <AppGlyph />
          </div>
          <div className={styles.copy}>
            <p className={styles.title}>VilketÅr kan bli en app</p>
            <p className={styles.text}>
              På iPhone lägger du till den från Safari. Det tar bara två tryck.
            </p>
          </div>
          <button
            aria-label="Stäng"
            className={styles.closeButton}
            onClick={close}
            type="button"
          >
            <CloseIcon />
          </button>
        </div>
        <div className={styles.steps} aria-label="Lägg till på hemskärmen">
          <div className={styles.safariBar} aria-hidden="true">
            <span className={styles.safariUrl}>vilketår.se</span>
            <span className={styles.safariShare}>
              <ShareIcon />
            </span>
          </div>
          <div className={styles.step}>
            <span className={styles.stepIcon}>
              <ShareIcon />
            </span>
            <p className={styles.stepText}>Tryck på dela-knappen i Safari.</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepIcon}>
              <PlusIcon />
            </span>
            <p className={styles.stepText}>Välj Lägg till på hemskärmen.</p>
          </div>
        </div>
      </aside>
    );
  }

  return null;
}
