/**
 * MatchCard — compact fixture tile for the sidebar / arena.
 * Presentational only. Shows both sides, the kickoff (or score), and a stage
 * or group tag. Tabular numerals keep scores from jittering.
 */

import type { WorldCupMatch } from "@/types";
import styles from "./MatchCard.module.css";

const STAGE_LABEL: Partial<Record<WorldCupMatch["stage"], string>> = {
  "round-of-32": "R32",
  "round-of-16": "R16",
  "quarter-final": "QF",
  "semi-final": "SF",
  "third-place": "3rd",
  final: "Final",
};

export function MatchCard({ match }: { match: WorldCupMatch }) {
  const { teamA, teamB, teamAFlag, teamBFlag, time, status, score, group, stage } =
    match;

  const center =
    status === "scheduled" ? time || "vs" : score || (status === "live" ? "LIVE" : "–");

  const tag = group ? `Group ${group}` : STAGE_LABEL[stage];

  return (
    <article className={styles.card} data-status={status}>
      <div className={styles.row}>
        <span className={styles.team}>
          <span className={styles.flag}>{teamAFlag}</span>
          <span className={styles.name}>{teamA}</span>
        </span>
        <span className={`${styles.center} u-tnum`}>{center}</span>
        <span className={`${styles.team} ${styles.right}`}>
          <span className={styles.name}>{teamB}</span>
          <span className={styles.flag}>{teamBFlag}</span>
        </span>
      </div>
      {tag && (
        <div className={styles.meta}>
          <span className={styles.tag}>{tag}</span>
          {status === "live" && <span className={styles.live}>● live</span>}
        </div>
      )}
    </article>
  );
}
