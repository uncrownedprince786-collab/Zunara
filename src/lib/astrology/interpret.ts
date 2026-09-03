import type { PlanetarySnapshot, PlanetPosition } from "../astronomy/astro";
import type { ZodiacSign } from "../zodiac/zodiac";
import { getZodiacSign } from "../zodiac/zodiac";

export type Theme =
  | "love"
  | "career"
  | "money"
  | "energy"
  | "relationships"
  | "growth"
  | "communication"
  | "home"
  | "creativity"
  | "wellbeing";

export type Intensity = "strong" | "moderate" | "subtle";

export interface TransitNote {
  planet: string;
  message: string;
}

export interface Interpretation {
  signSlug: string;
  themes: Theme[];
  intensity: Intensity;
  sunSign: string;
  moonSign: string;
  rulerSign: string;
  activePlanets: string[];
  transitNotes: TransitNote[];
  dominantElements: string[];
  hint: string;
}

export const THEME_LABELS: Record<Theme, string> = {
  love: "Love",
  career: "Career",
  money: "Money",
  energy: "Energy",
  relationships: "Relationships",
  growth: "Growth",
  communication: "Communication",
  home: "Home",
  creativity: "Creativity",
  wellbeing: "Wellbeing",
};

export const PLANET_LABELS: Record<string, string> = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
  northNode: "North Node",
  southNode: "South Node",
};

const SOFT_THEMES = new Set([
  "love",
  "relationships",
  "growth",
  "communication",
  "harmony",
  "creativity",
  "wellbeing",
]);

const ASPECT_THEME: Record<string, Theme[]> = {
  sextile: ["growth", "communication"],
  trine: ["creativity", "wellbeing", "relationships"],
  square: ["career", "money"],
  opposition: ["relationships"],
};

/** Plain-language gloss for each major aspect, added so readers never have to decode jargon. */
const PLAIN_ASPECT: Record<string, string> = {
  conjunction: "two planets sitting close together, concentrating their energy on one theme",
  opposition: "two planets facing each other, gently pulling between two priorities",
  trine: "two planets working together easily, making things flow with less effort",
  square: "two planets at a hard angle, stirring a little productive friction or tension",
  sextile: "two planets in a comfortable angle, opening a helpful, low-key opportunity",
  quincunx: "two planets slightly out of step, asking for a small practical adjustment",
};

const PLANET_THEMES: Record<string, Set<Theme>> = {
  venus: new Set(["love", "money", "relationships"]),
  mars: new Set(["energy", "career"]),
  mercury: new Set(["communication", "growth"]),
  jupiter: new Set(["growth", "money", "career"]),
  saturn: new Set(["career", "money"]),
  sun: new Set(["creativity", "career"]),
  moon: new Set(["home", "wellbeing", "relationships"]),
  pluto: new Set(["growth", "money"]),
  uranus: new Set(["creativity", "career"]),
  neptune: new Set(["creativity", "wellbeing"]),
};

function rulerOf(sign: ZodiacSign, useModern = true): string {
  if (useModern && sign.modernRuler) return sign.modernRuler;
  return sign.ruler.toLowerCase();
}

export function interpret(snapshot: PlanetarySnapshot, sign: ZodiacSign): Interpretation {
  const posByKey = new Map<string, PlanetPosition>(snapshot.positions.map((p) => [p.key, p]));

  const sunPos = posByKey.get("sun");
  const moonPos = posByKey.get("moon");
  const sunSign = sunPos?.sign ?? sign.slug;
  const moonSign = moonPos?.sign ?? "";

  const themes = new Set<Theme>();
  const activePlanets = new Set<string>();
  const transitNotes: TransitNote[] = [];

  for (const aspect of snapshot.aspects) {
    for (const theme of ASPECT_THEME[aspect.name] ?? []) {
      themes.add(theme);
    }
  }

  const rulerName = rulerOf(sign, true);
  const rulerPos = posByKey.get(rulerName);
  const rulerSign = rulerPos?.sign ?? "";

  if (rulerPos) {
    activePlanets.add(PLANET_LABELS[rulerName] ?? rulerName);
    for (const t of PLANET_THEMES[rulerName] ?? []) {
      themes.add(t);
    }
    if (rulerPos.retrograde) {
      transitNotes.push({
        planet: PLANET_LABELS[rulerName] ?? rulerName,
        message: `Your ruling planet, ${PLANET_LABELS[rulerName]}, is currently retrograde, which in plain terms means it appears to move backwards in the sky. It is a good stretch for slowing down, revisiting and refining things rather than diving into brand-new starts.`,
      });
    }
  }

  for (const pos of snapshot.positions) {
    if (pos.sign === sign.slug) {
      activePlanets.add(PLANET_LABELS[pos.key] ?? pos.key);
      for (const t of PLANET_THEMES[pos.key] ?? []) {
        themes.add(t);
      }
    }
  }

  if (sunSign === sign.slug && sunPos) {
    themes.add("creativity");
  }

  if (moonSign === sign.slug) {
    activePlanets.add("Moon");
    themes.add("home");
    themes.add("wellbeing");
  }

  for (const aspect of snapshot.aspects) {
    if (aspect.bodyA === "sun" || aspect.bodyB === "sun") {
      const sunAspect = aspect.bodyA === "sun" ? aspect.bodyB : aspect.bodyA;
      const label = PLANET_LABELS[sunAspect] ?? sunAspect;
      transitNotes.push({
        planet: label,
        message: `The Sun forms a ${aspect.name} with ${label} — in plain terms, ${PLAIN_ASPECT[aspect.name] ?? "the two planets are interacting noticeably"}. This is ${aspect.applying ? "building toward" : "settling into"} a central theme for the day.`,
      });
    }
  }

  const elemCounts: Record<string, number> = {};
  for (const pos of snapshot.positions) {
    const sg = getZodiacSign(pos.sign);
    if (sg) elemCounts[sg.element] = (elemCounts[sg.element] ?? 0) + 1;
  }
  const dominantElements = Object.entries(elemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([e]) => e);

  const intensity: Intensity =
    snapshot.aspects.filter((a) => a.orb < 3).length >= 2
      ? "strong"
      : snapshot.aspects.length >= 3
        ? "moderate"
        : "subtle";

  const filteredThemes = Array.from(themes).filter((t) => SOFT_THEMES.has(t)) as Theme[];
  const uniqueThemes =
    filteredThemes.length > 0 ? Array.from(new Set(filteredThemes)) : [];

  const hint = buildHint(sign, new Set(uniqueThemes));

  return {
    signSlug: sign.slug,
    themes: uniqueThemes,
    intensity,
    sunSign,
    moonSign,
    rulerSign,
    activePlanets: Array.from(activePlanets),
    transitNotes,
    dominantElements,
    hint,
  };
}

function buildHint(sign: ZodiacSign, themes: Set<Theme>): string {
  const t = Array.from(themes);
  if (t.length === 0) return `A quietly balanced period for ${sign.name}.`;
  const first = THEME_LABELS[t[0]] ?? t[0];
  const second = t[1] ? ` and ${THEME_LABELS[t[1]]}` : "";
  return `This period leans toward ${first.toLowerCase()}${second.toLowerCase()} for ${sign.name}.`;
}
