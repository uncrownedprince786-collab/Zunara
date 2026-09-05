/**
 * Exact chronological age.
 *
 * Pure, calendar-aware age computation. Months are counted with an anniversary
 * step-down algorithm (the target month is clamped to its last day) so dates
 * like Feb 29 or Jan 31 resolve to their natural birthdays. All arithmetic
 * uses UTC calendar components, making results independent of the host
 * timezone and reproducible for any fixed (birth, `at`) pair.
 */

export interface ExactAge {
  years: number;
  months: number;
  days: number;
  /** Whole 24-hour blocks elapsed between birth and `at`. */
  totalDays: number;
  /** Plain-English summary, e.g. "You are 29 years, 3 months and 12 days old". */
  label: string;
}

/** Add whole months to a date, clamping the day to the target month's length. */
function addMonthsClamped(date: Date, months: number): Date {
  const total = date.getUTCMonth() + months;
  const year = date.getUTCFullYear() + Math.floor(total / 12);
  const month = ((total % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(date.getUTCDate(), lastDay);
  return new Date(Date.UTC(year, month, day));
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export function formatAge(age: ExactAge): string {
  return `You are ${plural(age.years, "year")}, ${plural(age.months, "month")} and ${plural(age.days, "day")} old`;
}

/** Day-boundary safe age: whole calendar years/months/days plus elapsed days. */
export function exactAge(birth: Date, at: Date): ExactAge {
  const totalDays = Math.max(0, Math.floor((at.getTime() - birth.getTime()) / 86400000));

  if (at.getTime() <= birth.getTime()) {
    const zero: ExactAge = { years: 0, months: 0, days: 0, totalDays: 0, label: "" };
    zero.label = formatAge(zero);
    return zero;
  }

  const rawMonths =
    (at.getUTCFullYear() - birth.getUTCFullYear()) * 12 +
    (at.getUTCMonth() - birth.getUTCMonth());

  // Step the anniversary back until it no longer overshoots `at`.
  let months = rawMonths;
  while (months > 0 && addMonthsClamped(birth, months).getTime() > at.getTime()) {
    months--;
  }

  const anchored = addMonthsClamped(birth, months);
  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  const atMidnight = Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate());
  const anchoredMidnight = Date.UTC(
    anchored.getUTCFullYear(),
    anchored.getUTCMonth(),
    anchored.getUTCDate(),
  );
  const days = Math.floor((atMidnight - anchoredMidnight) / 86400000);

  const age: ExactAge = { years, months: remMonths, days, totalDays, label: "" };
  age.label = formatAge(age);
  return age;
}