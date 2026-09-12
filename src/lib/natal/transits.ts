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
export type TransitPhase = "applying" | "exact" | "separating";

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
  /** Orb (degrees from exact) at the sampled peak. Lower = tighter. */
  orb: number;
  /** Natal house holding the natal target body (the "affected" area). */
  targetHouse: number;
  /** Whether the aspect is inbound (applying), exact, or releasing. */
  phase: TransitPhase;
  /** Deterministic 0–100 intensity based on aspect, closeness and weight. */
  strength: number;
  /** Layer-2 "why": the classic character of the aspect itself. */
  meaning: string;
}

export interface TransitOptions {
  /** Horizon length in whole 30-day months (default 6). */
  horizonMonths?: number;
  /** Days to look back when scanning for transits active at `at` (default 60). */
  lookbackDays?: number;
  /** Days to look ahead when scanning for transits active at `at` (default 140). */
  lookaheadDays?: number;
  /** Sampling step in days (default 7, 4 for the active-window scan). */
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

const ASPECT_BASE_STRENGTH: Record<TransitAspectName, number> = {
  Conjunction: 100,
  Opposition: 90,
  Trine: 85,
  Square: 80,
  Sextile: 70,
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

/** Layer-2 astrology: the classic character of each major aspect. */
const ASPECT_MEANING: Record<TransitAspectName, string> = {
  Conjunction:
    "A conjunction fuses two energies, pulling them into a single, concentrated theme while the planets travel together.",
  Sextile:
    "A sextile is a friendly angle — the two energies cooperate naturally and tend to open doors when the opportunity is acted on.",
  Square:
    "A square creates productive friction, pushing something that has been neglected into the open where it has to be dealt with.",
  Trine:
    "A trine flows easily, letting the two energies support each other without strain — often felt as a favouring current.",
  Opposition:
    "An opposition holds two energies in dialogue — balance comes from honouring both sides, not forcing one to win.",
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

interface DetectedWindow {
  transitBody: BodyKey;
  target: NatalPlanet;
  aspectName: TransitAspectName;
  start: Date;
  peak: Date;
  end: Date;
  orb: number;
}

/**
 * Scan the sample grid in [from, to] and return every detected aspect window
 * (a run of ≥2 in-orb samples, fast bodies excepted), each with its tightest
 * sample as the peak. Deterministic. Shared by the forward forecast and the
 * "active today" scan so all consumers agree on the geometry.
 */
function scanWindows(
  chart: NatalChart,
  from: Date,
  to: Date,
  stepDays: number,
): DetectedWindow[] {
  const natal = byKey(chart.planets);
  const targets: NatalPlanet[] = NATAL_BODY_KEYS.map((key) => natal.get(key)).filter(
    (planet): planet is NatalPlanet => Boolean(planet),
  );

  const stepMs = stepDays * DAY_MS;

  const sampleDates: Date[] = [];
  let cursor = from.getTime();
  let guard = 0;
  while (cursor <= to.getTime() + 1 && guard < 12000) {
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

  const windows: DetectedWindow[] = [];

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
            const start = run[0].date;
            const last = run[run.length - 1].date;
            const end = new Date(last.getTime() + stepMs);
            windows.push({
              transitBody,
              target,
              aspectName: peak.aspect,
              start,
              peak: peak.date,
              end,
              orb: peak.orb,
            });
          }
        }
        run = item ? [item] : [];
      }
    }
  }

  return windows;
}

function strengthOf(
  aspectName: TransitAspectName,
  orb: number,
  transitBody: BodyKey,
  target: NatalPlanet,
  house: number,
): number {
  const base = ASPECT_BASE_STRENGTH[aspectName] ?? 70;
  const maxOrb = ASPECT_ORBS[aspectName];
  const closeness = 1 - Math.min(1, orb / maxOrb);
  let s = base * (0.7 + 0.3 * closeness);
  if (OUTER_BODIES.has(transitBody)) s += 6;
  if (target.key === "sun" || target.key === "moon") s += 4;
  if (house === 10) s += 3;
  return Math.max(0, Math.min(100, Math.round(s)));
}

