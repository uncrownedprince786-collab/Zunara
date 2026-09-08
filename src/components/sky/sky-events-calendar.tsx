"use client";

import { useMemo, useState, useEffect } from "react";
import { useLocale } from "@/lib/i18n/client";
import { calculateSkyEventsForYear } from "@/lib/content/sky-events-calculated";
import {
  FALLBACK_BY_CATEGORY,
  EVENT_GUIDES,
  type SkyEvent,
} from "@/lib/content/sky-events-data";
import { startOfUtcDay } from "@/lib/astronomy/astro";
import { generateTransitICS } from "@/lib/calendar/ics-generator";

const DEAD_HOSTS = ["aa.usno.navy.mil"];

type Filter = "all" | "upcoming" | "past";

function resolveUrl(e: SkyEvent): string {
  const raw = (e.url ?? "").trim();
  let host = "";
  try {
    host = raw.startsWith("http") ? new URL(raw).hostname : "";
  } catch {
    host = "";
  }
  const dead =
    host !== "" && DEAD_HOSTS.some((d) => host === d || host.endsWith(`.${d}`));
  const missing = raw === "" || !/^https?:\/\//i.test(raw);
  if (!missing && !dead) return raw;
  return FALLBACK_BY_CATEGORY[e.category ?? ""] ?? EVENT_GUIDES.default;
}

