"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/client";

const LINKS = [
  { href: "/horoscope", key: "horoscopes" as const },
  { href: "/birthchart", key: "birthchart" as const },
  { href: "/cosmic-facts", key: "cosmicFacts" as const },
  { href: "/sky-events", key: "astronomy" as const },
  { href: "/about", key: "about" as const },
];

export function SiteNav({ labels }: { labels?: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { dict, t } = useLocale();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  const items = LINKS.map((l) => ({
    href: l.href,
    label: labels?.[l.key] ?? dict.nav[l.key] ?? l.key,
  }));

  return (
    <nav aria-label={dict.nav.publication}>
      <div className="hidden items-center gap-6 md:flex">
        {items.map((l) => {
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className="group relative text-[0.8rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-gold"
            >
              {l.label}
              <span
                aria-hidden="true"
                className={`absolute -bottom-1.5 start-0 h-px bg-gold transition-all duration-300 ${
                  active ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center text-muted md:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t("header.closeMenu", "Close menu") : t("header.openMenu", "Open menu")}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>
      {open && (
        <div
          id="mobile-menu"
          aria-label={dict.nav.menu}
          className="absolute inset-x-0 top-16 z-50 max-h-[70vh] overflow-y-auto border-b border-white/[0.08] bg-ink/95 px-4 py-2 shadow-2xl backdrop-blur-xl saturate-180 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {items.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2.5 text-sm leading-snug tracking-wide text-muted transition-colors hover:bg-white/[0.04] hover:text-gold ${isActive(l.href) ? "text-gold" : ""}`}
                aria-current={isActive(l.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}