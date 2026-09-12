import type { Metadata } from "next";
import { BirthchartClient } from "./birthchart-client";
import { JsonLd } from "@/components/ui/json-ld";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta, alternateLanguages } from "@/lib/seo/metadata";
import { softwareApplicationJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Free Birth Chart Calculator (Natal Chart)",
  description:
    "Calculate your exact natal birth chart, ascendant rising sign, houses and planetary placements using high-precision astronomical positions.",
  keywords: [
    "birth chart calculator",
    "free natal chart",
    "natal chart calculator",
    "ascendant rising sign",
    "planetary placements",
    "VSOP87 astrology",
  ],
  alternates: { canonical: absoluteUrl("/birthchart"), languages: alternateLanguages("/birthchart") },
  ...shareMeta(
    absoluteUrl("/birthchart"),
    "Free Birth Chart Calculator (Natal Chart) | Zunara",
    "Calculate your exact natal birth chart, ascendant rising sign, houses and planetary placements using high-precision astronomical positions.",
  ),
};

export default function BirthchartPage() {
  return (
    <>
      <JsonLd
        data={softwareApplicationJsonLd(
          "Zunara Birth Chart Calculator",
          "Free natal birth chart calculator computing the sun, moon and rising signs, houses and planetary placements from precise VSOP87 astronomical positions.",
          absoluteUrl("/birthchart"),
        )}
      />
      <BirthchartClient />
    </>
  );
}