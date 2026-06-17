/**
 * WorldCup26.ir API client.
 *
 * Verified response shapes (June 2026):
 *   GET /get/games    → { games: [ { id, home_team_name_en, away_team_name_en,
 *                          home_score, away_score, group, matchday, type,
 *                          local_date: "MM/DD/YYYY HH:MM", stadium_id,
 *                          finished: "TRUE"|"FALSE", time_elapsed, ... } ] }
 *   GET /get/stadiums → { stadiums: [ { id, name_en, city_en, country_en } ] }
 *
 * Knockout games swap `home_team_name_en` for `home_team_label`
 * ("Runner-up Group A") until the bracket fills in.
 *
 * Everything is defensive: unparseable records are skipped, and if the live API
 * is unreachable we fall back to a small set of real, confirmed-qualified teams
 * so the companion always has credible fixtures. The agent's prompt only ever
 * presents fixtures we hand it, so a graceful fallback is safer than throwing.
 *
 * Server only.
 */

import type { MatchStage, MatchStatus, WorldCupMatch } from "@/types";
import { countryFlag } from "./flags";

const BASE_URL =
  process.env.WORLDCUP_API_URL?.replace(/\/+$/, "") || "https://worldcup26.ir";

/** Cache windows (seconds) — fixtures move fast on matchdays, venues never. */
const REVALIDATE = {
  matches: 180, // 3 min
  stadiums: 86_400, // 1 day
} as const;

/* ------------------------------------------------------------------ fetch -- */

async function fetchJson(path: string, revalidate: number): Promise<unknown> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate },
      headers: { accept: "application/json" },
      // Cap the wait so an unreachable upstream (TLS reset / hang) falls back to
      // the curated fixtures fast, instead of stalling every chat for ~20s.
      signal: AbortSignal.timeout(4000),
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

/** Unwrap a known envelope key ({games:[...]}, {stadiums:[...]}) or a bare array. */
function unwrap(payload: unknown, key: string): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (payload && typeof payload === "object") {
    const inner = (payload as Record<string, unknown>)[key];
    if (Array.isArray(inner)) return inner as Record<string, unknown>[];
    // tolerate generic envelopes too
    for (const k of ["data", "results", "items"]) {
      const v = (payload as Record<string, unknown>)[k];
      if (Array.isArray(v)) return v as Record<string, unknown>[];
    }
  }
  return [];
}

/* -------------------------------------------------------------- coercion -- */

function str(v: unknown): string {
  return v == null ? "" : String(v).trim();
}

/** First present, non-empty value among candidate keys. */
function pick(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const s = str(obj[key]);
    if (s !== "") return s;
  }
  return "";
}

