import Link from "next/link";
import { snapshotForToday, startOfUtcDay } from "@/lib/astronomy/astro";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { PlanetSymbol } from "@/components/ui/planet-symbol";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { MoonPhaseWidget } from "@/components/ui/moon-phase";
import { LocaleText } from "@/components/ui/locale-text";
import { LocaleDate } from "@/components/ui/locale-date";
import { JsonLd } from "@/components/ui/json-ld";
import { SkyEvents } from "@/components/home/home-heavy-sections";
import { plainRetro, plainAspect } from "@/lib/content/sky-plain";
import { pageMetadata } from "@/lib/seo/metadata";
import { websiteJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 3600;

export const metadata = pageMetadata(
  "/sky-now",
  "Live Planet Positions, Retrogrades & Moon Phase",
  "Where every planet is right now by zodiac sign and degree, which planets are retrograde, the current moon phase and today's major aspects.",
  "website",
  [
    "live planet positions",
    "planet signs today",
    "moon phase now",
    "retrograde planets",
    "astronomy today",
  ],
);

const TABLE_BODIES = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"] as const;

export default function SkyNowPage() {
  const snapshot = snapshotForToday();

  const retro = snapshot.positions.filter(
    (p) => p.retrograde && p.key !== "northNode" && p.key !== "southNode",
  );

  const aspects = [...snapshot.aspects]
    .sort((a, b) => a.orb - b.orb)
    .slice(0, 4);

  return (
    <div className="constellation-bg">
      <JsonLd data={websiteJsonLd()} />

      <section className="relative overflow-hidden border-b border-line-soft">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(circle_at_top,rgba(108,92,231,0.15)_0%,transparent_70%)]"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-14 pt-16 text-center sm:px-6 sm:pt-20">
          <p className="kicker">
            <LocaleText path="skynow.kicker" fallback="Live from the sky" />
          </p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-5 w-20" />
          <h1 className="mx-auto mt-7 max-w-3xl font-display text-4xl font-medium leading-[1.08] text-starlight sm:text-5xl">
            <LocaleText path="skynow.title" fallback="Sky Now" />
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
            <LocaleText
              path="skynow.subtitle"
              fallback="Where the planets really are right now: positions by sign, retrogrades, the lunar phase, and the major aspects between them."
            />
          </p>
          <p className="mt-4 text-xs text-subdued">
            <LocaleDate /> · <LocaleText path="skynow.updatedLabel" fallback="Positions are computed continuously from the VSOP87 ephemeris." />
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="paper-panel rounded-lg p-6 sm:p-8 lg:col-span-3">
            <div className="flex items-center justify-between gap-3">
              <p className="kicker">
                <LocaleText path="skynow.positionKicker" fallback="Planet positions" />
              </p>
              <p aria-hidden="true" className="text-xs text-subdued">℞ = retrograde</p>
            </div>
            <ul className="mt-5 divide-y divide-white/[0.06]">
              {snapshot.positions
                .filter((p) => TABLE_BODIES.includes(p.key as (typeof TABLE_BODIES)[number]))
                .map((p) => {
                  const sign = ZODIAC_SIGNS.find((s) => s.slug === p.sign);
                  return (
                    <li key={p.key} className="flex items-center gap-4 py-3">
                      <PlanetSymbol body={p.key} size="md" className="text-gold-deep" decorative />
                      <div className="w-28">
                        <p className="text-sm text-starlight">
                          <LocaleText path={`planets.${p.key}`} fallback={p.key} />
                        </p>
                        <p className="text-[11px] uppercase tracking-wider text-subdued">
                          {p.retrograde ? (
                            <span className="text-gold-deep">℞ <LocaleText path="common.retrograde" fallback="retrograde" /></span>
                          ) : (
                            <LocaleText path="common.direct" fallback="direct" />
                          )}
                        </p>
                      </div>
                      <ZodiacSymbol sign={p.sign} size="md" label={sign?.name ?? p.sign} className="text-planet-venus opacity-80" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-muted">
                          {sign ? (
                            <LocaleText path={`signs.${p.sign}`} fallback={sign.name} />
                          ) : (
                            p.sign
                          )}{" "}
                          <span className="tabular-nums">{Math.floor(p.degreeInSign)}°</span>
                        </p>
                        <p className="truncate text-[11px] text-subdued">
                          Ecliptic longitude {p.longitude.toFixed(1)}°
                        </p>
                      </div>
                      <Link
                        href="/library/planets"
                        className="hidden text-xs text-gold transition-colors hover:underline sm:block"
                      >
                        <LocaleText path="common.readMore" fallback="Read more" /> →
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="paper-panel rounded-lg p-6 sm:p-8">
              <p className="kicker">
                <LocaleText path="skynow.moonKicker" fallback="Moon now" />
              </p>
              <div className="mt-4">
                <MoonPhaseWidget date={startOfUtcDay()} />
              </div>
            </div>

            <div className="paper-panel rounded-lg p-6 sm:p-8">
              <p className="kicker">
                <LocaleText path="skynow.retroKicker" fallback="Retrogrades" />
              </p>
              <div className="mt-4 space-y-4">
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
                      <p className="mt-2 border-s-2 border-gold/30 ps-2 text-xs leading-5 text-subdued">
                        <LocaleText path="uichrome.inPlainWords" fallback="In plain words: " />{plainRetro(p.key, p.sign)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-sm text-muted">
                    <LocaleText path="home.noRetrogrades" fallback="No retrogrades" /> — <LocaleText path="home.allPlanetsDirect" fallback="all planets direct today" />
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-white/[0.02] backdrop-blur-xl saturate-180">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="kicker">
            <LocaleText path="skynow.aspectsKicker" fallback="Major aspects" />
          </p>
          <h2 className="mt-3 font-display text-3xl text-starlight">
            <LocaleText path="skynow.betweenLights" fallback="The angles between the stars, right now" />
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {aspects.map((a) => (
              <div key={`${a.bodyA}-${a.bodyB}`} className="rounded-xl border border-gold/20 bg-gold/5 p-4">
                <div className="flex items-center gap-3">
                  <PlanetSymbol body={a.bodyA} size="md" className="text-gold-deep" decorative />
                  <p className="text-sm text-p-ink">
                    <span className="font-medium capitalize">
                      <LocaleText path={`aspects.${a.name.toLowerCase()}`} fallback={a.name} />
                    </span>
                    <span className="text-p-muted">
                      {" "}— <LocaleText path={`planets.${a.bodyA}`} fallback={a.bodyA} /> &amp;{" "}
                      <LocaleText path={`planets.${a.bodyB}`} fallback={a.bodyB} />
                      {", " + a.orb.toFixed(1) + "° "}
                      <LocaleText path="aspects.orb" fallback="orb" />
                    </span>
                  </p>
                </div>
                <p className="mt-2 border-s-2 border-gold/30 ps-2 text-xs leading-5 text-subdued">
                  <LocaleText path="uichrome.inPlainWords" fallback="In plain words: " />{plainAspect(a.name, a.bodyA, a.bodyB, a.orb)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/sky-map"
              className="inline-block rounded-full border border-gold/40 bg-gold/5 px-7 py-3 text-sm font-medium text-gold transition-colors hover:bg-gold/15"
            >
              <LocaleText path="skynow.viewNightSky" fallback="Open the night sky" /> →
            </Link>
          </div>
        </div>
      </section>

      <SkyEvents />
    </div>
  );
}