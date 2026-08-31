import Link from "next/link";
import { ZODIAC_SIGNS, formatDateRange } from "@/lib/zodiac/zodiac";
import { snapshotForToday } from "@/lib/astronomy/astro";
import { getHoroscopeContent } from "@/lib/horoscope/read";
import { computeChanges } from "@/lib/astrology/changes";
import { ZodiacSymbol } from "./zodiac-symbol";
import { ThemeSymbol, type ThemeKey } from "./theme-symbol";
import { elementText } from "./element";
import { Reveal } from "./reveal";
import type { LifeArea } from "@/lib/astrology/signals";

const AREA_THEME: Record<LifeArea, ThemeKey> = {
  love: "love",
  work: "work",
  money: "money",
  energy: "energy",
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/** ZodC grid enhanced with today's real signal per sign (for the homepage). */
export function LiveZodiacGrid() {
  const snapshot = snapshotForToday();
  const changes = computeChanges(new Date(), snapshot);

  return (
    <div>
      {changes.length > 0 && (
        <Reveal>
          <section className="mb-10 rounded-lg border border-line-soft bg-ink-2/60 p-6" aria-labelledby="whats-changed-heading">
            <h2 id="whats-changed-heading" className="kicker !text-gold-deep">What changed today</h2>
            <ul className="mt-4 space-y-3">
              {changes.slice(0, 4).map((c) => (
                <li key={c.id} className="border-l-2 border-gold-deep bg-ink/60 py-2 pl-4 pr-3">
                  <p className="font-medium text-starlight">{c.title}</p>
                  <p className="mt-0.5 text-sm leading-6 text-muted">{c.blurb}</p>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
        {ZODIAC_SIGNS.map((sign, i) => {
          const result = getHoroscopeContent(sign.slug, "daily", new Date(), snapshot);
          const headline = result?.signals?.headline ?? null;
          const strongest = result?.signals?.areas?.find((a) => a.present);

          return (
            <Reveal key={sign.slug} delay={i % 4} as="div">
              <Link
                href={`/horoscope/${sign.slug}/today`}
                className="group relative flex flex-col gap-3 bg-ink-2 p-5 transition-colors hover:bg-ink-3"
              >
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
                <ZodiacSymbol
                  sign={sign.slug}
                  className={`h-11 w-11 text-gold/80 transition-colors group-hover:text-gold ${elementText(sign.element)}`}
                  strokeWidth={1.1}
                  label={sign.name}
                />
                <div>
                  <span className="block font-display text-xl text-starlight">{sign.name}</span>
                  <span className="mt-0.5 block text-xs text-subdued">{formatDateRange(sign)}</span>
                </div>
                {headline && (
                  <p className="mt-1 text-[0.72rem] italic leading-5 text-muted line-clamp-2">
                    {headline}
                  </p>
                )}
                {strongest && (
                  <div className="mt-1 flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.18em] text-subdued">
                    <ThemeSymbol theme={AREA_THEME[strongest.area]} size="sm" className="text-gold" />
                    <span>Strongest: {strongest.area}</span>
                  </div>
                )}
                <span className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  Read today &rarr;
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
