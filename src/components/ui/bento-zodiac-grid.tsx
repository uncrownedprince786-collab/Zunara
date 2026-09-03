import Link from "next/link";
import { ZODIAC_SIGNS, formatDateRange } from "@/lib/zodiac/zodiac";
import { snapshotForToday } from "@/lib/astronomy/astro";
import { getHoroscopeContent } from "@/lib/horoscope/read";
import { computeChanges } from "@/lib/astrology/changes";
import { ZodiacSymbol } from "./zodiac-symbol";
import { ThemeSymbol, type ThemeKey } from "./theme-symbol";
import { Reveal } from "./reveal";
import type { LifeArea, SignalStrength } from "@/lib/astrology/signals";

const AREA_THEME: Record<LifeArea, ThemeKey> = {
  love: "love",
  work: "work",
  money: "money",
  energy: "energy",
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/** Width of a strength metric in the pill. */
function strengthPct(s: SignalStrength | undefined): number {
  switch (s) {
    case "strong":
      return 92;
    case "moderate":
      return 64;
    case "mild":
      return 38;
    default:
      return 8;
  }
}

const PILL_ORDER: LifeArea[] = ["love", "work", "money", "energy"];

interface MetricPillProps {
  area: LifeArea;
  strength: SignalStrength | undefined;
}

function MetricPill({ area, strength }: MetricPillProps) {
  const pct = strengthPct(strength);
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-center justify-between gap-1 text-[0.6rem] uppercase tracking-[0.16em]">
        <span className="truncate text-muted">{AREA_THEME_LABEL[area]}</span>
        <span className={strength && strength !== "none" ? "text-gold" : "text-subdued"}>
          {strength ?? "—"}
        </span>
      </div>
      <div
        className="h-[5px] w-full overflow-hidden rounded-full bg-white/5"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`${AREA_THEME_LABEL[area]} strength`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-cosmic via-gold to-nebula transition-[width] duration-700"
          style={{
            width: `${pct}%`,
            boxShadow: "0 0 10px 0 rgba(255,209,102,0.55), 0 0 20px -4px rgba(108,92,231,0.5)",
          }}
        />
      </div>
    </div>
  );
}

const AREA_THEME_LABEL: Record<LifeArea, string> = {
  love: "Love",
  work: "Work",
  money: "Money",
  energy: "Energy",
};

/**
 * Bento-style zodiac index with glass cards, real per-sign signals,
 * and visual metric pills. Cards span one column, with a spotlight on
 * today's strongest area rendered as a highlight strip.
 */
export function BentoZodiacGrid() {
  const snapshot = snapshotForToday();
  const changes = computeChanges(new Date(), snapshot);

  return (
    <div>
      {changes.length > 0 && (
        <Reveal>
          <section
            className="paper-panel mb-8 p-6"
            aria-labelledby="whats-changed-heading"
          >
            <h2 id="whats-changed-heading" className="kicker">
              What changed today
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {changes.slice(0, 4).map((c) => (
                <li key={c.id} className="border-l-2 border-gold-deep bg-white/[0.03] py-2 pl-4 pr-3">
                  <p className="font-medium text-starlight">{c.title}</p>
                  <p className="mt-0.5 text-sm leading-6 text-muted">{c.blurb}</p>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ZODIAC_SIGNS.map((sign, i) => {
          const result = getHoroscopeContent(sign.slug, "daily", new Date(), snapshot);
          const areas = result?.signals?.areas ?? [];
          const strongest = areas.find((a) => a.present);

          return (
            <Reveal key={sign.slug} delay={i % 4} as="div">
              <Link
                href={`/horoscope/${sign.slug}/today`}
                className="card-lift group relative flex h-full flex-col gap-3 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl hover:border-gold/40 hover:shadow-[0_12px_40px_-10px_rgba(120,119,198,0.3)]"
              >
                {/* accent vignette on the top edge */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="flex items-center justify-between">
                  <span className="font-display text-sm italic text-subdued">
                    {ROMAN[i % ROMAN.length]}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-display text-xl leading-none text-starlight/25 transition-colors group-hover:text-starlight/50"
                  >
                    {sign.name.charAt(0)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <ZodiacSymbol
                    sign={sign.slug}
                    className={`h-10 w-10 shrink-0 text-gold/80 transition-colors group-hover:text-gold`}
                    strokeWidth={1.8}
                    label={sign.name}
                  />
                  <div className="min-w-0">
                    <span className="block font-display text-xl leading-none text-starlight">
                      {sign.name}
                    </span>
                    <span className="mt-1 block truncate text-[0.7rem] text-subdued">
                      {formatDateRange(sign)}
                    </span>
                  </div>
                </div>

                {/* headline strip */}
                <div className="mt-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-gold">
                    Today&rsquo;s theme
                  </p>
                  <p className="mt-0.5 text-[0.78rem] italic leading-5 text-starlight/90 line-clamp-2">
                    {result?.signals?.headline ?? "The sky is steady today."}
                  </p>
                </div>

                {/* metric pills */}
                <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line-soft pt-3">
                  {PILL_ORDER.map((area) => (
                    <MetricPill
                      key={area}
                      area={area}
                      strength={areas.find((a) => a.area === area)?.strength}
                    />
                  ))}
                </div>

                <span className="mt-1 flex items-center gap-1 text-[0.62rem] uppercase tracking-[0.18em] text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  {strongest ? (
                    <>
                      <ThemeSymbol theme={AREA_THEME[strongest.area]} size="sm" className="text-gold" />
                      Strongest: {AREA_THEME_LABEL[strongest.area]}
                    </>
                  ) : (
                    <span>Read today &rarr;</span>
                  )}
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
