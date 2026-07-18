import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import React from "react";
import { saveDailyTutorialStatus } from "../lib/daily-tutorial";
import * as buttonStyles from "../styles/button.css";
import * as styles from "../styles/daily-game-tutorial.css";

type TutorialStep = "intro" | "first-card" | "second-card" | "success";

interface TutorialLayout {
  deck: { height: number; left: number; top: number; width: number } | null;
  dragDelta: { x: number; y: number };
  dropMarkers: Array<{ x: number; y: number }>;
}

export interface DailyGameTutorialHandle {
  handleDragStart: () => void;
  handleDropAccepted: () => void;
  handleDropRejected: () => void;
  handlePlacementComplete: () => void;
}

interface Props {
  boardRef: React.MutableRefObject<HTMLDivElement | null>;
  bottomRef: React.MutableRefObject<HTMLDivElement | null>;
  deckAnchorRef: React.MutableRefObject<HTMLDivElement | null>;
  layoutKey: string;
  onFinished: () => void;
  ready: boolean;
}

const EMPTY_LAYOUT: TutorialLayout = {
  deck: null,
  dragDelta: { x: 0, y: 0 },
  dropMarkers: [],
};

function TutorialDiagram({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div aria-hidden="true" className={styles.diagram}>
      <div className={styles.diagramDeck}>
        <div className={styles.diagramBackCard} />
        <motion.div
          animate={
            reduceMotion
              ? { rotate: -3, y: 0 }
              : { rotate: [-3, -1, -3], y: [0, 12, 0] }
          }
          className={styles.diagramCard}
          transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
        >
          <span className={styles.diagramCardMark}>?</span>
        </motion.div>
      </div>
      <motion.svg
        animate={
          reduceMotion
            ? { opacity: 1, y: 0 }
            : { opacity: [0.45, 1, 0.45], y: [0, 5, 0] }
        }
        className={styles.diagramArrow}
        viewBox="0 0 32 52"
        transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
      >
        <path d="M16 2v42M6 34l10 10 10-10" />
      </motion.svg>
      <div className={styles.diagramTimeline}>
        <span className={styles.diagramYear}>1984</span>
        <span className={styles.diagramGap} />
        <span className={styles.diagramYear}>2007</span>
      </div>
    </div>
  );
}

