"use client";

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

export function MoonPhaseWidget({ date }: { date?: Date }) {
  const mp = moonPhase(date);
  const { t } = useLocale();
  const phaseKey = PHASE_KEY[mp.name] ?? "newMoon";
  const localizedPhase = t(`phases.${phaseKey}`, mp.name);
  const illuminated = subst(t("phases.illuminated", "{illumination}% illuminated"), { illumination: String(mp.illumination) });
  const shadowWidth = ((1 - mp.illumination / 100) * 100);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 backdrop-blur-xl saturate-180">
      <div className="relative h-10 w-10 shrink-0 rounded-full bg-ink-3">
        <div className="absolute inset-0 rounded-full bg-starlight/90" />
        {shadowWidth > 0.5 && (
          <div
            className="absolute inset-0 rounded-full bg-ink-3"
            style={{
              clipPath: `ellipse(${Math.max(shadowWidth / 2, 0)}% 50% at ${mp.phase < 0.5 ? 25 : 75}% 50%)`,
            }}
          />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-starlight">{localizedPhase}</p>
        <p className="text-[0.7rem] text-subdued">{illuminated}</p>
      </div>
    </div>
  );
}
