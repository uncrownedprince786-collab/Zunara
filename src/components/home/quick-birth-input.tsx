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

function Chevron() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-subdued"
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
      className="mx-auto mt-10 flex w-full max-w-2xl flex-col gap-4 rounded-3xl border border-white/[0.14] bg-[#0D0E1A]/90 p-5 shadow-card backdrop-blur-xl saturate-180 sm:rounded-full sm:flex-row sm:items-center sm:px-5 sm:py-3"
    >
      <p className="px-1 text-center text-sm leading-6 text-muted sm:w-44 sm:text-start sm:text-[0.8rem]">
        {t("home.quickBirthLabel", "Born on any other day? See who celebrates with you")}
      </p>

      <div className="grid flex-1 grid-cols-2 items-center gap-2">
        <div className="relative">
          <label
            htmlFor="quick-birth-month"
            className="absolute -top-1.5 left-4 z-10 bg-[#0D0E1A] px-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-subdued"
          >
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
            className="quick-birth-select h-11 w-full rounded-full border border-white/[0.16] py-2.5 pl-4 pr-10 text-sm font-medium text-starlight outline-none transition-colors hover:border-gold/50 focus:border-gold/70"
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
          <label
            htmlFor="quick-birth-day"
            className="absolute -top-1.5 left-4 z-10 bg-[#0D0E1A] px-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-subdued"
          >
            {t("home.quickBirthDay", "Day")}
          </label>
          <select
            id="quick-birth-day"
            value={day}
            onChange={(event) => setDay(Number.parseInt(event.target.value, 10) || 1)}
            className="quick-birth-select h-11 w-full rounded-full border border-white/[0.16] py-2.5 pl-4 pr-10 text-sm font-medium text-starlight outline-none transition-colors hover:border-gold/50 focus:border-gold/70"
          >
            {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
      </div>

      <button
        type="submit"
        className="shrink-0 rounded-full bg-gold px-7 py-3 text-sm font-semibold tracking-wide text-ink transition-all hover:bg-gold-light active:scale-[0.98]"
      >
        {t("home.quickBirthGo", "Show birthday facts")}
      </button>
    </form>
  );
}