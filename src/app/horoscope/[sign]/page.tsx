import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getZodiacSign, formatDateRange } from "@/lib/zodiac/zodiac";
import { getHoroscopeContent } from "@/lib/horoscope/read";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PeriodTabs } from "@/components/ui/period-tabs";
import { ThemeSymbol, type ThemeKey } from "@/components/ui/theme-symbol";
import { Reveal } from "@/components/ui/reveal";
import { signIndexMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site";
import { elementText } from "@/components/ui/element";
import { ElementIcon } from "@/components/ui/element-icon";
import type { LifeArea } from "@/lib/astrology/signals";
import { LocaleText } from "@/components/ui/locale-text";
import { LocalizedChange } from "@/components/ui/localized-change";

const AREA_THEME: Record<LifeArea, ThemeKey> = {
  love: "love",
  work: "work",
  money: "money",
  energy: "energy",
};

export const revalidate = 86400;

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ sign: string }> }): Promise<Metadata> {
  const { sign } = await params;
  const signData = getZodiacSign(sign);
  if (!signData) return {};
  return signIndexMetadata(signData);
}

export default async function SignOverviewPage({ params }: { params: Promise<{ sign: string }> }) {
  const { sign } = await params;
  const signData = getZodiacSign(sign);
  if (!signData) notFound();

  const canonical = absoluteUrl(`/horoscope/${sign}`);

  const periods = [
    { type: "today", labelKey: "horizons.daily", descKey: "horizons.dailyDesc" },
    { type: "weekly", labelKey: "horizons.weekly", descKey: "horizons.weeklyDesc" },
    { type: "monthly", labelKey: "horizons.monthly", descKey: "horizons.monthlyDesc" },
    { type: "yearly", labelKey: "horizons.yearly", descKey: "horizons.yearlyDesc" },
  ] as const;

  const listScript = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${signData.name} horoscopes`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Daily", url: absoluteUrl(`/horoscope/${sign}/today`) },
      { "@type": "ListItem", position: 2, name: "Weekly", url: absoluteUrl(`/horoscope/${sign}/weekly`) },
      { "@type": "ListItem", position: 3, name: "Monthly", url: absoluteUrl(`/horoscope/${sign}/monthly`) },
      { "@type": "ListItem", position: 4, name: "Yearly", url: absoluteUrl(`/horoscope/${sign}/yearly`) },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", "@id": canonical, name: `${signData.name} zodiac sign`, inLanguage: "en" }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listScript) }} />

      <div className="mt-6">
        <Breadcrumbs
          items={[
            { label: "Horoscopes", href: "/horoscope" },
            { label: signData.name, href: `/horoscope/${sign}` },
          ]}
        />
      </div>

      <header className="mt-8 flex flex-col gap-4 border-b border-line-soft pb-6 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center justify-center rounded-full border border-cosmic/25 bg-cosmic/15 p-5">
          <span className="font-display text-3xl text-gold" aria-hidden="true">
            {signData.glyph}
          </span>
          <span className="sr-only">{signData.name}</span>
        </div>
        <div>
          <h1 className="font-display text-4xl text-starlight sm:text-5xl">
            <LocaleText path={`signs.${signData.slug}`} fallback={signData.name} />
          </h1>
          <p className="mt-1 text-muted">{formatDateRange(signData)}</p>
        </div>
      </header>

      <div className="mt-8">
        <PeriodTabs signSlug={sign} active="daily" />
      </div>

      <div className="mt-10">
        <CurrentTheme signSlug={sign} />
        <Recently signSlug={sign} />
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          <h2 className="font-display text-2xl text-starlight">
            <LocaleText path="horoscope.aboutSign" fallback="About" /> <LocaleText path={`signs.${signData.slug}`} fallback={signData.name} />
          </h2>
          <p className="drop-cap mt-4 font-serif-body text-lg leading-8 text-starlight/90">
            {signData.description}
          </p>

          <blockquote
            className={`mt-8 border-s-2 ps-5 italic text-muted ${elementText(signData.element)}`}
          >
            &ldquo;{signData.keywords.join(" — ")}.&rdquo;
          </blockquote>
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl saturate-180">
            <h3 className="kicker"><LocaleText path="common.traits" fallback="Traits" /></h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {signData.traits.map((trait) => (
                <li
                  key={trait}
                  className="rounded-full border border-white/[0.08] bg-cosmic/10 px-3 py-1 text-xs text-muted backdrop-blur-sm"
                >
                  {trait}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl saturate-180">
            <h3 className="kicker"><LocaleText path="horoscope.signature" fallback="Signature" /></h3>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-subdued"><LocaleText path="horoscope.element" fallback="Element" /></dt>
                <dd className={`font-medium ${elementText(signData.element)}`}>
                  <LocaleText path={`elements.${signData.element}`} fallback={signData.element} />{" "}
                  <ElementIcon element={signData.element} size={16} className={`inline ${elementText(signData.element)}`} />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-subdued"><LocaleText path="horoscope.modality" fallback="Modality" /></dt>
                <dd className="text-starlight"><LocaleText path={`modalities.${signData.modality}`} fallback={signData.modality} /></dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-subdued"><LocaleText path="horoscope.ruler" fallback="Ruler" /></dt>
                <dd className="text-starlight">
                  <LocaleText path={`planets.${signData.ruler.toLowerCase()}`} fallback={signData.ruler} />
                  {signData.modernRuler ? ` / ${signData.modernRuler}` : ""}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>

      <section className="mt-14" aria-label={`${signData.name} forecasts`}>
        <div className="flex items-end justify-between border-b border-line-soft pb-4">
          <div>
            <p className="kicker"><LocaleText path="horoscope.forecast" fallback="Forecasts" /></p>
            <h2 className="mt-2 font-display text-2xl text-starlight">
              <LocaleText path="horoscope.chooseHorizon" fallback="Choose a horizon" />
            </h2>
          </div>
        </div>
        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {periods.map((p, i) => (
            <Link
              key={p.type}
              href={`/horoscope/${sign}/${p.type}`}
              className="group flex flex-col justify-between gap-8 bg-white/[0.04] p-6 backdrop-blur-xl transition-colors hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl text-gold/50">
                  {["I", "II", "III", "IV"][i]}
                </span>
                <span className="text-gold opacity-0 transition-opacity group-hover:opacity-100">→</span>
              </div>
              <div>
                <p className="font-display text-xl text-starlight">
                  <LocaleText path={p.labelKey} /> <LocaleText path="horoscope.kicker" fallback="horoscope" />
                </p>
                <p className="mt-1 text-sm text-subdued">
                  <LocaleText path={p.descKey} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}

function Today() {
  return new Date();
}

function CurrentTheme({ signSlug }: { signSlug: string }) {
  const result = getHoroscopeContent(signSlug, "daily", Today());
  if (!result) return null;
  const strongest = result.signals?.areas?.find((a) => a.present);
  return (
    <Reveal delay={1}>
      <section aria-labelledby="current-theme-heading" className="rounded-lg border border-white/[0.08] bg-white/[0.05] p-7 backdrop-blur-xl saturate-180">
        <div className="flex items-center gap-2 text-gold">
          <span aria-hidden className="text-gold">&#10022;</span>
          <p className="kicker"><LocaleText path="horoscope.yourCurrentTheme" fallback="Your current theme" /></p>
        </div>
        <p className="mt-4 font-serif-body text-2xl italic leading-9 text-starlight">
          &ldquo;{result.glance.overall}&rdquo;
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {strongest && (
            <span className="inline-flex items-center gap-2 text-muted">
              <ThemeSymbol theme={AREA_THEME[strongest.area]} size="sm" className="text-gold" />
              <LocaleText path="areas.strongest" fallback="Strongest in" />{" "}
              <span className="capitalize text-starlight"><LocaleText path={`areas.${strongest.area}`} fallback={strongest.area} /></span>
            </span>
          )}
          <Link
            href={`/horoscope/${signSlug}/today`}
            className="inline-flex items-center gap-1.5 text-gold underline-offset-4 hover:underline"
          >
            <LocaleText path="common.readToday" fallback="Read today's forecast" /> &rarr;
          </Link>
        </div>
      </section>
    </Reveal>
  );
}

function Recently({ signSlug }: { signSlug: string }) {
  const result = getHoroscopeContent(signSlug, "daily", Today());
  if (!result) return null;
  const changes = result.changes ?? [];
  return (
    <Reveal delay={2}>
      <section aria-labelledby="recently-heading" className="mt-6 rounded-lg border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-xl saturate-180">
        <p className="kicker"><LocaleText path="horoscope.whatChangedLately" fallback="What changed lately" /></p>
        {changes.length === 0 ? (
          <p className="mt-3 font-serif-body text-base leading-7 text-muted">
            <LocaleText path="horoscope.steadySky" fallback="The sky is relatively steady at the moment — no major transition is changing the overall tone. Small shifts matter more than any grand move." />
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {changes.slice(0, 3).map((c) => (
              <li key={c.id} className="border-s-2 border-gold-deep bg-white/[0.03] py-2 pe-3 ps-4">
                <LocalizedChange change={c} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </Reveal>
  );
}
