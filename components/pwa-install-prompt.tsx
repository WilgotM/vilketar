import React from "react";
import * as styles from "../styles/pwa-install-prompt.css";

const DISMISSED_KEY = "vilketar-pwa-install-dismissed-at";
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
  try {
    window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  } catch {
    // Safari private browsing can reject storage; closing should still work.
  }
}

function safeGetDismissedAt() {
  try {
    return window.localStorage.getItem(DISMISSED_KEY);
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

  React.useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      // Installation still works as a normal website if registration fails.
    });
  }, []);

  React.useEffect(() => {
    if (isStandalone() || isDismissedRecently()) {
      return;
    }

    const onBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      if (!isLikelyAndroid()) {
        return;
      }

      event.preventDefault();
      setInstallEvent(event);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    const iosTimer = window.setTimeout(() => {
      setShowIosPrompt(
        isIosSafari() && !isStandalone() && !isDismissedRecently(),
      );
    }, 2800);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.clearTimeout(iosTimer);
    };
  }, []);

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
    await installEvent.userChoice.catch(() => null);
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
              Starta snabbare, spela mer helskärm och få en appkänsla på
              Android.
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
