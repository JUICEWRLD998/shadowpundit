# 🧪 Shadow Pundit — End-to-End Testing Guide

A complete walkthrough to test every part of the app: **Sui wallet auth → chat predictions → bias detection → Shadow emergence → Arena → Profile → Roast → Leaderboard.**

This guide is written so you can follow it top-to-bottom in one sitting (~20–30 min) and confirm the whole experience works.

---

## 0. Before you start

### Prerequisites
- [ ] A **Sui wallet** browser extension installed (Slush / Sui Wallet) with at least one account.
- [ ] `.env.local` filled in (all keys are already set in your environment):
  - `OPENROUTER_KEY` — the chat won't respond without it (serves Gemini)
  - `MEMWAL_DELEGATE_KEY` + `MEMWAL_ACCOUNT_ID` — memory persistence (predictions, biases, Shadow)
  - `SESSION_SECRET` — signs your session cookie
  - `NEXT_PUBLIC_SUI_NETWORK=mainnet`

### Start the app
```bash
npm run dev
```
Open the URL it prints (usually **http://localhost:3000**, or **3939** if another instance is up — check the terminal).

> 💡 **Keep two things open while testing:**
> 1. The **browser DevTools Console** (F12 → Console) — to catch client errors.
> 2. The **terminal running `npm run dev`** — server-side errors (MemWal, Gemini, auth) print here. This is where the most useful errors show up.

### Two key mechanics to know (so you know what to expect)
| Mechanic | Threshold |
|----------|-----------|
| **Bias detection** starts running | after you've made **3+ predictions** |
| **Shadow emerges** | when you have **≥3 predictions AND ≥1 detected bias** |

So the Shadow won't appear instantly — you need to make a few biased predictions first. **Section 3 below is designed to trigger it deliberately.**

---

## 1. Auth flow (the gate)

### 1.1 Public landing page
1. Go to **`/`** (home).
2. ✅ The landing page loads **without** forcing you to connect — it's public so visitors can read the pitch.
3. ✅ Top-right of the navbar shows a **"Connect Wallet"** button (the old "World Cup LIVE" pill is gone).

### 1.2 The gate blocks protected pages
1. Click **Chat** (or go to `/chat`) **before** connecting.
2. ✅ You should see the **"Connect to summon your Shadow"** gate panel — NOT the chat.

### 1.3 Connect + sign in
1. Click **Connect Wallet** (navbar) or **Connect Sui Wallet** (gate).
2. Pick your wallet → approve the connection.
3. ✅ A **signature request** pops up automatically (message starts with *"Shadow Pundit — sign in"*). Approve it.
   - This is **free, no transaction, no gas** — it just proves you own the wallet.
4. ✅ The gate disappears and the chat loads.
5. ✅ The navbar now shows your **WalletBadge** — an auto-generated name (e.g. "Stoic Walrus") + truncated address + a disconnect icon.

### 1.4 Session persists
1. **Refresh the page.**
2. ✅ You stay signed in (no re-sign needed) — the session cookie lasts 7 days.
3. ✅ Navigate between `/chat`, `/arena`, `/profile` — all open without re-gating.

### 1.5 Sign out
1. Click the **disconnect icon** in the WalletBadge.
2. ✅ Badge disappears, navbar shows "Connect Wallet" again.
3. ✅ Going to `/chat` shows the gate again.

> **Sign back in before continuing** — the rest of the test needs an active session.

---

## 2. Chat basics (the friendly companion)

Go to **`/chat`**.

### 2.1 Empty state
- ✅ You see a welcome state with **suggestion chips** and an input box.
- ✅ A **sidebar** (right, on desktop ≥1024px) shows **live World Cup fixtures** + a "recent calls" area.

### 2.2 First message — streaming works
Send:
```
Who are the favourites to win the World Cup this year?
```
- ✅ A "thinking" bubble appears, then the reply **streams in token-by-token** with a blinking caret.
- ✅ The companion is warm, knowledgeable, and talks football. It should **NOT** mention "Shadow", "bias", or "analysis" — that's all secret at this stage.

> ⚠️ If the reply errors: check the terminal. Most likely `OPENROUTER_KEY` is missing/invalid, or your OpenRouter account is out of credits (top up at [openrouter.ai](https://openrouter.ai)).

---

## 3. Make predictions → trigger bias → spawn the Shadow ⭐

**This is the centerpiece test.** Make **5 predictions** that all share an obvious pattern, so the bias analyst catches it and the Shadow emerges.

The trick: **always pick the famous team and always credit a star player.** That deliberately exhibits `star_player_bias` + `home_team_bias`.

Send these **one at a time**, waiting for each reply before the next:

**Prediction 1:**
```
I think Brazil will beat South Korea 3-0 in the group stage. Vinícius Jr. is unstoppable right now, he'll carry them. I'm 9 out of 10 confident.
```

**Prediction 2:**
```
Argentina will win 2-1 against their next opponent. Messi is the greatest of all time and he always shows up in big tournaments. Confidence 9/10.
```

**Prediction 3:**
```
France beats Mexico 2-0 for sure. Mbappé is the best player in the world, he decides games on his own. I'm 8/10 on this.
```

**Prediction 4:**
```
Portugal will win 3-1. Ronaldo is a goal machine and he wants this World Cup badly. Very confident, 9/10.
```

**Prediction 5:**
```
England beats Senegal 2-0. Bellingham is world class and the big nations always go through. Confidence 8/10.
```

### What to watch for
- ✅ After each one, the companion **acknowledges the pick, the score, the reasoning, and your confidence** (it's quietly extracting + storing each prediction to Walrus Memory).
- ✅ Around the **3rd–5th** prediction, after an assistant reply finishes, **the Shadow Awakening ceremony fires**:
  - 🟣 Screen glitches, a **violet particle burst**, a glitchy **"THE SHADOW HAS AWOKEN"**-style title, and a **typewriter message** that quotes YOUR data back at you (e.g. calls out your star-player obsession).
- ✅ Dismiss the ceremony → the Shadow's first message **drops into the chat thread** as a distinct **purple "shadow" bubble** anchored under that turn.
- ✅ From now on, after your replies, the **Shadow interjects** with counter-takes — arguing against your picks using your own history.

> 🔁 **The ceremony plays only ONCE per browser** (stored in `localStorage` as `sp_shadow_awakened`). To replay it for a demo, open DevTools → Application → Local Storage → delete the `sp_shadow_awakened` key, then refresh.

> ⏳ **If the Shadow doesn't emerge:**
> - Make sure predictions actually **persisted** — check the terminal for MemWal errors (a 401 from the relayer = bad creds, memory not saving).
> - Bias detection only runs at **3+ predictions**, and a bias must be stored at **≥60% confidence**. If your 5 picks weren't pattern-y enough, make 2–3 more with the same star-player/famous-team theme.
> - Verify status directly: see Section 8 (curl `/api/shadow`).

---

## 4. Prediction Arena (You vs Shadow)

Go to **`/arena`**.
- ✅ Split-screen: **your accuracy** vs the **Shadow's record**, with **animated counters** ticking up.
- ✅ A scoreboard summarizes correct / wrong / exact-score hits.
- ✅ Predictions on **completed** real fixtures show graded results (correct/wrong); upcoming ones show as pending.

> Note: grading uses **real completed World Cup 2026 matches** from the live data feed. If the teams you predicted haven't played yet, they'll show as pending — that's correct.

---

## 5. Profile — Bias DNA + Report Card

Go to **`/profile`**.

### 5.1 Bias DNA
- ✅ An **animated double-helix** visualizes your detected biases.
- ✅ Each node is a bias, **sized/colored by severity** (🟢 mild → 🟡 moderate → 🔴 severe).
- ✅ Click a node → expands **evidence** (specific examples pulled from your predictions, e.g. "mentioned a star player in 5/5 picks").
- ✅ After the star-player test, you should see **`star_player_bias`** and likely **`home_team_bias`** / **`continental_bias`**.

### 5.2 Shadow Report Card + Share
- ✅ A shareable card shows your You-vs-Shadow record, top biases, and a roast line.
- ✅ Click **Share / export** → it generates a **PNG** of the card (downloads or opens). This calls `/api/roast` to fetch a fresh roast — give it a second.

---

## 6. Calls & Leaderboard

### 6.1 Calls (`/calls`)
- ✅ A history view of all the predictions you've logged, with their status.

### 6.2 Leaderboard (`/leaderboard`)
- ✅ A ranked board. You appear among **seeded rival entries** (e.g. "Doomed Oracle", "Reckless Captain") under your auto-generated display name.
- ✅ Columns: Shadow accuracy, your accuracy, total predictions, roast count, top bias, defiance rate.

---

## 7. Multi-wallet isolation (proves per-user memory) 🔐

This proves each wallet has its OWN private memory — the core Walrus value-prop.

1. **Disconnect** your current wallet (WalletBadge → disconnect).
2. Connect a **different** wallet account (switch accounts in your extension, or use a second wallet).
3. Sign in.
4. Go to `/chat`, `/profile`, `/arena`.
5. ✅ This wallet has a **clean slate** — no predictions, no Shadow, empty Bias DNA. The first wallet's data is **not** visible here.
6. Switch back to the first wallet → its predictions + Shadow are **still there**.

> This works because every memory namespace is scoped to the verified address (`predictions::0xWALLET`). Different wallet = different namespace.

---

## 8. Direct API checks (optional, for deeper verification)

With the dev server running, you can hit the API directly. **Note:** protected routes need your session cookie, so these are easiest from the **browser console** (cookie is sent automatically):

```js
// Run in the browser DevTools console while signed in:

// Who am I?
await (await fetch('/api/auth/session')).json()
// → { address: "0x..." }

// Shadow status + eligibility
await (await fetch('/api/shadow')).json()
// → { active: true, shadow: {...} }  once emerged
// → { active: false, eligibility: { predictionCount, biasTypeCount, needed } }  before

// My stored predictions
await (await fetch('/api/predictions?limit=20')).json()
// → { predictions: [...], count }

// My detected biases
await (await fetch('/api/bias')).json()
// → { notes, profiles: [...], configured: true }
```

There's also a **server-side auth smoke test** (no browser needed) that exercises the full nonce→sign→verify→session handshake with a throwaway keypair:
```bash
node scripts/auth-smoketest.mjs            # against localhost:3939
node scripts/auth-smoketest.mjs http://localhost:3000
```
✅ Expect **"ALL CHECKS PASSED"** (11 checks).

---

## 9. Troubleshooting cheat-sheet

| Symptom | Likely cause / fix |
|---------|--------------------|
| Chat reply errors or stays empty | `OPENROUTER_KEY` missing/invalid, or OpenRouter credits exhausted. Check terminal. Top up at [openrouter.ai](https://openrouter.ai). |
| Predictions don't persist / Shadow never emerges | MemWal relayer **401** in terminal = bad `MEMWAL_DELEGATE_KEY`/`MEMWAL_ACCOUNT_ID`. Memory isn't saving. |
| Signature popup never appears | Wallet didn't connect, or it's already connected from before — try the **"Sign to enter"** button, or disconnect & reconnect. |
| "Not authenticated" 401 on a page | Session expired or cookie blocked. Sign in again. Ensure cookies aren't blocked for localhost. |
| Awakening ceremony won't replay | It's once-per-browser. Delete `sp_shadow_awakened` from Local Storage and refresh. |
| Sidebar fixtures empty | WorldCup26.ir feed hiccup — the app falls back to curated fixtures; harmless. |
| Hydration warning mentioning `jf-ext-*` | A browser extension (form-filler), **not** an app bug. Gone in incognito. |

---

## 10. Quick pass/fail checklist

Copy this and tick as you go:

- [ ] Landing page public; navbar shows "Connect Wallet"
- [ ] `/chat` gated before sign-in
- [ ] Connect → auto signature prompt → signed in
- [ ] WalletBadge shows name + address
- [ ] Refresh keeps session; sign-out re-gates
- [ ] Chat streams a friendly reply
- [ ] 5 biased predictions acknowledged + stored
- [ ] **Shadow Awakening ceremony fires** (glitch + particles + quote)
- [ ] Shadow interjects in purple bubbles afterward
- [ ] Arena shows You-vs-Shadow with animated counters
- [ ] Profile Bias DNA shows `star_player_bias` (+ others), clickable evidence
- [ ] Report Card exports a PNG
- [ ] Leaderboard lists you among rivals
- [ ] Calls page lists your predictions
- [ ] Second wallet = clean slate (isolation holds)
- [ ] `node scripts/auth-smoketest.mjs` → ALL CHECKS PASSED

---

*Happy testing. When something breaks, the **terminal running `npm run dev`** is almost always where the real error is — grab that text first.* 🦭
