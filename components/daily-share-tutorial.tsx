import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import React from "react";
import { createPortal } from "react-dom";
import {
  loadDailyShareTutorialStatus,
  saveDailyShareTutorialStatus,
  shouldStartDailyShareTutorial,
} from "../lib/daily-tutorial";
import * as styles from "../styles/daily-share-tutorial.css";

type TutorialStep = "hidden" | "intro" | "coach";
type ButtonLayout = {
  height: number;
  left: number;
  top: number;
  width: number;
};

interface Props {
  onShare: () => void | Promise<void>;
  score: number;
  shareText: string;
}

function ShareIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 16V3m0 0L7.5 7.5M12 3l4.5 4.5" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    </svg>
  );
}

function ShareDiagram({
  reduceMotion,
  score,
}: {
  reduceMotion: boolean;
  score: number;
}) {
  return (
    <div aria-hidden="true" className={styles.diagram}>
      <motion.div
        animate={
          reduceMotion ? undefined : { rotate: [-2, 1, -2], y: [0, -4, 0] }
        }
        className={styles.scoreTicket}
        transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
      >
        <span>VilketÅr</span>
        <strong>{score} poäng</strong>
        <small>Dagens spel</small>
      </motion.div>
      <motion.div
        animate={
          reduceMotion ? undefined : { opacity: [0.45, 1, 0.45], x: [0, 5, 0] }
        }
        className={styles.diagramArrow}
        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
      >
        →
      </motion.div>
      <div className={styles.miniMessage}>
        <span>Jag fick {score} poäng!</span>
        <strong>Kan du slå mig? 👀</strong>
      </div>
    </div>
  );
}

export default function DailyShareTutorial(props: Props) {
  const { onShare, score, shareText } = props;
  const reduceMotion = useReducedMotion();
  const [step, setStep] = React.useState<TutorialStep>("hidden");
  const [mounted, setMounted] = React.useState(false);
  const [buttonLayout, setButtonLayout] = React.useState<ButtonLayout | null>(
    null,
  );
  const [showCopiedToast, setShowCopiedToast] = React.useState(false);
  const introButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const shareButtonRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    setMounted(true);
    if (!shouldStartDailyShareTutorial(loadDailyShareTutorialStatus())) return;
    const timeoutId = window.setTimeout(
      () => setStep("intro"),
      reduceMotion ? 0 : 450,
    );
    return () => window.clearTimeout(timeoutId);
  }, [reduceMotion]);

  React.useEffect(() => {
    if (step === "intro") {
      const frameId = window.requestAnimationFrame(() =>
        introButtonRef.current?.focus(),
      );
      return () => window.cancelAnimationFrame(frameId);
    }
    if (step === "coach") shareButtonRef.current?.focus();
  }, [step]);

  React.useEffect(() => {
    if (step === "hidden") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        saveDailyShareTutorialStatus("skipped");
        setStep("hidden");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step]);

  React.useLayoutEffect(() => {
    if (step !== "coach") return;
    const measure = () => {
      const rect = shareButtonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setButtonLayout({
        height: rect.height,
        left: rect.left,
        top: rect.top,
        width: rect.width,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [step]);

  const skip = React.useCallback(() => {
    saveDailyShareTutorialStatus("skipped");
    setStep("hidden");
  }, []);

  const showCoach = React.useCallback(() => setStep("coach"), []);

  const share = React.useCallback(async () => {
    await onShare();
    if (step !== "coach") return;
    saveDailyShareTutorialStatus("completed");
    setStep("hidden");
    setShowCopiedToast(true);
    window.setTimeout(() => setShowCopiedToast(false), 3600);
  }, [onShare, step]);

  const tutorial = mounted
    ? createPortal(
        <>
          <AnimatePresence>
            {step === "intro" ? (
              <motion.div
                animate={{ opacity: 1 }}
                aria-describedby="daily-share-tutorial-description"
                aria-labelledby="daily-share-tutorial-title"
                aria-modal="true"
                className={styles.overlay}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                role="dialog"
                transition={{ duration: reduceMotion ? 0.1 : 0.24 }}
              >
                <motion.div
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={styles.modal}
                  initial={{ opacity: 0, scale: 0.96, y: 18 }}
                  transition={{
                    duration: reduceMotion ? 0.1 : 0.38,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <ShareDiagram reduceMotion={!!reduceMotion} score={score} />
                  <div className={styles.copy}>
                    <span className={styles.eyebrow}>Dela dagens resultat</span>
                    <h2
                      className={styles.title}
                      id="daily-share-tutorial-title"
                    >
                      Utmana någon du känner
                    </h2>
                    <p
                      className={styles.body}
                      id="daily-share-tutorial-description"
                    >
                      Dela din poäng och en länk till dagens spel. Då kan en vän
                      se ditt resultat och försöka slå dig.
                    </p>
                  </div>
                  <div className={styles.actions}>
                    <button
                      ref={introButtonRef}
                      className={styles.primaryButton}
                      onClick={showCoach}
                      type="button"
                    >
                      Visa mig
                    </button>
                    <button
                      className={styles.skipButton}
                      onClick={skip}
                      type="button"
                    >
                      Hoppa över
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {step === "coach" && buttonLayout ? (
              <motion.div
                animate={{ opacity: 1 }}
                className={styles.coachLayer}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.1 : 0.24 }}
              >
                <div
                  className={styles.spotlight}
                  style={{
                    height: buttonLayout.height + 16,
                    left: buttonLayout.left - 8,
                    top: buttonLayout.top - 8,
                    width: buttonLayout.width + 16,
                  }}
                />
                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                  aria-live="polite"
                  className={styles.coachCard}
                  role="status"
                  style={{
                    left: buttonLayout.left + buttonLayout.width / 2,
                    top: buttonLayout.top - 22,
                  }}
                  transition={{
                    duration: 1.6,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <span className={styles.coachEyebrow}>Din tur</span>
                  <strong>Tryck på Dela</strong>
                  <span>Din poäng kopieras direkt.</span>
                  <span aria-hidden="true" className={styles.coachArrow}>
                    ↓
                  </span>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {showCopiedToast ? (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                aria-live="polite"
                className={styles.copiedToast}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                initial={{ opacity: 0, scale: 0.96, y: -8 }}
                role="status"
              >
                <span aria-hidden="true">✓</span>
                <div>
                  <strong>Poängen är kopierad</strong>
                  <small>Klistra in den i ett meddelande.</small>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        ref={shareButtonRef}
        className={styles.shareButton}
        onClick={share}
        type="button"
      >
        <ShareIcon />
        <span>{shareText}</span>
      </button>
      {tutorial}
    </>
  );
}
