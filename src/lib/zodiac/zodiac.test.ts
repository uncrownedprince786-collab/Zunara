import { describe, it, expect } from "vitest";
import {
  ZODIAC_SIGNS,
  getZodiacSign,
  isZodiacSign,
  zodiacForDate,
  formatDateRange,
} from "./zodiac";

describe("zodiac data", () => {
  it("contains exactly 12 signs", () => {
    expect(ZODIAC_SIGNS.length).toBe(12);
  });

  it("has all required fields for every sign", () => {
    for (const sign of ZODIAC_SIGNS) {
      expect(sign.slug).toBeTruthy();
      expect(sign.name).toBeTruthy();
      expect(sign.glyph).toBeTruthy();
      expect(sign.symbolPath).toBeTruthy();
      expect(sign.element).toBeTruthy();
      expect(sign.modality).toBeTruthy();
      expect(sign.ruler).toBeTruthy();
      expect(sign.dateRange).toBeTruthy();
      expect(sign.description.length).toBeGreaterThan(50);
      expect(sign.traits.length).toBeGreaterThanOrEqual(5);
      expect(sign.keywords.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("getZodiacSign resolves by slug", () => {
    expect(getZodiacSign("leo")?.name).toBe("Leo");
    expect(getZodiacSign("nope")).toBeUndefined();
  });

  it("isZodiacSign validates slugs", () => {
    expect(isZodiacSign("pisces")).toBe(true);
    expect(isZodiacSign("dragon")).toBe(false);
  });

  describe("zodiacForDate", () => {
    it("assigns Aries for late March / April", () => {
      expect(zodiacForDate(2026, 3, 21).slug).toBe("aries");
      expect(zodiacForDate(2026, 4, 19).slug).toBe("aries");
    });
    it("assigns Taurus for late April / May", () => {
      expect(zodiacForDate(2026, 4, 20).slug).toBe("taurus");
    });
    it("assigns Pisces for late Feb / March", () => {
      expect(zodiacForDate(2026, 3, 20).slug).toBe("pisces");
      expect(zodiacForDate(2026, 2, 19).slug).toBe("pisces");
    });
    it("handles the Capricorn year wrap (Dec - Jan)", () => {
      expect(zodiacForDate(2026, 12, 25).slug).toBe("capricorn");
      expect(zodiacForDate(2026, 1, 15).slug).toBe("capricorn");
    });
    it("works in a leap year", () => {
      expect(zodiacForDate(2028, 2, 29).slug).toBe("pisces");
    });
    it("handles future years", () => {
      expect(zodiacForDate(2040, 7, 25).slug).toBe("leo");
    });
    it("covers the full calendar without gaps", () => {
      let prevSlug = "";
      const seen = new Set<string>();
      for (let m = 1; m <= 12; m++) {
        for (let d = 1; d <= 28; d++) {
          const slug = zodiacForDate(2026, m, d).slug;
          seen.add(slug);
          prevSlug = slug;
        }
      }
      expect(seen.size).toBe(12);
      void prevSlug;
    });
  });

  it("formatDateRange returns a readable range", () => {
    const aries = getZodiacSign("aries")!;
    expect(formatDateRange(aries)).toContain("March");
    expect(formatDateRange(aries)).toContain("21");
  });
});
