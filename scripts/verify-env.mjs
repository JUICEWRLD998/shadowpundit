/**
 * One-off credential verification. Run with:
 *   node --env-file=.env.local scripts/verify-env.mjs
 * Does NOT print secrets — only pass/fail + minimal context.
 */
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { MemWal } from "@mysten-incubation/memwal";

const line = (s) => console.log(s);
let failures = 0;

// ---- 1. Gemini -------------------------------------------------------------
line("\n=== 1. Google Gemini ===");
try {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) throw new Error("no key set");
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const { text } = await generateText({
    model: google(model),
    prompt: "Reply with exactly the word: PONG",
  });
  line(`  ✓ Gemini (${model}) responded: "${text.trim().slice(0, 40)}"`);
} catch (e) {
  failures++;
  line(`  ✗ Gemini failed: ${e?.message || e}`);
}

// ---- 2. MemWal -------------------------------------------------------------
line("\n=== 2. Walrus Memory (MemWal) ===");
try {
  if (!process.env.MEMWAL_DELEGATE_KEY || !process.env.MEMWAL_ACCOUNT_ID)
    throw new Error("MEMWAL_DELEGATE_KEY / MEMWAL_ACCOUNT_ID not set");

  const memwal = MemWal.create({
    key: process.env.MEMWAL_DELEGATE_KEY,
    accountId: process.env.MEMWAL_ACCOUNT_ID,
    serverUrl: process.env.MEMWAL_SERVER_URL || "https://relayer.memwal.ai",
    namespace: process.env.MEMWAL_NAMESPACE || "shadowpundit",
  });
  line(`  · server: ${process.env.MEMWAL_SERVER_URL || "https://relayer.memwal.ai"}`);

  // health (public, unsigned)
  try {
    const h = await memwal.health();
    line(`  ✓ health: status=${h.status} version=${h.version ?? "?"}`);
  } catch (e) {
    line(`  ! health check failed: ${e?.message || e}`);
  }

  // signed identity check
  const pub = await memwal.getPublicKeyHex();
  line(`  ✓ delegate public key derived (…${pub.slice(-8)})`);

  // round-trip: remember -> recall
  const token = `verify-token-${pub.slice(0, 6)}-${Date.now()}`;
  line(`  · remembering a probe memory…`);
  await memwal.rememberAndWait(`E2E verification probe: ${token}`, "conversations", {
    timeoutMs: 30000,
  });
  line(`  ✓ remember stored`);

  const recall = await memwal.recall({
    query: "E2E verification probe",
    namespace: "conversations",
    limit: 5,
  });
  const hit = recall.results.some((r) => r.text.includes(token));
  if (hit) line(`  ✓ recall round-trip OK (${recall.results.length} result(s), probe found)`);
  else {
    failures++;
    line(`  ✗ recall returned ${recall.results.length} result(s) but probe not found`);
  }
} catch (e) {
  failures++;
  line(`  ✗ MemWal failed: ${e?.message || e}`);
}

line(`\n=== RESULT: ${failures === 0 ? "ALL PASSED ✓" : failures + " CHECK(S) FAILED ✗"} ===`);
process.exit(failures === 0 ? 0 : 1);
