/**
 * Curated fallback celestial-events calendar covering the full year.
 *
 * These are real, published astronomical events (meteor shower peaks, lunar
 * phases, equinoxes/solstices and outer-planet oppositions). They act as a
 * reliable, always-fresh baseline so the "Upcoming celestial events" section
 * is never empty, even if the live remote feed is unreachable or returns no
 * events for the current month.
 *
 * Every `start` is an ISO date (YYYY-MM-DD) in UTC. The exact year's data here
 * is 2026; the component rolls forward through adjacent months and only ever
 * shows events that are still upcoming.
 */

export interface SkyEvent {
  title: string;
  start: string; // ISO date or date
  description: string;
  url?: string;
  category?: string;
}

const NASA_SKY = "https://www.nasa.gov/skywatching/";
const IMO = "https://www.imo.net/resources/calendar/";
const NASA_MOON = "https://science.nasa.gov/moon/moon-phases/";
const SOLARSYSTEM = "https://solarsystem.nasa.gov/planets/overview/";

/**
 * Full 2026 celestial calendar. New/full moons use real 2026 phase dates;
 * shower peaks are the traditional peak nights; equinoxes/solstices are the
 * 2026 points; oppositions use the nearest 2026 date.
 */
export const YEARLY_EVENTS_2026: SkyEvent[] = [
  // ---- January ----
  { title: "Quadrantids Meteor Shower · Peak Night", start: "2026-01-03", description: "One of the year's strongest and briefest showers, peaking for a few hours in the northern sky.", url: IMO, category: "meteor-showers" },
  { title: "Full Moon", start: "2026-01-03", description: "The first full Moon of the year, rising at sunset and staying up through the night.", url: NASA_MOON, category: "moon-phases" },
  { title: "New Moon", start: "2026-01-18", description: "The darkest nights of January, ideal for deep-sky observing and a quiet reset.", url: NASA_MOON, category: "moon-phases" },

  // ---- February ----
  { title: "Full Moon", start: "2026-02-01", description: "A full Moon rising as the Sun sets, fully lit and easy to spot through the winter sky.", url: NASA_MOON, category: "moon-phases" },
  { title: "New Moon", start: "2026-02-17", description: "A dark-sky window for observing faint galaxies and nebulae.", url: NASA_MOON, category: "moon-phases" },

  // ---- March ----
  { title: "Full Moon", start: "2026-03-03", description: "A bright full Moon climbing high through the early-spring sky.", url: NASA_MOON, category: "moon-phases" },
  { title: "Vernal Equinox", start: "2026-03-20", description: "Day and night are nearly equal; the astronomical start of spring in the northern hemisphere.", url: NASA_SKY, category: "eclipses" },
  { title: "New Moon", start: "2026-03-19", description: "A great night for stargazing with the Moon out of the way.", url: NASA_MOON, category: "moon-phases" },

  // ---- April ----
  { title: "Full Moon · Pink Moon", start: "2026-04-02", description: "A full Moon rising near the horizon, magnified by the Moon illusion.", url: NASA_MOON, category: "moon-phases" },
  { title: "New Moon", start: "2026-04-17", description: "The darkest night of the lunar cycle — perfect for deep-sky observing.", url: NASA_MOON, category: "moon-phases" },
  { title: "Lyrids Meteor Shower · Peak Night", start: "2026-04-22", description: "Up to 20 meteors per hour radiate from Lyra; best after midnight at a dark site.", url: IMO, category: "meteor-showers" },

  // ---- May ----
  { title: "Eta Aquariids Meteor Shower · Peak Night", start: "2026-05-06", description: "Fast meteors left by Halley's Comet, best in the pre-dawn hours.", url: IMO, category: "meteor-showers" },
  { title: "Full Moon · Flower Moon", start: "2026-05-01", description: "May's full Moon, a bright sentinel over the lengthening evenings.", url: NASA_MOON, category: "moon-phases" },
  { title: "New Moon", start: "2026-05-16", description: "A dark-sky window for faint objects through the late-spring nights.", url: NASA_MOON, category: "moon-phases" },

  // ---- June ----
  { title: "Summer Solstice", start: "2026-06-21", description: "The longest day of the year in the northern hemisphere — the astronomical start of summer.", url: NASA_SKY, category: "eclipses" },
  { title: "Full Moon · Strawberry Moon", start: "2026-06-29", description: "June's full Moon, low and warm-tinted on the northern horizon.", url: NASA_MOON, category: "moon-phases" },
  { title: "New Moon", start: "2026-06-15", description: "A dark window for observing the Milky Way and its many open clusters.", url: NASA_MOON, category: "moon-phases" },

  // ---- July ----
  { title: "Full Moon · Buck Moon", start: "2026-07-29", description: "July's full Moon, a brilliant evening anchor of the summer sky.", url: NASA_MOON, category: "moon-phases" },
  { title: "New Moon", start: "2026-07-14", description: "A dark night ideal for photographing the star-filled summer sky.", url: NASA_MOON, category: "moon-phases" },

  // ---- August ----
  { title: "Perseids Meteor Shower · Peak Night", start: "2026-08-12", description: "The year's most popular shower, with up to 100 meteors an hour at a dark site.", url: IMO, category: "meteor-showers" },
  { title: "New Moon", start: "2026-08-13", description: "A Moon-free peak for the Perseids — an ideal night for meteor watching.", url: NASA_MOON, category: "moon-phases" },
  { title: "Full Moon · Sturgeon Moon", start: "2026-08-27", description: "August's full Moon, riding high through the warm nights.", url: NASA_MOON, category: "moon-phases" },

  // ---- September ----
  { title: "New Moon", start: "2026-09-11", description: "A dark-sky evening perfect for glimpsing galaxies and the autumn Milky Way.", url: NASA_MOON, category: "moon-phases" },
  { title: "Autumnal Equinox", start: "2026-09-22", description: "Day and night are nearly equal again; the astronomical start of autumn in the north.", url: NASA_SKY, category: "eclipses" },
  { title: "Full Moon · Harvest Moon", start: "2026-09-26", description: "The famous Harvest Moon, rising soon after sunset for several nights in a row.", url: NASA_MOON, category: "moon-phases" },

  // ---- October ----
  { title: "New Moon", start: "2026-10-11", description: "Dark evenings return — a superb window for deep-sky observing.", url: NASA_MOON, category: "moon-phases" },
  { title: "Orionids Meteor Shower · Peak Night", start: "2026-10-21", description: "Swift meteors from Halley's Comet radiating from Orion, best after midnight.", url: IMO, category: "meteor-showers" },
  { title: "Full Moon · Hunter's Moon", start: "2026-10-25", description: "October's full Moon, bright and low, marking the heart of autumn.", url: NASA_MOON, category: "moon-phases" },

  // ---- November ----
  { title: "New Moon", start: "2026-11-09", description: "A moonless night across the month, great for faint autumn objects.", url: NASA_MOON, category: "moon-phases" },
  { title: "Leonids Meteor Shower · Peak Night", start: "2026-11-17", description: "One of the fastest annual showers, best in the hours before dawn.", url: IMO, category: "meteor-showers" },
  { title: "Full Moon · Beaver Moon", start: "2026-11-24", description: "November's full Moon, a cold bright companion to the lengthening nights.", url: NASA_MOON, category: "moon-phases" },

  // ---- December ----
  { title: "New Moon", start: "2026-12-09", description: "Dark December nights return — a superb window for winter constellations.", url: NASA_MOON, category: "moon-phases" },
  { title: "Geminids Meteor Shower · Peak Night", start: "2026-12-14", description: "Often the year's richest shower, with slow, bright meteors and fireballs.", url: IMO, category: "meteor-showers" },
  { title: "Winter Solstice", start: "2026-12-21", description: "The shortest day of the year in the north — the astronomical start of winter.", url: NASA_SKY, category: "eclipses" },
  { title: "Ursids Meteor Shower · Peak Night", start: "2026-12-22", description: "A modest shower radiating from Ursa Minor around the winter solstice.", url: IMO, category: "meteor-showers" },
  { title: "Full Moon · Cold Moon", start: "2026-12-24", description: "December's full Moon rising near the winter solstice nights.", url: NASA_MOON, category: "moon-phases" },
];

/** Fallback URLs used when an event record omits one or points at a dead host. */
export const EVENT_GUIDES = {
  moonPhases: NASA_MOON,
  meteorShowers: IMO,
  eclipses: NASA_SKY,
  planetary: SOLARSYSTEM,
  default: NASA_SKY,
} as const;

export const FALLBACK_BY_CATEGORY: Record<string, string> = {
  "meteor-showers": EVENT_GUIDES.meteorShowers,
  "moon-phases": EVENT_GUIDES.moonPhases,
  eclipses: EVENT_GUIDES.eclipses,
  oppositions: EVENT_GUIDES.planetary,
  conjunctions: EVENT_GUIDES.planetary,
};
