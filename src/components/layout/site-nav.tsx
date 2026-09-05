"use client";

import { useEffect, useRef, useState } from "react";
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

const TOOLS = [
  { href: "/synastry", key: "synastry" as const, fallback: "Synastry" },
  { href: "/daily-transit", key: "dailyTransit" as const, fallback: "Daily Transit" },
  { href: "/sky-map", key: "skyMap" as const, fallback: "Sky Map" },
];

export function SiteNav({ labels }: { labels?: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t, dict } = useLocale();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  const items = LINKS.map((l) => ({
    href: l.href,
    label: labels?.[l.key] ?? dict.nav[l.key] ?? l.key,
  }));

  const toolsItems = TOOLS.map((tool) => ({
    href: tool.href,
    label: t(`nav.${tool.key}`, tool.fallback),
    active: isActive(tool.href),
  }));

  // Close the Tools popover on outside click and Escape.
  useEffect(() => {
    if (!toolsOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setToolsOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [toolsOpen]);

  return (
    <nav aria-label={t("nav.publication", "Primary")}>
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

        {/* Tools popover (desktop) */}
        <div ref={toolsRef} className="relative">
          <button
            type="button"
            aria-expanded={toolsOpen}
            aria-haspopup="menu"
            aria-controls="tools-menu"
            onClick={() => setToolsOpen((v) => !v)}
            className="group relative inline-flex items-center gap-1.5 text-[0.8rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-gold"
          >
            {t("nav.tools", "Tools")}
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              className={`transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
            <span
              aria-hidden="true"
              className={`absolute -bottom-1.5 start-0 h-px bg-gold transition-all duration-300 ${
                toolsOpen ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </button>
          {toolsOpen && (
            <div
              id="tools-menu"
              role="menu"
              className="absolute start-0 top-full z-50 mt-3 w-52 overflow-hidden rounded-xl border border-white/10 bg-ink/95 p-2 shadow-2xl backdrop-blur-xl saturate-180"
            >
              {toolsItems.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  role="menuitem"
                  aria-current={tool.active ? "page" : undefined}
                  onClick={() => setToolsOpen(false)}
                  className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/[0.06] hover:text-gold ${
                    tool.active ? "text-gold" : ""
                  }`}
                >
                  {tool.label}
                  {tool.active && (
                    <span aria-hidden="true" className="text-gold">•</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center text-muted md:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{t("nav.menuToggle", "Toggle navigation menu")}</span>
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
        <div id="mobile-menu" className="absolute inset-x-0 top-16 z-50 border-b border-white/[0.08] bg-ink/95 px-4 py-4 shadow-2xl backdrop-blur-xl saturate-180 md:hidden">
          <div className="flex flex-col gap-3">
            {items.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm tracking-wide text-muted transition-colors hover:text-gold ${isActive(l.href) ? "text-gold" : ""}`}
                aria-current={isActive(l.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-white/10 pt-3">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-subdued">
                {t("nav.tools", "Tools")}
              </p>
              <div className="mt-2 flex flex-col gap-3">
                {toolsItems.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`text-sm tracking-wide text-muted transition-colors hover:text-gold ${tool.active ? "text-gold" : ""}`}
                    aria-current={tool.active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {tool.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}