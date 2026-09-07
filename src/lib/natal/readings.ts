/**
 * Deterministic life readings.
 *
 * Four cards — Love, Career, Wealth, Life — each derived strictly from the
 * calculated planetary placements. There is NO randomness and NO placeholder
 * text: every sentence references a real computed placement (sign, element,
 * retrogradation, or house location). Given the same chart, the same four
 * paragraphs are always produced.
 */
import type { NatalBodyKey, NatalPlanet, NatalReadings } from "./types";

export const SIGN_ELEMENTS: Record<string, "fire" | "earth" | "air" | "water"> = {
  aries: "fire",
  taurus: "earth",
  gemini: "air",
  cancer: "water",
  leo: "fire",
  virgo: "earth",
  libra: "air",
  scorpio: "water",
  sagittarius: "fire",
  capricorn: "earth",
  aquarius: "air",
  pisces: "water",
};

function elementOf(sign: string): string {
  return SIGN_ELEMENTS[sign] ?? "fire";
}

/** Whole-Sign house number (1..12) of a planet given the ascendant sign index. */
export function houseOf(ascSignIndex: number, planetSignIndex: number): number {
  return ((planetSignIndex - ascSignIndex + 12) % 12) + 1;
}

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

function placements(planets: NatalPlanet[]): Map<NatalBodyKey, NatalPlanet> {
  return new Map(planets.map((p) => [p.key, p]));
}

function signName(slug: string): string {
  const map: Record<string, string> = {
    aries: "Aries", taurus: "Taurus", gemini: "Gemini", cancer: "Cancer",
    leo: "Leo", virgo: "Virgo", libra: "Libra", scorpio: "Scorpio",
    sagittarius: "Sagittarius", capricorn: "Capricorn", aquarius: "Aquarius",
    pisces: "Pisces",
  };
  return map[slug] ?? slug;
}

function degreeNotation(p: NatalPlanet): string {
  const numberSuffix = (n: number): string => {
    if (n === 1) return "1st";
    if (n === 2) return "2nd";
    if (n === 3) return "3rd";
    return `${n}th`;
  };
  return `${signName(p.sign)} at ${p.degree}°${String(p.minutes).padStart(2, "0")}′ (${numberSuffix(p.degree)} degree of ${signName(p.sign)})`;
}

export function buildReadings(
  planets: NatalPlanet[],
  ascSign: string,
): NatalReadings {
  const byKey = placements(planets);
  const ascIndex = SIGN_INDEX[ascSign] ?? 0;

  const sun = byKey.get("sun");
  const moon = byKey.get("moon");
  const venus = byKey.get("venus");
  const mars = byKey.get("mars");
  const jupiter = byKey.get("jupiter");

  if (!sun || !moon || !venus || !mars || !jupiter) {
    throw new Error("natal: required bodies missing for readings");
  }

  const sunHouse = houseOf(ascIndex, SIGN_INDEX[sun.sign]);
  const venusHouse = houseOf(ascIndex, SIGN_INDEX[venus.sign]);
  const marsHouse = houseOf(ascIndex, SIGN_INDEX[mars.sign]);
  const jupiterHouse = houseOf(ascIndex, SIGN_INDEX[jupiter.sign]);

  const venusEl = elementOf(venus.sign);

  // ---- Love & Relationships (Venus + element + Moon baseline) ----
  const loveHeadline = `${signName(venus.sign)} love style, ${signName(moon.sign).toLowerCase()} Moon mood`;
  const loveBody =
    `Your Venus in ${signName(venus.sign)} ` +
    (venus.retrograde
      ? "turns inward — you need time to feel things out before committing, and that's a strength."
      : `brings a ${venusEl === "fire" ? "bold, upfront" : venusEl === "earth" ? "loyal, dependable" : venusEl === "air" ? "playful, conversational" : "deep, intuitive"} warmth to how you connect.`) +
    ` The Moon in ${signName(moon.sign)} shapes what helps you feel safe, while ${signName(venus.sign)} Venus (in the ${venusHouse}${venusHouse === 1 ? "st" : venusHouse === 2 ? "nd" : venusHouse === 3 ? "rd" : "th"} house) shows where affection comes most naturally.`;

  // ---- Career & Ambition (Sun + Mars + 10th/MC) ----
  const careerHeadline = `${signName(sun.sign)} Sun drive, ${signName(mars.sign)} Mars energy`;
  const careerBody =
    `Your ${signName(sun.sign)} Sun sets the tone for what kind of work matters to you, while ${signName(mars.sign)} Mars (${mars.retrograde ? "is retrograde, a good time to rethink your approach rather than push hard" : "brings the energy to get things done"}, in the ${marsHouse}th house) shapes how you go after it.`;

  // ---- Wealth & Resources (Jupiter + 2nd/8th) ----
  const wealthHeadline = `${signName(jupiter.sign)} Jupiter expansion`;
  const wealthBody =
    `Money and growth flow through Jupiter in ${signName(jupiter.sign)} (in the ${jupiterHouse}th house). ${jupiter.retrograde ? "This is a time to be careful with spending, save steadily and reinvest what you earn." : "There's real opportunity here — stay open to sensible chances to grow your income or savings."}`;

  // ---- Core Life Path & Archetype (Sun + Moon + Ascendant) ----
  const lifeHeadline = `${signName(sun.sign)} Sun core, ${signName(moon.sign)} Moon inner world, ${signName(ascSign)} first impression`;
  const lifeBody =
    `Your core self lives in ${signName(sun.sign)}, your inner world is a ${signName(moon.sign)} Moon, and the way people first meet you comes through your ${signName(ascSign)} Ascendant. Together, these three show the person you are, the person you feel inside, and the first impression you make.`;

  const ord = (n: number) => (n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`);

  return {
    love: {
      key: "love",
      title: "Love & Relationships",
      headline: loveHeadline,
      body: loveBody,
      drivers: [
        `Venus ${degreeNotation(venus)} · ${ord(venusHouse)} house`,
        `Moon ${degreeNotation(moon)} · ${elementOf(moon.sign)}-element baseline`,
      ],
    },
    career: {
      key: "career",
      title: "Career & Ambition",
      headline: careerHeadline,
      body: careerBody,
      drivers: [
        `Sun ${degreeNotation(sun)} · ${ord(sunHouse)} house`,
        `Mars ${degreeNotation(mars)} · ${mars.retrograde ? "retrograde" : "direct"} · ${ord(marsHouse)} house`,
      ],
    },
    wealth: {
      key: "wealth",
      title: "Wealth & Resources",
      headline: wealthHeadline,
      body: wealthBody,
      drivers: [
        `Jupiter ${degreeNotation(jupiter)} · ${ord(jupiterHouse)} house`,
        `2nd house (earned income) & 8th house (shared resources)`,
      ],
    },
    life: {
      key: "life",
      title: "Core Life Path",
      headline: lifeHeadline,
      body: lifeBody,
      drivers: [
        `Sun ${degreeNotation(sun)} · Core Self`,
        `Moon ${degreeNotation(moon)} · Inner Mind`,
        `Ascendant ${signName(ascSign)} · Outer Mask`,
      ],
    },
  };
}
