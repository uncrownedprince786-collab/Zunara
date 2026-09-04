import type { Metadata } from "next";
import { BirthchartClient } from "./birthchart-client";
import { JsonLd } from "@/components/ui/json-ld";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Birth Chart Calculator — Free Natal Chart & Planetary Placements",
  description:
    "Calculate your exact natal birth chart, ascendant rising sign, houses and planetary placements using high-precision astronomical positions.",
  alternates: { canonical: absoluteUrl("/birthchart") },
  ...shareMeta(
    absoluteUrl("/birthchart"),
    "Birth Chart Calculator | Zunara",
    "Calculate your exact natal birth chart, ascendant, houses and planetary placements using precise astronomical positions.",
  ),
};

export default function BirthchartPage() {
  return (
    <>
      <JsonLd
        type="WebApplication"
        name="Zunara Birth Chart Calculator"
        description="Free natal birth chart calculator computing the sun, moon and rising signs, houses and planetary placements from precise VSOP87 astronomical positions."
        url={absoluteUrl("/birthchart")}
      />
      <BirthchartClient />
    </>
  );
}