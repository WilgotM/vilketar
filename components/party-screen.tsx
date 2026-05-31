import classNames from "classnames";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import React from "react";
import {
  getAllSelectionRoute,
  getGroupAllSelectionRouteForNode,
  getLeafSelectionRoute,
  getLeafSelectionRouteForNode,
  getSelectionRouteShareLabel,
} from "../lib/categories";
import { collectLeafDeckIds } from "../lib/deck-tree";
import {
  getSupportedDifficultiesForDeckId,
  hasVisibleGroupChildren,
  isSelectionRouteVisible,
} from "../lib/free-play-difficulty-rules";
import { FEATURED_FREE_PLAY_DECKS } from "../lib/free-play-navigation";
import {
  createStateWithRetry,
  filterCardsBySelectionRoute,
  resolveSelectionDeck,
} from "../lib/game-state";
import {
  createPartyGameState,
  getActivePartyTeam,
  normalizePartyTeamNames,
  placePartyCard,
} from "../lib/party-state";
import { createSeededRandom } from "../lib/seeded-random";
import { GameDifficulty } from "../types/game";
import { PartyGameState, PartySetup } from "../types/party";
import { FreePlayGroupDefinition, SelectionRoute } from "../types/routes";
import ButtonLink from "./button-link";
import CardVisual from "./card-visual";
import { useDecks } from "./deck-provider";
import DraggableDeckCard from "./draggable-deck-card";
import Loading from "./loading";
import PageShell from "./page-shell";
import SelectorOptionGrid, { SelectorOption } from "./selector-option-grid";
import SiteHeader from "./site-header";
import * as buttonStyles from "../styles/button.css";
import * as styles from "../styles/party-screen.css";

type PartyFlowStep = "category" | "game" | "setup";

const PARTY_CORRECT_FLASH_MS = 1000;
const PARTY_ERROR_FLASH_MS = 1500;

type PartyFeedbackFlash = {
  correct: boolean;
  expiresAt: number;
  teamName: string;
};

function createPartySeed(): string {
  return `party:${Date.now()}:${Math.random().toString(36).slice(2)}`;
}

function getPartyDifficulty(
  availableDifficulties: readonly GameDifficulty[],
): GameDifficulty {
  return availableDifficulties.includes("easy")
    ? "easy"
    : (availableDifficulties[0] ?? "easy");
}

function requestPartyFullscreen() {
  if (document.fullscreenElement) {
    return;
  }

  const fullscreenRoot =
    document.querySelector<HTMLElement>("[data-party-fullscreen-root]") ??
    document.documentElement;
  const fullscreenRequest = fullscreenRoot.requestFullscreen?.();
  void fullscreenRequest?.catch(() => undefined);
}

