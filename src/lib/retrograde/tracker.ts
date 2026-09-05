/**
 * Retrograde tracker + live sky statistics.
 *
 * For each planet, a daily grid of apparent-motion samples (via
 * `computePosition(...).retrograde`) is scanned to locate contiguous retrograde
 * windows around a reference instant. The day-level boundary of each window is
 * then refined to hour-level resolution using 6-hour samples at the station
 * days, keeping the total number of astronomy-engine calls modest.
 */

import { computePosition } from "@/lib/astronomy/astro";
import type { BodyKey } from "@/lib/astronomy/bodies";

/** Planets whose cycles we track (Sun/Moon never retrograde; nodes excluded). */
export const TRACKED_PLANETS: Exclude<BodyKey, "sun" | "moon" | "northNode" | "southNode">[] = [
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

export interface RetroStartEnd {
  start: Date;
  end: Date;
}

export interface RetrogradeStatus {
  planet: BodyKey;
  currentlyRetrograde: boolean;
  current: RetroStartEnd | null;
  next: RetroStartEnd | null;
  lastStarted: Date | null;
}

export interface GridOptions {
  /** Days of history + future scanned (default 180). */
  horizonDays?: number;
}

interface Window {
  start: Date;
  end: Date;
}

const DAY_MS = 86400000;

function startOfUtcDay(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Plain-English, hype-free behavioural guidance per retrograde planet. */
export const RETRO_ADVICE: Record<BodyKey, string> = {
  mercury: "Recheck details, delay signing big contracts, back up files, and avoid committing to major decisions on first read.",
  venus: "Revisit relationships and finances with patience; postpone big purchases or relationship ultimatums until the retrograde lifts.",
  mars: "Channel energy into preparation and repair rather than confrontation; delay starting wars, not projects, that can wait.",
  jupiter: "Review beliefs and plans for growth rather than expanding blindly; delay major investment or travel commitments.",
  saturn: "Re-examine long-term responsibilities and boundaries; slow, careful building beats rushing through structural changes.",
  uranus: "Expect surprises in routines and resist forcing sudden change; prototype ideas rather than committing permanently.",
  neptune: "Clarify contracts and promises, and avoid trusting vague assurances; anchor plans in written detail.",
  pluto: "Surface and release what no longer serves you; use the period for deep internal restructuring, not cosmetic fixes.",
  sun: "There are no Sun retrograde cycles to track.",
  moon: "There are no Moon retrograde cycles to track.",
  northNode: "There are no North Node retrograde cycles to track.",
  southNode: "There are no South Node retrograde cycles to track.",
};

/** Per-planet strength tag used for the tracker table. */
export const RETRO_STRENGTH: Record<BodyKey, "mild" | "moderate" | "intense"> = {
  mercury: "mild",
  venus: "moderate",
  mars: "moderate",
  jupiter: "moderate",
  saturn: "moderate",
  uranus: "intense",
  neptune: "intense",
  pluto: "intense",
  sun: "mild",
  moon: "mild",
  northNode: "mild",
  southNode: "mild",
};

function refineStation(
  planet: BodyKey,
  dayStart: number,
  retroOnDay: boolean,
): Date {
  // `dayStart` is the first day carrying the new state. The exact station falls
  // somewhere within that 24-hour window; sample every 6 hours so the returned
  // instant has hour-level precision without an excessive number of calls.
  for (let t = dayStart; t <= dayStart + DAY_MS; t += 6 * 3600000) {
    const pos = computePosition(planet, new Date(t));
    const state = pos ? pos.retrograde : false;
    if (state === retroOnDay) {
      return new Date(t);
    }
  }
  return new Date(dayStart);
}

/** Sample retrograde status across a daily grid and return ordered windows. */
function scanWindows(planet: BodyKey, at: Date, horizonDays: number): Window[] {
  const center = startOfUtcDay(at);
  const flags = new Map<number, boolean>();
  const days: number[] = [];
  for (let i = -horizonDays; i <= horizonDays; i++) {
    const day = center + i * DAY_MS;
    const pos = computePosition(planet, new Date(day));
    flags.set(day, pos ? pos.retrograde : false);
    days.push(day);
  }

  const windows: Window[] = [];
  let open: number | null = null;
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const retro = flags.get(day) ?? false;
    if (retro) {
      if (open === null) open = day;
    } else {
      if (open !== null) {
        windows.push({
          start: refineStation(planet, open, true),
          end: refineStation(planet, day, false),
        });
        open = null;
      }
    }
  }
  if (open !== null) {
    windows.push({
      start: refineStation(planet, open, true),
      end: refineStation(planet, days[days.length - 1] + DAY_MS, false),
    });
  }
  return windows;
}

/**
 * Retrograde status for a single planet around `at`.
 */
export function retrogradeStatus(
  planet: BodyKey,
  at: Date = new Date(),
  opts: GridOptions = {},
): RetrogradeStatus {
  const horizonDays = opts.horizonDays ?? 180;
  const iflags = TRACKED_PLANETS.includes(planet as (typeof TRACKED_PLANETS)[number]);
  if (!iflags) {
    return {
      planet,
      currentlyRetrograde: false,
      current: null,
      next: null,
      lastStarted: null,
    };
  }
  const windows = scanWindows(planet, at, horizonDays).sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );

  const atMs = at.getTime();
  const current = windows.find((w) => w.start.getTime() <= atMs && atMs <= w.end.getTime()) ?? null;
  const next = windows.find((w) => w.start.getTime() > atMs) ?? null;
  const past = windows.filter((w) => w.start.getTime() <= atMs);
  const lastStarted = past.length > 0 ? past[past.length - 1].start : null;

  return {
    planet,
    currentlyRetrograde: current !== null,
    current: current ? { start: current.start, end: current.end } : null,
    next: next ? { start: next.start, end: next.end } : null,
    lastStarted,
  };
}

