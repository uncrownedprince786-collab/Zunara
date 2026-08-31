import type { ForecastContent } from "./engine";
import { DISCLAIMER } from "./engine";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const SAFETY_BLOCKLIST = [
  /diagnos/i,
  /\bcure\b/i,
  /\bguarantee\b/i,
  /\bwill\s+(definitely|certainly)\b/i,
  /medical advice/i,
  /legal advice/i,
];

export function validateForecast(content: ForecastContent): ValidationResult {
  const errors: string[] = [];

  if (!content.signSlug) errors.push("missing signSlug");
  if (!content.periodType) errors.push("missing periodType");
  if (!content.periodKeyStr) errors.push("missing periodKey");
  if (!content.overview || content.overview.trim().length < 20)
    errors.push("overview missing or too short");
  if (content.sections.length === 0) errors.push("no thematic sections");
  if (!content.advice || content.advice.trim().length < 20)
    errors.push("advice missing or too short");

  const fullText = content.overview + " " + content.sections.map((s) => s.content).join(" ") + " " + content.advice;

  for (const pattern of SAFETY_BLOCKLIST) {
    if (pattern.test(fullText)) {
      errors.push(`unsafe content matched: ${pattern}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function containsRequiredDisclaimer(content: ForecastContent): boolean {
  return content.disclaimer === DISCLAIMER || content.disclaimer.includes("not a substitute");
}

/** Simple Jaccard similarity between two forecasts over their prose sentences. */
export function jaccardSimilarity(a: ForecastContent, b: ForecastContent): number {
  const setA = new Set(sentences(a));
  const setB = new Set(sentences(b));
  if (setA.size === 0 && setB.size === 0) return 1;
  let inter = 0;
  for (const s of setA) if (setB.has(s)) inter++;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : inter / union;
}

function sentences(content: ForecastContent): string[] {
  const text =
    content.overview +
    " " +
    content.sections.map((s) => s.content).join(" ") +
    " " +
    content.advice;
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim().toLowerCase().replace(/\s+/g, " "))
    .filter((s) => s.length > 8);
}

/**
 * Detect duplication across a set of simultaneous forecasts (e.g. the 12
 * signs for one day). Returns pairs whose Jaccard similarity exceeds the
 * threshold.
 */
export function findDuplicates(
  forecasts: ForecastContent[],
  threshold = 0.35,
): Array<{ a: string; b: string; similarity: number }> {
  const pairs: Array<{ a: string; b: string; similarity: number }> = [];
  for (let i = 0; i < forecasts.length; i++) {
    for (let j = i + 1; j < forecasts.length; j++) {
      const sim = jaccardSimilarity(forecasts[i], forecasts[j]);
      if (sim >= threshold) {
        pairs.push({ a: forecasts[i].signSlug, b: forecasts[j].signSlug, similarity: sim });
      }
    }
  }
  return pairs;
}
