/**
 * Model configuration — Gemini, served through OpenRouter.
 *
 * Centralizes model selection so every route shares one source of truth.
 * We talk to Gemini via OpenRouter (paid credits) instead of Google's free
 * tier, which sidesteps the per-key quota limits. The OpenRouter provider
 * reads OPENROUTER_KEY from the environment.
 *
 * The exported names (chatModel, analysisModel, isGeminiConfigured) are kept
 * stable so call sites don't need to change.
 *
 * Server only.
 */

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

/**
 * OpenRouter client. The API key is read here explicitly so a missing key
 * fails loudly at call time rather than silently. We tolerate the legacy
 * OPENROUTER_API_KEY name too.
 */
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_KEY || process.env.OPENROUTER_API_KEY || "",
});

/**
 * Chat model — `google/gemini-2.5-flash`. Fast, cheap, great for streaming
 * conversation and the Shadow's live voice. Override with CHAT_MODEL.
 */
export const CHAT_MODEL_ID =
  process.env.CHAT_MODEL || "google/gemini-2.5-flash";

/**
 * Analysis model — `google/gemini-2.5-pro`. Stronger reasoning for the
 * structured/analytical work (bias detection, persona generation, prediction
 * parsing, roasts). Override with ANALYSIS_MODEL.
 */
export const ANALYSIS_MODEL_ID =
  process.env.ANALYSIS_MODEL || "google/gemini-2.5-pro";

/** The primary conversational model used by /api/chat and the Shadow voice. */
export const chatModel = openrouter.chat(CHAT_MODEL_ID);

/** A stronger model for structured/analytical work. */
export const analysisModel = openrouter.chat(ANALYSIS_MODEL_ID);

/** True when the OpenRouter key is present. */
export function isGeminiConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_KEY || process.env.OPENROUTER_API_KEY);
}
