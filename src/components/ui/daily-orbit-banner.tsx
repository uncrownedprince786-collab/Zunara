"use client";

import Link from "next/link";
import { ZODIAC_SIGNS, formatDateRange } from "@/lib/zodiac/zodiac";
import { useZunaraState } from "@/lib/hooks/use-zunara-state";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { MoonPhaseWidget } from "@/components/ui/moon-phase";

/**
 * "Your Daily Orbit" pinned quick-reading card. Renders only once the reader
 * has chosen a sign (via the sign quick-nav or a prior visit) and that choice
 * has been read from localStorage — so the homepage never flashes it before
 * hydration. Fully optional; returns null until a sign is saved.
 */
export function DailyOrbitBanner() {
  const { userZodiacSign, ready } = useZunaraState();

  if (!ready) return null;
  const sign = userZodiacSign ? ZODIAC_SIGNS.find((s) => s.slug === userZodiacSign) : undefined;
  if (!sign) return null;

  return (
    <section
      aria-label="Your daily orbit"
      className="mx-auto max-w-6xl px-4 pt-8 sm:px-6"
    >
      <div className="cosmic-glow flex items-center gap-4 rounded-xl border border-line bg-ink-2/60 p-4 backdrop-blur-sm sm:p-5">
        <div className="flex shrink-0 items-center justify-center rounded-full border border-cosmic/25 bg-cosmic/15 p-3">
          <ZodiacSymbol sign={sign.slug} size={32} className="text-gold" strokeWidth={1.8} label={sign.name} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="kicker">Your daily orbit</p>
          <p className="mt-1 truncate font-display text-lg text-starlight sm:text-xl">
            {sign.name} <span className="text-subdued">· {formatDateRange(sign)}</span>
          </p>
          <p className="mt-0.5 hidden text-sm text-muted sm:block">
            Pick up where you left off — jump straight to today&rsquo;s reading for your sign.
          </p>
        </div>
        <div className="hidden shrink-0 sm:block">
          <MoonPhaseWidget />
        </div>
        <Link
          href={`/horoscope/${sign.slug}/today`}
          className="shrink-0 rounded-full bg-gold px-5 py-2.5 text-sm font-medium tracking-wide text-ink transition-opacity hover:opacity-90"
        >
          Read today
        </Link>
      </div>
    </section>
  );
}
