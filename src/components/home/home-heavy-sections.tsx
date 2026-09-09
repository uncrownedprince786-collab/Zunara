"use client";

import dynamic from "next/dynamic";
import { SectionErrorBoundary } from "@/components/ui/section-error-boundary";

function SectionSkeleton() {
  return <div className="min-h-[20rem] animate-pulse rounded-2xl bg-white/[0.03]" />;
}

const SkyMapClientRaw = dynamic(
  () => import("@/app/sky-map/sky-map-client").then((m) => m.SkyMapClient),
  { ssr: false, loading: SectionSkeleton },
);

const DailyTransitClientRaw = dynamic(
  () => import("@/app/daily-transit/daily-transit-client").then((m) => m.DailyTransitClient),
  { ssr: false, loading: SectionSkeleton },
);

const BentoZodiacGridRaw = dynamic(
  () => import("@/components/ui/bento-zodiac-grid").then((m) => m.BentoZodiacGrid),
  { ssr: false, loading: SectionSkeleton },
);

const SkyEventsRaw = dynamic(
  () => import("@/components/sky/sky-events").then((m) => m.SkyEvents),
  { ssr: false, loading: SectionSkeleton },
);

const CosmicTraitsRaw = dynamic(
  () => import("@/components/ui/cosmic-traits").then((m) => m.CosmicTraits),
  { ssr: false, loading: SectionSkeleton },
);

export function SkyMapClient(props: Record<string, unknown>) {
  return (
    <SectionErrorBoundary>
      <SkyMapClientRaw {...props} />
    </SectionErrorBoundary>
  );
}

export function DailyTransitClient(props: Record<string, unknown>) {
  return (
    <SectionErrorBoundary>
      <DailyTransitClientRaw {...props} />
    </SectionErrorBoundary>
  );
}

export function BentoZodiacGrid(props: Record<string, unknown>) {
  return (
    <SectionErrorBoundary>
      <BentoZodiacGridRaw {...props} />
    </SectionErrorBoundary>
  );
}

export function SkyEvents(props: Record<string, unknown>) {
  return (
    <SectionErrorBoundary>
      <SkyEventsRaw {...props} />
    </SectionErrorBoundary>
  );
}

export function CosmicTraits(props: Record<string, unknown>) {
  return (
    <SectionErrorBoundary>
      <CosmicTraitsRaw {...props} />
    </SectionErrorBoundary>
  );
}
