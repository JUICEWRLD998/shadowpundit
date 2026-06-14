/**
 * Country → emoji flag lookup for the 2026 World Cup nations.
 *
 * The WorldCup26.ir API returns English team names (`home_team_name_en`), not
 * flags, so we resolve one ourselves. Emoji flags render everywhere, need no
 * network, and keep the UI dependency-free.
 *
 * Lookups are forgiving: we normalise case/whitespace and accept many common
 * aliases ("USA" → United States, "Korea Republic" → South Korea, "Czechia" →
 * Czech Republic, etc.). Unknown teams fall back to a neutral 🏳️ so the UI
 * never shows a broken glyph. The map intentionally covers far more than 48
 * nations so qualifiers, hosts, and late playoff entrants all resolve.
 */

/** Canonical name → flag emoji. */
const FLAG_BY_NAME: Record<string, string> = {
  // Hosts
  "united states": "🇺🇸",
  canada: "🇨🇦",
  mexico: "🇲🇽",
  // CONMEBOL
  argentina: "🇦🇷",
  brazil: "🇧🇷",
  uruguay: "🇺🇾",
  colombia: "🇨🇴",
  ecuador: "🇪🇨",
  paraguay: "🇵🇾",
  peru: "🇵🇪",
  chile: "🇨🇱",
  bolivia: "🇧🇴",
  venezuela: "🇻🇪",
  // UEFA
  france: "🇫🇷",
  england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  spain: "🇪🇸",
  portugal: "🇵🇹",
  netherlands: "🇳🇱",
  belgium: "🇧🇪",
  germany: "🇩🇪",
  italy: "🇮🇹",
  croatia: "🇭🇷",
  switzerland: "🇨🇭",
  austria: "🇦🇹",
  denmark: "🇩🇰",
  norway: "🇳🇴",
  sweden: "🇸🇪",
  poland: "🇵🇱",
  "czech republic": "🇨🇿",
  serbia: "🇷🇸",
  scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  ukraine: "🇺🇦",
  turkey: "🇹🇷",
  greece: "🇬🇷",
  hungary: "🇭🇺",
  romania: "🇷🇴",
  slovakia: "🇸🇰",
  slovenia: "🇸🇮",
  "republic of ireland": "🇮🇪",
  ireland: "🇮🇪",
  iceland: "🇮🇸",
  albania: "🇦🇱",
  // CAF
  morocco: "🇲🇦",
  senegal: "🇸🇳",
  tunisia: "🇹🇳",
  algeria: "🇩🇿",
  egypt: "🇪🇬",
  "ivory coast": "🇨🇮",
  ghana: "🇬🇭",
  cameroon: "🇨🇲",
  nigeria: "🇳🇬",
  "south africa": "🇿🇦",
  "cape verde": "🇨🇻",
  "dr congo": "🇨🇩",
  mali: "🇲🇱",
  "burkina faso": "🇧🇫",
  angola: "🇦🇴",
  // AFC
  japan: "🇯🇵",
  "south korea": "🇰🇷",
  iran: "🇮🇷",
  "saudi arabia": "🇸🇦",
  australia: "🇦🇺",
  qatar: "🇶🇦",
  uzbekistan: "🇺🇿",
  jordan: "🇯🇴",
  iraq: "🇮🇶",
  "united arab emirates": "🇦🇪",
  // OFC
  "new zealand": "🇳🇿",
  // CONCACAF
  "costa rica": "🇨🇷",
  panama: "🇵🇦",
  honduras: "🇭🇳",
  jamaica: "🇯🇲",
  "el salvador": "🇸🇻",
  curacao: "🇨🇼",
  haiti: "🇭🇹",
  guatemala: "🇬🇹",
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
  "south korea republic": "south korea",
  "korea dpr": "south korea",
  holland: "netherlands",
  "ir iran": "iran",
  "islamic republic of iran": "iran",
  czechia: "czech republic",
  "czech rep": "czech republic",
  türkiye: "turkey",
  turkiye: "turkey",
  "côte d'ivoire": "ivory coast",
  "cote d'ivoire": "ivory coast",
  "cote divoire": "ivory coast",
  "cabo verde": "cape verde",
  "dr congo (drc)": "dr congo",
  "democratic republic of the congo": "dr congo",
  "republic of ireland (eire)": "ireland",
  uae: "united arab emirates",
  "saudi": "saudi arabia",
};

const FALLBACK_FLAG = "🏳️";

function normalise(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD") // split accented chars …
    .replace(/[̀-ͯ]/g, "") // … and drop the diacritic marks (ç→c, ü→u)
    .replace(/\s+/g, " ");
}

/** Resolve a team name to an emoji flag. Never throws; returns 🏳️ if unknown. */
export function countryFlag(name: string | undefined | null): string {
  if (!name) return FALLBACK_FLAG;
  const key = normalise(name);
  const canonical = ALIASES[key] ?? key;
  return FLAG_BY_NAME[canonical] ?? FALLBACK_FLAG;
}
