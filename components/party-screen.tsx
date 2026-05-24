import classNames from "classnames";
import React from "react";
import {
  getAllSelectionRoute,
  getCategoryDefinitions,
  getDeckPath,
  getGroupAllSelectionRouteForNode,
  getLeafSelectionRouteForNode,
  getSelectionRouteShareLabel,
} from "../lib/categories";
import { collectLeafDeckIds } from "../lib/deck-tree";
import {
  getSupportedDifficultiesForDeckId,
  hasVisibleGroupChildren,
  isSelectionRouteVisible,
} from "../lib/free-play-difficulty-rules";
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
import {
  CategoryDefinition,
  FreePlayDefinition,
  FreePlayGroupDefinition,
  SelectionRoute,
} from "../types/routes";
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

function PartyCategorySelector(props: {
  onSelectRoute: (selectionRoute: SelectionRoute) => void;
}) {
  const { onSelectRoute } = props;
  const { deckNodes } = useDecks();
  const [group, setGroup] = React.useState<FreePlayGroupDefinition | null>(
    null,
  );
  const parentItems:
    | readonly FreePlayDefinition[]
    | readonly CategoryDefinition[] = group
    ? group.children
    : getCategoryDefinitions();
  const items = React.useMemo<SelectorOption[]>(() => {
    return parentItems.flatMap((item) => {
      if (item.kind === "group") {
        if (deckNodes && !hasVisibleGroupChildren(deckNodes, item)) {
          return [];
        }

        return {
          href: getDeckPath(item.nodeId),
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
  }, [deckNodes, parentItems]);
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
        {group ? (
          <button
            className={classNames(
              buttonStyles.button,
              buttonStyles.fullWidth,
              buttonStyles.minimal,
            )}
            onClick={() => {
              setGroup(null);
            }}
            type="button"
          >
            Tillbaka till kategorier
          </button>
        ) : null}
      </div>
    </div>
  );
}

function PartySetupForm(props: {
  onStart: (setup: PartySetup) => void;
  selectionRoute: SelectionRoute;
}) {
  const { onStart, selectionRoute } = props;
  const [mode, setMode] = React.useState<PartySetup["mode"]>("device");
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
          Välj var spelet visas och vilka lag som är med.
        </p>
        <div className={styles.segmented} role="group">
          <button
            className={classNames(styles.segmentButton, {
              [styles.segmentButtonActive]: mode === "device",
            })}
            onClick={() => {
              setMode("device");
            }}
            type="button"
          >
            Den här enheten
          </button>
          <button
            className={classNames(styles.segmentButton, {
              [styles.segmentButtonActive]: mode === "tv",
            })}
            onClick={() => {
              setMode("tv");
            }}
            type="button"
          >
            TV-läge
          </button>
        </div>
        {mode === "tv" ? <PartyDeviceGuide /> : null}
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
              onStart({
                mode,
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
      void document.exitFullscreen();
      return;
    }

    void frameEl.requestFullscreen?.();
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
          {onBack ? (
            <button
              className={classNames(buttonStyles.button, buttonStyles.minimal)}
              onClick={onBack}
              type="button"
            >
              Lämna
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
          <div
            ref={timelineRef}
            className={classNames(styles.timeline, {
              [styles.timelineDense]: dense,
            })}
          >
            {Array.from({ length: state.game.played.length + 1 }).map(
              (_, index) => (
                <React.Fragment key={`slot-${index}`}>
                  <button
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
                  >
                    <span className={styles.placementLine}>{index + 1}</span>
                  </button>
                  {state.game.played[index] ? (
                    <div
                      className={styles.cardSlot}
                      data-card-id={state.game.played[index].id}
                    >
                      <CardVisual
                        className={styles.compactCard}
                        item={state.game.played[index]}
                        revealDatePill
                      />
                    </div>
                  ) : null}
                </React.Fragment>
              ),
            )}
          </div>
        </div>
        <aside className={styles.sidePanel}>
          <div className={styles.currentMeta}>
            <div className={styles.sectionTitle}>Tur</div>
            <h2 className={styles.activeTeam}>{activeTeam.name}</h2>
            <p className={styles.result}>{resultText}</p>
          </div>
          <div className={styles.currentCardWrap}>
            {state.game.next ? (
              canPlace && !receiver ? (
                <DraggableDeckCard
                  item={state.game.next}
                  key={state.game.next.id}
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
                <CardVisual item={state.game.next} surface="deck" />
              )
            ) : (
              <p className={styles.muted}>Inga fler kort i kategorin.</p>
            )}
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
        {onBack ? (
          <button
            className={classNames(buttonStyles.button, buttonStyles.fullWidth)}
            onClick={onBack}
            type="button"
          >
            Tillbaka
          </button>
        ) : null}
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
      tvMode={setup.mode === "tv"}
    />
  );
}

export default function PartyScreen() {
  const [step, setStep] = React.useState<PartyFlowStep>("category");
  const [selectionRoute, setSelectionRoute] =
    React.useState<SelectionRoute | null>(null);
  const [setup, setSetup] = React.useState<PartySetup | null>(null);
  const handleHeaderBack = React.useMemo(() => {
    if (step === "category") {
      return undefined;
    }

    if (step === "setup") {
      return () => {
        setStep("category");
      };
    }

    return () => {
      setSetup(null);
      setStep("setup");
    };
  }, [step]);

  return (
    <PageShell showHeader={false}>
      <div className={styles.page}>
        <SiteHeader
          backHref={step === "category" ? "/" : undefined}
          onBack={handleHeaderBack}
        />
        <main className={styles.screen}>
          {step === "category" ? (
            <PartyCategorySelector
              onSelectRoute={(nextSelectionRoute) => {
                setSelectionRoute(nextSelectionRoute);
                setStep("setup");
              }}
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
