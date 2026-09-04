"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/client";
import {
  YEARLY_EVENTS_2026,
  FALLBACK_BY_CATEGORY,
  EVENT_GUIDES,
  type SkyEvent,
} from "@/lib/content/sky-events-data";

export type { SkyEvent } from "@/lib/content/sky-events-data";

const DEAD_HOSTS = ["aa.usno.navy.mil"];

/** The reliable baseline dataset — full-year 2026 real celestial events. */
const FALLBACK_EVENTS: SkyEvent[] = YEARLY_EVENTS_2026;

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
  return FALLBACK_BY_CATEGORY[e.category ?? ""] ?? EVENT_GUIDES.default;
}

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

function eventTime(e: SkyEvent): number {
  const d = new Date(e.start === e.start.slice(0, 10) ? `${e.start}T00:00:00Z` : e.start);
  return Number.isNaN(d.getTime()) ? Number.POSITIVE_INFINITY : d.getTime();
}

/**
 * Zero-maintenance month rollover: pick the current UTC month while it still
 * has upcoming events; if it has none remaining, roll over to the next month.
 * Deterministic and unit-testable. Returns the active month (1-12) and a
 * non-empty list of that month's (plus the immediate next month, when sparse)
 * events sorted oldest-first.
 *
 * Guarantees at least 3 events are shown: if the active month has fewer than
 * 3 upcoming events, the immediate next month's events are pulled in to fill
 * the list (up to 4), so the container is never empty.
 */
export function selectActiveMonthEvents(
  events: SkyEvent[],
  now: Date,
): { month: number; events: SkyEvent[] } {
  const year = now.getUTCFullYear();
  const nowTs = now.getTime();

  const upcoming = events
    .filter((e) => {
      const t = eventTime(e);
      return t >= nowTs - 86400000; // include today's events
    })
    .sort((a, b) => eventTime(a) - eventTime(b));

  let activeMonth = now.getUTCMonth() + 1;
  let foundMonth = false;
  for (let i = 0; i < 2; i++) {
    const start = Date.UTC(year, now.getUTCMonth() + i, 1);
    const end = Date.UTC(year, now.getUTCMonth() + i + 1, 1);
    const monthEvents = upcoming.filter(
      (e) => eventTime(e) >= start && eventTime(e) < end,
    );
    if (monthEvents.length > 0) {
      activeMonth = now.getUTCMonth() + i + 1;
      foundMonth = true;
      break;
    }
  }

  // No upcoming events in the current or next month: fall back to the very
  // next single event so the section never renders empty.
  if (!foundMonth) {
    return { month: now.getUTCMonth() + 1, events: upcoming.slice(0, 1) };
  }

  const monthStart = Date.UTC(year, activeMonth - 1, 1);
  const monthEnd = Date.UTC(year, activeMonth, 1);
  const nextEnd = Date.UTC(year, activeMonth + 1, 1);
  const monthEvents = upcoming.filter((e) => eventTime(e) >= monthStart && eventTime(e) < monthEnd);

  // If the active month is sparse (<3 events), pull the immediate next month in
  // to keep the section populated per product requirements.
  if (monthEvents.length < 3) {
    const nextMonthEvents = upcoming.filter(
      (e) => eventTime(e) >= monthEnd && eventTime(e) < nextEnd,
    );
    const merged = [...monthEvents, ...nextMonthEvents];
    return { month: activeMonth, events: merged.slice(0, 4) };
  }

  return { month: activeMonth, events: monthEvents };
}

export function SkyEvents() {
  const { t, locale } = useLocale();
  const [state, setState] = useState(() => selectActiveMonthEvents(FALLBACK_EVENTS, new Date()));

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
        const data = (res.ok ? await res.json() : {}) as { events?: SkyEvent[] };
        // Merge the live feed with the reliable full-year baseline so a sparse,
        // empty or unreachable feed never leaves the section blank.
        const merged = [...(data.events ?? []), ...FALLBACK_EVENTS];
        const selected = selectActiveMonthEvents(merged, new Date());
        if (active && selected.events.length > 0) {
          setState(selected);
        }
      } catch {
        // network error: keep the full-year fallback already in state
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const events = state.events.slice(0, 4);
  const monthName = new Intl.DateTimeFormat(locale, {
    month: "long",
    timeZone: "UTC",
  }).format(Date.UTC(2000, state.month - 1, 1));

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
          <p className="mt-1 text-sm text-subdued">
            {t("skyEvents.activeMonth", "Showing")} {monthName}
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
