export type Element = "Fire" | "Earth" | "Air" | "Water";
export type Modality = "Cardinal" | "Fixed" | "Mutable";

export interface ZodiacSign {
  slug: string;
  name: string;
  glyph: string;
  symbolPath: string;
  element: Element;
  modality: Modality;
  ruler: string;
  modernRuler?: string;
  dateRange: { startMonth: number; startDay: number; endMonth: number; endDay: number };
  traits: string[];
  description: string;
  keywords: string[];
}

const TWO_DIGIT = (n: number) => String(n).padStart(2, "0");

export const ZODIAC_SIGNS: readonly ZodiacSign[] = [
  {
    slug: "aries",
    name: "Aries",
    glyph: "♈",
    symbolPath: "aries",
    element: "Fire",
    modality: "Cardinal",
    ruler: "Mars",
    dateRange: { startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    traits: ["Courageous", "Determined", "Confident", "Enthusiastic", "Optimistic", "Honest", "Passionate"],
    description:
      "Aries, the first sign of the zodiac, is ruled by Mars and embodies the spark of beginnings. Cardinal fire, it initiates with courage and a pioneering spirit. Those under Aries are natural leaders who move with directness, energy, and an unflinching willingness to start anew.",
    keywords: ["leadership", "initiative", "courage", "pioneer", "action", "independence"],
  },
  {
    slug: "taurus",
    name: "Taurus",
    glyph: "♉",
    symbolPath: "taurus",
    element: "Earth",
    modality: "Fixed",
    ruler: "Venus",
    dateRange: { startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    traits: ["Reliable", "Patient", "Practical", "Devoted", "Responsible", "Stable", "Determined"],
    description:
      "Taurus, ruled by Venus, is the fixed earth sign of steadiness and sensual appreciation. Those born under Taurus value security, consistency, and the quiet pleasures of the material world. Patience is their gift, and persistence their quiet superpower.",
    keywords: ["stability", "patience", "loyalty", "sensory", "grounded", "persistence"],
  },
  {
    slug: "gemini",
    name: "Gemini",
    glyph: "♊",
    symbolPath: "gemini",
    element: "Air",
    modality: "Mutable",
    ruler: "Mercury",
    dateRange: { startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
    traits: ["Curious", "Adaptable", "Communicative", "Intellectual", "Witty", "Youthful", "Versatile"],
    description:
      "Gemini, governed by Mercury, is the mutable air sign of communication and curiosity. Geminis are quick-witted, adaptable, and endlessly inquisitive. They gather ideas like constellations gather stars, connecting people, thoughts, and worlds with effortless fluency.",
    keywords: ["communication", "curiosity", "adaptability", "intellect", "versatility", "wit"],
  },
  {
    slug: "cancer",
    name: "Cancer",
    glyph: "♋",
    symbolPath: "cancer",
    element: "Water",
    modality: "Cardinal",
    ruler: "Moon",
    dateRange: { startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
    traits: ["Nurturing", "Sensitive", "Intuitive", "Tenacious", "Imaginative", "Protective", "Emotional"],
    description:
      "Cancer, ruled by the Moon, is the cardinal water sign of intuition and care. Deeply attuned to emotion and memory, those under Cancer nurture the people and places they love with quiet devotion. Their strength lies in feeling deeply and protecting fiercely.",
    keywords: ["nurture", "intuition", "home", "memory", "protection", "empathy"],
  },
  {
    slug: "leo",
    name: "Leo",
    glyph: "♌",
    symbolPath: "leo",
    element: "Fire",
    modality: "Fixed",
    ruler: "Sun",
    dateRange: { startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    traits: ["Confident", "Creative", "Generous", "Charismatic", "Warm", "Dramatic", "Loyal"],
    description:
      "Leo, ruled by the Sun, is the fixed fire sign of radiance and heart. Generous, creative, and magnetically warm, those under Leo carry a natural dignity that draws others into their orbit. Their loyalty is fierce and their creative fire unwavering.",
    keywords: ["radiance", "creativity", "leadership", "generosity", "passion", "heart"],
  },
  {
    slug: "virgo",
    name: "Virgo",
    glyph: "♍",
    symbolPath: "virgo",
    element: "Earth",
    modality: "Mutable",
    ruler: "Mercury",
    dateRange: { startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    traits: ["Analytical", "Practical", "Meticulous", "Reliable", "Modest", "Helpful", "Precise"],
    description:
      "Virgo, governed by Mercury, is the mutable earth sign of refinement and service. Meticulous, analytical, and quietly practical, Virgos see the small details others overlook and turn them into order and usefulness. Their devotion is expressed through precision and care.",
    keywords: ["precision", "analysis", "service", "detail", "health", "craft"],
  },
  {
    slug: "libra",
    name: "Libra",
    glyph: "♎",
    symbolPath: "libra",
    element: "Air",
    modality: "Cardinal",
    ruler: "Venus",
    dateRange: { startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    traits: ["Diplomatic", "Fair", "Charming", "Social", "Artistic", "Balanced", "Graceful"],
    description:
      "Libra, ruled by Venus, is the cardinal air sign of balance and beauty. Represented by the scales, Libra seeks harmony in relationships and fairness in all things. Their grace, diplomacy, and aesthetic eye bring equilibrium to the world around them.",
    keywords: ["balance", "harmony", "justice", "beauty", "partnership", "diplomacy"],
  },
  {
    slug: "scorpio",
    name: "Scorpio",
    glyph: "♏",
    symbolPath: "scorpio",
    element: "Water",
    modality: "Fixed",
    ruler: "Pluto",
    modernRuler: "Mars",
    dateRange: { startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    traits: ["Intense", "Perceptive", "Resourceful", "Brave", "Passionate", "Magnetic", "Invested"],
    description:
      "Scorpio, ruled by Pluto, is the fixed water sign of depth and transformation. Intense, perceptive, and fiercely committed, Scorpios feel everything at full force and are drawn to the truths beneath the surface. Their courage transforms themselves and others.",
    keywords: ["depth", "transformation", "passion", "insight", "loyalty", "intensity"],
  },
  {
    slug: "sagittarius",
    name: "Sagittarius",
    glyph: "♐",
    symbolPath: "sagittarius",
    element: "Fire",
    modality: "Mutable",
    ruler: "Jupiter",
    dateRange: { startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
    traits: ["Adventurous", "Optimistic", "Philosophical", "Independent", "Honest", "Expansive", "Fun-loving"],
    description:
      "Sagittarius, ruled by Jupiter, is the mutable fire sign of adventure and wisdom. Bold, optimistic, and philosophical, Sagittarians seek meaning through experience. The archer aims high, always reaching toward the horizon of bigger ideas and wider worlds.",
    keywords: ["adventure", "optimism", "philosophy", "freedom", "expansion", "truth"],
  },
  {
    slug: "capricorn",
    name: "Capricorn",
    glyph: "♑",
    symbolPath: "capricorn",
    element: "Earth",
    modality: "Cardinal",
    ruler: "Saturn",
    dateRange: { startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
    traits: ["Ambitious", "Disciplined", "Practical", "Responsible", "Patient", "Strategic", "Dependable"],
    description:
      "Capricorn, ruled by Saturn, is the cardinal earth sign of achievement and mastery. Ambitious, disciplined, and profoundly patient, Capricorns build their lives with care and foresight. The goat climbs steadily, refusing to be deterred by the steepness of the ascent.",
    keywords: ["ambition", "discipline", "mastery", "responsibility", "structure", "perseverance"],
  },
  {
    slug: "aquarius",
    name: "Aquarius",
    glyph: "♒",
    symbolPath: "aquarius",
    element: "Air",
    modality: "Fixed",
    ruler: "Uranus",
    modernRuler: "Saturn",
    dateRange: { startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    traits: ["Independent", "Inventive", "Humanitarian", "Original", "Progressive", "Detached", "Intellectual"],
    description:
      "Aquarius, ruled by Uranus, is the fixed air sign of innovation and collective vision. Independent, inventive, and deeply humanitarian, Aquarians look toward the future and champion the causes of the many. They value progress, originality, and freedom of thought.",
    keywords: ["innovation", "independence", "humanity", "vision", "originality", "progress"],
  },
  {
    slug: "pisces",
    name: "Pisces",
    glyph: "♓",
    symbolPath: "pisces",
    element: "Water",
    modality: "Mutable",
    ruler: "Neptune",
    modernRuler: "Jupiter",
    dateRange: { startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
    traits: ["Compassionate", "Artistic", "Intuitive", "Gentle", "Selfless", "Wise", "Imaginative"],
    description:
      "Pisces, ruled by Neptune, is the mutable water sign of imagination and compassion. Intuitive, artistic, and deeply empathetic, Pisceans feel the currents of emotion that flow beneath everyday life. Their gift is to see the invisible and give it form.",
    keywords: ["imagination", "compassion", "intuition", "creativity", "dreams", "empathy"],
  },
];

export const ZODIAC_BY_SLUG: ReadonlyMap<string, ZodiacSign> = new Map(
  ZODIAC_SIGNS.map((s) => [s.slug, s]),
);

export function getZodiacSign(slug: string): ZodiacSign | undefined {
  return ZODIAC_BY_SLUG.get(slug);
}

export function isZodiacSign(slug: string): boolean {
  return ZODIAC_BY_SLUG.has(slug);
}

function dateToOrdinal(month: number, day: number): number {
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let ordinal = day;
  for (let m = 0; m < month - 1; m++) {
    ordinal += daysPerMonth[m];
  }
  return ordinal;
}

export function zodiacForDate(year: number, month: number, day: number): ZodiacSign {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysPerMonth = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const dayOfYear =
    daysPerMonth.slice(0, month - 1).reduce((a, b) => a + b, 0) + day;

  for (const sign of ZODIAC_SIGNS) {
    const start = dateToOrdinal(sign.dateRange.startMonth, sign.dateRange.startDay);
    let end = dateToOrdinal(sign.dateRange.endMonth, sign.dateRange.endDay);
    if (sign.slug === "capricorn") {
      if (start > end) {
        end += isLeap ? 366 : 365;
      }
    }
    if (dayOfYear >= start && dayOfYear <= end) {
      return sign;
    }
  }
  return ZODIAC_SIGNS[9];
}

export function formatDateRange(sign: ZodiacSign): string {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${monthNames[sign.dateRange.startMonth - 1]} ${sign.dateRange.startDay} \u2013 ${monthNames[sign.dateRange.endMonth - 1]} ${sign.dateRange.endDay}`;
}

export const SIGN_DEGREE = (slug: string, degree: number): string => {
  const sign = getZodiacSign(slug);
  if (!sign) return "";
  const deg = Math.floor(degree);
  const min = Math.floor((degree - deg) * 60);
  return `${sign.glyph} ${deg}\u00B0 ${TWO_DIGIT(min)}\u2032`;
};