const DailyGameTutorial = React.forwardRef<DailyGameTutorialHandle, Props>(
  function DailyGameTutorial(props, ref) {
    const { boardRef, bottomRef, deckAnchorRef, layoutKey, onFinished, ready } =
      props;
    const reduceMotion = useReducedMotion();
    const [step, setStep] = React.useState<TutorialStep>("intro");
    const [dragStarted, setDragStarted] = React.useState(false);
    const [placementPending, setPlacementPending] = React.useState(false);
    const [layout, setLayout] = React.useState<TutorialLayout>(EMPTY_LAYOUT);
    const startButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const visible = ready || step === "success" || placementPending;

    const finish = React.useCallback(
      (status: "completed" | "skipped") => {
        saveDailyTutorialStatus(status);
        onFinished();
      },
      [onFinished],
    );

    React.useImperativeHandle(
      ref,
      () => ({
        handleDragStart() {
          if (step === "first-card" || step === "second-card") {
            setDragStarted(true);
          }
        },
        handleDropAccepted() {
          if (step === "first-card" || step === "second-card") {
            setPlacementPending(true);
          }
        },
        handleDropRejected() {
          setDragStarted(false);
          setPlacementPending(false);
        },
        handlePlacementComplete() {
          if (step === "first-card") {
            setStep("second-card");
            setDragStarted(false);
            setPlacementPending(false);
            return;
          }

          if (step === "second-card") {
            saveDailyTutorialStatus("completed");
            setStep("success");
            setDragStarted(false);
            setPlacementPending(false);
          }
        },
      }),
      [step],
    );

    React.useEffect(() => {
      if (step !== "success") {
        return;
      }

      const timeoutId = window.setTimeout(
        onFinished,
        reduceMotion ? 500 : 1200,
      );
      return () => window.clearTimeout(timeoutId);
    }, [onFinished, reduceMotion, step]);

    React.useEffect(() => {
      if (step !== "intro" || !ready) {
        return;
      }

      const frameId = window.requestAnimationFrame(() => {
        startButtonRef.current?.focus();
      });
      return () => window.cancelAnimationFrame(frameId);
    }, [ready, step]);

    React.useEffect(() => {
      if (!visible) {
        return;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          finish("skipped");
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [finish, visible]);

    React.useLayoutEffect(() => {
      if (!visible || step === "intro" || step === "success") {
        return;
      }

      const measure = () => {
        const board = boardRef.current;
        const deck = deckAnchorRef.current;
        const bottom = bottomRef.current;
        if (!board || !deck || !bottom) {
          return;
        }

        const boardRect = board.getBoundingClientRect();
        const deckRect = deck.getBoundingClientRect();
        const bottomRect = bottom.getBoundingClientRect();
        const cardRects = Array.from(
          bottom.querySelectorAll<HTMLElement>("[data-card-id]"),
        )
          .map((element) => element.getBoundingClientRect())
          .sort((left, right) => left.left - right.left);
        const markerY =
          bottomRect.top -
          boardRect.top +
          Math.min(bottomRect.height * 0.45, 88);
        const markerXs: number[] = [];

        if (cardRects.length > 0) {
          markerXs.push(cardRects[0].left - boardRect.left - 12);
          for (let index = 0; index < cardRects.length - 1; index += 1) {
            markerXs.push(
              (cardRects[index].right + cardRects[index + 1].left) / 2 -
                boardRect.left,
            );
          }
          markerXs.push(
            cardRects[cardRects.length - 1].right - boardRect.left + 12,
          );
        }

        const deckLeft = deckRect.left - boardRect.left;
        const deckTop = deckRect.top - boardRect.top;
        const targetY =
          bottomRect.top - boardRect.top + bottomRect.height * 0.28;

        setLayout({
          deck: {
            height: deckRect.height,
            left: deckLeft,
            top: deckTop,
            width: deckRect.width,
          },
          dragDelta: {
            x: 0,
            y: Math.max(72, targetY - (deckTop + deckRect.height / 2)),
          },
          dropMarkers: markerXs.map((x) => ({
            x: Math.max(18, Math.min(boardRect.width - 18, x)),
            y: markerY,
          })),
        });
      };

      measure();
      const resizeObserver = new ResizeObserver(measure);
      const boardElement = boardRef.current;
      const bottomElement = bottomRef.current;
      const deckElement = deckAnchorRef.current;
      if (boardElement) resizeObserver.observe(boardElement);
      if (bottomElement) resizeObserver.observe(bottomElement);
      if (deckElement) resizeObserver.observe(deckElement);
      bottomElement?.addEventListener("scroll", measure, { passive: true });
      window.addEventListener("resize", measure);

      return () => {
        resizeObserver.disconnect();
        bottomElement?.removeEventListener("scroll", measure);
        window.removeEventListener("resize", measure);
      };
    }, [boardRef, bottomRef, deckAnchorRef, layoutKey, step, visible]);

    const coachCopy =
      step === "first-card"
        ? {
            body: "Släpp det före eller efter startkortets årtal.",
            count: "1 av 2",
            title: "Dra ner kortet",
          }
        : {
            body: "Släpp nästa kort före, mellan eller efter årtalen.",
            count: "2 av 2",
            title: "Hitta rätt plats",
          };

    return (
      <AnimatePresence>
        {visible ? (
          <motion.div
            animate={{ opacity: 1 }}
            className={styles.root}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.28 }}
          >
            {step === "intro" ? (
              <div
                aria-describedby="daily-tutorial-description"
                aria-labelledby="daily-tutorial-title"
                aria-modal="true"
                className={styles.introOverlay}
                role="dialog"
              >
                <motion.div
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={styles.introCard}
                  initial={{ opacity: 0, scale: 0.96, y: 18 }}
                  transition={{
                    duration: reduceMotion ? 0.12 : 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <TutorialDiagram reduceMotion={!!reduceMotion} />
                  <div className={styles.introCopy}>
                    <h2 className={styles.introTitle} id="daily-tutorial-title">
                      Så spelar du
                    </h2>
                    <p
                      className={styles.introBody}
                      id="daily-tutorial-description"
                    >
                      Dra kortet från högen till tidslinjen. Släpp det före,
                      mellan eller efter årtalen.
                    </p>
                  </div>
                  <div className={styles.introActions}>
                    <button
                      ref={startButtonRef}
                      className={buttonStyles.button}
                      onClick={() => setStep("first-card")}
                      type="button"
                    >
                      Visa mig
                    </button>
                    <button
                      className={styles.skipIntroButton}
                      onClick={() => finish("skipped")}
                      type="button"
                    >
                      Hoppa över
                    </button>
                  </div>
                </motion.div>
              </div>
            ) : step === "success" ? (
              <motion.div
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: "-50%",
                  y: "-50%",
                }}
                aria-live="polite"
                className={styles.successCard}
                initial={{
                  opacity: 0,
                  scale: 0.88,
                  x: "-50%",
                  y: "calc(-50% + 0.75rem)",
                }}
                role="status"
              >
                <span aria-hidden="true" className={styles.successIcon}>
                  ✓
                </span>
                <span>Precis så!</span>
              </motion.div>
            ) : (
              <>
                <motion.div
                  animate={{ opacity: 1 }}
                  aria-live="polite"
                  className={styles.coachCard}
                  initial={{ opacity: 0 }}
                  role="status"
                >
                  <div className={styles.coachHeader}>
                    <span className={styles.stepCount}>{coachCopy.count}</span>
                    <button
                      aria-label="Hoppa över guiden"
                      className={styles.skipCoachButton}
                      onClick={() => finish("skipped")}
                      type="button"
                    >
                      Hoppa över
                    </button>
                  </div>
                  <strong className={styles.coachTitle}>
                    {coachCopy.title}
                  </strong>
                  <span className={styles.coachBody}>
                    {placementPending
                      ? "Bra! Kortet läggs på tidslinjen."
                      : coachCopy.body}
                  </span>
                </motion.div>

                {!placementPending && layout.deck ? (
                  <>
                    <motion.div
                      animate={
                        reduceMotion
                          ? { opacity: 1, scale: 1 }
                          : {
                              opacity: [0.55, 1, 0.55],
                              scale: [1, 1.025, 1],
                            }
                      }
                      className={styles.deckHighlight}
                      style={{
                        height: layout.deck.height + 14,
                        left: layout.deck.left - 7,
                        top: layout.deck.top - 7,
                        width: layout.deck.width + 14,
                      }}
                      transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                      }}
                    />
                    {!dragStarted ? (
                      <motion.div
                        animate={
                          reduceMotion
                            ? { opacity: 1 }
                            : {
                                opacity: [0, 1, 1, 0],
                                x: [
                                  0,
                                  0,
                                  layout.dragDelta.x,
                                  layout.dragDelta.x,
                                ],
                                y: [
                                  0,
                                  0,
                                  layout.dragDelta.y,
                                  layout.dragDelta.y,
                                ],
                              }
                        }
                        className={styles.dragHand}
                        style={{
                          left: layout.deck.left + layout.deck.width / 2,
                          top: layout.deck.top + layout.deck.height / 2,
                        }}
                        transition={{
                          duration: 2.35,
                          ease: [0.22, 1, 0.36, 1],
                          repeat: Infinity,
                          times: [0, 0.2, 0.78, 1],
                        }}
                      >
                        <span className={styles.handPulse} />
                        <svg className={styles.handSvg} viewBox="0 0 44 58">
                          <path d="M18 29V9a5 5 0 0 1 10 0v16-5a5 5 0 0 1 10 0v17c0 11-7 18-18 18-7 0-12-4-16-10l-3-5a5 5 0 0 1 8-6l4 5V29a5 5 0 0 1 5-5Z" />
                        </svg>
                      </motion.div>
                    ) : null}
                    {layout.dropMarkers.map((marker, index) => (
                      <motion.span
                        key={`${step}:${index}`}
                        animate={
                          reduceMotion
                            ? { opacity: 1, scaleY: 1 }
                            : {
                                opacity: [0.5, 1, 0.5],
                                scaleY: [0.82, 1, 0.82],
                              }
                        }
                        className={styles.dropMarker}
                        style={{ left: marker.x, top: marker.y }}
                        transition={{
                          delay: index * 0.12,
                          duration: 1.25,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </>
                ) : null}
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  },
);

export default DailyGameTutorial;
