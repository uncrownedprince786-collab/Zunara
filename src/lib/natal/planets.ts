/**
 * Natal planet positions.
 *
 * Computes the ten geocentric tropical longitudes for an exact UTC instant
 * using `astronomy-engine` (VSOP87 planetary theory). Each body reports its
 * zodiac sign, degree/minute within the sign, and retrograde / direct status
 * derived from its apparent velocity (finite-difference over a small window).
 */
import { computePosition } from "@/lib/astronomy/astro";
import type { NatalBodyKey, NatalPlanet } from "./types";

export const NATAL_BODY_KEYS: NatalBodyKey[] = [
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

/**
 * Compute all ten planet positions for a UTC birth instant.
 * Throws if any required body cannot be resolved (a hard invariant of the
 * engine — we never silently drop a body that the readings depend on).
 */
export function natalPlanets(date: Date): NatalPlanet[] {
  const out: NatalPlanet[] = [];
  for (const key of NATAL_BODY_KEYS) {
    const pos = computePosition(key, date);
    if (!pos) {
      throw new Error(`natal: unable to compute position for ${key}`);
    }
    const degree = Math.floor(((pos.degreeInSign % 30) + 30) % 30);
    const minutes = Math.floor(((pos.degreeInSign - degree) % 1) * 60 + 1e-9);
    out.push({
      key,
      longitude: pos.longitude,
      sign: pos.sign,
      degreeInSign: pos.degreeInSign,
      degree,
      minutes,
      retrograde: pos.retrograde,
      speed: pos.speed,
    });
  }
  return out;
}

/** Convenience lookup from the computed array. */
export function byKey(planets: NatalPlanet[]): Map<NatalBodyKey, NatalPlanet> {
  return new Map(planets.map((p) => [p.key, p]));
}
