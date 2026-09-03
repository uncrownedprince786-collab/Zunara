"use client";

import { createContext, useContext, useMemo, useEffect, useState, type ReactNode } from "react";
import {
  type Locale,
  type Dict,
  dictionaries,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALES,
  getLocaleDir,
  isLocale,
} from "./dictionaries";

export type { Locale, Dict };

export function readLocaleCookie(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie.match(/(?:^|;\s*)zunara-locale=([^;]*)/);
  const val = match ? decodeURIComponent(match[1]) : DEFAULT_LOCALE;
  return isLocale(val) ? val : DEFAULT_LOCALE;
}

interface LocaleContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  dict: Dict;
  setLocale: (next: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocaleCookie);

  // Sync the choice cookie + <html dir/lang> with the external system.
  useEffect(() => {
    const dir = getLocaleDir(locale);
    const htmlLang = LOCALES.find((l) => l.code === locale)?.htmlLang ?? "en";
    document.documentElement.lang = htmlLang;
    document.documentElement.dir = dir;
    document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(locale)}; path=/; max-age=31536000; samesite=lax`;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: getLocaleDir(locale),
      dict: dictionaries[locale],
      setLocale: setLocaleState,
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return { locale: DEFAULT_LOCALE, dir: "ltr", dict: dictionaries[DEFAULT_LOCALE], setLocale: () => {} };
  }
  return ctx;
}
