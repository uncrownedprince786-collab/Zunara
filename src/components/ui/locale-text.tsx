"use client";

import { useLocale } from "@/lib/i18n/client";

/**
 * Renders a translated string from the active locale dictionary by dotted path
 * (e.g. "home.heroTitle"). As a client component consuming the locale context,
 * it re-renders in place when the reader switches language, even when placed
 * inside a server-rendered page. Use for any visible string that must translate.
 */
export function LocaleText({ path, fallback = "" }: { path: string; fallback?: string }) {
  const { dict } = useLocale();
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict);
  return <>{typeof value === "string" ? value : fallback}</>;
}
