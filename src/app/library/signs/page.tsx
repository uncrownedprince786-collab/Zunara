import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { LocaleTraits, LocaleSignDescription } from "@/components/ui/locale-traits";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";
import { ZODIAC_SIGNS, formatDateRange } from "@/lib/zodiac/zodiac";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { elementText } from "@/components/ui/element";
import { AstroTerm } from "@/components/ui/astro-tooltip";

export const metadata: Metadata = {
  title: "Zodiac Signs: Elements, Rulers & Dates",
  description:
    "All twelve zodiac signs with their element, modality, ruler, dates and personality traits.",
  alternates: { canonical: absoluteUrl("/library/signs") },
  ...shareMeta(
    absoluteUrl("/library/signs"),
    "Zodiac Signs: Elements, Rulers & Dates | Zunara",
    "All twelve zodiac signs with their element, modality, ruler, dates and personality traits.",
  ),
};

export default function SignsPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Breadcrumbs
              items={[
                { label: "Library", href: "/library" },
                { label: "Zodiac Signs", href: "/library/signs" },
              ]}
            />
          </div>
          <p className="kicker">The twelve constellations of the ecliptic</p>
          <h1 className="mt-4 font-display text-4xl text-starlight sm:text-6xl">
            Zodiac Signs
          </h1>
          <div aria-hidden="true" className="gold-rule mx-auto mt-7 w-20" />
          <p className="mt-7 text-lg leading-8 text-muted">
            Every sign blends an <AstroTerm term="Element" /> with a modality. Here is each
            sign&rsquo;s element, ruler, dates and its defining traits.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ZODIAC_SIGNS.map((s) => (
            <Link
              key={s.slug}
              href={`/horoscope/${s.slug}/today`}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-colors hover:border-gold/40 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ZodiacSymbol
                    sign={s.slug}
                    size="md"
                    className={elementText(s.element)}
                    label={s.name}
                  />
                  <div>
                    <h2 className="font-display text-lg font-semibold text-starlight">{s.name}</h2>
                    <p className="text-xs text-muted">
                      {s.element} · {s.modality}
                    </p>
                  </div>
                </div>
                <span
                  aria-hidden="true"
                  className="text-gold opacity-0 transition-opacity group-hover:opacity-100"
                >
                  →
                </span>
              </div>
              <p className="mt-3 text-xs uppercase tracking-wider text-gold">
                {formatDateRange(s)} · Ruled by {s.ruler}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted"><LocaleSignDescription slug={s.slug} /></p>
              <div className="mt-4 flex flex-wrap gap-2">
                <LocaleTraits
                  slug={s.slug}
                  limit={4}
                  itemClassName="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-p-ink"
                />
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted">
          <Link href="/library" className="text-gold hover:underline">
            ← Back to the Library index
          </Link>
        </p>
      </div>
    </div>
  );
}
