"use client";

import { useEffect, useState } from "react";
import { resolveCelebritiesForDate } from "@/lib/celebrities/resolver";
import type { Celebrity } from "@/lib/content/celebrities";
import { CelebrityBirthdaysView } from "@/components/ui/celebrity-birthdays-view";

interface TodaysStarsProps {
  month: number;
  day: number;
  initial: Celebrity[];
}

/**
 * "Born today" island for the home page. Renders the offline curated pool
 * straight from static HTML (SSG, zero latency — always 6 people), then on
 * mount asks the resolver for the freshest Wikidata-sourced list. Any failure
 * keeps the static list, so the section never drops below the pool.
 */
export function TodaysStars({ month, day, initial }: TodaysStarsProps) {
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
        // Keep the static tier; never blank the section.
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