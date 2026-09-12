import type { Metadata } from "next";
import { SkyEventsCalendar } from "@/components/sky/sky-events-calendar";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Sky Events Calendar: Eclipses & Meteor Showers",
  description:
    "A perpetual calendar of meteor showers, eclipses, oppositions, conjunctions and lunar phases, computed from real astronomical data.",
  alternates: { canonical: absoluteUrl("/sky-events") },
  ...shareMeta(
    absoluteUrl("/sky-events"),
    "Sky Events Calendar: Eclipses & Meteor Showers | Zunara",
    "A perpetual calendar of meteor showers, eclipses, oppositions, conjunctions and lunar phases, computed from real astronomical data.",
  ),
};

export default function SkyEventsPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs items={[{ label: "Sky Events Calendar", href: "/sky-events" }]} />
        </div>
        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="kicker">The sky, on the calendar</p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-4 w-20" />
          <h1 className="mt-6 font-display text-4xl text-starlight sm:text-6xl">
            Sky Events Calendar
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
            Meteor showers, eclipses, oppositions, conjunctions and lunar phases
            computed from real astronomical data — browse any year, always up to date.
          </p>
        </div>
      </div>
      <div className="mt-10">
        <SkyEventsCalendar />
      </div>
    </div>
  );
}
