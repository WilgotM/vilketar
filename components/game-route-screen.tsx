import React from "react";
import { getSelectionRoutePath } from "../lib/categories";
import { DAILY_DIFFICULTY, getCurrentUtcDateKey } from "../lib/daily";
import { createDailyGameState } from "../lib/daily-game";
import { loadDailyOverride } from "../lib/daily-overrides";
import { getDailyScheduleTheme } from "../lib/daily-schedule";
import {
  clearDailyGameSnapshot,
  loadDailyGameSnapshot,
  saveDailyGameSnapshot,
} from "../lib/daily-storage";
import { collectLeafDeckIds, createDeckNodeListMap } from "../lib/deck-tree";
import { getSupportedDifficultiesForDeckId } from "../lib/free-play-difficulty-rules";
import { consumeFreePlayIntroShown } from "../lib/free-play-storage";
import {
  createDailyGameSnapshot,
  createDailyGameStateFromSnapshot,
  createStateWithRetry,
  filterCardsBySelectionRoute,
  resolveSelectionDeck,
} from "../lib/game-state";
import { loadHighscore, saveHighscore } from "../lib/highscore-storage";
import {
  getStoredDailyResult,
  StoredDailyResult,
  getActiveDailySession,
  saveActiveDailySession,
} from "../lib/leagues";
import { useBackConfirmation } from "../lib/use-back-confirmation";
import { useFreePlayDifficulty } from "../lib/use-free-play-difficulty";
import { GameState } from "../types/game";
import { GameMode, SelectionRoute, DailyGameSnapshot } from "../types/routes";
import Board from "./board";
import { useDecks } from "./deck-provider";
import Loading from "./loading";
import { useNavigationSource } from "./navigation-source-provider";
import QuitGameModal from "./quit-game-modal";
import RouteIntroScreen from "./route-intro-screen";
import SiteHeader from "./site-header";
import * as styles from "../styles/game-route-screen.css";

interface Props {
  hideHeader?: boolean;
  mode: GameMode;
  onQuitGame?: () => void;
  onDailyRemoteCompleted?: (result: StoredDailyResult) => void;
  onResetGame?: () => void;
  selectionRoute?: SelectionRoute;
  skipRouteIntro?: boolean;
}

function shouldRestoreDailySnapshot(
  dateKey: string,
  snapshot: ReturnType<typeof loadDailyGameSnapshot>,
): boolean {
  if (!snapshot || snapshot.dateKey !== dateKey) {
    return false;
  }

  return snapshot.played.length > 1 || snapshot.lives < 3;
}

function getMoreAdvancedSnapshot(
  local: DailyGameSnapshot | null,
  cloud: DailyGameSnapshot | null,
): DailyGameSnapshot | null {
  if (!local) {
    return cloud;
  }
  if (!cloud) {
    return local;
  }

  const localPlayedCount = local.played.length;
  const cloudPlayedCount = cloud.played.length;

  if (cloudPlayedCount > localPlayedCount) {
    return cloud;
  }
  if (localPlayedCount > cloudPlayedCount) {
    return local;
  }

  if (cloud.lives < local.lives) {
    return cloud;
  }

  return local;
}

function buildGameStatePath(
  mode: GameMode,
  selectionRoute?: SelectionRoute,
): string {
  if (mode === "daily") {
    return "/daily";
  }

  return selectionRoute ? getSelectionRoutePath(selectionRoute) : "/play/all";
}

