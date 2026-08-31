import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getZodiacSign, formatDateRange } from "@/lib/zodiac/zodiac";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PeriodTabs } from "@/components/ui/period-tabs";
import { signIndexMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site";

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

  const scriptData = {
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

  const periods = [
    { type: "today" as const, label: "Daily horoscope" },
    { type: "weekly" as const, label: "Weekly horoscope" },
    { type: "monthly" as const, label: "Monthly horoscope" },
    { type: "yearly" as const, label: "Yearly horoscope" },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", "@id": canonical, name: `${signData.name} zodiac sign`, inLanguage: "en" }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(scriptData) }} />

      <div className="mt-6">
        <Breadcrumbs
          items={[
            { label: "Horoscopes", href: "/horoscope" },
            { label: signData.name, href: `/horoscope/${sign}` },
          ]}
        />
      </div>

      <header className="mt-8">
        <div className="flex items-center gap-4">
          <ZodiacSymbol sign={signData.name} size="xl" className="text-gold" label={signData.name} />
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-subdued">
              {signData.element} \u00b7 {signData.modality}
            </p>
            <h1 className="font-display text-4xl text-starlight">{signData.name} Horoscope</h1>
            <p className="mt-1 text-sm text-muted">{formatDateRange(signData)}</p>
          </div>
        </div>
      </header>

      <div className="mt-6">
        <PeriodTabs signSlug={sign} active="daily" />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-starlight">About {signData.name}</h2>
        <p className="mt-4 leading-7 text-starlight/90">{signData.description}</p>
      </section>

      <section className="mt-8">
        <h3 className="text-xs uppercase tracking-[0.18em] text-gold">Element &amp; ruler</h3>
        <p className="mt-2 text-starlight/90">
          {signData.name} is a {signData.modality.toLowerCase()} {signData.element.toLowerCase()} sign,
          traditionally ruled by {signData.ruler}.
          {signData.modernRuler ? ` Modern astrology also associates it with ${signData.modernRuler}.` : ""}
        </p>
      </section>

      <section className="mt-8">
        <h3 className="text-xs uppercase tracking-[0.18em] text-gold">Traits</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {signData.traits.map((trait) => (
            <li key={trait} className="rounded-full border border-line bg-obsidian px-3 py-1 text-sm text-muted">
              {trait}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-label={`${signData.name} forecasts`}>
        <h2 className="font-display text-2xl text-starlight">Forecasts</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {periods.map((p) => (
            <Link
              key={p.type}
              href={`/horoscope/${sign}/${p.type}`}
              className="rounded-lg border border-line bg-obsidian p-5 transition-colors hover:border-gold/40 hover:bg-obsidian-2"
            >
              <span className="text-sm text-gold">{p.label}</span>
              <p className="mt-1 text-xs text-subdued">Read now \u2192</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
