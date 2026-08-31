import Link from "next/link";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { ZodiacSymbol } from "./zodiac-symbol";
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
    <div className="scrollbar-none -mx-4 overflow-x-auto px-4">
      <div className="flex min-w-max items-center gap-2">
        {ZODIAC_SIGNS.map((sign) => {
          const isActive = sign.slug === activeSign;
          return (
            <Link
              key={sign.slug}
              href={hrefForPeriod(sign.slug, periodType)}
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 flex-col items-center gap-1.5 rounded-lg border px-4 py-3 transition-colors ${
                isActive
                  ? "border-gold/50 bg-gold/10"
                  : "border-line bg-obsidian hover:border-gold/40 hover:bg-obsidian-2"
              }`}
            >
              <ZodiacSymbol
                sign={sign.slug}
                size="sm"
                className={isActive ? "text-gold" : "text-muted"}
                label={sign.name}
              />
              <span className={`text-xs ${isActive ? "text-gold" : "text-muted"}`}>{sign.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
