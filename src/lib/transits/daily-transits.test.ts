import { describe, it, expect } from "vitest";
import { computeNatalChart } from "@/lib/natal/natal";
import { dailyTransitInsights, daySummary, TRANSIT_BODIES, HOUSE_THEMES } from "./daily-transits";
import type { BirthInput } from "@/lib/natal/validate";

const FIXED_INPUT: BirthInput = {
  year: 1995,
  month: 6,
  day: 21,
  hour12: 12,
  minute: 0,
  ampm: "PM",
  timeKnown: true,
  latitude: 40.7128,
  longitude: -74.006,
  placeName: "New York, USA",
};

function makeChart() {
  return computeNatalChart(
    new Date(Date.UTC(1995, 5, 21, 16, 56, 0)),
    { latitude: 40.7128, longitude: -74.006 },
    { timeAssumed: false },
  );
}

const FIXED_AT = new Date(Date.UTC(2026, 8, 5, 12, 0, 0));

describe("daily transits", () => {
  it("produces one insight per personal planet (10 total)", () => {
    const chart = makeChart();
    const result = dailyTransitInsights(chart, FIXED_AT);
    expect(result.insights).toHaveLength(10);
    expect(result.insights.map((i) => i.transitBody).sort()).toEqual(
      [...TRANSIT_BODIES].sort(),
    );
  });

  it("keeps houses strictly within 1..12 and valid themes", () => {
    const chart = makeChart();
    const result = dailyTransitInsights(chart, FIXED_AT);
    for (const ins of result.insights) {
      expect(ins.house).toBeGreaterThanOrEqual(1);
      expect(ins.house).toBeLessThanOrEqual(12);
      expect(HOUSE_THEMES[ins.house]).toBeDefined();
      expect(ins.houseTheme.length).toBeGreaterThan(5);
      expect(ins.note.length).toBeGreaterThan(30);
    }
  });

  it("is deterministic across two calls", () => {
    const chart = makeChart();
    const a = dailyTransitInsights(chart, FIXED_AT);
    const b = dailyTransitInsights(chart, FIXED_AT);
    expect(a.insights.map((i) => i.note)).toEqual(b.insights.map((i) => i.note));
    expect(a.insights.map((i) => i.house)).toEqual(b.insights.map((i) => i.house));
  });

  it("notes are factual, frame topics, and avoid prediction language", () => {
    const chart = makeChart();
    const result = dailyTransitInsights(chart, FIXED_AT);
    for (const ins of result.insights) {
      expect(ins.note).toMatch(/transit|house|day|today|attention|focus|theme|centre/i);
      expect(ins.note).not.toContain("you will meet");
      expect(ins.note).not.toContain("you will fall");
      expect(ins.note).not.toContain("guaranteed");
      expect(ins.note).not.toContain("lorem");
    }
  });

  it("returns the day field matching the fixed timestamp", () => {
    const chart = makeChart();
    const result = dailyTransitInsights(chart, FIXED_AT);
    expect(result.day.getTime()).toBe(FIXED_AT.getTime());
  });

  it("daySummary produces a single plain-English paragraph", () => {
    const chart = makeChart();
    const result = dailyTransitInsights(chart, FIXED_AT);
    const summary = daySummary(chart, result);
    expect(summary.length).toBeGreaterThan(40);
    expect(summary).not.toContain("TODO");
    expect(summary.length).toBeLessThan(600);
  });

  it("daySummary is deterministic", () => {
    const chart = makeChart();
    const result = dailyTransitInsights(chart, FIXED_AT);
    expect(daySummary(chart, result)).toBe(daySummary(chart, result));
  });
});
