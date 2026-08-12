import classNames from "classnames";
import React from "react";
import { createPortal } from "react-dom";
import {
  disableLeaguePushNotifications,
  enableLeaguePushNotifications,
  getPushNotificationStatus,
  PushNotificationError,
  type PushNotificationStatus,
} from "../lib/push-notifications";
import * as styles from "../styles/league-notification.css";

const HOME_PROMPT_SEEN_KEY = "vilketar-league-push-prompt-seen";

type Props = {
  hasLeagues: boolean;
  surface: "home" | "leagues";
};

function NotificationIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="22"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="22"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="18"
    >
      <path d="M12 16V4m0 0L8 8m4-4 4 4M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="18"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function readHomePromptSeen(): boolean {
  try {
    return window.localStorage.getItem(HOME_PROMPT_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markHomePromptSeen() {
  try {
    window.localStorage.setItem(HOME_PROMPT_SEEN_KEY, "1");
  } catch {
    // The prompt still stays one-per-view when storage is unavailable.
  }
}

function getStatusCopy(status: PushNotificationStatus) {
  if (status === "granted") {
    return {
      description: "Du får en notis när någon i dina ligor spelar dagens spel.",
      title: "Liganotiser är på",
    };
  }

  if (status === "denied") {
    return {
      description:
        "Notiserna är avstängda i webbläsarens inställningar. Slå på dem där om du vill få liganotiser.",
      title: "Notiser är avstängda",
    };
  }

  if (status === "needs-install") {
    return {
      description: "Lägg först VilketÅr på hemskärmen. Det tar bara två tryck.",
      title: "Få liganotiser på iPhone",
    };
  }

  return {
    description:
      "Se direkt när någon i dina ligor har spelat dagens spel och hur många poäng de fick.",
    title: "Missa inte när ligan spelar",
  };
}

export default function LeagueNotificationPrompt({
  hasLeagues,
  surface,
}: Props) {
  const [status, setStatus] = React.useState<PushNotificationStatus | null>(
    null,
  );
  const [busy, setBusy] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [showGuide, setShowGuide] = React.useState(false);
  const [homeVisible, setHomeVisible] = React.useState(false);
  const primaryActionRef = React.useRef<HTMLButtonElement | null>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    if (!hasLeagues) {
      return;
    }

    const nextStatus = getPushNotificationStatus();
    setStatus(nextStatus);

    if (surface === "home") {
      const shouldShow =
        !readHomePromptSeen() &&
        (nextStatus === "default" || nextStatus === "needs-install");
      if (shouldShow) {
        markHomePromptSeen();
        setHomeVisible(true);
      }
    }
  }, [hasLeagues, surface]);

  React.useEffect(() => {
    if (surface !== "home" || !homeVisible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHomeVisible(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    primaryActionRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [homeVisible, surface]);

  if (
    !hasLeagues ||
    !status ||
    status === "unsupported" ||
    status === "not-configured"
  ) {
    return null;
  }

  if (surface === "home" && (!homeVisible || status === "granted")) {
    return null;
  }

  const copy = getStatusCopy(status);
  const isEnabled = status === "granted";
  const isIosInstallGuide = status === "needs-install";

  const action = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      if (isEnabled) {
        await disableLeaguePushNotifications();
        setStatus(getPushNotificationStatus());
        setFeedback("Liganotiserna är avstängda på den här enheten.");
      } else {
        await enableLeaguePushNotifications();
        setStatus("granted");
        setFeedback("Klart! Du får en notis nästa gång någon spelar.");
      }
    } catch (error) {
      if (
        error instanceof PushNotificationError &&
        error.code === "needs-install"
      ) {
        setShowGuide(true);
      }
      setFeedback(
        error instanceof Error ? error.message : "Kunde inte ändra notiserna.",
      );
    } finally {
      setBusy(false);
    }
  };

  const prompt = (
    <aside
      aria-labelledby={titleId}
      aria-live={surface === "home" ? undefined : "polite"}
      aria-modal={surface === "home" ? true : undefined}
      className={surface === "home" ? styles.homePrompt : styles.leaguePrompt}
      role={surface === "home" ? "dialog" : "status"}
    >
      <div className={styles.header}>
        <span className={styles.icon}>
          <NotificationIcon />
        </span>
        <div className={styles.copy}>
          <h2 className={styles.title} id={titleId}>
            {copy.title}
          </h2>
          <p className={styles.description}>{copy.description}</p>
        </div>
      </div>
      <div
        className={classNames(styles.actions, {
          [styles.homeActions]: surface === "home",
        })}
      >
        {isIosInstallGuide ? (
          <button
            className={classNames(styles.action, {
              [styles.homePrimaryAction]: surface === "home",
            })}
            onClick={() => setShowGuide((current) => !current)}
            ref={surface === "home" ? primaryActionRef : undefined}
            type="button"
          >
            {showGuide ? "Dölj" : "Visa hur"}
          </button>
        ) : status === "denied" ? null : (
          <button
            className={classNames(
              isEnabled ? styles.secondaryAction : styles.action,
              {
                [styles.homePrimaryAction]: surface === "home",
              },
            )}
            disabled={busy}
            onClick={() => void action()}
            ref={surface === "home" ? primaryActionRef : undefined}
            type="button"
          >
            {busy ? "Sparar..." : isEnabled ? "Stäng av" : "Aktivera notiser"}
          </button>
        )}
        {surface === "home" && !isEnabled ? (
          <button
            aria-label="Stäng förslaget om liganotiser"
            className={styles.dismissAction}
            onClick={() => setHomeVisible(false)}
            type="button"
          >
            Inte nu
          </button>
        ) : null}
      </div>
      {feedback ? <p className={styles.feedback}>{feedback}</p> : null}
      {showGuide && isIosInstallGuide ? (
        <div className={styles.guide}>
          <p className={styles.guideStep}>
            <span className={styles.guideNumber}>1</span>
            <span>Tryck på dela-knappen i Safari.</span>
            <ShareIcon />
          </p>
          <p className={styles.guideStep}>
            <span className={styles.guideNumber}>2</span>
            <span>Välj Lägg till på hemskärmen.</span>
            <PlusIcon />
          </p>
          <p className={styles.guideStep}>
            <span className={styles.guideNumber}>3</span>
            <span>Öppna VilketÅr från hemskärmen och aktivera notiser.</span>
          </p>
        </div>
      ) : null}
    </aside>
  );

  if (surface === "home") {
    return createPortal(
      <div
        className={styles.homeOverlay}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setHomeVisible(false);
          }
        }}
      >
        {prompt}
      </div>,
      document.body,
    );
  }

  return prompt;
}
