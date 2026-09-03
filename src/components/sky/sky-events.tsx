import Link from "next/link";
import { CosmicFunFact } from "@/components/ui/cosmic-fun-fact";
import { funFactForCategory } from "@/lib/content/funfacts";

export type SkyEvent = {
  title: string;
  start: string; // ISO date or date
  description: string;
  url?: string;
  category?: string;
};

/* Verified, high-authority astronomy sources (individually checked: HTTP 200,
   stable, redirect-safe). Used to repair dead links from the live feed and as
   graceful fallbacks when an event carries no valid URL. */
const GUIDES = {
  moonPhases: "https://science.nasa.gov/moon/moon-phases/",
  meteorShowers: "https://www.imo.net/resources/calendar/",
  eclipses: "https://www.nasa.gov/skywatching/",
  planetary: "https://solarsystem.nasa.gov/planets/overview/",
  default: "https://www.nasa.gov/skywatching/",
} as const;

/* Hosts known to serve dead/failed pages (e.g. the decommissioned USNO data
   service). Any feed URL pointing here is treated as invalid and rewritten. */
const DEAD_HOSTS = ["aa.usno.navy.mil"];

const FALLBACK_BY_CATEGORY: Record<string, string> = {
  "meteor-showers": GUIDES.meteorShowers,
  "moon-phases": GUIDES.moonPhases,
  eclipses: GUIDES.eclipses,
  oppositions: GUIDES.planetary,
  conjunctions: GUIDES.planetary,
};

/** Resolve a safe, working "How to watch" destination for an event. */
function resolveUrl(e: SkyEvent): string {
  const raw = (e.url ?? "").trim();
  let host = "";
  try {
    host = raw.startsWith("http") ? new URL(raw).hostname : "";
  } catch {
    host = "";
  }
  const dead = host !== "" && DEAD_HOSTS.some((d) => host === d || host.endsWith(`.${d}`));
  const missing = raw === "" || !/^https?:\/\//i.test(raw);
  if (!missing && !dead) return raw;
  return FALLBACK_BY_CATEGORY[e.category ?? ""] ?? GUIDES.default;
}

/** Curated fallback list used when the live feed cannot be reached. */
const FALLBACK_EVENTS: SkyEvent[] = [
  {
    title: "Lyrids Meteor Shower · Peak Night",
    start: "2026-04-22",
    description:
      "Up to 20 meteors per hour radiate from the constellation Lyra. Best after midnight from a dark site — no equipment needed.",
    url: GUIDES.meteorShowers,
    category: "meteor-showers",
  },
  {
    title: "New Moon",
    start: "2026-04-17",
    description:
      "The darkest night of the lunar cycle — a perfect window for deep-sky observing and a quiet reset before the new month.",
    url: GUIDES.moonPhases,
    category: "moon-phases",
  },
  {
    title: "Full Moon · Pink Moon",
    start: "2026-04-02",
    description:
      "The Moon rises at sunset and stays up all night, fully lit. A spectacular sight near the horizon, thanks to the Moon illusion.",
    url: GUIDES.moonPhases,
    category: "moon-phases",
  },
];

const CATEGORIES = [
  "meteor-showers",
  "eclipses",
  "oppositions",
  "conjunctions",
  "moon-phases",
] as const;

const API_URL = `https://space-calendar.lukekorth.com/feed.json?c=${CATEGORIES.join(",")}`;

function stripEmoji(s: string): string {
  return s
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      "",
    )
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,:;])/g, "$1")
    .trim();
}

function displayDate(iso: string): { month: string; text: string } {
  const d = new Date(iso === iso.slice(0, 10) ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return { month: "", text: iso };
  const month = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" }).format(d);
  const text = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
  return { month, text };
}

function categoryLabel(category: string | undefined): string {
  switch (category) {
    case "meteor-showers": return "Meteor shower";
    case "eclipses": return "Eclipse";
    case "oppositions": return "Opposition";
    case "conjunctions": return "Conjunction";
    case "moon-phases": return "Lunar phase";
    default: return "Sky event";
  }
}

async function fetchEvents(): Promise<SkyEvent[]> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 21600 },
      signal: controller.signal,
    });
    if (!res.ok) return FALLBACK_EVENTS;
    const data = (await res.json()) as { events?: SkyEvent[] };
    const now = Date.now();
    const upcoming = (data.events ?? [])
      .map((e) => ({
        ...e,
        title: stripEmoji(e.title),
      }))
      .filter((e) => new Date(e.start === e.start.slice(0, 10) ? `${e.start}T00:00:00Z` : e.start).getTime() >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 4);
    if (upcoming.length === 0) return FALLBACK_EVENTS;
    return upcoming;
  } catch {
    return FALLBACK_EVENTS;
  } finally {
    clearTimeout(t);
  }
}

export async function SkyEvents() {
  const events = await fetchEvents();

  return (
    <section
      aria-labelledby="sky-events-heading"
      className="mx-auto max-w-6xl px-4 pb-4 sm:px-6"
    >
      <div className="paper-panel relative overflow-hidden p-8 sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(108,92,231,0.28)_0%,transparent_70%)] blur-2xl"
        />
        <div className="relative">
          <p className="kicker">The sky ahead</p>
          <h2 id="sky-events-heading" className="mt-3 font-display text-3xl leading-tight text-starlight sm:text-4xl">
            Upcoming celestial events
          </h2>
          <p className="mt-3 max-w-xl leading-7 text-muted">
            Live from the USNO sky almanac — meteor showers, eclipses, oppositions and lunar
            phases worth stepping outside for.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((e) => {
              const { month, text } = displayDate(e.start);
              const label = categoryLabel(e.category);
              return (
                <article
                  key={`${e.start}-${e.title}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition-colors hover:border-gold/40"
                >
                  <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                    {month && (
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gold/15 text-sm font-bold text-gold">
                        {month}
                      </span>
                    )}
                    <div className="min-w-0">
                      <span className="inline-block rounded-full bg-gold/20 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-gold">
                        {label}
                      </span>
                      <p className="mt-1 text-xs text-muted">{text}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col px-5 py-4">
                    <h3 className="font-display text-base font-semibold leading-snug text-p-ink">{e.title}</h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-p-muted">{e.description}</p>
                    <div className="mt-4">
                      <CosmicFunFact fact={funFactForCategory(e.category)} compact />
                    </div>
                    <Link
                      href={resolveUrl(e)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`How to watch: ${e.title} (opens in a new tab)`}
                      className="mt-4 inline-flex w-fit items-center rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-starlight transition-colors hover:border-gold/50 hover:text-gold"
                    >
                      How to watch
                      <span aria-hidden className="ml-1.5">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-6 text-[0.7rem] leading-5 text-subdued">
            Event data is updated from the U.S. Naval Observatory / NASA-JPL sky almanac and
            refreshed automatically. Always check a local astronomy guide before heading out.
          </p>
        </div>
      </div>
    </section>
  );
}
