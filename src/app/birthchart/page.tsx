import type { Metadata } from "next";
import { BirthchartClient } from "./birthchart-client";
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
  return <BirthchartClient />;
}