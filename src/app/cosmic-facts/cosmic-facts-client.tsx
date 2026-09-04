"use client";

import { useState } from "react";
import { ZODIAC_SIGNS, type ZodiacSign, type Element } from "@/lib/zodiac/zodiac";
import { funFactForSign } from "@/lib/content/funfacts";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { elementText } from "@/components/ui/element";
import { CompatibilityHub } from "@/components/ui/compatibility-hub";
import { useLocale } from "@/lib/i18n/client";

const ELEMENT_POWER: Record<Element, { glyph: string; color: string; signs: string[] }> = {
  Fire: {
    glyph: "△",
    color: "text-fire",
    signs: ZODIAC_SIGNS.filter((s) => s.element === "Fire").map((s) => s.slug),
  },
  Earth: {
    glyph: "▧",
    color: "text-earth",
    signs: ZODIAC_SIGNS.filter((s) => s.element === "Earth").map((s) => s.slug),
  },
  Air: {
    glyph: "⬦",
    color: "text-air",
    signs: ZODIAC_SIGNS.filter((s) => s.element === "Air").map((s) => s.slug),
  },
  Water: {
    glyph: "⧫",
    color: "text-water",
    signs: ZODIAC_SIGNS.filter((s) => s.element === "Water").map((s) => s.slug),
  },
};

const ELEMENTS = ["Fire", "Earth", "Air", "Water"] as const;

