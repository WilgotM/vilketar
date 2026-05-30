import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getCurrentUtcDateKey } from "../lib/daily";
import {
  hasStartedDailyGameProgress,
  loadDailyGameSnapshot,
} from "../lib/daily-storage";
import ButtonLink from "./button-link";
import DailyWeekSchedule from "./daily-week-schedule";
import PageShell from "./page-shell";
import SiteFooter from "./site-footer";
import SiteHero from "./site-hero";
import { ThemeToggle } from "./theme-toggle";
import * as styles from "../styles/home-screen.css";

function ScatterDots() {
  return (
    <div className={styles.scatterDots} aria-hidden="true">
      <div
        className={styles.dot}
        style={{
          background: "#4E9FE5",
          height: 8,
          left: "52%",
          top: "12%",
          width: 8,
        }}
      />
      <div
        className={styles.dot}
        style={{
          background: "#E85D9C",
          height: 6,
          left: "12%",
          top: "62%",
          width: 6,
        }}
      />
      <div
        className={styles.dot}
        style={{
          background: "#4E9FE5",
          height: 7,
          right: "18%",
          top: "52%",
          width: 7,
        }}
      />
      <div
        className={styles.dot}
        style={{
          background: "#F5B731",
          height: 5,
          left: "8%",
          top: "38%",
          width: 5,
        }}
      />
      <div
        className={styles.dot}
        style={{
          background: "#9B59B6",
          height: 6,
          right: "6%",
          top: "68%",
          width: 6,
        }}
      />
    </div>
  );
}

function HeroDecorations() {
  return (
    <div className={styles.heroDecorations} aria-hidden="true">
      {/* City / 1949 */}
      <div className={styles.heroItemCity}>
        <Image
          alt=""
          className={styles.heroImageCity}
          height={240}
          priority
          src="/hero/city-1949.png"
          unoptimized
          width={240}
        />
        <div className={styles.yearBadge1949}>1949</div>
      </div>

      {/* Astronaut / 1969 */}
      <div className={styles.heroItemAstronaut}>
        <Image
          alt=""
          className={styles.heroImageAstronaut}
          height={220}
          priority
          src="/hero/astronaut-1969.png"
          unoptimized
          width={220}
        />
        <div className={styles.yearBadge1969}>1969</div>
      </div>

      {/* Radio / 1962 */}
      <div className={styles.heroItemRadio}>
        <Image
          alt=""
          className={styles.heroImageRadio}
          height={240}
          priority
          src="/hero/radio-1962.png"
          unoptimized
          width={240}
        />
        <div className={styles.yearBadge1962}>1962</div>
      </div>

      {/* Vinyl / 1974 */}
      <div className={styles.heroItemVinyl}>
        <Image
          alt=""
          className={styles.heroImageVinyl}
          height={260}
          priority
          src="/hero/vinyl-1974.png"
          unoptimized
          width={260}
        />
        <div className={styles.yearBadge1974}>1974</div>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="22"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="22"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect height="18" rx="2" width="18" x="3" y="4" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </svg>
  );
}

type DailyHomeStatus = "not-started" | "unfinished" | "completed";

function readDailyHomeStatus(): DailyHomeStatus {
  if (typeof window === "undefined") {
    return "completed";
  }

  const snapshot = loadDailyGameSnapshot();

  if (snapshot === null || snapshot.dateKey !== getCurrentUtcDateKey()) {
    return "not-started";
  }

  if (snapshot.lives <= 0) {
    return "completed";
  }

  return hasStartedDailyGameProgress(snapshot.dateKey)
    ? "unfinished"
    : "not-started";
}

