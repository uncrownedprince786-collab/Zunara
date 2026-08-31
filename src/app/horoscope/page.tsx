import type { Metadata } from "next";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { ZodiacGrid } from "@/components/ui/zodiac-grid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SITE } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "All Zodiac Sign Horoscopes",
  description:
    "Daily, weekly, monthly and yearly horoscopes for all twelve zodiac signs, calculated from real astronomical data.",
};

export default function HoroscopeIndexPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Breadcrumbs items={[{ label: "Horoscopes", href: "/horoscope" }]} />
          <h1 className="mt-8 font-display text-4xl text-starlight sm:text-6xl">
            All Zodiac Horoscopes
          </h1>
          <div aria-hidden="true" className="gold-rule mx-auto mt-7 w-20" />
          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-muted">
            Twelve signs, four horizons. Choose your sign to read today&rsquo;s forecast, or turn
            to your weekly, monthly and yearly outlooks \u2014 each calculated from the true
            positions of the Sun, Moon and planets.
          </p>
        </div>

        <div className="mt-14">
          <ZodiacGrid hrefFor={(slug) => `/horoscope/${slug}`} />
        </div>

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
