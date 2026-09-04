/**
 * Houses, Ascendant and Midheaven for a birth chart.
 *
 * The celestial frame is built from Greenwich Apparent Sidereal Time (GAST)
 * corrected by geographic longitude → Local Sidereal Time (LST). The Midheaven
 * is the point where the ecliptic crosses the local meridian; the Ascendant is
 * the point where it crosses the eastern horizon. Both are derived from the
 * `astronomy-engine` sidereal clock, so the results depend on the exact UTC
 * birth instant AND the observer's latitude/longitude.
 *
 * House division uses the **Whole Sign** system (the most robust and
 * mathematically sound division that cannot produce degenerate/non-wrapping
 * houses at extreme latitudes): house 1 is the entire zodiac sign containing
 * the Ascendant, and each subsequent cusp falls exactly 30° later. This
 * guarantees a valid, non-overlapping 12-house division anywhere on Earth.
 */
import { SiderealTime } from "astronomy-engine";
import { longitudeToSign } from "@/lib/astronomy/astro";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import type { BirthCoordinates, NatalHouses } from "./types";

/** Mean obliquity of the ecliptic (IAU 1980), in degrees, at a given UTC date. */
export function meanObliquity(date: Date): number {
  // Julian centuries from J2000.0 epoch.
  const j2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  const t = (date.getTime() - j2000) / (36525 * 86400000);
  return 23.43929111 - (46.815 * t + 0.00059 * t * t - 0.001813 * t * t * t) / 3600;
}

function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function atan2Deg(y: number, x: number): number {
  return normalizeDeg(Math.atan2(y, x) * (180 / Math.PI));
}

export function localSiderealTimeDegrees(date: Date, longitude: number): number {
  const gastHours = SiderealTime(date);
  const lst = (gastHours * 15 + longitude) % 360;
  return normalizeDeg(lst);
}

export function housesAt(date: Date, observer: BirthCoordinates): NatalHouses {
  const { latitude, longitude } = observer;
  const rams = localSiderealTimeDegrees(date, longitude);
  const obliquity = meanObliquity(date);

  const raRad = (rams * Math.PI) / 180;
  const epsRad = (obliquity * Math.PI) / 180;
  const latRad = (latitude * Math.PI) / 180;

  // Midheaven: atan2(sin(RAMC), cos(RAMC)·cos(ε))
  const mc = atan2Deg(Math.sin(raRad), Math.cos(raRad) * Math.cos(epsRad));

  // Ascendant: atan2(cos(RAMC), -(sin(RAMC)·cos(ε) + tan(λ)·sin(ε)))
  const asc = atan2Deg(
    Math.cos(raRad),
    -(Math.sin(raRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad)),
  );

  // Whole Sign houses: house 1 spans the ascendant's zodiac sign.
  const ascSignIndex = Math.floor(asc / 30);
  const house1Start = ascSignIndex * 30;
  const cusps = Array.from({ length: 12 }, (_, i) => {
    const longitude = normalizeDeg(house1Start + i * 30);
    const info = longitudeToSign(longitude);
    return {
      house: i + 1,
      sign: info.slug,
      longitude,
    };
  });

  return {
    ascendantLongitude: asc,
    ascendant: longitudeToSign(asc).slug,
    midheavenLongitude: mc,
    midheaven: longitudeToSign(mc).slug,
    localSiderealTime: rams / 15,
    rams,
    obliquity,
    cusps,
  };
}

/** Human-readable sign name for display. */
export function signName(slug: string): string {
  return ZODIAC_SIGNS.find((s) => s.slug === slug)?.name ?? slug;
}
