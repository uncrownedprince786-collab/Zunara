import type { Metadata } from "next";
import { CosmicFactsClient } from "./cosmic-facts-client";
import { absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Cosmic Traits & Facts — Zodiac Signs, Perks & Planetary Lore",
  description:
    "Explore every zodiac sign's core traits, superpowers, weaknesses, and cosmic fun facts. Interactive guide to the twelve signs, elemental forces, and compatibility.",
  openGraph: {
    title: "Cosmic Traits & Facts | Zunara",
    description:
      "Explore every zodiac sign's core traits, superpowers, weaknesses, and cosmic fun facts.",
    url: absoluteUrl("/cosmic-facts"),
    type: "website",
  },
  alternates: {
    canonical: absoluteUrl("/cosmic-facts"),
  },
};

export default function CosmicFactsPage() {
  return <CosmicFactsClient />;
}
