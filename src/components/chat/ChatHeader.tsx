"use client";

/**
 * ChatHeader — the conversation's title bar.
 *
 * Carries the companion's identity (mark + name + live status) and the only
 * conversation-level action: clearing the transcript. Sits pinned at the top of
 * the conversation column, above the scrolling thread.
 */

import { Sparkles, Eraser } from "lucide-react";
import styles from "./ChatHeader.module.css";

interface ChatHeaderProps {
  /** Clears the running transcript. Hidden when there's nothing to clear. */
  onClear?: () => void;
  canClear?: boolean;
}

export function ChatHeader({ onClear, canClear = false }: ChatHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.identity}>
        <span className={styles.avatar} aria-hidden>
          <Sparkles size={16} strokeWidth={2.25} />
        </span>
        <span className={styles.meta}>
          <span className={styles.name}>ShadowPundit</span>
          <span className={styles.status}>
            <span className={styles.statusDot} aria-hidden />
            AI companion · online
          </span>
        </span>
      </div>

      {canClear && (
        <button
          type="button"
          className={styles.clear}
          onClick={onClear}
          aria-label="Clear conversation"
        >
          <Eraser size={15} aria-hidden />
          <span>Clear</span>
        </button>
      )}
    </header>
  );
}
