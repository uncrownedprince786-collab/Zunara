import * as AE from "astronomy-engine";
import type { SkyEvent } from "./sky-events-data";
import { ANNUAL_SHOWER_PEAKS } from "./sky-events-data";

/** How far ahead (in days) the dynamic calendar is computed. */
export const SKY_CALC_HORIZON_DAYS = 75;

/** Cap on the number of principal lunar phases generated per run. */
export const SKY_CALC_MAX_QUARTERS = 8;

const NASA_MOON_URL = "https://science.nasa.gov/moon/moon-phases/";
const NASA_SKY_URL = "https://www.nasa.gov/skywatching/";

/** Localized keys for the four principal lunar phases (see `phases.*`). */
const QUARTER_INFO: Array<{ titleKey: string; descKey: string }> = [
  { titleKey: "phases.newMoon", descKey: "phaseHints.newMoon" },
  { titleKey: "phases.firstQuarter", descKey: "phaseHints.firstQuarter" },
  { titleKey: "phases.fullMoon", descKey: "phaseHints.fullMoon" },
  { titleKey: "phases.lastQuarter", descKey: "phaseHints.lastQuarter" },
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
        category: "seasonal",
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
 * Stable identity token for seasonal events (equinoxes/solstices).
 *
 * These recur yearly and legitimately land on different dates depending on the
 * source — a live feed's UTC day can differ by a day from the exact computed
 * crossing moment or the curated calendar — so they are deduplicated by season
 * instead of by `date|category`, which would otherwise show the equinox twice
 * on two nearly identical dates.
 */
export function seasonKeyOf(e: SkyEvent): string | null {
  if (!/^\d{4}-\d{2}/.test(e.start || "")) return null;
  const title = (e.title ?? "").toLowerCase();
  const isEquinox = /equinox/.test(title);
  const isSolstice = /solstice/.test(title);
  if (!isEquinox && !isSolstice) return null;
  const year = e.start.slice(0, 4);
  const month = Number(e.start.slice(5, 7));
  let season: string;
  if (month >= 3 && month <= 4) season = "spring";
  else if (month >= 5 && month <= 7) season = "summer";
  else if (month >= 8 && month <= 10) season = "autumn";
  else season = "winter";
  return `season|${year}|${season}|${isEquinox ? "equinox" : "solstice"}`;
}

/**
 * Merge several event sources with first-wins deduplication, keyed by
 * `date + category`. Passing sources highest-priority first keeps live feed
 * entries, then the named full-year baseline, and finally the generic computed
 * phases — so a "Full Moon · Harvest Moon" entry wins over a plain "Full Moon"
 * on the same night. Seasonal events are deduplicated by season regardless of
 * small (1-day) date disagreements between sources.
 */
export function mergeSkyEventSources(...sources: SkyEvent[][]): SkyEvent[] {
  const seen = new Set<string>();
  const seenSeason = new Set<string>();
  const key = (e: SkyEvent) => `${e.start.slice(0, 10)}|${e.category ?? ""}`;
  const out: SkyEvent[] = [];
  for (const source of sources) {
    for (const e of source) {
      const season = seasonKeyOf(e);
      if (season) {
        if (seenSeason.has(season)) continue;
        seenSeason.add(season);
      } else {
        const k = key(e);
        if (seen.has(k)) continue;
        seen.add(k);
      }
      out.push(e);
    }
  }
  return out;
}

const CONJUNCTION_BODIES: Array<{ body: AE.Body; slug: string }> = [
  { body: AE.Body.Mercury, slug: "mercury" },
  { body: AE.Body.Venus, slug: "venus" },
  { body: AE.Body.Mars, slug: "mars" },
  { body: AE.Body.Jupiter, slug: "jupiter" },
  { body: AE.Body.Saturn, slug: "saturn" },
];

function normalizeAngle(a: number): number {
  return ((a % 360) + 360) % 360;
}

function bisectConjunction(
  bodyA: AE.Body,
  bodyB: AE.Body,
  t0: Date,
  t1: Date,
): Date {
  let lo = t0.getTime();
  let hi = t1.getTime();
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const dMid = new Date(mid);
    const angle = normalizeAngle(AE.PairLongitude(bodyA, bodyB, dMid));
    const dLo = normalizeAngle(AE.PairLongitude(bodyA, bodyB, new Date(lo)));
    const diffLo = Math.min(dLo, 360 - dLo);
    const diffMid = Math.min(angle, 360 - angle);
    if (diffMid <= diffLo) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return new Date((lo + hi) / 2);
}

function findConjunctionsInYear(
  bodyA: AE.Body,
  bodyB: AE.Body,
  yearStart: Date,
  yearEndTs: number,
): Date[] {
  const results: Date[] = [];
  const stepMs = 10 * 86400000;
  let prevAngle = normalizeAngle(AE.PairLongitude(bodyA, bodyB, yearStart));
  let prevTs = yearStart.getTime();
  let guard = 0;
  while (prevTs < yearEndTs && guard < 80) {
    guard++;
    const nextTs = Math.min(prevTs + stepMs, yearEndTs);
    const nextAngle = normalizeAngle(AE.PairLongitude(bodyA, bodyB, new Date(nextTs)));
    const diff = Math.abs(nextAngle - prevAngle);
    const crossDist = Math.min(diff, 360 - diff);
    if (crossDist < 30) {
      const exact = bisectConjunction(bodyA, bodyB, new Date(prevTs), new Date(nextTs));
      if (exact.getTime() >= yearStart.getTime() && exact.getTime() <= yearEndTs) {
        results.push(exact);
      }
      prevTs = exact.getTime() + 15 * 86400000;
      prevAngle = normalizeAngle(AE.PairLongitude(bodyA, bodyB, new Date(prevTs)));
    } else {
      prevTs = nextTs;
      prevAngle = nextAngle;
    }
  }
  return results;
}

export function calculateSkyEventsForYear(year: number): SkyEvent[] {
  const events: SkyEvent[] = [];
  const yearStart = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
  const yearEndTs = Date.UTC(year, 11, 31, 23, 59, 59);

  for (const season of SEASONAL_POINTS) {
    const t = AE.SearchSunLongitude(season.lon, yearStart, 366);
    if (!t) continue;
    const at = new Date(t.date);
    const ts = at.getTime();
    if (ts >= yearStart.getTime() && ts <= yearEndTs) {
      events.push({
        title: season.key,
        start: at.toISOString(),
        description: season.key,
        url: NASA_SKY_URL,
        category: "seasonal",
        titleKey: `skyEvents.events.${season.key}.title`,
        descKey: `skyEvents.events.${season.key}.desc`,
        regionKey: "skyEvents.regions.global",
        viewTipKey: "skyEvents.tips.seasonal",
      });
    }
  }

  let quarter: AE.MoonQuarter | null = AE.SearchMoonQuarter(yearStart);
  let guard = 0;
  while (quarter && guard < 128) {
    guard++;
    const at = new Date(quarter.time.date);
    if (at.getTime() > yearEndTs) break;
    if (at.getTime() >= yearStart.getTime()) {
      const info = QUARTER_INFO[((quarter.quarter % 4) + 4) % 4];
      events.push({
        title: info.titleKey,
        start: at.toISOString(),
        description: info.descKey,
        url: NASA_MOON_URL,
        category: "moon-phases",
        titleKey: info.titleKey,
        descKey: info.descKey,
        regionKey: "skyEvents.regions.global",
        viewTipKey: "skyEvents.tips.moonPhase",
      });
    }
    quarter = AE.NextMoonQuarter(quarter);
  }

  for (const peak of ANNUAL_SHOWER_PEAKS) {
    const start = `${year}-${String(peak.month).padStart(2, "0")}-${String(peak.day).padStart(2, "0")}`;
    events.push({
      title: peak.slug,
      start,
      description: peak.slug,
      url: NASA_SKY_URL,
      category: "meteor-showers",
      titleKey: `skyEvents.events.${peak.slug}.title`,
      descKey: `skyEvents.events.${peak.slug}.desc`,
      regionKey: `skyEvents.regions.${peak.region}`,
      viewTipKey: "skyEvents.tips.meteorShower",
    });
  }

  for (let i = 0; i < CONJUNCTION_BODIES.length; i++) {
    for (let j = i + 1; j < CONJUNCTION_BODIES.length; j++) {
      const a = CONJUNCTION_BODIES[i];
      const b = CONJUNCTION_BODIES[j];
      const dates = findConjunctionsInYear(a.body, b.body, yearStart, yearEndTs);
      for (const at of dates) {
        events.push({
          title: `${a.slug}|${b.slug}`,
          bodyA: a.slug,
          bodyB: b.slug,
          start: at.toISOString(),
          description: "",
          category: "conjunctions",
          descKey: "skyEvents.conjunctionsDesc",
          url: NASA_SKY_URL,
          regionKey: "skyEvents.regions.global",
          viewTipKey: "skyEvents.tips.conjunction",
        });
      }
    }
  }

  return events.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
}