"use client";

import { useCallback, useEffect, useState } from "react";
import { BirthForm } from "@/components/birthchart/birth-form";
import { computeNatalChart } from "@/lib/natal/natal";
import { validateBirth } from "@/lib/natal/validate";
import {
  activeTransits,
  upcomingTransits,
  type TransitForecast,
  type TransitArea,
  type TransitPhase,
} from "@/lib/natal/transits";
import {
  listProfiles,
  loadNatalProfile,
  saveProfile,
  DEFAULT_PROFILE_ID,
  type StoredProfile,
} from "@/lib/natal/storage";
import type { BirthInput } from "@/lib/natal/validate";
import type { NatalChart } from "@/lib/natal/types";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { useLocale } from "@/lib/i18n/client";

const AREA_KEY: Record<TransitArea, "identity" | "relationships" | "innerLife" | "career" | "growth" | "energy"> = {
  identity: "identity",
  relationships: "relationships",
  "inner life": "innerLife",
  career: "career",
  growth: "growth",
  energy: "energy",
};

const PHASE_KEY: Record<TransitPhase, "applying" | "exact" | "separating"> = {
  applying: "applying",
  exact: "exact",
  separating: "separating",
};

const MAX_TIMELINE_MONTHS = 1;

function computeFor(
  input: BirthInput,
  t: (path: string, fallback?: string) => string,
) {
  const result = validateBirth(input);
  if (!result.ok || !result.config) {
    throw new Error(t("yoursky.enterDetails", "Please check the form inputs."));
  }
  return computeNatalChart(
    result.config.date,
    { latitude: input.latitude, longitude: input.longitude },
    { timeAssumed: result.config.timeAssumed },
  );
}

