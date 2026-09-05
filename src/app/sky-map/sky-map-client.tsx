"use client";

import { useEffect, useState } from "react";
import { SkyMapCanvas } from "@/components/astronomy/sky-map-canvas";
import type { ObserverPoint } from "@/lib/astronomy/sky-map";
import { loadNatalProfile } from "@/lib/natal/storage";

const DEFAULT_OBSERVER: ObserverPoint = { latitude: 40.7128, longitude: -74.006, height: 10 };
const DEFAULT_PLACE = "New York, US";

export function SkyMapClient() {
  const [observer, setObserver] = useState<ObserverPoint>(DEFAULT_OBSERVER);
  const [place, setPlace] = useState(DEFAULT_PLACE);
  const [now, setNow] = useState<Date>(() => new Date());
  const [usingProfile, setUsingProfile] = useState(false);

  // Seed coordinates from the persisted birth profile when available.
  useEffect(() => {
    const profile = loadNatalProfile();
    if (profile && Number.isFinite(profile.latitude) && Number.isFinite(profile.longitude)) {
      setObserver({ latitude: profile.latitude, longitude: profile.longitude, height: 10 });
      setPlace(profile.placeName || "saved profile location");
      setUsingProfile(true);
    }
  }, []);

  // Keep the map honest to the current moment.
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(id);
  }, []);

  const placeLabel = now.toLocaleString("en", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      <div className="mt-10 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Observation point
          </label>
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="City or label"
            className="w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-2.5 text-sm text-starlight outline-none focus:border-gold"
          />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                min={-90}
                max={90}
                value={Number(observer.latitude.toFixed(4))}
                onChange={(e) =>
                  setObserver({ ...observer, latitude: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-white/10 bg-ink/80 px-3 py-2 text-sm text-starlight outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                min={-180}
                max={180}
                value={Number(observer.longitude.toFixed(4))}
                onChange={(e) =>
                  setObserver({ ...observer, longitude: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-white/10 bg-ink/80 px-3 py-2 text-sm text-starlight outline-none focus:border-gold"
              />
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            {usingProfile
              ? "Coordinates seeded from your saved birth profile — edit them freely. The map re-positions instantly."
              : "Enter lat/long for your location (or use the saved profile) and the dome re-positions instantly."}
          </p>
          <p className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs leading-5 text-muted">
            Shown for {placeLabel}. The map refreshes every minute.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <div className="flex justify-center">
            <SkyMapCanvas observer={observer} date={now} />
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            Hover or tap a body to see its azimuth and altitude. Only objects above the
            horizon are shown.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[rgb(140,200,255)]" /> Planet
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[rgb(255,200,80)]" /> Sun
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[rgb(230,230,255)]" /> Moon
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-white" /> Star
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