function PartyCategorySelector(props: {
  group: FreePlayGroupDefinition | null;
  onSelectRoute: (selectionRoute: SelectionRoute) => void;
  setGroup: (group: FreePlayGroupDefinition | null) => void;
}) {
  const { group, onSelectRoute, setGroup } = props;
  const { deckNodes } = useDecks();
  const items = React.useMemo<SelectorOption[]>(() => {
    if (!group) {
      return FEATURED_FREE_PLAY_DECKS.flatMap((deck) => {
        const selectionRoute = getLeafSelectionRoute(deck.slugPath);
        if (!selectionRoute) {
          return [];
        }

        if (deckNodes && !isSelectionRouteVisible(deckNodes, selectionRoute)) {
          return [];
        }

        return {
          href: "/party",
          key: deck.key,
          kind: "play" as const,
          selectionRoute,
          text: deck.text,
        };
      });
    }

    return group.children.flatMap((item) => {
      if (item.kind === "group") {
        if (deckNodes && !hasVisibleGroupChildren(deckNodes, item)) {
          return [];
        }

        return {
          href: "/party",
          key: item.slug,
          kind: "drilldown" as const,
          onClick: () => {
            setGroup(item);
          },
          text: item.title,
        };
      }

      const selectionRoute = getLeafSelectionRouteForNode(item.nodeId);
      if (!selectionRoute) {
        return [];
      }

      if (deckNodes && !isSelectionRouteVisible(deckNodes, selectionRoute)) {
        return [];
      }

      return {
        href: "/party",
        key: item.slug,
        kind: "play" as const,
        selectionRoute,
        text: item.title,
      };
    });
  }, [deckNodes, group, setGroup]);
  const allSelectionRoute = group
    ? getGroupAllSelectionRouteForNode(group.nodeId)
    : getAllSelectionRoute();

  return (
    <div className={styles.setupStage}>
      <div className={styles.sectionTitle}>Sällskapsspel</div>
      <div className={styles.setupPanel}>
        {group ? (
          <div className={styles.sectionTitle}>{group.title}</div>
        ) : null}
        <p className={styles.setupText}>Välj kategori för tidslinjen.</p>
        <ButtonLink
          fullWidth
          href="/party"
          onClick={(event) => {
            event.preventDefault();
            onSelectRoute(allSelectionRoute!);
          }}
          text="Alla"
        />
        <SelectorOptionGrid
          items={items}
          onSelectPlayRoute={(selectionRoute) => {
            onSelectRoute(selectionRoute);
          }}
        />
      </div>
    </div>
  );
}

function PartySetupForm(props: {
  onStart: (setup: PartySetup) => void;
  selectionRoute: SelectionRoute;
}) {
  const { onStart, selectionRoute } = props;
  const [teamCount, setTeamCount] = React.useState(2);
  const [teamNames, setTeamNames] = React.useState(() => ["Lag 1", "Lag 2"]);
  const validTeamNames = normalizePartyTeamNames(teamNames);
  const canStart = validTeamNames.length >= 2;

  React.useEffect(() => {
    setTeamNames((currentNames) =>
      Array.from(
        { length: teamCount },
        (_, index) => currentNames[index] ?? `Lag ${index + 1}`,
      ),
    );
  }, [teamCount]);

  return (
    <div className={styles.setupStage}>
      <div className={styles.sectionTitle}>
        {getSelectionRouteShareLabel(selectionRoute)}
      </div>
      <div className={styles.setupPanel}>
        <p className={styles.setupText}>
          Välj vilka lag som ska vara med och spela.
        </p>

        <details className={styles.guideDetails}>
          <summary className={styles.guideSummary}>
            <span>Spela på TV? Visa instruktioner</span>
            <svg
              className={styles.guideSummaryIcon}
              aria-hidden="true"
              fill="none"
              height="14"
              viewBox="0 0 14 14"
              width="14"
            >
              <path
                d="M3 5.5L7 9.5L11 5.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </summary>
          <PartyDeviceGuide />
        </details>

        <div className={styles.teamCountGrid}>
          {Array.from({ length: 7 }, (_, index) => index + 2).map((count) => (
            <button
              className={classNames(styles.numberButton, {
                [styles.numberButtonActive]: teamCount === count,
              })}
              key={count}
              onClick={() => {
                setTeamCount(count);
              }}
              type="button"
            >
              {count}
            </button>
          ))}
        </div>
        <div className={styles.teamInputs}>
          {teamNames.map((teamName, index) => (
            <input
              aria-label={`Namn på lag ${index + 1}`}
              className={styles.teamInput}
              key={index}
              onChange={(event) => {
                const value = event.target.value;
                setTeamNames((currentNames) =>
                  currentNames.map((currentName, currentIndex) =>
                    currentIndex === index ? value : currentName,
                  ),
                );
              }}
              value={teamName}
            />
          ))}
        </div>
        <div className={styles.setupActions}>
          <button
            className={classNames(buttonStyles.button, buttonStyles.fullWidth)}
            disabled={!canStart}
            onClick={() => {
              requestPartyFullscreen();
              onStart({
                seed: createPartySeed(),
                selectionRoute,
                teamNames: validTeamNames,
              });
            }}
            type="button"
          >
            Starta
          </button>
        </div>
      </div>
    </div>
  );
}

