/**
 * PredictionCard — a single stored prediction, rendered for the sidebar / arena.
 * Presentational only; accepts already-parsed fields so it can show either a
 * freshly-made pick or one recalled from Walrus Memory.
 */

import styles from "./PredictionCard.module.css";

export interface PredictionCardProps {
  match: string;
  pick: string;
  predictedScore?: string;
  confidence?: number;
  reasoning?: string;
}

export function PredictionCard({
  match,
  pick,
  predictedScore,
  confidence,
  reasoning,
}: PredictionCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <span className={styles.match}>{match || "Prediction"}</span>
        {confidence ? (
          <span className={`${styles.conf} u-tnum`}>{confidence}/10</span>
        ) : null}
      </div>

      <div className={styles.pickRow}>
        <span className={styles.pick}>{pick}</span>
        {predictedScore ? (
          <span className={`${styles.score} u-tnum`}>{predictedScore}</span>
        ) : null}
      </div>

      {reasoning ? <p className={styles.reason}>“{reasoning}”</p> : null}
    </article>
  );
}