export default function HomeScreen() {
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [calendarDragY, setCalendarDragY] = React.useState(0);
  const [calendarDragging, setCalendarDragging] = React.useState(false);
  const [calendarClosing, setCalendarClosing] = React.useState(false);
  const [dailyHomeStatus, setDailyHomeStatus] =
    React.useState<DailyHomeStatus>("completed");
  const calendarDragStartY = React.useRef<number | null>(null);
  const calendarDragYRef = React.useRef(0);
  const closeTimerRef = React.useRef<number | null>(null);

  const closeCalendar = React.useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }

    setCalendarClosing(true);
    setCalendarDragY(0);
    calendarDragYRef.current = 0;
    setCalendarDragging(false);
    calendarDragStartY.current = null;
    closeTimerRef.current = window.setTimeout(() => {
      setCalendarOpen(false);
      setCalendarClosing(false);
      closeTimerRef.current = null;
    }, 220);
  }, []);

  const showCalendar = React.useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setCalendarClosing(false);
    setCalendarDragY(0);
    calendarDragYRef.current = 0;
    setCalendarDragging(false);
    calendarDragStartY.current = null;
    setCalendarOpen(true);
  }, []);

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    const updateUnfinishedDailyGame = () => {
      setDailyHomeStatus(readDailyHomeStatus());
    };

    updateUnfinishedDailyGame();
    window.addEventListener("focus", updateUnfinishedDailyGame);
    window.addEventListener("storage", updateUnfinishedDailyGame);
    document.addEventListener("visibilitychange", updateUnfinishedDailyGame);

    return () => {
      window.removeEventListener("focus", updateUnfinishedDailyGame);
      window.removeEventListener("storage", updateUnfinishedDailyGame);
      document.removeEventListener(
        "visibilitychange",
        updateUnfinishedDailyGame,
      );
    };
  }, []);

  React.useEffect(() => {
    if (!calendarOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCalendar();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [calendarOpen, closeCalendar]);

  const startCalendarDrag = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      calendarDragStartY.current = event.clientY;
      setCalendarDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [],
  );

  const moveCalendarDrag = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (calendarDragStartY.current === null) {
        return;
      }

      const nextDragY = Math.max(0, event.clientY - calendarDragStartY.current);
      calendarDragYRef.current = nextDragY;
      setCalendarDragY(nextDragY);
    },
    [],
  );

  const finishCalendarDrag = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (calendarDragStartY.current === null) {
        return;
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      calendarDragStartY.current = null;
      setCalendarDragging(false);

      if (calendarDragYRef.current > 88) {
        closeCalendar();
        return;
      }

      calendarDragYRef.current = 0;
      setCalendarDragY(0);
    },
    [closeCalendar],
  );

  const dailyStatusBadge =
    dailyHomeStatus === "not-started"
      ? {
          className: styles.dailyStatusBadgeNew,
          text: "Ospelad",
        }
      : dailyHomeStatus === "unfinished"
        ? {
            className: styles.dailyStatusBadgeUnfinished,
            text: "Fortsätt",
          }
        : null;

  return (
    <PageShell showHeader={false}>
      <div className={styles.home}>
        <ThemeToggle />
        <ScatterDots />
        <div className={styles.wrapper}>
          <HeroDecorations />
          <div className={styles.stage}>
            <SiteHero subtitle="Placera svenska och historiska händelser i rätt år." />
            <div className={styles.actions}>
              <div className={styles.dailyActionRow}>
                <div className={styles.dailyActionSlot}>
                  <ButtonLink
                    className={styles.dailyAction}
                    href="/daily?intro=1"
                    leadingIcon="play"
                    text="Dagens spel"
                  />
                  {dailyStatusBadge ? (
                    <Link
                      className={dailyStatusBadge.className}
                      href={
                        dailyHomeStatus === "unfinished"
                          ? "/daily"
                          : "/daily?intro=1"
                      }
                    >
                      {dailyStatusBadge.text}
                    </Link>
                  ) : null}
                </div>
                <button
                  aria-label="Visa veckans schema för dagens spel"
                  aria-expanded={calendarOpen}
                  className={styles.calendarButton}
                  onClick={showCalendar}
                  type="button"
                >
                  <CalendarIcon />
                </button>
              </div>
              <ButtonLink
                className={styles.actionItem}
                fullWidth
                href="/leagues"
                leadingIcon="group"
                text="Vänligor"
              />
              <ButtonLink
                className={styles.actionItem}
                fullWidth
                href="/party"
                leadingIcon="group"
                minimal
                text="Sällskapsspel"
              />
              <ButtonLink
                className={styles.actionItem}
                fullWidth
                href="/play"
                leadingIcon="group"
                minimal
                text="Fritt spel"
              />
            </div>
          </div>
          <SiteFooter className={styles.footer} />
        </div>
        {calendarOpen ? (
          <div
            className={
              calendarClosing
                ? styles.calendarOverlayClosing
                : styles.calendarOverlay
            }
            onClick={closeCalendar}
          >
            <div
              aria-modal="true"
              className={
                calendarClosing
                  ? styles.calendarDialogClosing
                  : styles.calendarDialog
              }
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              style={{
                transform: `translateY(${calendarDragY}px)`,
                transition: calendarDragging ? "none" : undefined,
              }}
            >
              <button
                aria-label="Stäng kalender"
                className={styles.calendarHandle}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    closeCalendar();
                  }
                }}
                onPointerCancel={finishCalendarDrag}
                onPointerDown={startCalendarDrag}
                onPointerMove={moveCalendarDrag}
                onPointerUp={finishCalendarDrag}
                type="button"
              />
              <DailyWeekSchedule compact />
              <ButtonLink
                fullWidth
                href="/daily?intro=1"
                leadingIcon="play"
                onClick={closeCalendar}
                text="Gå till dagens spel"
              />
            </div>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
