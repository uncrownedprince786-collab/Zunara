"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALES, type Locale } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/client";

export function LanguageSwitcher({ id = "lang-switcher" }: { id?: string }) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPress(e: MouseEvent | TouchEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPress);
    document.addEventListener("touchstart", onPress);
    return () => {
      document.removeEventListener("mousedown", onPress);
      document.removeEventListener("touchstart", onPress);
    };
  }, []);

  function select(next: Locale) {
    setLocale(next);
    setOpen(false);
  }

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-muted backdrop-blur-sm transition-colors hover:border-gold/40 hover:text-gold"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
      >
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a15.5 15.5 0 0 1 0 18M12 3a15.5 15.5 0 0 0 0 18" />
          </svg>
        </span>
        <span>{current.label}</span>
        <span aria-hidden="true" className="text-[0.6rem]">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <ul
          id={`${id}-menu`}
          role="listbox"
          className="absolute end-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-ink/95 p-1.5 shadow-2xl backdrop-blur-xl saturate-180"
        >
          {LOCALES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === locale}
                onClick={() => select(l.code)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-start text-sm transition-colors ${
                  l.code === locale ? "bg-white/[0.06] text-gold" : "text-muted hover:bg-white/[0.04] hover:text-starlight"
                }`}
              >
                <span className="truncate">{l.label}</span>
                {l.dir === "rtl" && <span className="text-[0.6rem] text-subdued">RTL</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
