import type { PlanetarySnapshot } from "../astronomy/astro";
import type { ZodiacSign } from "../zodiac/zodiac";
import type { Interpretation, Theme } from "../astrology/interpret";
import { THEME_LABELS } from "../astrology/interpret";
import type { PeriodType } from "../calendar/periods";
import { periodKey } from "../calendar/periods";
import { seededRandom, pick, pickN } from "./random";
import {
  OVERVIEW_FRAGMENTS,
  LOVE_BODY,
  CAREER_BODY,
  MONEY_BODY,
  ENERGY_BODY,
  ADVICE_BODY,
  THEME_SECONDS,
} from "./fragments";

export interface Section {
  heading: string;
  content: string;
  theme: Theme | "overview" | "advice";
}

export interface ForecastContent {
  signSlug: string;
  periodType: PeriodType;
  periodKeyStr: string;
  seed: string;
  overview: string;
  sections: Section[];
  advice: string;
  disclaimer: string;
  generatedAt: string;
}

const LOVE_INTROS = [
  "In matters of the heart,",
  "When it comes to love,",
  "On the romantic front,",
  "For your closest connections,",
  "In partnership and affection,",
  "Around matters of the heart,",
  "In love and connection,",
  "Where intimacy is concerned,",
];

const CAREER_INTROS = [
  "In your work,",
  "Professionally,",
  "On the career front,",
  "At work,",
  "In professional matters,",
  "Where your ambitions live,",
  "In your professional life,",
];

const MONEY_INTROS = [
  "Financially,",
  "When it comes to money,",
  "On the fiscal front,",
  "In practical matters of money,",
  "Regarding finances,",
  "Where resources are concerned,",
  "In financial matters,",
];

const ENERGY_INTROS = [
  "On the energy front,",
  "In terms of vitality,",
  "For your energy,",
  "Regarding stamina,",
  "Where your vitality is concerned,",
  "In matters of energy and momentum,",
];

const ADVICE_INTROS = [
  "If there is one thing to carry with you, ",
  "A quiet note to hold onto: ",
  "Consider taking forward this thought: ",
  "The heart of the guidance is simple: ",
  "Let this be your touchstone: ",
  "Worth remembering through the hours ahead: ",
];

export const DISCLAIMER =
  "Zunara horoscopes are created for entertainment and reflection and are not a substitute for professional medical, legal, or financial advice.";

function transitFingerprint(snapshot: PlanetarySnapshot): string {
  return snapshot.positions
    .slice()
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((p) => `${p.key}:${p.sign}:${Math.round(p.degreeInSign)}`)
    .join("|");
}

export function generateContent(
  sign: ZodiacSign,
  snapshot: PlanetarySnapshot,
  interpretation: Interpretation,
  periodType: PeriodType,
  date: Date,
): ForecastContent {
  const key = periodKey(periodType, date);
  const fp = transitFingerprint(snapshot);
  const seed = `${sign.slug}|${periodType}|${key}|${fp}`;
  const rng = seededRandom(seed);

  const overview = introFor(sign, interpretation) + " " + pick(rng, OVERVIEW_FRAGMENTS);

  const sections: Section[] = [];
  const usedThemes = interpretation.themes.length > 0 ? interpretation.themes : (["growth"] as Theme[]);
  const selectedThemes = pickN(rng, usedThemes, Math.min(2, usedThemes.length));
  for (const theme of selectedThemes) {
    sections.push(buildSection(rng, theme));
  }

  const advice = pick(rng, ADVICE_INTROS) + pick(rng, ADVICE_BODY);

  return {
    signSlug: sign.slug,
    periodType,
    periodKeyStr: key,
    seed,
    overview,
    sections,
    advice,
    disclaimer: DISCLAIMER,
    generatedAt: new Date().toISOString(),
  };
}

function introFor(sign: ZodiacSign, interpretation: Interpretation): string {
  if (interpretation.hint) return interpretation.hint;
  return `A period of measured possibility for ${sign.name}.`;
}

function buildSection(rng: () => number, theme: Theme): Section {
  switch (theme) {
    case "love":
      return { heading: "Love", content: pick(rng, LOVE_INTROS) + " " + pick(rng, LOVE_BODY), theme };
    case "relationships":
      return { heading: "Relationships", content: pick(rng, LOVE_INTROS) + " " + pick(rng, LOVE_BODY), theme };
    case "career":
      return { heading: "Career", content: pick(rng, CAREER_INTROS) + " " + pick(rng, CAREER_BODY), theme };
    case "money":
      return { heading: "Money", content: pick(rng, MONEY_INTROS) + " " + pick(rng, MONEY_BODY), theme };
    case "energy":
      return { heading: "Energy", content: pick(rng, ENERGY_INTROS) + " " + pick(rng, ENERGY_BODY), theme };
    default: {
      const body = THEME_SECONDS[theme] ?? [];
      const intro = GENERAL_INTROS[theme] ?? "";
      return { heading: THEME_LABELS[theme] ?? "Focus", content: (intro ? intro + " " : "") + (body.length ? pick(rng, body) : pick(rng, ADVICE_BODY)), theme };
    }
  }
}

const GENERAL_INTROS: Partial<Record<Theme, string>> = {
  growth: "In matters of growth,",
  communication: "In your communication,",
  home: "At home,",
  creativity: "In creative matters,",
  wellbeing: "For your wellbeing,",
};
