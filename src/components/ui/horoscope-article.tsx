import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { PeriodTabs } from "./period-tabs";
import { ZodiacSymbol } from "./zodiac-symbol";
import { PlanetSymbol } from "./planet-symbol";
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
    <section aria-labelledby="planet-positions-heading" className="paper-panel rounded-md p-6">
      <h2 id="planet-positions-heading" className="kicker !text-gold-deep">
        Planetary positions today
      </h2>
      <div className="mt-3 flex items-center gap-2 text-p-muted">
        <PlanetSymbol body="sun" size="sm" className="text-gold-deep" />
        <p className="text-xs">
          Calculated from real astronomical data. Sun, Moon and planets shown at their current
          zodiac degree.
        </p>
      </div>
      <dl className="mt-5 divide-y divide-p-line text-sm">
        {moon && (
          <div className="flex items-center gap-3 py-2">
            <PlanetSymbol body="moon" size="md" className="text-gold-deep" />
            <dt className="w-24 shrink-0 text-p-muted">{PLANET_LABELS.moon}</dt>
            <dd className="font-medium text-p-ink">{moon.position}</dd>
          </div>
        )}
        {planets.map((p) => (
          <div key={p.key} className="flex items-center gap-3 py-2">
            <PlanetSymbol body={p.key} size="md" className="text-gold-deep" />
            <dt className="w-24 shrink-0 text-p-muted">{PLANET_LABELS[p.key] ?? p.key}</dt>
            <dd className="font-medium text-p-ink">
              {p.position}
              {p.retrograde && <span className="ml-1 text-p-muted">R</span>}
            </dd>
          </div>
        ))}
        {nodes.length > 0 && (
          <div className="flex items-center gap-3 py-2">
            <dt className="w-24 shrink-0 text-p-muted">Nodes</dt>
            <dd className="text-p-muted">{nodes.map((n) => `${n.position}`).join(" \u00b7 ")}</dd>
          </div>
        )}
      </dl>
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

  const periodNoun =
    periodType === "daily" ? "Daily" : periodType === "weekly" ? "Weekly" : periodType === "monthly" ? "Monthly" : "Yearly";

  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${sign.name} ${periodNoun} Horoscope`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
      />

      <Breadcrumbs items={crumbs} />

      <header className="mt-8 border-b border-line-soft pb-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center justify-center rounded-full border border-line bg-ink-2 p-5">
            <ZodiacSymbol sign={sign.slug} size="lg" className="text-gold" strokeWidth={1.1} label={sign.name} />
          </div>
          <div>
            <p className="kicker">{periodNoun} horoscope</p>
            <h1 className="mt-2 font-display text-4xl text-starlight sm:text-5xl">
              {sign.name}
            </h1>
            <p className="mt-2 font-serif-body text-lg italic text-muted">{label}</p>
          </div>
        </div>
        <div className="mt-6">
          <PeriodTabs signSlug={sign.slug} active={periodType} />
        </div>
      </header>

      <article className="mt-10">
        <div className="paper-panel rounded-md">
          <div className="border-b border-p-line p-2 text-center">
            <p className="font-serif-body italic text-p-muted">
              {sign.name} \u2014 the {sign.modality.toLowerCase()} {sign.element.toLowerCase()} sign
            </p>
          </div>
          <div className="p-7 sm:p-9">
            <p className="drop-cap font-serif-body text-xl leading-relaxed text-p-ink">
              {result.overview}
            </p>

            <div className="mt-9 space-y-8">
              {result.sections.map((section, i) => (
                <section key={i}>
                  <h2 className="kicker !text-gold-deep">{section.heading}</h2>
                  <div className="gold-rule mt-3 w-16" />
                  <p className="mt-4 font-serif-body text-[1.05rem] leading-8 text-p-ink">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>

            <section className="mt-10 border-l-2 border-gold-deep bg-paper-2/60 py-5 pl-6 pr-5">
              <h2 className="kicker !text-gold-deep">Carry this forward</h2>
              <p className="mt-3 font-serif-body text-lg italic leading-8 text-p-ink">
                &ldquo;{result.advice}&rdquo;
              </p>
            </section>

            <div className="mt-9">
              <PlanetPositions snapshot={result.snapshot} />
            </div>
          </div>
        </div>

        <p className="mt-8 border-t border-line-soft pt-5 text-xs leading-5 text-subdued">
          {result.disclaimer}.{" "}
          <span className="text-muted">Period key: {key}. Generated deterministically from
          current astronomical data; content may be refreshed automatically.</span>
        </p>
      </article>
    </div>
  );
}
