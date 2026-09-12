"use client";

import { useEffect, useMemo, useState } from "react";
import { SkyMapCanvas } from "@/components/astronomy/sky-map-canvas";
import type { ObserverPoint } from "@/lib/astronomy/sky-map";
import { loadNatalProfile } from "@/lib/natal/storage";
import { useLocale } from "@/lib/i18n/client";
import {
  searchPlaces,
  debounce,
  OSM_ATTRIBUTION,
  type PlaceSuggestion,
  type PlaceProvenance,
} from "@/lib/geo/geocoding";

function subst(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
}

const DEFAULT_OBSERVER: ObserverPoint = { latitude: 40.7128, longitude: -74.006, height: 10 };
const DEFAULT_PLACE = "New York, US";

export function SkyMapClient() {
  const { t, locale } = useLocale();
  const [observer, setObserver] = useState<ObserverPoint>(DEFAULT_OBSERVER);
  const [place, setPlace] = useState(DEFAULT_PLACE);
  const [now, setNow] = useState<Date>(() => new Date());
  const [usingProfile, setUsingProfile] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [provenance, setProvenance] = useState<PlaceProvenance>("manual");
  const [mounted, setMounted] = useState(false);

  // Seed coordinates from the persisted birth profile when available.
  useEffect(() => {
    const profile = loadNatalProfile();
    if (profile && Number.isFinite(profile.latitude) && Number.isFinite(profile.longitude)) {
      setObserver({ latitude: profile.latitude, longitude: profile.longitude, height: 10 });
      setPlace(profile.placeName || t("dailyTransit.savedProfileLocation", "saved profile location"));
      setProvenance("verified");
      setUsingProfile(true);
    }
  }, []);

  const runSearch = useMemo(() => {
    let seq = 0;
    return async (query: string) => {
      const current = ++seq;
      const { query: resolved, results } = await searchPlaces(query);
      if (current !== seq) return;
      setSuggestions(results);
      setShowSuggestions(resolved.length >= 3 && results.length > 0);
    };
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((q: string) => void runSearch(q), 350),
    [runSearch],
  );

  const selectPlace = useMemo(() => {
    return (p: PlaceSuggestion) => {
      setPlace(p.label);
      setObserver((prev) => ({ ...prev, latitude: p.latitude, longitude: p.longitude }));
      setProvenance("verified");
      setSuggestions([]);
      setShowSuggestions(false);
    };
  }, []);

  // Keep the map honest to the current moment. Marking mounted here also gates
  // the time caption below so the SSR prerender and first client render agree
  // (a raw toLocaleString of `now` differs between them → React #418).
  useEffect(() => {
    setMounted(true);
    const id = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(id);
  }, []);

  const placeLabel = mounted
    ? now.toLocaleString(locale, {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "…";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      <div className="mt-10 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            {t("skyMap.observationPoint", "Observation point")}
          </label>
          <div className="relative">
            <input
              type="text"
              value={place}
              onChange={(e) => {
                setPlace(e.target.value);
                setProvenance("manual");
                debouncedSearch(e.target.value);
              }}
              onFocus={() => void runSearch(place || "")}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
              placeholder={t("skyMap.cityLabel", "City or label")}
              className="w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-2.5 text-sm text-starlight outline-none focus:border-gold"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#111222] shadow-2xl backdrop-blur-xl">
                {suggestions.map((p) => (
                  <li
                    key={p.id}
                    onMouseDown={() => selectPlace(p)}
                    className="cursor-pointer px-3 py-2 text-sm text-starlight transition-colors hover:bg-gold/15 hover:text-gold"
                  >
                    {p.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="mt-1.5 text-[0.68rem] leading-4 text-subdued">
            {t("uichrome.placePick", "Pick a suggestion to set exact coordinates for the map.")}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="obs-latitude" className="block text-xs text-muted mb-1">{t("skyMap.latitude", "Latitude")}</label>
              <input
                id="obs-latitude"
                type="number"
                step="0.0001"
                min={-90}
                max={90}
                value={Number(observer.latitude.toFixed(4))}
                onChange={(e) => {
                  setObserver({ ...observer, latitude: Number(e.target.value) });
                  setProvenance("manual");
                }}
                className="w-full rounded-xl border border-white/10 bg-ink/80 px-3 py-2 text-sm text-starlight outline-none focus:border-gold"
              />
            </div>
            <div>
              <label htmlFor="obs-longitude" className="block text-xs text-muted mb-1">{t("skyMap.longitude", "Longitude")}</label>
              <input
                id="obs-longitude"
                type="number"
                step="0.0001"
                min={-180}
                max={180}
                value={Number(observer.longitude.toFixed(4))}
                onChange={(e) => {
                  setObserver({ ...observer, longitude: Number(e.target.value) });
                  setProvenance("manual");
                }}
                className="w-full rounded-xl border border-white/10 bg-ink/80 px-3 py-2 text-sm text-starlight outline-none focus:border-gold"
              />
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            {usingProfile
              ? t("skyMap.seededHint", "Coordinates seeded from your saved birth profile — edit them freely. The map re-positions instantly.")
              : t("skyMap.manualHint", "Enter lat/long for your location (or use the saved profile) and the dome re-positions instantly.")}
          </p>
          <p className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs leading-5 text-muted">
            {subst(t("skyMap.shownFor", "Shown for {place}. The map refreshes every minute."), { place: placeLabel })}
          </p>
          <p className="mt-2 text-[0.65rem] leading-4 text-subdued">
            {provenance === "verified"
              ? t("uichrome.placeVerified", "Coordinates verified from the selected place.")
              : t("uichrome.placeManualMap", "Coordinates entered manually — the map uses them as-is.")}
          </p>
          <p className="mt-0.5 text-[0.65rem] leading-4 text-subdued">{OSM_ATTRIBUTION}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <div className="flex justify-center">
            <SkyMapCanvas observer={observer} date={now} />
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            {t("skyMap.hoverHint", "Hover or tap a body to see its azimuth and altitude. Only objects above the horizon are shown.")}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[rgb(140,200,255)]" /> {t("skyMap.legendPlanet", "Planet")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[rgb(255,200,80)]" /> {t("skyMap.legendSun", "Sun")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[rgb(230,230,255)]" /> {t("skyMap.legendMoon", "Moon")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-white" /> {t("skyMap.legendStar", "Star")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