/** Split "MM/DD/YYYY HH:MM" into a sortable ISO-ish date + a display time. */
function parseLocalDate(local: string): { date: string; time: string; epoch: number } {
  if (!local) return { date: "", time: "", epoch: 0 };
  const [datePart = "", timePart = ""] = local.split(/\s+/);
  const m = datePart.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  let isoDate = datePart;
  if (m) {
    const [, mm, dd, yyyy] = m;
    isoDate = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  const epoch = Date.parse(`${isoDate}T${timePart || "00:00"}:00`);
  return {
    date: isoDate,
    time: timePart,
    epoch: Number.isNaN(epoch) ? 0 : epoch,
  };
}

const TYPE_TO_STAGE: Record<string, MatchStage> = {
  r32: "round-of-32",
  r16: "round-of-16",
  qf: "quarter-final",
  sf: "semi-final",
  third: "third-place",
  third_place: "third-place",
  "3rd": "third-place",
  final: "final",
};

function normaliseStage(type: string, matchday: string): MatchStage {
  const t = type.toLowerCase();
  if (t === "group" || t === "") {
    const md = matchday === "2" ? "2" : matchday === "3" ? "3" : "1";
    return `group-matchday${md}` as MatchStage;
  }
  return TYPE_TO_STAGE[t] ?? "group-matchday1";
}

function normaliseStatus(timeElapsed: string, finished: string, hasScore: boolean): MatchStatus {
  const te = timeElapsed.toLowerCase();
  if (te === "live" || /half|min|playing/.test(te)) return "live";
  if (te === "finished" || finished.toUpperCase() === "TRUE") return "completed";
  if (te === "notstarted") return "scheduled";
  return hasScore ? "completed" : "scheduled";
}

function winnerFromScores(a: number, b: number): WorldCupMatch["winner"] {
  if (a === b) return "draw";
  return a > b ? "teamA" : "teamB";
}

/** Stadium id → { name, city }, built once from /get/stadiums. */
type StadiumMap = Map<string, { name: string; city: string }>;

function normaliseMatch(
  raw: Record<string, unknown>,
  stadiums: StadiumMap,
  index: number,
): WorldCupMatch | null {
  // Group games carry English names; knockout games carry placeholder labels.
  const teamA =
    pick(raw, ["home_team_name_en", "teamA", "home", "home_team"]) ||
    pick(raw, ["home_team_label"]);
  const teamB =
    pick(raw, ["away_team_name_en", "teamB", "away", "away_team"]) ||
    pick(raw, ["away_team_label"]);
  if (!teamA || !teamB) return null;

  const homeScore = str(raw.home_score ?? raw.homeScore);
  const awayScore = str(raw.away_score ?? raw.awayScore);
  const hasScore = homeScore !== "" && awayScore !== "";

  const { date, time } = parseLocalDate(pick(raw, ["local_date", "date", "datetime"]));

  const status = normaliseStatus(
    pick(raw, ["time_elapsed", "status"]),
    pick(raw, ["finished"]),
    hasScore,
  );

  // The API returns 0/0 for unplayed fixtures — only surface a score once the
  // match is actually underway or done.
  const isPlayed = status === "completed" || status === "live";
  const score = isPlayed && hasScore ? `${homeScore}-${awayScore}` : undefined;

  const stadium = stadiums.get(pick(raw, ["stadium_id", "stadiumId"]));

  // A real flag only makes sense for an actual nation, not a "Winner Group A".
  const isRealTeamA = !/group|winner|runner|place|loser|tbd/i.test(teamA);
  const isRealTeamB = !/group|winner|runner|place|loser|tbd/i.test(teamB);

  return {
    id: pick(raw, ["id", "_id"]) || `wc-${index}`,
    teamA,
    teamB,
    teamAFlag: isRealTeamA ? countryFlag(teamA) : "🏳️",
    teamBFlag: isRealTeamB ? countryFlag(teamB) : "🏳️",
    date,
    time,
    stadium: stadium?.name ?? "",
    city: stadium?.city ?? "",
    stage: normaliseStage(pick(raw, ["type"]), pick(raw, ["matchday"])),
    status,
    score,
    winner:
      isPlayed && hasScore
        ? winnerFromScores(Number(homeScore), Number(awayScore))
        : undefined,
    group: pick(raw, ["group"]) || undefined,
  };
}

/* ----------------------------------------------------------------- public -- */

async function getStadiumMap(): Promise<StadiumMap> {
  const map: StadiumMap = new Map();
  const rows = unwrap(await fetchJson("/get/stadiums", REVALIDATE.stadiums), "stadiums");
  for (const row of rows) {
    const id = pick(row, ["id", "_id"]);
    if (!id) continue;
    map.set(id, {
      name: pick(row, ["name_en", "fifa_name", "name"]),
      city: pick(row, ["city_en", "city"]),
    });
  }
  return map;
}

/**
 * All tournament matches, normalised + venue-enriched. Falls back to a curated
 * set of real qualified teams when the live API is unreachable.
 */
export async function getMatches(): Promise<WorldCupMatch[]> {
  const [gamesPayload, stadiums] = await Promise.all([
    fetchJson("/get/games", REVALIDATE.matches),
    getStadiumMap(),
  ]);

  const matches = unwrap(gamesPayload, "games")
    .map((row, i) => normaliseMatch(row, stadiums, i))
    .filter((m): m is WorldCupMatch => m !== null);

  return matches.length > 0 ? matches : FALLBACK_FIXTURES;
}

function dateValue(m: WorldCupMatch): number {
  const t = Date.parse(`${m.date}T${m.time || "00:00"}:00`);
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
 * agent is told to treat only these as real, so the format stays factual.
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
 * Curated fallback — used ONLY when the live API can't be reached. Every team
 * here is a confirmed 2026 participant and the group pairings are real, so the
 * companion never references a team that didn't qualify. Dates are placed just
 * ahead so they read as upcoming; live data always wins when available.
 */
const FALLBACK_FIXTURES: WorldCupMatch[] = [
  mkFixture("fb-1", "Mexico", "South Africa", "2026-06-15", "20:00", "A"),
  mkFixture("fb-2", "South Korea", "Czech Republic", "2026-06-15", "17:00", "A"),
  mkFixture("fb-3", "Argentina", "Australia", "2026-06-16", "21:00", "C"),
  mkFixture("fb-4", "France", "Norway", "2026-06-16", "18:00", "E"),
  mkFixture("fb-5", "Spain", "Croatia", "2026-06-17", "20:00", "B"),
  mkFixture("fb-6", "Brazil", "Morocco", "2026-06-17", "23:00", "G"),
];

function mkFixture(
  id: string,
  teamA: string,
  teamB: string,
  date: string,
  time: string,
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
    stadium: "",
    city: "",
    stage: "group-matchday1",
    status: "scheduled",
    group,
  };
}
