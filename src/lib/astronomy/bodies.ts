export type BodyKey =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto"
  | "northNode"
  | "southNode";

export interface CelestialBody {
  key: BodyKey;
  name: string;
  glyph: string;
  symbolPath: string;
  description: string;
}

export const CELESTIAL_BODIES: readonly CelestialBody[] = [
  { key: "sun", name: "Sun", glyph: "\u2609", symbolPath: "sun", description: "Core identity and vitality" },
  { key: "moon", name: "Moon", glyph: "\u263D", symbolPath: "moon", description: "Emotions and inner nature" },
  { key: "mercury", name: "Mercury", glyph: "\u263F", symbolPath: "mercury", description: "Communication and thought" },
  { key: "venus", name: "Venus", glyph: "\u2640", symbolPath: "venus", description: "Love, beauty and values" },
  { key: "mars", name: "Mars", glyph: "\u2642", symbolPath: "mars", description: "Action, desire and drive" },
  { key: "jupiter", name: "Jupiter", glyph: "\u2643", symbolPath: "jupiter", description: "Growth and fortune" },
  { key: "saturn", name: "Saturn", glyph: "\u2644", symbolPath: "saturn", description: "Discipline and structure" },
  { key: "uranus", name: "Uranus", glyph: "\u2645", symbolPath: "uranus", description: "Change and originality" },
  { key: "neptune", name: "Neptune", glyph: "\u2646", symbolPath: "neptune", description: "Imagination and transcendence" },
  { key: "pluto", name: "Pluto", glyph: "\u2647", symbolPath: "pluto", description: "Transformation and power" },
  { key: "northNode", name: "North Node", glyph: "\u260A", symbolPath: "northNode", description: "Life direction" },
  { key: "southNode", name: "South Node", glyph: "\u260B", symbolPath: "southNode", description: "Comfortable patterns" },
];

export const CELESTIAL_BY_KEY: ReadonlyMap<BodyKey, CelestialBody> = new Map(
  CELESTIAL_BODIES.map((b) => [b.key, b]),
);

export function getCelestialBody(key: BodyKey): CelestialBody {
  return CELESTIAL_BY_KEY.get(key)!;
}
