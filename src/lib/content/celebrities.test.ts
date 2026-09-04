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

  it("returns 4-6 celebrities for every day of the year", () => {
    for (let m = 1; m <= 12; m++) {
      const days = new Date(2024, m, 0).getDate();
      for (let d = 1; d <= days; d++) {
        const people = celebritiesForDate(m, d);
        expect(people.length).toBeGreaterThanOrEqual(4);
        expect(people.length).toBeLessThanOrEqual(6);
      }
    }
  });

  it("is deterministic: same date always returns the same result", () => {
    const a = celebritiesForDate(7, 14).map((c) => c.name).sort();
    const b = celebritiesForDate(7, 14).map((c) => c.name).sort();
    expect(a).toEqual(b);
  });
});
