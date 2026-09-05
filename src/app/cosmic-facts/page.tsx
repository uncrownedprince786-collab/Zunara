import type { Metadata } from "next";
import { CosmicFactsClient } from "./cosmic-facts-client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Cosmic Traits & Facts — Zodiac Signs, Perks & Planetary Lore",
  description:
    "Explore every zodiac sign's core traits, superpowers, weaknesses, and cosmic fun facts. Interactive guide to the twelve signs, elemental forces, and compatibility.",
  alternates: { canonical: absoluteUrl("/cosmic-facts") },
  ...shareMeta(
    absoluteUrl("/cosmic-facts"),
    "Cosmic Traits & Facts | Zunara",
    "Explore every zodiac sign's core traits, superpowers, weaknesses, and cosmic fun facts.",
  ),
};

export default function CosmicFactsPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 pt-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs items={[{ label: "Horoscopes & Signs", href: "/cosmic-facts" }]} />
        </div>
      </div>
      <CosmicFactsClient />
    </div>
  );
}
