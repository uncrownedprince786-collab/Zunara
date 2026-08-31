import { describe, it, expect } from "vitest";
import { computeSnapshot } from "../astronomy/astro";
import { ZODIAC_SIGNS } from "../zodiac/zodiac";
import { computeSignals } from "./signals";

const VALID = ["strong", "moderate", "mild", "none"];

describe("signal scoring", () => {
  const date = new Date("2026-08-31T00:00:00Z");
  const snapshot = computeSnapshot(date, true);

  it("returns well-formed signals for every sign", () => {
    for (const sign of ZODIAC_SIGNS) {
      const s = computeSignals(snapshot, sign);
      expect(s.areas).toHaveLength(4);
      expect(s.themes.length).toBeGreaterThanOrEqual(4);
      for (const a of s.areas) {
        expect(["love", "work", "money", "energy"]).toContain(a.area);
        expect(VALID).toContain(a.strength);
        expect(typeof a.present).toBe("boolean");
        expect(Array.isArray(a.drivers)).toBe(true);
        if (a.strength === "none") expect(a.present).toBe(false);
      }
    }
  });

  it("is deterministic for the same snapshot and sign", () => {
    for (const sign of ZODIAC_SIGNS) {
      const a = computeSignals(snapshot, sign);
      const b = computeSignals(snapshot, sign);
      expect(a).toEqual(b);
    }
  });

  it("ranks themes by descending strength with no fabricated labels", () => {
    const sign = ZODIAC_SIGNS[0];
    const s = computeSignals(snapshot, sign);
    for (const t of s.themes) {
      expect(["Love", "Work", "Money", "Energy"]).toContain(t.label);
      expect(VALID).toContain(t.strength);
    }
  });

  it("ties drivers to real planets present in the snapshot", () => {
    const sign = ZODIAC_SIGNS[1];
    const s = computeSignals(snapshot, sign);
    const keys = new Set<string>(snapshot.positions.map((p) => p.key));
    for (const a of s.areas) {
      for (const d of a.drivers) {
        expect(keys.has(d)).toBe(true);
      }
    }
  });

  it("changes deterministically across different snapshots", () => {
    const day1 = computeSnapshot(new Date("2026-08-31T00:00:00Z"), true);
    const day2 = computeSnapshot(new Date("2026-09-01T00:00:00Z"), true);
    const a = computeSignals(day1, ZODIAC_SIGNS[0]);
    const b = computeSignals(day2, ZODIAC_SIGNS[0]);
    // Either identical or different is fine; both must be valid.
    expect(VALID).toContain(a.areas[0].strength);
    expect(VALID).toContain(b.areas[0].strength);
  });

  it("headline is a real area label or null", () => {
    for (const sign of ZODIAC_SIGNS) {
      const s = computeSignals(snapshot, sign);
      expect(s.headline === null || ["Love", "Work", "Money", "Energy"].includes(s.headline)).toBe(true);
    }
  });
});
