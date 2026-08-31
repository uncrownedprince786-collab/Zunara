import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "About Zunara & Methodology",
  description:
    "How Zunara calculates real astronomical positions and turns them into daily, weekly, monthly and yearly horoscopes.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "About", href: "/about" }]} />
      <header className="mt-8">
        <h1 className="font-display text-4xl text-starlight">About Zunara</h1>
        <p className="mt-3 text-lg text-muted">
          Zunara publishes horoscopes grounded in real astronomical calculation \u2014 an editorial
          publication in the spirit of a refined celestial journal.
        </p>
      </header>

      <section className="mt-10 space-y-6">
        <div>
          <h2 className="font-display text-2xl text-starlight">The method</h2>
          <p className="mt-3 leading-7 text-starlight/90">
            Every planetary position on Zunara is calculated from astronomical theory using the
            open-source astronomy-engine library, which implements the well-established VSOP87
            analytical theory of planetary motion combined with IAU models for precession,
            nutation and aberration. These are the same class of models used in published
            ephemerides. We never invent or approximate a planetary position.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-starlight">From data to words</h2>
          <p className="mt-3 leading-7 text-starlight/90">
            Our forecasts follow a transparent pipeline: we calculate the true positions and
            aspects of the Sun, Moon and planets for each day; interpret those through a
            classical Western tropical astrology framework and its rulerships; then compose
            structured, human-written editorial fragments in a deterministic, reproducible way.
            The astronomy is always the source of truth; the writing renders it with warmth.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl text-starlight">A note on astrology</h2>
          <p className="mt-3 leading-7 text-starlight/90">
            Astrology is a practice of reflection and entertainment, not a science. It is provided
            for contemplation and is not a substitute for professional medical, legal or financial
            advice. We are transparent about this, so you can engage with the sky with both an open
            mind and a grounded one.
          </p>
        </div>
      </section>
    </article>
  );
}
