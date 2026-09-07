export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

const DAYS_PER_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function monthDays(month: number): number {
  return DAYS_PER_MONTH[month - 1] ?? 30;
}

export interface BirthdayRoute {
  /** Zero-padded `MM-DD` slug for the `/birthday/[date]` route. */
  date: string;
  month: number;
  day: number;
}

/** Every possible month/day combination (including leap-day Feb 29) = 366. */
export function birthdayDates(): BirthdayRoute[] {
  const out: BirthdayRoute[] = [];
  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= monthDays(month); day++) {
      out.push({ date: `${pad2(month)}-${pad2(day)}`, month, day });
    }
  }
  return out;
}

/** Validate an `MM-DD` route param; returns null when it is not a real date. */
export function parseBirthdayDate(raw: string | undefined): { month: number; day: number } | null {
  if (!raw) return null;
  const match = /^(\d{2})-(\d{2})$/.exec(raw);
  if (!match) return null;
  const month = Number.parseInt(match[1], 10);
  const day = Number.parseInt(match[2], 10);
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > monthDays(month)) return null;
  return { month, day };
}