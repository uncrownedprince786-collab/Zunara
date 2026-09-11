"use client";

import { moonPhase, moonSign } from "@/lib/astronomy/moon";
import { startOfUtcDay } from "@/lib/astronomy/astro";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { useLocale } from "@/lib/i18n/client";
import { plainMoon } from "@/lib/content/sky-plain";

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
 * Live lunar bulletin: exact moon sign (from astronomy-engine) plus phase card.
 */
export function MoonSignCard() {
  const { t, tSign } = useLocale();
  // Stable UTC-day reference so server prerender and client hydration agree.
  const today = startOfUtcDay();
  const sign = moonSign(today);
  const phase = moonPhase(today);

  if (!sign) return null;

  const localizedSignName = tSign(sign.sign);
  const phaseKey = PHASE_KEY[phase.name] ?? "newMoon";
  const localizedPhase = t(`phases.${phaseKey}`, phase.name);
  const moonLabel = t("planets.moon", "Moon");
  const moonInSign = subst(t("phases.moonInSign", "{planet} in {sign}"), { planet: moonLabel, sign: localizedSignName });
  const illuminated = subst(t("phases.illuminated", "{illumination}% illuminated"), { illumination: String(phase.illumination) });

  return (
    <div className="paper-panel rounded-lg p-6">
      <p className="kicker">{moonLabel}</p>
      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-cosmic/25 bg-cosmic/15">
          <ZodiacSymbol sign={sign.sign} size={40} className="text-gold" strokeWidth={1.8} label={localizedSignName} />
        </div>
        <div>
          <p className="font-display text-2xl text-p-ink">
            {moonInSign}
          </p>
          <p className="mt-1 text-sm text-p-muted">
            {sign.glyph} {sign.position} · {localizedPhase}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-p-muted">
        {illuminated} — {t("phases.phaseSubtitle", "the lunar cycle is a living clock for emotion and instinct.")}
      </p>
      <p className="mt-2 border-s-2 border-gold/30 ps-3 text-xs leading-5 text-subdued">
        {t("uichrome.inPlainWords", "In plain words: ")}
        {plainMoon(sign.sign, phase.name)}
      </p>
    </div>
  );
}
