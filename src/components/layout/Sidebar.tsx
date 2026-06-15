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
import { motion } from "framer-motion";
import { useUpcomingMatches } from "@/hooks/useWorldCup";
import { useRecentPredictions } from "@/hooks/usePredictions";
import { MatchCard } from "@/components/arena/MatchCard";
import { PredictionCard } from "@/components/chat/PredictionCard";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SPRING } from "@/lib/motion";
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
          {matchesLoading ? (
            <div className={styles.list}>
              <SkeletonRows count={3} />
            </div>
          ) : matches.length > 0 ? (
            <Stagger className={styles.list} stagger={0.06}>
              {matches.map((m) => (
                <StaggerItem key={m.id}>
                  <MatchCard match={m} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className={styles.empty}>No fixtures to show right now.</p>
          )}
        </section>

        <section className={styles.block}>
          <header className={styles.blockHead}>
            <h3 className={styles.title}>Your recent calls</h3>
            {predictions.length > 0 && (
              <motion.span
                key={predictions.length}
                className={`${styles.count} u-tnum`}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={SPRING.snappy}
              >
                {predictions.length}
              </motion.span>
            )}
          </header>
          {predLoading ? (
            <div className={styles.list}>
              <SkeletonRows count={2} />
            </div>
          ) : predictions.length > 0 ? (
            <Stagger className={styles.list} stagger={0.06}>
              {predictions.map((p, i) => (
                <StaggerItem key={`${p.timestamp}-${i}`}>
                  <PredictionCard
                    match={p.match}
                    pick={p.pick}
                    predictedScore={p.predictedScore}
                    confidence={p.confidence}
                    reasoning={p.reasoning}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className={styles.empty}>
              Make a call in the chat — it&apos;ll show up here, remembered.
            </p>
          )}
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