export interface TabulatedRetrograde {
  planet: BodyKey;
  currentlyRetrograde: boolean;
  start: Date | null;
  end: Date | null;
  advice: string;
  strength: "mild" | "moderate" | "intense";
}

/**
 * All tracked planets ordered by the start of their next retrograde window.
 */
export function tabulateRetrogrades(
  at: Date = new Date(),
  opts: GridOptions = {},
): TabulatedRetrograde[] {
  const items: TabulatedRetrograde[] = [];
  for (const planet of TRACKED_PLANETS) {
    const s = retrogradeStatus(planet, at, opts);
    const ref = s.current ?? s.next;
    items.push({
      planet,
      currentlyRetrograde: s.currentlyRetrograde,
      start: ref ? ref.start : null,
      end: ref ? ref.end : null,
      advice: RETRO_ADVICE[planet],
      strength: RETRO_STRENGTH[planet],
    });
  }
  items.sort((a, b) => {
    const aMs = a.start ? a.start.getTime() : Infinity;
    const bMs = b.start ? b.start.getTime() : Infinity;
    return aMs - bMs;
  });
  return items;
}

export interface SkyStats {
  retrogradeCount: number;
  retrogradePlanets: BodyKey[];
  planetsBySign: Array<{ planet: BodyKey; sign: string }>;
  nextRetrograde: TabulatedRetrograde | null;
  note: string;
}

/**
 * Live sky statistics: how many planets are retrograde, where each sits, and
 * which planet starts its next retrograde soonest.
 */
export function liveSkyStats(
  at: Date = new Date(),
  opts: GridOptions = {},
): SkyStats {
  const tabs = tabulateRetrogrades(at, opts);
  const retrogradePlanets = tabs.filter((t) => t.currentlyRetrograde).map((t) => t.planet);
  const planetsBySign: Array<{ planet: BodyKey; sign: string }> = [];
  for (const planet of TRACKED_PLANETS) {
    const pos = computePosition(planet, at);
    if (pos) planetsBySign.push({ planet, sign: pos.sign });
  }

  const active = retrogradePlanets.length;
  const next = tabs.find((t) => t.start && t.start.getTime() > at.getTime()) ?? null;

  const note =
    active === 0
      ? "No personal planets are retrograde right now, so the sky reads as direct and forward-moving."
      : `${active} of the personal planets are retrograde today (${retrogradePlanets.join(", ")}), each prompting a slower, more deliberate pace in its ruled area of life.`;

  return {
    retrogradeCount: active,
    retrogradePlanets,
    planetsBySign,
    nextRetrograde: next,
    note,
  };
}
