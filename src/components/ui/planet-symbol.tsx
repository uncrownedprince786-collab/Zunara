import type { BodyKey } from "@/lib/astronomy/bodies";
import { getCelestialBody } from "@/lib/astronomy/bodies";

type Size = "sm" | "md" | "lg";

const SIZE_MAP: Record<Size, number> = {
  sm: 16,
  md: 22,
  lg: 32,
};

/**
 * Vector glyphs for the ten core celestial bodies plus the lunar nodes.
 * Where possible these encode the standard astronomical symbol as a drawn
 * path so they render crisply and consistently (not platform emoji).
 */
const PLANET_PATHS: Record<BodyKey, Array<string>> = {
  // Sun: central circle with eight rays
  sun: ["M12 5V3", "M12 21v-2", "M5 12H3", "M21 12h-2", "M7 7 5.5 5.5", "M18.5 18.5 17 17", "M17 7l1.5-1.5", "M6.5 18.5 8 17", "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  // Moon: crescent
  moon: ["M18.5 3.2A9.2 9.2 0 1 0 20.8 14 8 8 0 0 1 18.5 3.2z"],
  // Mercury: cross on circle with horns
  mercury: ["M12 4v3", "M12 7a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z", "M12 14v4", "M4 18h16"],
  // Venus: circle over cross
  venus: ["M12 4v14", "M7 18h10", "M12 4a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z"],
  // Mars: circle over arrow
  mars: ["M12 4a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z", "M12 15.5V20", "M8 20h8"],
  // Jupiter: stylised '2'
  jupiter: ["M13.5 4H8v5h5a2.4 2.4 0 0 1 0 4.8H8"],
  // Saturn: cross over arc
  saturn: ["M11 3h4", "M13 3v16", "M9 16h8", "M9 16.5a4.5 4.5 0 1 0 0 5"],
  // Uranus: H with circle below
  uranus: ["M7 4v3", "M7 8v3", "M17 4v3", "M17 8v3", "M12 4v8", "M12 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  // Neptune: trident
  neptune: ["M12 4v6", "M6 21 12 10 18 21", "M9.5 17h5", "M8 21h8"],
  // Pluto: PL monogram over circle
  pluto: ["M7 4v7", "M7 4h4a2 2 0 0 1 0 4H7", "M8 21a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z", "M12.5 8.8 19 16"],
  // Nodes: ascending / descending
  northNode: ["M7 17 17 7", "M17 7h-4", "M17 7v4"],
  southNode: ["M7 17 17 7", "M7 7h4", "M11 7v4"],
};

const LABEL: Record<BodyKey, string> = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
  northNode: "North Node",
  southNode: "South Node",
};

interface PlanetSymbolProps {
  body: BodyKey;
  size?: Size | number;
  className?: string;
  label?: string;
  strokeWidth?: number;
}

export function PlanetSymbol({
  body,
  size = "md",
  className = "",
  label,
  strokeWidth = 1.3,
}: PlanetSymbolProps) {
  const celestial = getCelestialBody(body);
  const paths = PLANET_PATHS[body] ?? [];
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  const aria = label ?? LABEL[body] ?? celestial.name;

  return (
    <svg
      viewBox="0 0 24 24"
      width={px}
      height={px}
      className={className}
      role="img"
      aria-label={`${aria} astronomical symbol`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
      <title>{celestial.glyph} {aria}</title>
    </svg>
  );
}
