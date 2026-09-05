/**
 * Life-phase milestone engine.
 *
 * Pure, deterministic milestone tracking built from real ephemeris: the Saturn
 * return (transit Saturn returning to its exact natal longitude), the
 * quarter-life window (around age 25), and the progressed Moon (secondary
 * progression at the birth Moon's daily rate). Every function accepts an
 * injectable `at` reference date so tests are reproducible with fixed dates.
 * Missing bodies in `chart.planets` are skipped, never crashed on.
 */
import { angularDifference, computePosition, longitudeToSign } from "@/lib/astronomy/astro";
import { exactAge } from "./age";
import { byKey } from "./planets";
import type { NatalChart } from "./types";

const DAY_MS = 86400000;
const SATURN_ORB_DEGREES = 8;
const AVERAGE_YEAR_DAYS = 365.2425;

const SIGN_NAME: Record<string, string> = {
  aries: "Aries", taurus: "Taurus", gemini: "Gemini", cancer: "Cancer",
  leo: "Leo", virgo: "Virgo", libra: "Libra", scorpio: "Scorpio",
  sagittarius: "Sagittarius", capricorn: "Capricorn", aquarius: "Aquarius",
  pisces: "Pisces",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ORDINAL_WORDS = ["first", "second", "third", "fourth", "fifth"];

function ordinalWord(n: number): string {
  return ORDINAL_WORDS[n - 1] ?? `${n}th`;
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Signed shortest separation (transit − natal) in (−180, 180]. */
function signedSeparation(transitLon: number, natalLon: number): number {
  return angularDifference(transitLon, natalLon);
}

export interface SaturnReturnWindow {
  /** True when transit Saturn is within the 8° orb of natal Saturn now. */
  active: boolean;
  /** Signed transit − natal separation in degrees, within [−180, 180]. */
  offset: number;
  transitLongitude: number;
  natalLongitude: number;
}

export function saturnReturnWindow(chart: NatalChart, at: Date = new Date()): SaturnReturnWindow {
  const natal = byKey(chart.planets).get("saturn");
  if (!natal) {
    return { active: false, offset: 0, transitLongitude: 0, natalLongitude: 0 };
  }
  const transit = computePosition("saturn", at);
  if (!transit) {
    return {
      active: false,
      offset: 0,
      transitLongitude: natal.longitude,
      natalLongitude: natal.longitude,
    };
  }
  const offset = signedSeparation(transit.longitude, natal.longitude);
  return {
    active: Math.abs(offset) <= SATURN_ORB_DEGREES,
    offset,
    transitLongitude: transit.longitude,
    natalLongitude: natal.longitude,
  };
}

export interface SaturnReturn {
  /** Calendar year the window opens (≈ peak year − 1). */
  startYear: number;
  /** Calendar year the window closes (≈ peak year + 1). */
  endYear: number;
  /** Age in whole years at window open. */
  startAge: number;
  /** Age in whole years at window close. */
  endAge: number;
  /** 1 = first return, 2 = second, etc. */
  returnNumber: number;
  /** Best-estimate peak of the exact longitude crossing. */
  peak: Date;
  /** Short plain-English label. No predictions, just the geometry. */
  label: string;
}

/**
 * The next Saturn return from `at`. Transit Saturn's longitude relative to the
 * natal degree is unwrapped into a continuously accumulated figure (mod 360
 * fold removed), so a true "return" is identified as the closest approach to
 * the natal degree within a completed lap. Retrograde dips at the very start
 * of life stay on lap zero and are never mistaken for a return. Scans at most
 * ~36 years from birth and returns null when no lap-boundary crossing lies at
 * or after `at`.
 */
export function nextSaturnReturn(chart: NatalChart, at: Date = new Date()): SaturnReturn | null {
  const natal = byKey(chart.planets).get("saturn");
  if (!natal) return null;

  const birth = new Date(chart.utcTime);
  const horizon = new Date(birth.getTime() + 36 * AVERAGE_YEAR_DAYS * DAY_MS);

  // Walk whole months from birth so the unwrap stays continuous.
  const byLap = new Map<number, { month: Date; rawDist: number }>();
  let prevRaw: number | null = null;
  let accumulator = 0;
  let cur = new Date(Date.UTC(birth.getUTCFullYear(), birth.getUTCMonth(), 1));
  let guard = 0;
  while (cur.getTime() <= horizon.getTime() && guard < 800) {
    guard++;
    const pos = computePosition("saturn", cur);
    if (pos) {
      const raw = ((pos.longitude - natal.longitude) % 360 + 360) % 360;
      if (prevRaw !== null) {
        let delta = raw - prevRaw;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        accumulator += delta;
      }
      prevRaw = raw;

      const lap = accumulator / 360;
      const frac = lap - Math.round(lap);
      if (Math.abs(frac) < 0.25) {
        const lapNumber = Math.round(lap);
        if (lapNumber >= 1) {
          const rawDist = Math.min(raw, 360 - raw);
          const existing = byLap.get(lapNumber);
          if (!existing || rawDist < existing.rawDist) {
            byLap.set(lapNumber, { month: cur, rawDist });
          }
        }
      }
    }
    cur = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth() + 1, 1));
  }

  const laps = [...byLap.entries()].sort((a, b) => a[0] - b[0]);
  const next = laps.find((entry) => entry[1].month.getTime() >= at.getTime());
  if (!next) return null;

  const returnNumber = next[0];
  const peak = next[1].month;
  const startDate = new Date(
    Date.UTC(peak.getUTCFullYear() - 1, peak.getUTCMonth(), peak.getUTCDate()),
  );
  const endDate = new Date(
    Date.UTC(peak.getUTCFullYear() + 1, peak.getUTCMonth(), peak.getUTCDate()),
  );
  const ageAtPeak = exactAge(birth, peak).years;

  return {
    startYear: startDate.getUTCFullYear(),
    endYear: endDate.getUTCFullYear(),
    startAge: exactAge(birth, startDate).years,
    endAge: exactAge(birth, endDate).years,
    returnNumber,
    peak,
    label: `your ${ordinalWord(returnNumber)} Saturn return spans ${startDate.getUTCFullYear()} to ${endDate.getUTCFullYear()} (around age ${ageAtPeak}): transit Saturn crosses the exact degree it held in your birth chart, a geometric checkpoint for built structures and long-term plans.`,
  };
}

