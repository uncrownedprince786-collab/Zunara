"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { GLOSSARY } from "@/lib/content/glossary";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { CELESTIAL_BODIES } from "@/lib/astronomy/bodies";
import { HOUSES } from "@/lib/houses/house-content";
import { useLocale } from "@/lib/i18n/client";

interface ResultItem {
  id: string;
  label: string;
  hint?: string;
  href?: string;
  group: "tools" | "concepts" | "pages";
}

const TOOLS: { href: string; key: string; fallback: string; keywords?: string }[] = [
  { href: "/yoursky", key: "yourSky", fallback: "Your Sky", keywords: "daily transit personalized personal transits forecast" },
  { href: "/horoscope", key: "horoscopes", fallback: "Daily Horoscopes", keywords: "zodiac signs today daily weekly monthly yearly" },
  { href: "/birthchart", key: "birthchart", fallback: "Birth Chart", keywords: "natal chart calculator big three rising sun moon" },
  { href: "/synastry", key: "synastry", fallback: "Compatibility", keywords: "synastry love relationship aspects two charts" },
  { href: "/sky-now", key: "skyNow", fallback: "Sky Now", keywords: "planet positions live retrograde moon phase aspects" },
  { href: "/sky-map", key: "skyMap", fallback: "Sky Map", keywords: "interactive night sky viewer stars telescope" },
  { href: "/sky-events", key: "astronomy", fallback: "Sky Events", keywords: "meteor showers eclipses full moon solstice equinox" },
  { href: "/retrograde", key: "retrogradeNav", fallback: "Retrogrades", keywords: "retrograde calendar mercury mars venus" },
  { href: "/ephemeris", key: "ephemeris", fallback: "Ephemeris", keywords: "planetary positions table degrees longitude" },
  { href: "/famous-birthdays", key: "famousBirthdays", fallback: "Famous Birthdays", keywords: "celebrities born today birthday shares" },
  { href: "/library", key: "library", fallback: "Library", keywords: "glossary terms guide reference" },
];

export function CommandSearch() {
  const { t, dict } = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape" && openRef.current) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      return () => {
        document.body.style.overflow = "";
        cancelAnimationFrame(raf);
      };
    }
  }, [open]);

  const results = useMemo<ResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    const out: ResultItem[] = [];
    if (!q) return out;

    const match = (fields: string[]) => fields.some((f) => f.toLowerCase().includes(q));

    for (const tool of TOOLS) {
      const label = dict.navExtra?.[tool.key as keyof typeof dict.navExtra] ?? (dict.nav[tool.key as keyof typeof dict.nav] as string | undefined)
        ?? (dict.nav?.synastry && tool.key === "synastry" ? dict.nav.synastry : undefined)
        ?? tool.fallback;
      if (match([label, tool.key, tool.fallback, tool.keywords ?? ""])) {
        out.push({ id: `tool-${tool.href}`, label, hint: tool.href, href: tool.href, group: "tools" });
      }
    }

    for (const entry of GLOSSARY) {
      const label = entry.term;
      if (match([label, entry.definition, entry.category])) {
        out.push({ id: `concept-${entry.term}`, label, hint: entry.definition, group: "concepts" });
      }
    }

    for (const sign of ZODIAC_SIGNS) {
      const label = t(`signs.${sign.slug}`, sign.name);
      if (match([sign.name, label, sign.slug, ...sign.traits])) {
        out.push({ id: `sign-${sign.slug}`, label, hint: `${sign.name} · ${t("horizons.today", "Today")}`, href: `/horoscope/${sign.slug}/today`, group: "pages" });
      }
    }

    for (const body of CELESTIAL_BODIES) {
      if (body.key === "northNode" || body.key === "southNode") continue;
      const label = t(`planets.${body.key}`, body.name);
      if (match([body.name, label, body.description])) {
        out.push({ id: `planet-${body.key}`, label, hint: body.description, href: `/planets/${body.key}`, group: "pages" });
      }
    }

    for (const house of HOUSES) {
      const label = `House ${house.number}`;
      if (match([label, house.title, house.nature])) {
        out.push({ id: `house-${house.number}`, label, hint: house.title, href: `/houses/${house.number}`, group: "pages" });
      }
    }

    return out;
  }, [query, t, dict]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const openResult = (item: ResultItem) => {
    if (item.href) {
      window.location.href = item.href;
    }
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((v) => (v + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((v) => (v - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      openResult(results[active]);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(results.length - 1);
    }
  };

  const groups: ("tools" | "concepts" | "pages")[] = ["tools", "concepts", "pages"];
  const groupLabel: Record<ResultItem["group"], string> = {
    tools: dict.search?.toolsLabel ?? "Tools",
    concepts: dict.search?.conceptsLabel ?? "Concepts",
    pages: dict.search?.pagesLabel ?? "Guides",
  };
  let flatIndex = -1;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.search?.ariaOpen ?? "Open search"}
        title={dict.search?.label ?? "Search"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:text-gold"
      >
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/70 p-4 pt-20 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={dict.search?.label ?? "Search"}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-cosmic/95 shadow-2xl backdrop-blur-xl saturate-180"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0 text-gold" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                role="combobox"
                aria-expanded="true"
                aria-controls="search-results"
                aria-autocomplete="list"
                placeholder={dict.search?.placeholder ?? "Try Saturn return, Venus in 7th house, Virgo, birth chart…"}
                className="h-14 flex-1 bg-transparent text-sm text-starlight outline-none placeholder:text-subdued"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={dict.search?.ariaClose ?? "Close search"}
                className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[0.65rem] uppercase tracking-wider text-subdued transition-colors hover:text-gold"
              >
                esc
              </button>
            </div>

            <div id="search-results" role="listbox" aria-label={dict.search?.label ?? "Search"} className="max-h-[55vh] overflow-y-auto p-2">
              {!query.trim() ? (
                <p className="px-3 py-8 text-center text-sm text-subdued">
                  {dict.search?.empty ?? "Start typing to search tools, concepts and pages."}
                </p>
              ) : results.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-subdued">
                  {dict.search?.noResults ?? "No matches. Try a simpler term such as a sign name or a planet."}
                </p>
              ) : (
                groups.map((group) => {
                  const items = results.filter((r) => r.group === group);
                  if (!items.length) return null;
                  return (
                    <div key={group} role="presentation">
                      <p className="px-3 pb-1 pt-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gold">{groupLabel[group]}</p>
                      <ul role="presentation">
                        {items.map((item) => {
                          flatIndex += 1;
                          const idx = flatIndex;
                          const selected = idx === active;
                          return (
                            <li key={item.id} id={`search-opt-${idx}`} role="option" aria-selected={selected}>
                              {item.href ? (
                                <Link
                                  href={item.href}
                                  onClick={() => setOpen(false)}
                                  onMouseEnter={() => setActive(idx)}
                                  className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${selected ? "bg-gold/10 text-gold" : "text-starlight"}`}
                                >
                                  <span className="truncate">{item.label}</span>
                                  <span className="shrink-0 text-[0.65rem] uppercase tracking-wider text-subdued">{item.hint}</span>
                                </Link>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setOpen(false)}
                                  onMouseEnter={() => setActive(idx)}
                                  className={`flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-start text-sm transition-colors ${selected ? "bg-white/[0.06]" : ""}`}
                                >
                                  <span className="min-w-0">
                                    <span className="block truncate text-starlight">{item.label}</span>
                                    <span className="block truncate text-xs text-subdued">{item.hint}</span>
                                  </span>
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}