import Image from "next/image";
import type { CSSProperties } from "react";

/**
 * High-detail Vitruvian Cosmic Hero Watermark.
 *
 * Used exclusively as an ambient backdrop behind hero copy on `/` and `/birthchart`.
 * Fully centered behind the text via `absolute inset-0 flex items-center
 * justify-center pointer-events-none`, sized to `max-w-[550px]` with
 * `opacity-15` and `object-contain` so the entire circle and Vitruvian figure
 * remain 100% visible and never clipped.
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
      className={`pointer-events-none absolute inset-0 flex items-center justify-center select-none ${className}`}
      style={style}
    >
      <Image
        src="/vitruvian-cosmic.jpg"
        alt=""
        width={550}
        height={550}
        priority
        sizes="(max-width: 550px) 100vw, 550px"
        className="mx-auto max-w-[550px] object-contain opacity-15"
      />
    </div>
  );
}
