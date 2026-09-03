/**
 * Natal chart orchestrator.
 *
 * Assembles planets, houses and predetermined readings into a single
 * deterministic `NatalChart` for an exact UTC birth instant + observer
 * coordinates. Fully pure — no I/O, no side effects, no randomness.
 */
import { ENGINE_VERSION_NUMBER } from "@/lib/astronomy/astro";
import { natalPlanets } from "./planets";
import { housesAt } from "./houses";
import { buildReadings } from "./readings";
import type { BirthCoordinates, NatalChart, NatalPlanet } from "./types";

export const NOON_ASSUMPTION_NOTE =
  "Exact birth time unknown — Ascendant & houses estimated using 12:00 PM (Noon) UTC. For the precise rising sign and house layout, provide the exact birth time and birthplace coordinates.";

export interface ComputeOptions {
  timeAssumed: boolean;
}

export function computeNatalChart(
  date: Date,
  observer: BirthCoordinates,
  options: ComputeOptions,
): NatalChart {
  const planets: NatalPlanet[] = natalPlanets(date);
  const houses = housesAt(date, observer);
  const sun = planets.find((p) => p.key === "sun");
  const moon = planets.find((p) => p.key === "moon");
  if (!sun || !moon) {
    throw new Error("natal: constellation reduced — sun/moon unavailable");
  }
  const readings = buildReadings(planets, houses.ascendant);

  return {
    utcTime: date.toISOString(),
    timeAssumed: options.timeAssumed,
    timeNote: options.timeAssumed ? NOON_ASSUMPTION_NOTE : "",
    bigThree: { sun, moon, ascendant: houses.ascendant },
    planets,
    houses,
    readings,
    engineVersion: ENGINE_VERSION_NUMBER,
    observer,
  };
}
