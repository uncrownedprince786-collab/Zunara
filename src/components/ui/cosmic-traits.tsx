"use client";

import { useLocale } from "@/lib/i18n/client";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { ZodiacSymbol } from "./zodiac-symbol";
import Link from "next/link";
import { elementText } from "./element";

/**
 * Cosmic Traits & Career Directions — a glass-card index mapping each sign to
 * its core archetype and the professional arenas where that energy expresses
 * itself most naturally. Content is fully localized via the `traits` dictionary.
 */
export function CosmicTraits() {
  const { t, tSign, tElement } = useLocale();

  return (
    <section
      aria-labelledby="cosmic-traits-heading"
      className="border-y border-white/[0.08] bg-white/[0.02] backdrop-blur-xl saturate-180"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="border-b border-line-soft pb-6">
          <p className="kicker">{t("traits.kicker", "Cosmic traits & career")}</p>
          <h2 id="cosmic-traits-heading" className="mt-3 font-display text-3xl text-starlight sm:text-4xl">
            {t("traits.title", "The signature behind the sign")}
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted">
            {t("traits.desc", "A distilled reading of each sign's core archetype and the professional arenas where that energy expresses itself most naturally.")}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ZODIAC_SIGNS.map((sign) => (
            <article
              key={sign.slug}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl saturate-180 transition-colors hover:border-gold/40 hover:bg-white/[0.06]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl border border-white/10 ${elementText(sign.element)}`}>
                    <ZodiacSymbol sign={sign.slug} size={22} label={tSign(sign.slug)} />
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-starlight">
                      {tSign(sign.slug)}
                    </h3>
                    <p className={`text-[0.7rem] font-medium uppercase tracking-[0.16em] ${elementText(sign.element)}`}>
                      {tElement(sign.element)}
                    </p>
                  </div>
                </div>
                <span aria-hidden="true" className={`text-2xl ${elementText(sign.element)} opacity-50`}>
                  {sign.glyph}
                </span>
              </div>

              <dl className="relative mt-5 space-y-4 border-t border-p-line pt-4">
                <div>
                  <dt className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-subdued">
                    {t("traits.archetypeLabel", "Core archetype")}
                  </dt>
                  <dd className="mt-1.5 font-display text-lg leading-snug text-starlight/90">
                    {t(`traits.signs.${sign.slug}.arch`, sign.name)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-subdued">
                    {t("traits.careerLabel", "Career directions")}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-6 text-p-muted">
                    {t(`traits.signs.${sign.slug}.career`, "")}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/cosmic-facts"
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-8 py-3 text-sm font-medium text-gold-deep backdrop-blur-sm transition-colors hover:bg-gold/20 hover:border-gold/60"
          >
            {t("traits.cta", "Explore All Cosmic Facts →")}
          </Link>
        </div>
      </div>
    </section>
  );
}
