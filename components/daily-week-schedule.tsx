import classNames from "classnames";
import { getCurrentUtcDateKey } from "../lib/daily";
import {
  getDailyScheduleWeek,
  getDailyScheduleWeekday,
} from "../lib/daily-schedule";
import * as styles from "../styles/daily-week-schedule.css";

interface Props {
  compact?: boolean;
}

function ThemeIcon({ deckId }: { deckId: string | null }) {
  if (deckId?.includes("sport")) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
        <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
      </svg>
    );
  }
  if (deckId?.includes("music") || deckId?.includes("entertainment")) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    );
  }
  if (deckId?.includes("classic") || deckId?.includes("swedish")) {
    return (
      <svg
        width="16"
        height="11"
        viewBox="0 0 16 10"
        style={{
          borderRadius: "1.5px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          display: "block",
        }}
      >
        <rect width="16" height="10" fill="#006aa7" />
        <rect x="5" width="2" height="10" fill="#fecc00" />
        <rect y="4" width="16" height="2" fill="#fecc00" />
      </svg>
    );
  }
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function DailyWeekSchedule(props: Props) {
  const { compact = false } = props;
  const todayWeekday = getDailyScheduleWeekday(getCurrentUtcDateKey());
  const week = getDailyScheduleWeek();

  return (
    <section
      className={classNames(styles.schedule, {
        [styles.compact]: compact,
      })}
      id="veckoschema"
      aria-label="Veckans dagens spel"
    >
      <div className={styles.header}>
        <div className={styles.eyebrow}>Veckans schema</div>
        <div className={styles.title}>Dagens spel</div>
      </div>
      <div className={styles.week}>
        {week.map((day, index) => {
          const isToday = day.weekday === todayWeekday;
          const isSport = day.deckId?.includes("sport") ?? false;
          const isMusic =
            (day.deckId?.includes("music") ||
              day.deckId?.includes("entertainment")) ??
            false;
          const isClassic =
            (day.deckId?.includes("classic") ||
              day.deckId?.includes("swedish")) ??
            false;

          let displayLabel = day.label;
          if (day.shortLabel === "Klassiker") {
            displayLabel = "Svenska klassiker";
          }

          const isLast = index === week.length - 1;

          return (
            <div
              className={classNames(styles.day, {
                [styles.today]: isToday,
                [styles.featured]: day.deckId !== null,
                [styles.lastDay]: isLast,
                [styles.sportDay]: isSport,
                [styles.musicDay]: isMusic,
                [styles.classicDay]: isClassic,
              })}
              key={day.weekday}
            >
              <div className={styles.dayName}>{day.dayLabel}</div>

              <div className={styles.dayRight}>
                <div className={styles.iconContainer}>
                  <ThemeIcon deckId={day.deckId} />
                </div>
                <div className={styles.theme}>{displayLabel}</div>
                {isToday ? <div className={styles.todayLabel}>Idag</div> : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
