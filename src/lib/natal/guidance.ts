/**
 * Life guidance pillars.
 *
 * Four deterministic sections — personality, love, career, inner — each built
 * strictly from the calculated chart: Sun + Ascendant, Venus + 7th-house cusp,
 * 10th-house cusp + Saturn, and Moon + 4th-house cusp. Whole-sign house cusps
 * come from `chart.houses.cusps` (house n's sign = cusps[n − 1]). Every
 * sentence cites a real placement; there is no randomness and no invented
 * events. Given the same chart, the same four sections are always produced.
 */
import { houseOf, SIGN_ELEMENTS } from "./readings";
import type { NatalChart } from "./types";

export type GuidanceArea = "personality" | "love" | "career" | "inner";

export interface GuidanceSection {
  id: GuidanceArea;
  title: string;
  headline: string;
  paragraphs: string[];
}

const SIGN_NAME: Record<string, string> = {
  aries: "Aries", taurus: "Taurus", gemini: "Gemini", cancer: "Cancer",
  leo: "Leo", virgo: "Virgo", libra: "Libra", scorpio: "Scorpio",
  sagittarius: "Sagittarius", capricorn: "Capricorn", aquarius: "Aquarius",
  pisces: "Pisces",
};

const SIGN_INDEX: Record<string, number> = {
  aries: 0, taurus: 1, gemini: 2, cancer: 3, leo: 4, virgo: 5,
  libra: 6, scorpio: 7, sagittarius: 8, capricorn: 9, aquarius: 10, pisces: 11,
};

const ELEMENT_WORD: Record<string, string> = {
  fire: "Fire",
  earth: "Earth",
  air: "Air",
  water: "Water",
};

function nameOf(slug: string): string {
  return SIGN_NAME[slug] ?? slug;
}

function elementOf(sign: string): string {
  return SIGN_ELEMENTS[sign] ?? "fire";
}

function elementWord(sign: string): string {
  return ELEMENT_WORD[elementOf(sign)] ?? "Fire";
}

