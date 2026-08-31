import Link from "next/link";
import type { Metadata } from "next";
import { ASTROLOGY_TOPICS } from "@/lib/astrology/topics";

export const metadata: Metadata = {
  title: "Astrology \u2014 A Guide to the Zodiac",
  description:
    "Evergreen guides to astrology: birth charts, transits, retrogrades, aspects, houses and the twelve signs.",
};

export default function AstrologyIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Knowledge base</p>
      <h1 className="mt-4 font-display text-4xl text-starlight sm:text-5xl">The Astronomy of Astrology</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        A calm introduction to how the mathematics of the sky informs astrological interpretation.
        Every concept here connects to the real, calculated data behind Zunara&rsquo;s horizons.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {ASTROLOGY_TOPICS.map((topic) => (
          <Link
            key={topic.slug}
            href={`/astrology/${topic.slug}`}
            className="group flex flex-col rounded-xl border border-line bg-obsidian p-6 transition-colors hover:border-gold/40 hover:bg-obsidian-2"
          >
            <h2 className="font-display text-xl text-starlight">{topic.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{topic.summary}</p>
            <span className="mt-4 text-sm text-gold opacity-0 transition-opacity group-hover:opacity-100">
              Read more \u2192
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
