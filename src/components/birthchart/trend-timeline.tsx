"use client";

import type { TransitForecast, TransitAspectName, TransitArea } from "@/lib/natal/transits";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { useLocale } from "@/lib/i18n/client";

const ASPECT_STYLE: Record<TransitAspectName, string> = {
  Conjunction: "border-gold/25 bg-gold/10 text-gold",
  Opposition: "border-red-500/25 bg-red-500/10 text-red-300",
  Square: "border-orange-500/25 bg-orange-500/10 text-orange-300",
  Trine: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  Sextile: "border-sky-500/25 bg-sky-500/10 text-sky-300",
};

const ASPECT_GLYPH: Record<TransitAspectName, string> = {
  Conjunction: "☌",
  Opposition: "☍",
  Square: "□",
  Trine: "△",
  Sextile: "⚹",
};

const PLANET_STYLE: Record<string, string> = {
  sun: "text-gold",
  moon: "text-starlight",
  mercury: "text-cosmic",
  venus: "text-gold-deep",
  mars: "text-red-400",
  jupiter: "text-orange-300",
  saturn: "text-subdued",
  uranus: "text-sky-300",
  neptune: "text-blue-300",
  pluto: "text-purple-300",
};

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const AREA_STYLE: Record<TransitArea, string> = {
  identity: "border-gold/25 bg-gold/10 text-gold",
  relationships: "border-pink-500/25 bg-pink-500/10 text-pink-300",
  "inner life": "border-violet-500/25 bg-violet-500/10 text-violet-300",
  career: "border-sky-500/25 bg-sky-500/10 text-sky-300",
  growth: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  energy: "border-orange-500/25 bg-orange-500/10 text-orange-300",
};

function formatRange(start: Date, end: Date): string {
  const monthA = MONTH_SHORT[start.getUTCMonth()];
  const monthB = MONTH_SHORT[end.getUTCMonth()];
  const year = end.getUTCFullYear();
  if (start.getUTCMonth() === end.getUTCMonth() && start.getUTCFullYear() === end.getUTCFullYear()) {
    return `${monthA} ${start.getUTCDate()} – ${end.getUTCDate()}, ${year}`;
  }
  return `${monthA} ${start.getUTCDate()} – ${monthB} ${end.getUTCDate()}, ${year}`;
}

interface TrendTimelineProps {
  forecast: TransitForecast[];
}

export function TrendTimeline({ forecast }: TrendTimelineProps) {
  const { t, tArea, tPlanet } = useLocale();

  if (forecast.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
        <p className="text-sm leading-6 text-muted">
          {t("birthchart.transitsNone", "No major transit aspects fall inside this horizon — the sky is quiet for now.")}
        </p>
      </div>
    );
  }

  return (
    <ol className="relative space-y-5">
      {forecast.map((entry) => {
        const transitColor = PLANET_STYLE[entry.transitBody] ?? "text-starlight";
        const targetColor = PLANET_STYLE[entry.targetBody] ?? "text-starlight";
        return (
          <li
            key={entry.id}
            className="relative rounded-xl border border-white/10 bg-white/[0.03] p-5 pl-10 sm:p-6 sm:pl-12"
          >
            <span aria-hidden className="absolute left-4 top-7 h-2.5 w-2.5 rounded-full bg-gold/70 sm:left-5" />

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 font-mono text-xs text-starlight">
                {formatRange(entry.start, entry.end)}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${ASPECT_STYLE[entry.aspectName]}`}>
                <span className="text-base leading-none">{ASPECT_GLYPH[entry.aspectName]}</span>
                {t(`aspects.${entry.aspectName.toLowerCase()}`, entry.aspectName)}
              </span>
              <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${AREA_STYLE[entry.area]}`}>
                {tArea(entry.area)}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-4">
              <span className="flex items-center gap-2">
                <PlanetSymbol body={entry.transitBody} size="sm" className={transitColor} decorative />
                <span className="text-sm font-medium text-starlight">{tPlanet(entry.transitBody)}</span>
              </span>
              <span aria-hidden className="text-gold/60">&#x2192;</span>
              <span className="flex items-center gap-2">
                <PlanetSymbol body={entry.targetBody} size="sm" className={targetColor} decorative />
                <span className="text-sm font-medium text-starlight">{tPlanet(entry.targetBody)}</span>
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-p-muted">{entry.note}</p>
          </li>
        );
      })}
    </ol>
  );
}