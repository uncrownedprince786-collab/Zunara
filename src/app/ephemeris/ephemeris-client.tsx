"use client";

import { useState, useMemo } from "react";
import { computeSnapshot } from "@/lib/astronomy/astro";
import { CELESTIAL_BODIES } from "@/lib/astronomy/bodies";
import { getZodiacSign } from "@/lib/zodiac/zodiac";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import type { BodyKey } from "@/lib/astronomy/bodies";

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

function formatCaption(dateStr: string, rows: Row[]): string {
  const retro = rows.filter((r) => r.retrograde);
  const sun = rows.find((r) => r.body === "sun");
  const date = parseLocal(dateStr);
  const pretty = new Intl.DateTimeFormat("en", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
  const sunPart = sun ? `the Sun is in ${sun.signName}` : "the Sun's sign is not resolved";
  const retroPart =
    retro.length === 0
      ? "no planets are retrograde"
      : `${retro.length} planet${retro.length === 1 ? " is" : "s are"} retrograde (${retro.map((r) => r.name).join(", ")})`;
  return `On ${pretty}, ${retroPart}; ${sunPart}.`;
}

export function EphemerisClient() {
  const [dateStr, setDateStr] = useState<string>(todayLocal);

  const rows = useMemo<Row[]>(() => {
    const at = parseLocal(dateStr);
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
    const at = parseLocal(dateStr);
    at.setDate(at.getDate() + delta);
    const y = at.getFullYear();
    const m = String(at.getMonth() + 1).padStart(2, "0");
    const d = String(at.getDate()).padStart(2, "0");
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
          ← Prev day
        </button>
        <label className="flex items-center gap-2 text-sm text-muted">
          Date
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
          Next day →
        </button>
      </div>

      <p className="mt-4 text-center text-sm leading-6 text-muted">
        {formatCaption(dateStr, rows)}
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-start text-xs font-semibold uppercase tracking-wider text-muted">
                <th className="p-4 text-start">Body</th>
                <th className="p-4 text-start">Sign</th>
                <th className="p-4 text-start">Degree</th>
                <th className="p-4 text-start">Longitude</th>
                <th className="p-4 text-start">Element</th>
                <th className="p-4 text-start">Motion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((r) => (
                <tr key={r.body} className="transition-colors hover:bg-white/[0.03]">
                  <td className="p-4 font-medium text-starlight">
                    <div className="flex items-center gap-2.5">
                      <PlanetSymbol body={r.body} size="sm" className="text-gold" decorative />
                      <span>{r.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted">
                    <div className="flex items-center gap-2">
                      <ZodiacSymbol sign={r.sign} size="sm" />
                      <span className="font-medium text-starlight">{r.signName}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-muted">{r.degree}</td>
                  <td className="p-4 font-mono text-muted">{r.longitude.toFixed(2)}°</td>
                  <td className="p-4 text-muted">{r.element || "—"}</td>
                  <td className="p-4">
                    {r.motion === "—" ? (
                      <span className="text-muted">—</span>
                    ) : r.retrograde ? (
                      <span className="rounded bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">
                        {r.motion}
                      </span>
                    ) : (
                      <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        Direct
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
