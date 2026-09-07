"use client";

import dynamic from "next/dynamic";

function SectionSkeleton() {
  return <div className="min-h-[20rem] animate-pulse rounded-2xl bg-white/[0.03]" />;
}

export const SkyMapClient = dynamic(
  () => import("@/app/sky-map/sky-map-client").then((m) => m.SkyMapClient),
  { ssr: false, loading: SectionSkeleton },
);

export const DailyTransitClient = dynamic(
  () => import("@/app/daily-transit/daily-transit-client").then((m) => m.DailyTransitClient),
  { ssr: false, loading: SectionSkeleton },
);

export const BentoZodiacGrid = dynamic(
  () => import("@/components/ui/bento-zodiac-grid").then((m) => m.BentoZodiacGrid),
  { ssr: false, loading: SectionSkeleton },
);

export const SkyEvents = dynamic(
  () => import("@/components/sky/sky-events").then((m) => m.SkyEvents),
  { ssr: false, loading: SectionSkeleton },
);

export const CelebrityBirthdays = dynamic(
  () => import("@/components/ui/celebrity-birthdays").then((m) => m.CelebrityBirthdays),
  { ssr: false, loading: SectionSkeleton },
);

export const CosmicTraits = dynamic(
  () => import("@/components/ui/cosmic-traits").then((m) => m.CosmicTraits),
  { ssr: false, loading: SectionSkeleton },
);