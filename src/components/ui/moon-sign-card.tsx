"use client";

import { moonPhase, moonSign } from "@/lib/astronomy/moon";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { useLocale } from "@/lib/i18n/client";

/**
 * Live lunar bulletin: exact moon sign (from astronomy-engine) plus phase card.
 */
export function MoonSignCard() {
  const { t, tSign } = useLocale();
  const sign = moonSign();
  const phase = moonPhase();

  if (!sign) return null;

  const localizedSignName = tSign(sign.sign);

  return (
    <div className="paper-panel rounded-lg p-6">
      <p className="kicker">{t("planets.moon", "Moon card")}</p>
      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-cosmic/25 bg-cosmic/15">
          <ZodiacSymbol sign={sign.sign} size={40} className="text-gold" strokeWidth={1.8} label={localizedSignName} />
        </div>
        <div>
          <p className="font-display text-2xl text-p-ink">
            {t("planets.moon", "Moon")} in {localizedSignName}
          </p>
          <p className="mt-1 text-sm text-p-muted">
            {sign.glyph} {sign.position} · {phase.name}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-p-muted">
        {phase.illumination}% illuminated — the lunar cycle is a living clock for
        emotion and instinct.
      </p>
    </div>
  );
}
