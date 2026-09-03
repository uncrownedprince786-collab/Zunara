import type { SVGProps } from "react";

/**
 * Zunara brand mark — a clean, minimal Vitruvian glyph.
 *
 * Core geometry of the artist's cosmic figure (circle + inscribed square +
 * geometric sun) rendered crisply for the navbar, footer and favicon. Unlike the
 * full detailed hero artwork, this mark has no fine rings or fine hairlines, so
 * it stays sharp and legible at 24–48 px. Intended to be tinted with
 * `currentColor` (gold in the chrome) at strokeWidth 1.8.
 */
export function VitruvianMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* outer circle (the cosmos) */}
      <circle cx="24" cy="24" r="21" />
      {/* inscribed square (the earth / the form) */}
      <rect x="11.2" y="11.2" width="25.6" height="25.6" transform="rotate(45 24 24)" />
      {/* central geometric sun */}
      <circle cx="24" cy="24" r="5.5" />
      <g strokeWidth="1.6">
        <path d="M24 4.5v4" />
        <path d="M24 39.5v4" />
        <path d="M4.5 24h4" />
        <path d="M39.5 24h4" />
        <path d="M10 10l3 3" />
        <path d="M35 35l3 3" />
        <path d="M38 10l-3 3" />
        <path d="M13 35l-3 3" />
      </g>
    </svg>
  );
}
