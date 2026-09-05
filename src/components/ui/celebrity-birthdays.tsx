import { resolveCelebritiesForDate } from "@/lib/celebrities/resolver";
import { CelebrityBirthdaysView } from "./celebrity-birthdays-view";

/**
 * Server-rendered "Born Under Today's Stars" section.
 *
 * Resolves profiles through the 3-tier pipeline (pre-calculated cron cache →
 * live Wikidata → offline static pool) so the home page serves famous birthdays
 * with zero latency — the date change carries no loading cost.
 */
export async function CelebrityBirthdays() {
  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();

  const resolved = await resolveCelebritiesForDate(month, day);

  return (
    <CelebrityBirthdaysView
      month={month}
      day={day}
      people={resolved.people}
      source={resolved.source}
    />
  );
}