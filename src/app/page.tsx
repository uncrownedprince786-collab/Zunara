import Link from "next/link";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
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
import { JsonLd } from "@/components/ui/json-ld";
import { QuickBirthInput } from "@/components/home/quick-birth-input";
import {
  SkyMapClient,
  DailyTransitClient,
  BentoZodiacGrid,
  SkyEvents,
  CosmicTraits,
} from "@/components/home/home-heavy-sections";
import { TodaysStars } from "@/components/home/todays-stars";
import { celebritiesForDate } from "@/lib/content/celebrities";
import { pageMetadata } from "@/lib/seo/metadata";
import { websiteJsonLd } from "@/lib/seo/jsonld";
import { plainRetro, plainAspect } from "@/lib/content/sky-plain";

function todayDate(): string {
  return new Intl.DateTimeFormat("en", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function todayMonthDay(): { month: number; day: number } {
  const now = new Date();
  return { month: now.getUTCMonth() + 1, day: now.getUTCDate() };
}

function todayKey(): string {
  const { month, day } = todayMonthDay();
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export const revalidate = 3600;

export const metadata = pageMetadata(
  "/",
  "Zunara — Precision Astrology, Birth Charts & Daily Horoscopes",
  "Zunara is a precision astronomical engine and personalized birthday guide: exact birth-chart calculations, mathematically derived daily horoscopes for all twelve signs, live sky maps, and the famous people who share your birthday.",
  "website",
  [
    "birth chart calculator",
    "daily horoscope",
    "zodiac signs",
    "free natal chart",
    "celebrity birthdays",
    "astronomy astrology",
  ],
);

export default function HomePage() {
  const date = todayDate();
  const snapshot = snapshotForToday();

  const { month, day } = todayMonthDay();
  const people = celebritiesForDate(month, day);

  const sun = snapshot.positions.find((p) => p.key === "sun");
  const sunSign = sun ? ZODIAC_SIGNS.find((s) => s.slug === sun.sign) : undefined;

  const retro = snapshot.positions.filter(
    (p) => p.retrograde && p.key !== "northNode" && p.key !== "southNode",
  );

  const transit = snapshot.aspects[0];

  return (
    <div className="constellation-bg">
      <JsonLd data={websiteJsonLd()} />

      {/* ---- Masthead: hook, quick birthday lookup, exactly two CTAs ---- */}
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
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-medium leading-[1.05] text-starlight sm:text-6xl">
            <LocaleText
              path="home.heroTitle"
              fallback="Precision astronomical engine &amp; personalized birthday insights"
            />
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted">
            <LocaleText
              path="home.heroSubtitle"
              fallback="Real planetary mathematics, not guesses. Calculate your exact birth chart, read mathematically derived horoscopes for all twelve signs, and discover the famous people who share your birthday."
            />
          </p>

          <QuickBirthInput />

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/birthchart"
              className="rounded-full bg-gold px-9 py-3.5 text-sm font-medium tracking-wide text-ink transition-opacity hover:opacity-90"
            >
              <LocaleText path="home.heroCtaPrimary" fallback="Calculate Birth Chart" />
            </Link>
            <Link
              href={`/birthday/${todayKey()}`}
              className="rounded-full border border-gold/40 bg-gold/5 px-9 py-3.5 text-sm font-medium text-gold transition-colors hover:bg-gold/15"
            >
              <LocaleText path="home.heroCtaSecondary" fallback="Discover Birthday Facts" />
            </Link>
          </div>
        </div>
      </section>

      <DailyOrbitBanner />

      {/* ---- Live Sky & Planets: the true, current sky ---- */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">
            <div className="lg:w-3/5">
              <p className="kicker"><LocaleText path="home.skyTonight" fallback="The sky, tonight" /></p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-starlight sm:text-4xl">
                <LocaleText path="home.sunPassesThrough" fallback="The Sun passes through" /> {sunSign ? <LocaleText path={`signs.${sunSign.slug}`} fallback={sunSign.name} /> : "the zodiac"}
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-muted">
                <LocaleText path="home.liveSkyDesc" fallback="Every position below is computed from astronomical theory, not invented. Zunara renders the movements of the spheres into reading — each aspect and retrograde corresponds to the true state of the sky." />
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
              <div className="flex h-full flex-col justify-center">
                <MoonSignCard />
              </div>
            </div>
          </div>

          <div className="paper-panel rounded-lg p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="kicker"><LocaleText path="home.planetaryBulletin" fallback="Planetary bulletin" /></p>
              <p className="max-w-md text-xs leading-5 text-subdued">
                In plain words: “retrograde” is an illusion — the planet only appears to move
                backwards from Earth; it is a signal to slow down and review.
              </p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {retro.length > 0 ? (
                retro.map((p) => (
                  <div key={p.key} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <div className="flex items-center gap-3">
                      <PlanetSymbol body={p.key} size="md" className="text-gold-deep" decorative />
                      <p className="text-sm text-p-ink">
                        <span className="font-medium"><LocaleText path={`planets.${p.key}`} fallback={p.key} /></span>
                        <span className="text-p-muted"> <LocaleText path="home.retrogradeIn" fallback="retrograde in" /> <LocaleText path={`signs.${p.sign}`} fallback={p.sign} /> <span className="font-medium text-gold-deep">℞</span></span>
                      </p>
                    </div>
                    <p className="mt-2 border-l-2 border-gold/30 pl-2 text-xs leading-5 text-subdued">
                      In plain words: {plainRetro(p.key, p.sign)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <PlanetSymbol body="sun" size="md" className="text-gold-deep" decorative />
                    <p className="text-sm text-p-ink">
                      <span className="font-medium"><LocaleText path="home.noRetrogrades" fallback="No retrogrades" /></span>
                      <span className="text-p-muted"> — <LocaleText path="home.allPlanetsDirect" fallback="all planets direct today" /></span>
                    </p>
                  </div>
                  <p className="mt-2 border-l-2 border-gold/30 pl-2 text-xs leading-5 text-subdued">
                    In plain words: no planets are backtracking right now — momentum is on your side.
                  </p>
                </div>
              )}
              {transit && (
                <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
                  <div className="flex items-center gap-3">
                    <PlanetSymbol body={transit.bodyA} size="md" className="text-gold-deep" decorative />
                    <p className="text-sm text-p-ink">
                      <span className="font-medium capitalize">
                        <LocaleText path={`aspects.${transit.name.toLowerCase()}`} fallback={transit.name} />
                      </span>
                      <span className="text-p-muted">
                        {" "}— <LocaleText path={`planets.${transit.bodyA}`} fallback={transit.bodyA} /> &amp;{" "}
                        <LocaleText path={`planets.${transit.bodyB}`} fallback={transit.bodyB} />
                        {", " + transit.orb.toFixed(1) + "° "}
                        <LocaleText path="aspects.orb" fallback="orb" />
                      </span>
                    </p>
                  </div>
                  <p className="mt-2 border-l-2 border-gold/30 pl-2 text-xs leading-5 text-subdued">
                    In plain words: {plainAspect(transit.name, transit.bodyA, transit.bodyB, transit.orb)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Night sky map, live ---- */}
      <section className="border-y border-white/[0.08] bg-white/[0.02] backdrop-blur-xl saturate-180">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="kicker"><LocaleText path="home.skyMapKicker" fallback="Live from your corner of the planet" /></p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-starlight sm:text-4xl">
            <LocaleText path="home.skyMapTitle" fallback="See the sky right now" />
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted">
            <LocaleText path="home.skyMapSubtitle" fallback="An interactive map of where the Sun, Moon, planets and the brightest stars sit above you at this moment — plotted from precise astronomy, from your own coordinates." />
          </p>
          <div className="mt-10">
            <SkyMapClient />
          </div>
        </div>
      </section>

      {/* ---- Daily transit, personalised sky ---- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="kicker"><LocaleText path="home.dailyTransitKicker" fallback="Your personal sky" /></p>
        <h2 className="mt-3 font-display text-3xl leading-tight text-starlight sm:text-4xl">
          <LocaleText path="home.dailyTransitTitle" fallback="Your day under the planets" />
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted">
          <LocaleText path="home.dailyTransitSubtitle" fallback="Enter your birth details — or reuse the chart you saved on the birth-chart tool — and get a plain-English read of which life topics the planets are touching for you today." />
        </p>
        <div className="mt-10">
          <DailyTransitClient />
        </div>
      </section>

      {/* ---- Upcoming sky events ---- */}
      <SkyEvents />

      {/* ---- Born today on the home page ---- */}
      <TodaysStars month={month} day={day} initial={people} />

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

      {/* ---- Cosmic traits & career directions ---- */}
      <CosmicTraits />

      {/* ---- Core features grid ---- */}
      <section className="border-y border-white/[0.08] bg-white/[0.02] backdrop-blur-xl saturate-180">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="kicker"><LocaleText path="home.featuresKicker" fallback="The toolkit" /></p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-starlight sm:text-4xl">
              <LocaleText path="home.featuresTitle" fallback="Four tools, one truthful sky" />
            </h2>
            <p className="mt-4 leading-7 text-muted">
              <LocaleText path="home.featuresDesc" fallback="Every tool runs on the same exact astronomical engine, so the numbers you read are the numbers the sky actually shows." />
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              {
                href: "/birthchart",
                titleKey: "home.featureBirthChartTitle",
                titleFallback: "Birth Chart",
                descKey: "home.featureBirthChartDesc",
                descFallback: "A precise natal chart of your Sun, Moon and rising signs — houses, aspects and plain-English guidance from real planetary positions.",
                glyph: "★",
              },
              {
                href: "/synastry",
                titleKey: "home.featureCompatibilityTitle",
                titleFallback: "Compatibility",
                descKey: "home.featureCompatibilityDesc",
                descFallback: "Two real birth charts, four relationship dimensions, one honest score drawn from the actual planetary angles between them.",
                glyph: "✦",
              },
              {
                href: "/sky-events",
                titleKey: "home.featureEventsTitle",
                titleFallback: "Celestial Events",
                descKey: "home.featureEventsDesc",
                descFallback: "Meteor showers, eclipses and lunar phases dated from astronomical ephemerides — know what is worth stepping outside for.",
                glyph: "☄",
              },
              {
                href: "/cosmic-facts",
                titleKey: "home.featureFactsTitle",
                titleFallback: "Cosmic Facts",
                descKey: "home.featureFactsDesc",
                descFallback: "Every sign's traits, superpowers, mythology and career energies, explained in plain language.",
                glyph: "✦",
              },
            ].map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl saturate-180 transition-colors hover:border-gold/40 hover:bg-white/[0.06]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <div>
                  <span aria-hidden className="text-2xl text-gold">
                    {feature.glyph}
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-starlight">
                    <LocaleText path={feature.titleKey} fallback={feature.titleFallback} />
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    <LocaleText path={feature.descKey} fallback={feature.descFallback} />
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm text-gold">
                  Open {feature.titleFallback}
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Knowledge base & method ---- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="kicker"><LocaleText path="home.methodKicker" fallback="Knowledge base & method" /></p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-starlight">
              <LocaleText path="home.methodTitle" fallback="Astronomy tells you where the planets are. Astrology wonders what that means." />
            </h2>
            <p className="mt-5 font-serif-body text-lg leading-8 text-starlight/85">
              <LocaleText path="home.methodDesc" fallback="At Zunara, every planetary position you read is calculated from astronomical theory, never invented. We are equally clear about the difference between what the math measures and the meaning we reflect on." />
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl saturate-180">
                <p className="kicker text-gold"><LocaleText path="home.methodAstronomyTitle" fallback="Astronomy measures" /></p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  <LocaleText path="home.methodAstronomyText" fallback="Positions, motion and angles. Zunara computes the sky with the same planetary theory used in published ephemerides — no approximations, no invented coordinates." />
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl saturate-180">
                <p className="kicker text-gold"><LocaleText path="home.methodAstrologyTitle" fallback="Astrology reflects" /></p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  <LocaleText path="home.methodAstrologyText" fallback="Symbolic meaning drawn from those measured positions, written honestly for reflection and entertainment — never presented as science or fate." />
                </p>
              </div>
            </div>
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