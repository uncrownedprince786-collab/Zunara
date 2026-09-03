import Link from "next/link";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { BentoZodiacGrid } from "@/components/ui/bento-zodiac-grid";
import { HeroVisual } from "@/components/ui/hero-visual";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { elementRune, elementText } from "@/components/ui/element";
import { snapshotForToday } from "@/lib/astronomy/astro";
import { PLANET_LABELS } from "@/lib/astrology/interpret";
import { DailyOrbitBanner } from "@/components/ui/daily-orbit-banner";
import { MoonSignCard } from "@/components/ui/moon-sign-card";
import { SkyEvents } from "@/components/sky/sky-events";
import { SITE } from "@/lib/seo/site";

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
        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
          <p className="kicker">{date}</p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-5 w-20" />
          <div className="starfield mx-auto -mb-3 mt-8 h-16" aria-hidden="true" />
          <h1 className="mx-auto max-w-3xl font-display text-5xl font-medium leading-[1.05] text-starlight sm:text-7xl">
            Written in the stars.
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-muted">
            A premium editorial astrology publication. Daily, weekly, monthly and yearly
            horoscopes for all twelve signs — calculated from real astronomical data.
            No myths, just the mathematics of the sky.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/horoscope"
              className="rounded-full bg-gold px-8 py-3 text-sm font-medium tracking-wide text-ink transition-opacity hover:opacity-90"
            >
              Read today&rsquo;s horoscope
            </Link>
            <Link
              href="/astrology"
              className="rounded-full border border-line px-8 py-3 text-sm text-muted transition-colors hover:border-gold/40 hover:text-starlight"
            >
              The astronomy
            </Link>
          </div>
        </div>
      </section>

      <DailyOrbitBanner />

      {/* ---- The current sky (real data) ---- */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="lg:w-3/5">
            <p className="kicker">The sky, tonight</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-starlight sm:text-4xl">
              The Sun passes through {sunSign?.name ?? "the zodiac"}
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-muted">
              Every position below is computed from astronomical theory, not invented. Zunara
              renders the movements of the spheres into reading — each aspect and retrograde
              corresponds to the true state of the sky.
            </p>
            {sunSign && (
              <div className="mt-6 flex flex-wrap gap-2">
                {sunSign.traits.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line bg-ink-2 px-3 py-1 text-xs text-muted"
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
              <p className="kicker">Planetary bulletin</p>
              <dl className="mt-5 space-y-3">
                {retro.length > 0 ? (
                  retro.map((p) => (
                    <div key={p.key} className="flex items-center gap-3">
                      <PlanetSymbol body={p.key} size="md" className="text-gold-deep" decorative />
                      <dd className="text-sm text-p-ink">
                        <span className="font-medium">{PLANET_LABELS[p.key] ?? p.key}</span>
                        <span className="text-p-muted"> retrograde in {sunSignName(p.sign)}</span>
                      </dd>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3">
                    <PlanetSymbol body="sun" size="md" className="text-gold-deep" decorative />
                    <dd className="text-sm text-p-ink">
                      <span className="font-medium">No retrogrades</span>
                      <span className="text-p-muted"> — all planets direct today</span>
                    </dd>
                  </div>
                )}
                {transit && (
                  <div className="mt-3 flex items-start gap-3 border-t border-p-line pt-3">
                    <PlanetSymbol body={transit.bodyA} size="md" className="text-gold-deep" decorative />
                    <dd className="text-sm text-p-ink">
                      <span className="font-medium capitalize">{transit.name}</span>
                      <span className="text-p-muted">
                        {" "}— {PLANET_LABELS[transit.bodyA] ?? transit.bodyA} &amp;{" "}
                        {PLANET_LABELS[transit.bodyB] ?? transit.bodyB}, {transit.orb.toFixed(1)}° orb
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
            <p className="kicker">The twelve signs</p>
            <h2 id="signs-heading" className="mt-3 font-display text-3xl text-starlight">
              An index of the heavens
            </h2>
          </div>
          <Link
            href="/horoscope"
            className="hidden text-sm text-muted transition-colors hover:text-gold sm:block"
          >
            All horoscopes &rarr;
          </Link>
        </div>
        <div className="mt-8">
          <BentoZodiacGrid />
        </div>
      </section>

      {/* ---- Upcoming sky events (live from the USNO almanac) ---- */}
      <SkyEvents />

      {/* ---- Horizons ---- */}
      <section className="border-y border-line-soft bg-ink-2">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div>
              <p className="kicker">Four horizons</p>
              <h2 className="mt-3 font-display text-3xl text-starlight">
                Beginnings to whole years
              </h2>
              <p className="mt-4 leading-7 text-muted">
                Start with the day, then travel outward — the week, the month, the year. Each
                horizon draws on the same truthful positions of the Sun, Moon and the planets.
              </p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
              {[
                { label: "Daily", href: "/horoscope/aries/today", desc: "A single day in focus", n: "I" },
                { label: "Weekly", href: "/horoscope/aries/weekly", desc: "The week ahead", n: "II" },
                { label: "Monthly", href: "/horoscope/aries/monthly", desc: "A longer arc", n: "III" },
                { label: "Yearly", href: "/horoscope/aries/yearly", desc: "The whole year", n: "IV" },
              ].map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  className="group flex flex-col justify-between gap-8 bg-ink p-6 transition-colors hover:bg-ink-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-4xl text-gold/50">{c.n}</span>
                    <span className="text-sm text-gold opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-starlight">{c.label}</p>
                    <p className="mt-1 text-sm text-subdued">{c.desc}</p>
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
            <p className="kicker">Our method</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-starlight">
              Real astronomy, editorial writing
            </h2>
            <p className="mt-5 font-serif-body text-lg leading-8 text-starlight/85">
              At Zunara, every planetary position you read is calculated from astronomical theory,
              never guessed. Our forecasts blend that data with carefully crafted editorial
              fragments — so the sky speaks with clarity, warmth and honesty.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-sm text-gold underline-offset-4 hover:underline"
            >
              Read about our method →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
            {(["Fire", "Earth", "Air", "Water"] as const).map((element) => {
              const signs = ZODIAC_SIGNS.filter((s) => s.element === element);
              return (
                <div key={element} className="bg-ink-2 p-6">
                  <div className="flex items-baseline justify-between">
                    <h3 className={`font-display text-2xl ${elementText(element)}`}>{element}</h3>
                    <span aria-hidden="true" className={`text-xl ${elementText(element)} opacity-60`}>
                      {elementRune(element)}
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
                          <span>{s.name}</span>
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

function sunSignName(slug: string): string {
  return ZODIAC_SIGNS.find((s) => s.slug === slug)?.name ?? slug;
}

