"use client";

import Link from "next/link";
import { ZODIAC_SIGNS, formatDateRange } from "@/lib/zodiac/zodiac";
import { snapshotForToday } from "@/lib/astronomy/astro";
import { getHoroscopeContent } from "@/lib/horoscope/read";
import { ZodiacSymbol } from "./zodiac-symbol";
import { ThemeSymbol, type ThemeKey } from "./theme-symbol";
import { Reveal } from "./reveal";
import type { SignalStrength, LifeArea } from "@/lib/astrology/signals";
import { useLocale } from "@/lib/i18n/client";

const AREA_THEME: Record<LifeArea, ThemeKey> = {
  love: "love",
  work: "work",
  money: "money",
  energy: "energy",
};

function strengthText(s: SignalStrength): string {
  switch (s) {
    case "strong":
      return "text-gold";
    case "moderate":
      return "text-starlight";
    case "mild":
      return "text-subdued";
    default:
      return "text-subdued/70";
  }
}

/** A "daily zodiac desk": all twelve signs with today's real signal before the click. */
export function DailyDesk() {
  const { t, tSign, tArea, locale } = useLocale();
  const snapshot = snapshotForToday();
  const dateLabel = new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const cards = ZODIAC_SIGNS.map((sign) => {
    const result = getHoroscopeContent(sign.slug, "daily", new Date(), snapshot);
    const strongest = result?.signals?.areas?.find((a) => a.present);
    const headline = result?.signals?.headline ?? null;
    const watch = result?.glance?.watchOutFor ?? null;
    return { sign, result, strongest, headline, watch };
  });

  return (
    <div>
      <p className="kicker text-center">{dateLabel}</p>
      <p className="mx-auto mt-3 max-w-xl text-center font-serif-body text-lg italic leading-8 text-muted">
        {t("home.anIndexOfHeavensDesc", "Twelve signs, each with its own signal today. Choose one to read the full reading.")}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ sign, strongest, headline, watch }, i) => (
          <Reveal key={sign.slug} delay={i % 3} className="h-full">
            <Link
              href={`/horoscope/${sign.slug}/today`}
              className={`card-lift group flex h-full flex-col rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl transition-colors hover:bg-white/[0.06] focus-visible:outline-gold`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <ZodiacSymbol
                    sign={sign.slug}
                    size="md"
                    className={`text-gold/80 transition-colors group-hover:text-gold`}
                    label={tSign(sign.slug)}
                  />
                  <div>
                    <p className="font-display text-lg leading-none text-starlight">{tSign(sign.slug)}</p>
                    <p className="mt-1 text-xs text-subdued">{formatDateRange(sign)}</p>
                  </div>
                </div>
                <span aria-hidden className="text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  &rarr;
                </span>
              </div>

              <div className="mt-5 flex-1">
                <p className="text-[0.62rem] uppercase tracking-[0.22em] text-subdued">{t("horoscope.activeTheme", "Today's theme")}</p>
                <p className="mt-1.5 font-serif-body text-[0.98rem] italic leading-6 text-starlight/90">
                  {headline ?? "A steady day"}
                </p>

                {strongest && (
                  <div className="mt-4 flex items-center gap-2">
                    <ThemeSymbol theme={AREA_THEME[strongest.area]} size="sm" className="text-gold" />
                    <span className="text-[0.65rem] uppercase tracking-[0.18em] text-subdued">{t("areas.strongest", "Strongest")} ({tArea(strongest.area)})</span>
                    <span className={`ms-auto rounded-full border border-line px-2 py-0.5 text-[0.62rem] uppercase tracking-wide ${strengthText(strongest.strength)}`}>
                      {t(`areas.${strongest.strength}`, strongest.strength)}
                    </span>
                  </div>
                )}

                {watch && (
                  <p className="mt-3 text-xs leading-5 text-muted">
                    <span className="text-subdued">{t("common.watchOutFor", "Watch")}:</span> {watch}
                  </p>
                )}
              </div>

              <p className="mt-5 border-t border-line-soft pt-3 text-[0.72rem] uppercase tracking-[0.18em] text-gold">
                {tSign(sign.slug)} &rarr;
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
