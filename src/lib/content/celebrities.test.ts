import { describe, expect, it } from "vitest";
import {
  celebritiesForDate,
  industriesPresent,
} from "./celebrities";

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
});
