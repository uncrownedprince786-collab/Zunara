"use client";

import { useLocale } from "@/lib/i18n/client";
import { formatDate } from "@/lib/i18n/date";

interface LocaleDateProps {
  /** Absolute date to format (defaults to now). Read in UTC. */
  date?: Date | number;
  /** Format a calendar date by month (1-12) and day instead of an absolute date. */
  month?: number;
  day?: number;
  options?: Intl.DateTimeFormatOptions;
}

/**
 * Renders a date in the active locale's calendar format, re-rendering in place
 * on language switch — replaces hardcoded `Intl.DateTimeFormat("en", …)` labels.
 */
export function LocaleDate({ date, month, day, options }: LocaleDateProps) {
  const { locale } = useLocale();
  let value: Date | number;
  if (month != null && day != null) {
    value = Date.UTC(2024, month - 1, day);
  } else if (date != null) {
    value = date;
  } else {
    value = new Date();
  }
  const opts: Intl.DateTimeFormatOptions =
    options ??
    (month != null
      ? { month: "long", day: "numeric" }
      : { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  return <>{formatDate(locale, value, opts)}</>;
}