import type { Metadata } from "next";
import Link from "next/link";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { DailyDesk } from "@/components/ui/daily-desk";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/ui/reveal";
import { VitruvianMark } from "@/components/ui/vitruvian-mark";
import { SITE, absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/ui/json-ld";
import { LocaleText } from "@/components/ui/locale-text";

export const metadata: Metadata = {
  title: "Today's Horoscope for All 12 Zodiac Signs",
  description:
    "Today's horoscope for all 12 zodiac signs, calculated from live planetary positions, plus weekly, monthly and yearly forecasts.",
  alternates: { canonical: absoluteUrl("/horoscope") },
  ...shareMeta(
    absoluteUrl("/horoscope"),
    "Today's Horoscope for All 12 Zodiac Signs | Zunara",
    "Today's horoscope for all 12 zodiac signs, calculated from live planetary positions, plus weekly, monthly and yearly forecasts.",
  ),
};

export default function HoroscopeIndexPage() {
  const horizons = [
    { type: "weekly", labelKey: "horizons.thisWeek", descKey: "horizons.weeklyDesc" },
    { type: "monthly", labelKey: "horizons.thisMonth", descKey: "horizons.monthlyDesc" },
    { type: "yearly", labelKey: "horizons.thisYear", descKey: "horizons.yearlyDesc" },
  ] as const;

  const FAQ_ITEMS = [
    {
      question: "What is my horoscope today?",
      answer:
        "Choose your zodiac sign on Zunara to read a daily forecast calculated from the real current positions of the Sun, Moon and planets.",
    },
    {
      question: "How are Zunara horoscopes calculated?",
      answer:
        "Every planetary position is computed deterministically from the VSOP87 astronomical model and IAU precession models, the same class of models used in published ephemerides. Positions and aspects are never invented.",
    },
    {
      question: "What are the twelve zodiac signs?",
      answer:
        "Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius and Pisces.",
    },
    {
      question: "What is the difference between a sun sign and a rising sign?",
      answer:
        "Your sun sign reflects your core identity. Your rising (ascendant) sign is the sign rising on the eastern horizon at your exact birth time and place, and shapes how you present to the world.",
    },
  ];

  return (
    <div className="constellation-bg pb-20">
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <Breadcrumbs items={[{ label: "Horoscopes", href: "/horoscope" }]} />
          </div>
          <div aria-hidden className="gold-rule mx-auto mt-6 w-20" />
          <h1 className="mt-6 font-display text-4xl text-starlight sm:text-6xl">
            <LocaleText path="nav.horoscopes" fallback="Today's Horoscopes" />
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted">
            <LocaleText path="home.anIndexOfHeavensDesc" fallback="The daily zodiac desk. Choose your sign to read today's forecast — each signal below is drawn from the real positions of the Sun, Moon and planets." />
          </p>
        </div>

        <div className="mt-14">
          <DailyDesk />
        </div>

        <Reveal className="mt-16">
          <section aria-labelledby="horizons-heading" className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-7 backdrop-blur-xl saturate-180 sm:p-9">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="kicker"><LocaleText path="home.horizonsKicker" fallback="Beyond today" /></p>
                <h2 id="horizons-heading" className="mt-2 font-display text-2xl text-starlight">
                  <LocaleText path="home.horizonsTitle" fallback="Turn to the wider view" />
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                  <LocaleText path="home.horizonsDesc" fallback="Pick a sign to open its hub, then move from the day out to the week, month and year — always from the same truthful astronomical positions." />
                </p>
              </div>
              <div className="flex items-center gap-2 text-gold">
                <VitruvianMark className="h-4 w-4" />
                <span className="text-[0.7rem] uppercase tracking-[0.2em]">
                  <LocaleText path="cosmicFacts.chooseSign" fallback="Choose a sign" />
                </span>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {horizons.map((h) => (
                <Link
                  key={h.type}
                  href={`/horoscope/aries/${h.type}`}
                  className="card-lift group flex items-center justify-between rounded-md border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl transition-colors hover:bg-white/[0.05]"
                >
                  <div>
                    <p className="font-display text-lg text-starlight"><LocaleText path={h.labelKey} /></p>
                    <p className="mt-0.5 text-sm text-subdued"><LocaleText path={h.descKey} /></p>
                  </div>
                  <span aria-hidden className="text-gold opacity-60 transition-opacity group-hover:opacity-100">
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>

        <section aria-labelledby="faq-heading" className="mx-auto mt-16 max-w-3xl">
          <h2 id="faq-heading" className="text-center font-display text-2xl text-starlight">
            Common questions
          </h2>
          <div className="mt-8 space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base text-starlight">
                  {item.question}
                  <span aria-hidden className="text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-sm leading-7 text-muted">
            Want a forecast for exactly you, not just your sun sign?{" "}
            <Link href="/birthchart" className="text-gold hover:underline">
              Calculate your free birth chart
            </Link>{" "}
            to find your rising sign, moon sign and personal transits.
          </p>
        </section>

        <div className="mx-auto mt-14 flex max-w-2xl items-center gap-4 text-center">
          <div aria-hidden="true" className="gold-rule h-px flex-1" />
          <p className="text-sm leading-6 text-subdued">
            {SITE.tagline} {ZODIAC_SIGNS.length} sign horoscopes, generated deterministically from
            live astronomical data. Positions and aspects are computed locally and never fabricated.
          </p>
          <div aria-hidden="true" className="gold-rule h-px flex-1" />
        </div>
      </div>
    </div>
  );
}
