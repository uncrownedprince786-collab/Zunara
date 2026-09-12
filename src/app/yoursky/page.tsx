import type { Metadata } from "next";
import { YourSkyClient } from "./yoursky-client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Your Sky — Personal Transit Dashboard",
  description:
    "The strongest transit hitting your birth chart today, what it means, and the key transits coming over the next 30 days, from real planetary data.",
  alternates: { canonical: absoluteUrl("/yoursky") },
  ...shareMeta(
    absoluteUrl("/yoursky"),
    "Your Sky — Personal Transit Dashboard | Zunara",
    "The strongest transit hitting your birth chart today, what it means, and the key transits coming over the next 30 days, from real planetary data.",
  ),
};

export default function YourSkyPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 pt-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs
            items={[
              { label: "Your Sky", href: "/yoursky" },
            ]}
          />
        </div>
        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="kicker">Your personal sky</p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-4 w-20" />
          <h1 className="mt-6 font-display text-4xl text-starlight sm:text-6xl">
            Your Sky
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
            The strongest influence touching your chart right now, what it means,
            and the significant moments coming in the next 30 days — all computed
            from real planetary positions against your birth chart.
          </p>
        </div>
      </div>
      <YourSkyClient />
    </div>
  );
}