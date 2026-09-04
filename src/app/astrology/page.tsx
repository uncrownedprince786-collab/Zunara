import Link from "next/link";
import type { Metadata } from "next";
import { ASTROLOGY_TOPICS } from "@/lib/astrology/topics";
import { MoonSignCard } from "@/components/ui/moon-sign-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Astrology — A Guide to the Zodiac",
  description:
    "Evergreen guides to astrology: birth charts, transits, retrogrades, aspects, houses and the twelve signs.",
  alternates: { canonical: absoluteUrl("/astrology") },
  ...shareMeta(
    absoluteUrl("/astrology"),
    "Astrology — A Guide to the Zodiac",
    "Evergreen guides to astrology: birth charts, transits, retrogrades, aspects, houses and the twelve signs.",
  ),
};

export default function AstrologyIndexPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Breadcrumbs items={[{ label: "Astrology", href: "/astrology" }]} />
          </div>
          <p className="kicker">The knowledge base</p>
          <h1 className="mt-4 font-display text-4xl text-starlight sm:text-6xl">
            The Astronomy of Astrology
          </h1>
          <div aria-hidden="true" className="gold-rule mx-auto mt-7 w-20" />
          <p className="mt-7 text-lg leading-8 text-muted">
            A calm introduction to how the mathematics of the sky informs astrological
            interpretation. Every concept here connects to the real, calculated data behind
            Zunara&rsquo;s horizons.
          </p>
        </div>

        <div className="mt-12">
          <MoonSignCard />
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {ASTROLOGY_TOPICS.map((topic, i) => (
            <Link
              key={topic.slug}
              href={`/astrology/${topic.slug}`}
              className="group flex flex-col justify-between gap-8 bg-white/[0.03] p-7 backdrop-blur-xl transition-colors hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl text-gold/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-gold opacity-0 transition-opacity group-hover:opacity-100">→</span>
              </div>
              <div>
                <h2 className="font-display text-2xl text-starlight">{topic.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{topic.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

