import { describe, it, expect } from "vitest";
import { computeNatalChart } from "./natal";
import { buildLifeGuidance } from "./guidance";
import type { NatalChart } from "./types";

const NYC = { latitude: 40.7128, longitude: -74.006 };

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

function chart(): NatalChart {
  return computeNatalChart(
    new Date(Date.UTC(1995, 5, 21, 12, 0, 0)),
    NYC,
    { timeAssumed: false },
  );
}

describe("life guidance", () => {
  it("produces exactly four sections with the expected ids", () => {
    const sections = buildLifeGuidance(chart());
    expect(sections).toHaveLength(4);
    expect(sections.map((s) => s.id).sort()).toEqual(["career", "inner", "love", "personality"]);
  });

  it("renders substantive, placement-citing copy for every section", () => {
    const sections = buildLifeGuidance(chart());
    for (const section of sections) {
      expect(section.title.length).toBeGreaterThan(3);
      expect(section.headline.length).toBeGreaterThan(5);
      expect(section.paragraphs.length).toBeGreaterThanOrEqual(2);
      for (const paragraph of section.paragraphs) {
        expect(paragraph.length).toBeGreaterThan(40);
        expect(paragraph).not.toMatch(/TODO|lorem/i);
        expect(SIGN_NAMES.some((name) => paragraph.includes(name))).toBe(true);
      }
    }
  });

  it("references a real 7th, 10th and 4th house cusp sign", () => {
    const c = chart();
    const sections = buildLifeGuidance(c);
    const cusps = new Map(c.houses.cusps.map((x) => [x.house, x.sign]));
    const cap = (slug: string) => slug.charAt(0).toUpperCase() + slug.slice(1);
    const seventhName = cap(cusps.get(7) ?? "");
    const tenthName = cap(cusps.get(10) ?? "");
    const fourthName = cap(cusps.get(4) ?? "");
    const love = sections.find((s) => s.id === "love")!;
    const career = sections.find((s) => s.id === "career")!;
    const inner = sections.find((s) => s.id === "inner")!;
    expect(love.paragraphs.join(" ")).toContain(seventhName);
    expect(career.paragraphs.join(" ")).toContain(tenthName);
    expect(inner.paragraphs.join(" ")).toContain(fourthName);
  });

  it("is deterministic across two calls", () => {
    expect(buildLifeGuidance(chart())).toEqual(buildLifeGuidance(chart()));
  });
});