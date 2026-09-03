import type { Metadata } from "next";
import Link from "next/link";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { DailyDesk } from "@/components/ui/daily-desk";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/ui/reveal";
import { VitruvianMark } from "@/components/ui/vitruvian-mark";
import { SITE, absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";
import { LocaleText } from "@/components/ui/locale-text";

export const metadata: Metadata = {
  title: "Today's Horoscopes | All Zodiac Signs",
  description:
    "A daily zodiac desk: today's real signal for all twelve signs, calculated from live astronomical data. Read daily, weekly, monthly and yearly forecasts.",
  alternates: { canonical: absoluteUrl("/horoscope") },
  ...shareMeta(
    absoluteUrl("/horoscope"),
    "Today's Horoscopes | All Zodiac Signs",
    "A daily zodiac desk: real signals for all twelve signs, calculated from live astronomical data.",
  ),
};

export default function HoroscopeIndexPage() {
  const horizons = [
    { type: "weekly", labelKey: "horizons.thisWeek", descKey: "horizons.weeklyDesc" },
    { type: "monthly", labelKey: "horizons.thisMonth", descKey: "horizons.monthlyDesc" },
    { type: "yearly", labelKey: "horizons.thisYear", descKey: "horizons.yearlyDesc" },
  ] as const;

  return (
    <div className="constellation-bg pb-20">
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
