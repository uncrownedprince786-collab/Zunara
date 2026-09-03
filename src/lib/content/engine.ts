import type { PlanetarySnapshot } from "../astronomy/astro";
import type { ZodiacSign } from "../zodiac/zodiac";
import type { Interpretation, Theme } from "../astrology/interpret";
import type { PeriodType } from "../calendar/periods";
import { periodKey } from "../calendar/periods";
import { computeSignals, type SignalSummary, type LifeArea, type SignalStrength } from "../astrology/signals";
import { computeChanges, type ChangeItem } from "../astrology/changes";
import { explainWhy, type WhyInput } from "../astrology/explain";
import { funFactForSign } from "./funfacts";
import { seededRandom, pick } from "./random";
import {
  OVERVIEW_FRAGMENTS,
  LOVE_BODY,
  CAREER_BODY,
  MONEY_BODY,
  ENERGY_BODY,
  ADVICE_BODY,
  THEME_SECONDS,
  GLANCE_OVERALL,
  GLANCE_BEST,
  GLANCE_WATCH,
  GLANCE_MOVE,
  WEEK_OPENINGS,
  MONTH_OPENINGS,
  YEAR_OPENINGS,
  NONE_NOTE,
} from "./fragments";

export interface Section {
  heading: string;
  content: string;
  theme: Theme | "overview" | "advice" | "glance" | "changes" | "technical";
}

export interface Glance {
  overall: string;
  bestFor: string;
  watchOutFor: string;
  bestMove: string;
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
  /** Signal strengths for the glance + ranked themes (daily-friendly). */
  signals: SignalSummary;
  /** "30 seconds" summary. */
  glance: Glance;
  /** A short, delightful celestial fact ("Did you know?"). */
  funFact: string;
  /** "What changed against the previous period" (global, real only). */
  changes: ChangeItem[];
  /** Transparent "why this forecast" inputs. */
  why: WhyInput;
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

/** Areas that appear as full written sections for a period, ranked by strength. */
function focusAreas(signals: SignalSummary, min: SignalStrength = "mild"): LifeArea[] {
  const order = ["love", "work", "money", "energy"] as LifeArea[];
  return signals.areas
    .filter((a) => a.present && strengthRank(a.strength) <= strengthRank(min))
    .sort((a, b) => strengthRank(a.strength) - strengthRank(b.strength))
    .map((a) => a.area)
    .filter((area, i, self) => self.indexOf(area) === i && order.includes(area));
}

function strengthRank(s: SignalStrength): number {
  switch (s) {
    case "strong":
      return 0;
    case "moderate":
      return 1;
    case "mild":
      return 2;
    case "none":
      return 3;
  }
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

  const signals = computeSignals(snapshot, sign);
  const areas = focusAreas(signals);

  const offsetDays = periodType === "daily" ? 1 : periodType === "weekly" ? 7 : 0;
  const changes = offsetDays > 0 ? computeChanges(date, snapshot, offsetDays) : [];

  const why = explainWhy(snapshot, sign, areas.length ? areas : (["love", "work", "money", "energy"] as LifeArea[]));

  const overview = introFor(sign, interpretation) + " " + pick(rng, OVERVIEW_FRAGMENTS);

  const sections = buildSections(rng, sign, periodType, areas, snapshot);

  const advice = pick(rng, ADVICE_INTROS) + pick(rng, ADVICE_BODY);
  const glance = buildGlance(rng, areas);

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
    signals,
    glance,
    funFact: funFactForSign(sign.slug),
    changes,
    why,
  };
}

function introFor(sign: ZodiacSign, interpretation: Interpretation): string {
  if (interpretation.hint) return interpretation.hint;
  return `A period of measured possibility for ${sign.name}.`;
}

