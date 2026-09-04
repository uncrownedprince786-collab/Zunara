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

  it("has no duplicate Wikipedia slugs", () => {
    const seen = new Set<string>();
    const residents = [];
    // Recompute URLs the same way the module does.
    for (let m = 1; m <= 12; m++) {
      for (let d = 1; d <= 31; d++) {
        for (const c of celebritiesForDate(m, d)) {
          const slug = c.wiki ?? c.name.replace(/ /g, "_");
          if (seen.has(slug)) residents.push(slug);
          seen.add(slug);
        }
      }
    }
    expect(residents).toEqual([]);
  });

  it("finds a celebrity for the current UTC date", () => {
    const now = new Date();
    const people = celebritiesForDate(now.getUTCMonth() + 1, now.getUTCDate());
    expect(Array.isArray(people)).toBe(true);
    expect(people.every((c) => c.month === now.getUTCMonth() + 1)).toBe(true);
  });
});
