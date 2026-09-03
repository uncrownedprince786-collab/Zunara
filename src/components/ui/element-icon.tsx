import type { Element } from "@/lib/zodiac/zodiac";

/**
 * Professional element icon (Lucide `flame` / `leaf` / `wind` / `droplets`,
 * ISC-licensed) replacing the earlier unicode runes (△▧⬦⧫). Draws with the
 * site's uniform 1.8 stroke so it matches the zodiac glyphs.
 */
const LUCIDE_ELEMENT: Record<Element, string[]> = {
  Fire: [
    "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",
  ],
  Earth: [
    "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
    "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
  ],
  Air: [
    "M12.8 19.6A2 2 0 1 0 14 16H2",
    "M17.5 8a2.5 2.5 0 1 1 2 4H2",
    "M9.8 4.4A2 2 0 1 1 11 8H2",
  ],
  Water: [
    "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",
    "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",
  ],
};

interface ElementIconProps {
  element: Element;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function ElementIcon({
  element,
  size = 24,
  className = "",
  strokeWidth = 1.8,
}: ElementIconProps) {
  const paths = LUCIDE_ELEMENT[element] ?? [];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`${element} element`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
