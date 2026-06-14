/**
 * Country → emoji flag lookup for the 2026 World Cup nations.
 *
 * The WorldCup26.ir API returns team names (and sometimes FIFA codes) but not
 * always a flag, so we resolve one ourselves. Emoji flags render everywhere,
 * need no network, and keep the UI dependency-free.
 *
 * Lookups are forgiving: we normalise case/whitespace and accept a handful of
 * common aliases ("USA" → United States, "Korea" → South Korea, etc.). Unknown
 * teams fall back to a neutral 🏳️ so the UI never shows a broken glyph.
 */

/** Canonical name → flag emoji. Covers qualified + likely 2026 participants. */
const FLAG_BY_NAME: Record<string, string> = {
  argentina: "🇦🇷",
  australia: "🇦🇺",
  austria: "🇦🇹",
  belgium: "🇧🇪",
  brazil: "🇧🇷",
  cameroon: "🇨🇲",
  canada: "🇨🇦",
  colombia: "🇨🇴",
  croatia: "🇭🇷",
  denmark: "🇩🇰",
  ecuador: "🇪🇨",
  egypt: "🇪🇬",
  england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  france: "🇫🇷",
  germany: "🇩🇪",
  ghana: "🇬🇭",
  iran: "🇮🇷",
  italy: "🇮🇹",
  japan: "🇯🇵",
  mexico: "🇲🇽",
  morocco: "🇲🇦",
  netherlands: "🇳🇱",
  nigeria: "🇳🇬",
  norway: "🇳🇴",
  panama: "🇵🇦",
  paraguay: "🇵🇾",
  peru: "🇵🇪",
  poland: "🇵🇱",
  portugal: "🇵🇹",
  qatar: "🇶🇦",
  scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  senegal: "🇸🇳",
  serbia: "🇷🇸",
  "south korea": "🇰🇷",
  spain: "🇪🇸",
  sweden: "🇸🇪",
  switzerland: "🇨🇭",
  tunisia: "🇹🇳",
  "united states": "🇺🇸",
  uruguay: "🇺🇾",
  wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
};

/** Aliases the data source might use → canonical key in FLAG_BY_NAME. */
const ALIASES: Record<string, string> = {
  usa: "united states",
  "u.s.a.": "united states",
  us: "united states",
  "united states of america": "united states",
  america: "united states",
  korea: "south korea",
  "korea republic": "south korea",
  "republic of korea": "south korea",
  holland: "netherlands",
  "ir iran": "iran",
  "islamic republic of iran": "iran",
};

const FALLBACK_FLAG = "🏳️";

function normalise(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Resolve a team name to an emoji flag. Never throws; returns 🏳️ if unknown. */
export function countryFlag(name: string | undefined | null): string {
  if (!name) return FALLBACK_FLAG;
  const key = normalise(name);
  const canonical = ALIASES[key] ?? key;
  return FLAG_BY_NAME[canonical] ?? FALLBACK_FLAG;
}
