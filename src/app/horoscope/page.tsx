import type { Metadata } from "next";
import Link from "next/link";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { DailyDesk } from "@/components/ui/daily-desk";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/ui/reveal";
import { StarMark } from "@/components/layout/star-mark";
import { SITE } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Today's Horoscopes | All Zodiac Signs",
  description:
    "A daily zodiac desk: today's real signal for all twelve signs, calculated from live astronomical data. Read daily, weekly, monthly and yearly forecasts.",
};

export default function HoroscopeIndexPage() {
  const horizons = [
    { type: "weekly", label: "This Week", desc: "The week ahead" },
    { type: "monthly", label: "This Month", desc: "A longer arc" },
    { type: "yearly", label: "This Year", desc: "The whole year" },
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
            Today&rsquo;s Horoscopes
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted">
            The daily zodiac desk. Choose your sign to read today&rsquo;s forecast — each
            signal below is drawn from the real positions of the Sun, Moon and planets.
          </p>
        </div>

        <div className="mt-14">
          <DailyDesk />
        </div>

        <Reveal className="mt-16">
          <section aria-labelledby="horizons-heading" className="rounded-lg border border-line bg-ink-2/60 p-7 sm:p-9">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="kicker">Beyond today</p>
                <h2 id="horizons-heading" className="mt-2 font-display text-2xl text-starlight">
                  Turn to the wider view
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                  Pick a sign to open its hub, then move from the day out to the week, month and
                  year — always from the same truthful astronomical positions.
                </p>
              </div>
              <div className="flex items-center gap-2 text-gold">
                <StarMark className="h-4 w-4" />
                <span className="text-[0.7rem] uppercase tracking-[0.2em]">Choose a sign</span>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {horizons.map((h) => (
                  <Link
                    key={h.type}
                    href={`/horoscope/aries/${h.type}`}
                    className="card-lift group flex items-center justify-between rounded-md border border-line bg-ink p-5 hover:bg-ink-3"
                  >
                    <div>
                      <p className="font-display text-lg text-starlight">{h.label}</p>
                      <p className="mt-0.5 text-sm text-subdued">{h.desc}</p>
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
