/**
 * Personal daily transits.
 *
 * For a natal chart and a given UTC instant, each personal planet's current
 * position is cross-referenced against the chart's whole-sign houses to
 * produce one plain-English, deterministic note per body. Nothing is framed
 * as an event prediction — the notes describe which life topics are simply
 * "highlighted" that day. A single condensed paragraph summarises the two or
 * three strongest signals.
 */

import { computePosition, angularDifference } from "@/lib/astronomy/astro";
import type { NatalChart } from "@/lib/natal/types";
import type { BodyKey } from "@/lib/astronomy/bodies";

export interface DailyInsight {
  transitBody: BodyKey;
  transitSign: string;
  house: number;
  houseTheme: string;
  note: string;
}

export interface DayInsights {
  day: Date;
  insights: DailyInsight[];
}

export const TRANSIT_BODIES: Exclude<BodyKey, "northNode" | "southNode">[] = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

/** Plain-English meaning for each of the twelve whole-sign houses. */
export const HOUSE_THEMES: Record<number, string> = {
  1: "self and how you present",
  2: "money, possessions and self-worth",
  3: "communication, learning and daily routines",
  4: "home, family and private life",
  5: "creativity, romance and pleasure",
  6: "work, health and daily service",
  7: "partnerships and close relationships",
  8: "shared resources, change and depth",
  9: "beliefs, travel and higher learning",
  10: "career, reputation and public life",
  11: "friends, groups and future plans",
  12: "rest, solitude and the subconscious",
};

const SIGN_INDEX: Record<string, number> = {
  aries: 0,
  taurus: 1,
  gemini: 2,
  cancer: 3,
  leo: 4,
  virgo: 5,
  libra: 6,
  scorpio: 7,
  sagittarius: 8,
  capricorn: 9,
  aquarius: 10,
  pisces: 11,
};

const SIGN_NAME: Record<string, string> = {
  aries: "Aries",
  taurus: "Taurus",
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces",
};

/** Whole-Sign house number (1..12) of a transit body given the ascendant index. */
function transitHouse(ascSignIndex: number, planetSignIndex: number): number {
  return ((planetSignIndex - ascSignIndex + 12) % 12) + 1;
}

/** Deterministic single-sentence note for a transit body in a given house. */
function transitNote(body: BodyKey, house: number, sign: string, theme: string): string {
  const name = SIGN_NAME[sign] ?? sign;
  const base: Record<string, string> = {
    sun: `The Sun moves through ${name} in your ${ordinal(house)} house — the focus for the day settles on ${theme}.`,
    moon: `The Moon in ${name} sits in your ${ordinal(house)} house — emotional attention drifts toward ${theme}.`,
    mercury: `Mercury in your ${ordinal(house)} house puts ${theme} at the centre of your thinking and conversations.`,
    venus: `Venus in your ${ordinal(house)} house softens the day around ${theme}, drawing warmth from that area of life.`,
    mars: `Mars in your ${ordinal(house)} house lends drive and energy to ${theme} — a good day to take action there.`,
    jupiter: `Jupiter in your ${ordinal(house)} house expands opportunities around ${theme}, making that area feel roomier.`,
    saturn: `Saturn in your ${ordinal(house)} house asks for structure and patience in ${theme} — slow, steady work wins.`,
    uranus: `Uranus in your ${ordinal(house)} house brings an unexpected angle to ${theme}, inviting a fresh approach.`,
    neptune: `Neptune in your ${ordinal(house)} house blurs the edges of ${theme}, so check details rather than assume.`,
    pluto: `Pluto in your ${ordinal(house)} house points at what needs transforming within ${theme} — depth, not surface.`,
  };
  return base[body] ?? `${SIGN_NAME[sign] ?? sign} is transiting your ${ordinal(house)} house — ${theme} gets the day's attention.`;
}

function ordinal(n: number): string {
  return n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;
}

