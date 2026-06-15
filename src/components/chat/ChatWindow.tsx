"use client";

/**
 * The conversation surface. Owns the AI SDK v6 `useChat` instance and renders
 * the running transcript + composer.
 *
 * v6 notes (these tripped up the old plan, which predates the UIMessage model):
 *   - useChat no longer hands you `input`/`handleSubmit`. You drive it with
 *     `sendMessage({ text })` and manage the draft yourself (ChatInput does).
 *   - Message content lives in `message.parts`, not `message.content`. We
 *     flatten the text parts to a string for rendering.
 *   - `status` is "submitted" → "streaming" → "ready" (or "error").
 */

import { useEffect, useMemo, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import type { ChatRole } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import styles from "./ChatWindow.module.css";

/** Conversation openers shown on the empty state. */
const SUGGESTIONS = [
  "Who are the favourites to win the World Cup this year?",
  "I'm backing Brazil to go all the way. What do you think?",
  "Which group-stage games should I watch this weekend?",
  "Help me pick a winner for France vs Argentina.",
];

/** Collapse a UIMessage's text parts into one string for display. */
function messageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

/** UIMessage roles are user/assistant/system; map to our display roles. */
function displayRole(message: UIMessage): ChatRole | null {
  if (message.role === "user") return "user";
  if (message.role === "assistant") return "assistant";
  return null; // system messages aren't rendered
}

export function ChatWindow() {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const isBusy = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0;

  // Show a standalone "thinking" bubble only while we wait for the first token
  // (once streaming begins, the assistant message itself carries the text).
  const awaitingFirstToken = status === "submitted";

  const visibleMessages = useMemo(
    () => messages.filter((m) => displayRole(m) !== null),
    [messages],
  );

  // Keep the latest turn in view as content streams in.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [visibleMessages, awaitingFirstToken]);

  // After the last assistant message, any "thinking" bubble continues that same
  // run — so the assistant's trailing message should not show its meta if a
  // pending bubble follows it.
  const lastVisibleRole =
    visibleMessages.length > 0
      ? displayRole(visibleMessages[visibleMessages.length - 1]!)
      : null;

  return (
    <section className={styles.window}>
      <div className={styles.scroll} ref={scrollRef}>
        <div className={styles.thread}>
          {isEmpty ? (
            <EmptyState onPick={(text) => sendMessage({ text })} disabled={isBusy} />
          ) : (
            <>
              <div className={styles.divider} aria-hidden>
                <span>Today</span>
              </div>

              {visibleMessages.map((m, i) => {
                const role = displayRole(m)!;
                const prevRole =
                  i > 0 ? displayRole(visibleMessages[i - 1]!) : null;
                const isLast = i === visibleMessages.length - 1;
                const streaming =
                  isLast && role === "assistant" && status === "streaming";
                // First message of a same-role run shows the avatar + label;
                // grouped continuations hide them and tuck in tighter.
                const grouped = role === prevRole;
                return (
                  <MessageBubble
                    key={m.id}
                    role={role}
                    content={messageText(m)}
                    streaming={streaming}
                    grouped={grouped}
                  />
                );
              })}
            </>
          )}

          {awaitingFirstToken && (
            <MessageBubble
              role="assistant"
              content=""
              pending
              grouped={lastVisibleRole === "assistant"}
            />
          )}

          {error && (
            <p className={styles.error} role="alert">
              {error.message || "The companion went quiet. Try again in a moment."}
            </p>
          )}

          <div ref={endRef} />
        </div>
      </div>

      <div className={styles.composer}>
        <div className={styles.composerInner}>
          <ChatInput onSend={(text) => sendMessage({ text })} disabled={isBusy} />
        </div>
      </div>
    </section>
  );
}

function EmptyState({
  onPick,
  disabled,
}: {
  onPick: (text: string) => void;
  disabled: boolean;
}) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyBadge}>
        <span className={styles.emptyDot} />
        Your companion is listening
      </div>
      <h2 className={styles.emptyTitle}>
        Talk me through your <span className="u-gradient-text">World Cup</span> calls.
      </h2>
      <p className={styles.emptyLede}>
        Make a prediction — who wins, the score, and the reasoning behind it.
        I&apos;ll push back where it&apos;s thin. Every take you make is remembered.
      </p>
      <div className={styles.suggestions}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            className={styles.suggestion}
            onClick={() => onPick(s)}
            disabled={disabled}
          >
            <span>{s}</span>
            <ArrowUpRight size={15} aria-hidden className={styles.suggestionIcon} />
          </button>
        ))}
      </div>
    </div>
  );
}
