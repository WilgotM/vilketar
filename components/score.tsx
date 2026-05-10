import * as styles from "../styles/score.css";

interface Props {
  score: number;
  title: string;
}

export default function Score(props: Props) {
  const { score, title } = props;
  let tone = "none";
  let rankLabel = "Ingen";

  if (score >= 20) {
    tone = "gold";
    rankLabel = "Guld";
  } else if (score >= 10) {
    tone = "silver";
    rankLabel = "Silver";
  } else if (score >= 1) {
    tone = "bronze";
    rankLabel = "Brons";
  }

  return (
    <div className={styles.score} data-tone={tone}>
      <span className={styles.segment}>{title}</span>
      <span aria-hidden="true" className={styles.separator}>
        /
      </span>
      <span className={styles.segment}>{score}</span>
      <span aria-hidden="true" className={styles.separator}>
        /
      </span>
      <span className={styles.segment}>{rankLabel}</span>
    </div>
  );
}
