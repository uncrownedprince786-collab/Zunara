"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { GuidanceSection } from "@/lib/natal/guidance";
import { useLocale } from "@/lib/i18n/client";

interface LifePillarsProps {
  sections: GuidanceSection[];
}

export function LifePillars({ sections }: LifePillarsProps) {
  const { t } = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = Math.min(activeIndex, Math.max(sections.length - 1, 0));
  const section = sections[current];

  const focus = (index: number) => {
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight": {
        event.preventDefault();
        const next = (current + 1) % sections.length;
        setActiveIndex(next);
        focus(next);
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        const prev = (current - 1 + sections.length) % sections.length;
        setActiveIndex(prev);
        focus(prev);
        break;
      }
      case "Home": {
        event.preventDefault();
        setActiveIndex(0);
        focus(0);
        break;
      }
      case "End": {
        event.preventDefault();
        setActiveIndex(sections.length - 1);
        focus(sections.length - 1);
        break;
      }
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
      <div
        role="tablist"
        aria-label={t("birthchart.guidanceTabs", "Life guidance pillars")}
        onKeyDown={handleKeyDown}
        className="flex flex-wrap gap-x-1 gap-y-2 border-b border-white/10"
      >
        {sections.map((s, index) => {
          const selected = index === current;
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`pillar-tab-${s.id}`}
              aria-selected={selected}
              aria-controls={`pillar-panel-${s.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              className={`border-b-2 pb-3 pr-4 pt-1 text-left text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                selected
                  ? "border-gold text-gold"
                  : "border-transparent text-muted hover:text-starlight"
              }`}
            >
              <span className="mr-2 text-gold/70">0{index + 1}</span>
              {t(`birthchart.pillar.${s.id}`, s.title)}
            </button>
          );
        })}
      </div>

      <div
        key={section.id}
        role="tabpanel"
        id={`pillar-panel-${section.id}`}
        aria-labelledby={`pillar-tab-${section.id}`}
        tabIndex={0}
        className="pt-7"
      >
        <h3 className="font-display text-xl text-starlight sm:text-2xl">{section.headline}</h3>
        <div className="mt-4 space-y-4">
          {section.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-sm leading-7 text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}