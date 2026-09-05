"use client";

import Link from "next/link";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { MoonPhaseWidget } from "@/components/ui/moon-phase";
import { useLocale } from "@/lib/i18n/client";

const PROMO_SIGNS = ["aries", "leo", "libra", "pisces"] as const;

/**
 * "Your Daily Orbit" quick-reading card. Fully stateless: it never reads any
 * saved sign. It presents a clean manual entry point to today's horoscopes so
 * every visitor starts fresh and picks a sign themselves.
 */
export function DailyOrbitBanner() {
  const { dict } = useLocale();
  return (
    <section aria-label="Today's horoscope" className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <div className="cosmic-glow flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-sm sm:p-5">
        <div className="flex shrink-0 items-center justify-center gap-3">
          {PROMO_SIGNS.map((slug) => (
            <Link
              key={slug}
              href={`/horoscope/${slug}/today`}
              aria-label={`Read today's ${slug} horoscope`}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-gold/80 transition-colors hover:border-gold/40 hover:text-gold"
            >
              <ZodiacSymbol sign={slug} size={26} label={slug} />
            </Link>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="kicker">{dict.common.yourDailyOrbit}</p>
          <p className="mt-1 font-display text-lg text-starlight">
            {dict.common.readToday}
          </p>
          <p className="mt-0.5 hidden text-sm text-muted sm:block">
            {dict.common.pickSign}
          </p>
        </div>
        <div className="hidden shrink-0 sm:block">
          <MoonPhaseWidget />
        </div>
        <Link
          href="/horoscope"
          className="shrink-0 rounded-full bg-gold px-5 py-2.5 text-sm font-medium tracking-wide text-ink transition-opacity hover:opacity-90"
        >
          {dict.common.browseSigns}
        </Link>
      </div>
    </section>
  );
}