function StrengthBar({ value }: { value: number }) {
  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label={`${(value / 10).toFixed(1)} / 10`}
      className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function prettyDate(d: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(d);
}

export function YourSkyClient() {
  const { t, tPlanet, locale } = useLocale();
  const [profiles, setProfiles] = useState<StoredProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [today, setToday] = useState<TransitForecast[]>([]);
  const [timeline, setTimeline] = useState<TransitForecast[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [savedName, setSavedName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const refreshProfiles = useCallback(() => {
    const all = listProfiles();
    setProfiles(all);
    const active = loadNatalProfile();
    if (active) {
      setActiveId(active.id ?? DEFAULT_PROFILE_ID);
    }
  }, []);

  const applyProfile = useCallback(
    (profile: StoredProfile) => {
      try {
        const c = computeFor(profile, t);
        const now = new Date();
        setChart(c);
        setToday(activeTransits(c, now, { maxEntries: 5 }));
        setTimeline(
          upcomingTransits(c, now, {
            horizonMonths: MAX_TIMELINE_MONTHS,
            stepDays: 3,
            maxEntries: 8,
          }),
        );
        setSavedName(profile.name ?? profile.placeName);
        setActiveId(profile.id ?? DEFAULT_PROFILE_ID);
        setShowForm(false);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : t("yoursky.enterDetails", "Please check the form inputs."));
      }
    },
    [t],
  );

  // On mount, boot from the stored primary profile if present.
  useEffect(() => {
    refreshProfiles();
    const profile = loadNatalProfile();
    if (!profile) {
      setShowForm(true);
      return;
    }
    applyProfile(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (input: BirthInput) => {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const saved = saveProfile(input);
      if (!saved) {
        setError(t("yoursky.enterDetails", "Could not save your profile on this device."));
        return;
      }
      refreshProfiles();
      applyProfile(saved);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("yoursky.enterDetails", "Failed to compute your sky."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitch = (profile: StoredProfile) => {
    setChart(null);
    applyProfile(profile);
  };

  const handleShare = async () => {
    const strongest = today[0];
    if (!strongest) return;
    const text = [
      t("yoursky.todayTitle", "Your sky today"),
      `${tPlanet(strongest.transitBody)} ${t(`aspects.${strongest.aspectName}`, strongest.aspectName)} ${tPlanet(strongest.targetBody)}`,
      `${t("yoursky.strengthLabel", "Strength")}: ${strongest.strength}/100`,
      "Zunara · Your sky, understood",
    ].join("\n");
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Zunara — Your Sky", text });
      } else {
        await navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user dismissed
    }
  };

  const areaRow = (area: TransitArea) => t(`transitAreas.${AREA_KEY[area]}`, area);

  const sectionCard =
    "rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      {/* Profile / intro */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {showForm || !chart ? (
          <div className={sectionCard}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">
              {t("yoursky.noProfileTitle", "See your sky")}
            </p>
            <p className="mt-3 text-base leading-7 text-starlight">
              {t("yoursky.title", "Your Sky")}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {t("yoursky.noProfileBody", "Enter your birth details and Zunara computes your chart, then shows the transits touching it now and in the month ahead.")}
            </p>
            <BirthForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className={sectionCard}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {t("yoursky.activeProfile", "Active profile")}
            </p>
            <p className="mt-2 text-base font-medium text-starlight">
              {savedName ?? t("profile.me", "Me")}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {t("yoursky.computedFrom", "Computed from your {place} birth chart").replace(
                "{place}",
                profiles.find((p) => p.id === activeId)?.placeName ?? "",
              )}
            </p>
            {profiles.length > 1 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("profile.switchLabel", "Viewing for")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSwitch(p)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                        p.id === activeId
                          ? "border-gold/50 bg-gold/15 text-gold"
                          : "border-white/15 bg-white/[0.04] text-muted hover:text-starlight"
                      }`}
                    >
                      {p.name ?? p.placeName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className={sectionCard}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            {t("yoursky.todayKicker", "Right now")}
          </p>
          <h2 className="mt-2 font-display text-xl text-starlight">
            {t("yoursky.todayTitle", "Your sky today")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            {t("yoursky.subtitle", "A live reading of the strongest influence touching your birth chart right now and what peaks next, computed from real planetary positions.")}
          </p>
          {today.length > 0 && (
            <button
              type="button"
              onClick={handleShare}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-medium text-gold-deep transition-colors hover:bg-gold/20"
            >
              {copied ? t("share.copied", "Copied") : t("share.label", "Share")}
              <span aria-hidden>{copied ? "\u2713" : "\u2191"}</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {chart && (
        <div key={chart.utcTime} className="mt-14 space-y-12">
          {/* Strongest influence today */}
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
                  {t("yoursky.todayKicker", "Right now")}
                </p>
                <h2 className="mt-2 font-display text-2xl text-starlight sm:text-3xl">
                  {t("yoursky.todayTitle", "Your sky today")}
                </h2>
              </div>
            </div>

            {today.length === 0 ? (
              <p className="mt-6 max-w-2xl rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm leading-6 text-muted">
                {t("yoursky.emptyToday", "No major transits are exact today, but the sky is never still - the next significant moment is listed below.")}
              </p>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {today.map((f, index) => {
                  const isTop = index === 0;
                  return (
                    <article
                      key={f.id}
                      className={`rounded-2xl border p-6 backdrop-blur-xl ${
                        isTop
                          ? "border-gold/25 bg-gold/5"
                          : "border-white/10 bg-white/[0.04]"
                      }`}
                    >
                      {isTop && (
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
                          {t("areas.strongest", "Strongest")}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-2.5">
                        <PlanetSymbol body={f.transitBody} size="sm" className="text-gold" decorative />
                        <span className="font-medium text-starlight">{tPlanet(f.transitBody)}</span>
                        <span className="text-sm text-muted">{t(`aspects.${f.aspectName}`, f.aspectName)}</span>
                        <PlanetSymbol body={f.targetBody} size="sm" className="text-cosmic" decorative />
                        <span className="font-medium text-starlight">{tPlanet(f.targetBody)}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5">
                          {areaRow(f.area)}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5">
                          {t(`transitPhase.${PHASE_KEY[f.phase]}`, f.phase)}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5">
                          {t("yoursky.peaksLabel", "Peaks")}{" "}
                          {prettyDate(f.peak, locale)}
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-muted">
                          <span>{t("yoursky.strengthLabel", "Strength")}</span>
                          <span className="font-mono">{f.strength}/100</span>
                        </div>
                        <StrengthBar value={f.strength} />
                      </div>
                      <p className="mt-4 text-sm leading-6 text-starlight">{f.note}</p>
                      <div className="mt-3 border-t border-white/5 pt-3">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
                          {t("yoursky.meaningKicker", "What this means")}
                        </p>
                        <p className="mt-1.5 text-sm leading-6 text-muted">{f.meaning}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Next 30 days timeline */}
          <section>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
              {t("yoursky.timelineKicker", "Coming next")}
            </p>
            <h2 className="mt-2 font-display text-2xl text-starlight sm:text-3xl">
              {t("yoursky.timelineTitle", "Your next 30 days")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              {t("yoursky.timelineHint", "Significant planetary moments approaching your chart over the next month.")}
            </p>

            {timeline.length === 0 ? (
              <p className="mt-6 max-w-2xl rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm leading-6 text-muted">
                {t("yoursky.emptyToday", "No major transits are exact today, but the sky is never still - the next significant moment is listed below.")}
              </p>
            ) : (
              <ol className="mt-6 space-y-3">
                {timeline.map((f) => {
                  const exactLabel = f.phase === "exact"
                    ? t("transitPhase.exact", "Exact")
                    : "";
                  return (
                    <li
                      key={f.id}
                      className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:grid-cols-[8rem_1fr_auto]"
                    >
                      <div>
                        <p className="font-mono text-xs text-gold">
                          {prettyDate(f.peak, locale)}
                        </p>
                        <p className="mt-1 text-[0.65rem] uppercase tracking-wider text-muted">
                          {t("yoursky.dateStart", "Start")} {prettyDate(f.start, locale)}
                        </p>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <PlanetSymbol body={f.transitBody} size="sm" className="text-gold" decorative />
                          <span className="text-sm font-medium text-starlight">{tPlanet(f.transitBody)}</span>
                          <span className="text-sm text-muted">{t(`aspects.${f.aspectName}`, f.aspectName)}</span>
                          <PlanetSymbol body={f.targetBody} size="sm" className="text-cosmic" decorative />
                          <span className="text-sm font-medium text-starlight">{tPlanet(f.targetBody)}</span>
                          {exactLabel && (
                            <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-gold">
                              {exactLabel}
                            </span>
                          )}
                          <ZodiacSymbol sign={chart.planets.find((p) => p.key === "sun")?.sign ?? "aries"} size="sm" />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted">{f.note}</p>
                        <p className="mt-2 text-sm leading-6 text-starlight">{f.meaning}</p>
                      </div>
                      <div className="text-end">
                        <p className="text-xs text-muted">{areaRow(f.area)}</p>
                        <p className="mt-1 text-xs text-muted">
                          {t("yoursky.strengthLabel", "Strength")}{" "}
                          <span className="font-mono text-starlight">{f.strength}</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </div>
      )}
    </div>
  );
}