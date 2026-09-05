/**
 * Synastry — cross-chart relationship compatibility.
 *
 * Given two validated birth inputs, each is reduced to its natal chart (via
 * `computeNatalChart`, Ascendant included) and the ten personal planets of
 * person A are cross-aspect-read against the ten personal planets of person B.
 * Four relationship dimensions are scored from documented, deterministic
 * weightings; every score and sentence is derived strictly from the actual
 * computed placements. There is no randomness and no guarantee language —
 * the text simply describes how two real charts interact.
 */

import { computeNatalChart } from "@/lib/natal/natal";
import { validateBirth } from "@/lib/natal/validate";
import { SIGN_ELEMENTS } from "@/lib/natal/readings";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import type { BirthInput } from "@/lib/natal/validate";
import type { NatalPlanet } from "@/lib/natal/types";
import type { BodyKey } from "@/lib/astronomy/bodies";

export interface PersonInput {
  name?: string;
  birth: BirthInput;
}

export type SynastryAspectType =
  | "conjunction"
  | "opposition"
  | "trine"
  | "square"
  | "sextile";

export const ORBS: Record<SynastryAspectType, number> = {
  conjunction: 8,
  opposition: 8,
  trine: 8,
  square: 8,
  sextile: 6,
};

export const ASPECT_ANGLE: Record<SynastryAspectType, number> = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180,
};

/** Friendly, plural aspect names used in interpretation text. */
export const ASPECT_WORD: Record<SynastryAspectType, string> = {
  conjunction: "conjoint",
  opposition: "opposing",
  trine: "trine",
  square: "squaring",
  sextile: "sextile",
};

export interface SynastryAspect {
  aspectName: SynastryAspectType;
  bodyA: BodyKey;
  bodyB: BodyKey;
  /** Deviation from exact in degrees. */
  orb: number;
  signA: string;
  signB: string;
  interpretation: string;
}

export interface SynastryDimension {
  key: string;
  title: string;
  score: number;
  aspects: SynastryAspect[];
  summary: string;
}

export interface SynastryData {
  personA: { name: string };
  personB: { name: string };
  dimensions: SynastryDimension[];
  overallScore: number;
  aspects: SynastryAspect[];
  utcTimeA: string;
  utcTimeB: string;
}

/**
 * A validation-failing run returns a typed `{ok:false, errors}` instead of
 * throwing, so callers can surface a field-keyed message without try/catch.
 */
export type SynastryResult =
  | { ok: true; data: SynastryData }
  | { ok: false; errors: { personA?: string; personB?: string } };

