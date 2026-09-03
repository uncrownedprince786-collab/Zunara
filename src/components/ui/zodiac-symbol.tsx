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

/** A single SVG primitive within a zodiac icon. */
type GlyphElement =
  | { kind: "path"; d: string }
  | { kind: "circle"; cx: number; cy: number; r: number };

/** Canonical Lucide `zodiac-*` icon paths for the twelve signs. */
const LUCIDE_GLYPHS: Record<string, GlyphElement[]> = {
  aries: [{ kind: "path", d: "M12 7.5a4.5 4.5 0 1 1 5 4.5" }, { kind: "path", d: "M7 12a4.5 4.5 0 1 1 5-4.5V21" }],
  taurus: [{ kind: "circle", cx: 12, cy: 15, r: 6 }, { kind: "path", d: "M18 3A6 6 0 0 1 6 3" }],
  gemini: [
    { kind: "path", d: "M16 4.525v14.948" },
    { kind: "path", d: "M20 3A17 17 0 0 1 4 3" },
    { kind: "path", d: "M4 21a17 17 0 0 1 16 0" },
    { kind: "path", d: "M8 4.525v14.948" },
  ],
  cancer: [
    { kind: "path", d: "M21 14.5A9 6.5 0 0 1 5.5 19" },
    { kind: "path", d: "M3 9.5A9 6.5 0 0 1 18.5 5" },
    { kind: "circle", cx: 17.5, cy: 14.5, r: 3.5 },
    { kind: "circle", cx: 6.5, cy: 9.5, r: 3.5 },
  ],
  leo: [
    { kind: "path", d: "M10 16c0-4-3-4.5-3-8a5 5 0 0 1 10 0c0 3.466-3 6.196-3 10a3 3 0 0 0 6 0" },
    { kind: "circle", cx: 7, cy: 16, r: 3 },
  ],
  virgo: [
    { kind: "path", d: "M11 5.5a1 1 0 0 1 5 0V16a5 5 0 0 0 5 5" },
    { kind: "path", d: "M16 11.5a1 1 0 0 1 5 0V16a5 5 0 0 1-5 5" },
    { kind: "path", d: "M6 19V6a3 3 0 0 0-3-3h0" },
    { kind: "path", d: "M6 5.5a1 1 0 0 1 5 0V19" },
  ],
  libra: [
    { kind: "path", d: "M3 16h6.857c.162-.012.19-.323.038-.38a6 6 0 1 1 4.212 0c-.153.057-.125.368.038.38H21" },
    { kind: "path", d: "M3 20h18" },
  ],
  scorpio: [
    { kind: "path", d: "M10 19V5.5a1 1 0 0 1 5 0V17a2 2 0 0 0 2 2h5l-3-3" },
    { kind: "path", d: "m22 19-3 3" },
    { kind: "path", d: "M5 19V5.5a1 1 0 0 1 5 0" },
    { kind: "path", d: "M5 5.5A2.5 2.5 0 0 0 2.5 3" },
  ],
  sagittarius: [
    { kind: "path", d: "M15 3h6v6" },
    { kind: "path", d: "M21 3 3 21" },
    { kind: "path", d: "m9 9 6 6" },
  ],
  capricorn: [
    { kind: "path", d: "M11 21a3 3 0 0 0 3-3V6.5a1 1 0 0 0-7 0" },
    { kind: "path", d: "M7 19V6a3 3 0 0 0-3-3h0" },
    { kind: "circle", cx: 17, cy: 17, r: 3 },
  ],
  aquarius: [
    { kind: "path", d: "m2 10 2.456-3.684a.7.7 0 0 1 1.106-.013l2.39 3.413a.7.7 0 0 0 1.096-.001l2.402-3.432a.7.7 0 0 1 1.098 0l2.402 3.432a.7.7 0 0 0 1.098 0l2.389-3.413a.7.7 0 0 1 1.106.013L22 10" },
    { kind: "path", d: "m2 18.002 2.456-3.684a.7.7 0 0 1 1.106-.013l2.39 3.413a.7.7 0 0 0 1.097 0l2.402-3.432a.7.7 0 0 1 1.098 0l2.402 3.432a.7.7 0 0 0 1.098 0l2.389-3.413a.7.7 0 0 1 1.106.013L22 18.002" },
  ],
  pisces: [
    { kind: "path", d: "M19 21a15 15 0 0 1 0-18" },
    { kind: "path", d: "M20 12H4" },
    { kind: "path", d: "M5 3a15 15 0 0 1 0 18" },
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
  strokeWidth = 1.8,
}: ZodiacSymbolProps) {
  const slug = typeof sign === "string" ? sign : sign.slug;
  const resolved = typeof sign === "string" ? getZodiacSign(sign) : sign;
  const glyph = resolved?.glyph ?? "";
  const parts = LUCIDE_GLYPHS[slug] ?? [];
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
      {parts.map((part, i) =>
        part.kind === "path" ? (
          <path key={i} d={part.d} />
        ) : (
          <circle key={i} cx={part.cx} cy={part.cy} r={part.r} />
        ),
      )}
      <title>{glyph} {aria}</title>
    </svg>
  );
}
