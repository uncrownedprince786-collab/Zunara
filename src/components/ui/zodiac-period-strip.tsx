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

/** Horizontal strip of all twelve signs, preserving the current period type. */
export function ZodiacPeriodStrip({ periodType, activeSign }: ZodiacPeriodStripProps) {
  return (
    <div className="scrollbar-none -mx-4 overflow-x-auto border-b border-line-soft bg-ink-2/60 px-4 sm:-mx-6">
      <div className="mx-auto flex min-w-max items-stretch gap-1">
        {ZODIAC_SIGNS.map((sign) => {
          const isActive = sign.slug === activeSign;
          return (
            <Link
              key={sign.slug}
              href={hrefForPeriod(sign.slug, periodType)}
              aria-current={isActive ? "page" : undefined}
              className={`group flex shrink-0 flex-col items-center gap-1 px-4 py-3 transition-colors ${
                isActive
                  ? "border-t-2 border-gold bg-ink-3"
                  : "border-t-2 border-transparent hover:bg-ink-3"
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
