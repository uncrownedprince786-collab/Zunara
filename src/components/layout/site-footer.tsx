"use client";

import Link from "next/link";
import { ZODIAC_SIGNS, formatDateRange } from "@/lib/zodiac/zodiac";
import { SITE } from "@/lib/seo/site";
import { VitruvianMark } from "@/components/ui/vitruvian-mark";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLocale } from "@/lib/i18n/client";

export function SiteFooter() {
  const year = new Date().getUTCFullYear();
  const { dict, tSign, t, locale } = useLocale();
  const columns = [
    {
      title: dict.nav.horoscopes,
      links: [
        { label: dict.footer.allSigns, href: "/horoscope" },
        { label: dict.nav.today, href: "/horoscope/aries/today" },
        { label: dict.nav.weekly, href: "/horoscope/aries/weekly" },
        { label: dict.nav.monthly, href: "/horoscope/aries/monthly" },
        { label: dict.nav.yearly, href: "/horoscope/aries/yearly" },
      ],
    },
    {
      title: dict.nav.publication,
      links: [
        { label: dict.nav.birthchart, href: "/birthchart" },
        { label: dict.nav.astronomy, href: "/astrology" },
        { label: dict.nav.cosmicFacts, href: "/cosmic-facts" },
        { label: dict.nav.about, href: "/about" },
        { label: dict.nav.privacy, href: "/privacy" },
        { label: dict.nav.terms, href: "/terms" },
        { label: dict.nav.disclaimer, href: "/disclaimer" },
      ],
    },
    {
      title: t("footer.astronomy", "Astronomy"),
      links: [
        { label: t("footer.synastry", "Synastry"), href: "/synastry" },
        { label: t("footer.dailyTransit", "Daily Transit"), href: "/daily-transit" },
        { label: t("footer.retrogrades", "Retrogrades"), href: "/retrograde" },
        { label: t("footer.ephemeris", "Ephemeris"), href: "/ephemeris" },
        { label: t("footer.library", "Library"), href: "/library" },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/[0.08] bg-white/[0.03] backdrop-blur-xl saturate-180">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <VitruvianMark className="h-6 w-6 text-gold" />
              <span className="font-display text-2xl font-medium text-starlight">Zunara</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              {dict.footer.tagline}
            </p>
          </div>

          <div className="grid flex-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="kicker">{col.title}</p>
                <ul className="mt-4 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-muted transition-colors hover:text-gold">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-line-soft pt-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-subdued">{dict.footer.theTwelve}</p>
            <ul className="flex flex-wrap items-center gap-2">
              {ZODIAC_SIGNS.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/horoscope/${s.slug}`}
                    title={`${tSign(s.slug)} — ${formatDateRange(s, locale)}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line-soft text-sm text-muted transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    <span aria-hidden="true">{s.glyph}</span>
                    <span className="sr-only">{tSign(s.slug)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-8 text-center text-xs leading-5 text-subdued">
            &copy; {year} {SITE.name}. {dict.footer.copyright}
          </p>
          <div className="mt-6 flex items-center justify-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
