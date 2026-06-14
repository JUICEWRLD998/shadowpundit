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
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import type { ChatRole } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import styles from "./ChatWindow.module.css";

/** Conversation openers shown on the empty state. */
const SUGGESTIONS = [
  "Argentina vs Spain in the final — who lifts it?",
  "I think England finally goes all the way. Convince me I'm wrong.",
  "Give me a bold group-stage upset to back.",
  "Brazil 3-1 Croatia. Am I overrating the Seleção?",
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

  return (
    <section className={styles.window}>
      <div className={styles.scroll} ref={scrollRef}>
        <div className={styles.thread}>
          {isEmpty ? (
            <EmptyState onPick={(text) => sendMessage({ text })} disabled={isBusy} />
          ) : (
            visibleMessages.map((m) => (
              <MessageBubble
                key={m.id}
                role={displayRole(m)!}
                content={messageText(m)}
              />
            ))
          )}

          {awaitingFirstToken && (
            <MessageBubble role="assistant" content="" pending />
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
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
