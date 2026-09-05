/**
 * Natal transit aspects.
 *
 * Pure, deterministic aspect engine over the computed planetary longitudes.
 * For every ordered pair of the ten bodies it finds the single tightest major
 * aspect within tolerance (conjunction, sextile, square, trine or opposition),
 * reports the exact orb and whether the faster body is applying toward or
 * separating from exactness. Every entry carries a short interpretation built
 * from the two bodies' roles — no randomness, no placeholder text.
 */
import type { NatalBodyKey, NatalPlanet, NatalAspect, NatalAspectType } from "./types";

export interface AspectOrbs {
  conjunction: number;
  opposition: number;
  square: number;
  trine: number;
  sextile: number;
}

/** Classical default orbs: luminaries/bodies use generous orbs for major aspects. */
export const DEFAULT_ORBS: AspectOrbs = {
  conjunction: 8,
  opposition: 8,
  square: 7,
  trine: 8,
  sextile: 6,
};

export const ASPECT_ANGLE: Record<NatalAspectType, number> = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180,
};

const ASPECT_ORDER: NatalAspectType[] = [
  "conjunction",
  "sextile",
  "square",
  "trine",
  "opposition",
];

const BODY_GLOSS: Record<NatalBodyKey, string> = {
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

const ASPECT_THEME: Record<NatalAspectType, string> = {
  conjunction: "they merge into a single focused force",
  sextile: "they open natural opportunities for cooperation",
  square: "they stir friction that demands conscious growth",
  trine: "they flow with effortless ease and support",
  opposition: "they pull in opposite directions and call for balance",
};

/** Signed shortest angular separation [a-b] in (-180, 180]. */
function signedSep(a: number, b: number): number {
  let d = ((b - a) % 360 + 360) % 360;
  if (d > 180) d -= 360;
  return d;
}

/**
 * Exact analytic "applying / separating" test.
 *
 * Fold the prograde separation into [0,180] (`u`), where the aspect trig
 * point for a major aspect type sits. The separation advances at the relative
 * signed speed `r` (degrees/day), so the derivative of the distance-to-exact
 * is `sign(u − target) · ũ` where `ũ = r` on the first half of the circle and
 * `−r` on the folded second half. A negative derivative means the pair is
 * closing toward exactness (applying).
 */
function isApplying(pa: NatalPlanet, pb: NatalPlanet, target: number): boolean {
  const s = ((pb.longitude - pa.longitude) % 360 + 360) % 360;
  const u = s <= 180 ? s : 360 - s;
  const r = pb.speed - pa.speed;
  const udot = s <= 180 ? r : -r;
  if (Math.abs(u - target) < 1e-9) return false;
  return Math.sign(u - target) * udot < 0;
}

function interpret(a: NatalBodyKey, b: NatalBodyKey, type: NatalAspectType): string {
  const aGloss = BODY_GLOSS[a] ?? "one axis of your chart";
  const bGloss = BODY_GLOSS[b] ?? "another axis of your chart";
  const theme = ASPECT_THEME[type];
  return `${aGloss.charAt(0).toUpperCase()}${aGloss.slice(1)} and ${bGloss} — ${theme}.`;
}

export function computeAspects(
  planets: NatalPlanet[],
  orbs: AspectOrbs = DEFAULT_ORBS,
): NatalAspect[] {
  const out: NatalAspect[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const pa = planets[i];
      const pb = planets[j];
      const sep = Math.abs(signedSep(pa.longitude, pb.longitude));
      for (const type of ASPECT_ORDER) {
        const target = ASPECT_ANGLE[type];
        const orb = Math.abs(sep - target);
        if (orb <= orbs[type]) {
          out.push({
            a: pa.key,
            b: pb.key,
            type,
            angle: sep,
            orb,
            applying: isApplying(pa, pb, target),
            interpretation: interpret(pa.key, pb.key, type),
          });
          break;
        }
      }
    }
  }
  return out.sort((x, y) => x.orb - y.orb);
}