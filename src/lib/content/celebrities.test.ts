import { describe, expect, it } from "vitest";
import {
  celebritiesForDate,
  industriesPresent,
} from "./celebrities";
import { SUPPLEMENTARY_POOL } from "./celebrity-pool";

describe("celebrity hub data integrity", () => {
  it("covers all diversified industries", () => {
    expect(industriesPresent()).toEqual(
      expect.arrayContaining([
        "Acting",
        "Music",
        "Sports",
        "Wrestling",
        "Literature",
        "Science",
      ]),
    );
  });

  it("every returned celebrity is genuinely born on the requested date", () => {
    for (let m = 1; m <= 12; m++) {
      const days = new Date(2024, m, 0).getDate();
      for (let d = 1; d <= days; d++) {
        for (const person of celebritiesForDate(m, d)) {
          expect(person.month).toBe(m);
          expect(person.day).toBe(d);
        }
      }
    }
  });

  it("never returns more than 6 people for a single date", () => {
    for (let m = 1; m <= 12; m++) {
      const days = new Date(2024, m, 0).getDate();
      for (let d = 1; d <= days; d++) {
        expect(celebritiesForDate(m, d).length).toBeLessThanOrEqual(6);
      }
    }
  });

  it("does not leak celebrities from other dates (no global pool fallback)", () => {
    for (const [m, d] of [
      [9, 5],
      [12, 10],
      [2, 2],
    ]) {
      for (const person of celebritiesForDate(m, d)) {
        expect(person.month).toBe(m);
        expect(person.day).toBe(d);
      }
    }
  });

  it("is deterministic: same date always returns the same result", () => {
    const a = celebritiesForDate(7, 14).map((c) => c.name).sort();
    const b = celebritiesForDate(7, 14).map((c) => c.name).sort();
    expect(a).toEqual(b);
  });

  it("every real date renders at least three people (no sparse grids)", () => {
    const sparse: string[] = [];
    for (let m = 1; m <= 12; m++) {
      const days = new Date(2024, m, 0).getDate();
      for (let d = 1; d <= days; d++) {
        if (m === 2 && d === 29) continue; // non-leap-year date
        if (celebritiesForDate(m, d).length < 3) sparse.push(`${m}/${d}`);
      }
    }
    expect(sparse).toEqual([]);
  });

  it("never shows the same person twice on a date (exact or near-duplicate names)", () => {
    const normalize = (n: string) => n.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (let m = 1; m <= 12; m++) {
      const days = new Date(2024, m, 0).getDate();
      for (let d = 1; d <= days; d++) {
        const keys = celebritiesForDate(m, d).map((p) => normalize(p.name));
        expect(new Set(keys).size, `${m}/${d} contains duplicate people`).toBe(
          keys.length,
        );
      }
    }
  });

  it("every returned celebrity has a portrait image URL or a wiki source", () => {
    for (let m = 1; m <= 12; m++) {
      const days = new Date(2024, m, 0).getDate();
      for (let d = 1; d <= days; d++) {
        for (const person of celebritiesForDate(m, d)) {
          expect(
            !!person.image || !!person.wiki,
            `${person.name} (${m}/${d}) has no image or wiki source`,
          ).toBe(true);
          if (person.image) expect(person.image).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it("every pool entry has a valid month/day and a portrait source (image URL or wiki slug)", () => {
    for (const p of SUPPLEMENTARY_POOL) {
      expect(p.month, `${p.name} invalid month`).toBeGreaterThanOrEqual(1);
      expect(p.month).toBeLessThanOrEqual(12);
      expect(p.day).toBeGreaterThanOrEqual(1);
      expect(p.day).toBeLessThanOrEqual(31);
      expect(
        !!p.image || !!p.wiki,
        `${p.name} has neither an image URL nor a wiki slug`,
      ).toBe(true);
    }
  });
});