function RouteLoadingFrame(props: { hideHeader: boolean }) {
  const { hideHeader } = props;

  if (hideHeader) {
    return (
      <div className={styles.pageWithoutHeader}>
        <div className={styles.boardFrame}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <SiteHeader />
      <div className={styles.boardFrame}>
        <Loading />
      </div>
    </div>
  );
}

export default function GameRouteScreen(props: Props) {
  const {
    hideHeader = false,
    mode,
    onDailyRemoteCompleted,
    onResetGame,
    onQuitGame,
    selectionRoute,
    skipRouteIntro = false,
  } = props;
  const [fontsReady, setFontsReady] = React.useState(false);
  const [state, setState] = React.useState<GameState | null>(null);
  const [stateReady, setStateReady] = React.useState(false);
  const [runNonce, setRunNonce] = React.useState(0);
  const [highscore, setHighscore] = React.useState(0);
  const [entryReady, setEntryReady] = React.useState(false);
  const [showRouteIntro, setShowRouteIntro] = React.useState(false);
  const [restoredFromSnapshot, setRestoredFromSnapshot] = React.useState(false);
  const freePlayDifficulty = useFreePlayDifficulty();
  const navigationSource = useNavigationSource();
  const { deckNodes, loadDecks, rootDeckId } = useDecks();

  const routePath = React.useMemo(
    () => buildGameStatePath(mode, selectionRoute),
    [mode, selectionRoute],
  );
  const dateKey = React.useMemo(() => getCurrentUtcDateKey(), []);
  const dailyScheduleTheme = React.useMemo(
    () => getDailyScheduleTheme(dateKey),
    [dateKey],
  );
  const difficulty =
    mode === "daily" ? DAILY_DIFFICULTY : freePlayDifficulty.difficulty;
  const difficultyReady = mode === "daily" ? true : freePlayDifficulty.ready;

  React.useEffect(() => {
    document.body.classList.add("gamePageNoSelect");

    return () => {
      document.body.classList.remove("gamePageNoSelect");
    };
  }, []);

  React.useEffect(() => {
    if (!difficultyReady) {
      setEntryReady(false);
      return;
    }

    if (!navigationSource.ready) {
      return;
    }

    if (mode === "daily") {
      if (skipRouteIntro) {
        setShowRouteIntro(false);
        setEntryReady(true);
        return;
      }

      const existingSnapshot = loadDailyGameSnapshot();
      setShowRouteIntro(
        !navigationSource.currentEntryWasInternal &&
          !shouldRestoreDailySnapshot(dateKey, existingSnapshot),
      );
      setEntryReady(true);
      return;
    }

    setShowRouteIntro(
      skipRouteIntro ? false : !consumeFreePlayIntroShown(routePath),
    );
    setEntryReady(true);
  }, [
    dateKey,
    difficultyReady,
    mode,
    navigationSource.currentEntryWasInternal,
    navigationSource.ready,
    routePath,
    skipRouteIntro,
  ]);

  React.useEffect(() => {
    let cancelled = false;

    const waitForFonts = async () => {
      if (typeof document === "undefined" || !("fonts" in document)) {
        if (!cancelled) {
          setFontsReady(true);
        }
        return;
      }

      try {
        await Promise.all([
          document.fonts.load('400 1em "Inter"'),
          document.fonts.load('600 1em "Inter"'),
          document.fonts.load('700 1em "Inter"'),
          document.fonts.load('800 1em "Inter"'),
          document.fonts.load('700 1em "Fraunces"'),
          document.fonts.load('800 1em "Fraunces"'),
          document.fonts.ready,
        ]);
      } finally {
        if (!cancelled) {
          setFontsReady(true);
        }
      }
    };

    void waitForFonts();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableDifficulties = React.useMemo(() => {
    if (mode !== "free-play" || !deckNodes || !selectionRoute) {
      return [];
    }

    return getSupportedDifficultiesForDeckId(deckNodes, selectionRoute.nodeId);
  }, [deckNodes, mode, selectionRoute]);
  const selectedLeafDeckIds = React.useMemo(() => {
    if (!deckNodes || !rootDeckId) {
      return [];
    }

    const deckNodeMap = createDeckNodeListMap(deckNodes);
    const selectionDeckId =
      mode === "daily"
        ? (dailyScheduleTheme.deckId ?? rootDeckId)
        : (selectionRoute?.nodeId ?? rootDeckId);
    const rootDeck = deckNodeMap.get(selectionDeckId);

    return rootDeck ? collectLeafDeckIds(rootDeck) : [];
  }, [dailyScheduleTheme.deckId, deckNodes, mode, rootDeckId, selectionRoute]);

  React.useEffect(() => {
    if (
      mode !== "free-play" ||
      !deckNodes ||
      availableDifficulties.length === 0 ||
      availableDifficulties.includes(freePlayDifficulty.difficulty)
    ) {
      return;
    }

    const nextDifficulty = selectionRoute
      ? (availableDifficulties[0] ?? null)
      : null;
    if (nextDifficulty) {
      freePlayDifficulty.setDifficulty(nextDifficulty);
    }
  }, [
    availableDifficulties,
    deckNodes,
    freePlayDifficulty,
    mode,
    selectionRoute,
  ]);

  React.useEffect(() => {
    if (mode !== "free-play" || !difficultyReady) {
      setHighscore(0);
      return;
    }

    setHighscore(loadHighscore(routePath, difficulty));
  }, [difficulty, difficultyReady, mode, routePath]);

  React.useEffect(() => {
    let cancelled = false;

    const prepareState = async () => {
      if (
        !difficultyReady ||
        !entryReady ||
        !deckNodes ||
        !rootDeckId ||
        selectedLeafDeckIds.length === 0 ||
        !fontsReady
      ) {
        return;
      }

      setStateReady(false);
      setRestoredFromSnapshot(false);
      const loadedDeckCards = await loadDecks(selectedLeafDeckIds);
      const deckNodeMap = createDeckNodeListMap(deckNodes);
      const selectedRootDeck =
        mode === "daily"
          ? (deckNodeMap.get(dailyScheduleTheme.deckId ?? rootDeckId) ?? null)
          : resolveSelectionDeck(
              deckNodes,
              mode,
              selectionRoute ?? null,
              rootDeckId,
            );
      if (!selectedRootDeck) {
        return;
      }
      const filteredCards = filterCardsBySelectionRoute(
        loadedDeckCards,
        mode === "daily" ? null : (selectionRoute ?? null),
      );

      if (mode === "daily") {
        const serverResult = await getStoredDailyResult(dateKey);
        if (serverResult) {
          if (!cancelled) {
            onDailyRemoteCompleted?.(serverResult);
          }
          return;
        }

        let cloudSnapshot: DailyGameSnapshot | null = null;
        try {
          cloudSnapshot = await getActiveDailySession(dateKey);
        } catch (e) {
          console.error("Failed to load active session from cloud", e);
        }

        const localSnapshot = loadDailyGameSnapshot();
        const existingSnapshot = getMoreAdvancedSnapshot(
          localSnapshot,
          cloudSnapshot,
        );

        if (
          existingSnapshot &&
          shouldRestoreDailySnapshot(dateKey, existingSnapshot)
        ) {
          if (!cancelled) {
            setRestoredFromSnapshot(true);
            setState(
              createDailyGameStateFromSnapshot(
                existingSnapshot,
                selectedRootDeck,
                filteredCards,
              ),
            );
            setStateReady(true);
          }
          return;
        }

        const dailyOverride = await loadDailyOverride(dateKey);
        const nextState = await createDailyGameState(
          selectedRootDeck,
          filteredCards,
          DAILY_DIFFICULTY,
          dateKey,
          dailyOverride,
        );

        if (!cancelled) {
          setRestoredFromSnapshot(false);
          setState(nextState);
          setStateReady(true);
        }
        return;
      }

      const nextState = await createStateWithRetry(
        selectedRootDeck,
        filteredCards,
        difficulty,
      );

      if (!cancelled) {
        setRestoredFromSnapshot(false);
        setState(nextState);
        setStateReady(true);
      }
    };

    void prepareState();

    return () => {
      cancelled = true;
    };
  }, [
    dateKey,
    dailyScheduleTheme.deckId,
    difficulty,
    difficultyReady,
    deckNodes,
    entryReady,
    fontsReady,
    loadDecks,
    mode,
    onDailyRemoteCompleted,
    rootDeckId,
    runNonce,
    selectedLeafDeckIds,
    selectionRoute,
  ]);

  React.useEffect(() => {
    if (mode !== "daily" || !state || showRouteIntro) {
      return;
    }

    const snapshot = createDailyGameSnapshot(dateKey, state);
    saveDailyGameSnapshot(snapshot);
    void saveActiveDailySession(dateKey, snapshot).catch((e) => {
      console.error("Failed to save active session to cloud", e);
    });
  }, [dateKey, mode, showRouteIntro, state]);

  const resetGame = React.useCallback(() => {
    if (mode === "daily") {
      clearDailyGameSnapshot();
    }

    if (onResetGame) {
      onResetGame();
      return;
    }

    setRunNonce((currentNonce) => currentNonce + 1);
    setShowRouteIntro(true);
  }, [mode, onResetGame]);

  const startRouteGame = React.useCallback(() => {
    setShowRouteIntro(false);
  }, []);

  const shouldConfirmBeforeQuit =
    !showRouteIntro &&
    stateReady &&
    fontsReady &&
    state !== null &&
    state.lives > 0;
  const quitModalCopy =
    mode === "daily"
      ? {
          body: "Dagens spel sparas resten av dagen, så du kan fortsätta senare.",
          confirmText: "Lämna och fortsätt senare",
        }
      : {
          body: "Du förlorar framstegen i den här rundan.",
          confirmText: "Lämna",
        };

  const backConfirmation = useBackConfirmation({
    enabled: shouldConfirmBeforeQuit,
    onConfirmExit: onQuitGame ?? resetGame,
  });

  const updateHighscore = React.useCallback(
    (score: number) => {
      if (mode !== "free-play") {
        return;
      }

      saveHighscore(routePath, difficulty, score);
      setHighscore(score);
    },
    [difficulty, mode, routePath],
  );

  if (!difficultyReady || !entryReady) {
    return <RouteLoadingFrame hideHeader={hideHeader} />;
  }

  if (showRouteIntro) {
    return (
      <RouteIntroScreen
        availableDifficulties={availableDifficulties}
        dailyDateKey={mode === "daily" ? dateKey : undefined}
        difficulty={difficulty}
        embedded={hideHeader}
        mode={mode}
        onStart={startRouteGame}
        selectionRoute={selectionRoute}
        setDifficulty={
          mode === "free-play" ? freePlayDifficulty.setDifficulty : undefined
        }
        showHeader={!hideHeader}
      />
    );
  }

  if (!stateReady || !fontsReady || !state) {
    return <RouteLoadingFrame hideHeader={hideHeader} />;
  }

  if (hideHeader) {
    return (
      <div className={styles.pageWithoutHeader}>
        <div className={styles.boardFrame}>
          <Board
            key={`${routePath}:${runNonce}`}
            dailyDateKey={mode === "daily" ? dateKey : undefined}
            difficulty={difficulty}
            gameMode={mode}
            highscore={highscore}
            onDailyRemoteCompleted={onDailyRemoteCompleted}
            resetGame={mode === "free-play" ? resetGame : undefined}
            restoredFromSnapshot={restoredFromSnapshot}
            routePath={routePath}
            selectionRoute={selectionRoute}
            state={state}
            setState={setState}
            updateHighscore={updateHighscore}
          />
          <QuitGameModal
            onCancel={backConfirmation.cancelNavigation}
            onConfirm={backConfirmation.confirmNavigation}
            open={backConfirmation.isPromptOpen}
            {...quitModalCopy}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <SiteHeader />
      <div className={styles.boardFrame}>
        <Board
          key={`${routePath}:${runNonce}`}
          dailyDateKey={mode === "daily" ? dateKey : undefined}
          difficulty={difficulty}
          gameMode={mode}
          highscore={highscore}
          onDailyRemoteCompleted={onDailyRemoteCompleted}
          resetGame={mode === "free-play" ? resetGame : undefined}
          restoredFromSnapshot={restoredFromSnapshot}
          routePath={routePath}
          selectionRoute={selectionRoute}
          state={state}
          setState={setState}
          updateHighscore={updateHighscore}
        />
        <QuitGameModal
          onCancel={backConfirmation.cancelNavigation}
          onConfirm={backConfirmation.confirmNavigation}
          open={backConfirmation.isPromptOpen}
          {...quitModalCopy}
        />
      </div>
    </div>
  );
}
