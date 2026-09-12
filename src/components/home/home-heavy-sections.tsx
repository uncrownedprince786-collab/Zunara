"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SectionErrorBoundary } from "@/components/ui/section-error-boundary";

function SectionSkeleton() {
  return <div className="min-h-[20rem] animate-pulse rounded-2xl bg-white/[0.03]" />;
}

/** Renders `children` only once the wrapper scrolls near the viewport, so the
    lazily-loaded island chunks and their astronomy compute don't run during
    the initial page load. */
function useInView<T extends HTMLElement>(margin = "600px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: margin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [margin]);
  return { ref, inView };
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
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <SectionErrorBoundary>
      <div ref={ref} className="min-h-[20rem]">
        {inView ? <SkyMapClientRaw {...props} /> : <SectionSkeleton />}
      </div>
    </SectionErrorBoundary>
  );
}

export function DailyTransitClient(props: Record<string, unknown>) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <SectionErrorBoundary>
      <div ref={ref} className="min-h-[20rem]">
        {inView ? <DailyTransitClientRaw {...props} /> : <SectionSkeleton />}
      </div>
    </SectionErrorBoundary>
  );
}

export function BentoZodiacGrid(props: Record<string, unknown>) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <SectionErrorBoundary>
      <div ref={ref} className="min-h-[20rem]">
        {inView ? <BentoZodiacGridRaw {...props} /> : <SectionSkeleton />}
      </div>
    </SectionErrorBoundary>
  );
}

export function SkyEvents(props: Record<string, unknown>) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <SectionErrorBoundary>
      <div ref={ref} className="min-h-[20rem]">
        {inView ? <SkyEventsRaw {...props} /> : <SectionSkeleton />}
      </div>
    </SectionErrorBoundary>
  );
}

export function CosmicTraits(props: Record<string, unknown>) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <SectionErrorBoundary>
      <div ref={ref} className="min-h-[20rem]">
        {inView ? <CosmicTraitsRaw {...props} /> : <SectionSkeleton />}
      </div>
    </SectionErrorBoundary>
  );
}
