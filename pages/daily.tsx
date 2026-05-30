import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/router";
import React from "react";
import AppHead from "../components/app-head";
import DailyEntryScreen from "../components/daily-entry-screen";
import GameRouteScreen from "../components/game-route-screen";
import { getCurrentUtcDateKey } from "../lib/daily";
import {
  loadDailyGameSnapshot,
  saveDailyGameSnapshot,
} from "../lib/daily-storage";
import { getStoredDailyResult } from "../lib/leagues";
import { getShareResults } from "../lib/share";

export default function DailyPage() {
  const router = useRouter();
  const [started, setStarted] = React.useState(false);
  const [completedResults, setCompletedResults] = React.useState<
    boolean[] | null
  >(null);
  const [completedScore, setCompletedScore] = React.useState<null | number>(
    null,
  );
  const [checkingServerResult, setCheckingServerResult] = React.useState(true);
  const [serverStatusText, setServerStatusText] = React.useState<string | null>(
    null,
  );
  const [browserPath, setBrowserPath] = React.useState("");
  const dateKey = React.useMemo(() => getCurrentUtcDateKey(), []);
  const livePath = typeof window === "undefined" ? "" : window.location.href;
  const forceIntro =
    router.asPath.includes("intro=1") ||
    router.asPath.includes("#veckoschema") ||
    livePath.includes("intro=1") ||
    livePath.includes("#veckoschema") ||
    browserPath.includes("intro=1") ||
    browserPath.includes("#veckoschema");

  const loadCompletionState = React.useCallback(async () => {
    const snapshot = loadDailyGameSnapshot();

    if (snapshot && snapshot.dateKey === dateKey && snapshot.lives <= 0) {
      setCompletedResults(getShareResults(snapshot.played));
      setCompletedScore(
        snapshot.played.filter((item) => item.played.correct).length - 1,
      );
      setCheckingServerResult(false);
      return true;
    }

    try {
      setServerStatusText(null);
      const serverResult = await getStoredDailyResult(dateKey);
      if (serverResult) {
        setCompletedResults(
          serverResult.resultPattern.split("").map((item) => item === "1"),
        );
        setCompletedScore(serverResult.score);
        return true;
      }
    } catch {
      setServerStatusText(
        "Kunde inte kontrollera sparat resultat just nu. Du kan spela på den här enheten ändå.",
      );
    } finally {
      setCheckingServerResult(false);
    }

    setCompletedResults(null);
    setCompletedScore(null);
    return false;
  }, [dateKey]);

  React.useEffect(() => {
    void loadCompletionState();
  }, [loadCompletionState]);

  React.useEffect(() => {
    setStarted(false);
    setBrowserPath(window.location.href);
  }, [router.asPath]);

  React.useEffect(() => {
    if (forceIntro) {
      setStarted(false);
    }
  }, [forceIntro]);

  const startDaily = React.useCallback(async () => {
    setCheckingServerResult(true);
    const alreadyCompleted = await loadCompletionState();
    if (!alreadyCompleted) {
      if (forceIntro) {
        await router.replace("/daily", undefined, { shallow: true });
      }
      setStarted(true);
    }
  }, [forceIntro, loadCompletionState, router]);

  return (
    <>
      <AppHead title="Dagens spel | VilketÅr" />
      <AnimatePresence mode="wait">
        {!started || completedScore !== null || forceIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "100%", height: "100%" }}
          >
            <DailyEntryScreen
              completedResults={completedResults}
              completedScore={completedScore}
              dailyDateKey={dateKey}
              isChecking={checkingServerResult}
              onStart={startDaily}
              statusText={serverStatusText}
            />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 32,
              mass: 0.85,
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <GameRouteScreen
              mode="daily"
              onQuitGame={() => setStarted(false)}
              onDailyRemoteCompleted={(result) => {
                setCompletedResults(
                  result.resultPattern.split("").map((item) => item === "1"),
                );
                setCompletedScore(result.score);
                setStarted(false);
                const snapshot = loadDailyGameSnapshot();
                if (snapshot && snapshot.dateKey === dateKey) {
                  saveDailyGameSnapshot({
                    ...snapshot,
                    lives: 0,
                  });
                }
              }}
              skipRouteIntro
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
