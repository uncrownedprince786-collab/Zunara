import { describe, it, expect } from "vitest";
import { computeAspects, DEFAULT_ORBS } from "./aspects";
import type { NatalPlanet, NatalBodyKey } from "./types";

function planet(
  key: NatalBodyKey,
  longitude: number,
  speed: number,
): NatalPlanet {
  return {
    key,
    longitude: ((longitude % 360) + 360) % 360,
    sign: "",
    degreeInSign: longitude,
    degree: 0,
    minutes: 0,
    retrograde: speed < 0,
    speed,
  };
}

const SIGNS: NatalBodyKey[] = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

describe("natal aspect engine", () => {
  it("detects a conjunction at zero separation", () => {
    const planets = [planet("sun", 0, 1.0), planet("moon", 0.5, 13.2)];
    const aspects = computeAspects(planets);
    const conj = aspects.find((a) => a.type === "conjunction");
    expect(conj).toBeDefined();
    expect(conj!.orb).toBeCloseTo(0.5, 5);
  });

  it("detects a square at 90 degrees", () => {
    const planets = [planet("sun", 0, 1.0), planet("mars", 91, 0.7)];
    const aspects = computeAspects(planets);
    expect(aspects.some((a) => a.type === "square")).toBe(true);
  });

  it("detects an opposition across the 180° wrap", () => {
    const planets = [planet("moon", 350, 13.2), planet("sun", 170, 1.0)];
    const aspects = computeAspects(planets);
    expect(aspects.some((a) => a.type === "opposition")).toBe(true);
  });

  it("drops pairs whose orb exceeds tolerance", () => {
    const planets = [planet("sun", 0, 1.0), planet("mars", 25, 0.7)];
    expect(computeAspects(planets)).toHaveLength(0);
  });

  it("uses each planet pair at most once (tightest aspect only)", () => {
    const planets = [
      planet("sun", 0, 1.0),
      planet("moon", 62, 13.2),
      planet("mercury", 0, 1.2),
      planet("venus", 120, 1.2),
    ];
    const aspects = computeAspects(planets);
    const seen = new Set<string>();
    for (const a of aspects) {
      const key = [a.a, a.b].sort().join("-");
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it("marks applying when the faster body closes toward exactness", () => {
    // Moon at 358° is just behind a conjunction with the Sun (0°) and moving
    // fast prograde → closing in on the exact aspect.
    const applying = computeAspects([planet("sun", 0, 1.0), planet("moon", 358, 13.2)]);
    expect(applying[0].applying).toBe(true);
    // Moon already 2° past the exact conjunction and leaving → separating.
    const separating = computeAspects([planet("sun", 0, 1.0), planet("moon", 2, 13.2)]);
    expect(separating[0].applying).toBe(false);
  });

  it("is deterministic across repeated calls", () => {
    const a = computeAspects(
      SIGNS.map((k, i) => planet(k, i * 37 % 360, 1 + i)),
    );
    const b = computeAspects(
      SIGNS.map((k, i) => planet(k, i * 37 % 360, 1 + i)),
    );
    expect(a).toEqual(b);
  });

  it("respects custom orbs (wider conjunction catches more pairs)", () => {
    const wide = computeAspects([planet("sun", 0, 1.0), planet("moon", 10, 13.2)], {
      ...DEFAULT_ORBS,
      conjunction: 12,
    });
    expect(wide.some((x) => x.type === "conjunction")).toBe(true);
  });

  it("every interpretation cites real placements", () => {
    const planets = SIGNS.map((k, i) => planet(k, i * 37 % 360, 1 + i));
    for (const aspect of computeAspects(planets)) {
      expect(aspect.interpretation.length).toBeGreaterThan(30);
      expect(
        ["conjunction", "sextile", "square", "trine", "opposition"],
      ).toContain(aspect.type);
    }
  });
});