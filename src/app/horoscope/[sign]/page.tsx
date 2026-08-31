import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getZodiacSign } from "@/lib/zodiac/zodiac";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PeriodTabs } from "@/components/ui/period-tabs";
import { signIndexMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site";
import { elementRune, elementText } from "@/components/ui/element";

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

      <div className="mt-8">
        <PeriodTabs signSlug={sign} active="daily" />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          <h2 className="font-display text-2xl text-starlight">About {signData.name}</h2>
          <p className="drop-cap mt-4 font-serif-body text-lg leading-8 text-starlight/90">
            {signData.description}
          </p>

          <blockquote
            className={`mt-8 border-l-2 pl-5 italic text-muted ${elementText(signData.element)}`}
          >
            &ldquo;{signData.keywords.join(" \u2014 ")}.&rdquo;
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
                <span className="text-gold opacity-0 transition-opacity group-hover:opacity-100">\u2192</span>
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
