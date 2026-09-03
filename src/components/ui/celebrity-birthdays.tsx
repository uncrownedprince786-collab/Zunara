import {
  celebritiesForDate,
  type Celebrity,
  type CelebrityRegion,
} from "@/lib/content/celebrities";
import { zodiacForDate, type ZodiacSign } from "@/lib/zodiac/zodiac";
import { ZodiacSymbol } from "./zodiac-symbol";

const REGION_STYLE: Record<CelebrityRegion, string> = {
  Hollywood: "border-white/10 bg-white/[0.04] text-muted",
  Bollywood: "border-gold/20 bg-gold/5 text-gold-deep",
  "K-Pop": "border-cosmic/25 bg-cosmic/10 text-cosmic",
  Thai: "border-air/25 bg-air/10 text-air",
  Sports: "border-fire/25 bg-fire/10 text-fire",
  Global: "border-white/10 bg-white/[0.04] text-muted",
};

const ELEMENT_GLOW: Record<ZodiacSign["element"], string> = {
  Fire: "from-fire/25",
  Earth: "from-earth/25",
  Air: "from-air/25",
  Water: "from-water/25",
};

const ELEMENT_RING: Record<ZodiacSign["element"], string> = {
  Fire: "text-fire",
  Earth: "text-earth",
  Air: "text-air",
  Water: "text-water",
};

/** Short initials for the monogram avatar (handles single names & K-Pop stage names). */
function initials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "Z";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function CelebrityCard({
  celebrity,
  dateLabel,
}: {
  celebrity: Celebrity;
  dateLabel: string;
}) {
  const sign = zodiacForDate(1990, celebrity.month, celebrity.day);
  const regionStyle = REGION_STYLE[celebrity.region];
  const glow = ELEMENT_GLOW[sign.element];
  const ring = ELEMENT_RING[sign.element];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white/[0.04] p-6 backdrop-blur-xl saturate-180 transition-colors hover:border-gold/40">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${glow} to-transparent blur-2xl`}
      />

      <div className="relative flex items-start gap-4">
        <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
          <span className={`font-display text-lg font-semibold ${ring}`}>{initials(celebrity.name)}</span>
          <span
            aria-hidden
            className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border border-gold/25 bg-cosmic/15"
          >
            <ZodiacSymbol sign={sign.slug} size={16} label={sign.name} />
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-display text-xl text-starlight">{celebrity.name}</h3>
          <p className="mt-0.5 text-sm text-muted">{celebrity.profession}</p>
          <span className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-[0.62rem] font-medium tracking-wide ${regionStyle}`}>
            {celebrity.region}
          </span>
        </div>
      </div>

      <p className="relative mt-5 text-sm leading-6 text-p-muted">{celebrity.star}</p>

      <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-p-line pt-4">
        <span className="flex items-center gap-2 text-xs text-subdued">
          <span className={`text-sm ${ring}`}>
            <ZodiacSymbol sign={sign.slug} size={18} label={sign.name} />
          </span>
          {sign.name} · {dateLabel}
        </span>
        <a
          href={celebrity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold-deep transition-colors hover:bg-gold/20"
        >
          Full profile
          <span aria-hidden className="text-gold">&rarr;</span>
        </a>
      </div>
    </div>
  );
}

/**
 * Dynamic "Born Under Today's Stars" section. Filters a curated dataset by the
 * caller's date (UTC) and renders frosted-glass celebrity cards. Server-side.
 */
export function CelebrityBirthdays() {
  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  const dateLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(now);

  const people = celebritiesForDate(month, day).slice(0, 6);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex items-end justify-between border-b border-line-soft pb-5">
        <div>
          <p className="kicker">Born under today&rsquo;s stars</p>
          <h2 className="mt-3 font-display text-3xl text-starlight sm:text-4xl">
            {dateLabel}
          </h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm leading-6 text-muted sm:block">
          Bright stars who share this day. Their birth chart is written in the
          same sky you read here.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((celebrity) => (
          <CelebrityCard key={celebrity.url} celebrity={celebrity} dateLabel={dateLabel} />
        ))}
      </div>

      {people.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted">
          No featured stars born today — but every day is written in the sky.
          Explore the signs to see who shares yours.
        </p>
      )}
    </section>
  );
}
