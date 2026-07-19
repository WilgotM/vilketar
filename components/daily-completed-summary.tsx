import DailyLeaguesSummary from "./daily-leagues-summary";
import DailyShareTutorial from "./daily-share-tutorial";
import Score from "./score";
import * as styles from "../styles/daily-completed-summary.css";

interface Props {
  dailyLabel: string;
  dateKey: string;
  nextDailyText: string;
  onShare: () => void;
  score: number;
  shareText: string;
}

export default function DailyCompletedSummary(props: Props) {
  const { dailyLabel, dateKey, nextDailyText, onShare, score, shareText } =
    props;

  return (
    <div className={styles.summary}>
      <div className={styles.dailyLabel}>{dailyLabel}</div>
      <div className={styles.score}>
        <Score score={score} title="Poäng" />
      </div>
      <DailyShareTutorial
        onShare={onShare}
        score={score}
        shareText={shareText}
      />
      <DailyLeaguesSummary dateKey={dateKey} />
      <div className={styles.metaText}>{nextDailyText}</div>
    </div>
  );
}
