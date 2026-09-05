/**
 * Upcoming transits.
 *
 * Pure, deterministic transit forecast engine. Samples actual planetary motion
 * (`astronomy-engine`) from an injectable `at` reference across a fixed
 * horizon, opens a window when a major aspect between a transit body and a
 * natal planet is present for consecutive samples, and reports start / peak /
 * end dates with a plain-English note. No randomness, no fortune-telling —
 * every date is real ephemeris geometry from the chart's own longitudes.
 */
import { angularDifference, computePosition } from "@/lib/astronomy/astro";
import { getCelestialBody, type BodyKey } from "@/lib/astronomy/bodies";
import { NATAL_BODY_KEYS, byKey } from "./planets";
import { houseOf } from "./readings";
import type { NatalBodyKey, NatalChart, NatalPlanet } from "./types";

export type TransitAspectName = "Conjunction" | "Opposition" | "Trine" | "Square" | "Sextile";
export type TransitArea =
  | "identity"
  | "relationships"
  | "inner life"
  | "career"
  | "growth"
  | "energy";

export interface TransitForecast {
  id: string;
  transitBody: BodyKey;
  targetBody: BodyKey;
  aspectName: TransitAspectName;
  start: Date;
  peak: Date;
  end: Date;
  area: TransitArea;
  note: string;
}

export interface TransitOptions {
  /** Horizon length in whole 30-day months (default 6). */
  horizonMonths?: number;
  /** Sampling step in days (default 7). */
  stepDays?: number;
  /** Number of most-significant entries to keep (default 6). */
  maxEntries?: number;
}

/** Major aspect orbs: conjunction/opposition/trine/square 6°, sextile 4°. */
export const ASPECT_ORBS: Record<TransitAspectName, number> = {
  Conjunction: 6,
  Opposition: 6,
  Trine: 6,
  Square: 6,
  Sextile: 4,
};

const ASPECT_ANGLES: { type: TransitAspectName; angle: number }[] = [
  { type: "Conjunction", angle: 0 },
  { type: "Sextile", angle: 60 },
  { type: "Square", angle: 90 },
  { type: "Trine", angle: 120 },
  { type: "Opposition", angle: 180 },
];

