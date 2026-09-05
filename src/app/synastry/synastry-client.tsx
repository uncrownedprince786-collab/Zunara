"use client";

import { useState } from "react";
import Link from "next/link";
import { BirthForm } from "@/components/birthchart/birth-form";
import { computeSynastry, ASPECT_WORD } from "@/lib/compatibility/synastry";
import type { SynastryAspect, SynastryResult } from "@/lib/compatibility/synastry";
import type { BirthInput } from "@/lib/natal/validate";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { AstroTerm } from "@/components/ui/astro-tooltip";

const ASPECT_COLOR: Record<string, string> = {
  conjunction: "border-gold/25 bg-gold/10 text-gold",
  opposition: "border-red-500/25 bg-red-500/10 text-red-300",
  square: "border-orange-500/25 bg-orange-500/10 text-orange-300",
  trine: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  sextile: "border-sky-500/25 bg-sky-500/10 text-sky-300",
};

interface PersonEntry {
  name: string;
  birth: BirthInput;
}

export function SynastryClient() {
  const [personA, setPersonA] = useState<PersonEntry | null>(null);
  const [personB, setPersonB] = useState<PersonEntry | null>(null);
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [result, setResult] = useState<SynastryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCompute = personA !== null && personB !== null;

  const handleCompute = async () => {
    if (!personA || !personB) return;
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const res = computeSynastry(
        { name: personA.name, birth: personA.birth },
        { name: personB.name, birth: personB.birth },
      );
      setResult(res);
      if (!res.ok) {
        setError(res.errors.personA ?? res.errors.personB ?? "Please check the birth details.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to compute compatibility.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Person A name (optional)
          </label>
          <input
            type="text"
            value={nameA}
            onChange={(e) => setNameA(e.target.value)}
            placeholder="e.g. Alex"
            className="mb-4 w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-2.5 text-sm text-starlight outline-none focus:border-gold"
          />
          <BirthForm
            isLoading={isLoading}
            onSubmit={(birth) => setPersonA({ name: nameA.trim() || "Person A", birth })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Person B name (optional)
          </label>
          <input
            type="text"
            value={nameB}
            onChange={(e) => setNameB(e.target.value)}
            placeholder="e.g. Sam"
            className="mb-4 w-full rounded-xl border border-white/10 bg-ink/80 px-4 py-2.5 text-sm text-starlight outline-none focus:border-gold"
          />
          <BirthForm
            isLoading={isLoading}
            onSubmit={(birth) => setPersonB({ name: nameB.trim() || "Person B", birth })}
          />
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={handleCompute}
          disabled={!canCompute || isLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-10 py-3.5 text-sm font-medium tracking-wide text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading
            ? "Computing compatibility..."
            : canCompute
              ? "Compute Compatibility"
              : "Enter both birth details first"}
        </button>
        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>

      {result && result.ok && (
        <div className="mt-14 space-y-10">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <h2 className="font-display text-2xl text-starlight">
              {result.data.personA.name} &amp; {result.data.personB.name}
            </h2>
            <p className="mt-2 text-sm text-muted">
              Overall compatibility score
            </p>
            <div className="mt-4 h-4 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold"
                style={{ width: `${result.data.overallScore}%` }}
              />
            </div>
            <p className="mt-3 font-display text-4xl text-gold">{result.data.overallScore}<span className="text-xl text-muted">/100</span></p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Based on the real angular relationships between the personal planets in the
              two charts. This is a descriptive score of how the charts interact, not a
              claim about the success or failure of any relationship.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {result.data.dimensions.map((dim) => (
              <div
                key={dim.key}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-starlight">{dim.title}</h3>
                  <span className="font-display text-2xl text-gold">{dim.score}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{dim.summary}</p>
                {dim.aspects.length > 0 && (
                  <ul className="mt-4 space-y-3">
                    {dim.aspects.map((asp, i) => (
                      <AspectRow key={`${dim.key}-${i}`} asp={asp} />
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-6 text-muted backdrop-blur-xl">
            <p>
              New to the terms? The <AstroTerm term="Conjunction" />,{" "}
              <AstroTerm term="Trine" />, <AstroTerm term="Square" />,{" "}
              <AstroTerm term="Opposition" /> and <AstroTerm term="Sextile" /> are the major{" "}
              <AstroTerm term="Aspects" />. This whole calculation is a form of{" "}
              <AstroTerm term="Synastry" />.
            </p>
            <p className="mt-3">
              <Link href="/library" className="text-gold hover:underline">
                Browse the full Library glossary →
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function AspectRow({ asp }: { asp: SynastryAspect }) {
  const badge = ASPECT_COLOR[asp.aspectName] ?? "border-white/10 bg-white/[0.03] text-muted";
  const word = ASPECT_WORD[asp.aspectName] ?? asp.aspectName;
  return (
    <li className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <PlanetSymbol body={asp.bodyA} size="sm" className="text-gold" decorative />
          <PlanetSymbol body={asp.bodyB} size="sm" className="text-gold" decorative />
        </span>
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider ${badge}`}>
          {word}
        </span>
        <span className="ml-auto font-mono text-xs text-muted">orb {asp.orb.toFixed(1)}°</span>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted">{asp.interpretation}</p>
    </li>
  );
}
