import React from "react";
import { PlayedCard } from "../types/cards";
import DailyCompletedSummary from "./daily-completed-summary";
import PlayedItemList from "./played-item-list";
import * as styles from "../styles/daily-completed-view.css";

interface Props {
  dailyLabel: string;
  dateKey: string;
  nextDailyText: string;
  onShare: () => void;
  played: PlayedCard[] | null;
  score: number;
  shareText: string;
}

export default function DailyCompletedView(props: Props) {
  const {
    dailyLabel,
    dateKey,
    nextDailyText,
    onShare,
    played,
    score,
    shareText,
  } = props;
  const openingAnchorRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.view}>
      <section className={styles.summarySection}>
        <DailyCompletedSummary
          dailyLabel={dailyLabel}
          dateKey={dateKey}
          nextDailyText={nextDailyText}
          onShare={onShare}
          score={score}
          shareText={shareText}
        />
      </section>

      {played ? (
        <section
          aria-labelledby="daily-completed-timeline-title"
          className={styles.timelineSection}
        >
          <div className={styles.timelineHeader}>
            <div>
              <div className={styles.timelineEyebrow}>Dagens spel</div>
              <h2
                className={styles.timelineTitle}
                id="daily-completed-timeline-title"
              >
                Din tidslinje
              </h2>
            </div>
            <div className={styles.timelineCount}>{played.length} kort</div>
          </div>
          <div className={styles.timelineViewport}>
            <PlayedItemList
              hiddenCardId={null}
              isDragging={false}
              items={played}
              layoutAnimationsEnabled={false}
              openingAnchorRef={openingAnchorRef}
              previewIndex={null}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
