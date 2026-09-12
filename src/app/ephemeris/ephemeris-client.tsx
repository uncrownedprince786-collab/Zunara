"use client";

import { useState, useMemo } from "react";
import { computeSnapshot } from "@/lib/astronomy/astro";
import { CELESTIAL_BODIES } from "@/lib/astronomy/bodies";
import { getZodiacSign } from "@/lib/zodiac/zodiac";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import type { BodyKey } from "@/lib/astronomy/bodies";
import { useLocale } from "@/lib/i18n/client";

function subst(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
}

const NODE_KEYS: Array<BodyKey> = ["northNode", "southNode"];

interface Row {
  body: BodyKey;
  name: string;
  glyph: string;
  sign: string;
  signName: string;
  degree: string;
  longitude: number;
  element: string;
  motion: string;
  retrograde: boolean;
}

function formatDegree(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}′`;
}

function parseUtcNoon(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  // Parse as UTC noon so the computed positions are identical on the server
  // prerender and the client hydration. A local-time parse resolves to a
  // different instant per timezone, shifting positions and triggering a
  // React #418 hydration mismatch.
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0));
}

function formatCaption(
  dateStr: string,
  rows: Row[],
  t: (path: string, fallback?: string) => string,
  tPlanet: (k: string) => string,
  tSign: (k: string) => string,
  locale: string,
): string {
  const retro = rows.filter((r) => r.retrograde);
  const sun = rows.find((r) => r.body === "sun");
  const date = parseUtcNoon(dateStr);
  const pretty = new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
  const sunPart = sun
    ? subst(t("ephemeris.sunIn", "the Sun is in {sign}"), { sign: tSign(sun.sign) })
    : t("ephemeris.sunSignNotResolved", "the Sun\u2019s sign is not resolved");
  const retroPart =
    retro.length === 0
      ? t("ephemeris.retroNone", "no planets are retrograde")
      : subst(t("ephemeris.retroSome", "{count} planet(s) retrograde ({names})"), {
          count: String(retro.length),
          names: retro.map((r) => tPlanet(r.body)).join(", "),
        });
  return subst(t("ephemeris.onDate", "On {date}, {retro}; {sun}."), { date: pretty, retro: retroPart, sun: sunPart });
}

export function EphemerisClient({ initialDate }: { initialDate: string }) {
  const { t, tPlanet, tSign, tElement, locale } = useLocale();
  const [dateStr, setDateStr] = useState<string>(initialDate);

  const rows = useMemo<Row[]>(() => {
    const at = parseUtcNoon(dateStr);
    const snap = computeSnapshot(at);
    const out: Row[] = [];
    for (const pos of snap.positions) {
      const meta = CELESTIAL_BODIES.find((c) => c.key === pos.key);
      const sign = getZodiacSign(pos.sign);
      out.push({
        body: pos.key,
        name: meta?.name ?? pos.key,
        glyph: meta?.glyph ?? "",
        sign: pos.sign,
        signName: sign?.name ?? pos.sign,
        degree: formatDegree(pos.degreeInSign),
        longitude: pos.longitude,
        element: sign?.element ?? "",
        motion: NODE_KEYS.includes(pos.key)
          ? "—"
          : pos.retrograde
            ? "Retrograde (R)"
            : "Direct",
        retrograde: pos.retrograde,
      });
    }
    return out;
  }, [dateStr]);

  const shiftDay = (delta: number) => {
    const at = parseUtcNoon(dateStr);
    at.setUTCDate(at.getUTCDate() + delta);
    const y = at.getUTCFullYear();
    const m = String(at.getUTCMonth() + 1).padStart(2, "0");
    const d = String(at.getUTCDate()).padStart(2, "0");
    setDateStr(`${y}-${m}-${d}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
      <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => shiftDay(-1)}
          className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-starlight transition-colors hover:border-gold/40 hover:text-gold"
        >
          {t("ephemeris.prevDay", "← Prev day")}
        </button>
        <label className="flex items-center gap-2 text-sm text-muted">
          {t("common.date", "Date")}
          <input
            type="date"
            value={dateStr}
            onChange={(e) => e.target.value && setDateStr(e.target.value)}
            className="rounded-xl border border-white/10 bg-ink/80 px-3 py-2 text-sm text-starlight outline-none focus:border-gold"
          />
        </label>
        <button
          type="button"
          onClick={() => shiftDay(1)}
          className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-starlight transition-colors hover:border-gold/40 hover:text-gold"
        >
          {t("ephemeris.nextDay", "Next day →")}
        </button>
      </div>

      <p className="mt-4 text-center text-sm leading-6 text-muted">
        {formatCaption(dateStr, rows, t, tPlanet, tSign, locale)}
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-start text-xs font-semibold uppercase tracking-wider text-muted">
                <th className="p-4 text-start">{t("common.colPlanet", "Body")}</th>
                <th className="p-4 text-start">{t("common.colSign", "Sign")}</th>
                <th className="p-4 text-start">{t("common.colDegree", "Degree")}</th>
                <th className="p-4 text-start">{t("common.colLongitude", "Longitude")}</th>
                <th className="p-4 text-start">{t("common.colElement", "Element")}</th>
                <th className="p-4 text-start">{t("common.colMotion", "Motion")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((r) => (
                <tr key={r.body} className="transition-colors hover:bg-white/[0.03]">
                  <td className="p-4 font-medium text-starlight">
                    <div className="flex items-center gap-2.5">
                      <PlanetSymbol body={r.body} size="sm" className="text-gold" decorative />
                      <span>{tPlanet(r.body)}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted">
                    <div className="flex items-center gap-2">
                      <ZodiacSymbol sign={r.sign} size="sm" />
                      <span className="font-medium text-starlight">{tSign(r.sign)}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-muted">{r.degree}</td>
                  <td className="p-4 font-mono text-muted">{r.longitude.toFixed(2)}°</td>
                  <td className="p-4 text-muted">{r.element ? tElement(r.element) : "—"}</td>
                  <td className="p-4">
                    {r.motion === "—" ? (
                      <span className="text-muted">—</span>
                    ) : r.retrograde ? (
                      <span className="rounded bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">
                        {t("ephemeris.retroMarker", "Retrograde (R)")}
                      </span>
                    ) : (
                      <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        {t("common.direct", "Direct")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
