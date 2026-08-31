import Link from "next/link";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { ZodiacSymbol } from "@/components/ui/zodiac-symbol";
import { ZodiacGrid } from "@/components/ui/zodiac-grid";

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

  return (
    <div className="celestial-bg">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{date}</p>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-5xl leading-tight text-starlight sm:text-6xl">
          Written in the stars.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted">
          Daily, weekly, monthly and yearly horoscopes for all twelve signs of the zodiac \u2014
          calculated from real astronomical data. No myths, just the mathematics of the sky.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/horoscope"
            className="rounded-full bg-gold px-7 py-3 text-sm font-medium text-void transition-opacity hover:opacity-90"
          >
            Explore all signs
          </Link>
          <Link
            href="/astrology"
            className="rounded-full border border-line px-7 py-3 text-sm text-muted transition-colors hover:border-gold/40 hover:text-starlight"
          >
            The astronomy
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6" aria-labelledby="signs-heading">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 id="signs-heading" className="font-display text-3xl text-starlight">The twelve signs</h2>
            <p className="mt-2 text-muted">Select your sign to read today&rsquo;s forecast and beyond.</p>
          </div>
          <p className="hidden text-sm text-subdued sm:block">{ZODIAC_SIGNS.length} zodiac signs</p>
        </div>
        <ZodiacGrid hrefFor={(slug) => `/horoscope/${slug}/today`} />
      </section>

      <section className="border-y border-line-soft bg-obsidian/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl text-starlight">Today&rsquo;s horoscope, at a glance</h2>
          <p className="mt-3 max-w-2xl text-muted">
            A daily reading shaped by the Sun, Moon and planets in their current positions. Start
            with your sign, then look ahead by the week, the month, or the year.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Daily", href: "/horoscope/aries/today", desc: "A day in focus" },
              { label: "Weekly", href: "/horoscope/aries/weekly", desc: "The week ahead" },
              { label: "Monthly", href: "/horoscope/aries/monthly", desc: "A longer arc" },
              { label: "Yearly", href: "/horoscope/aries/yearly", desc: "The yearly view" },
            ].map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="group rounded-lg border border-line bg-obsidian p-6 transition-colors hover:border-gold/40 hover:bg-obsidian-2"
              >
                <p className="font-display text-xl text-starlight">{c.label}</p>
                <p className="mt-1 text-sm text-subdued">{c.desc}</p>
                <span className="mt-3 inline-block text-sm text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  Read now \u2192
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl text-starlight">Real astronomy, editorial writing</h2>
          <p className="mt-4 leading-7 text-muted">
            At Zunara, every planetary position you see is calculated from astronomical theory, not
            guessed. Our forecasts blend that calculated data with carefully crafted editorial
            fragments \u2014 so the sky speaks with clarity, warmth and honesty.
          </p>
          <Link
            href="/astrology"
            className="mt-6 inline-block text-sm text-gold underline-offset-4 hover:underline"
          >
            Read about our method
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <h2 className="mb-8 font-display text-2xl text-starlight">Begin with your element</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {(["Fire", "Earth", "Air", "Water"] as const).map((element) => {
            const signs = ZODIAC_SIGNS.filter((s) => s.element === element);
            return (
              <div key={element} className="rounded-xl border border-line bg-obsidian/50 p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl text-gold">{element}</h3>
                  <span className="text-2xl text-gold/40">{elementGlyph(element)}</span>
                </div>
                <ul className="mt-5 space-y-3">
                  {signs.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/horoscope/${s.slug}/today`}
                        className="flex items-center gap-3 text-starlight/90 transition-colors hover:text-gold"
                      >
                        <ZodiacSymbol sign={s.slug} size="sm" className="text-muted" label={s.name} />
                        <span>{s.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function elementGlyph(element: string): string {
  switch (element) {
    case "Fire":
      return "\u25B3";
    case "Earth":
      return "\u25A7";
    case "Air":
      return "\u2B26";
    case "Water":
      return "\u29EB";
    default:
      return "\u2735";
  }
}
