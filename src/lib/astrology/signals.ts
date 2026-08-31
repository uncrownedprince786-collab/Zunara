import type { PlanetarySnapshot, Aspect, PlanetPosition } from "../astronomy/astro";
import type { ZodiacSign } from "../zodiac/zodiac";

export type SignalStrength = "strong" | "moderate" | "mild" | "none";

export type LifeArea = "love" | "work" | "money" | "energy";

export interface AreaSignal {
  area: LifeArea;
  strength: SignalStrength;
  /** Planet keys that contributed to this signal (for "why this forecast"). */
  drivers: string[];
  /** True when there is a genuine astronomical basis for this area today. */
  present: boolean;
}

export interface ThemeSignal {
  theme: string;
  label: string;
  strength: SignalStrength;
  present: boolean;
}

export interface SignalSummary {
  areas: AreaSignal[];
  themes: ThemeSignal[];
  /** The strongest theme overall (label), or null when nothing is notable. */
  headline: string | null;
}

const HARD_ASPECTS = new Set(["square", "opposition"]);
const CONJUNCTION = "conjunction";

/** Which life areas a given planet's themes strongly express. */
const PLANET_AREAS: Record<string, LifeArea[]> = {
  venus: ["love", "money"],
  mars: ["energy", "work"],
  sun: ["work", "energy"],
  moon: ["love", "energy"],
  mercury: ["work"],
  jupiter: ["money", "work"],
  saturn: ["work", "money"],
  uranus: ["work", "energy"],
  neptune: ["love"],
  pluto: ["money", "work"],
};

/** The dominant life area of each planet. */
const PLANET_PRIMARY: Record<string, LifeArea> = {
  venus: "love",
  mars: "energy",
  sun: "work",
  moon: "love",
  mercury: "work",
  jupiter: "money",
  saturn: "work",
  uranus: "energy",
  neptune: "love",
  pluto: "money",
};

const AREA_LABELS: Record<LifeArea, string> = {
  love: "Love",
  work: "Work",
  money: "Money",
  energy: "Energy",
};

function rank(s: SignalStrength): number {
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

/** Stronger aspect (smaller orb) contributes more; hard aspects weigh extra. */
function aspectWeight(aspect: Aspect): number {
  const orb = aspect.orb ?? 0;
  let w = Math.max(1, Math.round(6 - orb));
  if (HARD_ASPECTS.has(aspect.name)) w += 1;
  if (aspect.name === CONJUNCTION) w += 1;
  return w;
}

/**
 * Label strength by how much an area stands out relative to the sign's own
 * average activity that day. This keeps the four signals genuinely distinct
 * (a real "headline" plus supporting areas) rather than a flat wall of
 * identical labels, while remaining a pure, deterministic function of the
 * real scores underneath.
 */
function relativeLabel(score: number, avg: number): SignalStrength {
  const ratio = avg <= 0 ? 1 : score / avg;
  if (ratio >= 1.35) return "strong";
  if (ratio >= 1.05) return "moderate";
  if (ratio >= 0.85) return "mild";
  return "none";
}

/**
 * Compute deterministic per-area and per-theme signal strengths for a sign
 * from the real planetary snapshot. Pure function of (snapshot, sign); no
 * randomness, no fabrication.
 */
export function computeSignals(snapshot: PlanetarySnapshot, sign: ZodiacSign): SignalSummary {
  const positions = new Map<string, PlanetPosition>(snapshot.positions.map((p) => [p.key, p]));

  const areaScores: Record<LifeArea, number> = { love: 0, work: 0, money: 0, energy: 0 };
  const areaDrivers: Record<LifeArea, Set<string>> = {
    love: new Set(),
    work: new Set(),
    money: new Set(),
    energy: new Set(),
  };

  const ruler = (sign.modernRuler ?? sign.ruler).toLowerCase();
  const rulerPos = positions.get(ruler);

  // Baseline presence: each planet gently supports its dominant area.
  for (const pos of snapshot.positions) {
    const primary = PLANET_PRIMARY[pos.key];
    if (!primary) continue;
    areaScores[primary] += 1;
    areaDrivers[primary].add(pos.key);
    if (pos.retrograde) {
      // A retrograde dominant body keeps its area active in a review key.
      areaScores[primary] += 1;
    }
    // A planet transiting the native sign strongly energises its themes.
    if (pos.sign === sign.slug) {
      for (const area of PLANET_AREAS[pos.key] ?? []) {
        areaScores[area] += 3;
        areaDrivers[area].add(pos.key);
      }
    }
  }

  // The native ruler, when it participates in an aspect, moves its themes.
  if (rulerPos) {
    for (const aspect of snapshot.aspects) {
      if (aspect.bodyA !== ruler && aspect.bodyB !== ruler) continue;
      const weight = aspectWeight(aspect);
      const other = aspect.bodyA === ruler ? aspect.bodyB : aspect.bodyA;
      const rulerArea = PLANET_PRIMARY[ruler];
      areaScores[rulerArea] += 2;
      areaDrivers[rulerArea].add(ruler);
      for (const area of PLANET_AREAS[other] ?? []) {
        areaScores[area] += weight;
        areaDrivers[area].add(other);
      }
    }
  }

  // Sun/Moon aspects ripple into the themes of the bodies they touch.
  for (const aspect of snapshot.aspects) {
    const involvesFast = aspect.bodyA === "sun" || aspect.bodyB === "sun" || aspect.bodyA === "moon" || aspect.bodyB === "moon";
    if (!involvesFast) continue;
    const other = aspect.bodyA === "sun" || aspect.bodyA === "moon" ? aspect.bodyB : aspect.bodyA;
    for (const area of PLANET_AREAS[other] ?? []) {
      areaScores[area] += aspectWeight(aspect);
      areaDrivers[area].add(other);
    }
  }

  // Tight aspects among the other bodies contribute to their primary areas.
  for (const aspect of snapshot.aspects) {
    if (aspect.orb == null || aspect.orb > 4) continue;
    const a = PLANET_PRIMARY[aspect.bodyA];
    const b = PLANET_PRIMARY[aspect.bodyB];
    if (a) {
      areaScores[a] += 1;
      areaDrivers[a].add(aspect.bodyA);
    }
    if (b) {
      areaScores[b] += 1;
      areaDrivers[b].add(aspect.bodyB);
    }
  }

  const avg = (areaScores.love + areaScores.work + areaScores.money + areaScores.energy) / 4 || 1;

  const areas: AreaSignal[] = (["love", "work", "money", "energy"] as LifeArea[]).map(
    (area) => {
      const strength = relativeLabel(areaScores[area], avg);
      return {
        area,
        strength,
        drivers: Array.from(areaDrivers[area]),
        present: strength !== "none",
      };
    },
  );

  const themes: ThemeSignal[] = (["love", "work", "money", "energy"] as LifeArea[])
    .map((area) => {
      const found = areas.find((a) => a.area === area)!;
      return {
        theme: area,
        label: AREA_LABELS[area],
        strength: found.strength,
        present: found.present,
      };
    })
    .sort((a, b) => rank(a.strength) - rank(b.strength));

  const presentThemes = themes.filter((t) => t.strength !== "none");
  const headline = presentThemes.length ? presentThemes[0].label : null;

  return { areas, themes, headline };
}

export function areaLabel(area: LifeArea): string {
  return AREA_LABELS[area];
}
