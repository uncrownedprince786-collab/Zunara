import { describe, it, expect } from "vitest";
import { exactAge, formatAge } from "./age";

describe("exactAge", () => {
  const birth = () => new Date(Date.UTC(1995, 5, 21, 12, 0, 0));

  it("computes 29 years, 3 months and 12 days on 2024-10-03", () => {
    const a = exactAge(birth(), new Date(Date.UTC(2024, 9, 3, 12, 0, 0)));
    expect(a.years).toBe(29);
    expect(a.months).toBe(3);
    expect(a.days).toBe(12);
    expect(a.label).toBe("You are 29 years, 3 months and 12 days old");
    expect(a.totalDays).toBeGreaterThan(10000);
  });

  it("handles Feb 29 clamps to the natural anniversary", () => {
    const a = exactAge(
      new Date(Date.UTC(2000, 1, 29)),
      new Date(Date.UTC(2001, 1, 28)),
    );
    expect(a.years).toBe(1);
    expect(a.months).toBe(0);
    expect(a.days).toBe(0);
  });

  it("borrows days across a short month (Jan 31 → Mar 1 2020)", () => {
    const a = exactAge(
      new Date(Date.UTC(2020, 0, 31)),
      new Date(Date.UTC(2020, 2, 1)),
    );
    expect(a.years).toBe(0);
    expect(a.months).toBe(1);
    expect(a.days).toBe(1);
  });

  it("returns zeros and a plain label for future birth dates", () => {
    const a = exactAge(
      new Date(Date.UTC(2030, 0, 1)),
      new Date(Date.UTC(2026, 0, 1)),
    );
    expect(a.years).toBe(0);
    expect(a.months).toBe(0);
    expect(a.days).toBe(0);
    expect(a.totalDays).toBe(0);
    expect(a.label).toBe("You are 0 years, 0 months and 0 days old");
  });

  it("returns zeros when at equals birth", () => {
    const a = exactAge(birth(), birth());
    expect(a).toEqual({
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      label: "You are 0 years, 0 months and 0 days old",
    });
  });

  it("is deterministic and totalDays floors to whole 24-hour blocks", () => {
    const at = () => new Date(Date.UTC(2000, 5, 21, 12, 30, 0));
    const a = exactAge(birth(), at());
    const b = exactAge(birth(), at());
    expect(a).toEqual(b);
    expect(a.totalDays).toBe(
      Math.floor((at().getTime() - birth().getTime()) / 86400000),
    );
  });
});

describe("formatAge", () => {
  it("singularizes the number words", () => {
    expect(formatAge({ years: 1, months: 1, days: 1, totalDays: 0, label: "" })).toBe(
      "You are 1 year, 1 month and 1 day old",
    );
  });
});