function PartyDeviceGuide() {
  return (
    <div className={styles.guide}>
      <div className={styles.guideIntro}>
        TV-läget är gratis och kräver inget Google Cast-konto. Starta spelet,
        tryck på helskärm och spegla skärmen till TV:n.
      </div>
      <div className={styles.guideGrid}>
        <div className={styles.guideItem}>
          <div className={styles.guideTitle}>iPhone / iPad</div>
          <p className={styles.guideCopy}>
            Öppna Kontrollcenter och använd Skärmdubblering med AirPlay.
          </p>
        </div>
        <div className={styles.guideItem}>
          <div className={styles.guideTitle}>Android</div>
          <p className={styles.guideCopy}>
            Använd Casta skärm i snabbinställningar eller Google Home.
          </p>
        </div>
        <div className={styles.guideItem}>
          <div className={styles.guideTitle}>Dator</div>
          <p className={styles.guideCopy}>
            I Chrome: välj Casta och casta fliken eller hela skärmen.
          </p>
        </div>
        <div className={styles.guideItem}>
          <div className={styles.guideTitle}>TV-webbläsare</div>
          <p className={styles.guideCopy}>
            Öppna spelet direkt på TV:n och kör helskärm därifrån.
          </p>
        </div>
      </div>
    </div>
  );
}

function MistakeDots(props: { mistakes: number }) {
  const { mistakes } = props;

  return (
    <span className={styles.mistakeDots} aria-label={`${mistakes} fel`}>
      {[0, 1, 2].map((index) => (
        <span
          aria-hidden="true"
          className={classNames(styles.mistakeDot, {
            [styles.mistakeDotFilled]: index < mistakes,
          })}
          key={index}
        />
      ))}
    </span>
  );
}

