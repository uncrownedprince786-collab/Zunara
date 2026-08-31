import Link from "next/link";
import type { PeriodType } from "@/lib/calendar/periods";

const TABS: Array<{ type: PeriodType; label: string }> = [
  { type: "daily", label: "Daily" },
  { type: "weekly", label: "Weekly" },
  { type: "monthly", label: "Monthly" },
  { type: "yearly", label: "Yearly" },
];

interface PeriodTabsProps {
  signSlug: string;
  active: PeriodType;
  basePath?: (sign: string) => string;
}

export function PeriodTabs({ signSlug, active, basePath }: PeriodTabsProps) {
  const makePath = (sign: string, type: PeriodType) =>
    basePath
      ? basePath(sign)
      : type === "daily"
        ? `/horoscope/${sign}/today`
        : `/horoscope/${sign}/${type}`;

  return (
    <nav aria-label="Forecast period" className="inline-flex rounded-full border border-line bg-obsidian p-1">
      {TABS.map((tab) => {
        const isActive = tab.type === active;
        return (
          <Link
            key={tab.type}
            href={makePath(signSlug, tab.type)}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              isActive
                ? "bg-gold/15 text-gold"
                : "text-muted hover:text-starlight"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
