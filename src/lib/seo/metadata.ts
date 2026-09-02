import type { Metadata } from "next";
import type { ZodiacSign } from "@/lib/zodiac/zodiac";
import type { PeriodType } from "@/lib/calendar/periods";
import { SITE, absoluteUrl } from "./site";

const PERIOD_TITLE: Record<PeriodType, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

export function horoscopeMetadata(
  sign: ZodiacSign,
  periodType: PeriodType,
  label: string,
): Metadata {
  const periodNoun = PERIOD_TITLE[periodType];
  const path = `/horoscope/${sign.slug}/${periodType === "daily" ? "today" : periodType}`;
  const canonical = absoluteUrl(path);
  const title = `${sign.name} ${periodNoun} Horoscope — ${label}`;
  const description = `Read the ${sign.name.toLowerCase()} ${periodType.toLowerCase()} horoscope for ${label}. Calculated from real astronomical data, in ${sign.name}'s ${sign.element} ${sign.modality} sign.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
    },
  };
}

export function signIndexMetadata(sign: ZodiacSign): Metadata {
  const canonical = absoluteUrl(`/horoscope/${sign.slug}`);
  const title = `${sign.name} Zodiac Sign`;
  const description = `Discover the ${sign.name} zodiac sign's ${sign.modality.toLowerCase()} ${sign.element.toLowerCase()} nature, elements, modal qualities and horoscopes. Dates ${formatRange(sign)}.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

function formatRange(sign: ZodiacSign): string {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const s = sign.dateRange.startMonth - 1;
  const e = sign.dateRange.endMonth - 1;
  return `${months[s]} ${sign.dateRange.startDay} – ${months[e]} ${sign.dateRange.endDay}`;
}

export const siteUrl = SITE.url;
