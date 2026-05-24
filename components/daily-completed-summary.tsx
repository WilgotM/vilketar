import classNames from "classnames";
import DailyLeaguesSummary from "./daily-leagues-summary";
import Score from "./score";
import * as buttonStyles from "../styles/button.css";
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
      <button
        className={classNames(buttonStyles.button, styles.shareButton)}
        onClick={onShare}
        type="button"
      >
        {shareText}
      </button>
      <DailyLeaguesSummary dateKey={dateKey} />
      <div className={styles.metaText}>{nextDailyText}</div>
    </div>
  );
}