function displayDate(iso: string, locale: string): { month: string; text: string } {
  const d = new Date(iso.length > 10 ? iso : `${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return { month: "", text: iso };
  const month = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  }).format(d);
  const text = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
  return { month, text };
}

function eventTime(e: SkyEvent): number {
  const d = new Date(e.start.length > 10 ? e.start : `${e.start}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? Number.POSITIVE_INFINITY : d.getTime();
}

function categoryLabel(
  category: string | undefined,
  title: string,
  t: (key: string, fb?: string) => string,
): string {
  if (/equinox|solstice/i.test(title)) {
    return t("skyEvents.seasonal", "Seasonal");
  }
  switch (category) {
    case "meteor-showers":
      return t("skyEvents.meteorShower", "Meteor shower");
    case "seasonal":
      return t("skyEvents.seasonal", "Seasonal");
    case "eclipses":
      return t("skyEvents.eclipse", "Eclipse");
    case "oppositions":
      return t("skyEvents.opposition", "Opposition");
    case "conjunctions":
      return t("skyEvents.conjunction", "Conjunction");
    case "moon-phases":
      return t("skyEvents.lunarPhase", "Lunar phase");
    default:
      return t("skyEvents.skyEvent", "Sky event");
  }
}

const CURRENT_YEAR = new Date().getUTCFullYear();
const MIN_YEAR = CURRENT_YEAR - 2;
const MAX_YEAR = CURRENT_YEAR + 2;

export function SkyEventsCalendar() {
  const { t, locale } = useLocale();

  const [nowRef, setNowRef] = useState(() => startOfUtcDay());
  const [year, setYear] = useState(() => {
    const utcYear = new Date().getUTCFullYear();
    return Math.max(MIN_YEAR, Math.min(MAX_YEAR, utcYear));
  });
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    setNowRef(new Date());
  }, []);

  const events = useMemo(() => calculateSkyEventsForYear(year), [year]);

  const filtered = useMemo(() => {
    const nowTs = nowRef.getTime();
    if (filter === "upcoming") return events.filter((e) => eventTime(e) >= nowTs);
    if (filter === "past") return events.filter((e) => eventTime(e) < nowTs);
    return events;
  }, [events, filter, nowRef]);

  function handleExportAll() {
    if (filtered.length === 0) return;
    const text = generateTransitICS(
      filtered.map((e) => ({
        title: localizedTitle(e),
        start: new Date(e.start.length > 10 ? e.start : `${e.start}T00:00:00Z`),
        description: localizedDesc(e),
      })),
      { name: "Zunara Sky Events" },
    );
    const blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zunara-sky-events-${year}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleAddSingle(e: SkyEvent) {
    const text = generateTransitICS(
      [
        {
          title: localizedTitle(e),
          start: new Date(e.start.length > 10 ? e.start : `${e.start}T00:00:00Z`),
          description: localizedDesc(e),
        },
      ],
      { name: "Zunara Sky Events" },
    );
    const blob = new Blob([text], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zunara-sky-event-${e.start.slice(0, 10)}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function localizedTitle(e: SkyEvent): string {
    if (e.category === "conjunctions" && e.bodyA && e.bodyB) {
      return `${t(`planets.${e.bodyA}`, e.bodyA)} \u2013 ${t(`planets.${e.bodyB}`, e.bodyB)} ${t("skyEvents.conjunction", "Conjunction")}`;
    }
    return e.titleKey ? t(e.titleKey, e.title) : e.title;
  }

  function localizedDesc(e: SkyEvent): string {
    return e.descKey ? t(e.descKey, e.description) : e.description;
  }

  function utcTimeLabel(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(d);
  }

  function localTimeLabel(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  }

  const nowTs = nowRef.getTime();

  return (
    <section
      aria-labelledby="sky-calendar-heading"
      className="mx-auto max-w-6xl px-4 pb-4 sm:px-6"
    >
      <div className="paper-panel relative overflow-hidden p-8 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(108,92,231,0.28)_0%,transparent_70%)] blur-2xl"
        />
        <div className="relative">
          <p className="kicker">
            {t("skyEvents.kicker", "Upcoming Sky Events")}
          </p>
          <h2
            id="sky-calendar-heading"
            className="mt-3 font-display text-3xl leading-tight text-starlight sm:text-4xl"
          >
            {t("skyEvents.title", "Upcoming Sky Events")}
          </h2>
          <p className="mt-3 max-w-xl leading-7 text-muted">
            {t(
              "skyEvents.desc",
              "Live from astronomical ephemerides: meteor showers, eclipses, oppositions and lunar phases worth stepping outside for.",
            )}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={year <= MIN_YEAR}
              onClick={() => setYear((y) => y - 1)}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-starlight transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-30"
              aria-label={t("skyEvents.yearPicker.previous", "Previous year")}
            >
              <span aria-hidden>&larr;</span>
            </button>
            <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-bold text-gold">
              {year}
            </span>
            <button
              type="button"
              disabled={year >= MAX_YEAR}
              onClick={() => setYear((y) => y + 1)}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-starlight transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-30"
              aria-label={t("skyEvents.yearPicker.next", "Next year")}
            >
              <span aria-hidden>&rarr;</span>
            </button>
            <span className="text-xs text-subdued">
              {t("skyEvents.yearPicker.label", "Year")}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(
              [
                ["all", "skyEvents.filters.all", "All"],
                ["upcoming", "skyEvents.filters.upcoming", "Upcoming"],
                ["past", "skyEvents.filters.past", "Past"],
              ] as const
            ).map(([value, key, fb]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  filter === value
                    ? "border-gold/40 bg-gold/15 text-gold"
                    : "border-white/15 text-starlight hover:border-gold/30 hover:text-gold"
                }`}
              >
                {t(key, fb)}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportAll}
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-medium text-gold-deep transition-colors hover:bg-gold/20"
            >
              {t("skyEvents.exportLabel", "Export to Calendar (.ics)")}
              <span aria-hidden>&darr;</span>
            </button>
            <span className="text-xs text-subdued">
              {t(
                "skyEvents.exportHint",
                "Adds these events to Google Calendar, Apple Calendar or Outlook.",
              )}
            </span>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-8 text-center text-muted">
              {t(
                "skyEvents.noEvents",
                "Nothing on the calendar for this year.",
              )}
            </p>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((e) => {
                const { month, text } = displayDate(e.start, locale);
                const label = categoryLabel(e.category, e.title ?? "", t);
                const isUpcoming = eventTime(e) >= nowTs;
                const hasTime = e.start.length > 10;
                return (
                  <article
                    key={`${e.start}-${e.title}-${e.category}`}
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
                      <h3 className="font-display text-base font-semibold leading-snug text-p-ink">
                        {localizedTitle(e)}
                      </h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-p-muted">
                        {localizedDesc(e)}
                      </p>
                      {hasTime && (
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-subdued">
                          <span>
                            {t("skyEvents.calendar.utc", "UTC")}:{" "}
                            {utcTimeLabel(e.start)}
                          </span>
                          <span>
                            {t("skyEvents.calendar.local", "Your time")}:{" "}
                            {localTimeLabel(e.start)}
                          </span>
                        </div>
                      )}
                      {e.regionKey && (
                        <span className="mt-2 inline-block w-fit rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[0.6rem] font-medium text-subdued">
                          {t(e.regionKey, e.regionKey)}
                        </span>
                      )}
                      {e.viewTipKey && (
                        <div className="mt-3 rounded-lg bg-white/[0.03] px-3 py-2">
                          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gold/70">
                            {t("skyEvents.calendar.tip", "Viewing tip")}
                          </span>
                          <p className="mt-1 text-xs leading-5 text-p-muted">
                            {t(e.viewTipKey, "")}
                          </p>
                        </div>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {e.url && (
                          <a
                            href={resolveUrl(e)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-starlight transition-colors hover:border-gold/50 hover:text-gold"
                          >
                            {t("common.howToWatch", "How to watch")}
                            <span aria-hidden className="ms-1.5">
                              →
                            </span>
                          </a>
                        )}
                        {isUpcoming && (
                          <button
                            type="button"
                            onClick={() => handleAddSingle(e)}
                            className="inline-flex w-fit items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold-deep transition-colors hover:bg-gold/20"
                          >
                            {t(
                              "skyEvents.calendar.addToCalendar",
                              "Add to calendar",
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <p className="mt-6 text-[0.7rem] leading-5 text-subdued">
            {t(
              "skyEvents.disclaimer",
              "Event data is updated from astronomical almanacs and refreshed automatically. Always check a local sky guide before heading out.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
