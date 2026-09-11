import type { Locale } from "./dictionaries";

const BCP47: Record<Locale, string> = {
  en: "en",
  ur: "ur",
  ar: "ar",
  es: "es",
  zh: "zh",
  hi: "hi",
};

const FALLBACK = "en";

export function localeBcp47(locale: Locale): string {
  return BCP47[locale] ?? FALLBACK;
}

/** Localized long month name (UTC) for a 0-based month index. */
export function monthLong(locale: Locale, monthIndex: number): string {
  try {
    return new Intl.DateTimeFormat(localeBcp47(locale), {
      month: "long",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2020, monthIndex, 1)));
  } catch {
    return new Intl.DateTimeFormat(FALLBACK, { month: "long" }).format(
      new Date(2020, monthIndex, 1),
    );
  }
}

/** Localized short month name for a Date (read in UTC). */
export function monthShort(locale: Locale, date: Date): string {
  try {
    return new Intl.DateTimeFormat(localeBcp47(locale), {
      month: "short",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat(FALLBACK, { month: "short" }).format(date);
  }
}

/** Localized date string, read in UTC by default so SSR and client agree. */
export function formatDate(
  locale: Locale,
  date: Date | number,
  options: Intl.DateTimeFormatOptions = {},
): string {
  try {
    return new Intl.DateTimeFormat(localeBcp47(locale), {
      timeZone: "UTC",
      ...options,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat(FALLBACK, {
      timeZone: "UTC",
      ...options,
    }).format(date);
  }
}