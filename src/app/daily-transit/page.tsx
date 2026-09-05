import type { Metadata } from "next";
import { DailyTransitClient } from "./daily-transit-client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Daily Transit — Your Personal Day",
  description:
    "See which planetary transits touch your chart today, which houses they highlight, and a concise plain-English summary of the day's signals.",
  alternates: { canonical: absoluteUrl("/daily-transit") },
  ...shareMeta(
    absoluteUrl("/daily-transit"),
    "Daily Transit — Your Personal Day | Zunara",
    "Personal transits against your natal chart, computed for any date.",
  ),
};

export default function DailyTransitPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 pt-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs items={[{ label: "Daily Transit", href: "/daily-transit" }]} />
        </div>
        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="kicker">Planets passing over your chart</p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-4 w-20" />
          <h1 className="mt-6 font-display text-4xl text-starlight sm:text-6xl">
            Daily Transit
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
            Enter your birth details and pick a date. Zunara computes where each planet sits
            in your houses that day and describes which life topics are highlighted —
            framed as topics, not predictions.
          </p>
        </div>
      </div>
      <DailyTransitClient />
    </div>
  );
}