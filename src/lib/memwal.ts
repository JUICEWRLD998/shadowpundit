<<<<<<< HEAD
/**
 * Walrus Memory (MemWal) — SDK singleton + ergonomic helpers.
 *
 * All persistent memory in Shadow Pundit lives here: predictions, bias
 * profiles, the Shadow's state, conversation summaries, and match results.
 * The SDK signs requests with an Ed25519 delegate key; the relayer (a TEE)
 * does encryption, embedding, and Walrus storage server-side.
 *
 * Server only — never import this into a client component.
 */

import { MemWal } from "@mysten-incubation/memwal";
import type { MemoryNamespace } from "@/types";

let memwalInstance: MemWal | null = null;

/** True when MemWal credentials are present in the environment. */
export function isMemWalConfigured(): boolean {
  return Boolean(
    process.env.MEMWAL_DELEGATE_KEY && process.env.MEMWAL_ACCOUNT_ID,
  );
}

/**
 * Lazily create and cache the MemWal client. Throws a clear error if the
 * required environment variables are missing so failures are obvious.
 */
export function getMemWal(): MemWal {
  if (!isMemWalConfigured()) {
    throw new Error(
      "MemWal is not configured. Set MEMWAL_DELEGATE_KEY and MEMWAL_ACCOUNT_ID in your environment.",
    );
  }

  if (!memwalInstance) {
    memwalInstance = MemWal.create({
      key: process.env.MEMWAL_DELEGATE_KEY!,
      accountId: process.env.MEMWAL_ACCOUNT_ID!,
      serverUrl: process.env.MEMWAL_SERVER_URL || "https://relayer.memwal.ai",
      namespace: process.env.MEMWAL_NAMESPACE || "shadowpundit",
    });
  }

  return memwalInstance;
}

/**
 * Store a memory and wait for the background job to reach a terminal state.
 * Retries with exponential backoff so transient relayer/network blips don't
 * silently drop a prediction.
 *
 * @returns true on success, false if every attempt failed.
 */
export async function rememberWithRetry(
  text: string,
  namespace: MemoryNamespace,
  maxRetries = 3,
): Promise<boolean> {
  const memwal = getMemWal();

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await memwal.rememberAndWait(text, namespace, { timeoutMs: 20_000 });
      return true;
    } catch (error) {
      const isLast = attempt === maxRetries - 1;
      if (isLast) {
        console.error(
          `[memwal] remember failed after ${maxRetries} attempts (ns=${namespace}):`,
          error,
        );
        return false;
      }
      await sleep(800 * (attempt + 1));
    }
  }

  return false;
}

/**
 * Fire-and-forget remember — returns as soon as the relayer accepts the job.
 * Use inside streaming routes where we don't want to block the response.
 */
export async function rememberAsync(
  text: string,
  namespace: MemoryNamespace,
): Promise<boolean> {
  try {
    await getMemWal().remember(text, namespace);
    return true;
  } catch (error) {
    console.error(`[memwal] async remember failed (ns=${namespace}):`, error);
    return false;
  }
}

/**
 * Recall memories semantically similar to `query`. Returns plain strings so
 * callers don't have to know the SDK result shape. On any failure (including
 * "not configured" in local dev) returns an empty array rather than throwing,
 * so the chat flow degrades gracefully.
 */
export async function recallMemories(
  query: string,
  namespace?: MemoryNamespace,
  limit = 10,
): Promise<string[]> {
  if (!isMemWalConfigured()) return [];

  try {
    const result = await getMemWal().recall({ query, limit, namespace });
    return result.results.map((m) => m.text);
  } catch (error) {
    console.error(`[memwal] recall failed (ns=${namespace}):`, error);
=======
// src/lib/memwal.ts

import { MemWal } from "@mysten-incubation/memwal";

let memwalInstance: MemWal | null = null;

export function getMemWal(): MemWal {
  if (!memwalInstance) {
    if (!process.env.MEMWAL_DELEGATE_KEY || !process.env.MEMWAL_ACCOUNT_ID) {
      console.warn("MemWal environment variables are missing! Using mock MemWal client.");
      return createMockMemWal();
    }
    memwalInstance = MemWal.create({
      key: process.env.MEMWAL_DELEGATE_KEY,
      accountId: process.env.MEMWAL_ACCOUNT_ID,
      serverUrl: process.env.MEMWAL_SERVER_URL || "https://relayer.memory.walrus.xyz",
      namespace: "shadowpundit",
    });
  }
  return memwalInstance;
}

// Helper: Remember with retry
export async function rememberWithRetry(
  text: string,
  namespace: string,
  maxRetries = 3
): Promise<void> {
  const memwal = getMemWal();
  for (let i = 0; i < maxRetries; i++) {
    try {
      const job = await memwal.remember(text);
      await memwal.waitForRememberJob(job.job_id, { timeoutMs: 15000 });
      return;
    } catch (error) {
      console.error(`Error in rememberWithRetry (attempt ${i + 1}/${maxRetries}):`, error);
      if (i === maxRetries - 1) throw error;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

// Helper: Recall with namespace
export async function recallMemories(
  query: string,
  namespace?: string
): Promise<string[]> {
  const memwal = getMemWal();
  try {
    const memories = await memwal.recall({ query, ...(namespace && { namespace }) });
    return memories.results.map((m: any) => m.text || String(m));
  } catch (error) {
    console.error("Error in recallMemories:", error);
>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
    return [];
  }
}

<<<<<<< HEAD
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
=======
// Fallback Mock for local development without credentials
function createMockMemWal(): any {
  // In-memory simple storage mock
  const storage: { text: string; namespace: string }[] = [];
  return {
    remember: async (text: string) => {
      console.log(`[MOCK MEMWAL] Remembering text in shadowpundit:`, text);
      storage.push({ text, namespace: "shadowpundit" });
      return { job_id: "mock-job-id" };
    },
    waitForRememberJob: async (jobId: string) => {
      return { status: "success" };
    },
    recall: async (options: { query: string; namespace?: string }) => {
      console.log(`[MOCK MEMWAL] Recalling:`, options);
      return {
        results: storage.map(s => ({ text: s.text, distance: 0, blob_id: "mock" })),
        total: storage.length
      };
    }
  };
}

>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
