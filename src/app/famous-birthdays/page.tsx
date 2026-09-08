import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { celebritiesForDate } from "@/lib/content/celebrities";
import { startOfUtcDay } from "@/lib/astronomy/astro";
import { pageMetadata } from "@/lib/seo/metadata";
import { FamousBirthdaysHub } from "@/components/celebrities/famous-birthdays-hub";

export const revalidate = 3600;

export const metadata = pageMetadata(
  "/famous-birthdays",
  "Famous Birthdays — Browse Celebrity Birthdays by Date",
  "Explore famous people born on any day of the year. Filter by actors, musicians, scientists, athletes and more — live from Wikidata.",
  "website",
  [
    "famous birthdays",
    "celebrity birthdays by date",
    "who shares my birthday",
    "born today famous people",
    "birthday explorer",
  ],
);

export default function FamousBirthdaysPage() {
  const today = startOfUtcDay();
  const month = today.getUTCMonth() + 1;
  const day = today.getUTCDate();
  const initial = celebritiesForDate(month, day);

  return (
    <div className="constellation-bg">
      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <div className="flex justify-center">
          <Breadcrumbs items={[{ label: "Famous Birthdays", href: "/famous-birthdays" }]} />
        </div>
        <header className="mx-auto mt-8 max-w-3xl text-center">
          <p className="kicker">Explore by date</p>
          <div aria-hidden="true" className="gold-rule mx-auto mt-4 w-20" />
          <h1 className="mt-6 font-display text-4xl leading-tight text-starlight sm:text-6xl">
            Famous Birthdays
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">
            Browse the famous people born on any day of the year. Filter by
            profession, explore categories, and discover who shares your birthday.
          </p>
        </header>
      </div>
      <FamousBirthdaysHub
        initialMonth={month}
        initialDay={day}
        initialPeople={initial}
      />
    </div>
  );
}
