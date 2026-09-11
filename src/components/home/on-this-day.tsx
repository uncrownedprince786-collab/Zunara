import { LocaleText } from "@/components/ui/locale-text";
import { LocaleDate } from "@/components/ui/locale-date";
import { onThisDay } from "@/lib/content/on-this-day";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function OnThisDay({ month, day }: { month: number; day: number }) {
  const events = onThisDay(month, day).sort((a, b) => a.year - b.year);
  if (events.length === 0) return null;

  const wikiUrl = `https://en.wikipedia.org/wiki/${MONTHS[month - 1]}_${day}`;

  return (
    <section
      aria-labelledby="on-this-day-heading"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6"
    >
      <div className="flex items-end justify-between border-b border-line-soft pb-5">
        <div>
          <p className="kicker">
            <LocaleText path="history.kicker" fallback="On this day" />
          </p>
          <h2
            id="on-this-day-heading"
            className="mt-3 font-display text-3xl text-starlight sm:text-4xl"
          >
            {month != null && day != null && <LocaleDate month={month} day={day} />}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            <LocaleText
              path="history.subtitle"
              fallback="Extraordinary moments that happened on this day in history."
            />
          </p>
        </div>
        <a
          href={wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-starlight transition-colors hover:border-gold/40 hover:bg-white/[0.08] sm:inline-flex"
        >
          <LocaleText
            path="history.readMore"
            fallback="Full timeline on Wikipedia"
          />
          <span aria-hidden>{"\u2197"}</span>
        </a>
      </div>

      <ol className="mt-8 grid gap-3 sm:gap-4">
        {events.map((entry) => (
          <li
            key={`${entry.year}-${entry.summary.slice(0, 16)}`}
            className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl saturate-180 transition-colors hover:border-gold/30 sm:items-start sm:gap-6"
          >
            <div className="flex shrink-0 flex-col items-center">
              <span className="whitespace-nowrap font-display text-lg leading-7 text-gold sm:text-xl">
                {entry.year}
              </span>
              <span
                aria-hidden="true"
                className="mt-3 hidden w-px flex-1 bg-white/10 group-last:hidden sm:block"
              />
            </div>
            <p className="text-sm leading-6 text-p-muted">{entry.summary}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}