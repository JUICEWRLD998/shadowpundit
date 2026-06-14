<<<<<<< HEAD
/* ============================================================================
   SHADOW PUNDIT — TYPE SYSTEM
   Single source of truth for every data model in the app.
   ========================================================================== */

// ==================== PREDICTIONS ====================

=======
// src/types/index.ts

// ==================== PREDICTIONS ====================

export interface Prediction {
  id: string;
  matchId: string;
  teamA: string;
  teamB: string;
  teamAFlag: string;        // Emoji flag or URL
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

>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
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

<<<<<<< HEAD
export type PickSide = "teamA" | "teamB" | "draw";

export interface Prediction {
  id: string;
  matchId: string;
  teamA: string;
  teamB: string;
  teamAFlag: string; // Emoji flag
  teamBFlag: string;
  stage: MatchStage;
  userPick: PickSide;
  predictedScore: string; // e.g. "2-1"
  confidence: number; // 1-10
  reasoning: string;
  timestamp: string; // ISO 8601
  result?: MatchResult;
  shadowPrediction?: ShadowPrediction;
}

export interface ShadowPrediction {
  pick: PickSide;
  predictedScore: string;
  reasoning: string; // Uses the user's biases as evidence
=======
export interface ShadowPrediction {
  pick: "teamA" | "teamB" | "draw";
  predictedScore: string;
  reasoning: string;        // Uses user's biases as evidence
>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
  biasesExploited: BiasType[];
  confidenceAgainstUser: number; // 1-10
}

export interface MatchResult {
<<<<<<< HEAD
  winner: PickSide;
=======
  winner: "teamA" | "teamB" | "draw";
>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
  score: string;
  userCorrect: boolean;
  shadowCorrect: boolean;
  roast?: RoastPayload;
}

// ==================== BIAS SYSTEM ====================

export type BiasType =
<<<<<<< HEAD
  | "recency_bias" // Over-weighting recent results
  | "home_team_bias" // Always picking favorites/strong teams
  | "underdog_syndrome" // Emotional picks for underdogs
  | "group_stage_fatigue" // Declining quality in late group matches
  | "knockout_panic" // Conservative picks in elimination rounds
  | "continental_bias" // Over/under-valuing specific regions
  | "star_player_bias" // Picks based on individuals, not teams
  | "revenge_picking" // Picking against teams that burned you
  | "bandwagon_bias" // Following popular opinion
  | "time_of_day_bias"; // Accuracy varies by time of prediction

export type BiasSeverityTier = "mild" | "moderate" | "severe";

export interface BiasProfile {
  type: BiasType;
  label: string; // Human-readable name
  description: string; // What this bias means
  severity: number; // 1-10
  evidence: string[]; // Specific examples from user data
  detectedAt: string;
  lastTriggered: string;
  triggerCount: number;
  dnaColor: string; // Hex/OKLCH color for DNA visualization
=======
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
>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
}

// ==================== SHADOW ====================

<<<<<<< HEAD
export type ShadowTone = "sarcastic" | "analytical" | "savage" | "playful";

export interface ShadowPersonality {
  tone: ShadowTone;
  knownBiases: BiasType[];
  favoriteCounterArgument: string;
  catchphrase: string;
  emergenceMessage: string; // First message after awakening
}

export interface ShadowRecord {
  wins: number;
  losses: number;
  draws: number;
}

=======
>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
export interface ShadowState {
  isActive: boolean;
  activatedAt: string | null;
  personality: ShadowPersonality;
<<<<<<< HEAD
  winRecord: ShadowRecord;
  predictedUserPicks: number; // Times shadow guessed what user would pick
=======
  winRecord: { wins: number; losses: number; draws: number };
  predictedUserPicks: number;  // Times shadow guessed what user would pick
>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
  totalRoasts: number;
  favoriteRoast: string;
}

<<<<<<< HEAD
export interface RoastPayload {
  text: string;
  painScore: number; // (10 - accuracy) × confidence
  userQuote: string; // Their exact reasoning quoted
=======
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
>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
  biasExploited: BiasType;
  shareImageUrl?: string;
}

// ==================== WORLD CUP DATA ====================

<<<<<<< HEAD
export type MatchStatus = "scheduled" | "live" | "completed";

=======
>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
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
<<<<<<< HEAD
  status: MatchStatus;
  score?: string;
  winner?: PickSide;
  group?: string;
}

export interface Team {
  name: string;
  flag: string;
  group?: string;
  fifaCode?: string;
=======
  status: "scheduled" | "live" | "completed";
  score?: string;
  winner?: "teamA" | "teamB" | "draw";
  group?: string;
}

export interface GroupStanding {
  group: string;
  teams: TeamStanding[];
>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
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

<<<<<<< HEAD
export interface GroupStanding {
  group: string;
  teams: TeamStanding[];
}

=======
>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
// ==================== LEADERBOARD ====================

export interface LeaderboardEntry {
  rank: number;
<<<<<<< HEAD
  userId: string; // Anonymous hash
  displayName: string; // Auto-generated funny name
  shadowAccuracy: number; // Shadow's win %
  userAccuracy: number; // User's win %
  totalPredictions: number;
  roastCount: number;
  topBias: BiasType;
  defianceRate: number; // % times user defied shadow and was RIGHT
=======
  userId: string;            // Anonymous hash
  displayName: string;       // Auto-generated funny name
  shadowAccuracy: number;    // Shadow's win %
  userAccuracy: number;      // User's win %
  totalPredictions: number;
  roastCount: number;
  topBias: BiasType;
  defianceRate: number;      // % times user defied shadow and was RIGHT
>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
}

// ==================== CHAT ====================

<<<<<<< HEAD
export type ChatRole = "user" | "assistant" | "shadow";

export interface ChatMessageMetadata {
  predictionExtracted?: boolean;
  biasDetected?: BiasType[];
  shadowEmergence?: boolean;
  matchContext?: WorldCupMatch;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  metadata?: ChatMessageMetadata;
=======
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
>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
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
<<<<<<< HEAD

// ==================== MEMORY ====================

/** Walrus Memory namespaces — one bucket per data domain. */
export type MemoryNamespace =
  | "predictions"
  | "bias-profile"
  | "shadow-state"
  | "conversations"
  | "results";
=======
>>>>>>> 868bad55ca2bbcd9880aedc3bc716ff12e5db2f6
