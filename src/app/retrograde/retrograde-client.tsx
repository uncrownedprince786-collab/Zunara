"use client";

import { useEffect, useState } from "react";
import { tabulateRetrogrades, liveSkyStats } from "@/lib/retrograde/tracker";
import type { TabulatedRetrograde, SkyStats } from "@/lib/retrograde/tracker";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { getCelestialBody } from "@/lib/astronomy/bodies";
import { getZodiacSign } from "@/lib/zodiac/zodiac";
import { AstroTerm } from "@/components/ui/astro-tooltip";

function formatDate(d: Date | null): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

const STRENGTH_STYLE: Record<string, string> = {
  mild: "bg-emerald-500/15 text-emerald-400",
  moderate: "bg-gold/15 text-gold",
  intense: "bg-orange-500/15 text-orange-300",
};

export function RetrogradeClient() {
  const [tabs, setTabs] = useState<TabulatedRetrograde[]>([]);
  const [stats, setStats] = useState<SkyStats | null>(null);
  const [computedAt, setComputedAt] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    setTabs(tabulateRetrogrades(now));
    setStats(liveSkyStats(now));
    setComputedAt(
      new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(now),
    );
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      {stats && (
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
              Retrograde now
            </p>
            <p className="mt-2 font-display text-4xl text-starlight">{stats.retrogradeCount}</p>
            <p className="mt-1 text-xs text-muted">of 8 tracked planets</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
              Active planets
            </p>
            <p className="mt-2 font-display text-xl leading-7 text-starlight">
              {stats.retrogradePlanets.length > 0
                ? stats.retrogradePlanets.map((p) => getCelestialBody(p).name).join(", ")
                : "None"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
              Next retrograde
            </p>
            <p className="mt-2 font-display text-xl leading-7 text-starlight">
              {stats.nextRetrograde
                ? `${getCelestialBody(stats.nextRetrograde.planet).name} starts ${formatDate(stats.nextRetrograde.start)}`
                : "None in the current window"}
            </p>
          </div>
        </div>
      )}

      {stats && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-6 text-muted backdrop-blur-xl">
          {stats.note}
          <span className="mt-2 block text-xs text-subdued">
            Computed at {computedAt} · A <AstroTerm term="Retrograde" /> is apparent, not physical.
          </span>
        </div>
      )}

      <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-display text-2xl text-starlight">Per-planet tracker</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Ordered by the start of the next <AstroTerm term="Retrograde" /> window. Dates are
            refined to hour-level precision from calculated stations.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-start text-xs font-semibold uppercase tracking-wider text-muted">
                <th className="p-4 text-start">Planet</th>
                <th className="p-4 text-start">Status</th>
                <th className="p-4 text-start">Start</th>
                <th className="p-4 text-start">End</th>
                <th className="p-4 text-start">Strength</th>
                <th className="p-4 text-start">Advice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tabs.map((t) => {
                const meta = getCelestialBody(t.planet);
                const signDot = stats?.planetsBySign.find((p) => p.planet === t.planet);
                const signName = signDot ? getZodiacSign(signDot.sign)?.name : null;
                return (
                  <tr key={t.planet} className="align-top transition-colors hover:bg-white/[0.03]">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <PlanetSymbol body={t.planet} size="sm" className="text-gold" decorative />
                        <div>
                          <span className="font-medium text-starlight">{meta.name}</span>
                          {signName && (
                            <span className="block text-xs text-subdued">in {signName}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {t.currentlyRetrograde ? (
                        <span className="rounded bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold">
                          Retrograde now
                        </span>
                      ) : t.start ? (
                        <span className="rounded bg-white/10 px-2.5 py-1 text-xs font-medium text-muted">
                          Upcoming
                        </span>
                      ) : (
                        <span className="rounded bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                          Direct
                        </span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap font-mono text-muted">{formatDate(t.start)}</td>
                    <td className="p-4 whitespace-nowrap font-mono text-muted">{formatDate(t.end)}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${STRENGTH_STYLE[t.strength]}`}>
                        {t.strength}
                      </span>
                    </td>
                    <td className="max-w-md p-4 text-sm leading-6 text-p-muted">{t.advice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {tabs.length === 0 && (
        <div className="mt-10 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-muted">
          Calculating sky statistics…
        </div>
      )}
    </div>
  );
}