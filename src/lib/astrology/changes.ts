import { computeSnapshot } from "../astronomy/astro";
import type { PlanetarySnapshot, PlanetPosition } from "../astronomy/astro";
import { ZODIAC_SIGNS } from "../zodiac/zodiac";

export interface ChangeItem {
  id: string;
  kind:
    | "moon-sign"
    | "planet-sign"
    | "retro-start"
    | "retro-end"
    | "sun-sign"
    | "aspect";
  title: string;
  blurb: string;
  planet?: string;
  /** Structured fields (added for i18n) so the client can build localized copy. */
  sign?: string;
  bodyA?: string;
  bodyB?: string;
  aspect?: string;
}

const PLANET_NAMES: Record<string, string> = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
};

function signName(slug: string): string {
  return ZODIAC_SIGNS.find((s) => s.slug === slug)?.name ?? slug;
}

function positionMap(snapshot: PlanetarySnapshot): Map<string, PlanetPosition> {
  return new Map(snapshot.positions.map((p) => [p.key, p]));
}

const TRACKED_PLANETS = [
  "moon",
  "mercury",
  "venus",
  "sun",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

/**
 * Compare the sky at `date` with the sky at a reference time (default one day
 * earlier) and return only genuinely supported changes. Pure calculation;
 * nothing is fabricated and an empty result is valid. The change log is the
 * same for every sign on a given date (it reflects the global sky), so it is
 * memoised by (date, offset).
 */
const changesCache = new Map<string, ChangeItem[]>();

export function computeChanges(
  date: Date,
  today: PlanetarySnapshot,
  offsetDays = 1,
): ChangeItem[] {
  const cacheKey = `${date.getTime()}|${offsetDays}`;
  const cached = changesCache.get(cacheKey);
  if (cached) return cached;
  const beforeDate = new Date(date.getTime() - offsetDays * 86400000);
  const before = computeSnapshot(beforeDate, false);
  const items = diffSnapshots(date, before, today);
  changesCache.set(cacheKey, items);
  return items;
}

export function diffSnapshots(
  date: Date,
  before: PlanetarySnapshot,
  today: PlanetarySnapshot,
): ChangeItem[] {
  const prev = positionMap(before);
  const curr = positionMap(today);
  const items: ChangeItem[] = [];

  for (const key of TRACKED_PLANETS) {
    const p = curr.get(key);
    const pPrev = prev.get(key);
    if (!p || !pPrev) continue;

    // Sign change.
    if (p.sign !== pPrev.sign) {
      const kind =
        key === "sun" ? "sun-sign" : key === "moon" ? "moon-sign" : "planet-sign";
      items.push({
        id: `${key}-sign`,
        kind,
        planet: key,
        sign: p.sign,
        title: `${PLANET_NAMES[key]} moved into ${signName(p.sign)}`,
        blurb: signChangeBlurb(key, signName(p.sign)),
      });
      continue;
    }

    // Retrograde onset / completion.
    if (p.retrograde && !pPrev.retrograde) {
      items.push({
        id: `${key}-retro-start`,
        kind: "retro-start",
        planet: key,
        title: `${PLANET_NAMES[key]} began its retrograde`,
        blurb: `${PLANET_NAMES[key]} turned retrograde, favouring review and patience in the areas it rules.`,
      });
      continue;
    }
    if (!p.retrograde && pPrev.retrograde) {
      items.push({
        id: `${key}-retro-end`,
        kind: "retro-end",
        planet: key,
        title: `${PLANET_NAMES[key]} turned direct`,
        blurb: `Momentum returns to the areas ${PLANET_NAMES[key]} rules; plans can move forward again.`,
      });
      continue;
    }
  }

  // Newly formed tight major aspect involving the Sun or the Moon (most
  // noticeable day to day). Exclude slow outer pairs that rarely shift.
  items.push(...newAspects(before, today, date));

  return items;
}

/** Detect a meaningful major aspect that was not present the day before. */
function newAspects(before: PlanetarySnapshot, today: PlanetarySnapshot, date: Date): ChangeItem[] {
  const out: ChangeItem[] = [];
  const prevAspects = aspectKeySet(before);
  const hard = new Set(["conjunction", "opposition", "square"]);

  for (const aspect of today.aspects) {
    if (aspect.orb == null || aspect.orb > 3) continue;
    const involvesFastBody =
      aspect.bodyA === "sun" || aspect.bodyB === "sun" ||
      aspect.bodyA === "moon" || aspect.bodyB === "moon" ||
      aspect.bodyA === "mercury" || aspect.bodyB === "mercury" ||
      aspect.bodyA === "venus" || aspect.bodyB === "venus";
    if (!involvesFastBody) continue;
    if (!hard.has(aspect.name)) continue;
    const keyPair = [aspect.bodyA, aspect.bodyB].sort().join(":");
    if (prevAspects.has(keyPair)) continue;
    const a = PLANET_NAMES[aspect.bodyA] ?? aspect.bodyA;
    const b = PLANET_NAMES[aspect.bodyB] ?? aspect.bodyB;
    const article = /^[aeiou]/i.test(aspect.name) ? "an" : "a";
    out.push({
      id: `aspect-${date.getTime()}-${keyPair}`,
      kind: "aspect",
      bodyA: aspect.bodyA,
      bodyB: aspect.bodyB,
      aspect: aspect.name,
      title: `${a} forms ${article} ${aspect.name} with ${b}`,
      blurb: aspectBlurb(aspect.name),
    });
  }

  return out;
}

function aspectKeySet(snapshot: PlanetarySnapshot): Set<string> {
  const set = new Set<string>();
  for (const a of snapshot.aspects) {
    if (a.orb == null || a.orb > 3) continue;
    set.add([a.bodyA, a.bodyB].sort().join(":"));
  }
  return set;
}

function aspectBlurb(name: string): string {
  switch (name) {
    case "opposition":
      return "This can bring a tension or choice into focus, inviting you to find balance rather than force a side.";
    case "square":
      return "A slight friction may create productive push, urging you to address something you have been putting off.";
    case "conjunction":
      return "A strong, focused meeting of energies may concentrate your attention on one central theme.";
    default:
      return "A notable relationship between today’s positions may colour the mood of the day.";
  }
}

function signChangeBlurb(key: string, into: string): string {
  switch (key) {
    case "moon": {
      const variants = [
        `Your attention may shift toward the flavour of ${into}.`,
        `Emotional tone takes on the character of ${into} for the day.`,
        `The mood turns toward ${into}, bringing a change of inner weather.`,
      ];
      return variants[hashOf(into) % variants.length];
    }
    case "mercury":
      return `Thinking and conversations may take on the character of ${into} for a while.`;
    case "venus":
      return `Relationships and tastes may be coloured by the tone of ${into}.`;
    case "sun":
      return `The broad theme of the moment takes on the character of ${into}.`;
    case "mars":
      return `Drive and action may express through the qualities of ${into}.`;
    default:
      return `Planets moving through ${into} slowly shape the broader season.`;
  }
}

function hashOf(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
