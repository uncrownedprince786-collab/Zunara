"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/lib/i18n/client";
import { monthDays } from "@/lib/calendar/birthday-routes";

function monthName(locale: string, month: number): string {
  // Localized month labels without a translation table — Intl does it for us.
  return new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" }).format(
    Date.UTC(2000, month - 1, 1),
  );
}

/**
 * Quick birthdate picker for the homepage hero. Month/day selects that push
 * straight to the static `/birthday/{MM-DD}` page.
 */
export function QuickBirthInput() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);

  const days = monthDays(month);
  const go = () => {
    router.push(
      `/birthday/${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    );
  };

  return (
    <form
      role="search"
      aria-label={t("home.quickBirthLabel", "Born on any other day? See who celebrates with you")}
      onSubmit={(event) => {
        event.preventDefault();
        go();
      }}
      className="mx-auto mt-10 flex max-w-2xl flex-col items-stretch gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3 backdrop-blur-xl saturate-180 sm:flex-row sm:items-center"
    >
      <p className="px-2 text-sm leading-6 text-muted">
        {t("home.quickBirthLabel", "Born on any other day? See who celebrates with you")}
      </p>
      <div className="flex flex-1 items-center gap-2">
        <label className="sr-only" htmlFor="quick-birth-month">
          {t("home.quickBirthMonth", "Month")}
        </label>
        <select
          id="quick-birth-month"
          value={month}
          onChange={(event) => {
            const next = Number.parseInt(event.target.value, 10) || 1;
            setMonth(next);
            setDay((current) => Math.min(current, monthDays(next)));
          }}
          className="w-1/2 rounded-full border border-white/[0.08] bg-cosmic/30 px-4 py-2.5 text-sm text-starlight outline-none transition-colors hover:border-gold/40"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {monthName(locale, m)}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="quick-birth-day">
          {t("home.quickBirthDay", "Day")}
        </label>
        <select
          id="quick-birth-day"
          value={day}
          onChange={(event) => setDay(Number.parseInt(event.target.value, 10) || 1)}
          className="w-1/2 rounded-full border border-white/[0.08] bg-cosmic/30 px-4 py-2.5 text-sm text-starlight outline-none transition-colors hover:border-gold/40"
        >
          {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-full bg-gold px-6 py-2.5 text-sm font-medium tracking-wide text-ink transition-opacity hover:opacity-90"
      >
        {t("home.quickBirthGo", "Show birthday facts")}
      </button>
    </form>
  );
}