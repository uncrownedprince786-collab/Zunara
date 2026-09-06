/**
 * Plain-English explainers for the live-sky dashboard.
 *
 * The technical lines (positions, phases, orbs) are precise but jargon-heavy.
 * These render a short "In plain words…" sentence under each item so a
 * non-astrology reader still gets the gist. English-only editorial copy by
 * design (matches the glossary scope decision).
 */

export const SIGN_PLAIN: Record<string, string> = {
  aries: "the sign of bold action and fresh beginnings",
  taurus: "the sign of comfort, steadiness and the senses",
  gemini: "the sign of curiosity, words and connection",
  cancer: "the sign of home, family and deep feeling",
  leo: "the sign of warmth, drama and self-expression",
  virgo: "the sign of craft, care and getting things right",
  libra: "the sign of harmony, beauty and partnership",
  scorpio: "the sign of intensity, trust and transformation",
  sagittarius: "the sign of adventure, faith and big ideas",
  capricorn: "the sign of ambition, structure and patience",
  aquarius: "the sign of innovation, freedom and community",
  pisces: "the sign of dreams, compassion and imagination",
};

export const PHASE_PLAIN: Record<string, string> = {
  "New Moon": "a still moment for setting intentions",
  "Waxing Crescent": "a quietly growing phase — good for beginning something new",
  "First Quarter": "a push of momentum that asks for action",
  "Waxing Gibbous": "a refining phase, polishing as the light grows",
  "Full Moon": "a peak of illumination when feelings surge to the surface",
  "Waning Gibbous": "a phase for sharing and giving back what you have learned",
  "Last Quarter": "a releasing phase, letting go of what no longer fits",
  "Waning Crescent": "a calm, restful pause before the next cycle",
};

export const PLANET_MEANS: Record<string, string> = {
  saturn: "structure, limits, time and responsibility",
  neptune: "dreams, intuition and the imagination",
  pluto: "deep inner change, power and renewal",
  mercury: "communication, travel and ideas",
  venus: "love, beauty and what we value",
  mars: "energy, drive and desire",
  jupiter: "growth, luck and optimism",
  uranus: "sudden change, invention and freedom",
};

export const ASPECT_PLAIN: Record<string, string> = {
  conjunction: "the two planets sit at the same point, so their energies merge and intensify",
  opposition: "the two planets face each other across the sky — a tug between two pulls",
  trine: "a relaxed, supportive angle — the energies flow together easily",
  square: "a tense, pushy angle — the energies clash and demand action",
  sextile: "a friendly, helpful angle — the energies cooperate and open doors",
};

function proper(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** e.g. "Cancer" → meaning. Falls back to a generic phrase. */
export function signPlain(slug: string): string {
  return SIGN_PLAIN[slug] ?? "the sign's own territory and mood";
}

/** Explain the Moon's sign + phase for a casual reader. */
export function plainMoon(signSlug: string, phaseName: string): string {
  const sign = signPlain(signSlug);
  const phase = PHASE_PLAIN[phaseName] ?? "part of the lunar cycle";
  return `The Moon tints our moods with ${sign}. As a ${phaseName}, it is ${phase}.`;
}

/** Explain a retrograde planet for a casual reader. */
export function plainRetro(planetKey: string, signSlug: string): string {
  const name = proper(planetKey);
  const theme = PLANET_MEANS[planetKey] ?? "that planet's life themes";
  const sign = signPlain(signSlug);
  return `${name} is only appearing to move backwards from Earth. It is a signal to pause and review ${theme} — practised with care, given ${sign}.`;
}

/** Explain a headline aspect for a casual reader. */
export function plainAspect(name: string, bodyA: string, bodyB: string, orb: number): string {
  const a = proper(bodyA);
  const b = proper(bodyB);
  const relation = ASPECT_PLAIN[name.toLowerCase()] ?? "the two planets hold a meaningful angle";
  const closeness =
    orb <= 0.5
      ? "and they are almost exactly aligned, so the effect is unusually strong"
      : "and they are close enough to be clearly felt";
  return `In astrology, the angle between ${a} and ${b} matters — this one is a ${name}: ${relation}. ${closeness}.`;
}