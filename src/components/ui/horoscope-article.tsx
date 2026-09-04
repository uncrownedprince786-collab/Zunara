"use client";

import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { PeriodTabs } from "./period-tabs";
import { ZodiacSymbol } from "./zodiac-symbol";
import { PlanetSymbol } from "./planet-symbol";
import { ThemeSymbol, type ThemeKey } from "./theme-symbol";
import { ShareVibe } from "./share-vibe";
import type { ZodiacSign } from "@/lib/zodiac/zodiac";
import type { PeriodType } from "@/lib/calendar/periods";
import { periodLabel, periodKey } from "@/lib/calendar/periods";
import type { HoroscopeResult } from "@/lib/horoscope/read";
import type { SignalStrength } from "@/lib/astrology/signals";
import type { LifeArea } from "@/lib/astrology/signals";
import { absoluteUrl } from "@/lib/seo/site";
import type { PlanetarySnapshot } from "@/lib/astronomy/astro";
import type { BodyKey } from "@/lib/astronomy/bodies";
import { useLocale } from "@/lib/i18n/client";
import { LocalizedChange } from "./localized-change";

interface HoroscopeArticleProps {
  sign: ZodiacSign;
  periodType: PeriodType;
  date: Date;
  result: HoroscopeResult;
  crumbs: Crumb[];
}

const AREA_THEME_KEY: Record<LifeArea, ThemeKey> = {
  love: "love",
  work: "work",
  money: "money",
  energy: "energy",
};

function strengthPct(strength: SignalStrength): number {
  switch (strength) {
    case "strong": return 92;
    case "moderate": return 64;
    case "mild": return 38;
    default: return 10;
  }
}

function strengthTone(strength: SignalStrength): string {
  switch (strength) {
    case "strong": return "border-white/15 bg-white/[0.05] text-gold";
    case "moderate": return "border-white/10 bg-white/[0.04] text-starlight";
    case "mild": return "border-white/10 bg-white/[0.03] text-muted";
    case "none": return "border-white/5 bg-transparent text-subdued";
  }
}

function AreaBar({ signal }: { signal: { area: LifeArea; strength: SignalStrength } }) {
  const { t, tArea } = useLocale();
  const pct = strengthPct(signal.strength);
  const areaLabel = tArea(signal.area);
  const strengthLabel = t(`areas.${signal.strength}`, signal.strength);

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.16em]">
        <span className="font-medium text-p-muted">{areaLabel}</span>
        <span className="text-gold">{strengthLabel}</span>
      </div>
      <div
        className="h-[6px] w-full overflow-hidden rounded-full bg-white/5"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`${areaLabel} strength`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-cosmic via-gold to-nebula transition-[width] duration-700"
          style={{ width: `${pct}%`, boxShadow: "0 0 12px 0 rgba(255,209,102,0.55), 0 0 24px -4px rgba(108,92,231,0.5)" }}
        />
      </div>
    </div>
  );
}

