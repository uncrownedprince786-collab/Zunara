import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { shareMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Free Astrology Tools & Calculators",
  description:
    "Free, accurate astrology and astronomy tools — birth chart calculator, daily horoscopes, compatibility (synastry), live sky map, ephemeris, lunar phase, retrogrades and more. Every position computed from real planetary theory.",
  alternates: { canonical: absoluteUrl("/tools") },
  ...shareMeta(
    absoluteUrl("/tools"),
    "Free Astrology Tools & Calculators | Zunara",
    "Birth chart calculator, synastry compatibility, live sky maps, daily ephemeris, lunar phases and retrogrades — all free, all computed from real planetary theory.",
  ),
};

const GROUPS = [
  {
    kicker: "Calculate",
    tools: [
      {
        href: "/birthchart",
        title: "Birth Chart Calculator",
        summary:
          "Your exact natal chart — Sun, Moon and rising signs, twelve houses and every major aspect, computed from precise planetary positions and your birthplace longitude.",
        tag: "Free",
      },
      {
        href: "/synastry",
        title: "Compatibility (Synastry)",
        summary:
          "Compare two real birth charts across four relationship dimensions, scored from the actual planetary angles between them — not sun-sign guesswork.",
        tag: "Free",
      },
      {
        href: "/daily-transit",
        title: "Daily Transit Reader",
        summary:
          "Bring your saved birth chart and get a plain-English read of which life topics the planets are touching for you today and the weeks ahead.",
        tag: "Free",
      },
      {
        href: "/yoursky",
        title: "Your Sky Dashboard",
        summary:
          "A personal sky view from your saved chart: today's strongest planetary influences and the next thirty days, in plain words.",
        tag: "Free",
      },
    ],
  },
  {
    kicker: "Observe the live sky",
    tools: [
      {
        href: "/sky-now",
        title: "Sky Now",
        summary:
          "Where every planet actually is at this moment — positions, sign, retrograde status, lunar phase and the major aspects between bodies.",
        tag: "Live",
      },
      {
        href: "/sky-map",
        title: "Interactive Sky Map",
        summary:
          "See the Sun, Moon, planets and brightest stars above your own coordinates right now — plotted from precise astronomy.",
        tag: "Live",
      },
      {
        href: "/ephemeris",
        title: "Daily Ephemeris Table",
        summary:
          "Day-by-day planetary positions: sign, degree, longitude and retrograde motion for the Sun, Moon, eight planets and the lunar nodes on any date.",
        tag: "Free",
      },
      {
        href: "/sky-events",
        title: "Sky Events Calendar",
        summary:
          "The year's real celestial events — eclipses, meteor showers, full moons and major planetary alignments — confirmed against astronomical calculation.",
        tag: "Calendar",
      },
      {
        href: "/retrograde",
        title: "Retrograde Tracker",
        summary:
          "Which planets are apparent retrograde right now, in which sign, and the plain-English meaning of each one's backward pass.",
        tag: "Live",
      },
    ],
  },
  {
    kicker: "Read the stars",
    tools: [
      {
        href: "/horoscope",
        title: "Daily Horoscopes",
        summary:
          "Daily, weekly, monthly and yearly forecasts for all twelve signs, written from today's real planetary positions.",
        tag: "Free",
      },
      {
        href: "/famous-birthdays",
        title: "Famous Birthdays by Date",
        summary:
          "Who shares your birthday? Browse notables born on any date, verified from Wikidata, paired with their zodiac sign.",
        tag: "Free",
      },
      {
        href: "/cosmic-facts",
        title: "Cosmic Facts",
        summary:
          "A calm, accurate treasury of astronomy and astrology facts — the differences between intuition and measured motion.",
        tag: "Read",
      },
      {
        href: "/astrology",
        title: "Astrology Guide",
        summary:
          "A plain-English guide to the zodiac, planets, houses and aspects — how the system works and what the math measures.",
        tag: "Read",
      },
      {
        href: "/library",
        title: "Astrology Glossary",
        summary:
          "Every term defined without hype: planets, signs, houses, aspects, lunar nodes and movement terms.",
        tag: "Read",
      },
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs items={[{ label: "Free Astrology Tools", href: "/tools" }]} />
        </div>
        <header className="mx-auto mt-8 max-w-3xl text-center">
          <p className="kicker">The toolbox</p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-4 w-20" />
          <h1 className="mt-6 font-display text-4xl leading-tight text-starlight sm:text-6xl">
            Free Astrology Tools &amp; Calculators
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
            Every tool on Zunara is free and runs on the same exact astronomical
            engine — so the positions, phases and aspects you read here are
            calculated from planetary theory, never invented.
          </p>
        </header>

        <div className="mt-14 space-y-14">
          {GROUPS.map((group) => (
            <section key={group.kicker} aria-labelledby={`${group.kicker}-heading`}>
              <div className="flex items-center gap-3">
                <h2
                  id={`${group.kicker}-heading`}
                  className="kicker"
                >
                  {group.kicker}
                </h2>
                <div aria-hidden="true" className="h-px flex-1 bg-white/10" />
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {group.tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl saturate-180 transition-colors hover:border-gold/40 hover:bg-white/[0.06]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-display text-lg font-semibold text-starlight">
                          {tool.title}
                        </h3>
                        <span className="shrink-0 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-gold-deep">
                          {tool.tag}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">{tool.summary}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm text-gold">
                      Open <span aria-hidden className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}