export function CosmicFactsClient() {
  const [selected, setSelected] = useState<ZodiacSign | null>(null);
  const { t, tSign, tElement, tModality } = useLocale();

  return (
    <div className="constellation-bg">
      <section className="relative overflow-hidden border-b border-line-soft">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(108,92,231,0.12)_0%,transparent_70%)]"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 pb-14 pt-16 text-center sm:px-6 sm:pt-24">
          <p className="kicker">{t("cosmicFacts.kicker", "The cosmic vault")}</p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-5 w-20" />
          <h1 className="mx-auto mt-8 max-w-3xl font-display text-4xl font-bold leading-[1.08] text-starlight sm:text-6xl">
            {t("cosmicFacts.heroTitle", "Cosmic Traits & Facts")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted">
            {t("cosmicFacts.heroSubtitle", "Explore every zodiac sign's core traits, secret perks, ruling planet lore, and the elemental forces that shape each personality.")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="kicker text-center">{t("cosmicFacts.chooseSign", "Choose your sign")}</p>
        <h2 className="mt-3 text-center font-display text-2xl text-starlight">
          {t("cosmicFacts.tapToReveal", "Tap a sign to reveal its cosmic profile")}
        </h2>

        <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {ZODIAC_SIGNS.map((sign) => {
            const active = selected?.slug === sign.slug;
            return (
              <button
                key={sign.slug}
                type="button"
                onClick={() => setSelected(active ? null : sign)}
                className={`group relative flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all duration-300 ${
                  active
                    ? "border-gold/60 bg-gold/10 shadow-[0_0_24px_-4px_rgba(255,209,102,0.3)]"
                    : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]"
                }`}
                aria-pressed={active}
                aria-label={`${tSign(sign.slug)} — ${tElement(sign.element)} ${tModality(sign.modality)}`}
              >
                <span className={`transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-105"}`}>
                  <ZodiacSymbol sign={sign.slug} size="lg" className={active ? "text-gold" : elementText(sign.element)} label={tSign(sign.slug)} />
                </span>
                <span className={`font-display text-sm font-semibold ${active ? "text-gold" : "text-starlight"}`}>
                  {tSign(sign.slug)}
                </span>
                <span className="text-[0.6rem] uppercase tracking-[0.14em] text-subdued">
                  {tElement(sign.element)} · {tModality(sign.modality)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {selected && (
        <SignProfile sign={selected} onClose={() => setSelected(null)} />
      )}

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="kicker text-center">{t("cosmicFacts.compatibilityKicker", "How two signs mesh")}</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center font-display text-3xl text-starlight">
          {t("cosmicFacts.compatibilityTitle", "Zodiac compatibility")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center leading-7 text-muted">
          {t("cosmicFacts.compatibilitySubtitle", "Choose any two signs to see how they score across love, energy and intellect — drawn from elemental and modal harmony, never fabricated.")}
        </p>
        <div className="mt-10">
          <CompatibilityHub />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="paper-panel relative overflow-hidden p-8 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(108,92,231,0.2)_0%,transparent_70%)] blur-2xl"
          />
          <div className="relative">
            <p className="kicker">{t("cosmicFacts.elementalKicker", "Elemental forces")}</p>
            <h2 className="mt-3 font-display text-3xl text-starlight sm:text-4xl">
              {t("cosmicFacts.elementalTitle", "The four pillars of the zodiac")}
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-muted">
              {t("cosmicFacts.elementalSubtitle", "Every sign draws its fundamental energy from one of four elements. Understanding your element reveals the deeper current beneath your personality.")}
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ELEMENTS.map((el) => {
                const data = ELEMENT_POWER[el];
                return (
                  <div
                    key={el}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl ${data.color}`}>{data.glyph}</span>
                      <h3 className={`font-display text-xl font-semibold ${data.color}`}>{tElement(el)}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted">{t(`cosmicFacts.elements.${el}`, "")}</p>
                    <ul className="mt-4 space-y-1.5">
                      {data.signs.map((slug) => (
                        <li key={slug} className="text-sm text-p-ink">{tSign(slug)}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SignProfile({ sign, onClose }: { sign: ZodiacSign; onClose: () => void }) {
  const { t, tSign, tElement, tModality, tPlanet } = useLocale();
  const funFact = funFactForSign(sign.slug);
  const sameElement = ZODIAC_SIGNS.filter((s) => s.element === sign.element && s.slug !== sign.slug).map((s) => s.slug);

  const weaknessesRaw = t(`cosmicFacts.weaknesses.${sign.slug}`, "");
  const weaknesses = weaknessesRaw ? weaknessesRaw.split(" · ") : [];
  const compatSame = t(`cosmicFacts.compat.${sign.element}.same`, "");
  const compatBest = t(`cosmicFacts.compat.${sign.element}.best`, "");
  const compatChallenging = t(`cosmicFacts.compat.${sign.element}.challenging`, "");

  return (
    <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6" aria-label={`${tSign(sign.slug)} cosmic profile`}>
      <div className="paper-panel relative overflow-hidden">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl ${
            sign.element === "Fire"
              ? "bg-[radial-gradient(circle,rgba(232,160,92,0.25)_0%,transparent_70%)]"
              : sign.element === "Earth"
              ? "bg-[radial-gradient(circle,rgba(169,178,107,0.25)_0%,transparent_70%)]"
              : sign.element === "Air"
              ? "bg-[radial-gradient(circle,rgba(79,195,200,0.25)_0%,transparent_70%)]"
              : "bg-[radial-gradient(circle,rgba(141,127,227,0.25)_0%,transparent_70%)]"
          }`}
        />

        <div className="relative p-8 sm:p-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cosmic/25 bg-cosmic/15">
                <ZodiacSymbol sign={sign.slug} size="lg" className="text-gold" strokeWidth={1.8} label={tSign(sign.slug)} />
              </div>
              <div>
                <h2 className="font-display text-3xl font-bold text-starlight">{tSign(sign.slug)}</h2>
                <p className="mt-1 text-sm text-muted">
                  {tElement(sign.element)} · {tModality(sign.modality)} · {t("horoscope.ruler", "Ruled by")} {tPlanet(sign.ruler.toLowerCase())}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-muted transition-colors hover:border-white/25 hover:text-starlight"
              aria-label={t("common.close", "Close profile")}
            >
              ✕
            </button>
          </div>

          <p className="mt-6 font-serif-body text-base leading-7 text-p-ink">{sign.description}</p>

          <div className="mt-8">
            <h3 className="kicker">{t("common.keyTraits", "Key traits & personality")}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {sign.traits.map((trait) => (
                <span key={trait} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-p-ink">
                  {trait}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {sign.keywords.map((k) => (
                <span key={k} className="rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs font-medium text-gold-deep">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
              {t("cosmicFacts.originsTitle", "Origins & mythology")}
            </h3>
            <p className="mt-3 text-sm leading-6 text-p-ink">
              {t(`cosmicFacts.signs.${sign.slug}.mythology`, "")}
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
              {t("cosmicFacts.coreArchetypeTitle", "Core archetype")}
            </h3>
            <p className="mt-3 text-sm leading-6 text-p-ink">
              {t(`cosmicFacts.signs.${sign.slug}.coreArchetype`, "")}
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
              {t("cosmicFacts.careerArenasTitle", "Career arenas")}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(t(`cosmicFacts.signs.${sign.slug}.careerArenas`, "") || "").split(" · ").filter(Boolean).map((arena) => (
                <span key={arena} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-p-ink">
                  {arena}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
                {t("cosmicFacts.superpowersTitle", "Your superpowers")}
              </h3>
              <ul className="mt-3 space-y-2">
                {sign.traits.slice(0, 4).map((tr) => (
                  <li key={tr} className="flex items-center gap-2 text-sm text-p-ink">
                    <span aria-hidden className="text-gold">✦</span>
                    {tr}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
                {t("cosmicFacts.watchOutForTitle", "Watch out for")}
              </h3>
              <ul className="mt-3 space-y-2">
                {weaknesses.map((w) => (
                  <li key={w} className="flex items-center gap-2 text-sm text-p-ink">
                    <span aria-hidden className="text-muted">◆</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-gold/20 bg-gold/5 p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-lg text-gold">☽</span>
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
                  {t("cosmicFacts.cosmicFunFactTitle", "Cosmic fun fact")}
                </p>
                <p className="mt-2 text-sm leading-6 text-p-ink">{funFact.replace(/^Did you know\? /, "")}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="kicker">{t("common.elementPower", "Compatibility & element power")}</h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-p-muted uppercase tracking-wide">{t("common.sameElement", "Same element")}</p>
                <p className="mt-1 text-sm leading-6 text-p-ink">{compatSame}</p>
              </div>
              <div className="border-t border-p-line pt-4">
                <p className="text-xs font-semibold text-p-muted uppercase tracking-wide">{t("common.bestPairing", "Best pairing")}</p>
                <p className="mt-1 text-sm leading-6 text-p-ink">{compatBest}</p>
              </div>
              <div className="border-t border-p-line pt-4">
                <p className="text-xs font-semibold text-p-muted uppercase tracking-wide">{t("common.challengingPairing", "Challenging pairing")}</p>
                <p className="mt-1 text-sm leading-6 text-p-ink">{compatChallenging}</p>
              </div>
            </div>
            {sameElement.length > 0 && (
              <div className="mt-5 border-t border-p-line pt-4">
                <p className="text-xs font-semibold text-p-muted uppercase tracking-wide">
                  {t("common.sameElement", "Other")} {tElement(sign.element)} {t("nav.allSigns", "signs")}
                </p>
                <p className="mt-1 text-sm text-p-ink">{sameElement.map((s) => tSign(s)).join(" · ")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
