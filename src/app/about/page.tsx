import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { elementText } from "@/components/ui/element";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "About Zunara & Methodology",
  description:
    "How Zunara calculates real astronomical positions and turns them into daily, weekly, monthly and yearly horoscopes — and the ancient origins of sky-watching.",
  alternates: { canonical: absoluteUrl("/about") },
  ...shareMeta(
    absoluteUrl("/about"),
    "About Zunara & Methodology",
    "How Zunara calculates real astronomical positions and turns them into daily, weekly, monthly and yearly horoscopes.",
  ),
};

const METHOD_STEPS = [
  {
    step: "01",
    title: "The Method",
    text: `Every planetary position on Zunara is calculated from astronomical theory using the open-source astronomy-engine library, which implements the well-established VSOP87 analytical theory of planetary motion combined with IAU models for precession, nutation and aberration. These are the same class of models used in published ephemerides. We never invent or approximate a planetary position.`,
  },
  {
    step: "02",
    title: "From Data to Words",
    text: `Our forecasts follow a transparent pipeline: we calculate the true positions and aspects of the Sun, Moon and planets for each day; interpret those through a classical Western tropical astrology framework and its rulerships; then compose structured, human-written editorial fragments in a deterministic, reproducible way. The astronomy is always the source of truth; the writing renders it with warmth.`,
  },
  {
    step: "03",
    title: "A Note on Astrology",
    text: `Astrology is a practice of reflection and entertainment, not a science. It is provided for contemplation and is not a substitute for professional medical, legal or financial advice. We are transparent about this, so you can engage with the sky with both an open mind and a grounded one.`,
  },
];

const ORIGINS = [
  {
    era: "Ancient beginnings",
    title: "Babylon & Egypt",
    text: `Long before observatories, early humans looked up and mapped the repeating patterns of the constellations. In Mesopotamia and along the Nile, these star charts were put to practical use — predicting the seasonal harvests and the annual river floods that made civilization itself possible. The sky was the first calendar and the first clock.`,
  },
  {
    era: "The birth of astrology",
    title: "The rise of the zodiac",
    text: `As priest-scholars studied the wandering planets, they began to connect the movement of the heavens to events on Earth — royal fortunes, the fates of kingdoms, the timing of war and peace. The zodiac took shape as a symbolic language of the sky, one that linked celestial motion to human destiny and the omens of monarchs.`,
  },
  {
    era: "The scientific revolution",
    title: "Astronomy and astrology part ways",
    text: `With Copernicus placing the Sun at the center, Galileo turning his telescope to the planets, and Kepler laying down the laws of orbital motion, physical observation became its own discipline. Astronomy grew from symbolic interpretation into measurement and prediction — while astrology retained its reflective, symbolic role in human experience.`,
  },
  {
    era: "The Zunara balance",
    title: "Both worlds, today",
    text: `Zunara sits at the meeting point of these two traditions. We use exact VSOP87 mathematical physics to compute the real positions of the Sun, Moon and planets — then offer them as modern, reflective human guidance. Honest about what the math can do, and thoughtful about the meaning we find in it.`,
  },
];

export default function AboutPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Breadcrumbs items={[{ label: "About", href: "/about" }]} />

        <header className="mt-8 max-w-3xl">
          <p className="kicker">The publication</p>
          <h1 className="mt-3 font-display text-4xl text-starlight sm:text-5xl">About Zunara</h1>
          <div aria-hidden="true" className="gold-rule mt-6 w-20" />
          <p className="mt-6 font-serif-body text-xl italic leading-8 text-muted">
            Zunara publishes horoscopes grounded in real astronomical calculation — an
            editorial journal in the spirit of a refined celestial publication.
          </p>
        </header>

        {/* ---- Methodology: 3 Apple-spec glass cards ---- */}
        <section className="mt-14" aria-labelledby="method-heading">
          <div className="flex items-baseline justify-between border-b border-line-soft pb-5">
            <div>
              <p className="kicker">Our method</p>
              <h2 id="method-heading" className="mt-2 font-display text-2xl text-starlight">
                Three truths behind every reading
              </h2>
            </div>
            <span className="hidden text-sm text-subdued sm:block">The method, in three steps</span>
          </div>

          <div className="mt-8 grid items-stretch gap-6 md:grid-cols-3">
            {METHOD_STEPS.map((card) => (
              <div
                key={card.step}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl saturate-180 transition-colors hover:border-gold/30"
              >
                <span
                  aria-hidden="true"
                  className="font-display text-3xl text-gold/60"
                >
                  {card.step}
                </span>
                <h3 className="mt-4 font-display text-xl text-starlight">{card.title}</h3>
                <div aria-hidden="true" className="gold-rule mt-4 w-12" />
                <p className="mt-4 font-serif-body text-[1.02rem] leading-8 text-p-muted">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Origins: history of astrology & astronomy ---- */}
        <section className="mt-20" aria-labelledby="origins-heading">
          <header className="max-w-2xl">
            <p className="kicker">A short history of the sky</p>
            <h2
              id="origins-heading"
              className="mt-3 font-display text-3xl leading-tight text-starlight sm:text-4xl"
            >
              Origins: how astrology &amp; astronomy diverged
            </h2>
            <p className="mt-5 font-serif-body text-lg leading-8 text-muted">
              The same stars gave birth to two ways of seeing — one that measures the
              heavens, and one that seeks their meaning. Here is how they grew apart,
              and how Zunara holds both together.
            </p>
          </header>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {ORIGINS.map((block, i) => {
              const element = (["Fire", "Earth", "Air", "Water"] as const)[i];
              return (
                <div
                  key={block.title}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl saturate-180"
                >
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${elementText(element)} opacity-20 to-transparent blur-2xl`}
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      <ElementMark element={element} />
                    </span>
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
                        {block.era}
                      </p>
                      <h3 className="mt-1 font-display text-lg text-starlight">{block.title}</h3>
                    </div>
                  </div>
                  <div aria-hidden="true" className={`mt-4 h-px w-12 ${elementText(element)} bg-current opacity-60`} />
                  <p className="mt-4 font-serif-body text-[0.98rem] leading-7 text-p-muted">
                    {block.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function ElementMark({ element }: { element: "Fire" | "Earth" | "Air" | "Water" }) {
  const rune: Record<string, string> = {
    Fire: "△",
    Earth: "▧",
    Air: "⬦",
    Water: "⧫",
  };
  return (
    <span className={`grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] ${elementText(element)}`}>
      {rune[element]}
    </span>
  );
}
