import { describe, it, expect } from "vitest";
import { computeNatalChart } from "./natal";
import {
  saturnReturnWindow,
  nextSaturnReturn,
  quarterLifeWindow,
  progressedMoonChart,
  lifeMilestones,
} from "./life-phases";
import type { NatalChart } from "./types";

const NYC = { latitude: 40.7128, longitude: -74.006 };

const SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];

function chart(): NatalChart {
  return computeNatalChart(
    new Date(Date.UTC(1995, 5, 21, 12, 0, 0)),
    NYC,
    { timeAssumed: false },
  );
}

function at(): Date {
  return new Date(Date.UTC(2026, 0, 15, 12, 0, 0));
}

describe("saturn return", () => {
  it("reports bounded signed offsets", () => {
    const w = saturnReturnWindow(chart(), at());
    expect(Math.abs(w.offset)).toBeLessThanOrEqual(180);
    expect(w.transitLongitude).toBeGreaterThanOrEqual(0);
    expect(w.transitLongitude).toBeLessThan(360);
    expect(w.natalLongitude).toBeGreaterThanOrEqual(0);
    expect(w.natalLongitude).toBeLessThan(360);
    expect(typeof w.active).toBe("boolean");
  });

  it("finds the first Saturn return within one orbit of birth", () => {
    const c = chart();
    const r = nextSaturnReturn(c, new Date(c.utcTime))!;
    expect(r).not.toBeNull();
    expect(r.returnNumber).toBe(1);
    expect(r.startYear).toBeGreaterThan(2020);
    expect(r.startYear).toBeLessThanOrEqual(r.endYear);
    expect(r.startAge).toBeLessThanOrEqual(r.endAge);
    expect(r.label.toLowerCase()).toContain("saturn return");
  });

  it("is deterministic for a fixed reference date", () => {
    const c = chart();
    const a = nextSaturnReturn(c, at());
    const b = nextSaturnReturn(c, at());
    expect(a).toEqual(b);
  });
});

describe("quarter-life window", () => {
  it("is active exactly at age 25 and inactive at 20 and 40", () => {
    const c = chart();
    expect(quarterLifeWindow(c, new Date(Date.UTC(2020, 5, 21))).active).toBe(true);
    expect(quarterLifeWindow(c, new Date(Date.UTC(2015, 5, 21))).active).toBe(false);
    expect(quarterLifeWindow(c, new Date(Date.UTC(2035, 5, 21))).active).toBe(false);
  });

  it("exposes the calendar-year span and a plain label", () => {
    const q = quarterLifeWindow(chart(), new Date(Date.UTC(2020, 5, 21)));
    expect(q.startYear).toBe(2019);
    expect(q.endYear).toBe(2021);
    expect(q.label.length).toBeGreaterThan(40);
  });
});

describe("progressed moon", () => {
  it("returns a valid sign and a future sign change", () => {
    const p = progressedMoonChart(chart(), at())!;
    expect(p).not.toBeNull();
    expect(SIGNS).toContain(p.sign);
    expect(p.longitude).toBeGreaterThanOrEqual(0);
    expect(p.longitude).toBeLessThan(360);
    expect(p.nextSignChange).not.toBeNull();
    expect(p.nextSignChange!.getTime()).toBeGreaterThan(at().getTime());
    expect(p.note.length).toBeGreaterThan(20);
  });

  it("is deterministic for a fixed reference date", () => {
    const p1 = progressedMoonChart(chart(), at());
    const p2 = progressedMoonChart(chart(), at());
    expect(p1).toEqual(p2);
  });

  it("returns null when the moon is missing from the chart", () => {
    const c = chart();
    const partial: NatalChart = { ...c, planets: c.planets.filter((p) => p.key !== "moon") };
    expect(progressedMoonChart(partial, at())).toBeNull();
  });
});

describe("life milestones", () => {
  it("is sorted, capped, and never crashes on a missing moon", () => {
    const c = chart();
    const young = new Date(Date.UTC(2005, 5, 21)); // age 10, first return still ahead
    const ms = lifeMilestones(c, young);
    expect(ms.length).toBeGreaterThanOrEqual(3);
    expect(ms.length).toBeLessThanOrEqual(5);
    for (let i = 1; i < ms.length; i++) {
      expect(ms[i].startsAtAge).toBeGreaterThanOrEqual(ms[i - 1].startsAtAge);
    }
    for (const m of ms) {
      expect(m.title.length).toBeGreaterThan(3);
      expect(typeof m.active).toBe("boolean");
      expect(m.note.length).toBeGreaterThan(20);
    }
    expect(ms.map((m) => m.id)).toContain("quarter-life-window");

    const partial: NatalChart = { ...c, planets: c.planets.filter((p) => p.key !== "moon") };
    expect(() => lifeMilestones(partial, young)).not.toThrow();
  });

  it("is deterministic for a fixed reference date", () => {
    const a = lifeMilestones(chart(), at());
    const b = lifeMilestones(chart(), at());
    expect(a).toEqual(b);
  });
});