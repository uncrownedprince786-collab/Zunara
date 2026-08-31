import { describe, it, expect } from "vitest";
import { computeSnapshot, type PlanetarySnapshot, type PlanetPosition } from "../astronomy/astro";
import { computeChanges, diffSnapshots } from "./changes";

const KINDS = [
  "moon-sign",
  "planet-sign",
  "retro-start",
  "retro-end",
  "sun-sign",
  "aspect",
];

function pos(
  key: string,
  longitude: number,
  sign: string,
  retrograde = false,
  speed = 1,
): PlanetPosition {
  return {
    key: key as never,
    longitude,
    sign,
    degreeInSign: ((longitude % 30) + 30) % 30,
    position: `${sign} ${Math.floor(longitude)}*`,
    retrograde,
    speed,
  };
}

describe("what-changed analysis", () => {
  const date = new Date("2026-08-31T00:00:00Z");
  const snapshot = computeSnapshot(date, true);

  it("returns only supported change kinds and empty-safe", () => {
    const changes = computeChanges(date, snapshot, 1);
    for (const c of changes) {
      expect(KINDS).toContain(c.kind);
      expect(typeof c.id).toBe("string");
      expect(c.title.length).toBeGreaterThan(0);
      expect(c.blurb.length).toBeGreaterThan(0);
    }
    expect(Array.isArray(changes)).toBe(true);
  });

  it("is deterministic and memoised for the same date", () => {
    const a = computeChanges(date, snapshot, 1);
    const b = computeChanges(date, snapshot, 1);
    expect(a).toBe(b); // memoised
    expect(a).toEqual(b);
  });

  it("detects a Moon sign change as a real change", () => {
    const before: PlanetarySnapshot = {
      time: "t",
      julianDate: 1,
      engineVersion: "x",
      positions: [
        pos("moon", 5, "aries", false, 13),
        pos("sun", 0, "aries", false),
        pos("mercury", 40, "taurus", false),
        pos("venus", 70, "gemini", false),
        pos("mars", 100, "cancer", false),
        pos("jupiter", 130, "leo", false),
        pos("saturn", 160, "virgo", false),
        pos("uranus", 190, "libra", false),
        pos("neptune", 220, "scorpio", false),
        pos("pluto", 250, "sagittarius", false),
      ],
      aspects: [],
    };
    const today: PlanetarySnapshot = {
      ...before,
      positions: before.positions.map((p) =>
        p.key === "moon" ? pos("moon", 35, "taurus", false, 13) : p,
      ),
    };
    const changes = diffSnapshots(date, before, today);
    expect(changes.some((c) => c.kind === "moon-sign" && /moved into/i.test(c.title))).toBe(true);
  });

  it("can return no changes when the sky is effectively identical", () => {
    const changes = diffSnapshots(date, snapshot, snapshot);
    expect(changes).toEqual([]);
  });

  it("flags a retrograde onset", () => {
    const mk = (retro: boolean): PlanetarySnapshot => {
      const base = computeSnapshot(new Date("2026-08-31T00:00:00Z"), false);
      return {
        ...base,
        positions: base.positions.map((p) => (p.key === "mercury" ? { ...p, retrograde: retro } : p)),
      };
    };
    const before = mk(false);
    const today = mk(true);
    const changes = diffSnapshots(date, before, today);
    expect(changes.some((c) => c.kind === "retro-start")).toBe(true);
  });
});
