"use client";

import { createContext, useContext, useMemo, useEffect, useSyncExternalStore, useState, type ReactNode } from "react";
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
  // Strictly guarded: in Private/Incognito mode, hardened webviews and some
  // embedded browsers, touching `document.cookie` (or decoding a malformed
  // value) can throw a SecurityError. Any failure must degrade to English
  // rather than crash the request or blank the tree.
  try {
    if (typeof document === "undefined" || typeof document.cookie !== "string") {
      return DEFAULT_LOCALE;
    }
    const match = document.cookie.match(/(?:^|;\s*)zunara-locale=([^;]*)/);
    if (!match) return DEFAULT_LOCALE;
    const val = decodeURIComponent(match[1]);
    return isLocale(val) ? val : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function resolveDictPath(dict: Dict, path: string, fallback = ""): string {
  if (!path || typeof path !== "string" || !dict) return fallback || path;
  const parts = path.split(".");
  let cur: unknown = dict;
  for (const part of parts) {
    // Defensive optional-chaining-style traversal: never throw on a missing
    // segment — always fall through to the caller's fallback or the raw path.
    if (!part) return fallback || path;
    if (cur && typeof cur === "object") {
      const rec = cur as Record<string, unknown>;
      if (Object.prototype.hasOwnProperty.call(rec, part)) {
        cur = rec[part];
        continue;
      }
    }
    return fallback || path;
  }
  return typeof cur === "string" ? cur : fallback || path;
}

/** Like {@link resolveDictPath} but returns "" on a miss (never the raw path). */
function resolveStrict(dict: Dict | undefined, path: string): string {
  if (!path || typeof path !== "string" || !dict) return "";
  const parts = path.split(".");
  let cur: unknown = dict;
  for (const part of parts) {
    if (!part) return "";
    if (cur && typeof cur === "object") {
      const rec = cur as Record<string, unknown>;
      if (Object.prototype.hasOwnProperty.call(rec, part)) {
        cur = rec[part];
        continue;
      }
    }
    return "";
  }
  return typeof cur === "string" ? cur : "";
}

/**
 * Translation resolution that can never emit blank/invisible text:
 * active-locale dict → English dict → caller fallback → the raw path (which is
 * at least visible). During store transitions or an incomplete dict, this
 * renders a readable string instead of an empty span.
 */
function resolveWithFallback(
  dict: Dict | undefined,
  english: Dict | undefined,
  path: string,
  fallback: string,
): string {
  return (
    resolveStrict(dict, path) ||
    resolveStrict(english, path) ||
    fallback ||
    path
  );
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
  // Hydration safety: the module store only carries the SSR/initial (English)
  // locale until the component mounts. `hydrated` flips to true in an effect so
  // the client locale (from cookie) can be applied without a render mismatch.
  const [hydrated, setHydrated] = useState(false);
  const locale = useSyncExternalStore(subscribeStore, getSnapshot, getServerSnapshot);

  // Restore saved language from cookie only AFTER first client mount (hydration).
  useEffect(() => {
    setHydrated(true);
    const saved = readLocaleCookie();
    if (saved !== DEFAULT_LOCALE) {
      applyStore(saved);
    }
  }, []);

  // Sync choice cookie + <html dir/lang> only after hydration.
  useEffect(() => {
    if (!hydrated) return;
    let dir: "ltr" | "rtl";
    let htmlLang: string;
    try {
      dir = getLocaleDir(locale);
      htmlLang = LOCALES.find((l) => l.code === locale)?.htmlLang ?? "en";
    } catch {
      dir = "ltr";
      htmlLang = "en";
    }
    const el = document.documentElement;
    if (el) {
      el.lang = htmlLang;
      el.dir = dir;
    }
    if (document.body) document.body.dir = dir;
    try {
      document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(locale)}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      /* cookie write failure is non-fatal */
    }
  }, [locale, hydrated]);

  const value = useMemo<LocaleContextValue>(() => {
    // Always fall back to English if the active locale's dict is unavailable.
    const dict = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
    const english = dictionaries[DEFAULT_LOCALE];
    const safeSigns = dict?.signs ?? (dictionaries[DEFAULT_LOCALE]?.signs ?? {});
    const safeElements = dict?.elements ?? (dictionaries[DEFAULT_LOCALE]?.elements ?? {});
    const safeModalities = dict?.modalities ?? (dictionaries[DEFAULT_LOCALE]?.modalities ?? {});
    const safePlanets = dict?.planets ?? (dictionaries[DEFAULT_LOCALE]?.planets ?? {});
    const safeHorizons = dict?.horizons ?? (dictionaries[DEFAULT_LOCALE]?.horizons ?? {});
    const safeAreas = dict?.areas ?? (dictionaries[DEFAULT_LOCALE]?.areas ?? {});
    let dir: "ltr" | "rtl";
    try {
      dir = getLocaleDir(locale);
    } catch {
      dir = "ltr";
    }

    const t = (path: string, fallback = "") => resolveWithFallback(dict, english, path, fallback);
    const tSign = (slug: string) => {
      try {
        if (!slug) return slug;
        const lower = slug.toLowerCase() as keyof typeof safeSigns;
        return safeSigns[lower] ?? slug;
      } catch {
        return slug;
      }
    };
    const tElement = (element: string) => {
      try {
        if (!element) return element;
        const key = (element.charAt(0).toUpperCase() + element.slice(1).toLowerCase()) as keyof typeof safeElements;
        return safeElements[key] ?? element;
      } catch {
        return element;
      }
    };
    const tModality = (modality: string) => {
      try {
        if (!modality) return modality;
        const key = (modality.charAt(0).toUpperCase() + modality.slice(1).toLowerCase()) as keyof typeof safeModalities;
        return safeModalities[key] ?? modality;
      } catch {
        return modality;
      }
    };
    const tPlanet = (key: string) => {
      try {
        if (!key) return key;
        const pKey = key.toLowerCase() as keyof typeof safePlanets;
        return safePlanets[pKey] ?? key;
      } catch {
        return key;
      }
    };
    const tHorizon = (horizon: string) => {
      try {
        if (!horizon) return horizon;
        const hKey = horizon.toLowerCase() as keyof typeof safeHorizons;
        return safeHorizons[hKey] ?? horizon;
      } catch {
        return horizon;
      }
    };
    const tArea = (area: string) => {
      try {
        if (!area) return area;
        const aKey = area.toLowerCase() as keyof typeof safeAreas;
        return safeAreas[aKey] ?? area;
      } catch {
        return area;
      }
    };

    return {
      locale,
      dir,
      dict,
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
    const fallbackDict = dictionaries[DEFAULT_LOCALE] ?? ({} as Dict);
    const english = dictionaries[DEFAULT_LOCALE];
    return {
      locale: DEFAULT_LOCALE,
      dir: "ltr",
      dict: fallbackDict,
      t: (path: string, fallback = "") => resolveWithFallback(fallbackDict, english, path, fallback),
      tSign: (slug: string) => {
        try {
          if (!slug) return slug;
          return fallbackDict.signs?.[slug.toLowerCase() as keyof Dict["signs"]] ?? slug;
        } catch {
          return slug;
        }
      },
      tElement: (el: string) => {
        try {
          if (!el) return el;
          return fallbackDict.elements?.[el as keyof Dict["elements"]] ?? el;
        } catch {
          return el;
        }
      },
      tModality: (m: string) => {
        try {
          if (!m) return m;
          return fallbackDict.modalities?.[m as keyof Dict["modalities"]] ?? m;
        } catch {
          return m;
        }
      },
      tPlanet: (p: string) => {
        try {
          if (!p) return p;
          return fallbackDict.planets?.[p as keyof Dict["planets"]] ?? p;
        } catch {
          return p;
        }
      },
      tHorizon: (h: string) => {
        try {
          if (!h) return h;
          return fallbackDict.horizons?.[h as keyof Dict["horizons"]] ?? h;
        } catch {
          return h;
        }
      },
      tArea: (a: string) => {
        try {
          if (!a) return a;
          return fallbackDict.areas?.[a as keyof Dict["areas"]] ?? a;
        } catch {
          return a;
        }
      },
      setLocale: applyStore,
    };
  }
  return ctx;
}
