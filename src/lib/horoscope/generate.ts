import { computeSnapshot, type PlanetarySnapshot } from "../astronomy/astro";
import type { ZodiacSign } from "../zodiac/zodiac";
import { ZODIAC_SIGNS } from "../zodiac/zodiac";
import { interpret, type Interpretation } from "../astrology/interpret";
import { generateContent, type ForecastContent } from "../content/engine";
import { validateForecast, findDuplicates } from "../content/validate";
import type { PeriodType } from "../calendar/periods";
import { periodKey } from "../calendar/periods";

export interface GeneratedHoroscope {
  sign: ZodiacSign;
  snapshot: PlanetarySnapshot;
  interpretation: Interpretation;
  content: ForecastContent;
  valid: boolean;
}

export interface GenerationSummary {
  periodType: PeriodType;
  periodKeyStr: string;
  date: string;
  generatedCount: number;
  validCount: number;
  duplicatePairs: number;
  generatedAt: string;
}

export function generateForSign(
  sign: ZodiacSign,
  periodType: PeriodType,
  date: Date,
  snapshot?: PlanetarySnapshot,
): GeneratedHoroscope {
  const snap = snapshot ?? computeSnapshot(date, true);
  const interpretation = interpret(snap, sign);
  const content = generateContent(sign, snap, interpretation, periodType, date);
  const validation = validateForecast(content);
  return {
    sign,
    snapshot: snap,
    interpretation,
    content,
    valid: validation.valid,
  };
}

export function generateAllSigns(
  periodType: PeriodType,
  date: Date,
  snapshot?: PlanetarySnapshot,
): GeneratedHoroscope[] {
  const snap = snapshot ?? computeSnapshot(date, true);
  return ZODIAC_SIGNS.map((sign) => generateForSign(sign, periodType, date, snap));
}

export function summarizeGeneration(
  horoscopes: GeneratedHoroscope[],
  periodType: PeriodType,
  date: Date,
): GenerationSummary {
  const duplicatePairs = findDuplicates(horoscopes.map((h) => h.content));
  return {
    periodType,
    periodKeyStr: periodKey(periodType, date),
    date: date.toISOString(),
    generatedCount: horoscopes.length,
    validCount: horoscopes.filter((h) => h.valid).length,
    duplicatePairs: duplicatePairs.length,
    generatedAt: new Date().toISOString(),
  };
}