const ASPECT_VERB: Record<TransitAspectName, string> = {
  Conjunction: "conjoins",
  Sextile: "sextiles",
  Square: "squares",
  Trine: "trines",
  Opposition: "opposes",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const FAST_BODIES: ReadonlySet<BodyKey> = new Set(["sun", "moon", "mercury", "venus", "mars"]);
const OUTER_BODIES: ReadonlySet<BodyKey> = new Set([
  "jupiter", "saturn", "uranus", "neptune", "pluto",
]);

const AREA_NOTE: Record<TransitArea, string> = {
  identity: "this period tests how you define yourself",
  relationships: "relationship patterns come up for review; clear communication helps",
  "inner life": "the change is quiet and emotional; time with your feelings helps",
  career: "career structures come into focus, making long-term planning worthwhile",
  growth: "opportunities to grow appear; taking the wider view helps",
  energy: "your drive and energy shift; pacing yourself keeps momentum",
};

const TARGET_BASE_AREA: Partial<Record<BodyKey, TransitArea>> = {
  sun: "identity",
  moon: "inner life",
  mercury: "identity",
  venus: "relationships",
  mars: "energy",
  jupiter: "growth",
  saturn: "career",
  uranus: "growth",
  neptune: "inner life",
  pluto: "inner life",
};

const SIGN_INDEX: Record<string, number> = {
  aries: 0, taurus: 1, gemini: 2, cancer: 3, leo: 4, virgo: 5,
  libra: 6, scorpio: 7, sagittarius: 8, capricorn: 9, aquarius: 10, pisces: 11,
};

const DAY_MS = 86400000;

function areaFor(target: NatalPlanet, ascIndex: number): TransitArea {
  const base = TARGET_BASE_AREA[target.key] ?? "identity";
  const house = houseOf(ascIndex, SIGN_INDEX[target.sign] ?? 0);
  return house === 10 ? "career" : base;
}

function significanceOf(transitBody: BodyKey, target: NatalPlanet, ascIndex: number): number {
  let score = 0;
  if (OUTER_BODIES.has(transitBody)) score += 2;
  if (target.key === "sun" || target.key === "moon") score += 1;
  const house = houseOf(ascIndex, SIGN_INDEX[target.sign] ?? 0);
  if (house === 10) score += 1;
  return score;
}

function nearestAspect(separation: number): { type: TransitAspectName; orb: number } | null {
  let best: { type: TransitAspectName; orb: number } | null = null;
  for (const spec of ASPECT_ANGLES) {
    const orb = Math.abs(separation - spec.angle);
    if (orb <= ASPECT_ORBS[spec.type] && (best === null || orb < best.orb)) {
      best = { type: spec.type, orb };
    }
  }
  return best;
}

interface DetectedSample {
  date: Date;
  orb: number;
  aspect: TransitAspectName;
}

export function upcomingTransits(
  chart: NatalChart,
  at: Date = new Date(),
  opts: TransitOptions = {},
): TransitForecast[] {
  const horizonMonths = opts.horizonMonths ?? 6;
  const stepDays = opts.stepDays ?? 7;
  const maxEntries = opts.maxEntries ?? 6;

  const natal = byKey(chart.planets);
  const targets: NatalPlanet[] = NATAL_BODY_KEYS.map((key) => natal.get(key)).filter(
    (planet): planet is NatalPlanet => Boolean(planet),
  );
  const ascIndex = SIGN_INDEX[chart.houses.ascendant] ?? 0;

  const stepMs = stepDays * DAY_MS;
  const horizonMs = horizonMonths * 30 * DAY_MS;
  const horizonEnd = at.getTime() + horizonMs;

  const sampleDates: Date[] = [];
  let cursor = at.getTime();
  let guard = 0;
  while (cursor <= horizonEnd + 1 && guard < 10000) {
    sampleDates.push(new Date(cursor));
    cursor += stepMs;
    guard++;
  }

  // Precompute one transit longitude per body per sample (pure arithmetic after).
  const transitLons = new Map<BodyKey, Map<number, number>>();
  for (const body of NATAL_BODY_KEYS) {
    const perSample = new Map<number, number>();
    for (const sample of sampleDates) {
      const pos = computePosition(body, sample);
      if (pos) perSample.set(sample.getTime(), pos.longitude);
    }
    transitLons.set(body, perSample);
  }

  const windows: TransitForecast[] = [];

  for (const transitBody of NATAL_BODY_KEYS) {
    const lons = transitLons.get(transitBody) ?? new Map<number, number>();
    const transitIsFast = FAST_BODIES.has(transitBody);

    for (const target of targets) {
      if (transitBody === target.key) continue;

      const present: DetectedSample[] = [];
      for (const sample of sampleDates) {
        const transitLon = lons.get(sample.getTime());
        if (transitLon === undefined) continue;
        const separation = Math.abs(angularDifference(transitLon, target.longitude));
        const aspect = nearestAspect(separation);
        if (aspect) present.push({ date: sample, orb: aspect.orb, aspect: aspect.type });
      }

      let run: DetectedSample[] = [];
      for (let i = 0; i <= present.length; i++) {
        const item: DetectedSample | null = present[i] ?? null;
        const prev: DetectedSample | null = run.length ? run[run.length - 1] : null;
        const contiguous =
          item !== null &&
          prev !== null &&
          item.aspect === prev.aspect &&
          item.date.getTime() - prev.date.getTime() <= stepMs * 1.5;

        if (item && (run.length === 0 || contiguous)) {
          run.push(item);
          continue;
        }

        if (run.length >= 2) {
          const spanMs = run[run.length - 1].date.getTime() - run[0].date.getTime();
          if (!transitIsFast || spanMs >= 2 * DAY_MS) {
            let peak = run[0];
            for (const sample of run) {
              if (sample.orb < peak.orb) peak = sample;
            }
            if (peak.date.getTime() <= horizonEnd) {
              const start = run[0].date;
              const last = run[run.length - 1].date;
              const end = new Date(last.getTime() + stepMs);
              windows.push(buildForecast(chart, transitBody, target, peak.aspect, start, peak.date, end, ascIndex));
            }
          }
        }
        run = item ? [item] : [];
      }
    }
  }

  windows.sort((a, b) => {
    const aScore = significanceOf(a.transitBody, natal.get(a.targetBody as NatalBodyKey) ?? targets[0], ascIndex);
    const bScore = significanceOf(b.transitBody, natal.get(b.targetBody as NatalBodyKey) ?? targets[0], ascIndex);
    if (bScore !== aScore) return bScore - aScore;
    return a.peak.getTime() - b.peak.getTime();
  });

  const chosen = windows.slice(0, maxEntries);
  chosen.sort((a, b) => a.peak.getTime() - b.peak.getTime());
  return chosen;
}

function buildForecast(
  chart: NatalChart,
  transitBody: BodyKey,
  target: NatalPlanet,
  aspectName: TransitAspectName,
  start: Date,
  peak: Date,
  end: Date,
  ascIndex: number,
): TransitForecast {
  const transitName = getCelestialBody(transitBody).name;
  const targetName = getCelestialBody(target.key).name;
  const area = areaFor(target, ascIndex);
  const note = `${transitName} ${ASPECT_VERB[aspectName]} your ${targetName} from ${MONTH_NAMES[start.getUTCMonth()]} to ${MONTH_NAMES[end.getUTCMonth()]} — ${AREA_NOTE[area]}.`;
  return {
    id: `transit:${transitBody}-${target.key}-${aspectName.toLowerCase()}-${peak.getTime()}`,
    transitBody,
    targetBody: target.key,
    aspectName,
    start,
    peak,
    end,
    area,
    note,
  };
}