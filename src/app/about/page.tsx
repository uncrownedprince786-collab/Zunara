import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "About Zunara & Methodology",
  description:
    "How Zunara calculates real astronomical positions and turns them into daily, weekly, monthly and yearly horoscopes.",
};

export default function AboutPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Breadcrumbs items={[{ label: "About", href: "/about" }]} />

        <header className="mt-8">
          <p className="kicker">The publication</p>
          <h1 className="mt-3 font-display text-4xl text-starlight sm:text-5xl">About Zunara</h1>
          <div aria-hidden="true" className="gold-rule mt-6 w-20" />
          <p className="mt-6 font-serif-body text-xl italic leading-8 text-muted">
            Zunara publishes horoscopes grounded in real astronomical calculation — an
            editorial journal in the spirit of a refined celestial publication.
          </p>
        </header>

        <div className="paper-panel mt-10 rounded-md">
          <div className="border-b border-p-line p-2 text-center">
            <p className="font-serif-body italic text-p-muted">Zunara · The method</p>
          </div>
          <div className="space-y-9 p-7 sm:p-9">
            <section>
              <h2 className="kicker !text-gold-deep">The method</h2>
              <div className="gold-rule mt-3 w-14" />
              <p className="mt-4 font-serif-body text-[1.05rem] leading-8 text-p-ink">
                Every planetary position on Zunara is calculated from astronomical theory using the
                open-source astronomy-engine library, which implements the well-established VSOP87
                analytical theory of planetary motion combined with IAU models for precession,
                nutation and aberration. These are the same class of models used in published
                ephemerides. We never invent or approximate a planetary position.
              </p>
            </section>
            <section>
              <h2 className="kicker !text-gold-deep">From data to words</h2>
              <div className="gold-rule mt-3 w-14" />
              <p className="mt-4 font-serif-body text-[1.05rem] leading-8 text-p-ink">
                Our forecasts follow a transparent pipeline: we calculate the true positions and
                aspects of the Sun, Moon and planets for each day; interpret those through a
                classical Western tropical astrology framework and its rulerships; then compose
                structured, human-written editorial fragments in a deterministic, reproducible way.
                The astronomy is always the source of truth; the writing renders it with warmth.
              </p>
            </section>
            <section>
              <h2 className="kicker !text-gold-deep">A note on astrology</h2>
              <div className="gold-rule mt-3 w-14" />
              <p className="mt-4 font-serif-body text-[1.05rem] leading-8 text-p-ink">
                Astrology is a practice of reflection and entertainment, not a science. It is
                provided for contemplation and is not a substitute for professional medical, legal
                or financial advice. We are transparent about this, so you can engage with the sky
                with both an open mind and a grounded one.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
