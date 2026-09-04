"use client";

import type { ReactNode } from "react";
import type { NatalReadings } from "@/lib/natal/types";
import { useLocale } from "@/lib/i18n/client";

const ICONS: Record<string, ReactNode> = {
  love: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  career: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
      <path d="M12 22V15.5" />
      <path d="M22 8.5V15.5" />
      <path d="M2 8.5V15.5" />
    </svg>
  ),
  wealth: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  life: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
};

interface ReadingCardProps {
  reading: NatalReadings["love"];
}

function ReadingCard({ reading }: ReadingCardProps) {
  const { t } = useLocale();
  return (
    <div className="glass rounded-2xl p-6 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-gold/10 p-2 text-gold">{ICONS[reading.key]}</div>
        <div>
          <h3 className="font-display text-lg font-medium text-starlight">{reading.title}</h3>
          <p className="text-xs text-muted">{reading.headline}</p>
        </div>
      </div>
      <p className="text-sm leading-6 text-starlight/90">{reading.body}</p>
      <details className="text-xs text-muted border-t border-white/5 pt-3">
        <summary className="cursor-pointer select-none mb-1">{t("common.drivingPlacements", "Driving placements")}</summary>
        <ul className="space-y-1 pl-4 list-disc">
          {reading.drivers.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

interface NatalReadingCardsProps {
  readings: NatalReadings;
}

export function NatalReadingCards({ readings }: NatalReadingCardsProps) {
  const ordered = [readings.love, readings.career, readings.wealth, readings.life];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ordered.map((r) => (
        <ReadingCard key={r.key} reading={r} />
      ))}
    </div>
  );
}