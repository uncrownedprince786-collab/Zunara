import type { ZodiacSign, Element } from "@/lib/zodiac/zodiac";
import { getZodiacSign } from "@/lib/zodiac/zodiac";

type Size = "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<Size, number> = {
  sm: 16,
  md: 24,
  lg: 40,
  xl: 64,
};

/**
 * Element tint applied to each zodiac glyph by default. An explicit `className`
 * (e.g. `text-gold`) overrides it at the call site. Palette mirrors the
 * authentic zodiac element colors in the theme tokens (globals.css).
 */
const ELEMENT_CLASS: Record<Element, string> = {
  Fire: "text-fire",
  Earth: "text-earth",
  Air: "text-air",
  Water: "text-water",
};

const ELEMENT_OF_SIGN: Record<string, Element> = {
  aries: "Fire",
  taurus: "Earth",
  gemini: "Air",
  cancer: "Water",
  leo: "Fire",
  virgo: "Earth",
  libra: "Air",
  scorpio: "Water",
  sagittarius: "Fire",
  capricorn: "Earth",
  aquarius: "Air",
  pisces: "Water",
};

/**
 * Authentic, high-precision vector glyphs for the twelve zodiac signs,
 * composed of clean geometric strokes in a 24x24 viewBox. Each symbol follows
 * its canonical astronomical form (horns, twin pillars, claws, scales, arrow,
 * water waves, paired fishes). Stroke-based so they stay crisp at any size.
 */
const GLYPHS: Record<string, string[]> = {
  // ♈ Two flaring ram horns with curled tips
  aries: [
    "M12 18.5 C 13.8 14, 14.8 9.5, 15.6 6.8 C 16.2 4.9, 18.2 4.6, 19.2 6 C 20 7.2, 19 8.6, 17.8 8.3",
    "M12 18.5 C 10.2 14, 9.2 9.5, 8.4 6.8 C 7.8 4.9, 5.8 4.6, 4.8 6 C 4 7.2, 5 8.6, 6.2 8.3",
  ],
  // ♉ Bull head circle, up-curving horns and a shallow V base
  taurus: [
    "M9 10 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0",
    "M10.2 7 C 8.7 5, 7 3.5, 5 2.5",
    "M13.8 7 C 15.3 5, 17 3.5, 19 2.5",
    "M7 19 L12 14.5 L17 19",
  ],
  // ♊ Twin pillars (Roman-numeral II) with top cap and outward feet
  gemini: [
    "M7.5 4.5 H16.5",
    "M9.5 4.5 V14 C 9.5 16.5, 8.2 18.5, 6.5 19",
    "M14.5 4.5 V14 C 14.5 16.5, 15.8 18.5, 17.5 19",
  ],
  // ♋ Crab claws: central bar flanked by symmetric curls
  cancer: [
    "M6 13 H18",
    "M6 13 C 3 13, 3 7, 6.5 7 C 9.5 7, 8.5 10.2, 6.5 10.4",
    "M18 13 C 21 13, 21 7, 17.5 7 C 14.5 7, 15.5 10.2, 17.5 10.4",
  ],
  // ♌ Flowing lion mane loop, sweeping tail and top tuft
  leo: [
    "M11 18 C 15 20, 19 18, 19.5 14 C 20 9.5, 15.5 8.5, 13 10.5 C 11 12, 11.5 15, 13.5 15.2",
    "M11 18 C 8 19, 6 18.5, 4.5 17 C 3 15.5, 3.5 14, 5 14.5",
    "M13 10.5 C 11 9, 10 6.5, 10.5 4.5 C 11 3, 13 2.8, 14 4",
  ],
  // ♍ Virgin M with a looped right arm and a dot on the left stem
  virgo: [
    "M6 20 C 6 14, 6 8.6, 8 6",
    "M8 6 C 10 12, 10.5 15, 12 20",
    "M12 20 C 13 14, 15 11, 18.5 10.5",
    "M15 13 C 17 12, 18.8 12.5, 18.8 14.5 C 18.8 16.5, 17 17.2, 15.8 16.3 C 14.8 15.5, 15.4 14.3, 16.3 14.1",
    "M7.5 6 a1.3 1.3 0 1 0 0.01 0",
  ],
  // ♎ Balance scales: beam, pivot post and two hanging trays
  libra: [
    "M5 19 H19",
    "M12 10.5 V14",
    "M7 10.5 H17",
    "M7 10.5 L5 14.5 M7 10.5 L9 14.5 M5 14.5 L9 14.5",
    "M17 10.5 L15 14.5 M17 10.5 L19 14.5 M15 14.5 L19 14.5",
  ],
  // ♏ Scorpion M with a horizontal arrowed sting
  scorpio: [
    "M7 5 C 8 9, 8.2 13, 10 18",
    "M10 18 C 11 13, 11.2 11, 12.5 8",
    "M12.5 8 C 13.5 9.5, 14.8 10.5, 16.5 10.8",
    "M16.5 10.8 H21",
    "M21 10.8 L18.5 8.8 M21 10.8 L18.5 12.8",
  ],
  // ♐ Archer's arrow with crossbar and feather
  sagittarius: [
    "M5 4 L14.5 21",
    "M14.5 21 L16.5 19.5 M10.5 22.5 L14.5 21",
    "M12.5 12 L5 5",
    "M8 9.5 L5.5 8.5 M8 9.5 L7 12",
  ],
  // ♑ Sea-goat: top bar, spiral horn and right descender
  capricorn: [
    "M6 5 H17",
    "M6 5 V10 C 6 13, 8 17.5, 12 18.5 C 13.5 19, 15 18.8, 16 17.8 C 17 16.8, 17 15.2, 16 14.5 C 15 13.8, 14 14.6, 14 15.6",
    "M17 5 L21 9.5 L19.5 12",
  ],
  // ♒ Water bearer's twin zigzag waves
  aquarius: [
    "M3 6 L6 11 L9 6 L12 11 L15 6 L18 11 L21 6",
    "M3 15 L6 20 L9 15 L12 20 L15 15 L18 20 L21 15",
  ],
  // ♓ Two opposing fish arcs joined by a central bar with hooked tails
  pisces: [
    "M8.5 4 H15.5",
    "M8.5 4 C 11 7, 11 15, 8.5 18.5",
    "M15.5 4 C 13 7, 13 15, 15.5 18.5",
    "M8.5 18.5 C 9 20.5, 10 21.5, 11.5 21.5",
    "M15.5 18.5 C 15 20.5, 14 21.5, 12.5 21.5",
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
  strokeWidth = 2,
}: ZodiacSymbolProps) {
  const slug = typeof sign === "string" ? sign : sign.slug;
  const resolved = typeof sign === "string" ? getZodiacSign(sign) : sign;
  const glyph = resolved?.glyph ?? "";
  const paths = GLYPHS[slug] ?? [];
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  const aria = label ?? (resolved ? resolved.name : LABEL_BY_SIGN[slug] ?? slug);
  const element = ELEMENT_OF_SIGN[slug];
  const tint = element ? ELEMENT_CLASS[element] : "";
  const hasColor = /\btext-(gold|fire|earth|air|water)\b|\btext-\[/i.test(className);
  const classList = [hasColor ? "" : tint, className].filter(Boolean).join(" ");

  return (
    <svg
      viewBox="0 0 24 24"
      width={px}
      height={px}
      className={classList}
      role="img"
      aria-label={`${aria} zodiac symbol`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
      <title>{glyph} {aria}</title>
    </svg>
  );
}
