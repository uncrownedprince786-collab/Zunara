import type { Metadata } from "next";
import { CosmicFactsClient } from "./cosmic-facts-client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/ui/json-ld";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta, alternateLanguages } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Cosmic Traits & Facts — Zodiac Signs, Perks & Planetary Lore",
  description:
    "Explore every zodiac sign's core traits, superpowers, weaknesses, and cosmic fun facts. Interactive guide to the twelve signs, elemental forces, and compatibility.",
  keywords: [
    "zodiac sign traits",
    "cosmic facts",
    "zodiac signs personality",
    "elemental forces",
    "astrology signs",
  ],
  alternates: { canonical: absoluteUrl("/cosmic-facts"), languages: alternateLanguages("/cosmic-facts") },
  ...shareMeta(
    absoluteUrl("/cosmic-facts"),
    "Cosmic Traits & Facts | Zunara",
    "Explore every zodiac sign's core traits, superpowers, weaknesses, and cosmic fun facts.",
  ),
};

export default function CosmicFactsPage() {
  const signList = {
    "@type": "ItemList",
    name: "The twelve zodiac signs",
    itemListElement: ZODIAC_SIGNS.map((sign, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "DefinedTerm",
        name: sign.name,
        url: absoluteUrl(`/horoscope/${sign.slug}`),
      },
    })),
  };
  return (
    <div className="constellation-bg">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...signList,
        }}
      />
      <div className="mx-auto max-w-5xl px-4 pt-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs items={[{ label: "Horoscopes & Signs", href: "/cosmic-facts" }]} />
        </div>
      </div>
      <CosmicFactsClient />
    </div>
  );
}
