"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/client";
import { startOfUtcDay } from "@/lib/astronomy/astro";
import { zodiacForDate } from "@/lib/zodiac/zodiac";
import { resolveCelebritiesForDate } from "@/lib/celebrities/resolver";
import { categoryFromProfession, categoryName, CATEGORY_STYLE, type CategorySlug } from "@/lib/celebrities/categories";
import { celebrityMatchesFilter, type CelebrityFilter } from "@/lib/celebrities/filters";
import { PortraitAvatar, REGION_STYLE } from "@/components/ui/celebrity-birthdays-view";
import type { Celebrity } from "@/lib/content/celebrities";
import type { CelebritySource } from "@/lib/celebrities/resolver";

const DAYS_PER_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const FILTERS: { key: CelebrityFilter; labelKey: string; fallback: string }[] = [
  { key: "all", labelKey: "celebrities.filters.all", fallback: "All" },
  { key: "cinema", labelKey: "celebrities.filters.cinema", fallback: "Actors" },
  { key: "music", labelKey: "celebrities.filters.music", fallback: "Musicians" },
  { key: "science", labelKey: "celebrities.filters.science", fallback: "Scientists & Leaders" },
  { key: "sports", labelKey: "celebrities.filters.sports", fallback: "Athletes" },
];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function daysInMonth(month: number): number {
  return DAYS_PER_MONTH[month - 1] ?? 30;
}

function addDays(month: number, day: number, delta: number): { month: number; day: number } {
  const d = Date.UTC(2000, month - 1, day) + delta * 86400000;
  const dt = new Date(d);
  return { month: dt.getUTCMonth() + 1, day: dt.getUTCDate() };
}

function monthName(locale: string, month: number): string {
  return new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" }).format(
    Date.UTC(2000, month - 1, 1),
  );
}

function Chevron() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-subdued"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}

interface FamousBirthdaysHubProps {
  initialMonth: number;
  initialDay: number;
  initialPeople: Celebrity[];
}

