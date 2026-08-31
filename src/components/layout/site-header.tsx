import Link from "next/link";
import { SiteNav } from "./site-nav";

export function StarMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className="text-gold">
      <path d="M12 4v16M4 12h16M6.5 6.5l11 11M17.5 6.5l-11 11" opacity="0.9" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-void/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl tracking-tight text-starlight"
          aria-label="Zunara home"
        >
          <StarMark />
          <span>Zunara</span>
        </Link>
        <span className="hidden text-xs uppercase tracking-[0.2em] text-subdued md:block">
          Written in the stars
        </span>
        <SiteNav />
      </div>
    </header>
  );
}
