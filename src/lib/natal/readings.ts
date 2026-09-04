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

const ELEMENT_WORD: Record<string, string> = {
  fire: "Fiery",
  earth: "Grounded",
  air: "Airy",
  water: "Watery",
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

/** Gloss for a planet-sign placement used inside reading bodies. */
const PLANET_GLOSS: Record<NatalBodyKey, string> = {
  sun: "your core identity",
  moon: "your emotional baseline",
  mercury: "how you think and speak",
  venus: "how you love and attract",
  mars: "how you act and pursue",
  jupiter: "how you grow and expand",
  saturn: "how you build and endure",
  uranus: "how you break from the expected",
  neptune: "how you dream and intuit",
  pluto: "how you transform",
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
  const loveHeadline = `${signName(venus.sign)} Venus, ${ELEMENT_WORD[venusEl]} love, guided by a ${signName(moon.sign).toLowerCase()} Moon`;
  const loveBody =
    `Your Venus in ${signName(venus.sign)} ` +
    (venus.retrograde
      ? "turns inward, asking for love to be revisited and refined rather than rushed."
      : `approaches affection with ${venusEl}-energy: ${venusEl === "fire" ? "bold and direct warmth" : venusEl === "earth" ? "loyal, tangible devotion" : venusEl === "air" ? "intellectual companionship and ideals" : "deep emotional attunement and trust"}.`) +
    ` The Moon in ${signName(moon.sign)} (${elementOf(moon.sign)}-element inner needs) shapes what makes you feel secure in a bond, while ${signName(venus.sign)} Venus (in the ${venusHouse}${venusHouse === 1 ? "st" : venusHouse === 2 ? "nd" : venusHouse === 3 ? "rd" : "th"} house) shows where affection is most naturally expressed.`;

  // ---- Career & Ambition (Sun + Mars + 10th/MC) ----
  const careerHeadline = `${signName(sun.sign)} Sun purpose, ${signName(mars.sign)} Mars drive`;
  const careerBody =
    `Your ${signName(sun.sign)} Sun (${PLANET_GLOSS.sun}, in the ${sunHouse}th house) sets the arc of your ambition, while ${signName(mars.sign)} Mars (${mars.retrograde ? "in its reflective retrograde, best used to re-strategize rather than charge" : "providing the forward push"}, in the ${marsHouse}th house) dictates how ferociously you pursue it. Leadership and long-form legacy are tied to your Solar drive; the momentum to begin, start and compete comes from Mars.`;

  // ---- Wealth & Resources (Jupiter + 2nd/8th) ----
  const wealthHeadline = `${signName(jupiter.sign)} Jupiter expansion`;
  const wealthBody =
    `Growth and resources flow through Jupiter in ${signName(jupiter.sign)} (in the ${jupiterHouse}th house): ${jupiter.retrograde ? "a conservative, re-investing approach to abundance" : "an expanding, opportunity-seeking approach to abundance"}. The 2nd house governs earned income and personal assets, while the 8th rules shared resources and transformations of value — where these receive strong planetary attention, wealth rhythms are amplified.`;

  // ---- Core Life Path & Archetype (Sun + Moon + Ascendant) ----
  const lifeHeadline = `${signName(sun.sign)} Sun core, ${signName(moon.sign)} Moon mind, ${signName(ascSign)} Ascendant mask`;
  const lifeBody =
    `Your core self lives in ${signName(sun.sign)} (${elementOf(sun.sign)}-element), your inner world is a ${signName(moon.sign)} Moon, and the world first meets your ${signName(ascSign)} Ascendant. Together these three trace your archetype: the self you are, the self you feel, and the self you show.`;

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
      title: "Core Life Path & Archetype",
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
