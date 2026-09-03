import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * High-detail Vitruvian Cosmic Hero Watermark.
 *
 * Used exclusively as an ambient backdrop behind hero copy on `/` and `/birthchart`.
 * Uses `pointer-events-none select-none`, `max-w-[650px]`, `opacity-15` (0.12 - 0.18 range),
 * and `mix-blend-screen` over Midnight Indigo (`#0A0B12`) to create a subtle celestial glow.
 *
 * NOTE: Never downscale or use as the navbar logo (see `<VitruvianMark />` for the sharp, minimal SVG logo).
 */
export function VitruvianHero({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none absolute left-1/2 top-10 sm:top-6 -translate-x-1/2 w-full max-w-[650px] px-4 opacity-15 mix-blend-screen overflow-hidden ${className}`}
      style={style}
    >
      <div className="relative aspect-square w-full">
        <Image
          src="/vitruvian-cosmic.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 650px) 100vw, 650px"
          className="object-contain"
        />
      </div>
    </div>
  );
}
