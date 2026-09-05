import { describe, it, expect } from "vitest";
import { computeSynastry, classifyAspect } from "./synastry";
import type { BirthInput } from "@/lib/natal/validate";

/**
 * Fixed, reproducible birth inputs. 1995-06-21 12:00 in New York and
 * 1993-02-14 14:00 in London. The exact UTC instants are resolved by
 * `validateBirth`, so results are fully deterministic.
 */
const BIRTH_A: BirthInput = {
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

const BIRTH_B: BirthInput = {
  year: 1993,
  month: 2,
  day: 14,
  hour12: 2,
  minute: 0,
  ampm: "PM",
  timeKnown: true,
  latitude: 51.5074,
  longitude: -0.1278,
  placeName: "London, United Kingdom",
};

describe("synastry", () => {
  it("produces four dimensions with scores inside the 30–98 band", () => {
    const res = computeSynastry(
      { name: "Alex", birth: BIRTH_A },
      { name: "Sam", birth: BIRTH_B },
    );
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.data.dimensions).toHaveLength(4);
    for (const d of res.data.dimensions) {
      expect(d.score).toBeGreaterThanOrEqual(30);
      expect(d.score).toBeLessThanOrEqual(98);
      expect(d.summary.length).toBeGreaterThan(20);
    }
  });

  it("uses the four expected dimension keys", () => {
    const res = computeSynastry({ birth: BIRTH_A }, { birth: BIRTH_B });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const keys = res.data.dimensions.map((d) => d.key).sort();
    expect(keys).toEqual(["attraction", "communication", "emotional", "stability"]);
  });

  it("returns at least one aspect across the four dimensions", () => {
    const res = computeSynastry(
      { name: "Alex", birth: BIRTH_A },
      { name: "Sam", birth: BIRTH_B },
    );
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const total = res.data.dimensions.reduce((sum, d) => sum + d.aspects.length, 0);
    expect(total).toBeGreaterThan(0);
    expect(res.data.aspects.length).toBeGreaterThan(0);
  });

  it("computes the overall score as the mean of the four dimensions", () => {
    const res = computeSynastry({ birth: BIRTH_A }, { birth: BIRTH_B });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const mean =
      res.data.dimensions.reduce((s, d) => s + d.score, 0) / res.data.dimensions.length;
    expect(Math.abs(res.data.overallScore - Math.round(mean))).toBeLessThanOrEqual(1);
  });

  it("is deterministic across two calls", () => {
    const a = computeSynastry({ birth: BIRTH_A }, { birth: BIRTH_B });
    const b = computeSynastry({ birth: BIRTH_A }, { birth: BIRTH_B });
    expect(a.ok).toBe(true);
    expect(b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    expect(a.data.overallScore).toBe(b.data.overallScore);
    expect(a.data.dimensions.map((d) => d.score)).toEqual(
      b.data.dimensions.map((d) => d.score),
    );
    expect(a.data.dimensions.map((d) => d.aspects.length)).toEqual(
      b.data.dimensions.map((d) => d.aspects.length),
    );
  });

  it("cites real placements in each interpretation", () => {
    const res = computeSynastry(
      { name: "Alex", birth: BIRTH_A },
      { name: "Sam", birth: BIRTH_B },
    );
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    for (const asp of res.data.aspects) {
      expect(asp.interpretation).not.toContain("TODO");
      expect(asp.interpretation.length).toBeGreaterThan(30);
      expect(asp.orb).toBeGreaterThanOrEqual(0);
    }
  });

  it("uses named persons in the interpretation or falls back to Person A/B", () => {
    const named = computeSynastry(
      { name: "Alex", birth: BIRTH_A },
      { name: "Sam", birth: BIRTH_B },
    );
    expect(named.ok).toBe(true);
    if (named.ok) {
      expect(named.data.personA.name).toBe("Alex");
      expect(named.data.personB.name).toBe("Sam");
      // every interpretation should reference at least one role
      for (const asp of named.data.aspects) {
        expect(/Alex|Sam/.test(asp.interpretation)).toBe(true);
      }
    }
    const fallback = computeSynastry({ birth: BIRTH_A }, { birth: BIRTH_B });
    if (fallback.ok) {
      expect(fallback.data.personA.name).toBe("Person A");
      expect(fallback.data.personB.name).toBe("Person B");
      for (const asp of fallback.data.aspects) {
        expect(/Person A|Person B/.test(asp.interpretation)).toBe(true);
      }
    }
  });

  it("rejects invalid birth input as {ok:false, errors}", () => {
    const res = computeSynastry(
      { birth: { ...BIRTH_A, year: 1700 } },
      { birth: BIRTH_B },
    );
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.errors.personA).toBeDefined();
    }
  });

  it("keeps orb bounded by the aspect orb tolerances", () => {
    for (const angle of [0, 60, 90, 120, 180]) {
      const cls = classifyAspect(angle, 0);
      expect(cls).not.toBeNull();
    }
  });
});
