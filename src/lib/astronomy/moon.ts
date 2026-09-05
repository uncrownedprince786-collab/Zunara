import * as AE from "astronomy-engine";
import { computePosition } from "./astro";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";

export const SYNODIC_MONTH = 29.53058867;

export interface MoonPhaseResult {
  age: number;
  phase: number;
  illumination: number;
  name: string;
}

/**
 * Precise lunar phase from the true geocentric sun–moon elongation.
 *
 * `AE.MoonPhase` returns the elongation in degrees (0 = New Moon, 180 = Full
 * Moon), which is fully sufficient to derive the age, cycle fraction and
 * illuminated fraction of the disc without relying on a synodic-month
 * approximation line.
 */
export function moonPhase(date: Date = new Date()): MoonPhaseResult {
  const elongation = AE.MoonPhase(date);
  const phase = elongation / 360;

  // Illuminated fraction of the visible disc: (1 − cos θ) / 2.
  const illumination = Math.round(
    (1 - Math.cos((elongation * Math.PI) / 180)) / 2 * 100,
  );
  const age = phase * SYNODIC_MONTH;

  let name: string;
  if (phase < 0.0625) name = "New Moon";
  else if (phase < 0.1875) name = "Waxing Crescent";
  else if (phase < 0.3125) name = "First Quarter";
  else if (phase < 0.4375) name = "Waxing Gibbous";
  else if (phase < 0.5625) name = "Full Moon";
  else if (phase < 0.6875) name = "Waning Gibbous";
  else if (phase < 0.8125) name = "Last Quarter";
  else if (phase < 0.9375) name = "Waning Crescent";
  else name = "New Moon";

  return { age, phase, name, illumination };
}

export interface MoonSignResult {
  sign: string;
  signName: string;
  glyph: string;
  degreeInSign: number;
  position: string;
  emoji: string | null;
}

export function moonSign(date: Date = new Date()): MoonSignResult | null {
  const pos = computePosition("moon", date);
  if (!pos) return null;
  const signData = ZODIAC_SIGNS.find((s) => s.slug === pos.sign);
  return {
    sign: pos.sign,
    signName: signData?.name ?? pos.sign,
    glyph: signData?.glyph ?? "",
    degreeInSign: pos.degreeInSign,
    position: pos.position,
    emoji: null,
  };
}
