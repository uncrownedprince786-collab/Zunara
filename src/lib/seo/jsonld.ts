import type { Celebrity } from "@/lib/content/celebrities";
import { SITE, absoluteUrl } from "./site";
import { LOCALES } from "@/lib/i18n/dictionaries";

export type JsonLdData = Record<string, unknown>;

const ORGANIZATION: JsonLdData = {
  "@type": "Organization",
  name: SITE.orgName,
  url: SITE.url,
};

/** Root WebSite + publisher, used on the homepage. */
export function websiteJsonLd(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: LOCALES.map((l) => l.code),
    publisher: ORGANIZATION,
  };
}

/** Free browser tool (birth chart calculator, synastry, transit reader). */
export function softwareApplicationJsonLd(
  name: string,
  description: string,
  url: string,
): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: ORGANIZATION,
  };
}

/** A single Person entity, linkable from lists and profiles. */
export function personJsonLd(person: Celebrity): JsonLdData {
  return {
    "@type": "Person",
    name: person.name,
    url: person.url,
    ...(person.star ? { description: person.star } : {}),
    ...(person.profession ? { jobTitle: person.profession } : {}),
    ...(person.image ? { image: person.image } : {}),
  };
}

/** Ranked list of notable people born on a given date. */
export function birthdayItemListJsonLd(
  month: number,
  day: number,
  people: Celebrity[],
  url: string,
): JsonLdData {
  const key = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const label = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(Date.UTC(2000, month - 1, day));
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Notable people born on ${label}`,
    alternateName: `${key} birthday list`,
    url,
    numberOfItems: people.length,
    itemListElement: people.map((person, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: personJsonLd(person),
    })),
  };
}

/** FAQ block, mostly for the knowledge-base pages. */
export function faqJsonLd(
  mainEntity: { question: string; answer: string }[],
): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: mainEntity.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}