const PERSONAL_BODIES: Exclude<BodyKey, "northNode" | "southNode">[] = [
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

const BODY_NAME: Record<string, string> = {
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
};

function signName(slug: string): string {
  return ZODIAC_SIGNS.find((s) => s.slug === slug)?.name ?? slug;
}

function elementLabel(slug: string): string {
  const el = SIGN_ELEMENTS[slug];
  return el ?? "fire";
}

/**
 * Documented weightings per dimension. Each entry maps an (aspectType) to a
 * signed score delta, applied identically across the dimension's aspect pairs
 * so results are reproducible. Positive = flow, negative = friction.
 */
const DIMENSION_ASPECTS: {
  key: string;
  title: string;
  pairs: Array<{ bodyA: BodyKey; bodyB: BodyKey }>;
  weights: Record<SynastryAspectType, number>;
  emphasis?: { bodyA: BodyKey; bodyB: BodyKey; bonus: number };
}[] = [
  {
    key: "emotional",
    title: "Emotional Connection",
    pairs: [
      { bodyA: "moon", bodyB: "moon" },
      { bodyA: "sun", bodyB: "moon" },
      { bodyA: "moon", bodyB: "venus" },
    ],
    weights: {
      conjunction: 8,
      sextile: 5,
      trine: 6,
      square: -4,
      opposition: -3,
    },
    emphasis: { bodyA: "moon", bodyB: "moon", bonus: 3 },
  },
  {
    key: "communication",
    title: "Communication",
    pairs: [
      { bodyA: "mercury", bodyB: "mercury" },
      { bodyA: "mercury", bodyB: "sun" },
    ],
    weights: {
      conjunction: 7,
      sextile: 5,
      trine: 6,
      square: -4,
      opposition: -3,
    },
  },
  {
    key: "attraction",
    title: "Attraction",
    pairs: [
      { bodyA: "venus", bodyB: "mars" },
      { bodyA: "mars", bodyB: "venus" },
      { bodyA: "sun", bodyB: "venus" },
      { bodyA: "sun", bodyB: "mars" },
    ],
    weights: {
      conjunction: 8,
      sextile: 5,
      trine: 6,
      square: -4,
      opposition: -3,
    },
  },
  {
    key: "stability",
    title: "Long-Term Stability",
    pairs: [
      { bodyA: "saturn", bodyB: "sun" },
      { bodyA: "saturn", bodyB: "moon" },
      { bodyA: "sun", bodyB: "sun" },
    ],
    weights: {
      conjunction: 6,
      sextile: 4,
      trine: 5,
      square: -5,
      opposition: -4,
    },
  },
];

/** Clamp a raw score into the 30–98 band. */
function clampScore(n: number): number {
  return Math.round(Math.max(30, Math.min(98, n)));
}

function signedSeparation(a: number, b: number): number {
  let d = ((b - a) % 360 + 360) % 360;
  if (d > 180) d -= 360;
  return d;
}

/** Classify a single cross-chart pair into its major aspect, or null. */
export function classifyAspect(
  lonA: number,
  lonB: number,
): { type: SynastryAspectType; orb: number } | null {
  const sep = Math.abs(signedSeparation(lonA, lonB));
  for (const type of Object.keys(ASPECT_ANGLE) as SynastryAspectType[]) {
    if (Math.abs(sep - ASPECT_ANGLE[type]) <= ORBS[type]) {
      return { type, orb: Math.abs(sep - ASPECT_ANGLE[type]) };
    }
  }
  return null;
}

function polarityWord(signA: string, signB: string): string {
  const elA = elementLabel(signA);
  const elB = elementLabel(signB);
  const harmonious = (elA === elB) || (elA === "fire" && elB === "air") || (elA === "air" && elB === "fire") || (elA === "earth" && elB === "water") || (elA === "water" && elB === "earth");
  return harmonious ? "aligned" : "contrasting";
}

function interpretAspect(
  roleA: string,
  roleB: string,
  bodyA: BodyKey,
  bodyB: BodyKey,
  signA: string,
  signB: string,
  type: SynastryAspectType,
): string {
  const nameA = BODY_NAME[bodyA] ?? bodyA;
  const nameB = BODY_NAME[bodyB] ?? bodyB;
  const pol = polarityWord(signA, signB);
  const theme =
    type === "conjunction"
      ? "merge into a single focused point of contact"
      : type === "sextile"
        ? "open a natural lane of cooperation"
        : type === "trine"
          ? "flow with little conscious effort"
          : type === "square"
            ? "generate friction that asks for conscious work"
            : "pull in opposite directions and ask for balance";
  return `${roleA}'s ${nameA} in ${signName(signA)} ${ASPECT_WORD[type]} ${roleB}'s ${nameB} in ${signName(signB)} — ${theme}; the two placements read ${pol}.`;
}

function buildDimension(
  dim: (typeof DIMENSION_ASPECTS)[number],
  byKeyA: Map<BodyKey, NatalPlanet>,
  byKeyB: Map<BodyKey, NatalPlanet>,
  roleA: string,
  roleB: string,
): SynastryDimension {
  const aspects: SynastryAspect[] = [];
  let raw = 50;
  let found = 0;

  for (const pair of dim.pairs) {
    const a = byKeyA.get(pair.bodyA);
    const b = byKeyB.get(pair.bodyB);
    if (!a || !b) continue;
    const cls = classifyAspect(a.longitude, b.longitude);
    if (!cls) continue;
    const bonus = dim.emphasis && pair.bodyA === dim.emphasis.bodyA && pair.bodyB === dim.emphasis.bodyB
      ? dim.emphasis.bonus
      : 0;
    const asp: SynastryAspect = {
      aspectName: cls.type,
      bodyA: pair.bodyA,
      bodyB: pair.bodyB,
      orb: cls.orb,
      signA: a.sign,
      signB: b.sign,
      interpretation: interpretAspect(
        roleA,
        roleB,
        pair.bodyA,
        pair.bodyB,
        a.sign,
        b.sign,
        cls.type,
      ),
    };
    aspects.push(asp);
    raw += dim.weights[cls.type] + bonus;
    found += 1;
  }

  const score = clampScore(raw);
  const summary =
    found === 0
      ? `No tight major aspects between these ${dim.title.toLowerCase()} planets — a neutral, low-key connection in this area, with nothing forcing the issue.`
      : `${roleA}'s and ${roleB}'s ${dim.title.toLowerCase()} planets produce ${found} tight major aspect${found === 1 ? "" : "s"}, scoring ${score}/100.`;

  return { key: dim.key, title: dim.title, score, aspects, summary };
}

/**
 * Compute a full synastry reading between two people at their birth charts.
 * `at` is accepted for API symmetry with the other time-dependent modules but
 * is not needed — cross-chart aspects depend only on the two birth charts.
 */
export function computeSynastry(
  personA: PersonInput,
  personB: PersonInput,
  _at?: Date,
): SynastryResult {
  const resA = validateBirth(personA.birth);
  const resB = validateBirth(personB.birth);
  if (!resA.ok || !resB.ok) {
    return {
      ok: false,
      errors: {
        personA: resA.ok ? undefined : "Birth details for the first person are invalid.",
        personB: resB.ok ? undefined : "Birth details for the second person are invalid.",
      },
    };
  }

  const chartA = computeNatalChart(
    resA.config!.date,
    { latitude: personA.birth.latitude, longitude: personA.birth.longitude },
    { timeAssumed: resA.config!.timeAssumed },
  );
  const chartB = computeNatalChart(
    resB.config!.date,
    { latitude: personB.birth.latitude, longitude: personB.birth.longitude },
    { timeAssumed: resB.config!.timeAssumed },
  );

  const byKeyA = new Map<BodyKey, NatalPlanet>(
    chartA.planets.map((p) => [p.key, p] as const),
  );
  const byKeyB = new Map<BodyKey, NatalPlanet>(
    chartB.planets.map((p) => [p.key, p] as const),
  );

  const roleA = personA.name?.trim() || "Person A";
  const roleB = personB.name?.trim() || "Person B";

  // All cross-chart aspects (used for the transparent list + interpreting).
  const allAspects: SynastryAspect[] = [];
  for (const ba of PERSONAL_BODIES) {
    for (const bb of PERSONAL_BODIES) {
      const a = byKeyA.get(ba);
      const b = byKeyB.get(bb);
      if (!a || !b) continue;
      const cls = classifyAspect(a.longitude, b.longitude);
      if (!cls) continue;
      allAspects.push({
        aspectName: cls.type,
        bodyA: ba,
        bodyB: bb,
        orb: cls.orb,
        signA: a.sign,
        signB: b.sign,
        interpretation: interpretAspect(roleA, roleB, ba, bb, a.sign, b.sign, cls.type),
      });
    }
  }

  const dimensions = DIMENSION_ASPECTS.map((dim) =>
    buildDimension(dim, byKeyA, byKeyB, roleA, roleB),
  );
  const overallScore = clampScore(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length,
  );

  return {
    ok: true,
    data: {
      personA: { name: roleA },
      personB: { name: roleB },
      dimensions,
      overallScore,
      aspects: allAspects,
      utcTimeA: chartA.utcTime,
      utcTimeB: chartB.utcTime,
    },
  };
}