function phaseOf(peak: Date, at: Date): TransitPhase {
  const diff = at.getTime() - peak.getTime();
  if (Math.abs(diff) <= DAY_MS) return "exact";
  return diff < 0 ? "applying" : "separating";
}

function formatForecast(
  chart: NatalChart,
  w: DetectedWindow,
  ascIndex: number,
  at: Date,
): TransitForecast {
  const transitName = getCelestialBody(w.transitBody).name;
  const targetName = getCelestialBody(w.target.key).name;
  const area = areaFor(w.target, ascIndex);
  const house = houseOf(ascIndex, SIGN_INDEX[w.target.sign] ?? 0);
  const note = `${transitName} ${ASPECT_VERB[w.aspectName]} your ${targetName} from ${MONTH_NAMES[w.start.getUTCMonth()]} to ${MONTH_NAMES[w.end.getUTCMonth()]} — ${AREA_NOTE[area]}.`;
  return {
    id: `transit:${w.transitBody}-${w.target.key}-${w.aspectName.toLowerCase()}-${w.peak.getTime()}`,
    transitBody: w.transitBody,
    targetBody: w.target.key,
    aspectName: w.aspectName,
    start: w.start,
    peak: w.peak,
    end: w.end,
    area,
    orb: w.orb,
    targetHouse: house,
    phase: phaseOf(w.peak, at),
    strength: strengthOf(w.aspectName, w.orb, w.transitBody, w.target, house),
    meaning: ASPECT_MEANING[w.aspectName],
    note,
  };
}

/**
 * Forward-looking transits from `at`: the most significant windows whose peak
 * falls inside the horizon, sorted so the big, close ones surface first.
 */
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

  const horizonMs = horizonMonths * 30 * DAY_MS;
  const horizonEnd = at.getTime() + horizonMs;

  const windows = scanWindows(chart, at, new Date(horizonEnd), stepDays).filter(
    (w) => w.peak.getTime() <= horizonEnd,
  );

  const formatted = windows.map((w) => formatForecast(chart, w, ascIndex, at));

  formatted.sort((a, b) => {
    const aScore = significanceOf(
      a.transitBody,
      natal.get(a.targetBody as NatalBodyKey) ?? targets[0],
      ascIndex,
    );
    const bScore = significanceOf(
      b.transitBody,
      natal.get(b.targetBody as NatalBodyKey) ?? targets[0],
      ascIndex,
    );
    if (bScore !== aScore) return bScore - aScore;
    return a.peak.getTime() - b.peak.getTime();
  });

  const chosen = formatted.slice(0, maxEntries);
  chosen.sort((a, b) => a.peak.getTime() - b.peak.getTime());
  return chosen;
}

/**
 * Transits active at `at` itself — windows whose span includes the reference
 * date. This is the "what is touching my chart right now" view, ranked by
 * strength so the most intense active influence leads.
 */
export function activeTransits(
  chart: NatalChart,
  at: Date = new Date(),
  opts: TransitOptions = {},
): TransitForecast[] {
  const lookbackDays = opts.lookbackDays ?? 60;
  const lookaheadDays = opts.lookaheadDays ?? 140;
  const stepDays = opts.stepDays ?? 4;
  const maxEntries = opts.maxEntries ?? 6;

  const ascIndex = SIGN_INDEX[chart.houses.ascendant] ?? 0;

  const from = new Date(at.getTime() - lookbackDays * DAY_MS);
  const to = new Date(at.getTime() + lookaheadDays * DAY_MS);

  const active = scanWindows(chart, from, to, stepDays)
    .filter((w) => w.start.getTime() <= at.getTime() && at.getTime() <= w.end.getTime())
    .map((w) => formatForecast(chart, w, ascIndex, at));

  active.sort((a, b) => b.strength - a.strength || a.peak.getTime() - b.peak.getTime());
  return active.slice(0, maxEntries);
}