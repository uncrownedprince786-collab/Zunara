"use client";

import { useMemo } from "react";
import { useLocale } from "@/lib/i18n/client";
import { dictionaries, DEFAULT_LOCALE } from "@/lib/i18n/dictionaries";

type Entry = [value: string, path: string];

function collectLeaves(obj: Record<string, unknown>, prefix: string, out: Entry[]) {
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof val === "string") out.push([val, path]);
    else if (val && typeof val === "object") {
      collectLeaves(val as Record<string, unknown>, path, out);
    }
  }
}

let cachedIndex: Map<string, string> | null = null;

/**
 * English value → dictionary path. Chrome labels (nav/home) are indexed first so
 * exact matches win over deeper editorial leaves with the same wording.
 */
function getIndex(): Map<string, string> {
  if (!cachedIndex) {
    const entries: Entry[] = [];
    const en = dictionaries[DEFAULT_LOCALE];
    if (en) {
      collectLeaves(en.nav as unknown as Record<string, unknown>, "nav", entries);
      collectLeaves(en.home as unknown as Record<string, unknown>, "home", entries);
      collectLeaves(en as unknown as Record<string, unknown>, "", entries);
    }
    cachedIndex = new Map(entries);
  }
  return cachedIndex;
}

/**
 * Localizes a breadcrumb label passed in from a server page. Reverse-maps the
 * English label to a dictionary path (exact, then case-insensitive), so chrome
 * links like "Home" / "About" / "Birth Chart" render in the active locale while
 * unmatchable editorial labels fall back to their original text.
 */
export function CrumbText({ label }: { label: string }) {
  const { t } = useLocale();
  const text = useMemo(() => {
    if (!label) return label;
    const index = getIndex();
    const exact = index.get(label);
    if (exact) return t(exact, label);
    const loose = [...index.entries()].find(([v]) => v.toLowerCase() === label.toLowerCase());
    return loose ? t(loose[1], label) : label;
  }, [label, t]);
  return <>{text}</>;
}