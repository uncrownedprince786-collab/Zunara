import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { pageMetadata, alternateLanguages } from "@/lib/seo/metadata";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { AstroTerm } from "@/components/ui/astro-tooltip";
import { LocaleText } from "@/components/ui/locale-text";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import {
  PLANET_SLUGS,
  getPlanet,
  type PlanetSlug,
  type SignSlug,
} from "@/lib/planets/planet-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return PLANET_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const planet = getPlanet(slug);
  if (!planet) return {};
  const path = `/planets/${slug}`;
  const title = `${planet.name} in Astrology — Meaning, Signs & Houses`;
  const description = `What the ${planet.name} means in your birth chart: its nature, the house it keys to, its zodiac-sign expressions and mythology — in plain English.`;
  return {
    ...pageMetadata(path, title, description, "article", planet.content.keywords),
    alternates: { canonical: absoluteUrl(path), languages: alternateLanguages(path) },
  };
}

export default async function PlanetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const planet = getPlanet(slug);
  if (!planet) notFound();

  const { content } = planet;
  const name = planet.name;
  const idx = PLANET_SLUGS.indexOf(slug as PlanetSlug);
  const next = getPlanet(PLANET_SLUGS[(idx + 1) % PLANET_SLUGS.length])!;
  const prev = getPlanet(PLANET_SLUGS[(idx - 1 + PLANET_SLUGS.length) % PLANET_SLUGS.length])!;
  const lower = name.toLowerCase();

  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs
            items={[
              { label: "Library", href: "/library" },
              { label: "Planets", href: "/library/planets" },
              { label: name, href: `/planets/${slug}` },
            ]}
          />
        </div>

        <header className="mx-auto mt-10 max-w-2xl text-center">
          <p className="kicker">
            The <LocaleText path={`planets.${slug}`} fallback={name} /> in your chart
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <PlanetSymbol
              body={slug as PlanetSlug}
              size="lg"
              className="text-gold"
              decorative
            />
            <h1 className="font-display text-4xl text-starlight sm:text-6xl">
              <LocaleText path={`planets.${slug}`} fallback={name} />
            </h1>
          </div>
          <p className="mt-2 text-sm uppercase tracking-[0.18em] text-subdued">
            {planet.glyph} · the {lower}
          </p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-7 w-20" />
          <p className="mt-7 text-lg leading-8 text-muted">{content.nature}</p>
        </header>

        <section className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <p className="kicker">What {name} means</p>
              <h2 className="mt-2 font-display text-2xl text-starlight">
                The role of {lower} in your chart
              </h2>
              <p className="mt-4 leading-8 text-muted">
                {lower.charAt(0).toUpperCase() + lower.slice(1)} is one of the ten bodies
                Zunara calculates for every reading. None of it is fortune-telling — the
                planets are real objects in real positions, and astrology is the reflective
                language we use to make sense of what those positions point toward. The{" "}
                {lower} simply gives one layer of that language its name.
              </p>
              <p className="mt-4 leading-8 text-muted">
                {content.house} Whatever sign and house it occupies in your own chart, its
                meaning always works the same way: it shows a style, not a sentence about
                your future.
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <p className="kicker">Mythology</p>
              <h2 className="mt-2 font-display text-2xl text-starlight">
                The story behind the {lower}
              </h2>
              <p className="mt-4 leading-8 text-muted">{content.mythologyNote}</p>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <p className="kicker">Signature</p>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-subdued">Elemental affinity</dt>
                  <dd className="mt-1 leading-6 text-starlight">{content.elementalAffinity}</dd>
                </div>
                <div>
                  <dt className="text-subdued">Key house</dt>
                  <dd className="mt-1 leading-6 text-muted">{content.house}</dd>
                </div>
                <div>
                  <dt className="text-subdued">Colours</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {content.colours.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs capitalize text-muted"
                      >
                        {c}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <p className="kicker">Terms</p>
              <p className="mt-3 text-sm leading-6 text-muted">
                {content.glossary.map((term, i) => (
                  <span key={term} className="inline">
                    {i > 0 && <> · </>}
                    <AstroTerm term={term} />
                  </span>
                ))}
              </p>
            </section>
          </aside>
        </section>

        <section className="mt-16">
          <p className="kicker text-center">Where it acts</p>
          <h2 className="mt-3 text-center font-display text-2xl text-starlight">
            {name} through the houses
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center leading-8 text-muted">
            A planet finds its home in one of the twelve houses. Each house is an arena of
            life, and the {lower} colours whichever arena it occupies. Its traditional key
            house carries the strongest signature:
          </p>
          <blockquote className="mx-auto mt-8 max-w-2xl rounded-2xl border border-gold/20 bg-gold/5 p-7 text-center font-serif-body text-lg italic leading-8 text-starlight backdrop-blur-xl">
            &ldquo;{content.house}&rdquo;
          </blockquote>
        </section>

        <section className="mt-16">
          <p className="kicker text-center">In the signs</p>
          <h2 className="mt-3 text-center font-display text-2xl text-starlight">
            {name} in the twelve signs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center leading-8 text-muted">
            The sign the {lower} occupies shapes how its energy expresses. In your birth
            chart this is the sign it held at your exact moment of birth — tap a sign to see
            its daily reading.
          </p>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {ZODIAC_SIGNS.map((sign) => (
              <li key={sign.slug}>
                <Link
                  href={`/horoscope/${sign.slug}/today`}
                  className="group flex h-full flex-col gap-3 bg-white/[0.03] p-5 backdrop-blur-xl transition-colors hover:bg-white/[0.06]"
                >
                  <div className="flex items-center justify-between">
                    <ZodiacSymbol sign={sign.slug} size="md" label={sign.name} />
                    <span className="text-gold opacity-0 transition-opacity group-hover:opacity-100">
                      &rarr;
                    </span>
                  </div>
                  <h3 className="font-display text-lg text-starlight">{sign.name}</h3>
                  <p className="text-sm leading-6 text-muted">
                    {content.inSignMeaning[sign.slug as SignSlug]}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <p className="kicker text-center">Keep reading</p>
          <h2 className="mt-3 text-center font-display text-2xl text-starlight">
            Where to go next
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                href: "/library/planets",
                title: "All the planets",
                summary:
                  "The ten bodies plus the lunar nodes — every glyph, meaning and how it behaves in a chart.",
              },
              {
                href: "/sky-now",
                title: "The sky right now",
                summary:
                  "Where the Sun, Moon and planets actually sit today, computed from live astronomical data.",
              },
              {
                href: "/birthchart",
                title: "Your birth chart",
                summary:
                  "Get your own planetary placements, houses and aspects from your exact birth details.",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl transition-colors hover:border-gold/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl text-starlight">{card.title}</h3>
                  <span className="text-gold opacity-0 transition-opacity group-hover:opacity-100">
                    &rarr;
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{card.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <nav
          aria-label="Related planets"
          className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <Link
            href={`/planets/${prev.slug}`}
            className="group flex items-center gap-3 text-muted transition-colors hover:text-gold"
          >
            <PlanetSymbol body={prev.slug} size="sm" className="text-gold" decorative />
            <span className="text-xs uppercase tracking-[0.14em] text-subdued group-hover:text-gold">
              Back: {prev.name}
            </span>
          </Link>
          <Link
            href={`/planets/${next.slug}`}
            className="group flex items-center gap-3 text-right text-muted transition-colors hover:text-gold"
          >
            <span className="text-xs uppercase tracking-[0.14em] text-subdued group-hover:text-gold">
              Next: {next.name}
            </span>
            <PlanetSymbol body={next.slug} size="sm" className="text-gold" decorative />
          </Link>
        </nav>
      </div>
    </div>
  );
}