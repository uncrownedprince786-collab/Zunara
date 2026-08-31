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
    <nav aria-label="Forecast period" className="inline-flex items-center gap-1 border-b border-line">
      {TABS.map((tab) => {
        const isActive = tab.type === active;
        return (
          <Link
            key={tab.type}
            href={makePath(signSlug, tab.type)}
            aria-current={isActive ? "page" : undefined}
            className={`px-5 py-2.5 text-[0.8rem] uppercase tracking-[0.16em] transition-colors ${
              isActive
                ? "border-b-2 border-gold text-gold"
                : "border-b-2 border-transparent text-subdued hover:text-starlight"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
