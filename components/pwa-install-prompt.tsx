import React from "react";
import * as styles from "../styles/pwa-install-prompt.css";

const DISMISSED_KEY = "vilketar-pwa-install-dismissed-at";
const INSTALLED_KEY = "vilketar-pwa-installed-at";
const DISMISS_DAYS = 21;

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

function AppGlyph() {
  return (
    <svg aria-hidden="true" height="30" viewBox="0 0 32 32" width="30">
      <circle cx="16" cy="16" fill="currentColor" opacity="0.18" r="15" />
      <circle cx="16" cy="16" fill="currentColor" r="12" />
      <text
        dominantBaseline="middle"
        fill="white"
        fontFamily="Georgia, serif"
        fontSize="19"
        fontWeight="900"
        textAnchor="middle"
        x="16.5"
        y="17"
      >
        ?
      </text>
    </svg>
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

  React.useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/service-worker.js", { updateViaCache: "none" })
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

    const onAppInstalled = () => {
      rememberInstalled();
      setInstallEvent(null);
      setShowIosPrompt(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    const iosTimer = window.setTimeout(() => {
      setShowIosPrompt(
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
  }, [hasUserIntent]);

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
