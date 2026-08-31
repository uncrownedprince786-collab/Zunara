import type { ZodiacSign } from "@/lib/zodiac/zodiac";
import { getZodiacSign } from "@/lib/zodiac/zodiac";

type Size = "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<Size, number> = {
  sm: 16,
  md: 24,
  lg: 40,
  xl: 64,
};

/**
 * Custom hand-drawn vector marks for the twelve zodiac signs.
 * Unified 1.2 stroke weight, monochrome-first, viewBox 0 0 24 24.
 * Designed to read cleanly from 16px to 256px.
 */
const PATHS: Record<string, Array<{ d: string; fill?: boolean }>> = {
  // Ram: elegant curled horn
  aries: [
    { d: "M4 15c2.2-5 5.6-7.8 8.5-7.8 1.9 0 3.6 1 4.7 2.9" },
    { d: "M9 10.5c.2-3.2 3.1-5.9 6.8-5.6-1.2-2.4-3-4-5.5-4.3" },
    { d: "M17.5 10.5c.5-.5 1.2-.8 2-.8 1.5 0 2.6 1 2.7 2.3 0 1.2-.9 2.2-2.2 2.2M17.5 10.5c.1.9.7 1.6 1.6 1.6" },
  ],
  // Bull: sweeping horns
  taurus: [
    { d: "M5 10.5c0-4 2.5-6.5 6-6.5 3.4 0 6 2.5 6 6.5 0 4.5-2.9 8-7 8" },
    { d: "M5 10.5 2.5 8M17 10.5l2.5-2.5" },
    { d: "M8.5 17.5 5 20" },
  ],
  // Twins: two figures
  gemini: [
    { d: "M7 4c1.5 0 2.5 2 2.5 4.5M17 4c-1.5 0-2.5 2-2.5 4.5M9.5 8.5c-2 2-2.5 4.5 0 8 1.8 2.6 1.8 5.5 0 5.5M14.5 8.5c2 2 2.5 4.5 0 8-1.8 2.6-1.8 5.5 0 5.5" },
  ],
  // Crab: body and claws
  cancer: [
    { d: "M9 9.5c-2.5-1.5-1.5-4.5.5-5.5 2.5-1.2 4.5.5 4.5 3 0 2.6-1.7 5-4.5 6.5-2.8 1.5-5.3 1-6.5-.5M15 9.5c2.5-1.5 1.5-4.5-.5-5.5-2.5-1.2-4.5.5-4.5 3 0 2.6 1.7 5 4.5 6.5 2.8 1.5 5.3 1 6.5-.5M10 12 7 20M14 12l3 8" },
  ],
  // Lion: tapering form
  leo: [
    { d: "M9 7c2.5-2 6-1.8 7.5 1 .8 1.5.6 3.2-.8 4.4-1.4 1.2-3.7 1.4-5.2.4" },
    { d: "M10.5 12.8c-1.2 1.1-1.5 3-.6 4.3 1.2 1.7 4 1.7 5.4.7" },
    { d: "M8.7 7.6C6.5 8 5.4 10.5 6.5 12.9c.6 1.3 1.9 2.2 3.3 2.4M15.8 9.4c2-1.4 4.4-.9 4.7 1.4.3 2-1.2 4-3.4 4.4" },
  ],
  // Maiden: flowing wheat
  virgo: [
    { d: "M12 4c0 2 0 4 0 6M12 4c.9.7 2.1.9 3.3.7M12 4C11 4.7 9.9 4.9 8.6 4.7" },
    { d: "M12 10c-.8 2.5-1.5 5-2 7.5" },
    { d: "M12 10c.8 2.5 1.5 5 2 7.5" },
    { d: "M10 14.5 7 17M14 14.5l3 2.5" },
    { d: "M10 20h4" },
  ],
  // Scales: balanced
  libra: [
    { d: "M12 7v4" },
    { d: "M4.5 21h15" },
    { d: "M12 11.5C9.5 15 7.5 17 4.5 17.5c.7 2.4 2 3.5 3.5 3.5s3-1.5 4-3.5zM12 11.5c2.5 3.5 4.5 5.5 7.5 6 .7 2.4-2 3.5-3.5 3.5S13 19.5 12 17.5" },
  ],
  // Scorpion: stinger
  scorpio: [
    { d: "M8 4c1.5 2.5 3.5 3 5 1.5C14.5 4 13.5 2 11.5 2c-2.5 0-3.5 2.5-1.5 4.5 1.5 1.5 3.5 1 5-.5" },
    { d: "M6.5 7.5 4 4.5M5.5 10l-3-2.5" },
    { d: "M7 14C4.5 18 5 21.5 8.5 20M4 19l2 2c.8.8 2 .8 3 0" },
  ],
  // Archer: bent bow
  sagittarius: [
    { d: "M18 4 4 18" },
    { d: "M4 6 18 20" },
    { d: "M18 4l2 2-4-1 2-1z" },
    { d: "M4 6 6 4 5 8z" },
    { d: "M9 15 5 18 8 20z" },
  ],
  // Goat-fish: rising arc
  capricorn: [
    { d: "M6.5 7.5C6.5 4 9 3 11 3c2 0 4 .5 4.5 4" },
    { d: "M15 8.5C15 7 16 6 17.5 6c.8 0 1.5.7 1.5 1.5 0 .8-.7 1.5-1.5 1.5H15z" },
    { d: "M11 9.5C8 12 6.5 16 7.5 21M6 19l1.5-2 2 1" },
  ],
  // Water bearer: waves
  aquarius: [
    { d: "M12 3.5c0 1.2 1.8 1.8 1.8 3.2 0 1.5-2 2.2-2 3.8" },
    { d: "M10.6 5.5c0 1.2-1.8 1.8-1.8 3.2 0 1.5 2 2.2 2 3.8" },
    { d: "M13.4 5.5c0 1.2 1.8 1.8 1.8 3.2 0 1.5-2 2.2-2 3.8" },
    { d: "M8 16.5h8M7.5 19h9" },
  ],
  // Fishes: two linked arcs
  pisces: [
    { d: "M5 5C2.8 7 2.5 10 5 12c2.3 2 4.8-1 4.5-4S8 4 5 5z" },
    { d: "M19 5c-2.2 2-2.5 5 0 7 2.3 2 4.8-1 4.5-4S22 4 19 5z" },
    { d: "M9.5 12 14.5 12" },
    { d: "M12 12v9" },
  ],
};

const LABEL_BY_SIGN: Record<string, string> = {
  aries: "Aries",
  taurus: "Taurus",
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces",
};

interface ZodiacSymbolProps {
  sign: string | ZodiacSign;
  size?: Size | number;
  className?: string;
  label?: string;
  strokeWidth?: number;
}

export function ZodiacSymbol({
  sign,
  size = "md",
  className = "",
  label,
  strokeWidth = 1.2,
}: ZodiacSymbolProps) {
  const slug = typeof sign === "string" ? sign : sign.slug;
  const resolved = typeof sign === "string" ? getZodiacSign(sign) : sign;
  const glyph = resolved?.glyph ?? "";
  const def = PATHS[slug] ?? [];
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  const aria = label ?? (resolved ? resolved.name : LABEL_BY_SIGN[slug] ?? slug);

  return (
    <svg
      viewBox="0 0 24 24"
      width={px}
      height={px}
      className={className}
      role="img"
      aria-label={`${aria} zodiac symbol`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {def.map((p, i) => (
        <path key={i} d={p.d} {...(p.fill ? { fill: "currentColor" } : {})} />
      ))}
      <title>{glyph} {aria}</title>
    </svg>
  );
}
