import { describe, it, expect } from "vitest";
import { ZODIAC_SIGNS } from "../zodiac/zodiac";
import { computeSnapshot } from "../astronomy/astro";
import { generateAllSigns, generateForSign } from "../horoscope/generate";
import { validateForecast, findDuplicates, jaccardSimilarity } from "./validate";
import { DISCLAIMER } from "./engine";

describe("content engine", () => {
  const date = new Date("2026-08-31T00:00:00Z");
  const snapshot = computeSnapshot(date, true);

  it("generates valid content for all 12 signs", () => {
    const all = generateAllSigns("daily", date, snapshot);
    expect(all.length).toBe(12);
    for (const h of all) {
      expect(h.valid).toBe(true);
      const v = validateForecast(h.content);
      expect(v.errors).toEqual([]);
    }
  });

  it("produces a disclaimer with required text", () => {
    const h = generateForSign(ZODIAC_SIGNS[0], "daily", date, snapshot);
    expect(h.content.disclaimer).toContain("not a substitute");
    expect(h.content.disclaimer).toBe(DISCLAIMER);
  });

  it("has thematic sections for each forecast", () => {
    const all = generateAllSigns("daily", date, snapshot);
    for (const h of all) {
      expect(h.content.sections.length).toBeGreaterThan(0);
    }
  });

  it("keeps cross-sign duplication below the threshold", () => {
    const all = generateAllSigns("daily", date, snapshot);
    const pairs = findDuplicates(all.map((h) => h.content), 0.35);
    expect(pairs).toEqual([]);
  });

  it("is deterministic for the same inputs", () => {
    const a = generateForSign(ZODIAC_SIGNS[0], "daily", date, snapshot);
    const b = generateForSign(ZODIAC_SIGNS[0], "daily", date, snapshot);
    expect(a.content.seed).toBe(b.content.seed);
    expect(a.content.overview).toBe(b.content.overview);
    expect(a.content.sections).toEqual(b.content.sections);
    expect(a.content.advice).toBe(b.content.advice);
  });

  it("varies content across signs", () => {
    const all = generateAllSigns("daily", date, snapshot);
    const first = all[0];
    let different = 0;
    for (const h of all.slice(1)) {
      if (h.content.overview !== first.content.overview) different++;
    }
    expect(different).toBeGreaterThan(0);
  });

  it("accepts low duplication for weekly forecasts across signs", () => {
    const all = generateAllSigns("weekly", date, snapshot);
    const pairs = findDuplicates(all.map((h) => h.content), 0.4);
    expect(pairs.length).toBeLessThan(all.length);
  });

  it("jaccardSimilarity is bounded and symmetric", () => {
    const a = generateForSign(ZODIAC_SIGNS[0], "daily", date, snapshot).content;
    const b = generateForSign(ZODIAC_SIGNS[1], "daily", date, snapshot).content;
    const sim = jaccardSimilarity(a, b);
    expect(sim).toBeGreaterThanOrEqual(0);
    expect(sim).toBeLessThan(1);
  });
});
