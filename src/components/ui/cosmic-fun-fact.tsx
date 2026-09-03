import { PlanetSymbol } from "./planet-symbol";

interface CosmicFunFactProps {
  fact: string;
  compact?: boolean;
}

/**
 * "Did you know?" delight card. A compact, non-wall-of-text block that rewards
 * scanning: one dazzling fact, a tiny planet glyph, and a warm glow.
 */
export function CosmicFunFact({ fact, compact = false }: CosmicFunFactProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-cosmic/10 via-white/[0.03] to-nebula/10 p-5 ${
        compact ? "" : "sm:p-6"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(108,92,231,0.25)_0%,transparent_70%)]"
      />
      <div className="relative flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10">
          <PlanetSymbol body="moon" size="sm" className="text-gold" decorative />
        </span>
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">
            Did you know?
          </p>
          <p className="mt-2 text-sm leading-6 text-p-ink">{fact}</p>
        </div>
      </div>
    </div>
  );
}
