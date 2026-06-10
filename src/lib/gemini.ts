// src/lib/gemini.ts

import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Standard client creation
export const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "dummy-key-for-now",
});

// Setup gemini-2.0-flash as the main chat model
export const geminiModel = googleProvider("gemini-2.0-flash");
