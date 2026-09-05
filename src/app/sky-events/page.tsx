import type { Metadata } from "next";
import { SkyEvents } from "@/components/sky/sky-events";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Upcoming Sky Events — Meteor Showers, Eclipses & More",
  description:
    "Live from astronomical ephemerides: meteor showers, eclipses, oppositions, conjunctions and lunar phases worth stepping outside for, with export to your calendar.",
  alternates: { canonical: absoluteUrl("/sky-events") },
  ...shareMeta(
    absoluteUrl("/sky-events"),
    "Upcoming Sky Events | Zunara",
    "Meteor showers, eclipses, oppositions and lunar phases computed from real astronomical data.",
  ),
};

export default function SkyEventsPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs items={[{ label: "Upcoming Sky Events", href: "/sky-events" }]} />
        </div>
        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="kicker">The sky, on the calendar</p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-4 w-20" />
          <h1 className="mt-6 font-display text-4xl text-starlight sm:text-6xl">
            Upcoming Sky Events
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
            Meteor showers, eclipses, oppositions and lunar phases worth stepping
            outside for — pulled from live ephemerides and refreshed automatically.
          </p>
        </div>
      </div>
      <div className="mt-10">
        <SkyEvents />
      </div>
    </div>
  );
}