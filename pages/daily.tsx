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
  const dateKey = React.useMemo(() => getCurrentUtcDateKey(), []);

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

  const startDaily = React.useCallback(async () => {
    setCheckingServerResult(true);
    const alreadyCompleted = await loadCompletionState();
    if (!alreadyCompleted) {
      setStarted(true);
    }
  }, [loadCompletionState]);

  if (!started || completedScore !== null) {
    return (
      <>
        <AppHead title="Dagens spel | VilketÅr" />
        <DailyEntryScreen
          completedResults={completedResults}
          completedScore={completedScore}
          dailyDateKey={dateKey}
          isChecking={checkingServerResult}
          onStart={startDaily}
          statusText={serverStatusText}
        />
      </>
    );
  }

  return (
    <>
      <AppHead title="Dagens spel | VilketÅr" />
      <GameRouteScreen
        mode="daily"
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
    </>
  );
}