export interface QuarterLifeWindow {
  active: boolean;
  ageYears: number;
  startYear: number;
  endYear: number;
  label: string;
}

export function quarterLifeWindow(chart: NatalChart, at: Date = new Date()): QuarterLifeWindow {
  const birth = new Date(chart.utcTime);
  const ageYears = exactAge(birth, at).years;
  const startYear = birth.getUTCFullYear() + 24;
  const endYear = birth.getUTCFullYear() + 26;
  return {
    active: ageYears >= 24 && ageYears <= 26,
    ageYears,
    startYear,
    endYear,
    label: `your quarter-life window spans ages 24–26 (calendar years ${startYear}–${endYear}) — a structured period for first career commitments, financial foundations and long-term direction.`,
  };
}

export interface ProgressedMoon {
  /** Current progressed-Moon sign slug. */
  sign: string;
  /** Current progressed-Moon tropical longitude [0, 360). */
  longitude: number;
  /** Best estimate of the next sign change, or null when out of horizon. */
  nextSignChange: Date | null;
  /** Plain-English note, hype-free. */
  note: string;
}

/**
 * Progressed Moon via secondary progression: the birth Moon's daily rate
 * becomes one year of progressed motion. Returns null when the chart has no
 * Moon or `at` precedes the birth instant.
 */
export function progressedMoonChart(chart: NatalChart, at: Date = new Date()): ProgressedMoon | null {
  const moon = byKey(chart.planets).get("moon");
  if (!moon) return null;

  const birth = new Date(chart.utcTime);
  if (at.getTime() <= birth.getTime()) return null;

  const ageDays = (at.getTime() - birth.getTime()) / DAY_MS;
  const dailyRate = moon.speed > 0 ? moon.speed : 13.2;

  const longitude = normalizeDeg(moon.longitude + dailyRate * (ageDays / AVERAGE_YEAR_DAYS));
  const info = longitudeToSign(longitude);

  const perDay = dailyRate / AVERAGE_YEAR_DAYS;
  const remaining = 30 - info.degreeInSign;
  let nextSignChange: Date | null = null;
  if (perDay > 0 && remaining > 0.01) {
    nextSignChange = new Date(at.getTime() + (remaining / perDay) * DAY_MS);
  }

  const signName = SIGN_NAME[info.slug] ?? info.slug;
  let note: string;
  if (nextSignChange) {
    note = `your progressed Moon moves at the birth Moon's rate and is in ${signName}; it crosses into the next sign around ${MONTH_NAMES[nextSignChange.getUTCMonth()]} ${nextSignChange.getUTCFullYear()} — a gradual, broad shift of emotional tone.`;
  } else {
    note = `your progressed Moon is in ${signName}; its next sign change falls outside the current horizon.`;
  }

  return { sign: info.slug, longitude, nextSignChange, note };
}

export interface LifeMilestone {
  id: string;
  title: string;
  active: boolean;
  startsAtAge: number;
  note: string;
}

/**
 * Combined, age-sorted milestone list (max 5): quarter-life window, next
 * Saturn return, and progressed Moon. Missing moons are skipped without error.
 */
export function lifeMilestones(chart: NatalChart, at: Date = new Date()): LifeMilestone[] {
  const out: LifeMilestone[] = [];

  const quarter = quarterLifeWindow(chart, at);
  out.push({
    id: "quarter-life-window",
    title: "Quarter-Life Window",
    active: quarter.active,
    startsAtAge: 24,
    note: quarter.label,
  });

  const saturnWindow = saturnReturnWindow(chart, at);
  const nextReturn = nextSaturnReturn(chart, at);
  if (nextReturn) {
    out.push({
      id: `saturn-return-${nextReturn.returnNumber}`,
      title: `${capitalize(ordinalWord(nextReturn.returnNumber))} Saturn Return`,
      active: saturnWindow.active,
      startsAtAge: nextReturn.startAge,
      note: nextReturn.label,
    });
  }

  const progressedMoon = progressedMoonChart(chart, at);
  if (progressedMoon) {
    const birth = new Date(chart.utcTime);
    const ageYears = exactAge(birth, at).years;
    out.push({
      id: "progressed-moon",
      title: "Progressed Moon",
      active:
        progressedMoon.nextSignChange !== null &&
        progressedMoon.nextSignChange.getTime() - at.getTime() <= 365 * DAY_MS,
      startsAtAge: ageYears,
      note: progressedMoon.note,
    });
  }

  return out.sort((a, b) => a.startsAtAge - b.startsAtAge).slice(0, 5);
}