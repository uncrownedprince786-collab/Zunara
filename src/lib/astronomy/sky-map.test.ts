import { describe, it, expect } from "vitest";
import { computeSkyBodies, bodySkyPoint, starSkyPoint } from "./sky-map";

const NYC = { latitude: 40.7128, longitude: -74.006, height: 10 };
const NOON = new Date("2026-06-21T12:00:00Z");

describe("sky map positions", () => {
  it("returns the Sun, Moon and naked-eye planets", () => {
    const bodies = computeSkyBodies(NYC, NOON);
    for (const id of ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"]) {
      expect(bodies.some((b) => b.id === id)).toBe(true);
    }
  });

  it("returns bright stars", () => {
    const bodies = computeSkyBodies(NYC, NOON);
    expect(bodies.some((b) => b.kind === "star")).toBe(true);
    expect(bodies.some((b) => b.label === "Polaris")).toBe(true);
  });

  it("produces azimuth in [0,360) and altitude in [-90,90]", () => {
    const bodies = computeSkyBodies(NYC, NOON);
    for (const b of bodies) {
      expect(b.azimuth).toBeGreaterThanOrEqual(0);
      expect(b.azimuth).toBeLessThan(360);
      expect(b.altitude).toBeGreaterThanOrEqual(-90);
      expect(b.altitude).toBeLessThanOrEqual(90);
    }
  });

  it("resolves a single body point idempotently", () => {
    const p1 = bodySkyPoint("sun", NYC, NOON);
    const p2 = bodySkyPoint("sun", NYC, NOON);
    expect(p1).not.toBeNull();
    expect(p1!.azimuth).toBeCloseTo(p2!.azimuth, 5);
  });

  it("resolves a star point near the pole", () => {
    const polaris = starSkyPoint(2.5303, 89.264, NYC, NOON);
    // Polaris sits very close to the north celestial pole: altitude ≈ observer latitude
    expect(polaris.altitude).toBeGreaterThan(38);
    expect(polaris.altitude).toBeLessThan(44);
  });
});
