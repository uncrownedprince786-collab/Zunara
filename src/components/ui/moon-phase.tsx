"use client";

import { useId } from "react";
import { moonPhase } from "@/lib/astronomy/moon";
import { useLocale } from "@/lib/i18n/client";

const PHASE_KEY: Record<string, string> = {
  "New Moon": "newMoon",
  "Waxing Crescent": "waxingCrescent",
  "First Quarter": "firstQuarter",
  "Waxing Gibbous": "waxingGibbous",
  "Full Moon": "fullMoon",
  "Waning Gibbous": "waningGibbous",
  "Last Quarter": "lastQuarter",
  "Waning Crescent": "waningCrescent",
};

function subst(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
}

/**
 * Night-side cap of the moon disc, built from the true sun–moon elongation.
 *
 * The lit disc is the region x·sinθ ≥ z·cosθ on the projected sphere, whose
 * terminator curves as x = cosθ·√(R² − y²). That terminator is an ellipse with
 * horizontal semi-axis R·|cosθ| and vertical semi-axis R. The night cap is
 * bounded by that terminator arc and the limb on the dark side, so we emit a
 * path that walks the limb (top → bottom) and returns along the terminator
 * (bottom → top), bulging toward the side the terminator actually faces:
 * crescent phases bulge toward the lit limb, gibbous phases away from it.
 */
function nightCapPath(R: number, elongationDeg: number): string {
  const theta = (elongationDeg * Math.PI) / 180;
  const cosT = Math.cos(theta);
  const rx = R * Math.abs(cosT);
  const waxing = Math.sin(theta) > 0;
  // Limb on the dark side: left for a waxing (right-lit) moon, right when waning.
  const limbSweep = waxing ? 0 : 1;
  // Terminator bulge sweeps toward the lit side for a crescent (cosθ > 0).
  const termSweep = waxing ? (cosT > 0 ? 0 : 1) : (cosT > 0 ? 1 : 0);
  const R2 = R.toFixed(2);
  return `M 0,-${R2} A ${R2},${R2} 0 0 ${limbSweep} 0,${R2} A ${rx.toFixed(2)},${R2} 0 0 ${termSweep} 0,-${R2} Z`;
}

export function MoonPhaseWidget({ date }: { date?: Date }) {
  const mp = moonPhase(date);
  const { t } = useLocale();
  const phaseKey = PHASE_KEY[mp.name] ?? "newMoon";
  const localizedPhase = t(`phases.${phaseKey}`, mp.name);
  const illuminated = subst(
    t("phases.illuminated", "{illumination}% illuminated"),
    { illumination: String(mp.illumination) },
  );
  const gradId = `z-moon-grad-${useId().replace(/:/g, "")}`;
  const R = 44;
  const night = nightCapPath(R, mp.phase * 360);
  const hiding = mp.illumination >= 99.5;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-xl saturate-180">
      <svg
        viewBox="-48 -48 96 96"
        className="h-10 w-10 shrink-0"
        role="img"
        aria-label={localizedPhase}
      >
        <defs>
          <radialGradient id={gradId} cx="38%" cy="38%" r="85%">
            <stop offset="0%" stopColor="var(--color-starlight)" stopOpacity="0.98" />
            <stop offset="60%" stopColor="var(--color-starlight)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--color-starlight)" stopOpacity="0.42" />
          </radialGradient>
        </defs>
        <circle r={R} fill="var(--color-starlight)" opacity="0.06" />
        <circle
          r={R}
          fill={`url(#${gradId})`}
          opacity={mp.illumination / 100}
        />
        {!hiding && <path d={night} fill="var(--color-ink-3)" />}
      </svg>
      <div className="min-w-0">
        <p className="text-sm font-medium text-starlight">{localizedPhase}</p>
        <p className="text-[0.7rem] text-subdued">{illuminated}</p>
      </div>
    </div>
  );
}