/**
 * Compute today's transit insights for a natal chart at a given instant.
 */
export function dailyTransitInsights(chart: NatalChart, at: Date = new Date()): DayInsights {
  const ascSignIndex = SIGN_INDEX[chart.houses.ascendant] ?? 0;
  const insights: DailyInsight[] = [];

  for (const body of TRANSIT_BODIES) {
    const pos = computePosition(body, at);
    if (!pos) continue;
    const planetSignIndex = SIGN_INDEX[pos.sign] ?? 0;
    const house = transitHouse(ascSignIndex, planetSignIndex);
    const theme = HOUSE_THEMES[house] ?? "the general rhythm of the day";
    insights.push({
      transitBody: body,
      transitSign: pos.sign,
      house,
      houseTheme: theme,
      note: transitNote(body, house, pos.sign, theme),
    });
  }

  return { day: at, insights };
}

/** Pick the 2–3 strongest signals from a set of insights. */
function strongestSignals(chart: NatalChart, insights: DailyInsight[], at: Date): string[] {
  const asc = chart.houses.ascendantLongitude;
  const mc = chart.houses.midheavenLongitude;
  const signals: string[] = [];

  for (const ins of insights) {
    const pos = computePosition(ins.transitBody, at);
    if (!pos) continue;

    const retro = pos.retrograde ? `${SIGN_NAME[ins.transitSign] ?? ins.transitSign} ${nameOf(ins.transitBody)} is retrograde` : null;
    if (retro) {
      signals.push(`${retro}, so today rewards revisiting ${ins.houseTheme} rather than launching fresh.`);
      if (signals.length >= 2) break;
    }

    const nearAsc = Math.abs(angularDifference(pos.longitude, asc)) < 6;
    const nearMc = Math.abs(angularDifference(pos.longitude, mc)) < 6;
    if (nearAsc || nearMc) {
      const point = nearAsc ? "your Ascendant" : "your Midheaven";
      signals.push(`${nameOf(ins.transitBody)} moves close to ${point}, putting ${ins.houseTheme} front and centre today.`);
      if (signals.length >= 2) break;
    }

    const inSign = longitudeInSign(pos.longitude);
    if (inSign && ins.transitBody === "sun") {
      signals.push(`The Sun is in ${SIGN_NAME[inSign] ?? inSign}, steadying the day's overall tone.`);
      if (signals.length >= 2) break;
    }
  }

  if (signals.length === 0) {
    signals.push(
      `Nothing dramatic crosses your angles today — the transits touch ${insights.map((i) => `the ${ordinal(i.house)} house (${i.houseTheme})`).slice(0, 2).join(" and ")}.`,
    );
  }

  return signals.slice(0, 3);
}

function nameOf(body: BodyKey): string {
  const map: Record<string, string> = {
    sun: "The Sun",
    moon: "The Moon",
    mercury: "Mercury",
    venus: "Venus",
    mars: "Mars",
    jupiter: "Jupiter",
    saturn: "Saturn",
    uranus: "Uranus",
    neptune: "Neptune",
    pluto: "Pluto",
  };
  return map[body] ?? body;
}

/** Detect the zodiac sign a longitude falls within. */
const SIGN_ORDER = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

function longitudeInSign(lon: number): string | null {
  const n = ((lon % 360) + 360) % 360;
  const index = Math.floor(n / 30) % 12;
  return SIGN_ORDER[index];
}

/**
 * Collapse the day's insights into one concise, plain-English paragraph that
 * leads with the strongest signals and names the houses involved.
 */
export function daySummary(
  chart: NatalChart,
  insights: DayInsights,
): string {
  const signals = strongestSignals(chart, insights.insights, insights.day);
  if (signals.length === 0) {
    return "A quiet day: no transiting planet squares your angles, so the rhythm stays even across your houses.";
  }
  return `Standout signals: ${signals.join(" Also, ")}`;
}
