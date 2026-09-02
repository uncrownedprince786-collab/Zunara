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
import { elementRune, elementText } from "@/components/ui/element";
import type { LifeArea } from "@/lib/astrology/signals";

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
    { type: "today", label: "Daily", blurb: "A single day in focus" },
    { type: "weekly", label: "Weekly", blurb: "The week ahead" },
    { type: "monthly", label: "Monthly", blurb: "A longer arc" },
    { type: "yearly", label: "Yearly", blurb: "The whole year" },
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
        <div className="flex shrink-0 items-center justify-center rounded-full border border-line bg-ink-2 p-5">
          <span className="font-display text-3xl text-gold" aria-hidden="true">
            {signData.glyph}
          </span>
          <span className="sr-only">{signData.name}</span>
        </div>
        <div>
          <h1 className="font-display text-4xl text-starlight sm:text-5xl">{signData.name}</h1>
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
          <h2 className="font-display text-2xl text-starlight">About {signData.name}</h2>
          <p className="drop-cap mt-4 font-serif-body text-lg leading-8 text-starlight/90">
            {signData.description}
          </p>

          <blockquote
            className={`mt-8 border-l-2 pl-5 italic text-muted ${elementText(signData.element)}`}
          >
            &ldquo;{signData.keywords.join(" — ")}.&rdquo;
          </blockquote>
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg border border-line bg-ink-2 p-5">
            <h3 className="kicker">Traits</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {signData.traits.map((trait) => (
                <li
                  key={trait}
                  className="rounded-full border border-line bg-ink-3 px-3 py-1 text-xs text-muted"
                >
                  {trait}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-line bg-ink-2 p-5">
            <h3 className="kicker">Signature</h3>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-subdued">Element</dt>
                <dd className={`font-medium ${elementText(signData.element)}`}>
                  {signData.element} <span aria-hidden="true">{elementRune(signData.element)}</span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-subdued">Modality</dt>
                <dd className="text-starlight">{signData.modality}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-subdued">Ruler</dt>
                <dd className="text-starlight">
                  {signData.ruler}
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
            <p className="kicker">Forecasts</p>
            <h2 className="mt-2 font-display text-2xl text-starlight">Choose a horizon</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {periods.map((p, i) => (
            <Link
              key={p.type}
              href={`/horoscope/${sign}/${p.type}`}
              className="group flex flex-col justify-between gap-8 bg-ink-2 p-6 transition-colors hover:bg-ink-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl text-gold/30">
                  {["I", "II", "III", "IV"][i]}
                </span>
                <span className="text-gold opacity-0 transition-opacity group-hover:opacity-100">→</span>
              </div>
              <div>
                <p className="font-display text-xl text-starlight">{p.label} horoscope</p>
                <p className="mt-1 text-sm text-subdued">{p.blurb}</p>
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
      <section aria-labelledby="current-theme-heading" className="rounded-lg border border-line bg-ink-2/70 p-7">
        <div className="flex items-center gap-2 text-gold">
          <span aria-hidden className="text-gold">&#10022;</span>
          <p className="kicker">Your current theme</p>
        </div>
        <p className="mt-4 font-serif-body text-2xl italic leading-9 text-starlight">
          &ldquo;{result.glance.overall}&rdquo;
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {strongest && (
            <span className="inline-flex items-center gap-2 text-muted">
              <ThemeSymbol theme={AREA_THEME[strongest.area]} size="sm" className="text-gold" />
              Strongest in{" "}
              <span className="capitalize text-starlight">{strongest.area}</span>
            </span>
          )}
          <Link
            href={`/horoscope/${signSlug}/today`}
            className="inline-flex items-center gap-1.5 text-gold underline-offset-4 hover:underline"
          >
            Read today&rsquo;s forecast &rarr;
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
      <section aria-labelledby="recently-heading" className="mt-6 rounded-lg border border-line-soft bg-ink p-6">
        <p className="kicker">What changed lately</p>
        {changes.length === 0 ? (
          <p className="mt-3 font-serif-body text-base leading-7 text-muted">
            The sky is relatively steady at the moment — no major transition is changing the
            overall tone. Small shifts matter more than any grand move.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {changes.slice(0, 3).map((c) => (
              <li key={c.id} className="border-l-2 border-gold-deep bg-ink-2/50 py-2 pl-4 pr-3">
                <p className="font-medium text-starlight">{c.title}</p>
                <p className="mt-0.5 text-sm leading-6 text-muted">{c.blurb}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Reveal>
  );
}
