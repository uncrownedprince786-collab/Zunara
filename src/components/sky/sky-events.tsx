"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/client";

export type SkyEvent = {
  title: string;
  start: string; // ISO date or date
  description: string;
  url?: string;
  category?: string;
};

const GUIDES = {
  moonPhases: "https://science.nasa.gov/moon/moon-phases/",
  meteorShowers: "https://www.imo.net/resources/calendar/",
  eclipses: "https://www.nasa.gov/skywatching/",
  planetary: "https://solarsystem.nasa.gov/planets/overview/",
  default: "https://www.nasa.gov/skywatching/",
} as const;

const DEAD_HOSTS = ["aa.usno.navy.mil"];

const FALLBACK_BY_CATEGORY: Record<string, string> = {
  "meteor-showers": GUIDES.meteorShowers,
  "moon-phases": GUIDES.moonPhases,
  eclipses: GUIDES.eclipses,
  oppositions: GUIDES.planetary,
  conjunctions: GUIDES.planetary,
};

function resolveUrl(e: SkyEvent): string {
  const raw = (e.url ?? "").trim();
  let host = "";
  try {
    host = raw.startsWith("http") ? new URL(raw).hostname : "";
  } catch {
    host = "";
  }
  const dead = host !== "" && DEAD_HOSTS.some((d) => host === d || host.endsWith(`.${d}`));
  const missing = raw === "" || !/^https?:\/\//i.test(raw);
  if (!missing && !dead) return raw;
  return FALLBACK_BY_CATEGORY[e.category ?? ""] ?? GUIDES.default;
}

const FALLBACK_EVENTS: SkyEvent[] = [
  {
    title: "Lyrids Meteor Shower · Peak Night",
    start: "2026-04-22",
    description:
      "Up to 20 meteors per hour radiate from the constellation Lyra. Best after midnight from a dark site — no equipment needed.",
    url: GUIDES.meteorShowers,
    category: "meteor-showers",
  },
  {
    title: "New Moon",
    start: "2026-04-17",
    description:
      "The darkest night of the lunar cycle — a perfect window for deep-sky observing and a quiet reset before the new month.",
    url: GUIDES.moonPhases,
    category: "moon-phases",
  },
  {
    title: "Full Moon · Pink Moon",
    start: "2026-04-02",
    description:
      "The Moon rises at sunset and stays up all night, fully lit. A spectacular sight near the horizon, thanks to the Moon illusion.",
    url: GUIDES.moonPhases,
    category: "moon-phases",
  },
];

function displayDate(iso: string, locale: string): { month: string; text: string } {
  const d = new Date(iso === iso.slice(0, 10) ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return { month: "", text: iso };
  const month = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(d);
  const text = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
  return { month, text };
}

export function SkyEvents() {
  const { t, locale } = useLocale();
  const [events, setEvents] = useState<SkyEvent[]>(FALLBACK_EVENTS);

  function categoryLabel(category: string | undefined): string {
    switch (category) {
      case "meteor-showers": return t("skyEvents.meteorShower", "Meteor shower");
      case "eclipses": return t("skyEvents.eclipse", "Eclipse");
      case "oppositions": return t("skyEvents.opposition", "Opposition");
      case "conjunctions": return t("skyEvents.conjunction", "Conjunction");
      case "moon-phases": return t("skyEvents.lunarPhase", "Lunar phase");
      default: return t("skyEvents.skyEvent", "Sky event");
    }
  }

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("https://space-calendar.lukekorth.com/feed.json?c=meteor-showers,eclipses,oppositions,conjunctions,moon-phases");
        if (!res.ok) return;
        const data = (await res.json()) as { events?: SkyEvent[] };
        const now = Date.now();
        const upcoming = (data.events ?? [])
          .filter((e) => new Date(e.start === e.start.slice(0, 10) ? `${e.start}T00:00:00Z` : e.start).getTime() >= now)
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
          .slice(0, 4);
        if (active && upcoming.length > 0) {
          setEvents(upcoming);
        }
      } catch {
        // use fallbacks
      }
    }
    load();
    return () => { active = false; };
  }, []);

  return (
    <section
      aria-labelledby="sky-events-heading"
      className="mx-auto max-w-6xl px-4 pb-4 sm:px-6"
    >
      <div className="paper-panel relative overflow-hidden p-8 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(108,92,231,0.28)_0%,transparent_70%)] blur-2xl"
        />
        <div className="relative">
          <p className="kicker">{t("skyEvents.kicker", "The sky ahead")}</p>
          <h2 id="sky-events-heading" className="mt-3 font-display text-3xl leading-tight text-starlight sm:text-4xl">
            {t("skyEvents.title", "Upcoming celestial events")}
          </h2>
          <p className="mt-3 max-w-xl leading-7 text-muted">
            {t("skyEvents.desc", "Live from astronomical ephemerides — meteor showers, eclipses, oppositions and lunar phases worth stepping outside for.")}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((e) => {
              const { month, text } = displayDate(e.start, locale);
              const label = categoryLabel(e.category);
              return (
                <article
                  key={`${e.start}-${e.title}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition-colors hover:border-gold/40"
                >
                  <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                    {month && (
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gold/15 text-sm font-bold text-gold">
                        {month}
                      </span>
                    )}
                    <div className="min-w-0">
                      <span className="inline-block rounded-full bg-gold/20 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-gold">
                        {label}
                      </span>
                      <p className="mt-1 text-xs text-muted">{text}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col px-5 py-4">
                    <h3 className="font-display text-base font-semibold leading-snug text-p-ink">{e.title}</h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-p-muted">{e.description}</p>
                    <Link
                      href={resolveUrl(e)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t("common.howToWatch", "How to watch")}: ${e.title}`}
                      className="mt-4 inline-flex w-fit items-center rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-starlight transition-colors hover:border-gold/50 hover:text-gold"
                    >
                      {t("common.howToWatch", "How to watch")}
                      <span aria-hidden className="ms-1.5">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-6 text-[0.7rem] leading-5 text-subdued">
            {t("skyEvents.disclaimer", "Event data is updated from astronomical almanacs and refreshed automatically. Always check a local astronomy guide before heading out.")}
          </p>
        </div>
      </div>
    </section>
  );
}