function ordinal(n: number): string {
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

function degreeNotation(sign: string, degree: number, minutes: number): string {
  return `${nameOf(sign)} at ${degree}°${String(minutes).padStart(2, "0")}′`;
}

function houseOfPlanet(ascIndex: number, sign: string): number {
  return houseOf(ascIndex, SIGN_INDEX[sign] ?? 0);
}

interface CuspMap {
  fourth: string;
  seventh: string;
  tenth: string;
}

function cuspSigns(chart: NatalChart, ascSign: string): CuspMap {
  const byHouse = new Map(chart.houses.cusps.map((c) => [c.house, c.sign]));
  return {
    fourth: byHouse.get(4) ?? ascSign,
    seventh: byHouse.get(7) ?? ascSign,
    tenth: byHouse.get(10) ?? ascSign,
  };
}

export function buildLifeGuidance(chart: NatalChart): GuidanceSection[] {
  const byKey = new Map(chart.planets.map((p) => [p.key, p]));
  const sun = byKey.get("sun");
  const moon = byKey.get("moon");
  const venus = byKey.get("venus");
  const saturn = byKey.get("saturn");
  if (!sun || !moon || !venus || !saturn) {
    throw new Error("natal: required bodies missing for life guidance");
  }

  const ascSign = chart.bigThree.ascendant;
  const ascIndex = SIGN_INDEX[ascSign] ?? 0;
  const { fourth, seventh, tenth } = cuspSigns(chart, ascSign);

  const sunName = nameOf(sun.sign);
  const moonName = nameOf(moon.sign);
  const venusName = nameOf(venus.sign);
  const saturnName = nameOf(saturn.sign);
  const ascName = nameOf(ascSign);
  const fourthName = nameOf(fourth);
  const seventhName = nameOf(seventh);
  const tenthName = nameOf(tenth);

  const sunHouse = houseOfPlanet(ascIndex, sun.sign);
  const moonHouse = houseOfPlanet(ascIndex, moon.sign);
  const venusHouse = houseOfPlanet(ascIndex, venus.sign);
  const saturnHouse = houseOfPlanet(ascIndex, saturn.sign);

  const personality: GuidanceSection = {
    id: "personality",
    title: "Personality & Identity",
    headline: `${sunName} Sun · ${ascName} Ascendant`,
    paragraphs: [
      `Your Sun is in ${degreeNotation(sun.sign, sun.degree, sun.minutes)}, inside the ${ordinal(sunHouse)} house. This ${elementWord(sun.sign)} sign's energy shapes your core identity and where you feel most alive.`,
      `Your Ascendant is ${ascName}, the sign rising over the horizon at your birth (${chart.houses.ascendantLongitude.toFixed(1)} degrees). A ${ascName} Ascendant is what people notice about you first, before they see the Sun side underneath.`,
      `Pairing a ${sunName} Sun with a ${ascName} Ascendant gives you a ${elementWord(sun.sign).toLowerCase()} inner nature and a ${elementWord(ascSign).toLowerCase()} outer manner — the two sides of how you carry yourself.`,
    ],
  };

  const love: GuidanceSection = {
    id: "love",
    title: "Love & Partnership",
    headline: `${venusName} Venus · ${seventhName} Seventh House`,
    paragraphs: [
      `Your Venus is in ${degreeNotation(venus.sign, venus.degree, venus.minutes)}, placed in the ${ordinal(venusHouse)} house. ${
        venus.retrograde
          ? "With Venus retrograde at your birth, you tend to feel things out slowly in love, revisiting old bonds more than rushing into new ones."
          : `${elementWord(venus.sign)} Venus gives you a steady, ${elementOf(venus.sign)}-energy style of affection.`
      }`,
      `The 7th house (partnership and committed bonds) begins in ${seventhName}, a ${elementWord(seventh).toLowerCase()}-energy sign. This is the ground where your close, committed relationships tend to take shape.`,
      `Taken together, a ${venusName} Venus in the ${ordinal(venusHouse)} house with a ${seventhName} 7th house describes how you give affection and the kind of connection you build it on.`,
    ],
  };

  const career: GuidanceSection = {
    id: "career",
    title: "Career & Life Work",
    headline: `${tenthName} Tenth House · ${saturnName} Saturn`,
    paragraphs: [
      `Your 10th house (public role and long-term contribution) begins in ${tenthName}, a ${elementWord(tenth).toLowerCase()}-energy sign — the arena where consistent, visible work builds up over time.`,
      `Saturn is in ${degreeNotation(saturn.sign, saturn.degree, saturn.minutes)}, in the ${ordinal(saturnHouse)} house${
        saturn.retrograde
          ? " and retrograde at birth, favouring review and revision over fresh initiatives"
          : ", moving in its steady, structural register"
      }. Saturn governs the work you intend to build slowly and keep.`,
      `A ${tenthName} 10th house alongside ${saturnName} Saturn points to career results that arrive through patient, repeatable effort in the ${elementWord(tenth).toLowerCase()}-energy areas of your chart.`,
    ],
  };

  const inner: GuidanceSection = {
    id: "inner",
    title: "Inner World & Foundation",
    headline: `${moonName} Moon · ${fourthName} Fourth House`,
    paragraphs: [
      `Your Moon is in ${degreeNotation(moon.sign, moon.degree, moon.minutes)}, set in the ${ordinal(moonHouse)} house — a ${elementWord(moon.sign).toLowerCase()}-energy emotional baseline that shapes how you feel safe and steady.`,
      `The 4th house (home, family roots and inner foundation) begins in ${fourthName}, a ${elementWord(fourth).toLowerCase()}-energy sign, describing the private ground you return to when the outer hours wind down.`,
      `The ${moonName} Moon and ${fourthName} 4th house together describe an inner life that runs on ${elementWord(moon.sign).toLowerCase()}-energy needs, held in a ${fourthName}-flavored home base.`,
    ],
  };

  return [personality, love, career, inner];
}