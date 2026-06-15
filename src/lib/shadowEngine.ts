/**
 * Shadow engine — the doppelgänger's brain.
 *
 * Owns the whole Phase-3 loop:
 *   1. EMERGENCE — decide when enough of the user exists in memory for a Shadow
 *      to be spawned (prediction volume + distinct biases).
 *   2. BIRTH — generate an adversarial personality from the user's real history
 *      and persist it to the Walrus `shadow-state` namespace.
 *   3. VOICE — once active, generate the Shadow's in-chat interjections, grounded
 *      in that same history.
 *
 * Like the rest of the memory layer, every call degrades gracefully: a missing
 * or slow MemWal yields safe empties so the chat never breaks.
 *
 * Server only.
 */

import {
  convertToModelMessages,
  generateObject,
  generateText,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { analysisModel, chatModel } from "./gemini";
import {
  recallMemories,
  rememberAsync,
  isMemWalConfigured,
} from "./memwal";
import { recallPredictions } from "./predictions";
import { summarizePredictionsForPrompt } from "./predictionMemory";
import { recallBiasNotes } from "./biasDetector";
import {
  buildPersonaGenPrompt,
  buildShadowSystemPrompt,
} from "@/prompts/shadowPersona";
import type { ShadowPersonality, ShadowRecord, ShadowTone } from "@/types";

/* ----------------------------------------------------------- thresholds -- */

/**
 * How much "you" must exist in memory before the Shadow can spawn. Kept low
 * enough to be demoable in one sitting, and env-overridable so the bar can be
 * raised for production. The narrative beat ("enough data accumulates → it
 * SPAWNS") survives either way.
 */
export const EMERGENCE = {
  minPredictions: Number(process.env.SHADOW_MIN_PREDICTIONS) || 3,
  minBiasTypes: Number(process.env.SHADOW_MIN_BIAS_TYPES) || 1,
} as const;

export interface Eligibility {
  eligible: boolean;
  predictionCount: number;
  biasTypeCount: number;
  needed: { predictions: number; biasTypes: number };
}

/** Distinct bias types present across recalled `bias-profile` memories. */
function distinctBiasTypes(memories: string[]): number {
  const types = new Set<string>();
  for (const m of memories) {
    const match = m.match(/^Type:\s*(\w+)/im);
    if (match) types.add(match[1]);
  }
  return types.size;
}

/** Read current memory and decide whether the Shadow is ready to spawn. */
export async function checkEligibility(): Promise<Eligibility> {
  const [predictions, biasMemories] = await Promise.all([
    recallPredictions(undefined, 30).catch(() => []),
    recallMemories(
      "the user's detected cognitive biases",
      "bias-profile",
      20,
    ).catch(() => [] as string[]),
  ]);

  const predictionCount = predictions.length;
  const biasTypeCount = distinctBiasTypes(biasMemories);

  return {
    eligible:
      predictionCount >= EMERGENCE.minPredictions &&
      biasTypeCount >= EMERGENCE.minBiasTypes,
    predictionCount,
    biasTypeCount,
    needed: {
      predictions: EMERGENCE.minPredictions,
      biasTypes: EMERGENCE.minBiasTypes,
    },
  };
}

/* ------------------------------------------------------ state in memory -- */

/** The persisted Shadow, parsed back from its memory block. */
export interface ShadowSnapshot {
  active: boolean;
  activatedAt: string;
  personality: ShadowPersonality;
  record: ShadowRecord;
}

const TONES: ShadowTone[] = ["sarcastic", "analytical", "savage", "playful"];

function oneLine(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/** Serialize a freshly-born Shadow into its `shadow-state` memory block. */
function formatShadowMemory(snap: ShadowSnapshot): string {
  const p = snap.personality;
  return [
    `SHADOW STATE [${snap.activatedAt}]`,
    `Active: ${snap.active}`,
    `Tone: ${p.tone}`,
    `Known Biases: ${p.knownBiases.join(", ")}`,
    `Catchphrase: ${oneLine(p.catchphrase)}`,
    `Favorite Counter: ${oneLine(p.favoriteCounterArgument)}`,
    `Emergence Message: ${oneLine(p.emergenceMessage)}`,
    `Record: ${snap.record.wins}W-${snap.record.losses}L-${snap.record.draws}D`,
  ].join("\n");
}

function field(block: string, label: string): string {
  const m = block.match(new RegExp(`^${label}:\\s*(.+)$`, "mi"));
  return m ? m[1].trim() : "";
}

/** Parse a recalled `shadow-state` block back into a snapshot, or null. */
function parseShadowMemory(raw: string): ShadowSnapshot | null {
  if (!/^SHADOW STATE \[/im.test(raw)) return null;
  const ts = raw.match(/SHADOW STATE \[([^\]]+)\]/i)?.[1] ?? "";
  const toneRaw = field(raw, "Tone").toLowerCase();
  const tone = (TONES.includes(toneRaw as ShadowTone) ? toneRaw : "analytical") as ShadowTone;
  const recordRaw = field(raw, "Record");
  const rec = recordRaw.match(/(\d+)W-(\d+)L-(\d+)D/);

  return {
    active: /true/i.test(field(raw, "Active")),
    activatedAt: ts,
    personality: {
      tone,
      knownBiases: field(raw, "Known Biases")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean) as ShadowPersonality["knownBiases"],
      catchphrase: field(raw, "Catchphrase"),
      favoriteCounterArgument: field(raw, "Favorite Counter"),
      emergenceMessage: field(raw, "Emergence Message"),
    },
    record: {
      wins: rec ? Number(rec[1]) : 0,
      losses: rec ? Number(rec[2]) : 0,
      draws: rec ? Number(rec[3]) : 0,
    },
  };
}

/** Recall the live Shadow, newest record wins. Null if it hasn't spawned yet. */
export async function getShadowSnapshot(): Promise<ShadowSnapshot | null> {
  const memories = await recallMemories(
    "the shadow's state, personality and emergence",
    "shadow-state",
    8,
  ).catch(() => [] as string[]);

  const snaps = memories
    .map(parseShadowMemory)
    .filter((s): s is ShadowSnapshot => s !== null && s.active)
    .sort((a, b) => (a.activatedAt < b.activatedAt ? 1 : -1));

  return snaps[0] ?? null;
}

/* ------------------------------------------------------------ birth --- -- */

const personaSchema = z.object({
  tone: z.enum(["sarcastic", "analytical", "savage", "playful"]),
  knownBiases: z
    .array(z.string())
    .describe("Bias slugs this Shadow weaponises. May be empty."),
  catchphrase: z.string(),
  favoriteCounterArgument: z.string(),
  emergenceMessage: z
    .string()
    .describe(
      "The Shadow's first words: 3–5 sentences, one paragraph, no line breaks, quoting a specific pattern from the user's real history.",
    ),
});

/** Generate the Shadow's personality from the user's real history + biases. */
async function generatePersonality(
  predictionHistory: string,
  biasNotes: string,
): Promise<ShadowPersonality> {
  const { object } = await generateObject({
    model: analysisModel,
    schema: personaSchema,
    prompt: buildPersonaGenPrompt({ predictionHistory, biasNotes }),
    temperature: 0.7,
  });

  return {
    tone: object.tone,
    knownBiases: object.knownBiases as ShadowPersonality["knownBiases"],
    catchphrase: oneLine(object.catchphrase),
    favoriteCounterArgument: oneLine(object.favoriteCounterArgument),
    emergenceMessage: oneLine(object.emergenceMessage),
  };
}

/**
 * Spawn the Shadow: generate its personality from memory and persist it. Returns
 * the new snapshot, or null if generation failed (caller can retry later).
 */
export async function emergeShadow(): Promise<ShadowSnapshot | null> {
  const [predictions, biasNotes] = await Promise.all([
    recallPredictions(undefined, 30).catch(() => []),
    recallBiasNotes().catch(() => ""),
  ]);

  const history = summarizePredictionsForPrompt(
    predictions.map((p) => p.raw),
    20,
  );

  let personality: ShadowPersonality;
  try {
    personality = await generatePersonality(history, biasNotes);
  } catch (error) {
    console.error("[shadowEngine] persona generation failed:", error);
    return null;
  }

  const snap: ShadowSnapshot = {
    active: true,
    activatedAt: new Date().toISOString(),
    personality,
    record: { wins: 0, losses: 0, draws: 0 },
  };

  // Fire-and-forget; the Shadow is "born" the moment we return it to the client,
  // and the relayer finishes persisting in the background.
  if (isMemWalConfigured()) {
    await rememberAsync(formatShadowMemory(snap), "shadow-state");
  }

  return snap;
}

/* ------------------------------------------------------------- voice ----- */

/** Compact, human description of the Shadow used to prime its live prompt. */
function describePersonality(p: ShadowPersonality): string {
  return [
    `Tone: ${p.tone}.`,
    p.favoriteCounterArgument && `Signature attack: ${p.favoriteCounterArgument}.`,
    p.catchphrase && `Catchphrase: "${p.catchphrase}".`,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Generate the Shadow's interjection for the current conversation. Returns the
 * Shadow's reply text, or "" if it has nothing to say / generation failed.
 */
export async function generateShadowReply(
  messages: UIMessage[],
  snapshot: ShadowSnapshot,
): Promise<string> {
  try {
    const [predictions, biasNotes] = await Promise.all([
      recallPredictions(undefined, 20).catch(() => []),
      recallBiasNotes().catch(() => ""),
    ]);

    const userHistory = summarizePredictionsForPrompt(
      predictions.map((p) => p.raw),
      12,
    );
    const r = snapshot.record;

    const system = buildShadowSystemPrompt({
      personality: describePersonality(snapshot.personality),
      biasProfile: biasNotes,
      userHistory,
      shadowRecord: `${r.wins}W-${r.losses}L-${r.draws}D`,
    });

    const modelMessages = await convertToModelMessages(messages);
    const { text } = await generateText({
      model: chatModel,
      system,
      messages: modelMessages,
      temperature: 0.85,
    });

    return text.trim();
  } catch (error) {
    console.error("[shadowEngine] reply generation failed:", error);
    return "";
  }
}
