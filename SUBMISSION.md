# Shadow Pundit — Walrus Memory World Cup Submission

> **AI World Cup 2026 prediction companion that spawns an adversarial "Shadow" twin from your own cognitive biases — and remembers you across every session, device, and day of the tournament.**

---

## Setup

| Item | Link |
|------|------|
| **Deployed agent** (live on Walrus Mainnet) | https://shadowpundit.vercel.app/ |
| **Public repo** | https://github.com/JUICEWRLD998/shadowpundit |
| **MemWalAccount on explorer** | See **Explorer link** below |

### Explorer link

The agent's memories are owned on Sui Mainnet by the account address:

```
0x61187d8ae2d79c1278b01756ec2f69cfb5474274129b2008d6fcb9104b9cb0ba
```

- **Suiscan (address):** https://suiscan.xyz/mainnet/object/0x61187d8ae2d79c1278b01756ec2f69cfb5474274129b2008d6fcb9104b9cb0ba
- **SuiVision (address):** https://suivision.xyz/account/0x61187d8ae2d79c1278b01756ec2f69cfb5474274129b2008d6fcb9104b9cb0ba

> On the explorer, open the **Owned Objects** tab and select the **`MemWalAccount`** object — that is the object holding the agent's memories. If you can read its object ID directly, paste the object-level link here too:
>
> `MemWalAccount object:` `<PASTE OBJECT-LEVEL EXPLORER URL ONCE CONFIRMED>`

---

## How Walrus Memory is used (2–5 sentences)

Every prediction a user makes — plus the reasoning behind it — is serialized and written to Walrus as an encrypted, semantically-searchable memory via MemWal, namespaced per Sui wallet so one user's history never bleeds into another's. On each new chat turn the agent recalls the user's prior predictions, detected biases, and Shadow state from Walrus and grounds its response in that retrieved context, so it builds on past sessions instead of starting fresh. Once enough predictions accumulate and a cognitive bias is detected, the agent emerges an adversarial "Shadow" persona that is itself persisted to Walrus and argues against new picks using the user's own remembered history as ammunition. Because identity is the wallet address and all memory lives on Walrus rather than in the browser, the same profile follows the user across devices and the entire tournament — the longer they use it, the sharper the Shadow gets.

---

## The Memory Moment (before / after)

> The core of the submission: the agent on **Day 1** vs. after **≥4 days** of real use, visibly referencing an earlier prediction.

**Day 1 — `<DATE>` (fresh wallet, empty memory):**
- `<SCREENSHOT/VIDEO: brand-new wallet — empty Calls page, no Shadow, blank Bias DNA>`
- What the agent could do: generic football chat, no memory of the user, no Shadow.

**After ≥4 days — `<DATE>`:**
- `<SCREENSHOT/VIDEO: the agent referencing a SPECIFIC past prediction by name + date>`
- `<SCREENSHOT/VIDEO: the Shadow emerging / roasting a new pick using the remembered history>`
- What changed: the agent recalls earlier calls, has profiled the user's biases, and the Shadow contradicts new predictions with receipts from Day 1.

**The one-line proof:** `<e.g. "On Day 1 I predicted Brazil to beat X; on Day 5 the Shadow opened with: 'You backed Brazil last week on pure recency bias — here we go again.'">`

---

## Reflection

> Honest answers score higher than positive ones.

### Did the agent behave how you expected?
`<YOUR HONEST NOTES — e.g. recall accuracy, did it surface the RIGHT past prediction or a loosely-related one? Did the Shadow emerge when expected (3 predictions + 1 detected bias)?>`

### What surprised you?
`<YOUR HONEST NOTES — e.g. semantic recall returning a memory you'd forgotten; latency/variance through the relayer; how persona generation felt once grounded in real history; the per-wallet namespacing "just working" across devices.>`

### What would you build differently?
`<YOUR HONEST NOTES — e.g. recall only inspects the newest N blobs so very old predictions fall out of the search window without a larger limit; would design a summarization/compaction layer; bias detection thresholds; would store structured fields vs. free text; would surface the explorer object more directly in-app.>`

### Honest feedback on Walrus Memory itself
`<YOUR HONEST NOTES — developer experience, the SDK, the relayer, what was confusing (e.g. delegate-key registration / the 401 until the key was registered on the dashboard), what worked well (rememberAndWait, semantic recall quality), docs gaps.>`

---

## Architecture (one-glance)

```
Browser ─► Sui wallet sign-in ─► verified session
   │
   ├─► /api/chat        recall(history+bias+fixtures) ─► ground prompt ─► onFinish: extract + store prediction
   ├─► /api/predictions store/recall calls            ──┐
   ├─► /api/bias        detect ─► store ─► recall       │
   ├─► /api/shadow      emerge persona ─► store ─► reply ├─► Walrus Memory (MemWal)
   └─► /api/leaderboard publish aggregate row (global) ──┘     namespaces scoped per wallet:
                                                              predictions::0x… · bias-profile::0x… · shadow-state::0x…
```

*Powered by Walrus Memory 🦭*
