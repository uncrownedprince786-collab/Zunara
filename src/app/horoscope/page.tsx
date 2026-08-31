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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Horoscopes", href: "/horoscope" }]} />
        <h1 className="mt-6 font-display text-4xl text-starlight sm:text-5xl">All Zodiac Horoscopes</h1>
        <p className="mt-4 leading-7 text-muted">
          Twelve signs, four horizons. Choose your sign to read today&rsquo;s forecast, or look
          ahead to your weekly, monthly and yearly outlooks \u2014 each calculated from real
          astronomical positions of the Sun, Moon and planets.
        </p>
      </div>
      <div className="mt-10">
        <ZodiacGrid hrefFor={(slug) => `/horoscope/${slug}`} />
      </div>
      <div className="mx-auto mt-12 max-w-3xl">
        <p className="text-sm text-subdued">
          Zunara&rsquo;s {ZODIAC_SIGNS.length} sign horoscopes are generated deterministically from live
          astronomical data. Planetary positions and aspects are computed locally and never
          fabricated. {SITE.tagline}
        </p>
      </div>
    </div>
  );
}
