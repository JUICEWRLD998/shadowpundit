/**
 * Google Gemini model configuration.
 *
 * Centralizes model selection so every route shares one source of truth.
 * The @ai-sdk/google provider reads GOOGLE_GENERATIVE_AI_API_KEY from the
 * environment automatically — no key is passed here.
 *
 * Server only.
 */

import { google } from "@ai-sdk/google";

/**
 * Default chat model. `gemini-2.5-flash` — fast, cheap, great for streaming,
 * and available on this project's free tier (gemini-2.0-flash returns a
 * zero-quota error for the current key). Override with GEMINI_MODEL.
 */
export const GEMINI_MODEL_ID = process.env.GEMINI_MODEL || "gemini-2.5-flash";

/** The primary conversational model used by /api/chat. */
export const chatModel = google(GEMINI_MODEL_ID);

/**
 * A separate handle for structured/analytical work (bias detection, roast
 * generation). Same underlying model today, but isolated so we can swap in a
 * stronger reasoning model later without touching call sites.
 */
export const analysisModel = google(
  process.env.GEMINI_ANALYSIS_MODEL || GEMINI_MODEL_ID,
);

/** True when the Gemini API key is present. */
export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
}
