"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ZODIAC_SIGNS, formatDateRange } from "@/lib/zodiac/zodiac";
import { ZodiacSymbol } from "./zodiac-symbol";
import { elementText } from "./element";
import type { PeriodType } from "@/lib/calendar/periods";

function hrefForPeriod(slug: string, periodType: PeriodType): string {
  if (periodType === "daily") return `/horoscope/${slug}/today`;
  return `/horoscope/${slug}/${periodType}`;
}

interface ZodiacPeriodStripProps {
  periodType: PeriodType;
  activeSign?: string;
}

/**
 * Horizontal strip of all twelve signs, preserving the current period type.
 * On mount (and whenever the active sign changes) the strip auto-scrolls so
 * the highlighted sign is centered in the viewport, keeping the surrounding
 * signs visible instead of cutting them off at the right edge.
 */
export function ZodiacPeriodStrip({ periodType, activeSign }: ZodiacPeriodStripProps) {
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = activeRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSign]);

  return (
    <div className="scrollbar-none -mx-4 overflow-x-auto border-b border-white/[0.08] bg-white/[0.03] px-4 backdrop-blur-xl saturate-180 sm:-mx-6">
      <div className="mx-auto flex min-w-max items-stretch gap-1 px-6">
        {ZODIAC_SIGNS.map((sign) => {
          const isActive = sign.slug === activeSign;
          return (
            <Link
              key={sign.slug}
              ref={isActive ? activeRef : undefined}
              href={hrefForPeriod(sign.slug, periodType)}
              aria-current={isActive ? "page" : undefined}
              className={`group flex shrink-0 flex-col items-center gap-1 px-4 py-3 transition-colors ${
                isActive
                  ? "border-t-2 border-gold bg-cosmic/12"
                  : "border-t-2 border-transparent hover:bg-cosmic/8"
              }`}
            >
              <ZodiacSymbol
                sign={sign.slug}
                size="sm"
                className={`transition-colors ${isActive ? "text-gold" : `${elementText(sign.element)} opacity-70 group-hover:opacity-100`}`}
                label={sign.name}
              />
              <span
                className={`text-[0.7rem] uppercase tracking-[0.1em] ${
                  isActive ? "text-gold" : "text-subdued"
                }`}
              >
                {sign.name}
              </span>
              <span className="hidden text-[0.62rem] text-subdued/70 lg:block">
                {formatDateRange(sign)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
