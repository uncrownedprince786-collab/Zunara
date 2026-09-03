import type { CSSProperties } from "react";

/**
 * Detailed Vitruvian hero watermark.
 *
 * A rich, circular cosmic composition (concentric zodiac ring, orbital rings,
 * inscribed square + circle, and a central geometric sun) used purely as an
 * ambient backdrop behind hero copy. Because the fine lines collapse at nav
 * sizes, this is reserved for large hero/section backgrounds and is never used
 * as the logo mark (see `<VitruvianMark />` for the crisp logo).
 *
 * Always rendered inside an `overflow-hidden` parent and configured with
 * `pointer-events-none select-none` plus low opacity + a screen blend so it
 * glows subtly over the Midnight Indigo canvas without blocking clicks.
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
      className={`pointer-events-none select-none ${className}`}
      style={style}
    >
      <svg
        className="h-auto w-full mix-blend-screen"
        viewBox="0 0 800 800"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="vh-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD166" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#FFD166" stopOpacity="0.18" />
            <stop offset="75%" stopColor="#8B7CF6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#8B7CF6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ambient glow */}
        <circle cx="400" cy="400" r="400" fill="url(#vh-glow)" />

        {/* outer zodiac ring with degree ticks */}
        <g stroke="#FFD166" strokeOpacity="0.5">
          <circle cx="400" cy="400" r="372" strokeWidth="1.1" />
          <circle cx="400" cy="400" r="356" strokeWidth="0.6" strokeDasharray="2 6" />
        </g>
        {Array.from({ length: 72 }).map((_, i) => {
          const a = (i * 5 * Math.PI) / 180;
          const r1 = i % 6 === 0 ? 349 : 355;
          return (
            <line
              key={`tick-${i}`}
              x1={400 + Math.sin(a) * r1}
              y1={400 - Math.cos(a) * r1}
              x2={400 + Math.sin(a) * 374}
              y2={400 - Math.cos(a) * 374}
              stroke="#FFD166"
              strokeOpacity={i % 6 === 0 ? 0.8 : 0.35}
              strokeWidth={i % 6 === 0 ? 1.4 : 0.7}
            />
          );
        })}

        {/* thin orbital rings */}
        <g stroke="#8B7CF6" strokeOpacity="0.5">
          <ellipse cx="400" cy="400" rx="320" ry="160" strokeWidth="0.8" />
          <ellipse cx="400" cy="400" rx="300" ry="240" strokeWidth="0.6" transform="rotate(30 400 400)" />
          <ellipse cx="400" cy="400" rx="280" ry="196" strokeWidth="0.6" transform="rotate(-30 400 400)" />
        </g>

        {/* vitruvian square + circle */}
        <g stroke="#FFD166" strokeOpacity="0.6" strokeWidth="1.2">
          <rect x="216" y="216" width="368" height="368" transform="rotate(45 400 400)" />
          <circle cx="400" cy="400" r="180" />
        </g>

        {/* central geometric sun */}
        <g stroke="#FFD166" strokeWidth="1.4" strokeOpacity="0.85">
          <circle cx="400" cy="400" r="44" />
          <circle cx="400" cy="400" r="30" strokeOpacity="0.6" strokeDasharray="2 6" />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * 15 * Math.PI) / 180;
            const r1 = 46;
            const r2 = i % 3 === 0 ? 62 : 56;
            return (
              <line
                key={`ray-${i}`}
                x1={400 + Math.sin(a) * r1}
                y1={400 - Math.cos(a) * r1}
                x2={400 + Math.sin(a) * r2}
                y2={400 - Math.cos(a) * r2}
                stroke="#FFD166"
                strokeWidth={i % 3 === 0 ? 1.6 : 0.9}
              />
            );
          })}
        </g>

        {/* four cardinal nodes */}
        <g fill="#FFD166" fillOpacity="0.7">
          <circle cx="400" cy="56" r="3" />
          <circle cx="400" cy="744" r="3" />
          <circle cx="56" cy="400" r="3" />
          <circle cx="744" cy="400" r="3" />
        </g>
      </svg>
    </div>
  );
}
