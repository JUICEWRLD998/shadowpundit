import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { MemWal } from "@mysten-incubation/memwal";

// ---- Gemini: find a model with available quota -----------------------------
console.log("=== Gemini model probe ===");
const models = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-2.5-flash-lite",
];
for (const m of models) {
  try {
    const { text } = await generateText({
      model: google(m),
      prompt: "Reply with exactly: PONG",
    });
    console.log(`  ✓ ${m} -> "${text.trim().slice(0, 20)}"`);
  } catch (e) {
    const msg = (e?.message || String(e)).split("\n")[0].slice(0, 90);
    console.log(`  ✗ ${m} -> ${msg}`);
  }
}

// ---- MemWal: try both relayers --------------------------------------------
console.log("\n=== MemWal relayer probe ===");
const servers = [
  "https://relayer.memory.walrus.xyz",
  "https://relayer.memwal.ai",
];
for (const serverUrl of servers) {
  try {
    const memwal = MemWal.create({
      key: process.env.MEMWAL_DELEGATE_KEY,
      accountId: process.env.MEMWAL_ACCOUNT_ID,
      serverUrl,
      namespace: process.env.MEMWAL_NAMESPACE || "shadowpundit",
    });
    const token = `probe-${Date.now()}`;
    await memwal.rememberAndWait(`probe ${token}`, "conversations", { timeoutMs: 30000 });
    console.log(`  ✓ ${serverUrl} -> remember OK`);
  } catch (e) {
    const msg = (e?.message || String(e)).split("\n")[0].slice(0, 110);
    console.log(`  ✗ ${serverUrl} -> ${msg}`);
  }
}
