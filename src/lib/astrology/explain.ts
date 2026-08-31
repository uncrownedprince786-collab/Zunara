import type { PlanetarySnapshot, PlanetPosition, Aspect } from "../astronomy/astro";
import type { ZodiacSign } from "../zodiac/zodiac";
import type { LifeArea } from "./signals";

export interface BodyRef {
  key: string;
  name: string;
  position: string;
  retrograde: boolean;
}

export interface WhyInput {
  /** Planet/body positions driving the reading. */
  bodies: BodyRef[];
  /** The major aspects that shaped the strongest themes. */
  aspects: AspectRef[];
  /** One plain-language sentence connecting the inputs to the reading. */
  summary: string;
}

export interface AspectRef {
  bodyA: string;
  bodyB: string;
  name: string;
  orb: number;
}

const PLANET_NAMES: Record<string, string> = {
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

/** The body most associated with each life area. */
const AREA_BODY: Record<LifeArea, string> = {
  love: "venus",
  work: "sun",
  money: "jupiter",
  energy: "mars",
};

/**
 * Extract the transparent astronomical inputs behind an area-dominant reading.
 * All positions and aspects come directly from the real snapshot; nothing is
 * invented for decoration.
 */
export function explainWhy(
  snapshot: PlanetarySnapshot,
  sign: ZodiacSign,
  focusAreas: LifeArea[],
): WhyInput {
  const positions = new Map<string, PlanetPosition>(snapshot.positions.map((p) => [p.key, p]));
  const ruler = (sign.modernRuler ?? sign.ruler).toLowerCase();

  // Preferred bodies: the ruler plus the area rulers for the strongest areas.
  const wanted = new Set<string>([ruler]);
  for (const area of focusAreas.slice(0, 3)) {
    const body = AREA_BODY[area];
    if (body) wanted.add(body);
  }
  if (wanted.size < 3) {
    const sun = positions.get("sun");
    if (sun) wanted.add("sun");
  }

  const bodies: BodyRef[] = [];
  for (const key of wanted) {
    const p = positions.get(key);
    if (!p) continue;
    bodies.push({
      key,
      name: PLANET_NAMES[key] ?? p.key,
      position: p.position,
      retrograde: p.retrograde,
    });
  }

  // Aspects involving the chosen bodies or the Sun/Moon, most noticeable first.
  const aspects: AspectRef[] = snapshot.aspects
    .filter(
      (a) =>
        wanted.has(a.bodyA) ||
        wanted.has(a.bodyB) ||
        a.bodyA === "sun" ||
        a.bodyB === "sun",
    )
    .sort((a, b) => orbOrder(a) - orbOrder(b))
    .slice(0, 3)
    .map((a) => ({ bodyA: a.bodyA, bodyB: a.bodyB, name: a.name, orb: a.orb }));

  const summary = buildSummary(snapshot, sign, focusAreas, positions);

  return { bodies, aspects, summary };
}

function buildSummary(
  snapshot: PlanetarySnapshot,
  sign: ZodiacSign,
  focusAreas: LifeArea[],
  positions: Map<string, PlanetPosition>,
): string {
  const ruler = (sign.modernRuler ?? sign.ruler).toLowerCase();
  const rulerPos = positions.get(ruler);

  const areaNames = focusAreas
    .slice(0, 2)
    .map((a) => a.charAt(0).toUpperCase() + a.slice(1))
    .join(" and ");

  const anchor = areaNames || "the areas noted above";

  if (rulerPos) {
    const ret = rulerPos.retrograde ? ", now in review" : "";
    return `${sign.name}'s ruling planet, ${PLANET_NAMES[ruler]}, sits in ${rulerPos.sign}${ret}. That placement is what helps shape ${anchor} in today's reading.`;
  }

  return `The positions of the Sun, Moon and planets in the sky are what shape ${anchor} in today's reading.`;
}

function orbOrder(a: Aspect): number {
  return a.orb ?? 0;
}
