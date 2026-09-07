import type { Metadata } from "next";
import { SynastryClient } from "./synastry-client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/ui/json-ld";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta, alternateLanguages } from "@/lib/seo/metadata";
import { softwareApplicationJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Synastry — Relationship Compatibility Chart",
  description:
    "Compare two birth charts across emotional, communication, attraction and long-term stability dimensions, calculated from real planetary positions.",
  keywords: [
    "synastry",
    "relationship compatibility",
    "compatibility chart",
    "two birth charts",
    "love compatibility astrology",
  ],
  alternates: { canonical: absoluteUrl("/synastry"), languages: alternateLanguages("/synastry") },
  ...shareMeta(
    absoluteUrl("/synastry"),
    "Synastry — Relationship Compatibility Chart | Zunara",
    "Deterministic relationship compatibility from two real birth charts.",
  ),
};

export default function SynastryPage() {
  return (
    <div className="constellation-bg">
      <JsonLd
        data={softwareApplicationJsonLd(
          "Zunara Synastry — Relationship Compatibility Chart",
          "Deterministic relationship compatibility computed from the real planetary angles between two birth charts across four relationship dimensions.",
          absoluteUrl("/synastry"),
        )}
      />
      <div className="mx-auto max-w-5xl px-4 pt-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs items={[{ label: "Synastry", href: "/synastry" }]} />
        </div>
        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="kicker">Two charts, side by side</p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-4 w-20" />
          <h1 className="mt-6 font-display text-4xl text-starlight sm:text-6xl">
            Synastry — Compatibility Chart
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
            Enter two birth details to see how your charts cross-reference across four
            relationship dimensions. Every score is calculated from the actual planetary
            angles between the two charts — no fortune-telling, no guesses.
          </p>
        </div>
      </div>
      <SynastryClient />
    </div>
  );
}
