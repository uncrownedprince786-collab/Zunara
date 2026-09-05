import * as AE from "astronomy-engine";
import type { SkyEvent } from "./sky-events-data";

/** How far ahead (in days) the dynamic calendar is computed. */
export const SKY_CALC_HORIZON_DAYS = 75;

/** Cap on the number of principal lunar phases generated per run. */
export const SKY_CALC_MAX_QUARTERS = 8;

const NASA_MOON_URL = "https://science.nasa.gov/moon/moon-phases/";
const NASA_SKY_URL = "https://www.nasa.gov/skywatching/";

/** Localized keys for the four principal lunar phases (see `phases.*`). */
const QUARTER_INFO: Array<{ titleKey: string; descKey: string }> = [
  { titleKey: "phases.newMoon", descKey: "phases.phaseHints.newMoon" },
  { titleKey: "phases.firstQuarter", descKey: "phases.phaseHints.firstQuarter" },
  { titleKey: "phases.fullMoon", descKey: "phases.phaseHints.fullMoon" },
  { titleKey: "phases.lastQuarter", descKey: "phases.phaseHints.lastQuarter" },
];

/** Seasonal points as target Sun ecliptic longitudes → localized event keys. */
const SEASONAL_POINTS: Array<{ lon: number; key: string }> = [
  { lon: 0, key: "vernalEquinox" },
  { lon: 90, key: "summerSolstice" },
  { lon: 180, key: "autumnalEquinox" },
  { lon: 270, key: "winterSolstice" },
];

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Dynamic celestial-events calendar computed from first principles.
 *
 * Uses astronomy-engine's `SearchMoonQuarter` / `NextMoonQuarter` for the four
 * principal lunar phases and `SearchSunLongitude` for the equinoxes and
 * solstices within a rolling horizon ahead of `now`. The result is always in
 * sync with the current date — nothing to refresh on an annual cadence.
 */
export function calculateSkyEvents(
  now: Date,
  horizonDays: number = SKY_CALC_HORIZON_DAYS,
  maxQuarters: number = SKY_CALC_MAX_QUARTERS,
): SkyEvent[] {
  const events: SkyEvent[] = [];
  const startTs = now.getTime();
  const horizonMs = startTs + horizonDays * 86400000;

  // Principal lunar phases within the horizon.
  let quarter: AE.MoonQuarter | null = AE.SearchMoonQuarter(now);
  let count = 0;
  let guard = 0;
  while (quarter && count < maxQuarters && guard < 64) {
    guard++;
    const at = new Date(quarter.time.date);
    const ts = at.getTime();
    if (ts > horizonMs) break;
    if (ts >= startTs) {
      const info = QUARTER_INFO[((quarter.quarter % 4) + 4) % 4];
      events.push({
        title: info.titleKey,
        start: isoDay(at),
        description: info.descKey,
        url: NASA_MOON_URL,
        category: "moon-phases",
        titleKey: info.titleKey,
        descKey: info.descKey,
      });
      count++;
    }
    quarter = AE.NextMoonQuarter(quarter);
  }

  // Seasonal points within the horizon.
  for (const season of SEASONAL_POINTS) {
    const t = AE.SearchSunLongitude(season.lon, now, horizonDays);
    if (!t) continue;
    const at = new Date(t.date);
    const ts = at.getTime();
    if (ts >= startTs - 12 * 3600000 && ts <= horizonMs) {
      const key = season.key;
      events.push({
        title: key,
        start: isoDay(at),
        description: key,
        url: NASA_SKY_URL,
        category: "eclipses",
        titleKey: `skyEvents.events.${key}.title`,
        descKey: `skyEvents.events.${key}.desc`,
      });
    }
  }

  return events.sort(
    (a, b) =>
      new Date(`${a.start}T00:00:00Z`).getTime() -
      new Date(`${b.start}T00:00:00Z`).getTime(),
  );
}

/**
 * Merge several event sources with first-wins deduplication, keyed by
 * `date + category`. Passing sources highest-priority first keeps live feed
 * entries, then the named full-year baseline, and finally the generic computed
 * phases — so a "Full Moon · Harvest Moon" entry wins over a plain "Full Moon"
 * on the same night.
 */
export function mergeSkyEventSources(...sources: SkyEvent[][]): SkyEvent[] {
  const seen = new Set<string>();
  const key = (e: SkyEvent) => `${e.start.slice(0, 10)}|${e.category ?? ""}`;
  const out: SkyEvent[] = [];
  for (const source of sources) {
    for (const e of source) {
      const k = key(e);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(e);
    }
  }
  return out;
}