import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";
import { glossaryByCategory } from "@/lib/content/glossary";

export const metadata: Metadata = {
  title: "Zunara Library — The Astrology Knowledge Base",
  description:
    "A plain-English glossary and reference base: planets, zodiac signs, houses, aspects, lunar nodes and movement terms, all defined without hype.",
  alternates: { canonical: absoluteUrl("/library") },
  ...shareMeta(
    absoluteUrl("/library"),
    "Zunara Library — The Astrology Knowledge Base",
    "Plain-English definitions of planets, signs, houses, aspects and more.",
  ),
};

const FEATURES = [
  {
    href: "/library/planets",
    title: "Planets",
    summary:
      "Ten personal bodies plus the lunar nodes — each one's meaning, glyph and how it behaves in a chart.",
  },
  {
    href: "/library/signs",
    title: "Zodiac Signs",
    summary:
      "All twelve signs with their element, modality, ruler, dates and traits.",
  },
  {
    href: "/library/nodes",
    title: "Lunar Nodes",
    summary:
      "The North Node's growth direction and the South Node's familiar patterns, explained in plain English.",
  },
];

const CATEGORY_LABEL: Record<string, string> = {
  planets: "Planets",
  signs: "Zodiac Signs",
  houses: "Houses",
  aspects: "Aspects",
  movement: "Movement",
  technique: "Technique",
  points: "Points",
};

export default function LibraryPage() {
  const byCategory = glossaryByCategory();
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Breadcrumbs items={[{ label: "Library", href: "/library" }]} />
          </div>
          <p className="kicker">The knowledge base</p>
          <h1 className="mt-4 font-display text-4xl text-starlight sm:text-6xl">
            Astrology, in plain English
          </h1>
          <div aria-hidden="true" className="gold-rule mx-auto mt-7 w-20" />
          <p className="mt-7 text-lg leading-8 text-muted">
            A calm reference for the terms behind Zunara&rsquo;s charts. Every definition is
            written in direct, hype-free English and connects to the real, calculated data
            in the toolbox.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition-colors hover:border-gold/40 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-starlight">{f.title}</h2>
                <span className="text-gold opacity-0 transition-opacity group-hover:opacity-100">→</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{f.summary}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <p className="kicker text-center">Every term</p>
          <h2 className="mt-3 text-center font-display text-2xl text-starlight">
            Full Glossary
          </h2>

          <div className="mt-8 space-y-6">
            {Array.from(byCategory.entries()).map(([category, entries]) => (
              <details
                key={category}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
                open
              >
                <summary className="flex cursor-pointer list-none items-center justify-between">
                  <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
                    {CATEGORY_LABEL[category] ?? category}
                  </h3>
                  <span className="text-muted transition-transform group-open:rotate-180" aria-hidden="true">▾</span>
                </summary>
                <ul className="mt-4 space-y-3">
                  {entries.map((e) => (
                    <li key={e.term} className="border-t border-white/5 pt-3">
                      <p className="font-display text-base font-medium text-starlight">{e.term}</p>
                      <p className="mt-1 text-sm leading-6 text-muted">{e.definition}</p>
                      {e.seeAlso && e.seeAlso.length > 0 && (
                        <p className="mt-1 text-xs text-subdued">
                          See also: {e.seeAlso.join(", ")}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
