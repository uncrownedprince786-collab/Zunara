"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { getGlossaryEntry } from "@/lib/content/glossary";

interface AstroTermProps {
  term: string;
  definition?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Inline rendered glossary term. Clicking or focusing the term opens a small,
 * accessible popover with the entry's plain-English definition. The popover is
 * positioned absolutely within a relative inline wrapper so it does not disturb
 * surrounding table or paragraph layout.
 */
export function AstroTerm({
  term,
  definition,
  children,
  className = "",
}: AstroTermProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const popRef = useRef<HTMLSpanElement>(null);

  const entry = getGlossaryEntry(term);
  const body = definition ?? entry?.definition ?? "";

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    function onPointer(e: MouseEvent) {
      const t = e.target as Node;
      if (
        wrapRef.current &&
        popRef.current &&
        !wrapRef.current.contains(t) &&
        !popRef.current.contains(t)
      ) {
        close();
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  return (
    <span ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className={`cursor-help border-b border-dashed border-gold/40 text-gold-deep underline decoration-gold/30 underline-offset-2 transition-colors hover:text-gold ${className}`}
      >
        {children ?? term}
      </button>
      {open && body && (
        <span
          ref={popRef}
          role="dialog"
          aria-label={`${term} definition`}
          className="absolute z-50 mt-1 block w-64 max-w-xs rounded-xl border border-white/10 bg-ink/95 p-3 text-xs leading-5 text-muted shadow-2xl backdrop-blur-xl"
        >
          <span className="mb-0.5 block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gold">
            {entry?.category ?? "Astrology"}
          </span>
          {body}
        </span>
      )}
    </span>
  );
}
