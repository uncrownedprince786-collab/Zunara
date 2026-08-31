import Link from "next/link";
import { ZODIAC_SIGNS, formatDateRange } from "@/lib/zodiac/zodiac";
import { SITE } from "@/lib/seo/site";
import { StarMark } from "./star-mark";

export function SiteFooter() {
  const year = new Date().getUTCFullYear();
  const columns = [
    { title: "Horoscopes", links: [
      { label: "All signs", href: "/horoscope" },
      { label: "Today", href: "/horoscope/aries/today" },
      { label: "Weekly", href: "/horoscope/aries/weekly" },
      { label: "Monthly", href: "/horoscope/aries/monthly" },
      { label: "Yearly", href: "/horoscope/aries/yearly" },
    ]},
    { title: "The publication", links: [
      { label: "The astronomy", href: "/astrology" },
      { label: "About & method", href: "/about" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
    ]},
  ];

  return (
    <footer className="border-t border-line-soft bg-ink-2">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6">
        <div className="flex items-start justify-between gap-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <StarMark className="h-5 w-5 text-gold" />
              <span className="font-display text-2xl font-medium text-starlight">Zunara</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              An editorial astrology publication. Every position is calculated from real
              astronomical data; no myth, only the mathematics of the sky.
            </p>
          </div>

          <div className="grid flex-1 gap-8 sm:grid-cols-2">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="kicker">{col.title}</p>
                <ul className="mt-4 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-muted transition-colors hover:text-gold">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-line-soft pt-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-subdued">The twelve signs</p>
            <ul className="flex flex-wrap items-center gap-2">
              {ZODIAC_SIGNS.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/horoscope/${s.slug}`}
                    title={`${s.name} \u2014 ${formatDateRange(s)}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line-soft text-sm text-muted transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    <span aria-hidden="true">{s.glyph}</span>
                    <span className="sr-only">{s.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-8 text-center text-xs leading-5 text-subdued">
            &copy; {year} {SITE.name}. Written in the stars. All astrological content is for
            entertainment and reflection, not professional advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
