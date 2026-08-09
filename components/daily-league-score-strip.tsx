import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import React from "react";
import {
  DailyLeagueScore,
  getCompactLeagueName,
} from "../lib/daily-league-scores";
import * as styles from "../styles/daily-league-score-strip.css";

interface Props {
  scores: DailyLeagueScore[];
}

const INLINE_SCORE_COUNT = 2;

function leagueLabel(leagueNames: string[]): string {
  return leagueNames.join(" · ");
}

export default function DailyLeagueScoreStrip({ scores }: Props) {
  const [open, setOpen] = React.useState(false);
  const reduceMotion = useReducedMotion();
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);
  const visibleScores = scores.slice(0, INLINE_SCORE_COUNT);
  const remainingCount = Math.max(0, scores.length - INLINE_SCORE_COUNT);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const trigger = triggerRef.current;
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [open]);

  if (scores.length === 0) {
    return null;
  }

  return (
    <>
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Ligan idag. ${scores.length} ligamedlemmar har spelat. Visa alla resultat.`}
        className={styles.strip}
        onClick={() => setOpen(true)}
        ref={triggerRef}
        type="button"
      >
        <span className={styles.stripLabel}>Ligan idag</span>
        <span aria-hidden="true" className={styles.inlineScores}>
          {visibleScores.map((score) => (
            <span className={styles.inlineScore} key={score.id}>
              <span className={styles.inlineName}>
                {getCompactLeagueName(score.displayName)}
              </span>
              <strong className={styles.inlinePoints}>{score.score} p</strong>
            </span>
          ))}
          {remainingCount > 0 ? (
            <span className={styles.moreCount}>+{remainingCount} till</span>
          ) : null}
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1 }}
            aria-labelledby="daily-league-scores-title"
            aria-modal="true"
            className={styles.overlay}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            role="dialog"
            transition={{
              duration: reduceMotion ? 0 : 0.18,
              ease: "easeOut",
            }}
          >
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={styles.modal}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.97, y: 8 }}
              initial={{
                opacity: 0,
                scale: reduceMotion ? 1 : 0.97,
                y: reduceMotion ? 0 : 8,
              }}
              onClick={(event) => event.stopPropagation()}
              transition={{
                duration: reduceMotion ? 0 : 0.2,
                ease: "easeOut",
              }}
            >
              <div className={styles.modalHeader}>
                <div>
                  <div className={styles.eyebrow}>Dagens spel</div>
                  <h2
                    className={styles.modalTitle}
                    id="daily-league-scores-title"
                  >
                    Ligaresultat idag
                  </h2>
                </div>
                <div className={styles.playedCount}>
                  {scores.length} har spelat
                </div>
              </div>

              <ol className={styles.scoreList}>
                {scores.map((score, index) => (
                  <li className={styles.scoreRow} key={score.id}>
                    <span className={styles.rank}>{index + 1}</span>
                    <span className={styles.avatar}>
                      {score.avatarDataUrl ? (
                        <Image
                          alt=""
                          className={styles.avatarImage}
                          height={40}
                          src={score.avatarDataUrl}
                          unoptimized
                          width={40}
                        />
                      ) : (
                        score.displayName.charAt(0).toLocaleUpperCase("sv") ||
                        "?"
                      )}
                    </span>
                    <span className={styles.person}>
                      <span className={styles.personName}>
                        {score.displayName}
                      </span>
                      <span className={styles.leagueNames}>
                        {leagueLabel(score.leagueNames)}
                      </span>
                    </span>
                    <strong className={styles.score}>{score.score} p</strong>
                  </li>
                ))}
              </ol>

              <button
                className={styles.closeButton}
                onClick={() => setOpen(false)}
                ref={closeRef}
                type="button"
              >
                Stäng
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