function buildSections(
  rng: () => number,
  sign: ZodiacSign,
  periodType: PeriodType,
  areas: LifeArea[],
  snapshot: PlanetarySnapshot,
): Section[] {
  if (periodType === "daily") {
    if (areas.length === 0) {
      return [{ heading: "Steady Ground", content: pick(rng, OVERVIEW_FRAGMENTS), theme: "overview" }];
    }
    return areas.map((area) => buildAreaSection(rng, area));
  }

  if (periodType === "weekly") {
    const parts: Section[] = [
      { heading: "Your Week", content: pick(rng, WEEK_OPENINGS) + " " + pick(rng, OVERVIEW_FRAGMENTS), theme: "overview" },
    ];
    const strong = areas.length ? areas : dailyFallback();
    const listed = strong.slice(0, 2).map((a) => areaLabel(a).toLowerCase());
    parts.push({
      heading: "Strongest Themes",
      content: listed.length
        ? `The week leans most clearly toward ${listed.join(" and ")} for ${sign.name}, with the rest of your focus better held lightly.`
        : `The week is steady and even, without one theme dominating over the others.`,
      theme: "overview",
    });
    for (const area of strong.slice(0, 3)) parts.push(buildAreaSection(rng, area));
    parts.push({ heading: "What to Watch", content: pick(rng, GLANCE_WATCH), theme: "glance" });
    parts.push({ heading: "Your Best Move", content: pick(rng, GLANCE_MOVE), theme: "glance" });
    return parts;
  }

  if (periodType === "monthly") {
    const areasFor = areas.length ? areas : dailyFallback();
    const parts: Section[] = [
      { heading: "This Month", content: pick(rng, MONTH_OPENINGS) + " " + pick(rng, OVERVIEW_FRAGMENTS), theme: "overview" },
    ];
    const love = areasFor.includes("love") ? buildAreaSection(rng, "love") : neutralArea(rng, "love");
    const workMoney = (
      areasFor.includes("work") || areasFor.includes("money")
        ? combineAreas(rng, areasFor.filter((a) => a === "work" || a === "money"))
        : neutralArea(rng, "work")
    );
    const energy = areasFor.includes("energy") ? buildAreaSection(rng, "energy") : neutralArea(rng, "energy");
    parts.push({ heading: "Love", content: love.content, theme: "love" });
    parts.push({ heading: "Work & Money", content: workMoney.content, theme: "career" });
    parts.push({ heading: "Energy", content: energy.content, theme: "energy" });
    parts.push({ heading: "Important Periods", content: importantPeriods(rng, snapshot), theme: "overview" });
    parts.push({ heading: "Your Focus", content: pick(rng, GLANCE_MOVE), theme: "glance" });
    return parts;
  }

  // yearly
  {
    const areasFor = areas.length ? areas : dailyFallback();
    const parts: Section[] = [
      { heading: "Your Year Ahead", content: pick(rng, YEAR_OPENINGS) + " " + pick(rng, OVERVIEW_FRAGMENTS), theme: "overview" },
    ];
    parts.push({ heading: "Love", content: areasFor.includes("love") ? buildAreaSection(rng, "love").content : neutralArea(rng, "love").content, theme: "love" });
    parts.push({ heading: "Career", content: areasFor.includes("work") ? buildAreaSection(rng, "work").content : neutralArea(rng, "work").content, theme: "career" });
    parts.push({ heading: "Money", content: areasFor.includes("money") ? buildAreaSection(rng, "money").content : neutralArea(rng, "money").content, theme: "money" });
    parts.push({ heading: "Personal Growth", content: pick(rng, THEME_SECONDS.growth), theme: "growth" });
    parts.push({ heading: "Important Periods", content: importantPeriods(rng, snapshot), theme: "overview" });
    parts.push({ heading: "Your Year in One Line", content: pick(rng, GLANCE_MOVE), theme: "glance" });
    return parts;
  }
}

function dailyFallback(): LifeArea[] {
  return ["love", "work", "money", "energy"];
}

function buildAreaSection(rng: () => number, area: LifeArea): Section {
  switch (area) {
    case "love":
      return { heading: "Love", content: pick(rng, LOVE_INTROS) + " " + pick(rng, LOVE_BODY), theme: "love" };
    case "work":
      return { heading: "Work", content: pick(rng, CAREER_INTROS) + " " + pick(rng, CAREER_BODY), theme: "career" };
    case "money":
      return { heading: "Money", content: pick(rng, MONEY_INTROS) + " " + pick(rng, MONEY_BODY), theme: "money" };
    case "energy":
      return { heading: "Energy", content: pick(rng, ENERGY_INTROS) + " " + pick(rng, ENERGY_BODY), theme: "energy" };
  }
}

function combineAreas(rng: () => number, areas: LifeArea[]): Section {
  const content = areas
    .map((a) => buildAreaSection(rng, a).content)
    .join(" ");
  return { heading: "Work & Money", content, theme: "career" };
}

function neutralArea(rng: () => number, area: LifeArea): Section {
  const heading = area === "work" ? "Work & Money" : areaLabel(area);
  return { heading, content: pick(rng, NONE_NOTE), theme: "overview" };
}

function importantPeriods(rng: () => number, snapshot: PlanetarySnapshot): string {
  const retros = snapshot.positions.filter((p) => p.retrograde && p.key !== "northNode" && p.key !== "southNode");
  if (retros.length > 0) {
    const names = retros
      .map((p) => p.key.charAt(0).toUpperCase() + p.key.slice(1))
      .reduce<string[]>((acc, n) => (acc.includes(n) ? acc : [...acc, n]), []);
    const list = humanList(names);
    return `One thing to hold lightly: ${list} ${names.length > 1 ? "are" : "is"} retrograde for part of this period, favouring review and patience over rushed new starts. No specific dates are fixed; let the themes guide the timing.`;
  }
  return `There are no major retrograde stretches to time around this period. Steady momentum is the better guide than chasing any particular date.`;
}

function humanList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function buildGlance(
  rng: () => number,
  areas: LifeArea[],
): Glance {
  const lead = (areas[0] || "work") as LifeArea;
  const overall = pick(rng, GLANCE_OVERALL);
  const best = (GLANCE_BEST[lead] ?? GLANCE_BEST.work)[Math.floor(rng() * (GLANCE_BEST[lead] ?? GLANCE_BEST.work).length)];
  const watchOutFor = pick(rng, GLANCE_WATCH);
  const bestMove = pick(rng, GLANCE_MOVE);
  return { overall, bestFor: best, watchOutFor, bestMove };
}

function areaLabel(area: LifeArea): string {
  switch (area) {
    case "love":
      return "Love";
    case "work":
      return "Work";
    case "money":
      return "Money";
    case "energy":
      return "Energy";
  }
}
