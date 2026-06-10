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
    return [];
  }
}

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