function PartyBoard(props: {
  canPlace: boolean;
  onBack?: () => void;
  onPlace: (index: number) => void;
  receiver?: boolean;
  state: PartyGameState;
  title: string;
  tvMode?: boolean;
}) {
  const {
    canPlace,
    onBack,
    onPlace,
    receiver = false,
    state,
    title,
    tvMode = false,
  } = props;
  const timelineRef = React.useRef<HTMLDivElement | null>(null);
  const tvFrameRef = React.useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [feedbackFlash, setFeedbackFlash] =
    React.useState<PartyFeedbackFlash | null>(null);

  React.useEffect(() => {
    if (!state.lastResult) {
      setFeedbackFlash(null);
      return;
    }

    const duration = state.lastResult.correct
      ? PARTY_CORRECT_FLASH_MS
      : PARTY_ERROR_FLASH_MS;
    const expiresAt = Date.now() + duration;

    setFeedbackFlash({
      correct: state.lastResult.correct,
      expiresAt,
      teamName: state.lastResult.teamName,
    });

    const clearExpiredFlash = () => {
      if (Date.now() < expiresAt) {
        return;
      }

      setFeedbackFlash((currentFlash) =>
        currentFlash?.expiresAt === expiresAt ? null : currentFlash,
      );
    };

    const timer = window.setTimeout(clearExpiredFlash, duration);
    window.addEventListener("focus", clearExpiredFlash);
    window.addEventListener("pageshow", clearExpiredFlash);
    document.addEventListener("visibilitychange", clearExpiredFlash);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", clearExpiredFlash);
      window.removeEventListener("pageshow", clearExpiredFlash);
      document.removeEventListener("visibilitychange", clearExpiredFlash);
    };
  }, [state.lastResult]);

  const activeTeam = getActivePartyTeam(state);
  const winner = state.teams.find((team) => team.id === state.winnerTeamId);
  const dense = state.game.played.length > 7;
  const resultText = state.lastResult
    ? state.lastResult.correct
      ? `${state.lastResult.teamName} placerade rätt.`
      : `${state.lastResult.teamName} missade och fick ett fel.`
    : "";
  const getDropIndex = React.useCallback(
    (point: { x: number; y: number }, rect: DOMRect | null) => {
      const timelineEl = timelineRef.current;
      if (!timelineEl || !rect) {
        return null;
      }

      const timelineRect = timelineEl.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      if (
        center.x < timelineRect.left - 80 ||
        center.x > timelineRect.right + 80 ||
        center.y < timelineRect.top - 80 ||
        center.y > timelineRect.bottom + 80
      ) {
        return null;
      }

      const placementEls = Array.from(
        timelineEl.querySelectorAll<HTMLElement>(
          "[data-party-placement-index]",
        ),
      );
      let closestIndex: number | null = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      placementEls.forEach((placementEl) => {
        const placementRect = placementEl.getBoundingClientRect();
        const placementCenter = {
          x: placementRect.left + placementRect.width / 2,
          y: placementRect.top + placementRect.height / 2,
        };
        const distance = Math.hypot(
          placementCenter.x - point.x,
          placementCenter.y - point.y,
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = Number(placementEl.dataset.partyPlacementIndex);
        }
      });

      return closestIndex;
    },
    [],
  );

  React.useEffect(() => {
    const updateFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === tvFrameRef.current);
    };

    document.addEventListener("fullscreenchange", updateFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreen);
    };
  }, []);

  const toggleFullscreen = React.useCallback(() => {
    const frameEl = tvFrameRef.current;
    if (!frameEl) {
      return;
    }

    if (document.fullscreenElement) {
      const fullscreenExit = document.exitFullscreen();
      void fullscreenExit.catch(() => undefined);
      return;
    }

    const fullscreenRequest = frameEl.requestFullscreen?.();
    void fullscreenRequest?.catch(() => undefined);
  }, []);

  if (winner) {
    return (
      <div className={styles.gameShell}>
        <div className={styles.winnerPanel}>
          <div className={styles.sectionTitle}>Vinnare</div>
          <h1 className={styles.activeTeam}>{winner.name}</h1>
          <p className={styles.setupText}>Alla andra lag har åkt ut.</p>
          {onBack ? (
            <button
              className={classNames(
                buttonStyles.button,
                buttonStyles.fullWidth,
              )}
              onClick={onBack}
              type="button"
            >
              Nytt spel
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames(styles.gameShell, {
        [styles.gameShellTv]: tvMode,
      })}
    >
      <div className={styles.gameTopBar}>
        <div className={styles.gameTitle}>{title}</div>
        <div className={styles.gameActions}>
          {tvMode ? (
            <button
              className={classNames(buttonStyles.button, buttonStyles.minimal)}
              onClick={toggleFullscreen}
              type="button"
            >
              {isFullscreen ? "Avsluta helskärm" : "Helskärm"}
            </button>
          ) : null}
        </div>
      </div>
      <div
        ref={tvFrameRef}
        className={classNames(styles.board, {
          [styles.receiverBoard]: receiver,
          [styles.tvBoard]: tvMode,
        })}
      >
        <div
          className={classNames(styles.timelinePanel, {
            [styles.timelinePanelDense]: dense,
          })}
        >
          <LayoutGroup id="party-timeline-layout">
            <motion.div
              layout="position"
              ref={timelineRef}
              className={classNames(styles.timeline, {
                [styles.timelineDense]: dense,
              })}
            >
              {Array.from({ length: state.game.played.length + 1 }).map(
                (_, index) => (
                  <React.Fragment key={`slot-${index}`}>
                    <motion.button
                      layout
                      key={`slot-btn-${index}`}
                      aria-label={`Placera på plats ${index + 1}`}
                      className={classNames(
                        styles.placement,
                        styles.placementButton,
                      )}
                      data-party-placement-index={index}
                      disabled={!canPlace}
                      onClick={() => {
                        onPlace(index);
                      }}
                      type="button"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <span className={styles.placementLine}>{index + 1}</span>
                    </motion.button>
                    {state.game.played[index] ? (
                      <motion.div
                        layout
                        key={`card-slot-${state.game.played[index].id}`}
                        initial={{ scale: 0.3, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                        className={styles.cardSlot}
                        data-card-id={state.game.played[index].id}
                      >
                        <CardVisual
                          className={styles.compactCard}
                          item={state.game.played[index]}
                          revealDatePill
                        />
                      </motion.div>
                    ) : null}
                  </React.Fragment>
                ),
              )}
            </motion.div>
          </LayoutGroup>
        </div>
        <aside className={styles.sidePanel}>
          <div className={styles.currentMeta}>
            <div className={styles.sectionTitle}>Tur</div>
            <h2 className={styles.activeTeam}>{activeTeam.name}</h2>
            <p className={styles.result}>{resultText}</p>
          </div>
          <div className={styles.currentCardWrap}>
            <AnimatePresence mode="popLayout">
              {state.game.next ? (
                <motion.div
                  key={state.game.next.id}
                  initial={{ scale: 0.8, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: -30 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {canPlace && !receiver ? (
                    <DraggableDeckCard
                      item={state.game.next}
                      width="var(--sidebar-card-width, 13.5rem)"
                      height="var(--sidebar-card-height, 18rem)"
                      onDragMove={() => undefined}
                      onDragStart={() => undefined}
                      onDrop={(point, rect) => {
                        const dropIndex = getDropIndex(point, rect);
                        if (dropIndex === null) {
                          return false;
                        }

                        onPlace(dropIndex);
                        return true;
                      }}
                    />
                  ) : (
                    <CardVisual
                      item={state.game.next}
                      style={{
                        width: "var(--sidebar-card-width, 13.5rem)",
                        height: "var(--sidebar-card-height, 18rem)",
                      }}
                      surface="deck"
                    />
                  )}
                </motion.div>
              ) : (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={styles.muted}
                >
                  Inga fler kort i kategorin.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div className={styles.teams}>
            {state.teams.map((team, index) => (
              <div
                className={classNames(styles.teamRow, {
                  [styles.teamRowActive]: index === state.activeTeamIndex,
                  [styles.teamRowEliminated]: team.eliminated,
                })}
                key={team.id}
              >
                <span>{team.name}</span>
                <MistakeDots mistakes={team.mistakes} />
              </div>
            ))}
          </div>
        </aside>
        <AnimatePresence>
          {feedbackFlash && !feedbackFlash.correct ? (
            <motion.div
              key={feedbackFlash.expiresAt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.errorOverlay}
            >
              <div className={styles.errorBadge}>
                <span className={styles.errorIcon}>✕</span>
                <h3 className={styles.errorText}>FEL ÅR!</h3>
                <p className={styles.errorTeam}>{feedbackFlash.teamName}</p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <AnimatePresence>
          {feedbackFlash?.correct ? (
            <motion.div
              key={feedbackFlash.expiresAt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.correctOverlay}
            >
              <div className={styles.correctBadge}>
                <span className={styles.correctIcon}>✓</span>
                <h3 className={styles.correctText}>RÄTT!</h3>
                <p className={styles.correctTeam}>{feedbackFlash.teamName}</p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function PartyGameLoader(props: {
  externalPlacementIndex?: number | null;
  externalPlacementNonce?: number;
  onBack?: () => void;
  receiver?: boolean;
  setup: PartySetup;
}) {
  const {
    externalPlacementIndex = null,
    externalPlacementNonce = 0,
    onBack,
    receiver = false,
    setup,
  } = props;
  const { deckNodes, loadDecks, rootDeckId } = useDecks();
  const [state, setState] = React.useState<PartyGameState | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const preparePartyGame = async () => {
      if (!deckNodes || !rootDeckId) {
        return;
      }

      setState(null);
      setError(null);
      try {
        const selectedRootDeck = resolveSelectionDeck(
          deckNodes,
          "free-play",
          setup.selectionRoute,
          rootDeckId,
        );
        if (!selectedRootDeck) {
          throw new Error("Kategorin kunde inte hittas.");
        }

        const leafDeckIds = collectLeafDeckIds(selectedRootDeck);
        const loadedDeckCards = await loadDecks(leafDeckIds);
        const filteredCards = filterCardsBySelectionRoute(
          loadedDeckCards,
          setup.selectionRoute,
        );
        const difficulty = getPartyDifficulty(
          getSupportedDifficultiesForDeckId(
            deckNodes,
            setup.selectionRoute.nodeId,
          ),
        );
        const game = await createStateWithRetry(
          selectedRootDeck,
          filteredCards,
          difficulty,
          {
            random: createSeededRandom(setup.seed),
          },
        );

        if (!cancelled) {
          setState(createPartyGameState(game, setup.teamNames));
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : String(caughtError),
          );
        }
      }
    };

    void preparePartyGame();

    return () => {
      cancelled = true;
    };
  }, [deckNodes, loadDecks, rootDeckId, setup]);

  React.useEffect(() => {
    if (!receiver || externalPlacementIndex === null) {
      return;
    }

    setState((currentState) =>
      currentState
        ? placePartyCard(currentState, externalPlacementIndex)
        : null,
    );
  }, [externalPlacementIndex, externalPlacementNonce, receiver]);

  if (error) {
    return (
      <div className={styles.winnerPanel}>
        <div className={styles.sectionTitle}>Något gick fel</div>
        <p className={styles.setupText}>{error}</p>
      </div>
    );
  }

  if (!state) {
    return <Loading />;
  }

  return (
    <PartyBoard
      canPlace={!receiver && state.game.next !== null}
      onBack={onBack}
      onPlace={(index) => {
        setState((currentState) =>
          currentState ? placePartyCard(currentState, index) : null,
        );
      }}
      receiver={receiver}
      state={state}
      title={getSelectionRouteShareLabel(setup.selectionRoute)}
      tvMode={true}
    />
  );
}

export default function PartyScreen() {
  const [step, setStep] = React.useState<PartyFlowStep>("category");
  const [categoryGroup, setCategoryGroup] =
    React.useState<FreePlayGroupDefinition | null>(null);
  const [selectionRoute, setSelectionRoute] =
    React.useState<SelectionRoute | null>(null);
  const [setup, setSetup] = React.useState<PartySetup | null>(null);
  const handleHeaderBack = React.useMemo(() => {
    if (categoryGroup) {
      return () => {
        setCategoryGroup(null);
      };
    }

    if (step === "category") {
      return undefined;
    }

    if (step === "setup") {
      return () => {
        setSelectionRoute(null);
        setStep("category");
      };
    }

    return () => {
      setSetup(null);
      setStep("setup");
    };
  }, [categoryGroup, step]);

  return (
    <PageShell showHeader={false}>
      <div
        className={classNames(styles.page, {
          [styles.pageGame]: step === "game",
        })}
        data-party-fullscreen-root
      >
        <SiteHeader
          backHref={step === "category" ? "/" : undefined}
          onBack={handleHeaderBack}
        />
        <main
          className={classNames(styles.screen, {
            [styles.gameScreen]: step === "game",
          })}
        >
          {step === "category" ? (
            <PartyCategorySelector
              group={categoryGroup}
              onSelectRoute={(nextSelectionRoute) => {
                setSelectionRoute(nextSelectionRoute);
                setCategoryGroup(null);
                setStep("setup");
              }}
              setGroup={setCategoryGroup}
            />
          ) : null}
          {step === "setup" && selectionRoute ? (
            <PartySetupForm
              onStart={(nextSetup) => {
                setSetup(nextSetup);
                setStep("game");
              }}
              selectionRoute={selectionRoute}
            />
          ) : null}
          {step === "game" && setup ? (
            <PartyGameLoader
              onBack={() => {
                setSetup(null);
                setStep("setup");
              }}
              setup={setup}
            />
          ) : null}
        </main>
      </div>
    </PageShell>
  );
}
