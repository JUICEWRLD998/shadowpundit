"use client";

/**
 * A single chat turn. Three visual identities:
 *   - user      → warm blue, right-aligned (the protagonist)
 *   - assistant → neutral glass, left-aligned (the friendly companion)
 *   - shadow    → cold violet + mono type, left-aligned (reserved for Phase 3)
 *
 * When `pending` is true and there's no text yet, it renders an animated
 * "thinking" indicator instead of an empty bubble.
 */

import { Ghost, Sparkles } from "lucide-react";
import type { ChatRole } from "@/types";
import styles from "./MessageBubble.module.css";

interface MessageBubbleProps {
  role: ChatRole;
  content: string;
  pending?: boolean;
}

const ROLE_LABEL: Record<ChatRole, string> = {
  user: "You",
  assistant: "ShadowPundit",
  shadow: "The Shadow",
};

export function MessageBubble({ role, content, pending = false }: MessageBubbleProps) {
  const showThinking = pending && content.length === 0;

  return (
    <div className={`${styles.row} ${styles[role]}`} data-role={role}>
      {role !== "user" && (
        <span className={styles.avatar} aria-hidden>
          {role === "shadow" ? <Ghost size={16} /> : <Sparkles size={16} />}
        </span>
      )}

      <div className={styles.stack}>
        <span className={styles.label}>{ROLE_LABEL[role]}</span>
        <div className={`${styles.bubble} glass`}>
          {showThinking ? (
            <span className={styles.thinking} aria-label="Thinking">
              <span />
              <span />
              <span />
            </span>
          ) : (
            <p className={styles.text}>{content}</p>
          )}
        </div>
      </div>
    </div>
  );
}
