/**
 * Shared types for the natal (birth chart) engine.
 *
 * The engine is pure and deterministic: the same UTC birth instant + observer
 * coordinates always produce the same chart. No randomness, no placeholder
 * fallbacks — every value is computed from `astronomy-engine` (VSOP87 theory).
 */

export type NatalBodyKey =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto";

export interface NatalPlanet {
  key: NatalBodyKey;
  /** Geocentric tropical ecliptic longitude in degrees [0, 360) */
  longitude: number;
  /** Zodiac sign slug (aries..pisces) */
  sign: string;
  /** Degrees within the sign [0, 30) */
  degreeInSign: number;
  /** Whole degree 0..29 */
  degree: number;
  /** Arc-minutes within the degree 0..59 */
  minutes: number;
  /** True for apparent retrograde motion (westward) */
  retrograde: boolean;
  /** Apparent speed in degrees/day (positive = direct) */
  speed: number;
}

export interface BirthCoordinates {
  /** Geographic latitude in degrees, north positive */
  latitude: number;
  /** Geographic longitude in degrees, east positive */
  longitude: number;
}

export interface NatalChart {
  /** Exact UTC ISO string of the birth instant used */
  utcTime: string;
  /** True when the birth time was assumed (12:00 Noon UTC) */
  timeAssumed: boolean;
  /** Human-readable note surfaced to the user about time assumption */
  timeNote: string;
  /** Solar, lunar and rising signs (the "Big Three") */
  bigThree: {
    sun: NatalPlanet;
    moon: NatalPlanet;
    ascendant: string;
  };
  /** All ten planets */
  planets: NatalPlanet[];
  /** Ascendant/Midheaven + 12 Whole-Sign house cusps */
  houses: NatalHouses;
  /** Derived predetermined life readings */
  readings: NatalReadings;
  engineVersion: string;
  observer: BirthCoordinates;
}

export interface NatalHouses {
  /** Ascendant (rising sign) tropical ecliptic longitude [0,360) */
  ascendantLongitude: number;
  /** Ascendant sign slug */
  ascendant: string;
  /** Midheaven (MC) tropical ecliptic longitude [0,360) */
  midheavenLongitude: number;
  /** Midheaven sign slug */
  midheaven: string;
  /** Local Sidereal Time in sidereal hours [0,24) */
  localSiderealTime: number;
  /** Right Ascension of the Midheaven in degrees */
  rams: number;
  /** Obliquity of the ecliptic in degrees at birth */
  obliquity: number;
  /** Twelve Whole-Sign house cusps (each = ascendant sign boundary + 30°·n) */
  cusps: { house: number; sign: string; longitude: number }[];
}

export interface LifeReading {
  key: "love" | "career" | "wealth" | "life";
  title: string;
  headline: string;
  body: string;
  /** The placements that drive this reading (for transparency) */
  drivers: string[];
}

export interface NatalReadings {
  love: LifeReading;
  career: LifeReading;
  wealth: LifeReading;
  life: LifeReading;
}
