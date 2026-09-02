export type PeriodType = "daily" | "weekly" | "monthly" | "yearly";

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      return isLeapYear(year) ? 29 : 28;
    default:
      throw new Error(`Invalid month: ${month}`);
  }
}

/** ISO 8601 week number (weeks starting Monday). */
export function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function isoWeekYear(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  return d.getUTCFullYear();
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Canonical day key: YYYY-MM-DD */
export function dailyKey(date: Date): string {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

/** Canonical week key: YYYY-Www (ISO week) */
export function weeklyKey(date: Date): string {
  return `${isoWeekYear(date)}-W${pad2(isoWeekNumber(date))}`;
}

/** Canonical month key: YYYY-MM */
export function monthlyKey(date: Date): string {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}`;
}

/** Canonical year key: YYYY */
export function yearlyKey(date: Date): string {
  return `${date.getUTCFullYear()}`;
}

export function periodKey(type: PeriodType, date: Date): string {
  switch (type) {
    case "daily":
      return dailyKey(date);
    case "weekly":
      return weeklyKey(date);
    case "monthly":
      return monthlyKey(date);
    case "yearly":
      return yearlyKey(date);
  }
}

/** Monday of the current ISO week (start of the weekly forecast window). */
export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() - (day - 1));
  return d;
}

/** Sunday at end of the current ISO week. */
export function endOfWeek(date: Date): Date {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);
  return end;
}

export function startOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function endOfMonth(date: Date): Date {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  return new Date(Date.UTC(y, m, daysInMonth(y, m + 1), 23, 59, 59, 999));
}

export function startOfYear(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
}

export function endOfYear(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
}

/** Human-readable window label for a period, e.g. "Week of Aug 31 – Sep 6, 2026". */
export function periodLabel(type: PeriodType, date: Date): string {
  const opts: Intl.DateTimeFormatOptions = { timeZone: "UTC", month: "short", day: "numeric" };
  const yearOpts: Intl.DateTimeFormatOptions = { timeZone: "UTC", year: "numeric" };
  const yearFormatter = new Intl.DateTimeFormat("en", yearOpts);
  const yLabel = yearFormatter.format(date);
  switch (type) {
    case "daily":
      return new Intl.DateTimeFormat("en", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date);
    case "weekly": {
      const s = startOfWeek(date);
      const e = endOfWeek(date);
      const f = new Intl.DateTimeFormat("en", opts);
      if (s.getUTCFullYear() !== e.getUTCFullYear()) {
        const sLabel = new Intl.DateTimeFormat("en", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" }).format(s);
        return `${weekdayOf(s)} ${sLabel} – ${f.format(e)}, ${yLabel}`;
      }
      return `${weekdayOf(s)} ${f.format(s)} – ${f.format(e)}, ${yLabel}`;
    }
    case "monthly":
      return new Intl.DateTimeFormat("en", { timeZone: "UTC", month: "long", year: "numeric" }).format(date);
    case "yearly":
      return yLabel;
  }
}

function weekdayOf(d: Date): string {
  return new Intl.DateTimeFormat("en", { timeZone: "UTC", weekday: "long" }).format(d);
}

/** Date range for a period as [start, end] Date objects (UTC). */
export function periodRange(type: PeriodType, date: Date): { start: Date; end: Date } {
  switch (type) {
    case "daily":
      return { start: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())), end: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999)) };
    case "weekly":
      return { start: startOfWeek(date), end: endOfWeek(date) };
    case "monthly":
      return { start: startOfMonth(date), end: endOfMonth(date) };
    case "yearly":
      return { start: startOfYear(date), end: endOfYear(date) };
  }
}
