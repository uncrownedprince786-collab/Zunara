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
  { key: "sun", name: "Sun", glyph: "☉", symbolPath: "sun", description: "Core identity and vitality" },
  { key: "moon", name: "Moon", glyph: "☽", symbolPath: "moon", description: "Emotions and inner nature" },
  { key: "mercury", name: "Mercury", glyph: "☿", symbolPath: "mercury", description: "Communication and thought" },
  { key: "venus", name: "Venus", glyph: "♀", symbolPath: "venus", description: "Love, beauty and values" },
  { key: "mars", name: "Mars", glyph: "♂", symbolPath: "mars", description: "Action, desire and drive" },
  { key: "jupiter", name: "Jupiter", glyph: "♃", symbolPath: "jupiter", description: "Growth and fortune" },
  { key: "saturn", name: "Saturn", glyph: "♄", symbolPath: "saturn", description: "Discipline and structure" },
  { key: "uranus", name: "Uranus", glyph: "♅", symbolPath: "uranus", description: "Change and originality" },
  { key: "neptune", name: "Neptune", glyph: "♆", symbolPath: "neptune", description: "Imagination and transcendence" },
  { key: "pluto", name: "Pluto", glyph: "♇", symbolPath: "pluto", description: "Transformation and power" },
  { key: "northNode", name: "North Node", glyph: "☊", symbolPath: "northNode", description: "Life direction" },
  { key: "southNode", name: "South Node", glyph: "☋", symbolPath: "southNode", description: "Comfortable patterns" },
];

export const CELESTIAL_BY_KEY: ReadonlyMap<BodyKey, CelestialBody> = new Map(
  CELESTIAL_BODIES.map((b) => [b.key, b]),
);

export function getCelestialBody(key: BodyKey): CelestialBody {
  return CELESTIAL_BY_KEY.get(key)!;
}
