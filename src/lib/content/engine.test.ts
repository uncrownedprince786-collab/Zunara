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

describe("product experience", () => {
  const date = new Date("2026-08-31T00:00:00Z");
  const snapshot = computeSnapshot(date, true);

  it("daily content carries the new structured fields", () => {
    const h = generateForSign(ZODIAC_SIGNS[0], "daily", date, snapshot);
    const c = h.content;
    expect(c.signals.areas).toHaveLength(4);
    expect(c.glance.overall.length).toBeGreaterThan(0);
    expect(c.glance.bestFor.length).toBeGreaterThan(0);
    expect(c.glance.watchOutFor.length).toBeGreaterThan(0);
    expect(c.glance.bestMove.length).toBeGreaterThan(0);
    expect(Array.isArray(c.changes)).toBe(true);
    expect(c.why.bodies.length).toBeGreaterThan(0);
    expect(c.why.summary.length).toBeGreaterThan(0);
  });

  it("daily sections are non-empty and headed", () => {
    const all = generateAllSigns("daily", date, snapshot);
    for (const h of all) {
      expect(h.content.sections.length).toBeGreaterThan(0);
      for (const s of h.content.sections) {
        expect(s.heading.length).toBeGreaterThan(0);
        expect(s.content.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("structured lead headings appear per period", () => {
    const weekly = generateForSign(ZODIAC_SIGNS[0], "weekly", date, snapshot).content.sections;
    expect(weekly[0].heading).toBe("Your Week");
    const month = generateForSign(ZODIAC_SIGNS[0], "monthly", date, snapshot).content.sections;
    expect(month[0].heading).toBe("This Month");
    const year = generateForSign(ZODIAC_SIGNS[0], "yearly", date, snapshot).content.sections;
    expect(year[0].heading).toBe("Your Year Ahead");
  });

  it("is deterministic across all new fields", () => {
    const a = generateForSign(ZODIAC_SIGNS[3], "daily", date, snapshot).content;
    const b = generateForSign(ZODIAC_SIGNS[3], "daily", date, snapshot).content;
    expect(a.glance).toEqual(b.glance);
    expect(a.signals).toEqual(b.signals);
    expect(a.changes).toEqual(b.changes);
    expect(a.why).toEqual(b.why);
  });

  it("daily readings differ between adjacent days", () => {
    const day1 = generateForSign(ZODIAC_SIGNS[0], "daily", new Date("2026-08-31T00:00:00Z")).content;
    const day2 = generateForSign(ZODIAC_SIGNS[0], "daily", new Date("2026-09-01T00:00:00Z")).content;
    expect(day1.overview !== day2.overview || day1.advice !== day2.advice).toBe(true);
  });

  it("avoids absolute and fear-based language", () => {
    const prohibited = [
      "you will definitely",
      "you will certainly",
      "guaranteed",
      "doomed",
      "disaster",
      "catastroph",
      "certain death",
    ];
    const all = generateAllSigns("daily", date, snapshot);
    for (const h of all) {
      const text =
        h.content.overview +
        " " +
        h.content.sections.map((s) => s.content).join(" ") +
        " " +
        h.content.advice;
      const lower = text.toLowerCase();
      for (const p of prohibited) {
        expect(lower.includes(p)).toBe(false);
      }
    }
  });

  it("does not invent fixed calendar dates in monthly content", () => {
    const month = generateForSign(ZODIAC_SIGNS[0], "monthly", date, snapshot).content;
    const text = month.sections.map((s) => s.content).join(" ");
    // "Important Periods" must not fabricate specific dates.
    expect(/on (the |\b)?\d{1,2}(st|nd|rd|th)? of|\d{1,2}\/\d{1,2}/i.test(text)).toBe(false);
  });

  it("daily reading length stays within a sane window", () => {
    const all = generateAllSigns("daily", date, snapshot);
    for (const h of all) {
      const text =
        h.content.overview +
        " " +
        h.content.sections.map((s) => s.content).join(" ") +
        " " +
        h.content.advice;
      const words = text.trim().split(/\s+/).length;
      expect(words).toBeGreaterThan(40);
      expect(words).toBeLessThanOrEqual(260);
    }
  });
});
