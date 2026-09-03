"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { useZunaraState, HORIZONS, type Horizon } from "@/lib/hooks/use-zunara-state";

const HORIZON_LABELS: Record<Horizon, string> = {
  today: "Today",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

interface QuickNavigationProps {
  currentSlug: string;
}

/**
 * Sticky sub-navigation for sign pages: instant sign switching via a compact
 * dropdown plus horizon tabs. Writing via the dropdown also records the
 * reader's chosen sign for the "Your Daily Orbit" personalisation.
 */
export function QuickNavigation({ currentSlug }: QuickNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUserZodiacSign } = useZunaraState();

  const current = ZODIAC_SIGNS.find((s) => s.slug === currentSlug);

  const segment = pathname.split("/").filter(Boolean);
  const last = segment[segment.length - 1];
  const activePeriod: Horizon = (HORIZONS as string[]).includes(last)
    ? (last as Horizon)
    : "today";

  const pickSign = (slug: string) => {
    setUserZodiacSign(slug);
    if (slug === currentSlug) return;
    router.push(horizonPath(slug, activePeriod));
  };

  const horizonPath = (slug: string, horizon: Horizon) =>
    horizon === "today" ? `/horoscope/${slug}/today` : `/horoscope/${slug}/${horizon}`;

  return (
    <nav
      aria-label="Sign navigation"
      className="sticky top-16 z-30 border-b border-white/[0.08] bg-white/[0.04] backdrop-blur-xl saturate-180"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-2">
          {/* Sign dropdown */}
          <div className="relative">
            <label htmlFor="sign-switch" className="sr-only">
              Switch zodiac sign
            </label>
            <select
              id="sign-switch"
              value={currentSlug}
              onChange={(e) => pickSign(e.target.value)}
              className="sign-switch appearance-none rounded-full border border-white/[0.12] bg-[#111222] py-1.5 pl-4 pr-9 text-sm font-medium text-white outline-none transition-colors hover:border-gold/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              {ZODIAC_SIGNS.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              viewBox="0 0 12 12"
              width="11"
              height="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2.5 4.5 6 8l3.5-3.5" />
            </svg>
          </div>
          {/* Active sign label (matches the selected sign's current page) */}
          {current && (
            <span className="hidden text-sm text-subdued sm:inline">
              {current.name} · {current.element}
            </span>
          )}
        </div>

        {/* Horizon tabs */}
        <div className="flex items-center gap-1">
          {HORIZONS.map((h) => {
            const active = h === activePeriod;
            return (
              <Link
                key={h}
                href={horizonPath(currentSlug, h)}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-3.5 py-1.5 text-[0.72rem] uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "bg-gold/15 text-gold"
                    : "text-muted hover:text-starlight"
                }`}
              >
                {HORIZON_LABELS[h]}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-gold via-cosmic/70 to-nebula/70"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
