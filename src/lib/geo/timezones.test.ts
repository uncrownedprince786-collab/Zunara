import { describe, it, expect } from "vitest";
import {
  civilToUtc,
  lmtOffsetSeconds,
  type CivilTime,
} from "./timezones";

function civil(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
  second = 0,
): CivilTime {
  return { year, month, day, hour, minute, second };
}

function expectUtcInstant(
  date: Date | null,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
  second = 0,
): void {
  expect(date).not.toBeNull();
  const expected = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second, 0),
  ).toISOString();
  expect(date!.toISOString()).toBe(expected);
}

describe("civilToUtc — IANA timezones (DST-aware)", () => {
  it("Tokyo (Asia/Tokyo, +9): 2026-01-15 12:00 local ⇒ 03:00 UTC same day", () => {
    const d = civilToUtc(civil(2026, 1, 15, 12), { timeZone: "Asia/Tokyo" });
    expectUtcInstant(d, 2026, 1, 15, 3);
  });

  it("London (Europe/London): winter +0 and summer BST +1", () => {
    const winter = civilToUtc(civil(2026, 1, 15, 12), { timeZone: "Europe/London" });
    expectUtcInstant(winter, 2026, 1, 15, 12);
    const summer = civilToUtc(civil(2026, 7, 15, 12), { timeZone: "Europe/London" });
    expectUtcInstant(summer, 2026, 7, 15, 11);
  });

  it("New York (America/New_York): winter -5 and summer EDT -4", () => {
    const winter = civilToUtc(civil(2026, 1, 15, 12), {
      timeZone: "America/New_York",
    });
    expectUtcInstant(winter, 2026, 1, 15, 17);
    const summer = civilToUtc(civil(2026, 7, 15, 12), {
      timeZone: "America/New_York",
    });
    expectUtcInstant(summer, 2026, 7, 15, 16);
  });

  it("Sydney (Australia/Sydney): summer +11 and winter +10", () => {
    // 2026-01-15 is mid-summer (AEDT, UTC+11): 12:00 local = 01:00 UTC same day.
    const summer = civilToUtc(civil(2026, 1, 15, 12), {
      timeZone: "Australia/Sydney",
    });
    expectUtcInstant(summer, 2026, 1, 15, 1);
    const winter = civilToUtc(civil(2026, 7, 15, 12), {
      timeZone: "Australia/Sydney",
    });
    expectUtcInstant(winter, 2026, 7, 15, 2);
  });

  it("Cairo (Africa/Cairo): 2026-06-15 12:00 ⇒ 09:00 UTC (Egypt DST, +3)", () => {
    // Egypt observes DST (UTC+3) from late April through October; June 2026 is
    // inside that window, so noon local resolves to 09:00 UTC.
    const d = civilToUtc(civil(2026, 6, 15, 12), { timeZone: "Africa/Cairo" });
    expectUtcInstant(d, 2026, 6, 15, 9);
  });

  it("Buenos Aires (America/Argentina/Buenos_Aires): 2026-07-15 12:00 ⇒ 15:00 UTC (-3)", () => {
    const d = civilToUtc(civil(2026, 7, 15, 12), {
      timeZone: "America/Argentina/Buenos_Aires",
    });
    expectUtcInstant(d, 2026, 7, 15, 15);
  });
});

describe("civilToUtc — Local Mean Time fallback", () => {
  it("longitude 0 ⇒ treated as UTC", () => {
    expectUtcInstant(civilToUtc(civil(2026, 1, 15, 12), { longitude: 0 }), 2026, 1, 15, 12);
  });

  it("longitude +90 (90°E) ⇒ 18:00 UTC", () => {
    expectUtcInstant(civilToUtc(civil(2026, 1, 15, 12), { longitude: 90 }), 2026, 1, 15, 18);
  });

  it("longitude -90 (90°W) ⇒ 06:00 UTC", () => {
    expectUtcInstant(civilToUtc(civil(2026, 1, 15, 12), { longitude: -90 }), 2026, 1, 15, 6);
  });

  it("no opts at all ⇒ LMT fallback with default longitude 0 (UTC)", () => {
    expectUtcInstant(civilToUtc(civil(2026, 1, 15, 12)), 2026, 1, 15, 12);
  });
});

describe("civilToUtc — invalid/unknown timezone falls back, never throws", () => {
  it("unknown IANA string falls back to LMT (no throw)", () => {
    const d = civilToUtc(civil(2026, 1, 15, 12), {
      timeZone: "Not/AZone",
      longitude: 90,
    });
    expectUtcInstant(d, 2026, 1, 15, 18);
  });

  it("invalid civil date (month 13) returns null", () => {
    expect(civilToUtc(civil(2026, 13, 1, 12), { timeZone: "Asia/Tokyo" })).toBeNull();
    expect(civilToUtc(civil(2026, 13, 1, 12), { longitude: 0 })).toBeNull();
  });
});

describe("lmtOffsetSeconds", () => {
  it("returns (longitude/15)*3600", () => {
    expect(lmtOffsetSeconds(0)).toBe(0);
    expect(lmtOffsetSeconds(90)).toBe(21600);
    expect(lmtOffsetSeconds(-90)).toBe(-21600);
  });

  it("clamps longitude into [-180, 180]", () => {
    expect(lmtOffsetSeconds(999)).toBe(lmtOffsetSeconds(180));
    expect(lmtOffsetSeconds(-999)).toBe(lmtOffsetSeconds(-180));
  });
});