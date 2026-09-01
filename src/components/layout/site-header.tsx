import Link from "next/link";
import { SiteNav } from "./site-nav";
import { ThemeToggle } from "./theme-toggle";
import { StarMark } from "./star-mark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-starlight"
          aria-label="Zunara home"
        >
          <StarMark className="h-5 w-5 text-gold transition-transform duration-500 group-hover:rotate-90" />
          <span className="font-display text-[1.35rem] font-medium tracking-tight">
            Zunara
          </span>
        </Link>
        <span className="hidden text-[0.62rem] uppercase tracking-[0.34em] text-subdued lg:block">
          An editorial journal of the celestial
        </span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SiteNav />
        </div>
      </div>
      <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </header>
  );
}
