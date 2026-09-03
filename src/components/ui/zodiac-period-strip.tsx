"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
 * the highlighted sign is centered in the viewport. Left/right arrow controls
 * let readers scroll through every sign on desktop and mobile without cutting
 * content off, with an auto-hidden left mask at the scroll origin.
 */
export function ZodiacPeriodStrip({ periodType, activeSign }: ZodiacPeriodStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScroll(el.scrollWidth > el.clientWidth + 4);
    setHasPrev(el.scrollLeft > 4);
    setHasNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const active = el.querySelector<HTMLElement>("[aria-current='page']");
    active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSign]);

  const scrollBySigns = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const sign = el.querySelector<HTMLElement>("a");
    const step = (sign?.offsetWidth ?? 88) + 4;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="relative border-b border-white/[0.08] bg-white/[0.03] backdrop-blur-xl saturate-180">
      <div className="relative flex items-center">
        {canScroll && hasPrev && (
          <button
            type="button"
            onClick={() => scrollBySigns(-1)}
            aria-label="Scroll signs back"
            className="absolute left-2 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-[#111222]/90 text-starlight shadow-lg backdrop-blur transition-colors hover:border-gold/40 hover:text-gold"
          >
            <span aria-hidden>&larr;</span>
          </button>
        )}
        {canScroll && hasNext && (
          <button
            type="button"
            onClick={() => scrollBySigns(1)}
            aria-label="Scroll signs forward"
            className="absolute right-2 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-[#111222]/90 text-starlight shadow-lg backdrop-blur transition-colors hover:border-gold/40 hover:text-gold"
          >
            <span aria-hidden>&rarr;</span>
          </button>
        )}

        {canScroll && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#0a0b1a] to-transparent"
          />
        )}
        {canScroll && hasNext && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#0a0b1a] to-transparent"
          />
        )}

        <div
          ref={trackRef}
          className="scrollbar-none -mx-4 w-full overflow-x-auto scroll-smooth px-16 sm:-mx-6"
        >
          <div className="flex min-w-max items-stretch gap-1 px-0">
            {ZODIAC_SIGNS.map((sign) => {
              const isActive = sign.slug === activeSign;
              return (
                <Link
                  key={sign.slug}
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
      </div>
    </div>
  );
}
