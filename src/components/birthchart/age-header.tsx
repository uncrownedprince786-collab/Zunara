"use client";

import { useMemo } from "react";
import type { NatalChart } from "@/lib/natal/types";
import { exactAge } from "@/lib/natal/age";
import { lifeMilestones, type LifeMilestone } from "@/lib/natal/life-phases";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { useLocale } from "@/lib/i18n/client";

interface AgeHeaderProps {
  chart: NatalChart;
  at: Date;
}

export function AgeHeader({ chart, at }: AgeHeaderProps) {
  const { t, tSign } = useLocale();

  const age = useMemo(() => exactAge(new Date(chart.utcTime), at), [chart.utcTime, at]);
  const milestones = useMemo(() => lifeMilestones(chart, at), [chart, at]);
  const next: LifeMilestone | undefined = milestones.find((m) => !m.active) ?? milestones[0];

  return (
    <section aria-label={t("birthchart.ageSection", "Age and next milestone")} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
        {/* Big Three */}
        <div>
          <h2 className="font-display text-xl font-medium text-starlight">
            {t("birthchart.bigThree", "The Big Three")}
          </h2>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-xl bg-white/[0.03] p-4 text-center">
              <ZodiacSymbol sign={chart.bigThree.sun.sign} size="md" className="text-gold" />
              <div className="mt-2 text-xs font-semibold text-gold">{t("birthchart.sunSign", "Sun")}</div>
              <div className="text-sm font-medium text-starlight">{tSign(chart.bigThree.sun.sign)}</div>
              <div className="text-[0.7rem] text-muted">
                {chart.bigThree.sun.degree}°{String(chart.bigThree.sun.minutes).padStart(2, "0")}′
              </div>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white/[0.03] p-4 text-center">
              <ZodiacSymbol sign={chart.bigThree.moon.sign} size="md" className="text-starlight" />
              <div className="mt-2 text-xs font-semibold text-starlight">{t("birthchart.moonSign", "Moon")}</div>
              <div className="text-sm font-medium text-starlight">{tSign(chart.bigThree.moon.sign)}</div>
              <div className="text-[0.7rem] text-muted">
                {chart.bigThree.moon.degree}°{String(chart.bigThree.moon.minutes).padStart(2, "0")}′
              </div>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white/[0.03] p-4 text-center">
              <ZodiacSymbol sign={chart.bigThree.ascendant} size="md" className="text-cosmic" />
              <div className="mt-2 text-xs font-semibold text-cosmic">{t("birthchart.ascendant", "Rising")}</div>
              <div className="text-sm font-medium text-starlight">{tSign(chart.bigThree.ascendant)}</div>
              <div className="text-[0.7rem] text-muted">
                {Math.floor(chart.houses.ascendantLongitude % 30)}°
              </div>
            </div>
          </div>
        </div>

        {/* Exact age + next milestone */}
        <div className="space-y-4">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
              {t("birthchart.exactAgeLabel", "Exact age")}
            </p>
            <p className="mt-2 font-display text-xl leading-relaxed text-starlight">{age.label}</p>
          </div>
          {next && (
            <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
                {t("birthchart.nextMilestoneLabel", "Next milestone")}
              </p>
              <p className="mt-1.5 text-sm font-medium text-starlight">{next.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{next.note}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}