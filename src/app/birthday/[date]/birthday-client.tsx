"use client";

import { useEffect, useState } from "react";
import { resolveCelebritiesForDate } from "@/lib/celebrities/resolver";
import type { Celebrity } from "@/lib/content/celebrities";
import { CelebrityBirthdaysView } from "@/components/ui/celebrity-birthdays-view";

interface BirthdayLiveProps {
  month: number;
  day: number;
  initial: Celebrity[];
}

/**
 * Live-upgrade island for the static `/birthday/[date]` page. Renders the
 * offline curated pool immediately (SSG, zero latency), then — on mount —
 * asks the resolver for the freshest Wikidata-sourced list. Any failure keeps
 * the static list, so every date always shows someone.
 */
export function BirthdayLive({ month, day, initial }: BirthdayLiveProps) {
  const [state, setState] = useState<{ people: Celebrity[]; source: "static" | "live" }>({
    people: initial,
    source: "static",
  });

  useEffect(() => {
    let cancelled = false;
    resolveCelebritiesForDate(month, day)
      .then((resolved) => {
        if (cancelled) return;
        setState({
          people: resolved.people,
          source: resolved.source === "live" ? "live" : "static",
        });
      })
      .catch(() => {
        // Keep the static tier; never blank the page.
      });
    return () => {
      cancelled = true;
    };
  }, [month, day]);

  return (
    <CelebrityBirthdaysView
      month={month}
      day={day}
      people={state.people}
      source={state.source}
    />
  );
}