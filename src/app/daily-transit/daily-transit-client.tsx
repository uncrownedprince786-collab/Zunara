"use client";

import { useState } from "react";
import { BirthForm } from "@/components/birthchart/birth-form";
import { computeNatalChart } from "@/lib/natal/natal";
import { validateBirth } from "@/lib/natal/validate";
import { dailyTransitInsights, daySummary } from "@/lib/transits/daily-transits";
import type { BirthInput } from "@/lib/natal/validate";
import type { NatalChart } from "@/lib/natal/types";
import type { DailyInsight } from "@/lib/transits/daily-transits";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { getCelestialBody } from "@/lib/astronomy/bodies";
import { AstroTerm } from "@/components/ui/astro-tooltip";

function todayLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function DailyTransitClient() {
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [insights, setInsights] = useState<DailyInsight[]>([]);
  const [dayLabel, setDayLabel] = useState("");
  const [summary, setSummary] = useState("");
  const [dateStr, setDateStr] = useState<string>(todayLocal);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: BirthInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const result = validateBirth(input);
      if (!result.ok) {
        setError("Please check the form inputs.");
        return;
      }
      const c = computeNatalChart(
        result.config!.date,
        { latitude: input.latitude, longitude: input.longitude },
        { timeAssumed: result.config!.timeAssumed },
      );
      const at = parseLocal(dateStr);
      const transits = dailyTransitInsights(c, at);
      setChart(c);
      setInsights(transits.insights);
      setSummary(daySummary(c, transits));
      setDayLabel(
        new Intl.DateTimeFormat("en", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(at),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to compute today's transit.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <BirthForm onSubmit={handleSubmit} isLoading={isLoading} />
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Transit date (local)
          </label>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => e.target.value && setDateStr(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-2.5 text-sm text-starlight outline-none focus:border-gold"
          />
          <p className="mt-4 text-sm leading-6 text-muted">
            Pick any date to see how that day&rsquo;s planets land in your chart. Results use
            the same whole-sign house layout as your birth chart.
          </p>
          <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm leading-6 text-muted">
            A <AstroTerm term="Transit" /> is a planet&rsquo;s current position against your
            birth chart. It highlights topics, not events.
          </div>
          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>
      </div>

      {chart && insights.length > 0 && (
        <div key={chart.utcTime} className="mt-14 space-y-10">
          <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
              {dayLabel}
            </p>
            <p className="mt-3 text-base leading-7 text-starlight">{summary}</p>
          </div>

          <div>
            <h2 className="font-display text-2xl text-starlight">
              Planets through your houses
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {insights.map((ins) => {
                const meta = getCelestialBody(ins.transitBody);
                const ordinal = ins.house === 1 ? "1st" : ins.house === 2 ? "2nd" : ins.house === 3 ? "3rd" : `${ins.house}th`;
                return (
                  <div
                    key={ins.transitBody}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-2.5">
                      <PlanetSymbol body={ins.transitBody} size="sm" className="text-gold" decorative />
                      <span className="font-medium text-starlight">{meta.name}</span>
                      <span className="ml-auto font-mono text-xs text-muted">{ordinal} house</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <ZodiacSymbol sign={ins.transitSign} size="sm" />
                      <span className="text-xs text-muted">
                        transiting {ins.transitSign}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-p-ink">{ins.note}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}