function GlancePanel({ result }: { result: HoroscopeResult }) {
  const { t } = useLocale();
  return (
    <section
      aria-labelledby="glance-heading"
      className="paper-panel relative overflow-hidden p-7 sm:p-8"
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <p id="glance-heading" className="kicker">{t("horoscope.yourDayInOneLine", "Your day in one line")}</p>
      <p className="mt-4 font-serif-body text-2xl font-light leading-snug text-p-ink sm:text-[1.65rem]">
        {result.glance.overall}
      </p>

      <div className="mt-7 grid gap-x-8 gap-y-5 border-t border-p-line pt-6 sm:grid-cols-2">
        {result.signals.areas.map((s) => (
          <AreaBar key={s.area} signal={s} />
        ))}
      </div>

      {(result.glance.bestFor || result.glance.watchOutFor) && (
        <div className="mt-7 grid gap-4 border-t border-p-line pt-6 text-sm sm:grid-cols-2">
          {result.glance.bestFor && (
            <div className="flex flex-col gap-0.5">
              <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-p-muted">{t("common.bestFor", "Best for")}</dt>
              <dd className="font-serif-body leading-6 text-p-ink">{result.glance.bestFor}</dd>
            </div>
          )}
          {result.glance.watchOutFor && (
            <div className="flex flex-col gap-0.5">
              <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-p-muted">{t("common.watchOutFor", "Watch out for")}</dt>
              <dd className="font-serif-body leading-6 text-p-ink">{result.glance.watchOutFor}</dd>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ChangesPanel({ result }: { result: HoroscopeResult }) {
  const { t } = useLocale();
  return (
    <section aria-labelledby="changes-heading" className="rounded-md border border-line-soft p-6">
      <h2 id="changes-heading" className="kicker">{t("horoscope.whatChangedToday", "What changed today?")}</h2>
      {result.changes.length === 0 ? (
        <p className="mt-3 font-serif-body text-base leading-7 text-p-muted">
          {t("horoscope.steadySky", "Nothing major changed in the sky today, so conditions stay largely steady. Small shifts matter more than any grand move.")}
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {result.changes.map((c) => (
            <li key={c.id} className="border-s-2 border-gold-deep bg-paper-2/50 py-3 pe-3 ps-4">
              <LocalizedChange
                change={c}
                titleClassName="font-medium text-p-ink"
                blurbClassName="mt-1 text-sm leading-6 text-p-muted"
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ThirtySeconds({ result }: { result: HoroscopeResult }) {
  const { t, tArea } = useLocale();
  const areas = result.signals.areas.filter((a) => a.present);
  if (areas.length === 0) return null;

  return (
    <section aria-labelledby="thirty-heading" className="rounded-md border border-line-soft p-6">
      <h2 id="thirty-heading" className="kicker">{t("horoscope.thirtySeconds", "Your day in 30 seconds")}</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {areas.map((a) => (
          <div key={a.area} className={`flex flex-col items-center gap-2 rounded-md border p-4 ${strengthTone(a.strength)}`}>
            <ThemeSymbol theme={AREA_THEME_KEY[a.area]} size="md" className="text-current" />
            <span className="text-xs font-semibold uppercase tracking-wide">{tArea(a.area)}</span>
            <span className="text-[0.65rem] uppercase tracking-[0.12em] opacity-80">
              {t(`areas.${a.strength}`, a.strength)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function YourMove({ result }: { result: HoroscopeResult }) {
  const { t } = useLocale();
  if (!result.glance.bestMove) return null;
  return (
    <section aria-labelledby="move-heading" className="rounded-md border-s-2 border-gold-deep bg-white/[0.04] p-6 backdrop-blur-xl saturate-180">
      <h2 id="move-heading" className="kicker">{t("horoscope.yourMove", "Your move")}</h2>
      <p className="mt-3 font-serif-body text-lg italic leading-8 text-starlight">
        &ldquo;{result.glance.bestMove}&rdquo;
      </p>
    </section>
  );
}

function PeriodSignals({ result, periodType }: { result: HoroscopeResult; periodType: PeriodType }) {
  const { t, tArea, tHorizon } = useLocale();
  const areas = result.signals.areas.filter((a) => a.present);
  const periodNoun = tHorizon(periodType);

  return (
    <section aria-labelledby="period-signals-heading" className="rounded-md border border-line-soft p-6">
      <h2 id="period-signals-heading" className="kicker">
        {t("horoscope.biggestThemes", "Biggest themes")} — {periodNoun}
      </h2>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {areas.map((a) => (
          <div key={a.area} className={`flex flex-col items-center gap-2 rounded-md border p-4 ${strengthTone(a.strength)}`}>
            <ThemeSymbol theme={AREA_THEME_KEY[a.area]} size="md" className="text-current" />
            <span className="text-xs font-semibold uppercase tracking-wide">{tArea(a.area)}</span>
            <span className="text-[0.65rem] uppercase tracking-[0.12em] opacity-80">
              {t(`areas.${a.strength}`, a.strength)}
            </span>
          </div>
        ))}
      </div>
      {result.glance.bestMove && (
        <p className="mt-5 border-t border-p-line pt-4 font-serif-body text-base italic leading-7 text-p-muted">
          {t("horoscope.yourMove", "Best move")}: &ldquo;{result.glance.bestMove}&rdquo;
        </p>
      )}
    </section>
  );
}

function StrongestThemes({ result }: { result: HoroscopeResult }) {
  const { t } = useLocale();
  const present = result.signals.themes.filter((t) => t.present);
  if (present.length === 0) return null;
  return (
    <section aria-labelledby="themes-heading" className="rounded-md border border-line-soft p-6">
      <h2 id="themes-heading" className="kicker">{t("horoscope.todaysThemes", "Today's strongest themes")}</h2>
      <ol className="mt-4 space-y-3">
        {present.map((item, i) => (
          <li key={item.theme} className="flex items-center gap-3 text-sm">
            <span aria-hidden className="w-5 shrink-0 font-display text-gold">{i + 1}</span>
            <span className="font-medium text-p-ink">{item.label}</span>
            <span className={`ms-auto rounded-full border px-2 py-0.5 text-[0.65rem] uppercase tracking-wide ${strengthTone(item.strength)}`}>
              {t(`areas.${item.strength}`, item.strength)}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function WhyForecast({ result }: { result: HoroscopeResult }) {
  const { t, tPlanet } = useLocale();
  const { why } = result;
  return (
    <details className="group rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-xl saturate-180">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <h2 className="kicker">{t("horoscope.exploreMath", "Explore the astronomical math")}</h2>
        <span aria-hidden className="text-muted transition-transform group-open:rotate-45">+</span>
      </summary>
      <p className="mt-4 font-serif-body text-base leading-7 text-p-muted">{why.summary}</p>
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-p-muted">{t("horoscope.drivingPositions", "Driving positions")}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {why.bodies.map((b) => (
              <li key={b.key} className="flex items-center gap-2 text-p-ink">
                <PlanetSymbol body={b.key as BodyKey} size="sm" className="text-gold-deep" decorative />
                <span className="font-medium">{tPlanet(b.key)}</span>
                <span className="text-p-muted">{b.position}{b.retrograde ? " · Rx" : ""}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-p-muted">{t("horoscope.aspectsShaping", "Aspects shaping it")}</h3>
          {why.aspects.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-p-ink">
              {why.aspects.map((a, i) => (
                <li key={`${a.bodyA}-${a.bodyB}-${i}`}>
                  <span className="capitalize">{a.name}</span>:{" "}
                  <span className="font-medium">{tPlanet(a.bodyA)}</span> &amp;{" "}
                  <span className="font-medium">{tPlanet(a.bodyB)}</span>
                  {" "}({Math.round(a.orb * 10) / 10}&deg; orb)
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-p-muted">{t("common.noTightAspects", "No tight major aspects right now.")}</p>
          )}
        </div>
      </div>
      <div className="mt-6 border-t border-p-line pt-5">
        <PlanetPositions snapshot={result.snapshot} />
      </div>
    </details>
  );
}

function PlanetPositions({ snapshot }: { snapshot: PlanetarySnapshot }) {
  const { t, tPlanet } = useLocale();
  const planets = snapshot.positions.filter(
    (p) => p.key !== "northNode" && p.key !== "southNode" && p.key !== "moon",
  );
  const moon = snapshot.positions.find((p) => p.key === "moon");
  const nodes = snapshot.positions.filter((p) => p.key === "northNode" || p.key === "southNode");

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-p-muted">
        {t("horoscope.planetaryPositionsToday", "Planetary positions today")}
      </h3>
      <p className="mt-1 text-xs text-p-muted">
        {t("horoscope.planetaryPositionsDesc", "Calculated from real astronomical data. Sun, Moon and planets shown at their current zodiac degree.")}
      </p>
      <dl className="mt-4 divide-y divide-p-line text-sm">
        {moon && (
          <div className="flex items-center gap-3 py-2">
            <PlanetSymbol body="moon" size="md" className="text-gold-deep" decorative />
            <dt className="w-28 shrink-0 text-p-muted">{tPlanet("moon")}</dt>
            <dd className="font-medium text-p-ink">{moon.position}</dd>
          </div>
        )}
        {planets.map((p) => (
          <div key={p.key} className="flex items-center gap-3 py-2">
            <PlanetSymbol body={p.key} size="md" className="text-gold-deep" decorative />
            <dt className="w-28 shrink-0 text-p-muted">{tPlanet(p.key)}</dt>
            <dd className="font-medium text-p-ink">
              {p.position}
              {p.retrograde && <span className="ms-1 text-p-muted">(Rx)</span>}
            </dd>
          </div>
        ))}
        {nodes.length > 0 && (
          <div className="flex items-center gap-3 py-2">
            <dt className="w-28 shrink-0 text-p-muted">{t("planets.northNode", "Nodes")}</dt>
            <dd className="text-p-muted">{nodes.map((n) => `${n.position}`).join(" · ")}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

export function HoroscopeArticle({
  sign,
  periodType,
  date,
  result,
  crumbs,
}: HoroscopeArticleProps) {
  const { t, tSign, tElement, tModality, tHorizon } = useLocale();

  const label = periodLabel(periodType, date);
  const key = periodKey(periodType, date);
  const path = `/horoscope/${sign.slug}/${periodType === "daily" ? "today" : periodType}`;
  const canonical = absoluteUrl(path);
  const isDaily = periodType === "daily";

  const periodNoun = tHorizon(periodType);
  const signLocalizedName = tSign(sign.slug);

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

  const localizedCrumbs = crumbs.map((c) => ({
    ...c,
    label: c.label === "Horoscopes" ? t("nav.horoscopes", c.label) : c.label === sign.name ? signLocalizedName : c.label,
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
      />

      <Breadcrumbs items={localizedCrumbs} />

      <header className="mt-8 border-b border-line-soft pb-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center justify-center rounded-full border border-cosmic/25 bg-cosmic/15 p-5">
            <ZodiacSymbol sign={sign.slug} size="lg" className="text-gold" strokeWidth={1.8} label={signLocalizedName} />
          </div>
          <div>
            <p className="kicker">{periodNoun} {t("horoscope.kicker", "Horoscope")}</p>
            <h1 className="mt-2 font-display text-4xl text-starlight sm:text-5xl">
              {signLocalizedName}
            </h1>
            <p className="mt-2 font-serif-body text-lg italic text-muted">{label}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <PeriodTabs signSlug={sign.slug} active={periodType} />
          <ShareVibe
            data={{
              signName: signLocalizedName,
              periodLabel: label,
              hook: result.glance.overall,
              move: result.glance.bestMove ?? t("common.makeTodayEasy", "Make today a little easier on yourself."),
              areas: result.signals.areas,
              path,
            }}
          />
        </div>
      </header>

      <article className="mt-10">
        {isDaily && (
          <div className="space-y-5">
            <GlancePanel result={result} />
            <ThirtySeconds result={result} />
            <YourMove result={result} />
            <ChangesPanel result={result} />
            <StrongestThemes result={result} />
          </div>
        )}

        {!isDaily && (
          <div className="space-y-5">
            <PeriodSignals result={result} periodType={periodType} />
          </div>
        )}

        <div className="paper-panel mt-8 rounded-md">
          <div className="border-b border-p-line p-2 text-center">
            <p className="font-serif-body italic text-p-muted">
              {signLocalizedName} — {tModality(sign.modality)} · {tElement(sign.element)}
            </p>
          </div>
          <div className="p-7 sm:p-9">
            <p className="drop-cap font-serif-body text-xl leading-relaxed text-p-ink">
              {result.overview}
            </p>

            <div className="mt-9 space-y-8">
              {result.sections.map((section, i) => (
                <section key={i}>
                  <h2 className="kicker">{section.heading}</h2>
                  <div className="gold-rule mt-3 w-16" />
                  <p className="mt-4 font-serif-body text-[1.05rem] leading-8 text-p-ink">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>

            <section className="mt-10 border-s-2 border-gold-deep bg-white/[0.04] py-5 pe-5 ps-6 backdrop-blur-xl saturate-180">
              <h2 className="kicker">{t("horoscope.carryForward", "Carry this forward")}</h2>
              <p className="mt-3 font-serif-body text-lg italic leading-8 text-p-ink">
                &ldquo;{result.advice}&rdquo;
              </p>
            </section>

            <div className="mt-9">
              <WhyForecast result={result} />
            </div>
          </div>
        </div>

        <p className="mt-8 border-t border-line-soft pt-5 text-xs leading-5 text-subdued">
          {result.disclaimer}.{" "}
          <span className="text-muted">{t("horoscope.periodKeyNote", "Generated deterministically from current astronomical data; content may be refreshed automatically.")} ({key})</span>
        </p>
      </article>
    </div>
  );
}
