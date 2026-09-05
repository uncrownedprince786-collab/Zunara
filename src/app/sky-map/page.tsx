import type { Metadata } from "next";
import { SkyMapClient } from "./sky-map-client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Night Sky Map — See the Sky Now",
  description:
    "An interactive real-time map of the night sky from your coordinates: where the Sun, Moon, planets and bright stars are right now, computed with precise astronomy.",
  alternates: { canonical: absoluteUrl("/sky-map") },
  ...shareMeta(
    absoluteUrl("/sky-map"),
    "Night Sky Map — See the Sky Now | Zunara",
    "Interactive real-time sky map plotted from precise astronomical positions.",
  ),
};

export default function SkyMapPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 pt-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs items={[{ label: "Night Sky Map", href: "/sky-map" }]} />
        </div>
        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="kicker">Real-time astronomy, drawn to the dome</p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-4 w-20" />
          <h1 className="mt-6 font-display text-4xl text-starlight sm:text-6xl">
            Night Sky Map
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
            Look up from your coordinates. This map plots the Sun, Moon, planets and the
            brightest stars exactly where they are right now — altitude and azimuth
            computed from real ephemeris, not a static chart.
          </p>
        </div>
      </div>
      <SkyMapClient />
    </div>
  );
}
