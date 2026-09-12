import type { Metadata } from "next";
import type { ZodiacSign } from "@/lib/zodiac/zodiac";
import type { PeriodType } from "@/lib/calendar/periods";
import { SITE, absoluteUrl } from "./site";
import { LOCALES } from "@/lib/i18n/dictionaries";

const PERIOD_TITLE: Record<PeriodType, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

const socialImages = { images: [absoluteUrl(SITE.image)] };
const twitterMeta = { site: SITE.twitter, creator: SITE.twitter, images: [absoluteUrl(SITE.image)] };

/**
 * hreflang mapping: every page exists once and is served in all five locales
 * through the client-side language switcher, so all five language codes plus
 * `x-default` point at the same canonical URL.
 */
export function alternateLanguages(path: string): Record<string, string> {
  const url = absoluteUrl(path);
  const out: Record<string, string> = { "x-default": url };
  for (const l of LOCALES) out[l.code] = url;
  return out;
}

/** Shared OG/Twitter card fields, spread into a page's supplied openGraph/twitter. */
export function shareMeta(url: string, title: string, description: string) {
  return {
    openGraph: {
      title,
      description,
      url,
      type: "website" as const,
      siteName: SITE.name,
      ...socialImages,
    },
    twitter: { card: "summary_large_image" as const, title, description, ...twitterMeta },
  };
}

export function horoscopeMetadata(
  sign: ZodiacSign,
  periodType: PeriodType,
  label: string,
): Metadata {
  const periodNoun = PERIOD_TITLE[periodType];
  const path = `/horoscope/${sign.slug}/${periodType === "daily" ? "today" : periodType}`;
  const canonical = absoluteUrl(path);
  const title = `${sign.name} ${periodNoun} Horoscope — ${label}`;
  const description = `Read the ${sign.name} ${periodType.toLowerCase()} horoscope for ${label}, calculated from real planetary positions for ${sign.name}, a ${sign.element} ${sign.modality} sign.`;

  return {
    title,
    description,
    alternates: { canonical, languages: alternateLanguages(path) },
    keywords: [
      `${sign.name} ${periodNoun.toLowerCase()} horoscope`,
      `${sign.name.toLowerCase()} ${periodType.toLowerCase()} forecast`,
      "zodiac horoscope today",
      "astronomy-based horoscope",
    ],
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      siteName: SITE.name,
      ...socialImages,
    },
    twitter: { card: "summary_large_image", title, description, ...twitterMeta },
  };
}

export function signIndexMetadata(sign: ZodiacSign): Metadata {
  const canonical = absoluteUrl(`/horoscope/${sign.slug}`);
  const title = `${sign.name} Zodiac Sign`;
  const description = `${sign.name} dates, element, modality and personality traits, plus daily, weekly, monthly and yearly ${sign.name} horoscopes. Born ${formatRange(sign)}.`;
  return {
    title,
    description,
    alternates: { canonical, languages: alternateLanguages(`/horoscope/${sign.slug}`) },
    keywords: [`${sign.name.toLowerCase()} zodiac sign`, `${sign.name.toLowerCase()} horoscope`, `${sign.name.toLowerCase()} dates`, "zodiac sign meanings"],
    openGraph: { title, description, url: canonical, type: "website", siteName: SITE.name, ...socialImages },
    twitter: { card: "summary_large_image", title, description, ...twitterMeta },
  };
}

export function pageMetadata(
  path: string,
  title: string,
  description: string,
  type: "website" | "article" = "website",
  keywords: string[] = [],
): Metadata {
  const canonical = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical, languages: alternateLanguages(path) },
    keywords,
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      siteName: SITE.name,
      ...socialImages,
    },
    twitter: { card: "summary_large_image", title, description, ...twitterMeta },
  };
}

function formatRange(sign: ZodiacSign): string {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const s = sign.dateRange.startMonth - 1;
  const e = sign.dateRange.endMonth - 1;
  return `${months[s]} ${sign.dateRange.startDay} – ${months[e]} ${sign.dateRange.endDay}`;
}

export const siteUrl = SITE.url;
