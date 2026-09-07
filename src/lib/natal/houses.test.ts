import { describe, it, expect } from "vitest";
import { housesAt } from "@/lib/natal/houses";
import { computeAspects, DEFAULT_ORBS } from "@/lib/natal/aspects";
import type { NatalPlanet, NatalBodyKey, BirthCoordinates } from "@/lib/natal/types";

const FIXED_DATE = new Date("2026-06-21T06:30:00Z");

const COORDINATES: Array<{ label: string; coords: BirthCoordinates }> = [
  { label: "equator (lat 0°)", coords: { latitude: 0, longitude: 0 } },
  { label: "mid-north (lat 40°)", coords: { latitude: 40, longitude: -74 } },
  { label: "mid-south (lat -40°)", coords: { latitude: -40, longitude: 150 } },
  { label: "arctic circle (lat 66.5°)", coords: { latitude: 66.5, longitude: 25 } },
  { label: "antarctic circle (lat -66.5°)", coords: { latitude: -66.5, longitude: -120 } },
  { label: "high arctic (lat 80°)", coords: { latitude: 80, longitude: 10 } },
  { label: "high antarctic (lat -80°)", coords: { latitude: -80, longitude: 45 } },
  { label: "dateline (lat 40°, lon 180)", coords: { latitude: 40, longitude: 180 } },
  { label: "negative lon (lat -40°, lon -120)", coords: { latitude: -40, longitude: -120 } },
];

describe("housesAt: finite outputs and valid ranges", () => {
  for (const { label, coords } of COORDINATES) {
    it(label, () => {
      const h = housesAt(FIXED_DATE, coords);

      expect(Number.isFinite(h.ascendantLongitude)).toBe(true);
      expect(h.ascendantLongitude).toBeGreaterThanOrEqual(0);
      expect(h.ascendantLongitude).toBeLessThan(360);

      expect(Number.isFinite(h.midheavenLongitude)).toBe(true);
      expect(h.midheavenLongitude).toBeGreaterThanOrEqual(0);
      expect(h.midheavenLongitude).toBeLessThan(360);

      expect(Number.isFinite(h.obliquity)).toBe(true);
      expect(h.obliquity).toBeGreaterThan(23);
      expect(h.obliquity).toBeLessThan(24);

      expect(Number.isFinite(h.rams)).toBe(true);
      expect(h.cusps).toHaveLength(12);
    });
  }
});

describe("housesAt: deterministic across two calls", () => {
  for (const { label, coords } of COORDINATES) {
    it(label, () => {
      const a = housesAt(FIXED_DATE, coords);
      const b = housesAt(FIXED_DATE, coords);
      expect(a.ascendantLongitude).toBe(b.ascendantLongitude);
      expect(a.midheavenLongitude).toBe(b.midheavenLongitude);
      expect(a.ascendant).toBe(b.ascendant);
      expect(a.midheaven).toBe(b.midheaven);
      expect(a.cusps).toEqual(b.cusps);
    });
  }
});

describe("housesAt: no exceptions for any input", () => {
  const edgeDates = [
    new Date("2000-01-01T00:00:00Z"),
    new Date("2024-02-29T12:00:00Z"),
    new Date("2100-12-31T23:59:59Z"),
  ];

  for (const date of edgeDates) {
    for (const { coords } of COORDINATES) {
      it(`date=${date.toISOString()} lat=${coords.latitude} lon=${coords.longitude}`, () => {
        expect(() => housesAt(date, coords)).not.toThrow();
      });
    }
  }
});

function fakePlanet(
  key: NatalBodyKey,
  longitude: number,
  speed: number,
): NatalPlanet {
  return {
    key,
    longitude: ((longitude % 360) + 360) % 360,
    sign: "",
    degreeInSign: longitude % 30,
    degree: 0,
    minutes: 0,
    retrograde: speed < 0,
    speed,
  };
}

describe("aspects: edge cases", () => {
  it("detects conjunction at 0° orb (exact conjunction)", () => {
    const planets = [fakePlanet("sun", 45, 1), fakePlanet("moon", 45, 13)];
    const aspects = computeAspects(planets);
    const conj = aspects.find(
      (a) =>
        a.type === "conjunction" &&
        ((a.a === "sun" && a.b === "moon") || (a.a === "moon" && a.b === "sun")),
    );
    expect(conj).toBeDefined();
    expect(conj!.orb).toBeCloseTo(0, 10);
  });

  it("does not detect conjunction when separation exceeds max orb", () => {
    const planets = [fakePlanet("sun", 0, 1), fakePlanet("mars", 20, 0.7)];
    const aspects = computeAspects(planets);
    const conj = aspects.find(
      (a) =>
        a.type === "conjunction" &&
        ((a.a === "sun" && a.b === "mars") || (a.a === "mars" && a.b === "sun")),
    );
    expect(conj).toBeUndefined();
  });

  it("does not detect any aspect for a very wide separation", () => {
    const planets = [fakePlanet("sun", 0, 1), fakePlanet("pluto", 15, 0.1)];
    const aspects = computeAspects(planets);
    expect(aspects).toHaveLength(0);
  });

  it("custom small orb rejects a conjunction that default orbs would catch", () => {
    const planets = [fakePlanet("sun", 0, 1), fakePlanet("moon", 4, 13)];
    const wide = computeAspects(planets);
    expect(wide.some((a) => a.type === "conjunction")).toBe(true);

    const narrow = computeAspects(planets, { ...DEFAULT_ORBS, conjunction: 2 });
    expect(narrow.some((a) => a.type === "conjunction")).toBe(false);
  });
});
