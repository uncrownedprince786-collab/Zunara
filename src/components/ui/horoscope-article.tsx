import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { PeriodTabs } from "./period-tabs";
import { ZodiacSymbol } from "./zodiac-symbol";
import type { ZodiacSign } from "@/lib/zodiac/zodiac";
import type { PeriodType } from "@/lib/calendar/periods";
import { periodLabel, periodKey } from "@/lib/calendar/periods";
import type { HoroscopeResult } from "@/lib/horoscope/read";
import { PLANET_LABELS } from "@/lib/astrology/interpret";
import { absoluteUrl } from "@/lib/seo/site";
import type { PlanetarySnapshot } from "@/lib/astronomy/astro";

interface HoroscopeArticleProps {
  sign: ZodiacSign;
  periodType: PeriodType;
  date: Date;
  result: HoroscopeResult;
  crumbs: Crumb[];
}

function PlanetPositions({ snapshot }: { snapshot: PlanetarySnapshot }) {
  const planets = snapshot.positions.filter(
    (p) => p.key !== "northNode" && p.key !== "southNode" && p.key !== "moon",
  );
  const moon = snapshot.positions.find((p) => p.key === "moon");
  const nodes = snapshot.positions.filter((p) => p.key === "northNode" || p.key === "southNode");

  return (
    <section aria-labelledby="planet-positions-heading" className="rounded-lg border border-line bg-obsidian/60 p-5">
      <h2 id="planet-positions-heading" className="text-xs uppercase tracking-[0.18em] text-subdued">
        Planetary positions today
      </h2>
      <p className="mt-2 text-xs text-muted">
        Calculated from real astronomical data. Sun, Moon and planets are shown at their current
        zodiac degree.
      </p>
      <ul className="mt-4 space-y-1.5 text-sm">
        {moon && (
          <li className="flex items-center gap-2 text-starlight">
            <span className="w-24 shrink-0 text-muted">{PLANET_LABELS.moon}</span>
            <span className={moon.retrograde ? "text-gold" : ""}>{moon.position}</span>
          </li>
        )}
        {planets.map((p) => (
          <li key={p.key} className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-muted">{PLANET_LABELS[p.key] ?? p.key}</span>
            <span className={p.retrograde ? "text-gold" : "text-starlight"}>
              {p.position}
              {p.retrograde && <span className="ml-1 text-subdued">\u00A0R</span>}
            </span>
          </li>
        ))}
        {nodes.length > 0 && (
          <li className="flex items-center gap-2 text-subdued">
            <span className="w-24 shrink-0">Nodes</span>
            <span>{nodes.map((n) => `${n.position}`).join(" \u00B7 ")}</span>
          </li>
        )}
      </ul>
    </section>
  );
}

export function HoroscopeArticle({
  sign,
  periodType,
  date,
  result,
  crumbs,
}: HoroscopeArticleProps) {
  const label = periodLabel(periodType, date);
  const key = periodKey(periodType, date);
  const path = `/horoscope/${sign.slug}/${periodType === "daily" ? "today" : periodType}`;
  const canonical = absoluteUrl(path);

  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${sign.name} ${periodType === "daily" ? "Daily" : periodType === "weekly" ? "Weekly" : periodType === "monthly" ? "Monthly" : "Yearly"} Horoscope`,
    description: result.overview,
    datePublished: new Date(date).toISOString(),
    dateModified: result.seed ? new Date().toISOString() : new Date(date).toISOString(),
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "Zunara",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={crumbs} />

      <header className="mt-8">
        <div className="flex items-center gap-4">
          <ZodiacSymbol sign={sign.slug} size="xl" className="text-gold" label={sign.name} />
          <div>
            <h1 className="font-display text-4xl text-starlight sm:text-5xl">
              {sign.name} Horoscope
            </h1>
            <p className="mt-1 text-sm text-muted">{label}</p>
          </div>
        </div>
        <div className="mt-6">
          <PeriodTabs signSlug={sign.slug} active={periodType} />
        </div>
      </header>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
      />

      <article className="mt-10 space-y-8">
        <p className="font-display text-xl leading-relaxed text-starlight/90">{result.overview}</p>

        <div className="grid gap-5">
          {result.sections.map((section, i) => (
            <section key={i} className="rounded-lg border border-line bg-obsidian p-6">
              <h2 className="text-xs uppercase tracking-[0.18em] text-gold">{section.heading}</h2>
              <p className="mt-3 leading-7 text-starlight/90">{section.content}</p>
            </section>
          ))}
        </div>

        <section className="rounded-lg border border-gold/20 bg-gold/[0.04] p-6">
          <h2 className="text-xs uppercase tracking-[0.18em] text-gold">Carry this forward</h2>
          <p className="mt-3 leading-7 text-starlight/90">{result.advice}</p>
        </section>

        <PlanetPositions snapshot={result.snapshot} />
      </article>

      <p className="mt-10 border-t border-line-soft pt-6 text-xs leading-5 text-subdued">
        {result.disclaimer}.{" "}
        <span className="text-muted">Period key: {key}. Generated deterministically from
        current astronomical data; content may be refreshed automatically.</span>
      </p>
    </div>
  );
}
