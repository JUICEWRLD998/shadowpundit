# 🎭 Shadow Pundit

> The AI World Cup companion that spawns your evil twin.

Shadow Pundit is an AI football-prediction companion for the **FIFA World Cup 2026**. It feels like a friendly pundit at first — but quietly it learns your cognitive biases, and once it knows you well enough, it **spawns an adversarial "Shadow" twin** that argues against your every pick using your own history as ammunition.

Built for the **Walrus Memory World Cup** hackathon. Every prediction, bias, and Shadow thought is stored as persistent semantic memory on **Walrus** — so your Shadow remembers you across sessions and devices.

---

## ✨ What it does

- **🗣️ Talks football** — a streaming AI chat that discusses tactics, form, and helps you make predictions.
- **🧠 Learns your biases** — silently analyses your reasoning and detects patterns (star-player bias, recency bias, always backing the favourites, and more).
- **🎭 Spawns your Shadow** — once you've made enough predictions and a bias is detected, an adversarial twin *emerges* in a dramatic awakening, then argues against your picks with receipts from your own history.
- **⚔️ Prediction Arena** — tracks You vs. Shadow accuracy on real, completed World Cup matches.
- **🧬 Bias DNA** — an interactive double-helix visualising your prediction psychology.
- **🔥 Roast engine + shareable report card** — when the Shadow calls it right, it roasts you; export the card as an image.
- **🏅 Leaderboard** — ranks connected users against each other (memory at scale).

---

## 🏗️ How it works

```
┌──────────────────────────────────────────────────────────┐
│                  Next.js app (Vercel)                      │
│                                                            │
│   Browser ──► Sui Wallet sign-in ──► verified session      │
│      │                                                     │
│      ▼                                                     │
│   Pages: Chat · Arena · Profile · Calls · Leaderboard      │
│      │                                                     │
│      ▼                                                     │
│   API routes (serverless)                                  │
│   /api/chat · /api/predictions · /api/bias · /api/shadow   │
│   /api/roast · /api/arena · /api/leaderboard · /api/auth/* │
└───────┬───────────────┬───────────────────┬───────────────┘
        │               │                   │
        ▼               ▼                   ▼
   Walrus Memory     Google Gemini      WorldCup26.ir
   (via MemWal)      (chat + analysis)  (live fixtures)
```

**The core loop:** you chat → a prediction is extracted and stored on Walrus → after 3+ predictions a bias analysis runs → once a bias is found, the Shadow emerges → from then on it interjects with counter-takes grounded in everything it remembers about you.

**Per-user privacy:** your identity is your **Sui wallet address**, proven by signing a message (no transaction, no gas). Every memory namespace is scoped to that address, so one wallet's data never bleeds into another's.

---

## 🧰 Tech stack

| Layer | Choice |
|-------|--------|
| Framework | **Next.js** (App Router) + TypeScript |
| AI | **Google Gemini** via the Vercel AI SDK (`@ai-sdk/google`) |
| Memory | **Walrus** via **MemWal** (`@mysten-incubation/memwal`) |
| Auth / identity | **Sui wallet** sign-in (`@mysten/dapp-kit` + signed-nonce session) |
| Football data | **WorldCup26.ir** (free live fixtures & results) |
| Styling | Vanilla **CSS Modules** + CSS variables |
| Animation | **Framer Motion**, **GSAP**, **React Three Fiber** (3D awakening) |
| Charts / export | Recharts, html-to-image |

---

## 🚀 Getting started

### 1. Install
```bash
npm install
```

### 2. Configure environment
Copy the template and fill in your keys:
```bash
cp .env.example .env.local
```

| Variable | Required | What it's for |
|----------|:---:|---------------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ | Gemini API key ([AI Studio](https://aistudio.google.com)) |
| `MEMWAL_DELEGATE_KEY` | ✅ | Walrus Memory delegate key |
| `MEMWAL_ACCOUNT_ID` | ✅ | Walrus Memory account ID |
| `SESSION_SECRET` | ✅ (prod) | Signs session cookies — any long random string |
| `NEXT_PUBLIC_SUI_NETWORK` | – | `mainnet` (default) or `testnet` |
| `GEMINI_MODEL` | – | Override the model (default `gemini-2.5-flash`) |

> Generate a session secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3. Run
```bash
npm run dev
```
Open the URL it prints (usually **http://localhost:3000**). You'll need a **Sui wallet** extension to sign in.

---

## 📁 Project structure

```
src/
├── app/
│   ├── page.tsx              Landing page (public)
│   ├── chat/                 Main chat + Shadow experience
│   ├── arena/                You vs Shadow accuracy
│   ├── profile/              Bias DNA + report card
│   ├── calls/                Prediction history
│   ├── leaderboard/          Cross-user rankings
│   └── api/                  Serverless routes (chat, shadow, auth, …)
├── components/               UI by feature (chat, arena, profile, auth, …)
├── context/                  AuthContext (wallet → session)
├── hooks/                    useShadowState, usePredictions, …
├── lib/                      Engines: shadowEngine, biasDetector, memwal, auth, scoring, worldcup
├── prompts/                  AI system prompts
└── types/                    Shared TypeScript types
```

---

## 🔐 Authentication

Sign-in is a passwordless wallet handshake:

```
connect wallet → GET /api/auth/nonce → wallet signs the nonce
   → POST /api/auth/verify (server checks the signature)
   → HMAC-signed httpOnly session cookie → you're in
```

The verified wallet address *is* your account. Protected API routes are guarded server-side, and signing a message is free (it never submits a transaction).

---

## 🧪 Testing

A full step-by-step walkthrough — including the exact chat messages that trigger the Shadow to emerge — lives in **[`TESTING_GUIDE.md`](./TESTING_GUIDE.md)**.

Quick auth check (no browser needed):
```bash
node scripts/auth-smoketest.mjs
```

---

## ☁️ Deployment

Deploys to **Vercel** with zero config:

1. Push to GitHub and import the repo into Vercel.
2. Add the environment variables above (don't forget `SESSION_SECRET`).
3. Deploy.

---

## 📄 Build plan

The full product spec and phased build schedule are documented in **[`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md)**.

---

*Powered by Walrus Memory 🦭*
