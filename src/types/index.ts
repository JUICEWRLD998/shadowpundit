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
