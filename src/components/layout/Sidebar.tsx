"use client";

/**
 * Sidebar — the chat page's context rail.
 *
 * Two live sections that make the Phase 2 memory + data loop visible:
 *   1. Upcoming fixtures (real WorldCup26.ir data via /api/matches)
 *   2. The user's recent predictions, recalled from Walrus Memory
 *
 * Purely additive: it sits beside the ChatWindow and is hidden on narrow
 * viewports (see Sidebar.module.css), so it never alters the chat experience.
 */

import { useUpcomingMatches } from "@/hooks/useWorldCup";
import { useRecentPredictions } from "@/hooks/usePredictions";
import { MatchCard } from "@/components/arena/MatchCard";
import { PredictionCard } from "@/components/chat/PredictionCard";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const { matches, loading: matchesLoading } = useUpcomingMatches(5);
  const { predictions, loading: predLoading } = useRecentPredictions(4);

  return (
    <aside className={styles.sidebar} aria-label="World Cup context">
      <section className={styles.block}>
        <header className={styles.blockHead}>
          <h3 className={styles.title}>Upcoming fixtures</h3>
        </header>
        <div className={styles.list}>
          {matchesLoading ? (
            <SkeletonRows count={3} />
          ) : matches.length > 0 ? (
            matches.map((m) => <MatchCard key={m.id} match={m} />)
          ) : (
            <p className={styles.empty}>No fixtures to show right now.</p>
          )}
        </div>
      </section>

      <section className={styles.block}>
        <header className={styles.blockHead}>
          <h3 className={styles.title}>Your recent calls</h3>
          {predictions.length > 0 && (
            <span className={`${styles.count} u-tnum`}>{predictions.length}</span>
          )}
        </header>
        <div className={styles.list}>
          {predLoading ? (
            <SkeletonRows count={2} />
          ) : predictions.length > 0 ? (
            predictions.map((p, i) => (
              <PredictionCard
                key={`${p.timestamp}-${i}`}
                match={p.match}
                pick={p.pick}
                predictedScore={p.predictedScore}
                confidence={p.confidence}
                reasoning={p.reasoning}
              />
            ))
          ) : (
            <p className={styles.empty}>
              Make a call in the chat — it&apos;ll show up here, remembered.
            </p>
          )}
        </div>
      </section>
    </aside>
  );
}

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </>
  );
}
