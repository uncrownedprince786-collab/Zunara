/**
 * Hero constellation visual — pure SVG + CSS animation (no canvas, no deps).
 * Renders a slow-drifting celestial map: star field, faint constellation
 * lines, and a gently rotating orbital ring. Fully decorative (aria-hidden)
 * and disabled under prefers-reduced-motion.
 */
export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-70"
    >
      <svg
        className="orbit-slower h-full w-full"
        viewBox="0 0 800 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        style={{ transformOrigin: "center" }}
      >
        <defs>
          <radialGradient id="hv-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
            <stop offset="60%" stopColor="currentColor" stopOpacity="0.12" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* orbital ring */}
        <g className="text-gold/50">
          <ellipse
            cx="400"
            cy="400"
            rx="320"
            ry="120"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 9"
            opacity="0.5"
          />
          <ellipse
            cx="400"
            cy="400"
            rx="240"
            ry="300"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 8"
            opacity="0.35"
            transform="rotate(30 400 400)"
          />
        </g>

        {/* nebula glow at centre */}
        <circle cx="400" cy="400" r="180" fill="url(#hv-core)" className="text-cosmic" opacity="0.5" />

        {/* constellation nodes */}
        <g stroke="currentColor" className="text-starlight/25">
          <path d="M120 200 210 150 260 260 380 210" strokeWidth="0.8" />
          <path d="M260 260 360 380 500 360 620 460" strokeWidth="0.8" />
          <path d="M380 210 498 120 620 460" strokeWidth="0.8" opacity="0.6" />
        </g>

        {/* stars — gentle nova pulse (staggered via animation-delay) */}
        <g className="text-starlight">
          <circle cx="120" cy="200" r="2.2" className="nova-pulse" />
          <circle cx="210" cy="150" r="1.6" className="nova-pulse" style={{ animationDelay: "1.2s" }} />
          <circle cx="260" cy="260" r="2.6" className="nova-pulse" style={{ animationDelay: "2.1s" }} />
          <circle cx="380" cy="210" r="1.8" className="nova-pulse" style={{ animationDelay: "0.6s" }} />
          <circle cx="498" cy="120" r="2.4" className="nova-pulse" style={{ animationDelay: "3s" }} />
          <circle cx="360" cy="380" r="1.5" className="nova-pulse" style={{ animationDelay: "1.8s" }} />
          <circle cx="500" cy="360" r="2.0" className="nova-pulse" style={{ animationDelay: "2.6s" }} />
          <circle cx="620" cy="460" r="2.8" className="nova-pulse" style={{ animationDelay: "0.4s" }} />
          <circle cx="140" cy="520" r="1.7" className="nova-pulse text-cosmic" style={{ animationDelay: "2.9s" }} />
          <circle cx="640" cy="170" r="1.5" className="nova-pulse text-nebula" style={{ animationDelay: "1.5s" }} />
        </g>
      </svg>
    </div>
  );
}
