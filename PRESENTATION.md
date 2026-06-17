# Shadow Pundit — Demo / Presentation Script

> **Format:** one continuous screen-recording, one wallet, fully honest.
> **Target length:** ~2–3 minutes.
> **The single most important shot:** Section 3 — the Shadow referencing a *specific* past prediction. Everything else supports that moment.

**Before you hit record (checklist):**
- [ ] Logged in with your **real wallet** (the one with several days of real calls).
- [ ] You've identified **one specific past prediction** you want the Shadow to roast (know the team + your reasoning so you can call it out on camera).
- [ ] Suiscan object page open in another tab: `https://suiscan.xyz/mainnet/object/0x61187d8ae2d79c1278b01756ec2f69cfb5474274129b2008d6fcb9104b9cb0ba`
- [ ] Browser zoom set so text is readable in the recording.
- [ ] Close noisy tabs / notifications. Mic tested.

---

## 0. Cold open (0:00–0:10)

**On screen:** Landing page, hero visible.

**Say:**
> "This is **Shadow Pundit** — an AI World Cup companion that doesn't just talk football. It *remembers* you. Every prediction you make is stored as persistent memory on **Walrus**, and over time it learns your biases and spawns an adversarial 'Shadow' twin that argues against you using your own history."

---

## 1. Landing → the premise (0:10–0:35)

**On screen:** Scroll the landing page slowly — hero, the "duel" / feature cards.

**Say:**
> "The idea is simple: the longer the tournament runs, the *more* useful the agent gets — because it remembers. On day one it's a friendly pundit. But quietly, it's profiling how I think. Once it knows me well enough, my Shadow wakes up."

**Tip:** Don't linger. ~20 seconds max on the pitch.

---

## 2. The "before" — real accumulated memory (0:35–1:05)

**On screen:** Navigate to the **Calls** page. Let the list of past predictions load. Hover/point at the **timestamps**.

**Say:**
> "Here's the proof this is real memory, not a session cache. These are predictions I've made **over the past several days** — different sessions, different days — all persisted on Walrus and scoped to my wallet. This is my 'before': the agent has been quietly building a record of how I call matches."

**Tip:** This is your honest Day-1-vs-now contrast. Emphasize the **dates** — that's what proves persistence across time. Say the number out loud ("I've made N calls so far").

---

## 3. THE MEMORY MOMENT — the core (1:05–1:55)  ⭐

**On screen:** Open a **fresh Chat**. Make a new prediction OR ask about a match related to a past pick. Then let the agent + Shadow respond.

**Say (as you type):**
> "Now watch what happens when I make a new call. I'll back [TEAM] here…"

**On screen:** The assistant responds and **recalls a specific earlier prediction**; the **Shadow interjects** and roasts you with your own history.

**Say (point at the Shadow's message):**
> "There it is — this is the whole point. It didn't just answer. It *remembered* that days ago I predicted [PAST PICK], and my Shadow is calling out the pattern — [e.g. 'you always back the favourite', 'recency bias again']. It's using my **own past predictions as ammunition**. That memory came straight off Walrus."

**Tip:**
- This is the clip you'll screenshot for the written submission. If the Shadow's roast lands well, **pause an extra beat** on it so it's unmistakable.
- If the Shadow doesn't reference the exact call you wanted, steer it: bring up the match/team tied to your strongest past pick.
- If the Shadow hasn't emerged yet on this wallet, make sure you've hit the threshold (3+ predictions + a detected bias) before recording.

---

## 4. Proof on-chain — the explorer (1:55–2:15)

**On screen:** Switch to the Suiscan tab showing the **`MemWalAccount` object**.

**Say:**
> "And this isn't a database on my server. Here's the **MemWalAccount object live on Sui Mainnet** — these are my memories, on-chain, verifiable by anyone. That's portable, persistent memory in the literal sense."

**Tip:** Point at the object **type** (`…::account::MemWalAccount`) and the owner. Keep it short — judges just need to see it exists.

---

## 5. Quick tour — depth (2:15–2:45)

**On screen:** Move briskly through:
- **Arena** — "You vs Shadow accuracy on real, completed matches."
- **Bias DNA / Profile** — "A visual profile of my prediction psychology, built from everything it's learned."
- **Leaderboard** — "And memory at scale — real users ranked against each other."

**Say:**
> "Everything here is downstream of that same memory: the Arena scores me against my Shadow on real results, the Bias DNA visualises the profile it's built, and the leaderboard ranks real users. The more I use it, the sharper all of this gets."

**Tip:** ~10 seconds each. This shows the project has depth without slowing the momentum.

---

## 6. Close + honest reflection (2:45–3:00)

**On screen:** Back to the chat or landing.

**Say:**
> "What surprised me building this was [ONE HONEST LINE — e.g. how well semantic recall surfaced an old call I'd forgotten / the latency through the relayer / how the Shadow felt genuinely personal once grounded in real history]. If I built it again I'd [ONE HONEST LINE — e.g. add a summarisation layer so very old predictions don't fall out of the recall window]. But the core promise holds: **an agent that's more useful on day five than day one, because it remembers.** That's Shadow Pundit."

---

## Appendix — Submission asset checklist

After recording, make sure you have:
- [ ] **The Memory Moment screenshot** (Section 3) — the Shadow citing a specific past prediction. *This is the core of the written submission.*
- [ ] **Calls page screenshot** showing timestamped multi-day history (Section 2).
- [ ] **Explorer link** verified to load (Section 4) → paste into `SUBMISSION.md`.
- [ ] **Deployed link**: https://shadowpundit.vercel.app/
- [ ] **Public repo link** → paste into `SUBMISSION.md`.
- [ ] Fill the **Reflection** section of `SUBMISSION.md` with your real notes.

## Delivery tips
- **Talk to the memory, not the UI.** Judges care about "it remembered X," not "here's a nice button."
- **Front-load the payoff.** If you only had 30 seconds, Section 3 is the one that wins — make sure it's crisp.
- **One take is fine.** Small stumbles read as authentic. Don't over-produce.
- **Keep the wallet address consistent on screen** — never switch accounts mid-video. Honesty is part of the score.
