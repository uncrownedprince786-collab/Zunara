import { computeSnapshot, type PlanetarySnapshot } from "@/lib/astronomy/astro";
import { getZodiacSign } from "@/lib/zodiac/zodiac";
import { interpret } from "@/lib/astrology/interpret";
import { generateContent, type ForecastContent } from "@/lib/content/engine";
import type { PeriodType } from "@/lib/calendar/periods";

export interface HoroscopeResult {
  overview: string;
  sections: ForecastContent["sections"];
  advice: string;
  disclaimer: string;
  seed: string;
  periodKeyStr: string;
  snapshot: PlanetarySnapshot;
  signals: ForecastContent["signals"];
  glance: ForecastContent["glance"];
  changes: ForecastContent["changes"];
  why: ForecastContent["why"];
}

/**
 * Public, deterministic content delivery. Generates a horoscope on the fly from
 * the real astronomical snapshot. Deterministic by construction, so the result
 * is identical whether generated here, stored, or fallen back to. ISR caches
 * the resulting HTML at the edge, avoiding per-request recomputation for
 * end users. This is the primary hot path: it never touches the database.
 */
export function getHoroscopeContent(
  signSlug: string,
  periodType: PeriodType,
  date: Date,
  snapshot?: PlanetarySnapshot,
): HoroscopeResult | null {
  const sign = getZodiacSign(signSlug);
  if (!sign) return null;
  const snap = snapshot ?? computeSnapshot(date, true);
  const interpretation = interpret(snap, sign);
  const content = generateContent(sign, snap, interpretation, periodType, date);
  return {
    overview: content.overview,
    sections: content.sections,
    advice: content.advice,
    disclaimer: content.disclaimer,
    seed: content.seed,
    periodKeyStr: content.periodKeyStr,
    snapshot: snap,
    signals: content.signals,
    glance: content.glance,
    changes: content.changes,
    why: content.why,
  };
}
