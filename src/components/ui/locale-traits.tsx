"use client";

import { useLocale } from "@/lib/i18n/client";
import { signTraits, signDescription } from "@/lib/content/sign-traits-i18n";

/**
 * Renders a zodiac sign's traits as pills in the ACTIVE locale. Server-rendered
 * pages (home, library, horoscope) can't read the client locale inline, so they
 * delegate the trait pills to this client island. Each pill is a `<span>` with
 * the caller's `itemClassName`, matching the page's existing styling.
 */
export function LocaleTraits({
  slug,
  limit,
  itemClassName,
  as: Tag = "span",
}: {
  slug: string;
  limit?: number;
  itemClassName?: string;
  as?: "span" | "li";
}) {
  const { locale } = useLocale();
  const traits = signTraits(slug, locale);
  const shown = typeof limit === "number" ? traits.slice(0, limit) : traits;
  return (
    <>
      {shown.map((trait) => (
        <Tag key={trait} className={itemClassName}>
          {trait}
        </Tag>
      ))}
    </>
  );
}

/** Renders a sign's description paragraph in the active locale (server pages). */
export function LocaleSignDescription({ slug }: { slug: string }) {
  const { locale } = useLocale();
  return <>{signDescription(slug, locale)}</>;
}
