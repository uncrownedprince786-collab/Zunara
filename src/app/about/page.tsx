import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { elementText } from "@/components/ui/element";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";
import { LocaleText } from "@/components/ui/locale-text";

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
  { step: "01", titleKey: "about.step1Title", textKey: "about.step1Text" },
  { step: "02", titleKey: "about.step2Title", textKey: "about.step2Text" },
  { step: "03", titleKey: "about.step3Title", textKey: "about.step3Text" },
];

const ORIGINS = [
  { eraKey: "about.era1Era", titleKey: "about.era1Title", textKey: "about.era1Text", element: "Fire" as const },
  { eraKey: "about.era2Era", titleKey: "about.era2Title", textKey: "about.era2Text", element: "Earth" as const },
  { eraKey: "about.era3Era", titleKey: "about.era3Title", textKey: "about.era3Text", element: "Air" as const },
  { eraKey: "about.era4Era", titleKey: "about.era4Title", textKey: "about.era4Text", element: "Water" as const },
];

export default function AboutPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Breadcrumbs items={[{ label: "About", href: "/about" }]} />

        <header className="mt-8 max-w-3xl">
          <p className="kicker"><LocaleText path="about.kicker" fallback="The publication" /></p>
          <h1 className="mt-3 font-display text-4xl text-starlight sm:text-5xl">
            <LocaleText path="about.title" fallback="About Zunara" />
          </h1>
          <div aria-hidden="true" className="gold-rule mt-6 w-20" />
          <p className="mt-6 font-serif-body text-xl italic leading-8 text-muted">
            <LocaleText path="about.subtitle" fallback="Zunara publishes horoscopes grounded in real astronomical calculation — an editorial journal in the spirit of a refined celestial publication." />
          </p>
        </header>

        {/* ---- Methodology: 3 cards ---- */}
        <section className="mt-14" aria-labelledby="method-heading">
          <div className="flex items-baseline justify-between border-b border-line-soft pb-5">
            <div>
              <p className="kicker"><LocaleText path="about.methodKicker" fallback="Our method" /></p>
              <h2 id="method-heading" className="mt-2 font-display text-2xl text-starlight">
                <LocaleText path="about.methodTitle" fallback="Three truths behind every reading" />
              </h2>
            </div>
            <span className="hidden text-sm text-subdued sm:block">
              <LocaleText path="about.methodSubtitle" fallback="The method, in three steps" />
            </span>
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
                <h3 className="mt-4 font-display text-xl text-starlight">
                  <LocaleText path={card.titleKey} />
                </h3>
                <div aria-hidden="true" className="gold-rule mt-4 w-12" />
                <p className="mt-4 font-serif-body text-[1.02rem] leading-8 text-p-muted">
                  <LocaleText path={card.textKey} />
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Origins: history of astrology & astronomy ---- */}
        <section className="mt-20" aria-labelledby="origins-heading">
          <header className="max-w-2xl">
            <p className="kicker"><LocaleText path="about.originsKicker" fallback="A short history of the sky" /></p>
            <h2
              id="origins-heading"
              className="mt-3 font-display text-3xl leading-tight text-starlight sm:text-4xl"
            >
              <LocaleText path="about.originsTitle" fallback="Origins: how astrology & astronomy diverged" />
            </h2>
            <p className="mt-5 font-serif-body text-lg leading-8 text-muted">
              <LocaleText path="about.originsSubtitle" fallback="The same stars gave birth to two ways of seeing — one that measures the heavens, and one that seeks their meaning. Here is how they grew apart, and how Zunara holds both together." />
            </p>
          </header>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {ORIGINS.map((block) => {
              return (
                <div
                  key={block.titleKey}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl saturate-180"
                >
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${elementText(block.element)} opacity-20 to-transparent blur-2xl`}
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      <ElementMark element={block.element} />
                    </span>
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
                        <LocaleText path={block.eraKey} />
                      </p>
                      <h3 className="mt-1 font-display text-lg text-starlight">
                        <LocaleText path={block.titleKey} />
                      </h3>
                    </div>
                  </div>
                  <div aria-hidden="true" className={`mt-4 h-px w-12 ${elementText(block.element)} bg-current opacity-60`} />
                  <p className="mt-4 font-serif-body text-[0.98rem] leading-7 text-p-muted">
                    <LocaleText path={block.textKey} />
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
