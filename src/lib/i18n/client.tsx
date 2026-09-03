"use client";

import { createContext, useContext, useMemo, useEffect, useSyncExternalStore, type ReactNode } from "react";
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

// --- Tiny external store (module-level) so the locale can be updated without
// React `setState`, avoiding hydration mismatches and set-in-effect lint. ---
let storeLocale: Locale = DEFAULT_LOCALE;
const storeListeners = new Set<() => void>();
function emitStore() {
  for (const l of storeListeners) l();
}
function subscribeStore(cb: () => void) {
  storeListeners.add(cb);
  return () => storeListeners.delete(cb);
}
function getSnapshot() {
  return storeLocale;
}
function getServerSnapshot() {
  return DEFAULT_LOCALE;
}
function applyStore(next: Locale) {
  if (storeLocale !== next) {
    storeLocale = next;
    emitStore();
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribeStore, getSnapshot, getServerSnapshot);

  // Restore a saved language only after mount (writes through the external
  // store, so it is picked up by subscribers without a hydration mismatch).
  useEffect(() => {
    const saved = readLocaleCookie();
    if (saved !== DEFAULT_LOCALE) {
      applyStore(saved);
    }
  }, []);

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
      setLocale: applyStore,
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return { locale: DEFAULT_LOCALE, dir: "ltr", dict: dictionaries[DEFAULT_LOCALE], setLocale: applyStore };
  }
  return ctx;
}
