"use client";

import { useState } from "react";
import { computeNatalChart } from "@/lib/natal/natal";
import { validateBirth, type BirthInput } from "@/lib/natal/validate";
import type { NatalChart } from "@/lib/natal/types";
import { BirthForm } from "@/components/birthchart/birth-form";
import { ChartWheel } from "@/components/birthchart/chart-wheel";
import { NatalReadingCards } from "@/components/birthchart/natal-reading-cards";
import { VitruvianHero } from "@/components/ui/vitruvian-hero";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { useLocale } from "@/lib/i18n/client";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export function BirthchartClient() {
  const { t, tSign, tPlanet } = useLocale();

  const [chart, setChart] = useState<NatalChart | null>(() => {
    try {
      const d = new Date("1995-06-21T12:00:00Z");
      return computeNatalChart(d, { latitude: 40.7128, longitude: -74.006 }, { timeAssumed: false });
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleSubmit = async (input: BirthInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = validateBirth(input);
      if (!result.ok) {
        setError("Please check the form inputs.");
        setIsLoading(false);
        return;
      }
      const computed = computeNatalChart(
        result.config!.date,
        {
          latitude: input.latitude,
          longitude: input.longitude,
        },
        { timeAssumed: result.config!.timeAssumed }
      );
      setChart(computed);
      setShowEditForm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to calculate birth chart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="constellation-bg pb-24">
      <div className="relative mx-auto h-80 max-w-6xl select-none">
        <VitruvianHero className="opacity-[0.14]" />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <Breadcrumbs items={[{ label: t("nav.birthchart", "Birth Chart"), href: "/birthchart" }]} />

        {/* Masthead */}
        <div className="mx-auto mt-8 max-w-3xl text-center">
          <p className="kicker">{t("birthchart.kicker", "Natal Astrology")}</p>
          <div aria-hidden className="gold-rule mx-auto mt-4 w-20" />
          <h1 className="mt-6 font-display text-4xl text-starlight sm:text-6xl">
            {t("birthchart.title", "Birth Chart Calculator")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
            {t(
              "birthchart.subtitle",
              "Calculate your exact natal chart, houses, and planetary aspects calculated deterministically using precise VSOP87 astronomical positions."
            )}
          </p>
        </div>

        {/* Form Container */}
        {(!chart || showEditForm) && (
          <div className="mx-auto mt-12 max-w-2xl">
            <BirthForm onSubmit={handleSubmit} isLoading={isLoading} />
            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Chart View */}
        {chart && !showEditForm && (
          <div className="mt-12 space-y-12">
            {/* Header Status Bar */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-xl font-medium text-starlight sm:text-2xl">
                  {tSign(chart.bigThree.sun.sign)} {t("birthchart.sunSign", "Sun")} · {tSign(chart.bigThree.moon.sign)} {t("birthchart.moonSign", "Moon")} · {tSign(chart.bigThree.ascendant)} {t("birthchart.ascendant", "Rising")}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Computed for {new Date(chart.utcTime).toUTCString()} · VSOP87 Engine {chart.engineVersion}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditForm(true)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 text-xs font-medium text-starlight backdrop-blur-md transition-colors hover:border-gold/40 hover:text-gold"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>{t("birthchart.formTitle", "Modify Details")}</span>
              </button>
            </div>

            {chart.timeAssumed && (
              <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm leading-6 text-gold">
                {t("birthchart.noonNote", chart.timeNote)}
              </div>
            )}

            {/* Wheel + Big Three Grid */}
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
              {/* Wheel View */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
                <ChartWheel chart={chart} size={420} />
              </div>

              {/* Big Three & Cusps */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                  <h2 className="font-display text-xl font-medium text-starlight mb-5">
                    {t("birthchart.bigThree", "The Big Three")}
                  </h2>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Sun */}
                    <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.03]">
                      <ZodiacSymbol sign={chart.bigThree.sun.sign} size="md" className="text-gold" />
                      <div className="mt-2 text-xs font-semibold text-gold">{t("birthchart.sunSign", "Sun")}</div>
                      <div className="text-sm font-medium text-starlight">{tSign(chart.bigThree.sun.sign)}</div>
                      <div className="text-[0.7rem] text-muted">{chart.bigThree.sun.degree}°{String(chart.bigThree.sun.minutes).padStart(2, "0")}′</div>
                    </div>

                    {/* Moon */}
                    <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.03]">
                      <ZodiacSymbol sign={chart.bigThree.moon.sign} size="md" className="text-starlight" />
                      <div className="mt-2 text-xs font-semibold text-starlight">{t("birthchart.moonSign", "Moon")}</div>
                      <div className="text-sm font-medium text-starlight">{tSign(chart.bigThree.moon.sign)}</div>
                      <div className="text-[0.7rem] text-muted">{chart.bigThree.moon.degree}°{String(chart.bigThree.moon.minutes).padStart(2, "0")}′</div>
                    </div>

                    {/* Ascendant */}
                    <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.03]">
                      <ZodiacSymbol sign={chart.bigThree.ascendant} size="md" className="text-cosmic" />
                      <div className="mt-2 text-xs font-semibold text-cosmic">{t("birthchart.ascendant", "Rising")}</div>
                      <div className="text-sm font-medium text-starlight">{tSign(chart.bigThree.ascendant)}</div>
                      <div className="text-[0.7rem] text-muted">{Math.floor(chart.houses.ascendantLongitude % 30)}°</div>
                    </div>
                  </div>
                </div>

                {/* House Cusps */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                  <h2 className="font-display text-xl font-medium text-starlight mb-4">
                    {t("birthchart.housesHeading", "House Cusps (Whole Sign)")}
                  </h2>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    {chart.houses.cusps.map((c) => (
                      <div key={c.house} className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
                        <div className="text-xs font-medium text-gold">{c.house}</div>
                        <div className="text-xs text-starlight">{tSign(c.sign)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Planetary Placements Table */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden backdrop-blur-xl">
              <div className="p-6 border-b border-white/10">
                <h2 className="font-display text-2xl text-starlight">
                  {t("birthchart.planetsHeading", "Planetary Placements")}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02] text-start text-xs font-semibold uppercase tracking-wider text-muted">
                      <th className="p-4 text-start">Planet</th>
                      <th className="p-4 text-start">Sign</th>
                      <th className="p-4 text-start">Degree</th>
                      <th className="p-4 text-start">Motion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {chart.planets.map((p) => (
                      <tr key={p.key} className="transition-colors hover:bg-white/[0.03]">
                        <td className="p-4 font-medium text-starlight">
                          <div className="flex items-center gap-2.5">
                            <PlanetSymbol body={p.key} size="sm" className="text-gold" decorative />
                            <span>{tPlanet(p.key)}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted">
                          <div className="flex items-center gap-2">
                            <ZodiacSymbol sign={p.sign} size="sm" />
                            <span className="font-medium text-starlight">{tSign(p.sign)}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-muted">
                          {p.degree}°{String(p.minutes).padStart(2, "0")}′
                        </td>
                        <td className="p-4">
                          {p.retrograde ? (
                            <span className="rounded bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">Rx Retrograde</span>
                          ) : (
                            <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">Direct</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Core Readings */}
            <div>
              <h2 className="font-display text-2xl text-starlight mb-6">
                {t("birthchart.readingsHeading", "Core Interpretations")}
              </h2>
              <NatalReadingCards readings={chart.readings} />
            </div>

            {/* Method Note */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-subdued backdrop-blur-xl">
              <h3 className="font-display text-lg text-starlight">
                {t("birthchart.howItWorksTitle", "How Zunara Calculates Your Chart")}
              </h3>
              <p className="mt-2 leading-6">
                {t(
                  "birthchart.howItWorksDesc",
                  "Unlike traditional horoscope generators that invent or approximate coordinates, Zunara calculates the exact geometric positions of the Sun, Moon, and 8 planets at the exact minute of birth using the VSOP87 planetary theory and whole-sign house system."
                )}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
