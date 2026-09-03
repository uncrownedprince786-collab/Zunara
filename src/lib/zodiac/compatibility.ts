import { ZODIAC_SIGNS, getZodiacSign, type Element, type Modality } from "./zodiac";

export interface PillarScore {
  label: string;
  score: number;
  blurb: string;
}

export interface CompatibilityResult {
  a: string;
  b: string;
  pillars: PillarScore[];
  overall: number;
  verdict: string;
}

/**
 * Element synergy: how two elemental energies naturally blend.
 * High = complements, Low = friction, Mid = same-element kinship or neutral.
 */
const ELEMENT_MATRIX: Record<Element, Record<Element, number>> = {
  Fire: { Fire: 62, Earth: 44, Air: 88, Water: 38 },
  Earth: { Fire: 44, Earth: 66, Air: 42, Water: 86 },
  Air: { Fire: 88, Earth: 42, Air: 64, Water: 52 },
  Water: { Fire: 38, Earth: 86, Air: 52, Water: 68 },
};

/**
 * Modality affinity: the working rhythm between two signs' modes.
 */
const MODALITY_MATRIX: Record<Modality, Record<Modality, number>> = {
  Cardinal: { Cardinal: 58, Fixed: 82, Mutable: 64 },
  Fixed: { Cardinal: 82, Fixed: 60, Mutable: 74 },
  Mutable: { Cardinal: 64, Fixed: 74, Mutable: 66 },
};

/** Small flavor offsets so no two pairings feel identical. */
const FLAVOR: Record<string, { love: number; energy: number; mind: number }> = {
  aries: { love: -4, energy: 6, mind: -2 },
  taurus: { love: 6, energy: -4, mind: 0 },
  gemini: { love: -2, energy: 2, mind: 7 },
  cancer: { love: 7, energy: -2, mind: -3 },
  leo: { love: 5, energy: 7, mind: -2 },
  virgo: { love: 0, energy: -3, mind: 6 },
  libra: { love: 6, energy: 0, mind: 5 },
  scorpio: { love: 7, energy: 4, mind: 2 },
  sagittarius: { love: 2, energy: 6, mind: 3 },
  capricorn: { love: 3, energy: 1, mind: 4 },
  aquarius: { love: -3, energy: 3, mind: 8 },
  pisces: { love: 6, energy: -3, mind: 1 },
};

function clamp(n: number, lo = 38, hi = 98): number {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function elementPairKey(a: Element, b: Element): string {
  return [a, b].sort().join("-");
}

function lovePatch(aSlug: string, bSlug: string, key: string): string {
  const same = aSlug === bSlug ? "yes" : "no";
  const [e1, e2] = key.split("-");
  if (e1 === "Fire" && e2 === "Air")
    return "Air feeds the flame — attraction sparks fast and keeps burning.";
  if (e1 === "Earth" && e2 === "Water")
    return "Water nourishes Earth — comfort, trust and quiet devotion.";
  if (e1 === "Fire" && e2 === "Water")
    return "Emotion meets impulse; chemistry is hot but needs careful handling.";
  if (e1 === "Air" && e2 === "Earth")
    return "One dreams, the other builds — love grows where the two find common ground.";
  if (same === "yes") return "You share the same element — an instant, instinctive kinship.";
  return "Opposite currents create a magnetic, hard-to-name pull.";
}

export function compatibilityBetween(aSlug: string, bSlug: string): CompatibilityResult | null {
  const a = getZodiacSign(aSlug);
  const b = getZodiacSign(bSlug);
  if (!a || !b) return null;

  const eKey = elementPairKey(a.element, b.element);
  const elem = ELEMENT_MATRIX[a.element][b.element];

  const love = clamp(
    elem * 0.9 +
      MODALITY_MATRIX[a.modality][b.modality] * 0.3 +
      FLAVOR[aSlug].love +
      FLAVOR[bSlug].love,
  );
  const energy = clamp(
    elem * 0.55 +
      MODALITY_MATRIX[a.modality][b.modality] * 0.75 +
      FLAVOR[aSlug].energy +
      FLAVOR[bSlug].energy,
  );
  const mind = clamp(
    elem * 0.5 +
      MODALITY_MATRIX[a.modality][b.modality] * 0.55 +
      FLAVOR[aSlug].mind +
      FLAVOR[bSlug].mind,
  );

  const overall = clamp(Math.round((love * 0.5 + energy * 0.25 + mind * 0.25)));

  const verdict = `${a.name} & ${b.name} ${love >= 80 ? "share an easy, magnetic warmth that feels fated" : love >= 60 ? "find real rhythm together once they read each other's pace" : "are drawn together but must consciously bridge their different natures"}. ${energy >= 75 ? "Their energy is electric — when they align, momentum is unstoppable." : energy >= 55 ? "They keep each other moving with lively, complementary momentum." : "When they collide, they both learn to pace the other's current."}.`;

  return {
    a: aSlug,
    b: bSlug,
    overall,
    verdict,
    pillars: [
      { label: "Love & Romance", score: love, blurb: lovePatch(aSlug, bSlug, eKey) },
      {
        label: "Energy & Dynamics",
        score: energy,
        blurb:
          energy >= 72
            ? "Dynamism runs high — the pairing thrives on motion and shared momentum."
            : energy >= 55
            ? "A balanced give-and-take keeps the pairing lively without exhausting either side."
            : "Tempo differs; one leads with fire, the other with patience, and both must adjust.",
      },
      {
        label: "Intellect & Communication",
        score: mind,
        blurb:
          mind >= 72
            ? "Conversation flows easily — ideas, wit and curiosity bounce between them."
            : mind >= 55
            ? "Communication is warm and workable once both match words to the other's style."
            : "They speak different languages at first; clarity comes with a little patience.",
      },
    ],
  };
}

export const COMPATIBILITY_SIGNS = ZODIAC_SIGNS;
