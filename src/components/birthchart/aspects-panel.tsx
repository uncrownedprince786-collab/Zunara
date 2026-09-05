"use client";

import type { NatalAspect, NatalChart, NatalAspectType } from "@/lib/natal/types";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { useLocale } from "@/lib/i18n/client";

const ASPECT_STYLE: Record<NatalAspectType, string> = {
  conjunction: "border-gold/25 bg-gold/10 text-gold",
  opposition: "border-red-500/25 bg-red-500/10 text-red-300",
  square: "border-orange-500/25 bg-orange-500/10 text-orange-300",
  trine: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  sextile: "border-sky-500/25 bg-sky-500/10 text-sky-300",
};

const ASPECT_GLYPH: Record<NatalAspectType, string> = {
  conjunction: "☌",
  opposition: "☍",
  square: "□",
  trine: "△",
  sextile: "⚹",
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

interface AspectsPanelProps {
  chart: NatalChart;
}

export function AspectsPanel({ chart }: AspectsPanelProps) {
  const { t, tPlanet } = useLocale();
  const aspects: NatalAspect[] = chart.aspects ?? [];

  if (aspects.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
        <h2 className="font-display text-2xl text-starlight">
          {t("birthchart.aspectsHeading", "Planetary Aspects")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {t("birthchart.aspectsNone", "No tight major aspects between the planets at this instant — a quiet, uncomplicated sky.")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden backdrop-blur-xl">
      <div className="p-6 border-b border-white/10">
        <h2 className="font-display text-2xl text-starlight">
          {t("birthchart.aspectsHeading", "Planetary Aspects")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {t("birthchart.aspectsIntro", "The major dynamic relationships between your planets — fused, flowing, or in tension. Each entry is calculated from the true angular separation and its rate of change.")}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02] text-start text-xs font-semibold uppercase tracking-wider text-muted">
              <th className="p-4 text-start">{t("birthchart.aspectsBodiesCol", "Bodies")}</th>
              <th className="p-4 text-start">{t("birthchart.aspectsTypeCol", "Aspect")}</th>
              <th className="p-4 text-start">{t("birthchart.aspectsOrbCol", "Orb")}</th>
              <th className="p-4 text-start">{t("birthchart.aspectsStatusCol", "Status")}</th>
              <th className="p-4 text-start">{t("birthchart.aspectsMeaningCol", "Meaning")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {aspects.map((a) => {
              const badge = ASPECT_STYLE[a.type];
              const aColor = PLANET_STYLE[a.a] ?? "text-starlight";
              const bColor = PLANET_STYLE[a.b] ?? "text-starlight";
              return (
                <tr key={`${a.a}-${a.b}-${a.type}`} className="align-top transition-colors hover:bg-white/[0.03]">
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-2">
                        <PlanetSymbol body={a.a} size="sm" className={aColor} decorative />
                        <span className="font-medium text-starlight">{tPlanet(a.a)}</span>
                      </span>
                      <span aria-hidden className="text-gold/60">&#x2192;</span>
                      <span className="flex items-center gap-2">
                        <PlanetSymbol body={a.b} size="sm" className={bColor} decorative />
                        <span className="font-medium text-starlight">{tPlanet(a.b)}</span>
                      </span>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${badge}`}>
                      <span className="text-base leading-none">{ASPECT_GLYPH[a.type]}</span>
                      {t(`aspects.${a.type}`, a.type)}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-muted whitespace-nowrap">
                    {a.orb.toFixed(1)}&deg;
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {a.applying ? (
                      <span className="rounded bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">
                        {t("birthchart.aspectsApplying", "Applying")}
                      </span>
                    ) : (
                      <span className="rounded bg-white/10 px-2 py-0.5 text-xs font-medium text-muted">
                        {t("birthchart.aspectsSeparating", "Separating")}
                      </span>
                    )}
                  </td>
                  <td className="max-w-md p-4 text-sm leading-6 text-p-muted">
                    {a.interpretation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}