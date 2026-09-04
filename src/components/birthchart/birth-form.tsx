"use client";

import { useState, useCallback } from "react";
import { useLocale } from "@/lib/i18n/client";
import { validateBirth, type BirthInput, YEAR_RANGE } from "@/lib/natal/validate";

interface BirthFormProps {
  onSubmit: (data: BirthInput) => void;
  isLoading?: boolean;
}

export function BirthForm({ onSubmit, isLoading = false }: BirthFormProps) {
  const { t } = useLocale();
  const [input, setInput] = useState<BirthInput>({
    year: new Date().getUTCFullYear() - 25,
    month: 6,
    day: 21,
    hour12: 12,
    minute: 0,
    ampm: "PM",
    timeKnown: true,
    latitude: 40.7128,
    longitude: -74.006,
    placeName: "New York, USA",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BirthInput, string>>>({});
  const [placeSuggestions, setPlaceSuggestions] = useState<{
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
  }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = useCallback((key: keyof BirthInput, value: unknown) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, [errors]);

  const handlePlaceSearch = useCallback(async (query: string) => {
    if (query.length < 3) {
      setPlaceSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        { headers: { "User-Agent": "ZunaraAstrology/1.0" } },
      );
      const data = await res.json();
      setPlaceSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch {
      setPlaceSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const selectPlace = useCallback(
    (place: { display_name: string; lat: string; lon: string }) => {
      handleChange("placeName", place.display_name);
      handleChange("latitude", parseFloat(place.lat));
      handleChange("longitude", parseFloat(place.lon));
      setPlaceSuggestions([]);
      setShowSuggestions(false);
    },
    [handleChange],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateBirth(input);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    onSubmit(input);
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl saturate-180 sm:p-8">
      <div>
        <h2 className="font-display text-2xl text-starlight">
          {t("birthchart.formTitle", "Enter Birth Details")}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {t("birthchart.subtitle", "Precision planetary positions · Whole-Sign houses · Deterministic readings")}
        </p>
      </div>

      {/* Date */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="year" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            {t("birthchart.year", "Year")}
          </label>
          <select
            id="year"
            value={input.year}
            onChange={(e) => handleChange("year", parseInt(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-2.5 text-sm text-starlight outline-none transition-colors focus:border-gold"
          >
            {Array.from({ length: YEAR_RANGE.max - YEAR_RANGE.min + 1 }, (_, i) => (
              <option key={YEAR_RANGE.max - i} value={YEAR_RANGE.max - i} className="bg-[#111222]">
                {YEAR_RANGE.max - i}
              </option>
            ))}
          </select>
          {errors.year && <p className="mt-1 text-xs text-red-400">{errors.year}</p>}
        </div>

        <div>
          <label htmlFor="month" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            {t("birthchart.month", "Month")}
          </label>
          <select
            id="month"
            value={input.month}
            onChange={(e) => handleChange("month", parseInt(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-2.5 text-sm text-starlight outline-none transition-colors focus:border-gold"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value} className="bg-[#111222]">
                {m.label}
              </option>
            ))}
          </select>
          {errors.month && <p className="mt-1 text-xs text-red-400">{errors.month}</p>}
        </div>

        <div>
          <label htmlFor="day" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            {t("birthchart.day", "Day")}
          </label>
          <select
            id="day"
            value={input.day}
            onChange={(e) => handleChange("day", parseInt(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-2.5 text-sm text-starlight outline-none transition-colors focus:border-gold"
          >
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1} className="bg-[#111222]">
                {i + 1}
              </option>
            ))}
          </select>
          {errors.day && <p className="mt-1 text-xs text-red-400">{errors.day}</p>}
        </div>
      </div>

      {/* Time */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label htmlFor="hour12" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            {t("birthchart.hour", "Hour")}
          </label>
          <select
            id="hour12"
            value={input.hour12}
            onChange={(e) => handleChange("hour12", parseInt(e.target.value))}
            disabled={!input.timeKnown}
            className="w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-2.5 text-sm text-starlight outline-none transition-colors focus:border-gold disabled:opacity-40"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1} className="bg-[#111222]">
                {String(i + 1).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="minute" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            {t("birthchart.minute", "Minute")}
          </label>
          <select
            id="minute"
            value={input.minute}
            onChange={(e) => handleChange("minute", parseInt(e.target.value))}
            disabled={!input.timeKnown}
            className="w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-2.5 text-sm text-starlight outline-none transition-colors focus:border-gold disabled:opacity-40"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i} className="bg-[#111222]">
                {String(i).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ampm" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            {t("birthchart.ampm", "AM / PM")}
          </label>
          <select
            id="ampm"
            value={input.ampm}
            onChange={(e) => handleChange("ampm", e.target.value as "AM" | "PM")}
            disabled={!input.timeKnown}
            className="w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-2.5 text-sm text-starlight outline-none transition-colors focus:border-gold disabled:opacity-40"
          >
            <option value="AM" className="bg-[#111222]">AM</option>
            <option value="PM" className="bg-[#111222]">PM</option>
          </select>
        </div>

        <div className="flex items-center sm:pt-6">
          <label className="flex cursor-pointer items-center gap-2.5 text-xs text-muted">
            <input
              type="checkbox"
              checked={!input.timeKnown}
              onChange={(e) => handleChange("timeKnown", !e.target.checked)}
              className="rounded border-white/20 bg-ink/80 text-gold focus:ring-gold"
            />
            <span>{t("birthchart.timeUnknownCheckbox", "Exact birth time unknown (assume 12:00 PM)")}</span>
          </label>
        </div>
      </div>

      {/* Location */}
      <div className="relative">
        <label htmlFor="place" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
          {t("birthchart.birthLocationLabel", "Birthplace (City, Country)")}
        </label>
        <input
          id="place"
          type="text"
          value={input.placeName}
          onChange={(e) => {
            handleChange("placeName", e.target.value);
            handlePlaceSearch(e.target.value);
          }}
          onFocus={() => handlePlaceSearch(input.placeName || "")}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
          placeholder="e.g., London, United Kingdom"
          className="w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-starlight outline-none transition-colors focus:border-gold"
          autoComplete="off"
        />
        {showSuggestions && placeSuggestions.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#111222] shadow-2xl backdrop-blur-xl">
            {placeSuggestions.map((p) => (
              <li
                key={p.place_id}
                onMouseDown={() => selectPlace(p)}
                className="cursor-pointer px-4 py-2.5 text-sm text-starlight transition-colors hover:bg-gold/15 hover:text-gold"
              >
                {p.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="latitude" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            {t("birthchart.latitudeLabel", "Latitude (°N / °S)")}
          </label>
          <input
            id="latitude"
            type="number"
            step="any"
            value={input.latitude}
            onChange={(e) => handleChange("latitude", parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-2.5 text-sm text-starlight outline-none transition-colors focus:border-gold"
          />
          {errors.latitude && <p className="mt-1 text-xs text-red-400">{errors.latitude}</p>}
        </div>

        <div>
          <label htmlFor="longitude" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            {t("birthchart.longitudeLabel", "Longitude (°E / °W)")}
          </label>
          <input
            id="longitude"
            type="number"
            step="any"
            value={input.longitude}
            onChange={(e) => handleChange("longitude", parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-2.5 text-sm text-starlight outline-none transition-colors focus:border-gold"
          />
          {errors.longitude && <p className="mt-1 text-xs text-red-400">{errors.longitude}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-gold px-8 py-3.5 text-sm font-medium tracking-wide text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? t("birthchart.calculating", "Calculating...") : t("birthchart.calculateButton", "Calculate Birth Chart")}
      </button>
    </form>
  );
}