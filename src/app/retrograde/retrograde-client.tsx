"use client";

import { useEffect, useState } from "react";
import { tabulateRetrogrades, liveSkyStats } from "@/lib/retrograde/tracker";
import type { TabulatedRetrograde, SkyStats } from "@/lib/retrograde/tracker";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { getZodiacSign } from "@/lib/zodiac/zodiac";
import { useLocale } from "@/lib/i18n/client";

function subst(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
}

function formatDate(d: Date | null, locale: string): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }).format(d);
}

const STRENGTH_STYLE: Record<string, string> = {
  mild: "bg-emerald-500/15 text-emerald-400",
  moderate: "bg-gold/15 text-gold",
  intense: "bg-orange-500/15 text-orange-300",
};

export function RetrogradeClient() {
  const { t, tPlanet, tSign, locale } = useLocale();
  const [tabs, setTabs] = useState<TabulatedRetrograde[]>([]);
  const [stats, setStats] = useState<SkyStats | null>(null);
  const [computedAt, setComputedAt] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    setTabs(tabulateRetrogrades(now));
    setStats(liveSkyStats(now));
    setComputedAt(
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(now),
    );
  }, [locale]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      {stats && (
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
              {t("retrograde.retrogradeNow", "Retrograde now")}
            </p>
            <p className="mt-2 font-display text-4xl text-starlight">{stats.retrogradeCount}</p>
            <p className="mt-1 text-xs text-muted">{subst(t("retrograde.ofTracked", "of {count} tracked planets"), { count: "8" })}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
              {t("retrograde.activePlanets", "Active planets")}
            </p>
            <p className="mt-2 font-display text-xl leading-7 text-starlight">
              {stats.retrogradePlanets.length > 0
                ? stats.retrogradePlanets.map((p) => tPlanet(p)).join(", ")
                : t("retrograde.none", "None")}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
              {t("retrograde.nextRetrograde", "Next retrograde")}
            </p>
            <p className="mt-2 font-display text-xl leading-7 text-starlight">
              {stats.nextRetrograde
                ? subst(t("retrograde.startsOn", "{planet} starts {date}"), {
                    planet: tPlanet(stats.nextRetrograde.planet),
                    date: formatDate(stats.nextRetrograde.start, locale),
                  })
                : t("retrograde.noneInWindow", "None in the current window")}
            </p>
          </div>
        </div>
      )}

      {stats && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-6 text-muted backdrop-blur-xl">
          {stats.note}
          <span className="mt-2 block text-xs text-subdued">
            {subst(t("retrograde.computedAt", "Computed at {time} · A retrograde is apparent, not physical."), { time: computedAt })}
          </span>
        </div>
      )}

      <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-display text-2xl text-starlight">{t("retrograde.perPlanetTracker", "Per-planet tracker")}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {t("retrograde.orderedBy", "Ordered by the start of the next retrograde window. Dates are refined to hour-level precision from calculated stations.")}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-start text-xs font-semibold uppercase tracking-wider text-muted">
                <th className="p-4 text-start">{t("common.colPlanet", "Planet")}</th>
                <th className="p-4 text-start">{t("common.colStatus", "Status")}</th>
                <th className="p-4 text-start">{t("common.colStart", "Start")}</th>
                <th className="p-4 text-start">{t("common.colEnd", "End")}</th>
                <th className="p-4 text-start">{t("common.colStrength", "Strength")}</th>
                <th className="p-4 text-start">{t("common.colAdvice", "Advice")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tabs.map((row) => {
                const planetName = tPlanet(row.planet);
                const signDot = stats?.planetsBySign.find((p) => p.planet === row.planet);
                const signName = signDot ? getZodiacSign(signDot.sign)?.name : null;
                return (
                  <tr key={row.planet} className="align-top transition-colors hover:bg-white/[0.03]">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <PlanetSymbol body={row.planet} size="sm" className="text-gold" decorative />
                        <div>
                          <span className="font-medium text-starlight">{planetName}</span>
                          {signName && (
                            <span className="block text-xs text-subdued">{subst(t("retrograde.inSign", "in {sign}"), { sign: tSign(signName) })}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {row.currentlyRetrograde ? (
                        <span className="rounded bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold">
                          {t("retrograde.retrogradeNow", "Retrograde now")}
                        </span>
                      ) : row.start ? (
                        <span className="rounded bg-white/10 px-2.5 py-1 text-xs font-medium text-muted">
                          {t("retrograde.upcoming", "Upcoming")}
                        </span>
                      ) : (
                        <span className="rounded bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                          {t("common.direct", "Direct")}
                        </span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap font-mono text-muted">{formatDate(row.start, locale)}</td>
                    <td className="p-4 whitespace-nowrap font-mono text-muted">{formatDate(row.end, locale)}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${STRENGTH_STYLE[row.strength]}`}>
                        {t(`retrograde.strength.${row.strength}`, row.strength)}
                      </span>
                    </td>
                    <td className="max-w-md p-4 text-sm leading-6 text-p-muted">{row.advice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {tabs.length === 0 && (
        <div className="mt-10 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-muted">
          {t("retrograde.computing", "Calculating sky statistics…")}
        </div>
      )}
    </div>
  );
}