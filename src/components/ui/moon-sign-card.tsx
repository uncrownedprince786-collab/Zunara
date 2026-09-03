import { moonPhase, moonSign } from "@/lib/astronomy/moon";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";

/**
 * Live lunar bulletin: exact moon sign (from astronomy-engine) plus phase card.
 * The Moon's zodiac sign is the most-read data point in astrology, so it gets a
 * dedicated editorial card. Rendered server-side from real ephemeris data.
 */
export function MoonSignCard() {
  const sign = moonSign();
  const phase = moonPhase();

  if (!sign) return null;

  return (
    <div className="paper-panel rounded-lg p-6">
      <p className="kicker">Moon card</p>
      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-cosmic/25 bg-cosmic/15">
          <ZodiacSymbol sign={sign.sign} size={40} className="text-gold" strokeWidth={1.8} label={sign.signName} />
        </div>
        <div>
          <p className="font-display text-2xl text-p-ink">Moon in {sign.signName}</p>
          <p className="mt-1 text-sm text-p-muted">
            {sign.glyph} {sign.position} · {phase.name}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-p-muted">
        {phase.illumination}% illuminated — the lunar cycle is a living clock for
        emotion and instinct. Follow the Moon&rsquo;s journey through the zodiac for
        the day&rsquo;s natural rhythm.
      </p>
    </div>
  );
}
