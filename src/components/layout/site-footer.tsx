import Link from "next/link";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { SITE } from "@/lib/seo/site";

export function SiteFooter() {
  const year = new Date().getUTCFullYear();
  return (
    <footer className="border-t border-line-soft bg-obsidian/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="font-display text-xl text-starlight">Zunara</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
              {SITE.tagline} Mathematically calculated horoscopes for all twelve signs of the zodiac.
            </p>
          </div>
          <nav aria-label="Zodiac signs">
            <p className="text-xs uppercase tracking-[0.18em] text-subdued">Signs</p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {ZODIAC_SIGNS.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/horoscope/${s.slug}`}
                    className="text-sm text-muted transition-colors hover:text-gold"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Forecasts">
            <p className="text-xs uppercase tracking-[0.18em] text-subdued">Forecasts</p>
            <ul className="mt-4 space-y-2">
              <li><Link href="/horoscope" className="text-sm text-muted hover:text-gold">All horoscopes</Link></li>
              <li><Link href="/horoscope/aries/today" className="text-sm text-muted hover:text-gold">Daily</Link></li>
              <li><Link href="/horoscope/aries/weekly" className="text-sm text-muted hover:text-gold">Weekly</Link></li>
              <li><Link href="/horoscope/aries/monthly" className="text-sm text-muted hover:text-gold">Monthly</Link></li>
              <li><Link href="/horoscope/aries/yearly" className="text-sm text-muted hover:text-gold">Yearly</Link></li>
            </ul>
          </nav>
          <nav aria-label="Company">
            <p className="text-xs uppercase tracking-[0.18em] text-subdued">Zunara</p>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-sm text-muted hover:text-gold">About &amp; method</Link></li>
              <li><Link href="/astrology" className="text-sm text-muted hover:text-gold">Astrology guide</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted hover:text-gold">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted hover:text-gold">Terms</Link></li>
              <li><Link href="/disclaimer" className="text-sm text-muted hover:text-gold">Disclaimer</Link></li>
            </ul>
          </nav>
        </div>
        <div className="mt-10 border-t border-line-soft pt-6 text-center text-xs text-subdued">
          <p>
            &copy; {year} {SITE.name}. Written in the stars. All astrological content is for entertainment
            and reflection, not professional advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
