"use client";

import type { NatalChart } from "@/lib/natal/types";

const SIGN_DATA = [
  { slug: "aries", glyph: "♈", name: "Aries", start: 0 },
  { slug: "taurus", glyph: "♉", name: "Taurus", start: 30 },
  { slug: "gemini", glyph: "♊", name: "Gemini", start: 60 },
  { slug: "cancer", glyph: "♋", name: "Cancer", start: 90 },
  { slug: "leo", glyph: "♌", name: "Leo", start: 120 },
  { slug: "virgo", glyph: "♍", name: "Virgo", start: 150 },
  { slug: "libra", glyph: "♎", name: "Libra", start: 180 },
  { slug: "scorpio", glyph: "♏", name: "Scorpio", start: 210 },
  { slug: "sagittarius", glyph: "♐", name: "Sagittarius", start: 240 },
  { slug: "capricorn", glyph: "♑", name: "Capricorn", start: 270 },
  { slug: "aquarius", glyph: "♒", name: "Aquarius", start: 300 },
  { slug: "pisces", glyph: "♓", name: "Pisces", start: 330 },
];

const PLANET_DATA: Record<string, { glyph: string; color: string }> = {
  sun: { glyph: "☉", color: "#FFD166" },
  moon: { glyph: "☽", color: "#E2E8F0" },
  mercury: { glyph: "☿", color: "#8B7CF6" },
  venus: { glyph: "♀", color: "#FFD166" },
  mars: { glyph: "♂", color: "#EF4444" },
  jupiter: { glyph: "♃", color: "#F97316" },
  saturn: { glyph: "♄", color: "#A3A3A3" },
  uranus: { glyph: "♅", color: "#22D3EE" },
  neptune: { glyph: "♆", color: "#3B82F6" },
  pluto: { glyph: "♇", color: "#A855F7" },
};

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function polar(center: number, radius: number, angleDeg: number): { x: number; y: number } {
  const rad = degToRad(angleDeg - 90);
  return { x: center + Math.cos(rad) * radius, y: center + Math.sin(rad) * radius };
}

interface ChartWheelProps {
  chart: NatalChart;
  size?: number;
}

export function ChartWheel({ chart, size = 480 }: ChartWheelProps) {
  const center = size / 2;
  const outerR = center - 16;
  const signR = outerR - 40;
  const houseR = signR - 40;
  const planetR = houseR - 30;

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <defs>
          <radialGradient id="wheel-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#090B10" />
            <stop offset="100%" stopColor="#12151F" />
          </radialGradient>
          <radialGradient id="wheel-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD166" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#8B7CF6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* background */}
        <circle cx={center} cy={center} r={outerR} fill="url(#wheel-bg)" stroke="#1E293B" strokeWidth="1" />

        {/* zodiac ring */}
        <g stroke="#334155" strokeWidth="0.5">
          {SIGN_DATA.map((s) => {
            const start = degToRad(s.start - 90);
            const end = degToRad(s.start + 30 - 90);
            const x1 = center + Math.cos(start) * signR;
            const y1 = center + Math.sin(start) * signR;
            const x2 = center + Math.cos(end) * signR;
            const y2 = center + Math.sin(end) * signR;
            const largeArc = 30 > 180 ? 1 : 0;
            return (
              <path
                key={s.slug}
                d={`M${x1} ${y1} A${signR} ${signR} 0 ${largeArc} 1 ${x2} ${y2}`}
                fill="none"
              />
            );
          })}
        </g>

        {/* sign glyphs */}
        {SIGN_DATA.map((s) => {
          const angle = s.start + 15;
          const pos = polar(center, signR + 12, angle);
          return (
            <text
              key={s.slug}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
              fill="#FFD166"
              opacity="0.7"
            >
              {s.glyph}
            </text>
          );
        })}

        {/* house cusps (whole sign) */}
        <g stroke="#FFD166" strokeOpacity="0.3" strokeWidth="0.6">
          {chart.houses.cusps.map((c, i) => {
            const angle = c.longitude;
            const p1 = polar(center, houseR, angle);
            const p2 = polar(center, houseR - 15, angle);
            return (
              <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />
            );
          })}
        </g>

        {/* house numbers */}
        {chart.houses.cusps.map((c, i) => {
          const angle = c.longitude + 15;
          const pos = polar(center, houseR - 28, angle);
          return (
            <text
              key={`house-${i}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill="#FFD166"
              opacity="0.6"
              fontWeight="600"
            >
              {i + 1}
            </text>
          );
        })}

        {/* Ascendant / Midheaven markers */}
        {(() => {
          const ascPos = polar(center, outerR + 8, chart.houses.ascendantLongitude);
          const mcPos = polar(center, outerR + 8, chart.houses.midheavenLongitude);
          return (
            <>
              <text
                x={ascPos.x}
                y={ascPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fill="#FFD166"
                fontWeight="700"
              >
                ASC
              </text>
              <text
                x={mcPos.x}
                y={mcPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fill="#8B7CF6"
                fontWeight="700"
              >
                MC
              </text>
            </>
          );
        })()}

        {/* planets */}
        <g fontSize="14" fontWeight="600">
          {chart.planets.map((p) => {
            const pd = PLANET_DATA[p.key];
            const angle = p.longitude;
            const pos = polar(center, planetR, angle);
            const retro = p.retrograde ? " ℞" : "";
            return (
              <g key={p.key}>
                <circle cx={pos.x} cy={pos.y} r={8} fill="#090B10" stroke={pd.color} strokeWidth="1.2" />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={pd.color}
                >
                  {pd.glyph}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 22}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="8"
                  fill="#64748B"
                >
                  {p.sign.slice(0, 3)} {p.degree}°{retro}
                </text>
              </g>
            );
          })}
        </g>

        {/* center glow */}
        <circle cx={center} cy={center} r={planetR - 40} fill="url(#wheel-glow)" />
      </svg>
    </div>
  );
}