"use client";

import Link from "next/link";
import type { PeriodType } from "@/lib/calendar/periods";
import { useLocale } from "@/lib/i18n/client";

const TABS: PeriodType[] = ["daily", "weekly", "monthly", "yearly"];

interface PeriodTabsProps {
  signSlug: string;
  active: PeriodType;
  basePath?: (sign: string) => string;
}

export function PeriodTabs({ signSlug, active, basePath }: PeriodTabsProps) {
  const { tHorizon, t } = useLocale();
  const makePath = (sign: string, type: PeriodType) =>
    basePath
      ? basePath(sign)
      : type === "daily"
        ? `/horoscope/${sign}/today`
        : `/horoscope/${sign}/${type}`;

  return (
    <nav aria-label={t("horoscope.chooseHorizon", "Forecast period")} className="inline-flex items-center gap-1 border-b border-line">
      {TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <Link
            key={tab}
            href={makePath(signSlug, tab)}
            aria-current={isActive ? "page" : undefined}
            className={`px-5 py-2.5 text-[0.8rem] uppercase tracking-[0.16em] transition-colors ${
              isActive
                ? "border-b-2 border-gold text-gold"
                : "border-b-2 border-transparent text-subdued hover:text-starlight"
            }`}
          >
            {tHorizon(tab)}
          </Link>
        );
      })}
    </nav>
  );
}
