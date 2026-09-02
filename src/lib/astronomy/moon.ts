import { computePosition } from "./astro";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";

export const SYNODIC_MONTH = 29.53058867;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

export interface MoonPhaseResult {
  age: number;
  phase: number;
  illumination: number;
  name: string;
}

export function moonPhase(date: Date = new Date()): MoonPhaseResult {
  const days = (date.getTime() - KNOWN_NEW_MOON) / 86400000;
  const age = ((days % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const phase = age / SYNODIC_MONTH;
  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100);

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
