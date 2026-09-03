"use client";

import Link from "next/link";
import { SiteNav } from "./site-nav";
import { StarMark } from "./star-mark";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLocale } from "@/lib/i18n/client";

const TAGLINES: Record<string, string> = {
  en: "An editorial journal of the celestial",
  ur: "آسمانی اشعار کا تحریری جریدہ",
  ar: "مجلة تحريرية عن السماوي",
  es: "Un diario editorial de lo celestial",
  zh: "一本关于天界的前瞻期刊",
};

export function SiteHeader() {
  const { locale, dict } = useLocale();
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-white/[0.04] backdrop-blur-xl saturate-180">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-starlight"
          aria-label="Zunara home"
        >
          <StarMark className="h-5 w-5 text-gold transition-transform duration-500 group-hover:rotate-90" />
          <span className="font-display text-[1.35rem] font-medium tracking-tight">
            Zunara
          </span>
        </Link>
        <span className="hidden text-[0.62rem] uppercase tracking-[0.34em] text-subdued lg:block">
          {TAGLINES[locale] ?? TAGLINES.en}
        </span>
        <SiteNav
          labels={{
            horoscopes: dict.nav.horoscopes,
            cosmicFacts: dict.nav.cosmicFacts,
            astronomy: dict.nav.astronomy,
            about: dict.nav.about,
          }}
        />
        <LanguageSwitcher />
      </div>
      <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </header>
  );
}
