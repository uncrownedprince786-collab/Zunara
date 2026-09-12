"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/client";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <div className="constellation-bg">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-28 text-center sm:px-6">
        <span className="font-display text-7xl font-medium text-gold/60">404</span>
        <div aria-hidden="true" className="gold-rule mt-6 w-24" />
        <h1 className="mt-8 font-display text-3xl text-starlight sm:text-4xl">
          {t("notFound.title", "We can't find that page")}
        </h1>
        <p className="mt-4 max-w-md leading-7 text-muted">
          {t("notFound.desc", "The page may have moved, or the link may be broken. Try the homepage or browse the horoscopes below.")}
        </p>
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-gold px-7 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
          >
            {t("nav.home", "Return home")}
          </Link>
          <Link
            href="/horoscope"
            className="rounded-full border border-line px-7 py-3 text-sm text-muted transition-colors hover:border-gold/40 hover:text-starlight"
          >
            {t("common.browseSigns", "Browse the horoscopes")}
          </Link>
        </div>
      </div>
    </div>
  );
}
