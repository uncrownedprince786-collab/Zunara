"use client";

import { useMemo, useState } from "react";
import { ZODIAC_SIGNS, type Element } from "@/lib/zodiac/zodiac";
import { compatibilityBetween } from "@/lib/zodiac/compatibility";
import { ZodiacSymbol } from "./zodiac-symbol";
import { elementText } from "./element";
import { useLocale } from "@/lib/i18n/client";

const BAR_COLOR: Record<Element, string> = {
  Fire: "bg-fire",
  Earth: "bg-earth",
  Air: "bg-air",
  Water: "bg-water",
};

const GLOW: Record<Element, string> = {
  Fire: "bg-[radial-gradient(circle,rgba(245,158,11,0.28)_0%,transparent_70%)]",
  Earth: "bg-[radial-gradient(circle,rgba(160,185,129,0.28)_0%,transparent_70%)]",
  Air: "bg-[radial-gradient(circle,rgba(6,182,212,0.28)_0%,transparent_70%)]",
  Water: "bg-[radial-gradient(circle,rgba(139,92,246,0.28)_0%,transparent_70%)]",
};

function SignPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (slug: string) => void;
}) {
  const { t, tSign, tElement, tPlanet } = useLocale();
  const current = ZODIAC_SIGNS.find((s) => s.slug === value);

  return (
    <div className="flex-1">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {ZODIAC_SIGNS.map((sign) => {
          const active = sign.slug === value;
          return (
            <button
              key={sign.slug}
              type="button"
              onClick={() => onChange(sign.slug)}
              aria-pressed={active}
              aria-label={t("common.selectSign", "Select {sign}").replace("{sign}", tSign(sign.slug))}
              className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 transition-all duration-200 ${
                active
                  ? "border-gold/60 bg-gold/10 text-gold"
                  : "border-white/10 bg-white/[0.03] text-muted hover:border-white/25 hover:text-starlight"
              }`}
            >
              <span className={active ? "text-gold" : elementText(sign.element)}>
                <ZodiacSymbol sign={sign.slug} size={18} label={tSign(sign.slug)} />
              </span>
              <span className="hidden text-[0.7rem] font-medium sm:inline">{tSign(sign.slug)}</span>
            </button>
          );
        })}
      </div>
      {current && (
        <p className="mt-3 text-xs text-subdued">
          {tSign(current.slug)} · {tElement(current.element)} · {tPlanet(current.ruler.toLowerCase())}
        </p>
      )}
    </div>
  );
}

function ScoreBar({
  label,
  score,
  tint,
}: {
  label: string;
  score: number;
  tint: Element;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-starlight">{label}</p>
        <span className="font-display text-lg leading-none text-starlight">{score}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full ${BAR_COLOR[tint]} transition-[width] duration-700`}
          style={{ width: `${score}%`, opacity: 0.9 }}
        />
      </div>
    </div>
  );
}

export function CompatibilityHub() {
  const { t, tSign } = useLocale();
  const [a, setA] = useState<string | null>("aries");
  const [b, setB] = useState<string | null>("leo");

  const result = useMemo(
    () => (a && b ? compatibilityBetween(a, b) : null),
    [a, b],
  );

  const signA = ZODIAC_SIGNS.find((s) => s.slug === a);
  const signB = ZODIAC_SIGNS.find((s) => s.slug === b);
  const tint: Element = signA?.element ?? "Fire";

  return (
    <div className="paper-panel relative overflow-hidden p-8 sm:p-10">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full ${GLOW[tint]} blur-2xl`}
      />

      <div className="relative grid gap-8 lg:grid-cols-2">
        <SignPicker label={t("cosmicFacts.selectSignOne", "Select sign one")} value={a} onChange={setA} />
        <SignPicker label={t("cosmicFacts.selectSignTwo", "Select sign two")} value={b} onChange={setB} />
      </div>

      {result ? (
        <div className="relative mt-10">
          {signA && signB && (
            <div className="flex items-center justify-center gap-4">
              <span className="text-gold">
                <ZodiacSymbol sign={signA.slug} size="lg" label={tSign(signA.slug)} />
              </span>
              <span aria-hidden className="font-display text-2xl text-muted">&amp;</span>
              <span className="text-gold">
                <ZodiacSymbol sign={signB.slug} size="lg" label={tSign(signB.slug)} />
              </span>
              <span className="ms-2 font-display text-3xl font-semibold text-starlight">
                {result.overall}%
              </span>
            </div>
          )}

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {result.pillars.map((p) => (
              <div key={p.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <ScoreBar label={t(`areas.${p.label.toLowerCase()}`, p.label)} score={p.score} tint={tint} />
                <p className="mt-3 text-xs leading-5 text-muted">{p.blurb}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-gold/20 bg-gold/[0.04] p-6">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
              {t("common.verdict", "The verdict")}
            </p>
            <p className="mt-3 font-serif-body text-lg leading-8 text-starlight/90">
              {result.verdict}
            </p>
          </div>
        </div>
      ) : (
        <p className="relative mt-10 text-sm text-muted">{t("cosmicFacts.twoSignsMesh", "Choose two signs to reveal how they mesh.")}</p>
      )}
    </div>
  );
}
