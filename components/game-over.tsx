import { motion } from "motion/react";
import React from "react";
import { getSelectionRouteShareLabel } from "../lib/categories";
import { formatTimeUntilNextDaily } from "../lib/daily";
import { StoredDailyResult, submitDailyLeagueResult } from "../lib/leagues";
import { saveRemoteScore } from "../lib/remote-highscores";
import { buildShareText, getShareResults } from "../lib/share";
import { PlayedCard } from "../types/cards";
import { GameDifficulty } from "../types/game";
import { GameMode, SelectionRoute } from "../types/routes";
import Button from "./button";
import DailyCompletedSummary from "./daily-completed-summary";
import { DAILY_DATE_LOCALE, formatDailyDate } from "./daily-meta-chips";
import FreePlayBreadcrumbs from "./free-play-breadcrumbs";
import Score from "./score";
import * as styles from "../styles/game-over.css";

interface Props {
  dailyDateKey?: string;
  difficulty: GameDifficulty;
  gameMode: GameMode;
  highscore: number;
  onDailyRemoteCompleted?: (result: StoredDailyResult) => void;
  played: PlayedCard[];
  resetGame?: () => void;
  routePath: string;
  score: number;
  selectionRoute?: SelectionRoute;
}

const defaultShareText = "Dela";

export default function GameOver(props: Props) {
  const {
    dailyDateKey,
    difficulty,
    gameMode,
    highscore,
    onDailyRemoteCompleted,
    played,
    resetGame,
    routePath,
    score,
    selectionRoute,
  } = props;

  const [shareText, setShareText] = React.useState(defaultShareText);
  const savedRemoteScoreRef = React.useRef(false);
  const [nextDailyText, setNextDailyText] = React.useState(() =>
    formatTimeUntilNextDaily(new Date(), "Nästa om"),
  );
  const formattedDailyDate = React.useMemo(() => {
    if (!dailyDateKey) {
      return "";
    }

    return formatDailyDate(dailyDateKey, DAILY_DATE_LOCALE);
  }, [dailyDateKey]);

  React.useEffect(() => {
    if (gameMode !== "daily") {
      return;
    }

    const updateNextDailyText = () => {
      setNextDailyText(formatTimeUntilNextDaily(new Date(), "Nästa om"));
    };

    updateNextDailyText();
    const intervalId = window.setInterval(updateNextDailyText, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [gameMode]);

  React.useEffect(() => {
    if (savedRemoteScoreRef.current) {
      return;
    }

    savedRemoteScoreRef.current = true;
    const results = getShareResults(played)
      .map((result) => (result ? "1" : "0"))
      .join("");

    void saveRemoteScore({
      deckId: selectionRoute?.nodeId,
      deckTitle: selectionRoute
        ? getSelectionRouteShareLabel(selectionRoute)
        : undefined,
      difficulty,
      mode: gameMode,
      resultPattern: results,
      score,
    });

    if (gameMode === "daily" && dailyDateKey) {
      void submitDailyLeagueResult({
        dateKey: dailyDateKey,
        resultPattern: results,
        score,
      })
        .then((storedResult) => {
          if (
            storedResult &&
            (storedResult.score !== score ||
              storedResult.resultPattern !== results)
          ) {
            onDailyRemoteCompleted?.(storedResult);
          }
        })
        .catch(() => undefined);
    }
  }, [
    dailyDateKey,
    difficulty,
    gameMode,
    onDailyRemoteCompleted,
    played,
    score,
    selectionRoute,
  ]);

  const share = React.useCallback(async () => {
    await navigator?.clipboard?.writeText(
      buildShareText({
        dateKey: dailyDateKey,
        difficulty,
        highscore: gameMode === "free-play" ? highscore : undefined,
        mode: gameMode,
        path: routePath,
        results: getShareResults(played),
        score,
        selectionRoute,
      }),
    );
    setShareText("Kopierat");
    setTimeout(() => {
      setShareText(defaultShareText);
    }, 2000);
  }, [
    dailyDateKey,
    difficulty,
    gameMode,
    highscore,
    played,
    routePath,
    score,
    selectionRoute,
  ]);

  if (gameMode === "daily" && dailyDateKey) {
    return (
      <motion.div
        animate={{ opacity: 1 }}
        className={styles.gameOver}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <motion.div
          animate={{ opacity: 1 }}
          className={styles.dailySummary}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.14, duration: 0.28, ease: "easeOut" }}
        >
          <DailyCompletedSummary
            dailyLabel={`Dagens spel / ${formattedDailyDate}`}
            dateKey={dailyDateKey}
            nextDailyText={nextDailyText}
            onShare={share}
            score={score}
            shareText={shareText}
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className={styles.gameOver}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <motion.div
        animate={{ opacity: 1 }}
        className={styles.freePlaySummary}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.14, duration: 0.28, ease: "easeOut" }}
      >
        <div className={styles.summaryStack}>
          {selectionRoute ? (
            <FreePlayBreadcrumbs selectionRoute={selectionRoute} />
          ) : null}
          <div className={styles.scoresWrapper}>
            <Score score={score} title="Poäng" />
            <Score score={highscore} title="Bäst" />
          </div>
          <div className={styles.buttons}>
            {resetGame ? (
              <Button fullWidth onClick={resetGame} text="Spela igen" />
            ) : null}
            <Button
              fullWidth
              onClick={share}
              text={shareText}
              minimal={!!resetGame}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
