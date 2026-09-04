import Link from "next/link";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { BentoZodiacGrid } from "@/components/ui/bento-zodiac-grid";
import { HeroVisual } from "@/components/ui/hero-visual";
import { VitruvianHero } from "@/components/ui/vitruvian-hero";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { elementBorder, elementText } from "@/components/ui/element";
import { ElementIcon } from "@/components/ui/element-icon";
import { snapshotForToday } from "@/lib/astronomy/astro";
import { DailyOrbitBanner } from "@/components/ui/daily-orbit-banner";
import { LocaleText } from "@/components/ui/locale-text";
import { MoonSignCard } from "@/components/ui/moon-sign-card";
import { SkyEvents } from "@/components/sky/sky-events";
import { CelebrityBirthdays } from "@/components/ui/celebrity-birthdays";
import { CosmicTraits } from "@/components/ui/cosmic-traits";
import { SITE } from "@/lib/seo/site";
import { pageMetadata } from "@/lib/seo/metadata";

function todayDate(): string {
  return new Intl.DateTimeFormat("en", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

export const revalidate = 3600;

export const metadata = pageMetadata(
  "/",
  "Zunara — Written in the Stars",
  "Premium editorial astrology publication. Mathematically calculated daily, weekly, monthly and yearly horoscopes for all twelve zodiac signs, grounded in real astronomical data.",
);

export default function HomePage() {
  const date = todayDate();
  const snapshot = snapshotForToday();

  const sun = snapshot.positions.find((p) => p.key === "sun");
  const sunSign = sun ? ZODIAC_SIGNS.find((s) => s.slug === sun.sign) : undefined;

  const retro = snapshot.positions.filter(
    (p) => p.retrograde && p.key !== "northNode" && p.key !== "southNode",
  );

  const transit = snapshot.aspects[0];

  return (
    <div className="constellation-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Zunara",
            description:
              "Premium editorial astrology publication. Daily, weekly, monthly and yearly horoscopes for all twelve signs, calculated from real astronomical data.",
            url: SITE.url,
          }),
        }}
      />
      {/* ---- Masthead ---- */}
      <section className="relative overflow-hidden border-b border-line-soft">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(108,92,231,0.15)_0%,transparent_70%)]"
        />
        <HeroVisual />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 select-none"
        >
          <VitruvianHero className="opacity-[0.14]" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
          <p className="kicker">{date}</p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-5 w-20" />
          <div className="starfield mx-auto -mb-3 mt-8 h-16" aria-hidden="true" />
          <h1 className="mx-auto max-w-3xl font-display text-5xl font-medium leading-[1.05] text-starlight sm:text-7xl">
            <LocaleText path="home.heroTitle" fallback="Written in the stars." />
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-muted">
            <LocaleText path="home.heroSubtitle" fallback="A premium editorial astrology publication." />
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/horoscope"
              className="rounded-full bg-gold px-8 py-3 text-sm font-medium tracking-wide text-ink transition-opacity hover:opacity-90"
            >
              <LocaleText path="home.heroCtaPrimary" fallback="Read today's horoscope" />
            </Link>
            <Link
              href="/birthchart"
              className="rounded-full border border-gold/40 bg-gold/5 px-8 py-3 text-sm text-gold transition-colors hover:bg-gold/15"
            >
              <LocaleText path="nav.birthchart" fallback="Birth Chart" />
            </Link>
            <Link
              href="/astrology"
              className="rounded-full border border-line px-8 py-3 text-sm text-muted transition-colors hover:border-gold/40 hover:text-starlight"
            >
              <LocaleText path="home.heroCtaSecondary" fallback="The astronomy" />
            </Link>
          </div>
        </div>
      </section>

      <DailyOrbitBanner />

      {/* ---- The current sky (real data) ---- */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="lg:w-3/5">
            <p className="kicker"><LocaleText path="home.skyTonight" fallback="The sky, tonight" /></p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-starlight sm:text-4xl">
              <LocaleText path="home.sunPassesThrough" fallback="The Sun passes through" /> {sunSign ? <LocaleText path={`signs.${sunSign.slug}`} fallback={sunSign.name} /> : "the zodiac"}
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-muted">
              <LocaleText path="home.methodDesc" fallback="Every position below is computed from astronomical theory, not invented. Zunara renders the movements of the spheres into reading — each aspect and retrograde corresponds to the true state of the sky." />
            </p>
            {sunSign && (
              <div className="mt-6 flex flex-wrap gap-2">
                {sunSign.traits.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/[0.08] bg-cosmic/10 px-3 py-1 text-xs text-muted backdrop-blur-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-2/5">
            <div className="space-y-5">
              <MoonSignCard />
              <div className="paper-panel rounded-lg p-6">
                <p className="kicker"><LocaleText path="home.planetaryBulletin" fallback="Planetary bulletin" /></p>
                <dl className="mt-5 space-y-3">
                  {retro.length > 0 ? (
                    retro.map((p) => (
                      <div key={p.key} className="flex items-center gap-3">
                        <PlanetSymbol body={p.key} size="md" className="text-gold-deep" decorative />
                        <dd className="text-sm text-p-ink">
                          <span className="font-medium"><LocaleText path={`planets.${p.key}`} fallback={p.key} /></span>
                          <span className="text-p-muted"> <LocaleText path="home.retrogradeIn" fallback="retrograde in" /> <LocaleText path={`signs.${p.sign}`} fallback={p.sign} /></span>
                        </dd>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-3">
                      <PlanetSymbol body="sun" size="md" className="text-gold-deep" decorative />
                      <dd className="text-sm text-p-ink">
                        <span className="font-medium"><LocaleText path="home.noRetrogrades" fallback="No retrogrades" /></span>
                        <span className="text-p-muted"> — <LocaleText path="home.allPlanetsDirect" fallback="all planets direct today" /></span>
                      </dd>
                    </div>
                  )}
                  {transit && (
                    <div className="mt-3 flex items-start gap-3 border-t border-p-line pt-3">
                      <PlanetSymbol body={transit.bodyA} size="md" className="text-gold-deep" decorative />
                      <dd className="text-sm text-p-ink">
                        <span className="font-medium capitalize">
                          <LocaleText path={`aspects.${transit.name.toLowerCase()}`} fallback={transit.name} />
                        </span>
                        <span className="text-p-muted">
                          {" "}— <LocaleText path={`planets.${transit.bodyA}`} fallback={transit.bodyA} /> &amp;{" "}
                          <LocaleText path={`planets.${transit.bodyB}`} fallback={transit.bodyB} />
                          {", " + transit.orb.toFixed(1) + "° "}
                          <LocaleText path="aspects.orb" fallback="orb" />
                        </span>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- The twelve signs ---- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" aria-labelledby="signs-heading">
        <div className="flex items-end justify-between border-b border-line-soft pb-5">
          <div>
            <p className="kicker"><LocaleText path="home.anIndexOfHeavens" fallback="The twelve signs" /></p>
            <h2 id="signs-heading" className="mt-3 font-display text-3xl text-starlight">
              <LocaleText path="home.anIndexOfHeavens" fallback="An index of the heavens" />
            </h2>
          </div>
          <Link
            href="/horoscope"
            className="hidden text-sm text-muted transition-colors hover:text-gold sm:block"
          >
            <LocaleText path="home.allHoroscopesLink" fallback="All horoscopes →" />
          </Link>
        </div>
        <div className="mt-8">
          <BentoZodiacGrid />
        </div>
      </section>

      {/* ---- Upcoming sky events ---- */}
      <SkyEvents />

      {/* ---- Born under today's stars ---- */}
      <CelebrityBirthdays />

      {/* ---- Cosmic traits & career directions ---- */}
      <CosmicTraits />

      {/* ---- Horizons ---- */}
      <section className="border-y border-white/[0.08] bg-white/[0.02] backdrop-blur-xl saturate-180">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div>
              <p className="kicker"><LocaleText path="home.horizonsKicker" fallback="Four horizons" /></p>
              <h2 className="mt-3 font-display text-3xl text-starlight">
                <LocaleText path="home.horizonsTitle" fallback="Beginnings to whole years" />
              </h2>
              <p className="mt-4 leading-7 text-muted">
                <LocaleText path="home.horizonsDesc" fallback="Start with the day, then travel outward — the week, the month, the year. Each horizon draws on the same truthful positions of the Sun, Moon and the planets." />
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { labelKey: "horizons.daily", href: "/horoscope/aries/today", descKey: "horizons.dailyDesc", n: "I" },
                { labelKey: "horizons.weekly", href: "/horoscope/aries/weekly", descKey: "horizons.weeklyDesc", n: "II" },
                { labelKey: "horizons.monthly", href: "/horoscope/aries/monthly", descKey: "horizons.monthlyDesc", n: "III" },
                { labelKey: "horizons.yearly", href: "/horoscope/aries/yearly", descKey: "horizons.yearlyDesc", n: "IV" },
              ].map((c) => (
                <Link
                  key={c.labelKey}
                  href={c.href}
                  className="group relative flex flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl saturate-180 transition-colors hover:border-gold/40 hover:bg-white/[0.06]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-display text-4xl italic text-subdued transition-colors group-hover:text-gold/80">
                      {c.n}
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-gold opacity-0 transition-opacity group-hover:opacity-100">
                      &rarr;
                    </span>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-starlight"><LocaleText path={c.labelKey} /></p>
                    <p className="mt-1 text-sm text-subdued"><LocaleText path={c.descKey} /></p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Method / editorial note ---- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="kicker"><LocaleText path="home.methodKicker" fallback="Our method" /></p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-starlight">
              <LocaleText path="home.methodTitle" fallback="Real astronomy, editorial writing" />
            </h2>
            <p className="mt-5 font-serif-body text-lg leading-8 text-starlight/85">
              <LocaleText path="home.methodDesc" fallback="At Zunara, every planetary position you read is calculated from astronomical theory, never guessed. Our forecasts blend that data with carefully crafted editorial fragments — so the sky speaks with clarity, warmth and honesty." />
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-sm text-gold underline-offset-4 hover:underline"
            >
              <LocaleText path="home.readAboutMethod" fallback="Read about our method →" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(["Fire", "Earth", "Air", "Water"] as const).map((element) => {
              const signs = ZODIAC_SIGNS.filter((s) => s.element === element);
              return (
                <div
                  key={element}
                  className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl saturate-180 transition-colors ${elementBorder(element)}`}
                >
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${elementText(element)} opacity-15 to-transparent blur-2xl`}
                  />
                  <div className="relative flex items-center justify-between">
                    <h3 className={`flex items-center gap-2 font-display text-2xl ${elementText(element)}`}>
                      <ElementIcon element={element} size={22} className={elementText(element)} />
                      <LocaleText path={`elements.${element}`} fallback={element} />
                    </h3>
                    <span aria-hidden="true" className={`text-xl ${elementText(element)} opacity-60`}>
                      <ElementIcon element={element} size={18} className={elementText(element)} />
                    </span>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {signs.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/horoscope/${s.slug}/today`}
                          className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-gold"
                        >
                          <ZodiacSymbol sign={s.slug} size="sm" className={elementText(s.element)} label={s.name} />
                          <span><LocaleText path={`signs.${s.slug}`} fallback={s.name} /></span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
