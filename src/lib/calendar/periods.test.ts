import { describe, it, expect } from "vitest";
import {
  isLeapYear,
  daysInMonth,
  isoWeekNumber,
  isoWeekYear,
  dailyKey,
  weeklyKey,
  monthlyKey,
  yearlyKey,
  periodKey,
  startOfWeek,
  endOfWeek,
  periodLabel,
  periodRange,
} from "./periods";

const d = (s: string) => new Date(s);

describe("date engine", () => {
  it("detects leap years", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2025)).toBe(false);
    expect(isLeapYear(2026)).toBe(false);
    expect(isLeapYear(2028)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2000)).toBe(true);
  });

  it("calculates days in month", () => {
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2028, 2)).toBe(29);
    expect(daysInMonth(2026, 12)).toBe(31);
    expect(daysInMonth(2026, 4)).toBe(30);
  });

  it("computes ISO week numbers", () => {
    expect(isoWeekNumber(d("2026-01-01T00:00:00Z"))).toBe(1);
    expect(isoWeekNumber(d("2026-12-28T00:00:00Z"))).toBe(53);
    expect(isoWeekNumber(d("2021-01-01T00:00:00Z"))).toBe(53);
  });

  it("handles ISO week year boundaries", () => {
    expect(isoWeekYear(d("2021-01-01T00:00:00Z"))).toBe(2020);
  });

  it("builds canonical period keys", () => {
    expect(dailyKey(d("2026-08-31T12:00:00Z"))).toBe("2026-08-31");
    expect(dailyKey(d("2026-09-05T12:00:00Z"))).toBe("2026-09-05");
    expect(monthlyKey(d("2026-12-31T00:00:00Z"))).toBe("2026-12");
    expect(yearlyKey(d("2026-12-31T00:00:00Z"))).toBe("2026");
    expect(weeklyKey(d("2026-08-31T00:00:00Z"))).toBe("2026-W36");
  });

  it("periodKey maps each type", () => {
    const date = d("2026-08-31T00:00:00Z");
    expect(periodKey("daily", date)).toBe("2026-08-31");
    expect(periodKey("monthly", date)).toBe("2026-08");
    expect(periodKey("yearly", date)).toBe("2026");
    expect(periodKey("weekly", date)).toBe("2026-W36");
  });

  it("handles the Dec 31 -> Jan 1 year rollover", () => {
    expect(dailyKey(d("2026-12-31T23:59:59Z"))).toBe("2026-12-31");
    expect(yearlyKey(d("2026-12-31T23:00:00Z"))).toBe("2026");
    expect(dailyKey(d("2027-01-01T00:00:00Z"))).toBe("2027-01-01");
    expect(yearlyKey(d("2027-01-01T00:00:00Z"))).toBe("2027");
    expect(monthlyKey(d("2026-12-31T23:59:59Z"))).toBe("2026-12");
    expect(monthlyKey(d("2027-01-01T00:00:00Z"))).toBe("2027-01");
  });

  it("handles leap day", () => {
    expect(dailyKey(d("2028-02-29T03:00:00Z"))).toBe("2028-02-29");
    expect(monthlyKey(d("2028-02-29T03:00:00Z"))).toBe("2028-02");
  });

  it("startOfWeek returns Monday", () => {
    const s = startOfWeek(d("2026-09-02T10:00:00Z"));
    expect(s.getUTCDay()).toBe(1);
    expect(dailyKey(s)).toBe("2026-08-31");
  });

  it("endOfWeek returns Sunday", () => {
    const e = endOfWeek(d("2026-09-02T10:00:00Z"));
    expect(e.getUTCDay()).toBe(0);
    expect(dailyKey(e)).toBe("2026-09-06");
  });

  it("periodRange returns correct spans", () => {
    const daily = periodRange("daily", d("2026-08-31T15:00:00Z"));
    expect(dailyKey(daily.start)).toBe("2026-08-31");
    const monthly = periodRange("monthly", d("2026-08-15T00:00:00Z"));
    expect(monthlyKey(monthly.start)).toBe("2026-08");
    expect(monthlyKey(monthly.end)).toBe("2026-08");
    const yearly = periodRange("yearly", d("2026-06-01T00:00:00Z"));
    expect(yearlyKey(yearly.start)).toBe("2026");
    expect(yearlyKey(yearly.end)).toBe("2026");
  });

  it("periodLabel produces human-readable labels", () => {
    expect(periodLabel("daily", d("2026-08-31T00:00:00Z"))).toContain("2026");
    expect(periodLabel("yearly", d("2026-05-01T00:00:00Z"))).toBe("2026");
  });
});
