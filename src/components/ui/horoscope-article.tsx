import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { PeriodTabs } from "./period-tabs";
import { ZodiacSymbol } from "./zodiac-symbol";
import { PlanetSymbol } from "./planet-symbol";
import type { ZodiacSign } from "@/lib/zodiac/zodiac";
import type { PeriodType } from "@/lib/calendar/periods";
import { periodLabel, periodKey } from "@/lib/calendar/periods";
import type { HoroscopeResult } from "@/lib/horoscope/read";
import type { SignalStrength } from "@/lib/astrology/signals";
import type { LifeArea } from "@/lib/astrology/signals";
import { absoluteUrl } from "@/lib/seo/site";
import type { PlanetarySnapshot } from "@/lib/astronomy/astro";
import type { BodyKey } from "@/lib/astronomy/bodies";

interface HoroscopeArticleProps {
  sign: ZodiacSign;
  periodType: PeriodType;
  date: Date;
  result: HoroscopeResult;
  crumbs: Crumb[];
}

const AREA_LABEL: Record<LifeArea, string> = {
  love: "Love",
  work: "Work",
  money: "Money",
  energy: "Energy",
};

function strengthTone(strength: SignalStrength): string {
  switch (strength) {
    case "strong":
      return "border-gold bg-gold/15 text-gold";
    case "moderate":
      return "border-gold-light/60 bg-gold-light/10 text-starlight";
    case "mild":
      return "border-line bg-ink-2 text-muted";
    case "none":
      return "border-line-soft bg-transparent text-subdued";
  }
}

function AreaChip({ signal }: { signal: { area: LifeArea; strength: SignalStrength } }) {
  return (
    <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${strengthTone(signal.strength)}`}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {AREA_LABEL[signal.area]}
    </div>
  );
}

function GlancePanel({ result }: { result: HoroscopeResult }) {
  return (
    <section aria-labelledby="glance-heading" className="paper-panel rounded-md p-6">
      <h2 id="glance-heading" className="kicker !text-gold-deep">
        Today at a glance
      </h2>
      <p className="mt-3 font-serif-body text-lg italic leading-8 text-p-ink">{result.glance.overall}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {result.signals.areas.map((s) => (
          <AreaChip key={s.area} signal={s} />
        ))}
      </div>
    </section>
  );
}

function ChangesPanel({ result }: { result: HoroscopeResult }) {
  return (
    <section aria-labelledby="changes-heading" className="rounded-md border border-line-soft p-6">
      <h2 id="changes-heading" className="kicker !text-gold-deep">What changed today?</h2>
      {result.changes.length === 0 ? (
        <p className="mt-3 font-serif-body text-base leading-7 text-p-muted">
          Nothing major changed in the sky today, so conditions stay largely steady. Small shifts matter more than any grand move.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {result.changes.map((c) => (
            <li key={c.id} className="border-l-2 border-gold-deep bg-paper-2/50 py-3 pl-4 pr-3">
              <p className="font-medium text-p-ink">{c.title}</p>
              <p className="mt-1 text-sm leading-6 text-p-muted">{c.blurb}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ThirtySeconds({ result }: { result: HoroscopeResult }) {
  const rows: Array<[string, string]> = [
    ["Best for", result.glance.bestFor],
    ["Watch out for", result.glance.watchOutFor],
    ["Best move", result.glance.bestMove],
  ];
  return (
    <section aria-labelledby="thirty-heading" className="rounded-md border border-line-soft p-6">
      <h2 id="thirty-heading" className="kicker !text-gold-deep">Your day in 30 seconds</h2>
      <dl className="mt-4 space-y-4">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
            <dt className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wide text-p-muted">{label}</dt>
            <dd className="font-serif-body text-base leading-7 text-p-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function StrongestThemes({ result }: { result: HoroscopeResult }) {
  const present = result.signals.themes.filter((t) => t.present);
  if (present.length === 0) return null;
  return (
    <section aria-labelledby="themes-heading" className="rounded-md border border-line-soft p-6">
      <h2 id="themes-heading" className="kicker !text-gold-deep">Today&rsquo;s strongest themes</h2>
      <ol className="mt-4 space-y-3">
        {present.map((t, i) => (
          <li key={t.theme} className="flex items-center gap-3 text-sm">
            <span aria-hidden className="w-5 shrink-0 text-right font-display text-gold">{i + 1}</span>
            <span className="font-medium text-p-ink">{t.label}</span>
            <span className={`ml-auto rounded-full border px-2 py-0.5 text-[0.65rem] uppercase tracking-wide ${strengthTone(t.strength)}`}>
              {t.strength}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function WhyForecast({ result }: { result: HoroscopeResult }) {
  const { why } = result;
  return (
    <details className="group rounded-md border border-line-soft p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <h2 className="kicker !text-gold-deep">Why this forecast?</h2>
        <span aria-hidden className="text-muted transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="mt-4 font-serif-body text-base leading-7 text-p-muted">{why.summary}</p>
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-p-muted">Driving positions</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {why.bodies.map((b) => (
              <li key={b.key} className="flex items-center gap-2 text-p-ink">
                <PlanetSymbol body={b.key as BodyKey} size="sm" className="text-gold-deep" />
                <span className="font-medium">{b.name}</span>
                <span className="text-p-muted">{b.position}{b.retrograde ? " \u00b7 retrograde" : ""}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-p-muted">Aspects shaping it</h3>
          {why.aspects.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-p-ink">
              {why.aspects.map((a, i) => (
                <li key={`${a.bodyA}-${a.bodyB}-${i}`}>
                  <span className="capitalize">{a.name}</span> between{" "}
                  <span className="font-medium">{a.bodyA}</span> and{" "}
                  <span className="font-medium">{a.bodyB}</span>
                  {" "}within {Math.round(a.orb * 10) / 10}&deg;
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-p-muted">No tight major aspects among the driving bodies right now.</p>
          )}
        </div>
      </div>
    </details>
  );
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
            <dt className="w-24 shrink-0 text-p-muted">Moon</dt>
            <dd className="font-medium text-p-ink">{moon.position}</dd>
          </div>
        )}
        {planets.map((p) => (
          <div key={p.key} className="flex items-center gap-3 py-2">
            <PlanetSymbol body={p.key } size="md" className="text-gold-deep" />
            <dt className="w-24 shrink-0 text-p-muted">{planetName(p.key)}</dt>
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

function planetName(key: string): string {
  const map: Record<string, string> = {
    sun: "Sun", moon: "Moon", mercury: "Mercury", venus: "Venus", mars: "Mars",
    jupiter: "Jupiter", saturn: "Saturn", uranus: "Uranus", neptune: "Neptune", pluto: "Pluto",
  };
  return map[key] ?? key;
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
  const isDaily = periodType === "daily";

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
        {isDaily && (
          <div className="space-y-5">
            <GlancePanel result={result} />
            <ChangesPanel result={result} />
            <ThirtySeconds result={result} />
            <StrongestThemes result={result} />
          </div>
        )}

        <div className="paper-panel mt-8 rounded-md">
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

            <div className="mt-9 space-y-5">
              <WhyForecast result={result} />
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
