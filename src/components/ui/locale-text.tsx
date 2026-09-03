"use client";

import { useLocale, resolveDictPath } from "@/lib/i18n/client";

/**
 * Renders a translated string from the active locale dictionary by dotted path
 * (e.g. "home.heroTitle"). As a client component consuming the locale context,
 * it re-renders in place when the reader switches language, even when placed
 * inside a server-rendered page.
 */
export function LocaleText({ path, fallback = "" }: { path: string; fallback?: string }) {
  const { dict } = useLocale();
  const text = resolveDictPath(dict, path, fallback);
  return <>{text}</>;
}
