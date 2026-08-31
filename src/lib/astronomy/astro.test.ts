import { describe, it, expect } from "vitest";
import {
  computeSnapshot,
  computePosition,
  longitudeToSign,
  angularDifference,
  ENGINE_VERSION_NUMBER,
} from "./astro";
import type { BodyKey } from "./bodies";

describe("astronomy engine", () => {
  it("reports a pinned engine version", () => {
    expect(ENGINE_VERSION_NUMBER).toMatch(/^\d+\.\d+\.\d+$/);
  });

  describe("longitudeToSign", () => {
    it("maps 0 degrees to Aries", () => {
      expect(longitudeToSign(0).slug).toBe("aries");
    });
    it("maps 30 degrees to Taurus", () => {
      expect(longitudeToSign(30).slug).toBe("taurus");
    });
    it("maps 359 degrees to Pisces", () => {
      expect(longitudeToSign(359.9).slug).toBe("pisces");
    });
    it("maps 330 degrees to Pisces boundary", () => {
      expect(longitudeToSign(330).slug).toBe("pisces");
    });
    it("normalizes negative values", () => {
      expect(longitudeToSign(-10).slug).toBe("pisces");
    });
    it("is cyclical past 360", () => {
      expect(longitudeToSign(360).slug).toBe("aries");
      expect(longitudeToSign(390).slug).toBe("taurus");
    });
  });

  describe("angularDifference", () => {
    it("computes shortest angular distance", () => {
      expect(angularDifference(10, 350)).toBeCloseTo(20, 5);
      expect(angularDifference(350, 10)).toBeCloseTo(-20, 5);
      expect(angularDifference(90, 90)).toBe(0);
    });
  });

  describe("Sun position vs known references", () => {
    const refs: Array<[string, number]> = [
      // JPL Horizons approximate values for Solar System Barycenter apparent longitude
      ["2026-01-01T00:00:00Z", 280.4],
      ["2026-03-20T00:00:00Z", 358.9],
      ["2026-06-21T00:00:00Z", 89.7],
      ["2026-09-22T00:00:00Z", 179.4],
      ["2026-12-21T00:00:00Z", 269.1],
    ];
    for (const [date, expected] of refs) {
      it(`Sun at ${date} is near ${expected} degrees`, () => {
        const pos = computePosition("sun", new Date(date));
        expect(pos).not.toBeNull();
        expect(Math.abs(pos!.longitude - expected)).toBeLessThan(1.5);
      });
    }
  });

  describe("planet longitudes", () => {
    const date = new Date("2026-08-31T00:00:00Z");
    const keys: BodyKey[] = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];
    for (const key of keys) {
      it(`${key} produces a valid position`, () => {
        const pos = computePosition(key, date);
        expect(pos).not.toBeNull();
        expect(pos!.longitude).toBeGreaterThanOrEqual(0);
        expect(pos!.longitude).toBeLessThan(360);
        expect(pos!.sign).toBeTruthy();
        expect(typeof pos!.retrograde).toBe("boolean");
      });
    }
  });

  describe("retrograde detection", () => {
    it("detects Pluto retrograde status for a mid-2026 date (Pluto is retrograde in 2026)", () => {
      const pos = computePosition("pluto", new Date("2026-06-15T00:00:00Z"));
      expect(pos).not.toBeNull();
      // Pluto is retrograde for much of 2026
      expect(pos!.retrograde).toBe(true);
    });
  });

  describe("full snapshot", () => {
    it("computes positions and aspects for all bodies", () => {
      const snap = computeSnapshot(new Date("2026-08-31T00:00:00Z"));
      expect(snap.positions.length).toBe(12);
      expect(snap.aspects).toBeDefined();
      expect(snap.julianDate).toBeGreaterThan(0);
      expect(snap.engineVersion).toBeTruthy();
    });
    it("computes node positions", () => {
      const snap = computeSnapshot(new Date("2026-08-31T00:00:00Z"));
      const north = snap.positions.find((p) => p.key === "northNode");
      const south = snap.positions.find((p) => p.key === "southNode");
      expect(north).toBeDefined();
      expect(south).toBeDefined();
      if (north && south) {
        expect(Math.abs(angularDifference(north.longitude, south.longitude))).toBeCloseTo(180, 0);
      }
    });
  });
});
