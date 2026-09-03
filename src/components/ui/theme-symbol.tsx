/**
 * Consistent monochrome SVG pictography for the recurring life themes.
 * Same geometric/stroke language as `zodiac-symbol` and `planet-symbol`
 * (24x24 viewBox, currentColor stroke), so every mark belongs to one brand.
 */
type Size = "sm" | "md" | "lg";

const SIZE_MAP: Record<Size, number> = {
  sm: 16,
  md: 22,
  lg: 30,
};

export type ThemeKey =
  | "love"
  | "work"
  | "money"
  | "energy"
  | "communication"
  | "growth"
  | "change"
  | "focus";

const THEME_PATHS: Record<ThemeKey, string[]> = {
  // Love: paired hearts / embrace
  love: [
    "M12 20C8 16.5 5 14 5 10.6 5 8.6 6.6 7 8.6 7c1.3 0 2.5.7 3.4 1.8C13 7.7 14.2 7 15.4 7 17.4 7 19 8.6 19 10.6c0 3.4-3 5.9-7 9.4z",
  ],
  // Work: a column / desk with measure
  work: [
    "M8 7V5a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 16 5v2",
    "M6 7h12",
    "M6 7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2",
    "M12 12v4",
  ],
  // Money: a coin with a subtle counterweight / crescent
  money: [
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
    "M12 6.5v2.5",
    "M12 15v2.5",
    "M9.8 10.4c0-1 1-1.6 2.4-1.6 1.3 0 2.2.6 2.2 1.6 0 2.5-4.4 1.4-4.4 3.9 0 1 1 1.6 2.3 1.6 1.4 0 2.3-.6 2.4-1.6",
  ],
  // Energy: a spark / bolt drawn as a clean angular flame
  energy: [
    "M13 3 5 13h5l-1 8 9-11h-5l0-7z",
  ],
  // Communication: speech marks / two nodes joined
  communication: [
    "M8 10a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-4l-3 2v-2H9a1 1 0 0 1-1-1v-3z",
    "M6 14l-2 3",
    "M12 6V4",
  ],
  // Growth: a rising shoot
  growth: [
    "M12 21V4",
    "M12 5C9 5 7.5 6.8 7.5 9.5c0 2 1.2 3.6 3 4.4",
    "M12 5c3 0 4.5 1.8 4.5 4.5 0 2-1.2 3.6-3 4.4",
  ],
  // Change: two arrows in a cycle
  change: [
    "M20 12a8 8 0 1 1-2.3-5.6",
    "M18 3v4h-4",
  ],
  // Focus: a target / lens
  focus: [
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    "M12 11.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z",
  ],
};

const LABEL: Record<ThemeKey, string> = {
  love: "Love",
  work: "Work",
  money: "Money",
  energy: "Energy",
  communication: "Communication",
  growth: "Growth",
  change: "Change",
  focus: "Focus",
};

interface ThemeSymbolProps {
  theme: ThemeKey;
  size?: Size | number;
  className?: string;
  label?: string;
  strokeWidth?: number;
}

export function ThemeSymbol({
  theme,
  size = "md",
  className = "",
  label,
  strokeWidth = 1.8,
}: ThemeSymbolProps) {
  const paths = THEME_PATHS[theme] ?? [];
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  const aria = label ?? LABEL[theme] ?? theme;

  return (
    <svg
      viewBox="0 0 24 24"
      width={px}
      height={px}
      className={className}
      role="img"
      aria-label={`${aria} theme`}
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

export function themeLabel(theme: ThemeKey): string {
  return LABEL[theme];
}
