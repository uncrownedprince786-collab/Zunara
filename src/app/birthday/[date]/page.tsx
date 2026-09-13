import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLdScript } from "@/components/ui/json-ld";
import {
  birthdayDates,
  parseBirthdayDate,
} from "@/lib/calendar/birthday-routes";
import { celebritiesForDate } from "@/lib/content/celebrities";
import { zodiacForDate } from "@/lib/zodiac/zodiac";
import { absoluteUrl } from "@/lib/seo/site";
import { pageMetadata } from "@/lib/seo/metadata";
import { birthdayItemListJsonLd } from "@/lib/seo/jsonld";
import { LocaleDate } from "@/components/ui/locale-date";
import { BirthdayLive } from "./birthday-client";
import { OnThisDay } from "@/components/home/on-this-day";

export const revalidate = 86400;
export const dynamicParams = false;

interface BirthdayPageProps {
  params: Promise<{ date: string }>;
}

function dateLabel(month: number, day: number): string {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(Date.UTC(2000, month - 1, day));
}

export function generateStaticParams() {
  return birthdayDates().map(({ date }) => ({ date }));
}

export async function generateMetadata({ params }: BirthdayPageProps): Promise<Metadata> {
  const { date } = await params;
  const parsed = parseBirthdayDate(date);
  if (!parsed) return {};
  const label = dateLabel(parsed.month, parsed.day);
  return pageMetadata(
    `/birthday/${date}`,
    `Famous Birthdays on ${label}`,
    `Notable actors, musicians, athletes, leaders and more born on ${label}, their zodiac signs and their stories — verified from Wikidata and updated live.`,
    "article",
    [
      `famous birthdays ${label}`,
      `people born on ${label}`,
      "celebrity birthdays on this day",
      `zodiac sign for ${label}`,
      "who shares my birthday",
    ],
  );
}

export default async function BirthdayPage({ params }: BirthdayPageProps) {
  const { date } = await params;
  const parsed = parseBirthdayDate(date);
  if (!parsed) notFound();

  const { month, day } = parsed;
  const label = dateLabel(month, day);
  const people = celebritiesForDate(month, day);
  const sign = zodiacForDate(2000, month, day);
  const traitWords = sign.traits.slice(0, 4).map((t) => t.toLowerCase());
  const traitText =
    traitWords.length > 1
      ? `${traitWords.slice(0, -1).join(", ")} and ${traitWords[traitWords.length - 1]}`
      : traitWords[0];

  return (
    <div className="constellation-bg">
      <JsonLdScript
        data={birthdayItemListJsonLd(month, day, people, absoluteUrl(`/birthday/${date}`))}
      />
      <div className="mx-auto max-w-5xl px-4 pt-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs items={[{ label: "Famous Birthdays", href: "/famous-birthdays" }, { label, href: `/birthday/${date}` }]} />
        </div>
        <header className="mx-auto mt-8 max-w-3xl text-center">
          <p className="kicker">Famous birthdays by date</p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-4 w-20" />
          <h1 className="mt-6 font-display text-4xl leading-tight text-starlight sm:text-6xl">
            People born on <LocaleDate month={month} day={day} />
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
            Who else shares this birthday? The notable names below are synced live
            from Wikidata and paired with their zodiac sign — the same sign anyone
            born on this day carries.
          </p>
          <Link
            href={`/horoscope/${sign.slug}/today`}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-6 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/20"
          >
            Born on {label}? Read your {sign.name} horoscope &rarr;
          </Link>
        </header>
      </div>
      <BirthdayLive month={month} day={day} initial={people} />
      <section
        aria-labelledby="sign-connection-heading"
        className="mx-auto max-w-3xl px-4 sm:px-6"
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl saturate-180 sm:p-8">
          <p className="kicker">The shared sign</p>
          <h2
            id="sign-connection-heading"
            className="mt-3 font-display text-2xl text-starlight sm:text-3xl"
          >
            Everyone born on {label} is a {sign.name}
          </h2>
          <p className="mt-3 text-sm leading-6 text-p-muted">
            {sign.name} is a {sign.element.toLowerCase()} {sign.modality.toLowerCase()}{" "}
            sign ruled by {sign.ruler}, associated with being {traitText}. Anyone born
            on {label} shares that sign and reads the same {sign.name} horoscope.
          </p>
          <Link
            href={`/horoscope/${sign.slug}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold/80"
          >
            Explore the {sign.name} sign — dates, traits &amp; horoscopes &rarr;
          </Link>
        </div>
      </section>
      <OnThisDay month={month} day={day} />
    </div>
  );
}