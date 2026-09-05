import type { Metadata } from "next";
import { EphemerisClient } from "./ephemeris-client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Ephemeris — Live Planetary Positions by Day",
  description:
    "Interactive daily ephemeris of the Sun, Moon, eight planets and lunar nodes, with sign, degree, longitude, element and motion for any date.",
  alternates: { canonical: absoluteUrl("/ephemeris") },
  ...shareMeta(
    absoluteUrl("/ephemeris"),
    "Ephemeris — Live Planetary Positions | Zunara",
    "Day-by-day planetary positions, signs, longitudes and retrograde motion.",
  ),
};

export default function EphemerisPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 pt-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs items={[{ label: "Ephemeris", href: "/ephemeris" }]} />
        </div>
        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="kicker">The daily sky table</p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-4 w-20" />
          <h1 className="mt-6 font-display text-4xl text-starlight sm:text-6xl">
            Ephemeris
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
            Choose a date to see the exact calculated position of every body — the Sun,
            Moon, eight planets and the lunar nodes — for that day.
          </p>
        </div>
      </div>
      <EphemerisClient />
    </div>
  );
}
