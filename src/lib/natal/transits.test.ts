import { describe, it, expect } from "vitest";
import { computeNatalChart } from "./natal";
import { upcomingTransits, ASPECT_ORBS } from "./transits";
import { getCelestialBody } from "@/lib/astronomy/bodies";
import type { NatalChart } from "./types";

const NYC = { latitude: 40.7128, longitude: -74.006 };

function chart(): NatalChart {
  return computeNatalChart(
    new Date(Date.UTC(1995, 5, 21, 12, 0, 0)),
    NYC,
    { timeAssumed: false },
  );
}

const AT = new Date(Date.UTC(2026, 0, 15, 12, 0, 0));

const ASPECT_NAMES = ["Conjunction", "Opposition", "Trine", "Square", "Sextile"] as const;
const AREAS = ["identity", "relationships", "inner life", "career", "growth", "energy"] as const;

function run(overrides: { maxEntries?: number } = {}): ReturnType<typeof upcomingTransits> {
  return upcomingTransits(chart(), AT, { horizonMonths: 4, stepDays: 7, maxEntries: 6, ...overrides });
}

describe("upcoming transits", () => {
  it("caps at maxEntries with fully valid entries", () => {
    const forecast = run();
    expect(forecast.length).toBeLessThanOrEqual(6);
    for (const entry of forecast) {
      expect(ASPECT_NAMES).toContain(entry.aspectName);
      expect(AREAS).toContain(entry.area);
      expect(entry.start.getTime()).toBeLessThanOrEqual(entry.peak.getTime());
      expect(entry.peak.getTime()).toBeLessThanOrEqual(entry.end.getTime());
      expect(entry.end.getTime()).toBeGreaterThanOrEqual(entry.start.getTime());
      expect(entry.note).toContain(getCelestialBody(entry.transitBody).name);
      expect(entry.note).toContain(getCelestialBody(entry.targetBody).name);
      expect(entry.note).toContain("from");
      expect(entry.note).not.toMatch(/TODO|lorem/i);
    }
  });

  it("respects the horizon: every peak falls inside it", () => {
    const forecast = run();
    const horizonEnd = AT.getTime() + 4 * 30 * 86400000;
    for (const entry of forecast) {
      expect(entry.start.getTime()).toBeGreaterThanOrEqual(AT.getTime());
      expect(entry.peak.getTime()).toBeLessThanOrEqual(horizonEnd);
    }
  });

  it("sorts entries by peak date ascending", () => {
    const forecast = run();
    for (let i = 1; i < forecast.length; i++) {
      expect(forecast[i].peak.getTime()).toBeGreaterThanOrEqual(forecast[i - 1].peak.getTime());
    }
  });

  it("honors the maxEntries option", () => {
    const forecast = run({ maxEntries: 2 });
    expect(forecast.length).toBeLessThanOrEqual(2);
  });

  it("uses the documented aspect orbs", () => {
    expect(ASPECT_ORBS.Sextile).toBe(4);
    expect(ASPECT_ORBS.Conjunction).toBe(6);
    expect(ASPECT_ORBS.Square).toBe(6);
  });

  it("is deterministic across two calls", () => {
    expect(run()).toEqual(run());
  });
});