/**
 * POST /api/chat — streaming conversation with the ShadowPundit companion.
 *
 * AI SDK v6 contract:
 *   - The client (useChat) sends `{ messages: UIMessage[] }`.
 *   - We translate UI messages → model messages with convertToModelMessages,
 *     prepend the system prompt, and stream the model's reply back as a
 *     UI-message stream the client knows how to render incrementally.
 *
 * Phase 1 scope: pure streaming with the friendly persona. The Walrus-memory
 * recall + prediction extraction hooks are marked below and land in Phase 2 —
 * the prompt builder already accepts that context, so wiring it in is additive.
 */

import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { chatModel, isGeminiConfigured } from "@/lib/gemini";
import { buildFriendlySystemPrompt } from "@/prompts/system";

// Allow long-running streams on Vercel (Hobby caps at 10s without this).
export const maxDuration = 30;

interface ChatRequestBody {
  messages: UIMessage[];
  /** Anonymous client id — used for memory scoping in Phase 2. */
  userId?: string;
}

export async function POST(req: Request) {
  if (!isGeminiConfigured()) {
    return Response.json(
      { error: "The AI model isn't configured. Set GOOGLE_GENERATIVE_AI_API_KEY." },
      { status: 503 },
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json(
      { error: "`messages` must be a non-empty array." },
      { status: 400 },
    );
  }

  // ── Phase 2 hook ──────────────────────────────────────────────────────────
  // Recall the user's prediction history + bias notes + upcoming fixtures from
  // Walrus Memory and the WorldCup API, then pass them into the prompt context.
  // For now the companion runs context-free (still fully conversational).
  const system = buildFriendlySystemPrompt();

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: chatModel,
    system,
    messages: modelMessages,
    temperature: 0.8, // a touch of personality without going off the rails
  });

  // Surface server-side model errors instead of silently closing the stream.
  return result.toUIMessageStreamResponse({
    onError: (error) => {
      console.error("[/api/chat] stream error:", error);
      return "Something glitched on my end — give that another shot.";
    },
  });
}
