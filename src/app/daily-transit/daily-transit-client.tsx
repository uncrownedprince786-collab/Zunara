"use client";

import { useEffect, useMemo, useState } from "react";
import { BirthForm } from "@/components/birthchart/birth-form";
import { computeNatalChart } from "@/lib/natal/natal";
import { validateBirth } from "@/lib/natal/validate";
import { dailyTransitInsights, daySummary } from "@/lib/transits/daily-transits";
import { loadNatalProfile, clearNatalProfile } from "@/lib/natal/storage";
import {
  upcomingTransits,
  type TransitForecast,
} from "@/lib/natal/transits";
import { generateTransitICS } from "@/lib/calendar/ics-generator";
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

function computeFor(input: BirthInput, dateStr: string) {
  const result = validateBirth(input);
  if (!result.ok || !result.config) {
    throw new Error("Please check the form inputs.");
  }
  const c = computeNatalChart(
    result.config.date,
    { latitude: input.latitude, longitude: input.longitude },
    { timeAssumed: result.config.timeAssumed },
  );
  const at = parseLocal(dateStr);
  const transits = dailyTransitInsights(c, at);
  const label = new Intl.DateTimeFormat("en", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(at);
  return { chart: c, insights: transits.insights, summary: daySummary(c, transits), label };
}

export function DailyTransitClient() {
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [insights, setInsights] = useState<DailyInsight[]>([]);
  const [dayLabel, setDayLabel] = useState("");
  const [summary, setSummary] = useState("");
  const [dateStr, setDateStr] = useState<string>(todayLocal);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [forecast, setForecast] = useState<TransitForecast[]>([]);

  // On mount, auto-load the persisted birth profile (saved from /birthchart)
  // and compute transits against those houses without requiring re-entry.
  useEffect(() => {
    const profile = loadNatalProfile();
    if (!profile) {
      setShowForm(true);
      return;
    }
    setSavedName(profile.placeName || "saved profile");
    try {
      const result = computeFor(profile, todayLocal());
      setChart(result.chart);
      setInsights(result.insights);
      setSummary(result.summary);
      setDayLabel(result.label);
      const at = parseLocal(todayLocal());
      setForecast(upcomingTransits(result.chart, at));
    } catch {
      setShowForm(true);
    }
  }, []);

  const handleSubmit = async (input: BirthInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const result = computeFor(input, dateStr);
      setChart(result.chart);
      setInsights(result.insights);
      setSummary(result.summary);
      setDayLabel(result.label);
      const at = parseLocal(dateStr);
      setForecast(upcomingTransits(result.chart, at));
      setSavedName(input.placeName || "saved profile");
      setShowForm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to compute today's transit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (value: string) => {
    setDateStr(value);
    if (chart) {
      const at = parseLocal(value);
      const transits = dailyTransitInsights(chart, at);
      setInsights(transits.insights);
      setSummary(daySummary(chart, transits));
      setDayLabel(
        new Intl.DateTimeFormat("en", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(at),
      );
    }
  };

  const handleChangeProfile = () => {
    clearNatalProfile();
    setSavedName(null);
    setChart(null);
    setInsights([]);
    setForecast([]);
    setShowForm(true);
  };

  const icsEvents = useMemo(
    () =>
      forecast.map((f) => ({
        title: `${f.transitBody} ${f.aspectName} ${f.targetBody}`,
        start: f.peak,
        end: f.end,
        description: f.note,
      })),
    [forecast],
  );

  const handleExportICS = () => {
    if (icsEvents.length === 0) return;
    const text = generateTransitICS(icsEvents);
    const blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zunara-transits.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {showForm ? (
          <BirthForm onSubmit={handleSubmit} isLoading={isLoading} />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Active profile
            </p>
            <p className="text-base font-medium text-starlight">
              {savedName ?? "Saved profile"}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Your saved birth details are loaded automatically — no re-entry
              needed. Transits are computed against your exact natal houses.
            </p>
            <button
              type="button"
              onClick={handleChangeProfile}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-medium text-starlight transition-colors hover:border-gold/40 hover:text-gold"
            >
              Change saved profile
            </button>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Transit date (local)
          </label>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => e.target.value && handleDateChange(e.target.value)}
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-starlight">
                Planets through your houses
              </h2>
              {icsEvents.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportICS}
                  className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-medium text-gold-deep transition-colors hover:bg-gold/20"
                >
                  Export to Calendar (.ics)
                  <span aria-hidden>&darr;</span>
                </button>
              )}
            </div>
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

          {forecast.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-starlight">
                Upcoming transits to export
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Add the next significant aspects to your calendar. From "Export to
                Calendar", the .ics file opens in Google Calendar, Apple Calendar or Outlook.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {forecast.map((f) => (
                  <div key={f.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2">
                      <PlanetSymbol body={f.transitBody} size="sm" className="text-gold" decorative />
                      <span className="text-xs font-medium text-starlight">
                        {f.transitBody} {f.aspectName}
                      </span>
                      <PlanetSymbol body={f.targetBody} size="sm" className="text-cosmic" decorative />
                      <span className="text-xs text-muted">{f.targetBody}</span>
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      Peak {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(f.peak)}
                      {" · ends "}
                      {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(f.end)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
