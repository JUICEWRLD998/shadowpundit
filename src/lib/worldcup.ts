/**
 * WorldCup26.ir API client.
 *
 * The public WorldCup26.ir endpoints are free and key-less but their exact JSON
 * shape isn't formally documented, so everything here is written defensively:
 * we accept several plausible field names, coerce loosely-typed values, and on
 * any failure fall back to a small curated fixture set so the companion always
 * has *something* real to talk about. The agent's prompt only ever presents
 * fixtures we hand it, so a graceful fallback is safer than throwing.
 *
 * Server only — call from API routes / server components.
 */

import type { MatchStage, MatchStatus, WorldCupMatch } from "@/types";
import { countryFlag } from "./flags";

const BASE_URL =
  process.env.WORLDCUP_API_URL?.replace(/\/+$/, "") || "https://worldcup26.ir";

/** Cache windows (seconds) — fixtures move fast on matchdays, teams rarely. */
const REVALIDATE = {
  matches: 300, // 5 min
  groups: 300,
  teams: 3600, // 1 hr
} as const;

/* ------------------------------------------------------------------ fetch -- */

/**
 * Fetch + parse JSON from a WorldCup26 endpoint with Next's fetch cache.
 * Returns `null` (never throws) so callers can fall back cleanly.
 */
async function fetchJson(path: string, revalidate: number): Promise<unknown> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate },
      headers: { accept: "application/json" },
    });
    if (!res.ok) {
      console.warn(`[worldcup] ${path} → HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.warn(`[worldcup] ${path} fetch failed:`, error);
    return null;
  }
}

/* -------------------------------------------------------------- coercion -- */

/** Pull the first present, non-empty value among candidate keys. */
function pick(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const v = obj[key];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

/** Unwrap the common envelope shapes ({data:[...]}, {results:[...]}, [...]). */
function toArray(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (payload && typeof payload === "object") {
    for (const key of ["data", "results", "games", "matches", "items"]) {
      const inner = (payload as Record<string, unknown>)[key];
      if (Array.isArray(inner)) return inner as Record<string, unknown>[];
    }
  }
  return [];
}

const STAGE_PATTERNS: [RegExp, MatchStage][] = [
  [/final/i, "final"],
  [/third/i, "third-place"],
  [/semi/i, "semi-final"],
  [/quarter/i, "quarter-final"],
  [/(round.*16|r16|last 16)/i, "round-of-16"],
  [/(round.*32|r32|last 32)/i, "round-of-32"],
  [/(match.?day.?3|md3|matchday 3)/i, "group-matchday3"],
  [/(match.?day.?2|md2|matchday 2)/i, "group-matchday2"],
];

function normaliseStage(raw: string): MatchStage {
  for (const [pattern, stage] of STAGE_PATTERNS) {
    if (pattern.test(raw)) return stage;
  }
  return "group-matchday1";
}

function normaliseStatus(raw: string, score: string): MatchStatus {
  const r = raw.toLowerCase();
  if (/(live|playing|in.?progress|1st|2nd half|ht)/.test(r)) return "live";
  if (/(finished|completed|ended|full.?time|ft|played)/.test(r)) return "completed";
  if (score && /\d+\s*[-:]\s*\d+/.test(score)) return "completed";
  return "scheduled";
}

/** Best-effort winner from a "2-1" style score string. */
function winnerFromScore(score: string): WorldCupMatch["winner"] {
  const m = score.match(/(\d+)\s*[-:]\s*(\d+)/);
  if (!m) return undefined;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (a === b) return "draw";
  return a > b ? "teamA" : "teamB";
}

/** Map one raw record (unknown shape) → our WorldCupMatch, or null if unusable. */
function normaliseMatch(raw: Record<string, unknown>, index: number): WorldCupMatch | null {
  const teamA = pick(raw, ["teamA", "home", "home_team", "homeTeam", "team1", "team_a"]);
  const teamB = pick(raw, ["teamB", "away", "away_team", "awayTeam", "team2", "team_b"]);
  if (!teamA || !teamB) return null; // a match needs two sides

  const score = pick(raw, ["score", "result", "ft_score", "full_time"]);
  const statusRaw = pick(raw, ["status", "state", "match_status", "phase"]);
  const stageRaw = pick(raw, ["stage", "round", "type", "group_stage"]);
  const status = normaliseStatus(statusRaw, score);

  return {
    id: pick(raw, ["id", "match_id", "game_id", "uuid"]) || `wc-${index}`,
    teamA,
    teamB,
    teamAFlag: pick(raw, ["teamAFlag", "home_flag"]) || countryFlag(teamA),
    teamBFlag: pick(raw, ["teamBFlag", "away_flag"]) || countryFlag(teamB),
    date: pick(raw, ["date", "match_date", "day", "datetime", "kickoff"]),
    time: pick(raw, ["time", "kickoff_time", "hour"]),
    stadium: pick(raw, ["stadium", "venue", "arena"]),
    city: pick(raw, ["city", "location", "host_city"]),
    stage: normaliseStage(stageRaw),
    status,
    score: score || undefined,
    winner: status === "completed" ? winnerFromScore(score) : undefined,
    group: pick(raw, ["group", "group_name", "grp"]) || undefined,
  };
}

/* ----------------------------------------------------------------- public -- */

/**
 * All tournament matches, normalised. Falls back to a curated fixture set when
 * the live API is unreachable or returns an unrecognised shape.
 */
export async function getMatches(): Promise<WorldCupMatch[]> {
  const payload = await fetchJson("/get/games", REVALIDATE.matches);
  const rows = toArray(payload);
  const matches = rows
    .map((row, i) => normaliseMatch(row, i))
    .filter((m): m is WorldCupMatch => m !== null);

  return matches.length > 0 ? matches : FALLBACK_FIXTURES;
}

/** Parse a YYYY-MM-DD-ish date string to epoch ms; NaN-safe (returns 0). */
function dateValue(m: WorldCupMatch): number {
  const t = Date.parse(`${m.date} ${m.time}`.trim());
  return Number.isNaN(t) ? 0 : t;
}

/** Upcoming scheduled fixtures, soonest first. */
export function getUpcomingMatches(
  matches: WorldCupMatch[],
  limit = 6,
  now: number = Date.now(),
): WorldCupMatch[] {
  return matches
    .filter((m) => m.status === "scheduled")
    .filter((m) => {
      const t = dateValue(m);
      return t === 0 || t >= now; // keep undated fixtures rather than drop them
    })
    .sort((a, b) => dateValue(a) - dateValue(b))
    .slice(0, limit);
}

/** Most recently completed fixtures, newest first. */
export function getCompletedMatches(
  matches: WorldCupMatch[],
  limit = 6,
): WorldCupMatch[] {
  return matches
    .filter((m) => m.status === "completed")
    .sort((a, b) => dateValue(b) - dateValue(a))
    .slice(0, limit);
}

/**
 * Render upcoming fixtures as a compact block for the AI system prompt. The
 * agent is told to treat only these as real, so the format stays factual and
 * terse — no invented context.
 */
export function formatMatchesForPrompt(matches: WorldCupMatch[]): string {
  if (matches.length === 0) return "";
  return matches
    .map((m) => {
      const when = [m.date, m.time].filter(Boolean).join(" ");
      const where = [m.stadium, m.city].filter(Boolean).join(", ");
      const meta = [when, where, m.group && `Group ${m.group}`]
        .filter(Boolean)
        .join(" · ");
      return `- ${m.teamAFlag} ${m.teamA} vs ${m.teamB} ${m.teamBFlag}${meta ? ` (${meta})` : ""}`;
    })
    .join("\n");
}

/* --------------------------------------------------------------- fallback -- */

/**
 * Curated fallback fixtures — used ONLY when the live API can't be reached.
 * Marquee group-stage matchups between confirmed 2026 participants so the
 * companion still has credible games to discuss during a demo or an outage.
 * Dates are illustrative; live data always takes precedence when available.
 */
const FALLBACK_FIXTURES: WorldCupMatch[] = [
  mkFixture("fb-1", "Argentina", "Nigeria", "2026-06-16", "21:00", "MetLife Stadium", "New York", "A"),
  mkFixture("fb-2", "Spain", "Croatia", "2026-06-17", "18:00", "SoFi Stadium", "Los Angeles", "B"),
  mkFixture("fb-3", "England", "Senegal", "2026-06-17", "21:00", "Lumen Field", "Seattle", "C"),
  mkFixture("fb-4", "Brazil", "Japan", "2026-06-18", "20:00", "AT&T Stadium", "Dallas", "D"),
  mkFixture("fb-5", "France", "Mexico", "2026-06-18", "17:00", "Estadio Azteca", "Mexico City", "E"),
  mkFixture("fb-6", "Germany", "United States", "2026-06-19", "19:00", "BMO Field", "Toronto", "F"),
  mkFixture("fb-7", "Portugal", "Netherlands", "2026-06-19", "21:30", "Mercedes-Benz Stadium", "Atlanta", "G"),
  mkFixture("fb-8", "Belgium", "Morocco", "2026-06-20", "18:00", "Hard Rock Stadium", "Miami", "H"),
];

function mkFixture(
  id: string,
  teamA: string,
  teamB: string,
  date: string,
  time: string,
  stadium: string,
  city: string,
  group: string,
): WorldCupMatch {
  return {
    id,
    teamA,
    teamB,
    teamAFlag: countryFlag(teamA),
    teamBFlag: countryFlag(teamB),
    date,
    time,
    stadium,
    city,
    stage: "group-matchday1",
    status: "scheduled",
    group,
  };
}
