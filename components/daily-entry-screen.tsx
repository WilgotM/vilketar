import { motion } from "motion/react";
import React from "react";
import { DAILY_DIFFICULTY, formatTimeUntilNextDaily } from "../lib/daily";
import { getDailyScheduleTheme } from "../lib/daily-schedule";
import { buildShareText } from "../lib/share";
import DailyCompletedSummary from "./daily-completed-summary";
import { DAILY_DATE_LOCALE, formatDailyDate } from "./daily-meta-chips";
import DailyWeekSchedule from "./daily-week-schedule";
import PageShell from "./page-shell";
import * as styles from "../styles/daily-entry-screen.css";

interface Props {
  completedResults?: boolean[] | null;
  completedScore?: number | null;
  dailyDateKey: string;
  embedded?: boolean;
  isChecking?: boolean;
  onStart: () => void;
  statusText?: string | null;
}

const defaultShareText = "Dela";

function CalendarIllustration() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="36"
      height="36"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  );
}

export default function DailyEntryScreen(props: Props) {
  const {
    completedResults = null,
    completedScore = null,
    dailyDateKey,
    embedded = false,
    isChecking = false,
    onStart,
    statusText = null,
  } = props;
  const [nextDailyText, setNextDailyText] = React.useState(() =>
    formatTimeUntilNextDaily(new Date()),
  );
  const [shareText, setShareText] = React.useState(defaultShareText);
  const formattedDailyDate = React.useMemo(() => {
    return formatDailyDate(dailyDateKey, DAILY_DATE_LOCALE);
  }, [dailyDateKey]);
  const dailyTheme = React.useMemo(
    () => getDailyScheduleTheme(dailyDateKey),
    [dailyDateKey],
  );

  const formattedCapsuleDate = React.useMemo(() => {
    if (!formattedDailyDate) return "";
    const parts = formattedDailyDate.split(" ");
    if (parts.length >= 3) {
      const weekday = parts[0].toUpperCase();
      const day = parts[1];
      const month = parts[2].toUpperCase();
      return `${weekday} • ${day} ${month}`;
    }
    return formattedDailyDate.toUpperCase();
  }, [formattedDailyDate]);

  const themeDetails = React.useMemo(() => {
    if (!dailyTheme.deckId) {
      return {
        title: "Dagens spel",
        subtitle: (
          <>
            Placera sju historiska händelser i rätt tidsföljd. En ny utmaning
            väntar varje dag!
          </>
        ),
      };
    }

    if (dailyTheme.deckId.includes("sport")) {
      return {
        title: "Dagens Sport",
        subtitle: (
          <>
            Idag spelas det med temat{" "}
            <span className={styles.subtitleHighlight}>{dailyTheme.label}</span>
            . Kommer du ihåg de folkkära svenska sportögonblicken och bragderna?
          </>
        ),
      };
    }

    if (
      dailyTheme.deckId.includes("music") ||
      dailyTheme.deckId.includes("entertainment")
    ) {
      return {
        title: "Dagens Musik",
        subtitle: (
          <>
            Idag spelas det med temat{" "}
            <span className={styles.subtitleHighlight}>{dailyTheme.label}</span>
            . En underbar musikalisk resa genom legendariska hits, popgrupper
            och klassiker!
          </>
        ),
      };
    }

    if (
      dailyTheme.deckId.includes("classic") ||
      dailyTheme.deckId.includes("swedish")
    ) {
      return {
        title: "Svenska Klassiker",
        subtitle: (
          <>
            Idag spelas det med temat{" "}
            <span className={styles.subtitleHighlight}>{dailyTheme.label}</span>
            . Fylld med nostalgi, klassiska händelser och folkkära svenska
            milstolpar!
          </>
        ),
      };
    }

    return {
      title: "Dagens spel",
      subtitle: (
        <>
          Idag spelas det med temat{" "}
          <span className={styles.subtitleHighlight}>{dailyTheme.label}</span>.
          Tror du att du klarar alla korten utan att förlora dina liv?
        </>
      ),
    };
  }, [dailyTheme]);

  React.useEffect(() => {
    const updateNextDailyText = () => {
      setNextDailyText(formatTimeUntilNextDaily(new Date()));
    };

    updateNextDailyText();
    const intervalId = window.setInterval(updateNextDailyText, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const share = React.useCallback(async () => {
    if (completedScore === null) {
      return;
    }

    await navigator?.clipboard?.writeText(
      buildShareText({
        dateKey: dailyDateKey,
        difficulty: DAILY_DIFFICULTY,
        mode: "daily",
        path: "/daily",
        results: completedResults ?? undefined,
        score: completedScore,
      }),
    );
    setShareText("Kopierat");
    window.setTimeout(() => {
      setShareText(defaultShareText);
    }, 2000);
  }, [completedResults, completedScore, dailyDateKey]);

  const content = (
    <div className={styles.screen}>
      <div className={styles.stage}>
        <div className={styles.content}>
          {completedScore === null ? (
            <>
              <div className={styles.welcomeHeader}>
                <div className={styles.iconWrapper}>
                  <div className={styles.iconGlow} />
                  <CalendarIllustration />
                </div>

                <div className={styles.dateBadge}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: "1px" }}
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                  </svg>
                  {formattedCapsuleDate}
                </div>

                <h1 className={styles.iosTitle}>{themeDetails.title}</h1>
                <p className={styles.iosSubtitle}>{themeDetails.subtitle}</p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 22,
                  delay: 0.08,
                }}
              >
                <DailyWeekSchedule />
              </motion.div>

              {statusText ? (
                <p className={styles.statusText}>{statusText}</p>
              ) : null}

              <div className={styles.buttonContainer}>
                <motion.button
                  className={styles.iosWhiteButton}
                  disabled={isChecking}
                  onClick={onStart}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <span>
                    {isChecking ? "Kontrollerar..." : "Starta dagens spel"}
                  </span>
                  {!isChecking && <span className={styles.buttonArrow}>→</span>}
                </motion.button>
                <p className={styles.iosFooterText}>Du har 3 liv</p>
              </div>
            </>
          ) : (
            <>
              <DailyCompletedSummary
                dailyLabel={`Dagens spel / ${formattedDailyDate}`}
                dateKey={dailyDateKey}
                nextDailyText={nextDailyText}
                onShare={share}
                score={completedScore}
                shareText={shareText}
              />
              <DailyWeekSchedule />
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return <PageShell>{content}</PageShell>;
}
