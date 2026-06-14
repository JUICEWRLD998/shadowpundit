"use client";

/**
 * Sidebar — the chat page's context rail.
 *
 * Two live sections that make the Phase 2 memory + data loop visible:
 *   1. Upcoming fixtures (real WorldCup26.ir data via /api/matches)
 *   2. The user's recent predictions, recalled from Walrus Memory
 *
 * Responsive behaviour:
 *   - Desktop (>1024px): a static rail beside the chat (unchanged).
 *   - Mobile (≤1024px): the rail is an off-canvas drawer. A floating "Fixtures"
 *     button opens it over the chat; a backdrop / Escape / the × closes it. The
 *     chat keeps the full screen until the user asks for context.
 */

import { useEffect, useState } from "react";
import { Calendar, X } from "lucide-react";
import { useUpcomingMatches } from "@/hooks/useWorldCup";
import { useRecentPredictions } from "@/hooks/usePredictions";
import { MatchCard } from "@/components/arena/MatchCard";
import { PredictionCard } from "@/components/chat/PredictionCard";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { matches, loading: matchesLoading } = useUpcomingMatches(5);
  const { predictions, loading: predLoading } = useRecentPredictions(4);

  // Close the mobile drawer on Escape for accessibility.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Mobile-only toggle — hidden on desktop via CSS */}
      <button
        type="button"
        className={styles.fab}
        onClick={() => setOpen(true)}
        aria-label="Show fixtures and your recent calls"
        aria-expanded={open}
        aria-controls="context-rail"
      >
        <Calendar size={16} aria-hidden="true" />
        <span>Fixtures</span>
      </button>

      {/* Mobile-only backdrop */}
      {open && (
        <div
          className={styles.backdrop}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="context-rail"
        className={styles.sidebar}
        data-open={open}
        aria-label="World Cup context"
      >
        <button
          type="button"
          className={styles.close}
          onClick={() => setOpen(false)}
          aria-label="Close panel"
        >
          <X size={18} aria-hidden="true" />
        </button>

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
    </>
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