export function FamousBirthdaysHub({
  initialMonth,
  initialDay,
  initialPeople,
}: FamousBirthdaysHubProps) {
  const { t, tSign, locale } = useLocale();

  const [now, setNow] = useState(() => startOfUtcDay());
  useEffect(() => {
    setNow(startOfUtcDay());
  }, []);

  const [month, setMonth] = useState(initialMonth);
  const [day, setDay] = useState(initialDay);
  const [filter, setFilter] = useState<CelebrityFilter>("all");
  const [people, setPeople] = useState<Celebrity[]>(initialPeople);
  const [source, setSource] = useState<CelebritySource>("static");

  const selectedIsToday = useMemo(() => {
    return now.getUTCMonth() + 1 === month && now.getUTCDate() === day;
  }, [now, month, day]);

  useEffect(() => {
    let active = true;
    resolveCelebritiesForDate(month, day).then((res) => {
      if (!active) return;
      setPeople(res.people);
      setSource(res.source);
    }).catch(() => {});
    return () => { active = false; };
  }, [month, day]);

  const filtered = useMemo(
    () => people.filter((c) => celebrityMatchesFilter(c, filter)),
    [people, filter],
  );

  const dateLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(Date.UTC(2000, month - 1, day));

  const sign = zodiacForDate(2000, month, day);

  function handleDayChange(nextDay: number) {
    const clamped = Math.min(Math.max(1, nextDay), daysInMonth(month));
    setDay(clamped);
  }

  function handleMonthChange(nextMonth: number) {
    setMonth(nextMonth);
    const maxDay = daysInMonth(nextMonth);
    if (day > maxDay) setDay(maxDay);
  }

  function goToday() {
    const nowDay = startOfUtcDay();
    setMonth(nowDay.getUTCMonth() + 1);
    setDay(nowDay.getUTCDate());
  }

  function goYesterday() {
    const prev = addDays(month, day, -1);
    setMonth(prev.month);
    setDay(prev.day);
  }

  function goTomorrow() {
    const next = addDays(month, day, 1);
    setMonth(next.month);
    setDay(next.day);
  }

  function goPrev() {
    const prev = addDays(month, day, -1);
    setMonth(prev.month);
    setDay(prev.day);
  }

  function goNext() {
    const next = addDays(month, day, 1);
    setMonth(next.month);
    setDay(next.day);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-6 rounded-2xl border border-gold/20 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="kicker">{t("celebrities.kicker", "Famous birthdays today")}</p>
            <h2 className="mt-2 font-display text-2xl text-starlight sm:text-3xl">
              {dateLabel}
              {selectedIsToday && (
                <span className="ms-3 inline-block rounded-full border border-gold/40 bg-gold/10 px-3 py-0.5 text-xs font-medium text-gold-deep align-middle">
                  {t("celebrities.bornToday", "Born Today")}
                </span>
              )}
            </h2>
            <p className="mt-1 text-sm text-subdued">
              {t("celebrities.signOfTheDay", "Sign of the day")}{" "}
              <span className="font-medium text-starlight">{tSign(sign.slug)}</span>
              <span className="ms-1 opacity-60">{sign.glyph}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {source === "live" && (
              <span className="text-[0.7rem] uppercase tracking-[0.14em] text-subdued">
                {t("celebrities.liveSource", "Live from Wikidata")}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-subdued">
            {t("celebrities.searchLabel", "Browse by date")}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => handleMonthChange(Number.parseInt(e.target.value, 10) || 1)}
                  className="quick-birth-select h-10 w-full rounded-full border border-white/[0.16] py-2 ps-4 pe-10 text-sm font-medium text-starlight outline-none transition-colors hover:border-gold/50 focus:border-gold/70 sm:w-40"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {monthName(locale, m)}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
              <div className="relative">
                <select
                  value={day}
                  onChange={(e) => handleDayChange(Number.parseInt(e.target.value, 10) || 1)}
                  className="quick-birth-select h-10 w-full rounded-full border border-white/[0.16] py-2 ps-4 pe-10 text-sm font-medium text-starlight outline-none transition-colors hover:border-gold/50 focus:border-gold/70 sm:w-20"
                >
                  {Array.from({ length: daysInMonth(month) }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goPrev}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-starlight transition-colors hover:border-gold/40 hover:bg-white/[0.08]"
                aria-label={t("celebrities.previous", "Previous day")}
              >
                <span aria-hidden>&larr;</span>
              </button>
              <button
                type="button"
                onClick={goYesterday}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-white/20 hover:text-starlight"
              >
                {t("celebrities.yesterday", "Yesterday")}
              </button>
              <button
                type="button"
                onClick={goToday}
                className="rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold-deep transition-colors hover:bg-gold/20"
              >
                {t("celebrities.today", "Today")}
              </button>
              <button
                type="button"
                onClick={goTomorrow}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-white/20 hover:text-starlight"
              >
                {t("celebrities.tomorrow", "Tomorrow")}
              </button>
              <button
                type="button"
                onClick={goNext}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/[0.04] text-starlight transition-colors hover:border-gold/40 hover:bg-white/[0.08]"
                aria-label={t("celebrities.next", "Next day")}
              >
                <span aria-hidden>&rarr;</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f.key
                    ? "border-gold/50 bg-gold/15 text-gold-deep"
                    : "border-white/10 bg-white/[0.04] text-muted hover:border-white/20 hover:text-starlight"
                }`}
              >
                {t(f.labelKey, f.fallback)}
              </button>
            ))}
          </div>
        </div>

        <div aria-live="polite" className="mt-2">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted">
              {t("celebrities.emptyState", "No famous birthdays found for this date.")}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((c) => {
                const cSign = zodiacForDate(2000, c.month, c.day);
                const cat = (c.category && c.category in CATEGORY_STYLE
                  ? (c.category as CategorySlug)
                  : categoryFromProfession(c.profession, c.star));
                const catStyle = CATEGORY_STYLE[cat] ?? CATEGORY_STYLE.other;
                const regionStyle = REGION_STYLE[c.region];
                const wikiHref = (() => {
                  if (!c.wiki) return undefined;
                  if (!/^Q\d+$/.test(c.wiki)) {
                    return `https://en.wikipedia.org/wiki/${c.wiki}`;
                  }
                  return `https://en.wikipedia.org/wiki/${c.name.replace(/ /g, "_")}`;
                })();

                return (
                  <Link
                    key={c.url + c.name}
                    href={`/birthday/${pad2(month)}-${pad2(day)}`}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl saturate-180 transition-colors hover:border-gold/40 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start gap-3">
                      <PortraitAvatar celebrity={c} sign={cSign} />
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-sm font-semibold text-starlight">
                          {c.name}
                        </h3>
                        <p className="mt-0.5 truncate text-xs text-muted">
                          {t(`celebrities.occupations.${c.profession}`, c.profession)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-[0.55rem] font-medium tracking-wide ${regionStyle}`}>
                        {t(`celebrities.regions.${c.region}`, c.region)}
                      </span>
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-[0.55rem] font-medium tracking-wide ${catStyle}`}>
                        {t(`celebrities.categories.${cat}`, categoryName(cat))}
                      </span>
                      {typeof c.sitelinks === "number" && c.sitelinks > 0 && (
                        <span className="text-[0.55rem] text-subdued">
                          <span aria-hidden className="text-gold">&bull;</span>{" "}
                          &#9733; {c.sitelinks}{" "}
                          {t("celebrities.sitelinks", "language editions")}
                        </span>
                      )}
                    </div>

                    {wikiHref && (
                      <a
                        href={wikiHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="pointer-events-auto mt-2.5 inline-flex w-fit items-center gap-1 rounded-full border border-white/10 px-2.5 py-0.5 text-[0.55rem] font-medium text-subdued transition-colors hover:border-gold/40 hover:text-gold"
                      >
                        {t("celebrities.fullProfile", "Full profile")}
                        <span aria-hidden>&rarr;</span>
                      </a>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
