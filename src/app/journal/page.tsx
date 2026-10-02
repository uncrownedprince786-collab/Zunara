import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";
import { getJournalArticles } from "@/lib/journal/articles";

export const metadata: Metadata = {
  title: "Zunara Journal — Editorial Astrology Essays",
  description:
    "Calm, fact-first essays on astrological astronomy: Mercury retrograde, what a birth chart really measures, tracking the Moon, and the math behind our calculators.",
  alternates: { canonical: absoluteUrl("/journal") },
  ...shareMeta(
    absoluteUrl("/journal"),
    "Zunara Journal — Editorial Astrology Essays",
    "Calm, fact-first essays on astrological astronomy: Mercury retrograde, what a birth chart really measures, tracking the Moon, and the math behind our calculators.",
  ),
};

export default function JournalIndexPage() {
  const articles = getJournalArticles();
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Breadcrumbs items={[{ label: "Journal", href: "/journal" }]} />
          </div>
          <p className="kicker">Zunara Journal</p>
          <h1 className="mt-4 font-display text-4xl text-starlight sm:text-6xl">
            Essays on the astronomy behind astrology
          </h1>
          <div aria-hidden="true" className="gold-rule mx-auto mt-7 w-20" />
          <p className="mt-7 text-lg leading-8 text-muted">
            Long-form writing that keeps the two promises the whole site keeps: the
            positions are exact, and the meaning stays labelled as reflection.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/journal/${a.slug}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition-colors hover:border-gold/40 hover:bg-white/[0.06]"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
                {a.tags[0]}
              </p>
              <h2 className="mt-3 font-display text-2xl leading-snug text-starlight group-hover:text-gold">
                {a.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">{a.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold">
                Read the essay <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}