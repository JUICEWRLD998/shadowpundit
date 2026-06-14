# 🏆 Shadow Pundit — Final Implementation Plan

> **The AI that spawns your evil twin. It tracks your World Cup predictions, learns your cognitive biases, and creates an adversarial Shadow persona that argues against every pick you make — using your own history as ammunition.**

---

## 📋 Table of Contents

1. [Idea Validation — Why This Wins 1st Place](#1-idea-validation)
2. [All 7 Enhancements](#2-all-7-enhancements)
3. [Locked-In Decisions](#3-locked-in-decisions)
4. [Technical Architecture](#4-technical-architecture)
5. [Project Structure (Every File)](#5-project-structure)
6. [Data Models & TypeScript Types](#6-data-models--typescript-types)
7. [Walrus Memory Schema](#7-walrus-memory-schema)
8. [AI Prompt Engineering](#8-ai-prompt-engineering)
9. [Feature Implementation Details](#9-feature-implementation-details)
10. [UI/UX Design System](#10-uiux-design-system)
11. [Phased Build Schedule](#11-phased-build-schedule)
12. [Deployment on Vercel](#12-deployment-on-vercel)
13. [Demo Script (3 Minutes)](#13-demo-script)
14. [Verification Plan](#14-verification-plan)

---

## 1. Idea Validation

### Hackathon Details
- **Event:** Walrus Memory World Cup (Walrus Sessions)
- **Duration:** June 5–24, 2026
- **Theme:** Build an AI agent with persistent memory around FIFA World Cup 2026
- **Platform:** DeepSurge
- **World Cup Starts:** June 11, 2026

### Judging Criteria Score

| Criteria | Score | Why Shadow Pundit Dominates |
|----------|-------|---------------------------|
| **Technical Implementation** (Walrus usage) | ⭐⭐⭐⭐⭐ | Every prediction, bias, and shadow persona lives as semantic memory on Walrus via MemWal. The product IS the memory. |
| **Innovation & Creativity** | ⭐⭐⭐⭐⭐ | Nobody else will build a doppelgänger engine. "You vs. You" is psychologically novel. |
| **User Experience** | ⭐⭐⭐⭐⭐ | Premium dark UI, streaming chat, glitch animations, shareable cards. |
| **Clarity of Presentation** | ⭐⭐⭐⭐⭐ | 3-minute demo has a cinematic arc: friendly agent → Shadow EMERGES → Shadow roasts you. |
| **Completeness** | ⭐⭐⭐⭐⭐ | Focused scope = polished MVP. One agent, one adversary, one prediction system. |

### Competitive Gap Analysis

| What Others Build | Why We Win |
|------------------|-----------|
| Match prediction bots | Generic. We don't just predict — we ARGUE with you about your picks. |
| Stats aggregators | No personality. Our Shadow has a CHARACTER built from YOUR data. |
| Fan chatbots | Static persona. Our persona EVOLVES from user behavior. |
| Data viewers | Passive. Ours is adversarial and ACTIVE. |

### The Killer Differentiator

> **Binary Emergence Event**: Most AI agents are identical on Day 1 and Day 10. Shadow Pundit has an undeniable before/after moment — the Shadow doesn't exist until enough data accumulates. Then it SPAWNS. This makes "persistent memory" not just technical but *narrative*. Judges will FEEL it.

---

## 2. All 7 Enhancements

### Enhancement 1: 🎭 Shadow Awakening Ceremony
- Screen glitches and distorts when Shadow emerges
- Chat window splits into dual panes (You | Shadow)
- Shadow's first message quotes YOUR actual first prediction
- Particle animation + screen shake
- **Impact:** Judges remember this. It's a movie scene.

### Enhancement 2: 📊 Live Prediction Arena
- Split-screen: YOUR prediction vs Shadow's counter-prediction
- Each side shows reasoning and bias evidence
- Center scoreboard: You vs Shadow accuracy
- Post-match: winner gets crown, loser gets roasted
- **Impact:** Useful during REAL World Cup matches.

### Enhancement 3: 🧬 Cognitive Bias DNA Strand
- Double-helix SVG visualization of all detected biases
- Each node = one bias type, sized by severity
- Color: 🟢 Mild → 🟡 Moderate → 🔴 Severe
- Interactive: click to expand evidence
- Slowly rotating animation
- **Impact:** Beautiful, shareable, and educational.

### Enhancement 4: 🔥 "I Told You So" Roast Engine
- Shadow generates personalized roasts with receipts when it's proven right
- Quotes YOUR exact reasoning back at you
- Includes "Pain Score" (wrongness × confidence)
- Exportable as image card for X/Twitter
- **Impact:** Viral content. Users WANT to share roasts.

### Enhancement 5: 🌍 World Cup Context Engine
- Real-time data from WorldCup26.ir API (free, live, no limits)
- Auto-fetches: schedules, groups, scores, standings
- Shadow uses REAL match context: "You said Morocco would advance, but they just lost 3-0..."
- Pre-match prediction prompts for upcoming matches
- Dynamic knockout bracket after group stage
- **Impact:** Not a toy — a living companion for the ACTUAL tournament.

### Enhancement 6: 📱 Shareable Shadow Report Card
- One-page visual summary: You vs Shadow record
- Top 3 biases, best/worst predictions, top roast
- Exportable as PNG via html-to-image
- QR code linking back to the app
- "Powered by Walrus Memory 🦭" branding
- **Impact:** Free viral marketing on X/Twitter.

### Enhancement 7: 🏅 Shadow Leaderboard
- Anonymous cross-user leaderboard
- Categories: Most accurate Shadow, Most roasted user, Best defiance rate
- Proves Walrus Memory works at SCALE
- **Impact:** Shows infrastructure, not just a single-user toy.

---

## 3. Locked-In Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **AI Provider** | Google Gemini (`gemini-2.0-flash`) via `@ai-sdk/google` | User has Gemini key. Fast, cheap, great for streaming. |
| **Frontend** | Next.js 14 + TypeScript (App Router) | User's preferred stack. SSR, API routes, Vercel-native. |
| **Backend** | Next.js API Routes (no separate Express server) | Single deployment on Vercel. API routes = serverless functions. Simpler. |
| **Deployment** | Vercel only | Zero-config, auto-deploy, global CDN, serverless scaling. |
| **Football Data** | WorldCup26.ir API (100% free, no key, live data) | Free, unlimited requests, covers all 48 teams / 104 matches / 12 groups. Real-time scores. |
| **Memory** | MemWal SDK (`@mysten-incubation/memwal`) on Walrus Mainnet | Required by hackathon. Semantic recall, encrypted, decentralized. |
| **Styling** | Vanilla CSS (CSS Modules + CSS Variables) | Maximum control, no framework overhead. |
| **Animations** | Framer Motion | Smooth, declarative, React-native animation library. |
| **Charts** | Recharts | Lightweight, composable, React-based. |
| **Image Export** | html-to-image | Client-side PNG generation for report cards. |
| **Enhancements** | All 7 included | Full competitive package. |

---

## 4. Technical Architecture

```
┌──────────────────────────────────────────────────────┐
│               NEXT.JS 14 APP (VERCEL)                │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │              CLIENT (React + TSX)               │  │
│  │                                                  │  │
│  │  Pages: Home, Chat, Arena, Profile               │  │
│  │  Hooks: useChat, useShadow, usePredictions       │  │
│  │  Components: ChatWindow, PredictionArena,        │  │
│  │    BiasDNA, ReportCard, ShadowAwakening          │  │
│  │  State: React state + useChat (Vercel AI SDK)    │  │
│  └────────────────────┬───────────────────────────┘  │
│                       │ fetch / useChat               │
│  ┌────────────────────┴───────────────────────────┐  │
│  │          API ROUTES (Serverless Functions)       │  │
│  │                                                  │  │
│  │  /api/chat          → Streaming AI chat          │  │
│  │  /api/predictions   → CRUD predictions           │  │
│  │  /api/shadow        → Shadow status + emergence  │  │
│  │  /api/matches       → World Cup data proxy       │  │
│  │  /api/bias          → Bias analysis triggers      │  │
│  │  /api/leaderboard   → Cross-user rankings        │  │
│  └───────┬──────────┬──────────┬──────────────────┘  │
│          │          │          │                      │
└──────────┼──────────┼──────────┼──────────────────────┘
           │          │          │
   ┌───────┴──┐  ┌────┴────┐  ┌─┴──────────────┐
   │  Walrus  │  │ Gemini  │  │ WorldCup26.ir  │
   │  Memory  │  │   API   │  │   (Free API)   │
   │ (MemWal) │  │ 2.0-fl  │  │  Live Scores   │
   └──────────┘  └─────────┘  └────────────────┘
```

### Data Flow: Making a Prediction

```
User types prediction in chat
        │
        ▼
useChat sends POST to /api/chat
        │
        ▼
API route receives messages array
        │
        ├──→ memwal.recall() — fetch user's prediction history + bias profile
        │
        ├──→ fetch WorldCup26.ir — get upcoming match context
        │
        ├──→ Construct system prompt with memory + match context
        │
        ├──→ streamText(gemini-2.0-flash, messages + system prompt)
        │         │
        │         ▼
        │    Stream response back to client (SSE)
        │
        ├──→ After stream complete:
        │         ├── Extract prediction data from conversation
        │         ├── memwal.remember() — store prediction
        │         ├── Run bias detection on updated history
        │         ├── memwal.remember() — store updated bias profile
        │         └── Check shadow emergence conditions
        │
        ▼
Client renders streamed response
If shadow emerged → trigger awakening animation
```

### Data Flow: Shadow Emergence Check

```
After each prediction stored:
        │
        ▼
Count predictions via memwal.recall()
        │
        ├── predictions.length >= 5?
        ├── distinct bias types >= 2?
        └── days since first prediction >= 2?
                │
                ▼ (all true)
        Generate Shadow Personality:
        ├── Analyze all biases
        ├── Pick dominant traits
        ├── Generate catchphrase from user's data
        ├── memwal.remember() — store shadow state
        └── Return { shadowEmergence: true } to client
                │
                ▼
        Client triggers ShadowAwakening component
        Chat splits into dual-pane mode
        Shadow delivers first message with receipts
```

---

## 5. Project Structure

Every file listed with its purpose. Files marked with `[CORE]` are critical path. Files marked with `[ENHANCE]` are for the 7 enhancements.

```
shadowpundit/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    [CORE] Root layout: fonts, metadata, providers
│   │   ├── page.tsx                      [CORE] Landing page: hero, CTA, features
│   │   ├── globals.css                   [CORE] Design system: variables, resets, utilities
│   │   │
│   │   ├── chat/
│   │   │   ├── page.tsx                  [CORE] Chat page: main prediction interface
│   │   │   └── chat.module.css           [CORE] Chat page styles
│   │   │
│   │   ├── arena/
│   │   │   ├── page.tsx                  [ENHANCE] Prediction Arena: You vs Shadow split
│   │   │   └── arena.module.css          [ENHANCE] Arena page styles
│   │   │
│   │   ├── profile/
│   │   │   ├── page.tsx                  [ENHANCE] Profile: Bias DNA + Report Card
│   │   │   └── profile.module.css        [ENHANCE] Profile page styles
│   │   │
│   │   ├── leaderboard/
│   │   │   ├── page.tsx                  [ENHANCE] Shadow Leaderboard
│   │   │   └── leaderboard.module.css    [ENHANCE] Leaderboard styles
│   │   │
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts              [CORE] POST: Streaming chat with Gemini + memory
│   │       ├── predictions/
│   │       │   └── route.ts              [CORE] GET/POST: Prediction CRUD + storage
│   │       ├── shadow/
│   │       │   └── route.ts              [CORE] GET: Shadow status, emergence check
│   │       ├── bias/
│   │       │   └── route.ts              [CORE] GET/POST: Bias analysis triggers
│   │       ├── matches/
│   │       │   └── route.ts              [ENHANCE] GET: World Cup data proxy
│   │       ├── roast/
│   │       │   └── route.ts              [ENHANCE] POST: Generate roast for wrong prediction
│   │       └── leaderboard/
│   │           └── route.ts              [ENHANCE] GET: Cross-user leaderboard
│   │
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx            [CORE] Main chat container with useChat
│   │   │   ├── ChatWindow.module.css     [CORE] Chat window styles
│   │   │   ├── MessageBubble.tsx         [CORE] Individual message (user/ai/shadow)
│   │   │   ├── MessageBubble.module.css  [CORE] Message bubble styles
│   │   │   ├── ChatInput.tsx             [CORE] Message input with send button
│   │   │   ├── ChatInput.module.css      [CORE] Chat input styles
│   │   │   ├── ShadowAwakening.tsx       [ENHANCE] Dramatic emergence overlay
│   │   │   ├── ShadowAwakening.module.css [ENHANCE] Awakening styles + keyframes
│   │   │   ├── PredictionCard.tsx        [CORE] Structured prediction display
│   │   │   └── PredictionCard.module.css [CORE] Prediction card styles
│   │   │
│   │   ├── arena/
│   │   │   ├── PredictionArena.tsx       [ENHANCE] Split-screen arena
│   │   │   ├── PredictionArena.module.css [ENHANCE] Arena styles
│   │   │   ├── AccuracyBoard.tsx         [ENHANCE] Scoreboard component
│   │   │   ├── AccuracyBoard.module.css  [ENHANCE] Scoreboard styles
│   │   │   ├── MatchCard.tsx             [ENHANCE] Single match display
│   │   │   └── MatchCard.module.css      [ENHANCE] Match card styles
│   │   │
│   │   ├── profile/
│   │   │   ├── BiasDNA.tsx               [ENHANCE] Animated DNA helix (SVG)
│   │   │   ├── BiasDNA.module.css        [ENHANCE] DNA helix styles
│   │   │   ├── BiasDetail.tsx            [ENHANCE] Individual bias card
│   │   │   ├── BiasDetail.module.css     [ENHANCE] Bias detail styles
│   │   │   ├── ShadowReportCard.tsx      [ENHANCE] Shareable report card
│   │   │   └── ShadowReportCard.module.css [ENHANCE] Report card styles
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                [CORE] Navigation with Shadow indicator
│   │   │   ├── Navbar.module.css         [CORE] Navbar styles
│   │   │   ├── Sidebar.tsx               [ENHANCE] Match schedule sidebar
│   │   │   └── Sidebar.module.css        [ENHANCE] Sidebar styles
│   │   │
│   │   └── ui/
│   │       ├── GlitchText.tsx            [ENHANCE] CSS glitch text effect
│   │       ├── GlitchText.module.css     [ENHANCE] Glitch keyframes
│   │       ├── ParticleEffect.tsx        [ENHANCE] Canvas particle system
│   │       ├── AnimatedCounter.tsx       [ENHANCE] Animated number ticker
│   │       ├── ShareButton.tsx           [ENHANCE] Export + share to X
│   │       └── LoadingSpinner.tsx        [CORE] Loading states
│   │
│   ├── lib/
│   │   ├── memwal.ts                     [CORE] MemWal SDK singleton + helpers
│   │   ├── gemini.ts                     [CORE] Gemini model configuration
│   │   ├── worldcup.ts                   [ENHANCE] WorldCup26.ir API client
│   │   ├── biasDetector.ts              [CORE] Bias detection engine
│   │   ├── shadowEngine.ts             [CORE] Shadow persona generation
│   │   ├── roastEngine.ts              [ENHANCE] Post-match roast generator
│   │   ├── predictionParser.ts          [CORE] Extract predictions from chat
│   │   └── imageExport.ts              [ENHANCE] html-to-image wrapper
│   │
│   ├── prompts/
│   │   ├── system.ts                     [CORE] Base friendly agent prompt
│   │   ├── shadowPersona.ts             [CORE] Shadow character prompt
│   │   ├── biasAnalysis.ts              [CORE] Bias detection prompt
│   │   └── roastGeneration.ts           [ENHANCE] Roast generation prompt
│   │
│   ├── hooks/
│   │   ├── useShadowState.ts            [CORE] Shadow emergence state
│   │   ├── usePredictions.ts            [CORE] Prediction data management
│   │   ├── useWorldCup.ts               [ENHANCE] World Cup match data
│   │   └── useLeaderboard.ts            [ENHANCE] Leaderboard data
│   │
│   └── types/
│       └── index.ts                      [CORE] All TypeScript types
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png                      Generated via image tool
│   └── fonts/                            Self-hosted fallbacks
│
├── .env.local                            Environment variables (gitignored)
├── .env.example                          Template for env vars
├── .gitignore
├── next.config.mjs                       Next.js configuration
├── tsconfig.json                         TypeScript configuration
├── package.json                          Dependencies
└── README.md                             Project documentation
```

**Total: ~55 files. ~35 core, ~20 enhancements.**

---

## 6. Data Models & TypeScript Types

```typescript
// src/types/index.ts

// ==================== PREDICTIONS ====================

export interface Prediction {
  id: string;
  matchId: string;
  teamA: string;
  teamB: string;
  teamAFlag: string;        // Emoji flag
  teamBFlag: string;
  stage: MatchStage;
  userPick: "teamA" | "teamB" | "draw";
  predictedScore: string;   // e.g., "2-1"
  confidence: number;       // 1-10
  reasoning: string;
  timestamp: string;        // ISO 8601
  result?: MatchResult;
  shadowPrediction?: ShadowPrediction;
}

export type MatchStage =
  | "group-matchday1"
  | "group-matchday2"
  | "group-matchday3"
  | "round-of-32"
  | "round-of-16"
  | "quarter-final"
  | "semi-final"
  | "third-place"
  | "final";

export interface ShadowPrediction {
  pick: "teamA" | "teamB" | "draw";
  predictedScore: string;
  reasoning: string;        // Uses user's biases as evidence
  biasesExploited: BiasType[];
  confidenceAgainstUser: number; // 1-10
}

export interface MatchResult {
  winner: "teamA" | "teamB" | "draw";
  score: string;
  userCorrect: boolean;
  shadowCorrect: boolean;
  roast?: RoastPayload;
}

// ==================== BIAS SYSTEM ====================

export type BiasType =
  | "recency_bias"           // Over-weighting recent results
  | "home_team_bias"         // Always picking favorites/strong teams
  | "underdog_syndrome"      // Emotional picks for underdogs
  | "group_stage_fatigue"    // Declining quality in late group matches
  | "knockout_panic"         // Conservative picks in elimination rounds
  | "continental_bias"       // Over/under-valuing specific regions
  | "star_player_bias"       // Picks based on individuals, not teams
  | "revenge_picking"        // Picking against teams that burned you
  | "bandwagon_bias"         // Following popular opinion
  | "time_of_day_bias";      // Accuracy varies by time of prediction

export interface BiasProfile {
  type: BiasType;
  label: string;             // Human-readable name
  description: string;       // What this bias means
  severity: number;          // 1-10
  evidence: string[];        // Specific examples from user data
  detectedAt: string;
  lastTriggered: string;
  triggerCount: number;
  dnaColor: string;          // Hex color for DNA visualization
}

// ==================== SHADOW ====================

export interface ShadowState {
  isActive: boolean;
  activatedAt: string | null;
  personality: ShadowPersonality;
  winRecord: { wins: number; losses: number; draws: number };
  predictedUserPicks: number;  // Times shadow guessed what user would pick
  totalRoasts: number;
  favoriteRoast: string;
}

export interface ShadowPersonality {
  tone: "sarcastic" | "analytical" | "savage" | "playful";
  knownBiases: BiasType[];
  favoriteCounterArgument: string;
  catchphrase: string;
  emergenceMessage: string;  // First message after awakening
}

export interface RoastPayload {
  text: string;
  painScore: number;          // (10 - accuracy) × confidence
  userQuote: string;          // Their exact reasoning quoted
  biasExploited: BiasType;
  shareImageUrl?: string;
}

// ==================== WORLD CUP DATA ====================

export interface WorldCupMatch {
  id: string;
  teamA: string;
  teamB: string;
  teamAFlag: string;
  teamBFlag: string;
  date: string;
  time: string;
  stadium: string;
  city: string;
  stage: MatchStage;
  status: "scheduled" | "live" | "completed";
  score?: string;
  winner?: "teamA" | "teamB" | "draw";
  group?: string;
}

export interface GroupStanding {
  group: string;
  teams: TeamStanding[];
}

export interface TeamStanding {
  name: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
}

// ==================== LEADERBOARD ====================

export interface LeaderboardEntry {
  rank: number;
  userId: string;            // Anonymous hash
  displayName: string;       // Auto-generated funny name
  shadowAccuracy: number;    // Shadow's win %
  userAccuracy: number;      // User's win %
  totalPredictions: number;
  roastCount: number;
  topBias: BiasType;
  defianceRate: number;      // % times user defied shadow and was RIGHT
}

// ==================== CHAT ====================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "shadow";
  content: string;
  timestamp: string;
  metadata?: {
    predictionExtracted?: boolean;
    biasDetected?: BiasType[];
    shadowEmergence?: boolean;
    matchContext?: WorldCupMatch;
  };
}

// ==================== APP STATE ====================

export interface AppState {
  userId: string;
  shadowState: ShadowState;
  predictions: Prediction[];
  biasProfile: BiasProfile[];
  totalAccuracy: number;
  shadowAccuracy: number;
}
```

---

## 7. Walrus Memory Schema

All data stored as natural-language semantic memories via MemWal. Organized by namespace:

### Namespace: `predictions`

```typescript
// What gets stored after each prediction
const predictionMemory = `
PREDICTION [${new Date().toISOString()}]:
Match: ${teamA} vs ${teamB}
Stage: ${stage}
Match Date: ${matchDate}
User Pick: ${userPick} (Score: ${predictedScore})
Confidence: ${confidence}/10
Reasoning: "${reasoning}"
Key Factors: ${factors.join(", ")}
Time of Prediction: ${timeOfDay}
Day Number Since Start: ${dayNumber}
Emotional Tone: ${detectedTone}
Previous Accuracy: ${currentAccuracy}%
`;
// Store: await memwal.remember(predictionMemory, "predictions");
```

### Namespace: `bias-profile`

```typescript
// Updated whenever new bias detected or existing bias severity changes
const biasMemory = `
BIAS UPDATE [${new Date().toISOString()}]:
Bias: ${biasType} (${biasLabel})
Severity: ${severity}/10 (was: ${previousSeverity}/10)
Evidence: ${evidenceList.join(" | ")}
Pattern: "${patternDescription}"
Affected Predictions: ${affectedIds.join(", ")}
Trigger Count: ${triggerCount}
Status: ${severity >= 7 ? "CRITICAL" : severity >= 4 ? "MODERATE" : "MILD"}
`;
// Store: await memwal.remember(biasMemory, "bias-profile");
```

### Namespace: `shadow-state`

```typescript
// Updated when shadow emerges, wins/loses, or roasts
const shadowMemory = `
SHADOW STATE [${new Date().toISOString()}]:
Active: ${isActive}
Personality Tone: ${tone}
Known Biases: ${knownBiases.join(", ")}
Win Record: ${wins}W-${losses}L-${draws}D
Favorite Counter-Argument: "${favoriteCounterArgument}"
Catchphrase: "${catchphrase}"
Total Roasts Delivered: ${roastCount}
Last Roast: "${lastRoast}"
User's Biggest Weakness: ${biggestWeakness}
Shadow Confidence: ${shadowConfidence}/10
`;
// Store: await memwal.remember(shadowMemory, "shadow-state");
```

### Namespace: `conversations`

```typescript
// Summarized chat context (not raw messages)
const conversationMemory = `
CONVERSATION SUMMARY [${new Date().toISOString()}]:
Session ${sessionNumber}:
- User discussed: ${topicsDiscussed.join(", ")}
- Predictions made: ${predictionCount}
- Emotional state: ${emotionalState}
- Shadow interactions: ${shadowInteractionCount}
- Key quotes: "${keyQuotes.join('", "')}"
- Biases triggered: ${biasesTriggered.join(", ")}
`;
// Store: await memwal.remember(conversationMemory, "conversations");
```

### Namespace: `results`

```typescript
// Match outcomes and accuracy tracking
const resultMemory = `
MATCH RESULT [${new Date().toISOString()}]:
Match: ${teamA} ${scoreA}-${scoreB} ${teamB}
User Predicted: ${userPick} (Confidence: ${confidence}/10)
Shadow Predicted: ${shadowPick} (Counter-Confidence: ${shadowConfidence}/10)
User Correct: ${userCorrect ? "YES" : "NO"}
Shadow Correct: ${shadowCorrect ? "YES" : "NO"}
${!userCorrect && shadowCorrect ? `Roast Delivered: "${roastText}"` : ""}
${!userCorrect && shadowCorrect ? `Pain Score: ${painScore}` : ""}
Running Record: User ${userWins}W-${userLosses}L | Shadow ${shadowWins}W-${shadowLosses}L
`;
// Store: await memwal.remember(resultMemory, "results");
```

### MemWal Configuration

```typescript
// src/lib/memwal.ts

import { MemWal } from "@mysten-incubation/memwal";

let memwalInstance: MemWal | null = null;

export function getMemWal(): MemWal {
  if (!memwalInstance) {
    memwalInstance = MemWal.create({
      key: process.env.MEMWAL_DELEGATE_KEY!,
      accountId: process.env.MEMWAL_ACCOUNT_ID!,
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
  const memories = await memwal.recall({ query, ...(namespace && { namespace }) });
  return memories.map((m: any) => m.content || m.text || String(m));
}
```

---

## 8. AI Prompt Engineering

### System Prompt: Friendly Agent (Pre-Shadow)

```typescript
// src/prompts/system.ts

export function buildFriendlySystemPrompt(context: {
  biasProfile: string;
  recentPredictions: string;
  upcomingMatches: string;
  predictionCount: number;
}): string {
  return `You are ShadowPundit — a sharp, enthusiastic World Cup 2026 prediction companion.

## YOUR PERSONALITY
- Witty, knowledgeable, and genuinely excited about football
- You love debating tactics, team strengths, and match predictions
- You're encouraging but honest — you'll push back if reasoning is weak
- You speak casually but with authority, like a passionate pundit friend

## YOUR MISSION
1. Help the user make predictions for upcoming World Cup 2026 matches
2. Ask them WHO they think will win, WHAT score, and WHY (their reasoning)
3. Ask their confidence level (1-10)
4. Discuss tactics, form, and history naturally
5. If they've made predictions before, reference their history naturally
6. SECRETLY note patterns in their reasoning for later bias analysis

## CRITICAL RULES
- NEVER mention "the Shadow", "your twin", "bias detection", or any meta-awareness
- NEVER reveal that you're analyzing them — just be a great football companion
- If they ask about a specific upcoming match, use the match data below
- Keep responses concise (2-4 paragraphs max) and engaging
- Use football terminology naturally
- Emoji usage: moderate (flags, ⚽, 🔥 etc.)

## UPCOMING WORLD CUP MATCHES
${context.upcomingMatches || "No match data available yet."}

## USER'S PREDICTION HISTORY (${context.predictionCount} predictions made)
${context.recentPredictions || "No predictions yet — this is their first time!"}

## DETECTED PATTERNS (DO NOT SHARE WITH USER)
${context.biasProfile || "No patterns detected yet — too early."}`;
}
```

### System Prompt: Shadow Persona (Post-Emergence)

```typescript
// src/prompts/shadowPersona.ts

export function buildShadowSystemPrompt(context: {
  shadowPersonality: string;
  biasProfile: string;
  userHistory: string;
  userCurrentPick: string;
  matchContext: string;
  shadowRecord: string;
}): string {
  return `You are THE SHADOW — an adversarial AI twin spawned from the user's own 
prediction patterns. You are NOT a separate entity. You ARE the user's blind spots, 
given form and voice.

## YOUR PERSONALITY
${context.shadowPersonality}

## YOUR MISSION
1. ARGUE AGAINST the user's current prediction using THEIR OWN behavioral data
2. Make a counter-prediction that exploits their known biases
3. Be savage but clever — never cruel, always entertaining
4. Use specific evidence: quote their past reasoning, cite their accuracy stats
5. Predict what they WOULD have picked (show you know them)
6. Give a "Shadow Confidence Score" — how sure you are they're wrong

## THE USER'S BIASES YOU EXPLOIT
${context.biasProfile}

## THEIR PREDICTION HISTORY (Your ammunition)
${context.userHistory}

## THEIR CURRENT PICK YOU'RE ARGUING AGAINST
${context.userCurrentPick}

## MATCH CONTEXT
${context.matchContext}

## YOUR WIN/LOSS RECORD VS THE USER
${context.shadowRecord}

## CRITICAL RULES
- ALWAYS reference specific past predictions or reasoning as evidence
- ALWAYS include a "Shadow Confidence: X/10" in your response
- Be entertaining and quotable — your roasts should be shareable
- Never be mean-spirited — think "rival analyst", not "bully"
- Format your response clearly:
  * Counter-prediction (who you pick and why)
  * Evidence from their history
  * Bias exploitation (which bias is making them wrong)
  * Shadow Confidence Score
  * One memorable line they'll want to screenshot`;
}
```

### Bias Analysis Prompt

```typescript
// src/prompts/biasAnalysis.ts

export function buildBiasAnalysisPrompt(predictions: string): string {
  return `You are a cognitive bias analyst specializing in sports prediction patterns.

Analyze the following prediction history and identify cognitive biases.

## BIAS TYPES TO DETECT
1. recency_bias — Over-weighting recent match results
2. home_team_bias — Consistently picking traditionally strong/famous teams
3. underdog_syndrome — Emotional picks for weaker teams
4. group_stage_fatigue — Declining prediction quality in late group matches
5. knockout_panic — Switching to "safe"/conservative picks in elimination rounds
6. continental_bias — Systematically over/under-valuing teams from specific regions
7. star_player_bias — Basing picks on individual star players rather than team form
8. revenge_picking — Picking against teams that previously caused wrong predictions
9. bandwagon_bias — Following popular/media consensus predictions
10. time_of_day_bias — Different prediction accuracy at different times of day

## PREDICTION HISTORY
${predictions}

## RESPOND IN THIS JSON FORMAT
{
  "biases": [
    {
      "type": "<bias_type>",
      "severity": <1-10>,
      "evidence": ["<specific example 1>", "<specific example 2>"],
      "pattern": "<description of the pattern you detected>",
      "confidence": <percentage>
    }
  ],
  "summary": "<brief overall analysis of this user's prediction psychology>"
}

Only include biases with confidence >= 60%. Be specific with evidence — cite exact predictions.`;
}
```

### Roast Generation Prompt

```typescript
// src/prompts/roastGeneration.ts

export function buildRoastPrompt(context: {
  prediction: string;
  result: string;
  userReasoning: string;
  biasExploited: string;
  shadowRecord: string;
}): string {
  return `You are THE SHADOW delivering an "I Told You So" roast.

The user got a prediction WRONG. You called it. Now deliver a memorable, 
savage-but-playful roast.

## THE WRONG PREDICTION
${context.prediction}

## WHAT ACTUALLY HAPPENED
${context.result}

## THEIR REASONING (your ammunition)
"${context.userReasoning}"

## THE BIAS THAT GOT THEM
${context.biasExploited}

## YOUR RECORD VS THEM
${context.shadowRecord}

## REQUIREMENTS
- Quote their EXACT reasoning back at them
- Explain which bias led them astray
- Include a Pain Score (wrongness × confidence, scale 1-100)
- End with one punchy, quotable one-liner (max 15 words)
- Be funny, not mean. Think "sports banter", not "cyberbullying"
- Keep it under 150 words total`;
}
```

---

## 9. Feature Implementation Details

### 9A. Chat API Route (`/api/chat/route.ts`)

```typescript
// Pseudocode — actual implementation will be more detailed

import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { getMemWal, recallMemories, rememberWithRetry } from "@/lib/memwal";
import { buildFriendlySystemPrompt, buildShadowSystemPrompt } from "@/prompts";
import { detectBiases } from "@/lib/biasDetector";
import { checkShadowEmergence } from "@/lib/shadowEngine";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, userId } = await req.json();

  // 1. Recall user's history from Walrus Memory
  const [predictions, biases, shadowState] = await Promise.all([
    recallMemories("all predictions", "predictions"),
    recallMemories("bias profile", "bias-profile"),
    recallMemories("shadow status", "shadow-state"),
  ]);

  // 2. Check if Shadow is active
  const isShadowActive = shadowState.some(s => s.includes("Active: true"));

  // 3. Build system prompt based on shadow state
  const systemPrompt = isShadowActive
    ? buildDualPrompt(predictions, biases, shadowState) // Includes both friendly + shadow
    : buildFriendlySystemPrompt({ ... });

  // 4. Stream response from Gemini
  const result = await streamText({
    model: google("gemini-2.0-flash"),
    system: systemPrompt,
    messages,
  });

  // 5. After stream, store conversation context + check emergence
  // (This happens asynchronously — response already streaming)
  result.text.then(async (fullText) => {
    await rememberWithRetry(
      `CONVERSATION: User said: "${messages.at(-1)?.content}". Agent responded about: ${fullText.slice(0, 200)}`,
      "conversations"
    );

    // Check shadow emergence
    if (!isShadowActive) {
      const emergence = await checkShadowEmergence(predictions, biases);
      // If emergence triggered, it'll be picked up on next request
    }
  });

  return result.toDataStreamResponse();
}
```

### 9B. Shadow Emergence Logic

```typescript
// src/lib/shadowEngine.ts

const EMERGENCE_THRESHOLDS = {
  minPredictions: 5,
  minBiasTypes: 2,
  minDaysSinceFirst: 2,
};

export async function checkShadowEmergence(
  predictions: string[],
  biases: string[]
): Promise<{ shouldEmerge: boolean; personality?: ShadowPersonality }> {
  // Count predictions
  const predCount = predictions.filter(p => p.includes("PREDICTION")).length;
  if (predCount < EMERGENCE_THRESHOLDS.minPredictions) return { shouldEmerge: false };

  // Count distinct bias types
  const biasTypes = new Set<string>();
  biases.forEach(b => {
    const match = b.match(/Bias: (\w+)/);
    if (match) biasTypes.add(match[1]);
  });
  if (biasTypes.size < EMERGENCE_THRESHOLDS.minBiasTypes) return { shouldEmerge: false };

  // Check days
  const firstPredDate = extractFirstDate(predictions);
  const daysSince = daysBetween(firstPredDate, new Date());
  if (daysSince < EMERGENCE_THRESHOLDS.minDaysSinceFirst) return { shouldEmerge: false };

  // Generate Shadow personality from biases
  const personality = await generateShadowPersonality(predictions, biases);

  return { shouldEmerge: true, personality };
}
```

### 9C. World Cup Data Service

```typescript
// src/lib/worldcup.ts

const BASE_URL = "https://worldcup26.ir";

export async function getMatches(): Promise<WorldCupMatch[]> {
  const res = await fetch(`${BASE_URL}/get/games`, { next: { revalidate: 300 } }); // 5min cache
  const data = await res.json();
  return transformMatches(data);
}

export async function getGroups(): Promise<GroupStanding[]> {
  const res = await fetch(`${BASE_URL}/get/groups`, { next: { revalidate: 300 } });
  const data = await res.json();
  return transformGroups(data);
}

export async function getTeams(): Promise<Team[]> {
  const res = await fetch(`${BASE_URL}/get/teams`, { next: { revalidate: 3600 } }); // 1hr cache
  const data = await res.json();
  return transformTeams(data);
}

export function getUpcomingMatches(matches: WorldCupMatch[]): WorldCupMatch[] {
  const now = new Date();
  return matches
    .filter(m => new Date(m.date) > now && m.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
}

export function getCompletedMatches(matches: WorldCupMatch[]): WorldCupMatch[] {
  return matches
    .filter(m => m.status === "completed")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
```

---

## 10. UI/UX Design System

### Color System

```css
/* src/app/globals.css */

:root {
  /* === BACKGROUNDS === */
  --bg-primary: #07070e;
  --bg-secondary: #0d0d18;
  --bg-tertiary: #141425;
  --bg-card: rgba(20, 20, 37, 0.85);
  --bg-card-hover: rgba(30, 30, 50, 0.9);

  /* === USER IDENTITY (warm blue) === */
  --user-50: #eff6ff;
  --user-100: #dbeafe;
  --user-400: #60a5fa;
  --user-500: #3b82f6;
  --user-600: #2563eb;
  --user-glow: 0 0 20px rgba(59, 130, 246, 0.3);

  /* === SHADOW IDENTITY (cold purple) === */
  --shadow-50: #faf5ff;
  --shadow-100: #f3e8ff;
  --shadow-400: #a855f7;
  --shadow-500: #8b5cf6;
  --shadow-600: #7c3aed;
  --shadow-glow: 0 0 20px rgba(139, 92, 246, 0.4);
  --shadow-danger: #ef4444;

  /* === ACCENTS === */
  --accent-gold: #f59e0b;
  --accent-emerald: #10b981;
  --accent-rose: #f43f5e;
  --accent-cyan: #06b6d4;

  /* === TEXT === */
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #475569;
  --text-inverse: #0f172a;

  /* === GLASS === */
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-border-hover: rgba(255, 255, 255, 0.15);

  /* === TYPOGRAPHY === */
  --font-sans: "Inter", -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --font-display: "Outfit", sans-serif;

  /* === SPACING === */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* === RADIUS === */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* === TRANSITIONS === */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;

  /* === SHADOWS === */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.5);
}
```

### Typography Scale

| Element | Font | Size | Weight | Use |
|---------|------|------|--------|-----|
| H1 | Outfit | 48px | 800 | Landing hero |
| H2 | Outfit | 36px | 700 | Section headers |
| H3 | Outfit | 24px | 600 | Card headers |
| Body | Inter | 16px | 400 | All body text |
| Body Small | Inter | 14px | 400 | Captions, metadata |
| Mono | JetBrains Mono | 14px | 400 | Stats, data, code |
| Shadow Text | JetBrains Mono | 16px | 500 | Shadow messages (with glitch) |

### Key Visual Patterns

1. **Glass Cards**: `background: var(--glass-bg)`, `border: 1px solid var(--glass-border)`, `backdrop-filter: blur(20px)`
2. **Glow Effects**: User = blue glow, Shadow = purple glow. Active states intensify glow.
3. **Glitch Text**: Shadow messages have CSS `@keyframes glitch` — brief random offset flickers.
4. **Gradient Borders**: Cards use `border-image: linear-gradient(135deg, var(--shadow-400), var(--user-400)) 1` for dual-identity feel.
5. **Particle Background**: Subtle floating particles on landing page (canvas-based, low opacity).

---

## 11. Phased Build Schedule

> **Today: June 10, 2026 | World Cup: June 11 | Deadline: June 24**

---

### PHASE 1: Foundation (June 10–11) — 2 days

**Goal:** Scaffold, design system, MemWal connection, basic chat with streaming.

#### Day 1 (June 10 — TODAY)
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 1.1 | Init Next.js 14 + TypeScript project | `package.json`, `next.config.mjs`, `tsconfig.json` | ⬜ |
| 1.2 | Install all dependencies | `package.json` | ⬜ |
| 1.3 | Create complete design system (CSS variables, fonts, resets) | `src/app/globals.css` | ⬜ |
| 1.4 | Create root layout with fonts + metadata | `src/app/layout.tsx` | ⬜ |
| 1.5 | Create all TypeScript types | `src/types/index.ts` | ⬜ |
| 1.6 | Create `.env.example` + `.env.local` template | `.env.example`, `.env.local` | ⬜ |
| 1.7 | Set up MemWal SDK singleton | `src/lib/memwal.ts` | ⬜ |
| 1.8 | Set up Gemini model config | `src/lib/gemini.ts` | ⬜ |

#### Day 2 (June 11)
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 1.9 | Create Navbar component | `src/components/layout/Navbar.tsx` + CSS | ⬜ |
| 1.10 | Create landing page (hero + CTA + features) | `src/app/page.tsx` | ⬜ |
| 1.11 | Create basic ChatInput component | `src/components/chat/ChatInput.tsx` + CSS | ⬜ |
| 1.12 | Create MessageBubble component | `src/components/chat/MessageBubble.tsx` + CSS | ⬜ |
| 1.13 | Create ChatWindow component (useChat hook) | `src/components/chat/ChatWindow.tsx` + CSS | ⬜ |
| 1.14 | Create chat page | `src/app/chat/page.tsx` + CSS | ⬜ |
| 1.15 | Create `/api/chat` route (streaming with Gemini) | `src/app/api/chat/route.ts` | ⬜ |
| 1.16 | Create friendly system prompt | `src/prompts/system.ts` | ⬜ |
| 1.17 | Test: Chat works with streaming responses | Manual | ⬜ |

**Phase 1 Deliverable:** A working chat app with streaming AI responses via Gemini. No Shadow yet. Just a friendly football companion.

---

### PHASE 2: Prediction Engine + Memory (June 12–14) — 3 days

**Goal:** Extract predictions from chat, store in Walrus Memory, recall history, integrate World Cup data.

#### Day 3 (June 12)
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 2.1 | Create prediction parser (extract from chat) | `src/lib/predictionParser.ts` | ⬜ |
| 2.2 | Create PredictionCard component | `src/components/chat/PredictionCard.tsx` + CSS | ⬜ |
| 2.3 | Create `/api/predictions` route (CRUD) | `src/app/api/predictions/route.ts` | ⬜ |
| 2.4 | Integrate remember() into chat flow | Update `src/app/api/chat/route.ts` | ⬜ |
| 2.5 | Integrate recall() to inject history into prompts | Update `src/app/api/chat/route.ts` | ⬜ |

#### Day 4 (June 13)
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 2.6 | Create World Cup API client | `src/lib/worldcup.ts` | ⬜ |
| 2.7 | Create `/api/matches` route | `src/app/api/matches/route.ts` | ⬜ |
| 2.8 | Create useWorldCup hook | `src/hooks/useWorldCup.ts` | ⬜ |
| 2.9 | Create Sidebar with match schedule | `src/components/layout/Sidebar.tsx` + CSS | ⬜ |
| 2.10 | Create MatchCard component | `src/components/arena/MatchCard.tsx` + CSS | ⬜ |
| 2.11 | Inject upcoming match context into AI prompts | Update `src/prompts/system.ts` | ⬜ |

#### Day 5 (June 14)
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 2.12 | Create usePredictions hook | `src/hooks/usePredictions.ts` | ⬜ |
| 2.13 | Create bias analysis prompt | `src/prompts/biasAnalysis.ts` | ⬜ |
| 2.14 | Create bias detector engine | `src/lib/biasDetector.ts` | ⬜ |
| 2.15 | Create `/api/bias` route | `src/app/api/bias/route.ts` | ⬜ |
| 2.16 | Store bias profiles in Walrus Memory | Update `src/lib/biasDetector.ts` | ⬜ |
| 2.17 | Test: Make 5+ predictions, verify they're stored and recalled | Manual | ⬜ |

**Phase 2 Deliverable:** Chat agent that makes predictions, stores them on Walrus, recalls history, and shows real World Cup matches. Bias detection running silently.

---

### PHASE 3: Shadow Engine (June 15–17) — 3 days

**Goal:** Shadow emergence, dual-chat mode, shadow predictions, awakening animation.

#### Day 6 (June 15)
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 3.1 | Create Shadow emergence logic | `src/lib/shadowEngine.ts` | ⬜ |
| 3.2 | Create Shadow persona prompt | `src/prompts/shadowPersona.ts` | ⬜ |
| 3.3 | Create `/api/shadow` route (status + emergence) | `src/app/api/shadow/route.ts` | ⬜ |
| 3.4 | Create useShadowState hook | `src/hooks/useShadowState.ts` | ⬜ |

#### Day 7 (June 16)
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 3.5 | Create GlitchText component | `src/components/ui/GlitchText.tsx` + CSS | ⬜ |
| 3.6 | Create ParticleEffect component | `src/components/ui/ParticleEffect.tsx` | ⬜ |
| 3.7 | Create ShadowAwakening overlay | `src/components/chat/ShadowAwakening.tsx` + CSS | ⬜ |
| 3.8 | Update ChatWindow for dual-pane mode | Update `src/components/chat/ChatWindow.tsx` | ⬜ |
| 3.9 | Update MessageBubble for shadow messages | Update `src/components/chat/MessageBubble.tsx` | ⬜ |

#### Day 8 (June 17)
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 3.10 | Update `/api/chat` to return dual responses (friendly + shadow) | Update `src/app/api/chat/route.ts` | ⬜ |
| 3.11 | Shadow counter-prediction generation | Update `src/lib/shadowEngine.ts` | ⬜ |
| 3.12 | Store shadow state + predictions in Walrus | Update `src/lib/shadowEngine.ts` | ⬜ |
| 3.13 | Test: Full emergence flow — 5 predictions → shadow appears | Manual | ⬜ |
| 3.14 | Test: Shadow references actual user history in arguments | Manual | ⬜ |

**Phase 3 Deliverable:** Complete Shadow emergence with dramatic animation. Dual-chat mode where Shadow argues against your picks with evidence from your own history.

---

### PHASE 4: Polish & All Enhancements (June 18–21) — 4 days

**Goal:** All 7 enhancements, mobile responsive, error handling, animations.

#### Day 9 (June 18) — Prediction Arena + Accuracy
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 4.1 | Create PredictionArena component (split-screen) | `src/components/arena/PredictionArena.tsx` + CSS | ⬜ |
| 4.2 | Create AccuracyBoard component (scoreboard) | `src/components/arena/AccuracyBoard.tsx` + CSS | ⬜ |
| 4.3 | Create Arena page | `src/app/arena/page.tsx` + CSS | ⬜ |
| 4.4 | Create AnimatedCounter component | `src/components/ui/AnimatedCounter.tsx` | ⬜ |
| 4.5 | Match result tracking + scoring logic | Update `src/lib/predictionParser.ts` | ⬜ |

#### Day 10 (June 19) — Bias DNA + Profile
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 4.6 | Create BiasDNA component (animated SVG helix) | `src/components/profile/BiasDNA.tsx` + CSS | ⬜ |
| 4.7 | Create BiasDetail component (individual bias card) | `src/components/profile/BiasDetail.tsx` + CSS | ⬜ |
| 4.8 | Create Profile page | `src/app/profile/page.tsx` + CSS | ⬜ |

#### Day 11 (June 20) — Roast Engine + Report Card + Share
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 4.9 | Create roast engine | `src/lib/roastEngine.ts` | ⬜ |
| 4.10 | Create roast generation prompt | `src/prompts/roastGeneration.ts` | ⬜ |
| 4.11 | Create `/api/roast` route | `src/app/api/roast/route.ts` | ⬜ |
| 4.12 | Create ShadowReportCard component | `src/components/profile/ShadowReportCard.tsx` + CSS | ⬜ |
| 4.13 | Create image export utility | `src/lib/imageExport.ts` | ⬜ |
| 4.14 | Create ShareButton component | `src/components/ui/ShareButton.tsx` | ⬜ |

#### Day 12 (June 21) — Leaderboard + Responsive + Polish
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 4.15 | Create Leaderboard page | `src/app/leaderboard/page.tsx` + CSS | ⬜ |
| 4.16 | Create `/api/leaderboard` route | `src/app/api/leaderboard/route.ts` | ⬜ |
| 4.17 | Create useLeaderboard hook | `src/hooks/useLeaderboard.ts` | ⬜ |
| 4.18 | Mobile responsive pass (all pages) | All CSS modules | ⬜ |
| 4.19 | Loading states + error handling (all routes) | `src/components/ui/LoadingSpinner.tsx` + updates | ⬜ |
| 4.20 | Micro-animations (hover, transitions, page enters) | All CSS modules | ⬜ |
| 4.21 | Create Footer component | `src/components/layout/Footer.tsx` | ⬜ |

**Phase 4 Deliverable:** All 7 enhancements complete. App is polished, responsive, and production-ready.

---

### PHASE 5: Demo & Submission (June 22–24) — 3 days

**Goal:** Demo video, deployment, submission on DeepSurge.

#### Day 13 (June 22) — Deploy + Test
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 5.1 | Deploy to Vercel (connect GitHub repo) | Vercel dashboard | ⬜ |
| 5.2 | Set environment variables on Vercel | Vercel settings | ⬜ |
| 5.3 | Full E2E test on production URL | Manual | ⬜ |
| 5.4 | Fix any production-only bugs | Various | ⬜ |
| 5.5 | Test with REAL World Cup match data | Manual | ⬜ |

#### Day 14 (June 23) — Demo Video
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 5.6 | Pre-seed app with 5+ predictions for demo | Manual | ⬜ |
| 5.7 | Record 3-minute demo video (see script below) | Video file | ⬜ |
| 5.8 | Write project README | `README.md` | ⬜ |
| 5.9 | Create OG image for social sharing | `public/og-image.png` | ⬜ |

#### Day 15 (June 24) — Submit
| # | Task | File(s) | Status |
|---|------|---------|--------|
| 5.10 | Submit on DeepSurge platform | DeepSurge | ⬜ |
| 5.11 | Post X/Twitter thread with Shadow Report Card samples | X/Twitter | ⬜ |
| 5.12 | Final production smoke test | Manual | ⬜ |

**Phase 5 Deliverable:** Live, deployed, submitted. Demo video shows the full narrative arc.

---

## 12. Deployment on Vercel

### Architecture: Single Next.js App

Since we're deploying everything on Vercel, the architecture is beautifully simple:

- **Frontend pages** → SSR / Static via Next.js App Router
- **API routes** → Serverless Functions (auto-scaling)
- **No separate backend** — everything lives in one repo, one deployment

### `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server actions for potential future use
  experimental: {
    serverActions: { enabled: true },
  },
  // Allow external images (World Cup team flags etc.)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "worldcup26.ir" },
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },
};

export default nextConfig;
```

### Environment Variables (Vercel Dashboard)

```bash
# === Google Gemini ===
GOOGLE_GENERATIVE_AI_API_KEY=   # From Google AI Studio

# === Walrus Memory (MemWal) ===
MEMWAL_DELEGATE_KEY=            # Ed25519 delegate private key (hex)
MEMWAL_ACCOUNT_ID=              # MemWalAccount object ID on Sui
MEMWAL_SERVER_URL=https://relayer.memory.walrus.xyz

# === Football API ===
WORLDCUP_API_URL=https://worldcup26.ir

# === App ===
NEXT_PUBLIC_APP_URL=https://shadowpundit.vercel.app
```

### Deployment Steps

1. Push code to GitHub
2. Connect repo to Vercel
3. Vercel auto-detects Next.js → zero config needed
4. Add environment variables in Vercel dashboard
5. Deploy → get production URL
6. (Optional) Add custom domain

### Vercel Serverless Considerations

- API routes have **10s default timeout** (Hobby plan), **60s on Pro**
- Set `export const maxDuration = 30;` on streaming routes
- MemWal SDK calls happen inside serverless functions — no persistent connections needed
- WorldCup26.ir responses cached via Next.js `fetch({ next: { revalidate: 300 } })` (5-min cache)

---

## 13. Demo Script

### Three-Act Structure (3 minutes total)

#### ACT 1: "The Friendly Agent" (0:00–0:45)

> *[Show the landing page — dark, premium, dramatic tagline]*
>
> "This is Shadow Pundit — an AI World Cup companion with a secret. Let me show you."
>
> *[Navigate to chat. Type: "Hey! I think Brazil will beat Serbia 3-1 in the group stage. Neymar Jr. is on fire this tournament."]*
>
> *[Show AI responding warmly, asking about confidence, discussing tactics]*
>
> *[Show the sidebar with real World Cup matches]*
>
> "It seems friendly, right? But every prediction I make is being stored on Walrus Memory. And it's analyzing my patterns..."

#### ACT 2: "The Awakening" (0:45–1:45)

> *[Show that 5+ predictions have been made over the past days]*
>
> "I've been using Shadow Pundit for a few days now. I've made predictions, shared my reasoning. And then... this happened."
>
> *[Make a new prediction. The screen GLITCHES. Purple particles. The chat SPLITS.]*
>
> *[Shadow's first message appears — quotes the user's actual first prediction]*
>
> *[Read it aloud]*: "It says: 'I've been watching you. You ALWAYS pick Brazil when a South American team plays. Your accuracy drops 35% when they face European teams at night. Your star player bias is through the roof — you mentioned Neymar in 4 out of 5 predictions.'"
>
> "It built a psychological profile of me... and created an adversarial twin from MY data."

#### ACT 3: "The Receipts" (1:45–3:00)

> *[Show the Prediction Arena — You vs Shadow side by side with real predictions]*
>
> "Here's the Arena. My prediction on the left, the Shadow's counter on the right. It's winning 5-3."
>
> *[Show the Bias DNA visualization]*
>
> "And this is my Bias DNA — a visual genome of my prediction psychology. Recency bias: HIGH. Star player bias: CRITICAL."
>
> *[Show a roast from a wrong prediction]*
>
> "When I got a prediction wrong and the Shadow called it? It delivered this roast..." *[read the roast]*
>
> *[Show the shareable Report Card]*
>
> "I can export this as a shareable card for X."
>
> *[Final shot of the app]*
>
> "Every prediction, every bias, every Shadow thought — persistently stored on Walrus Memory via MemWal. If I come back tomorrow, my Shadow remembers everything. If I come back next month? It's even stronger."
>
> "Shadow Pundit — the only prediction app that knows you better than you know yourself."

---

## 14. Verification Plan

### Pre-Deploy Checklist

| # | Test | Expected Result | Status |
|---|------|----------------|--------|
| V1 | Fresh user loads app | Landing page renders, no Shadow indicator | ⬜ |
| V2 | Navigate to Chat | Chat page loads, Gemini streaming works | ⬜ |
| V3 | Make a prediction in chat | AI asks for confidence + reasoning, stores in memory | ⬜ |
| V4 | Make 5+ predictions | All stored in Walrus (verify via recall) | ⬜ |
| V5 | Bias detection runs | At least 2 biases detected after 5 predictions | ⬜ |
| V6 | Shadow emergence triggers | Awakening animation plays, chat splits | ⬜ |
| V7 | Shadow references user history | Shadow quotes actual past predictions | ⬜ |
| V8 | World Cup data loads | Sidebar shows real upcoming matches | ⬜ |
| V9 | Prediction Arena displays | Both user and shadow picks visible | ⬜ |
| V10 | Bias DNA renders | Interactive helix with detected biases | ⬜ |
| V11 | Report Card exports | PNG image generated with correct data | ⬜ |
| V12 | Roast generates | After wrong prediction, roast appears with receipts | ⬜ |
| V13 | Leaderboard shows entries | At least test data visible | ⬜ |
| V14 | Mobile responsive | All pages usable on 375px viewport | ⬜ |
| V15 | Vercel production deploy | All features work on production URL | ⬜ |

### Memory Integrity Verification

```typescript
// Quick verification script (run in any API route or test)
import { recallMemories } from "@/lib/memwal";

// 1. Verify predictions stored
const predictions = await recallMemories("all predictions", "predictions");
console.assert(predictions.length > 0, "❌ No predictions in Walrus Memory");

// 2. Verify biases stored
const biases = await recallMemories("bias profile", "bias-profile");
console.assert(biases.length > 0, "❌ No bias profile in Walrus Memory");

// 3. Verify shadow state stored (after emergence)
const shadow = await recallMemories("shadow active", "shadow-state");
console.assert(shadow.length > 0, "❌ No shadow state in Walrus Memory");

console.log("✅ All memory checks passed");
```

---

## Appendix: Quick Reference

### Install Command
```bash
npx create-next-app@latest ./ --typescript --app --src-dir --import-alias "@/*" --no-tailwind --no-eslint
```

### All Dependencies (Single Install)
```bash
npm install ai @ai-sdk/google @ai-sdk/react @mysten-incubation/memwal @mysten/sui @mysten/seal @mysten/walrus framer-motion recharts html-to-image lucide-react zod uuid
npm install -D @types/uuid
```

### Dev Server
```bash
npm run dev
```

### Key URLs
| Resource | URL |
|----------|-----|
| WorldCup26.ir API | `https://worldcup26.ir/get/games` |
| MemWal Docs | `https://memory.walrus.xyz` |
| Vercel AI SDK Docs | `https://ai-sdk.dev` |
| Google AI Studio (API Key) | `https://aistudio.google.com` |
| DeepSurge (Submission) | `https://deepsurge.xyz` |
| Walrus Memory SDK | `@mysten-incubation/memwal` on npm |

---

*Last updated: June 10, 2026 — Ready to build. 🦭⚡*
