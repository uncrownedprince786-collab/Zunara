/**
 * Night-sky positions for the interactive sky map.
 *
 * Thin wrapper around astronomy-engine's topocentric equatorial + horizon
 * functions. For a given observer (lat/lon/height) and instant, it resolves
 * the Sun, Moon, the five naked-eye planets and a curated set of bright stars
 * to horizon altitude/azimuth coordinates (degrees), which the canvas component
 * projects onto a dome. Everything here is pure and deterministic.
 */
import * as AE from "astronomy-engine";
import type { BodyKey } from "@/lib/astronomy/bodies";

export interface ObserverPoint {
  latitude: number;
  longitude: number;
  height?: number;
}

export interface SkyPoint {
  /** Azimuth in degrees, measured eastward from true north (0=N, 90=E). */
  azimuth: number;
  /** Altitude in degrees above the horizon (−90 below, +90 zenith). */
  altitude: number;
}

export interface BodySkyPoint extends SkyPoint {
  id: string;
  label: string;
  glyph: string;
  kind: "planet" | "star";
  magnitude: number;
}

const AE_BODY_BY_KEY: Partial<Record<BodyKey, AE.Body>> = {
  sun: AE.Body.Sun,
  moon: AE.Body.Moon,
  mercury: AE.Body.Mercury,
  venus: AE.Body.Venus,
  mars: AE.Body.Mars,
  jupiter: AE.Body.Jupiter,
  saturn: AE.Body.Saturn,
  uranus: AE.Body.Uranus,
  neptune: AE.Body.Neptune,
  pluto: AE.Body.Pluto,
};

/** Bright stars the map can render without a full star catalogue. */
export const BRIGHT_STARS: { label: string; ra: number; dec: number; magnitude: number; constellation: string }[] = [
  { label: "Sirius", ra: 6.7525, dec: -16.716, magnitude: -1.46, constellation: "Canis Major" },
  { label: "Canopus", ra: 6.3982, dec: -52.696, magnitude: -0.74, constellation: "Carina" },
  { label: "Arcturus", ra: 14.26, dec: 19.182, magnitude: -0.05, constellation: "Bootes" },
  { label: "Vega", ra: 18.6156, dec: 38.784, magnitude: 0.03, constellation: "Lyra" },
  { label: "Capella", ra: 5.2773, dec: 45.998, magnitude: 0.08, constellation: "Auriga" },
  { label: "Rigel", ra: 5.2423, dec: -8.202, magnitude: 0.13, constellation: "Orion" },
  { label: "Procyon", ra: 7.655, dec: 5.225, magnitude: 0.34, constellation: "Canis Minor" },
  { label: "Betelgeuse", ra: 5.9195, dec: 7.407, magnitude: 0.5, constellation: "Orion" },
  { label: "Altair", ra: 19.846, dec: 8.868, magnitude: 0.77, constellation: "Aquila" },
  { label: "Aldebaran", ra: 4.5986, dec: 16.509, magnitude: 0.85, constellation: "Taurus" },
  { label: "Antares", ra: 16.4899, dec: -26.432, magnitude: 0.96, constellation: "Scorpius" },
  { label: "Spica", ra: 13.419, dec: -11.161, magnitude: 0.98, constellation: "Virgo" },
  { label: "Polaris", ra: 2.5303, dec: 89.264, magnitude: 1.98, constellation: "Ursa Minor" },
  { label: "Deneb", ra: 20.691, dec: 45.28, magnitude: 1.25, constellation: "Cygnus" },
  { label: "Regulus", ra: 10.1395, dec: 11.967, magnitude: 1.36, constellation: "Leo" },
  { label: "Fomalhaut", ra: 22.9594, dec: -29.622, magnitude: 1.16, constellation: "Piscis Austrinus" },
];

/**
 * Resolve altitude/azimuth for a bright star from its fixed J2000 equatorial
 * coordinates (right ascension in hours, declination in degrees).
 */
export function starSkyPoint(
  raHours: number,
  decDeg: number,
  observer: ObserverPoint,
  date: Date,
): SkyPoint {
  const obs = new AE.Observer(observer.latitude, observer.longitude, observer.height ?? 0);
  const horiz = AE.Horizon(date, obs, raHours * 15, decDeg, "normal");
  return { azimuth: horiz.azimuth, altitude: horiz.altitude };
}

/**
 * Resolve altitude/azimuth for a solar-system body by topocentric equatorial
 * (of-date) coordinates.
 */
export function bodySkyPoint(
  key: BodyKey,
  observer: ObserverPoint,
  date: Date,
): SkyPoint | null {
  const body = AE_BODY_BY_KEY[key];
  if (!body) return null;
  try {
    const obs = new AE.Observer(observer.latitude, observer.longitude, observer.height ?? 0);
    const eq = AE.Equator(body, date, obs, true, true);
    const horiz = AE.Horizon(date, obs, eq.ra, eq.dec, "normal");
    return { azimuth: horiz.azimuth, altitude: horiz.altitude };
  } catch {
    return null;
  }
}

/**
 * Produce the full body list the map should draw: Sun, Moon, the five naked-eye
 * planets (Mercury–Saturn), and the bright stars that are currently above the
 * horizon at the observer's location.
 */
export function computeSkyBodies(
  observer: ObserverPoint,
  date: Date,
): BodySkyPoint[] {
  const points: BodySkyPoint[] = [];
  const add = (id: string, label: string, glyph: string, kind: "planet" | "star", magnitude: number, p: SkyPoint | null) => {
    if (!p) return;
    points.push({ id, label, glyph, kind, magnitude, azimuth: p.azimuth, altitude: p.altitude });
  };

  const BODY_META: { key: BodyKey; id: string; label: string; glyph: string; magnitude: number }[] = [
    { key: "sun", id: "sun", label: "Sun", glyph: "☉", magnitude: -26.7 },
    { key: "moon", id: "moon", label: "Moon", glyph: "☽", magnitude: -12.7 },
    { key: "mercury", id: "mercury", label: "Mercury", glyph: "☿", magnitude: -0.4 },
    { key: "venus", id: "venus", label: "Venus", glyph: "♀", magnitude: -4.4 },
    { key: "mars", id: "mars", label: "Mars", glyph: "♂", magnitude: 0.7 },
    { key: "jupiter", id: "jupiter", label: "Jupiter", glyph: "♃", magnitude: -2.0 },
    { key: "saturn", id: "saturn", label: "Saturn", glyph: "♄", magnitude: 0.6 },
  ];
  for (const meta of BODY_META) {
    add(meta.id, meta.label, meta.glyph, "planet", meta.magnitude, bodySkyPoint(meta.key, observer, date));
  }

  for (const star of BRIGHT_STARS) {
    const p = starSkyPoint(star.ra, star.dec, observer, date);
    add(star.label, star.label, "✦", "star", star.magnitude, p);
  }

  return points;
}
