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

export function resolveDictPath(dict: Dict, path: string, fallback = ""): string {
  const parts = path.split(".");
  let cur: unknown = dict;
  for (const part of parts) {
    if (cur && typeof cur === "object" && part in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return fallback || path;
    }
  }
  return typeof cur === "string" ? cur : fallback || path;
}

export interface LocaleContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  dict: Dict;
  t: (path: string, fallback?: string) => string;
  tSign: (slug: string) => string;
  tElement: (element: string) => string;
  tModality: (modality: string) => string;
  tPlanet: (key: string) => string;
  tHorizon: (horizon: string) => string;
  tArea: (area: string) => string;
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

  // Restore saved language after mount
  useEffect(() => {
    const saved = readLocaleCookie();
    if (saved !== DEFAULT_LOCALE) {
      applyStore(saved);
    }
  }, []);

  // Sync choice cookie + <html dir/lang>
  useEffect(() => {
    const dir = getLocaleDir(locale);
    const htmlLang = LOCALES.find((l) => l.code === locale)?.htmlLang ?? "en";
    document.documentElement.lang = htmlLang;
    document.documentElement.dir = dir;
    document.body.dir = dir;
    document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(locale)}; path=/; max-age=31536000; samesite=lax`;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => {
    const currentDict = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
    const dir = getLocaleDir(locale);

    const t = (path: string, fallback = "") => resolveDictPath(currentDict, path, fallback);
    const tSign = (slug: string) => {
      const lower = slug.toLowerCase() as keyof Dict["signs"];
      return currentDict.signs[lower] ?? slug;
    };
    const tElement = (element: string) => {
      const key = (element.charAt(0).toUpperCase() + element.slice(1).toLowerCase()) as keyof Dict["elements"];
      return currentDict.elements[key] ?? element;
    };
    const tModality = (modality: string) => {
      const key = (modality.charAt(0).toUpperCase() + modality.slice(1).toLowerCase()) as keyof Dict["modalities"];
      return currentDict.modalities[key] ?? modality;
    };
    const tPlanet = (key: string) => {
      const pKey = key.toLowerCase() as keyof Dict["planets"];
      return currentDict.planets[pKey] ?? key;
    };
    const tHorizon = (horizon: string) => {
      const hKey = horizon.toLowerCase() as keyof Dict["horizons"];
      return currentDict.horizons[hKey] ?? horizon;
    };
    const tArea = (area: string) => {
      const aKey = area.toLowerCase() as keyof Dict["areas"];
      return currentDict.areas[aKey] ?? area;
    };

    return {
      locale,
      dir,
      dict: currentDict,
      t,
      tSign,
      tElement,
      tModality,
      tPlanet,
      tHorizon,
      tArea,
      setLocale: applyStore,
    };
  }, [locale]);

  return (
    <LocaleContext.Provider value={value}>
      <div dir={value.dir} className="contents">
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    const fallbackDict = dictionaries[DEFAULT_LOCALE];
    return {
      locale: DEFAULT_LOCALE,
      dir: "ltr",
      dict: fallbackDict,
      t: (path: string, fallback = "") => resolveDictPath(fallbackDict, path, fallback),
      tSign: (slug: string) => fallbackDict.signs[slug.toLowerCase() as keyof Dict["signs"]] ?? slug,
      tElement: (el: string) => fallbackDict.elements[el as keyof Dict["elements"]] ?? el,
      tModality: (m: string) => fallbackDict.modalities[m as keyof Dict["modalities"]] ?? m,
      tPlanet: (p: string) => fallbackDict.planets[p as keyof Dict["planets"]] ?? p,
      tHorizon: (h: string) => fallbackDict.horizons[h as keyof Dict["horizons"]] ?? h,
      tArea: (a: string) => fallbackDict.areas[a as keyof Dict["areas"]] ?? a,
      setLocale: applyStore,
    };
  }
  return ctx;
}
