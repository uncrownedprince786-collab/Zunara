import * as AE from "astronomy-engine";
import type { BodyKey } from "./bodies";

export const ENGINE_VERSION = "astronomy-engine";
export const ENGINE_VERSION_NUMBER = "2.1.19";

export interface PlanetPosition {
  key: BodyKey;
  /** Tropical ecliptic longitude in degrees [0, 360) */
  longitude: number;
  /** Zodiac sign slug this body is currently in */
  sign: string;
  /** Degree within the sign [0, 30) */
  degreeInSign: number;
  /** Degree and minute formatted string, e.g. "♈ 12° 34′" */
  position: string;
  /** True if the body is moving retrograde (apparent westward motion) */
  retrograde: boolean;
  /** Speed in degrees/day (positive = direct) */
  speed: number;
}

export interface Aspect {
  bodyA: BodyKey;
  bodyB: BodyKey;
  /** Aspect name: conjunction | sextile | square | trine | opposition */
  name: string;
  /** Angle in degrees between the bodies for the chosen aspect (0-180) */
  angle: number;
  /** Orb in degrees away from exact */
  orb: number;
  /** Applying (closing to exact) vs separating */
  applying: boolean;
}

export interface PlanetarySnapshot {
  /** UTC ISO datetime of the snapshot */
  time: string;
  /** Julian date of the snapshot */
  julianDate: number;
  engineVersion: string;
  positions: PlanetPosition[];
  aspects: Aspect[];
}

function bodyToAEBody(key: BodyKey): AE.Body | null {
  switch (key) {
    case "sun":
      return AE.Body.Sun;
    case "moon":
      return AE.Body.Moon;
    case "mercury":
      return AE.Body.Mercury;
    case "venus":
      return AE.Body.Venus;
    case "mars":
      return AE.Body.Mars;
    case "jupiter":
      return AE.Body.Jupiter;
    case "saturn":
      return AE.Body.Saturn;
    case "uranus":
      return AE.Body.Uranus;
    case "neptune":
      return AE.Body.Neptune;
    case "pluto":
      return AE.Body.Pluto;
    default:
      return null;
  }
}

const ZODIAC_ORDER = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

export function longitudeToSign(longitude: number): { slug: string; index: number; degreeInSign: number } {
  const normalized = ((longitude % 360) + 360) % 360;
  const index = Math.floor(normalized / 30) % 12;
  const degreeInSign = normalized - index * 30;
  return { slug: ZODIAC_ORDER[index], index, degreeInSign };
}

function eclipticLongitudeOfBody(key: BodyKey, date: Date): number | null {
  const aeBody = bodyToAEBody(key);
  if (aeBody === null) return null;
  let pos;
  if (key === "moon") {
    pos = AE.GeoMoon(date);
  } else {
    const vec = AE.GeoVector(aeBody, date, true);
    pos = vec;
  }
  return normalize(AE.Ecliptic(pos).elon);
}

function normalize(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

const RETRO_STEP_HOURS = 6;

export function computePosition(key: BodyKey, date: Date): PlanetPosition | null {
  const lon = eclipticLongitudeOfBody(key, date);
  if (lon === null) return null;

  const signInfo = longitudeToSign(lon);
  const before = new Date(date.getTime() - RETRO_STEP_HOURS * 3600000);
  const after = new Date(date.getTime() + RETRO_STEP_HOURS * 3600000);
  let lonBefore = eclipticLongitudeOfBody(key, before);
  let lonAfter = eclipticLongitudeOfBody(key, after);

  if (lonBefore === null || lonAfter === null) {
    lonBefore = lon;
    lonAfter = lon;
  }

  const delta = angularDifference(lonAfter, lonBefore);
  const speed = delta / (RETRO_STEP_HOURS * 2); // degrees per hour, then convert
  const retrograde = lonAfter === lonBefore ? false : delta < 0;

  const deg = Math.floor(signInfo.degreeInSign);
  const minutes = Math.floor((signInfo.degreeInSign - deg) * 60);

  return {
    key,
    longitude: lon,
    sign: signInfo.slug,
    degreeInSign: signInfo.degreeInSign,
    position: `${ZODIAC_SIGN_GLYPH[signInfo.slug]} ${deg}° ${String(minutes).padStart(2, "0")}′`,
    retrograde,
    speed: speed * 24, // degrees per day
  };
}

const ZODIAC_SIGN_GLYPH: Record<string, string> = {
  aries: "♈",
  taurus: "♉",
  gemini: "♊",
  cancer: "♋",
  leo: "♌",
  virgo: "♍",
  libra: "♎",
  scorpio: "♏",
  sagittarius: "♐",
  capricorn: "♑",
  aquarius: "♒",
  pisces: "♓",
};

export function angularDifference(a: number, b: number): number {
  let d = normalize(a - b);
  if (d > 180) d = d - 360;
  return d;
}

type AspectSpec = { name: string; angle: number; orb: number };

const ASPECT_SPECS: AspectSpec[] = [
  { name: "conjunction", angle: 0, orb: 8 },
  { name: "sextile", angle: 60, orb: 6 },
  { name: "square", angle: 90, orb: 7 },
  { name: "trine", angle: 120, orb: 8 },
  { name: "opposition", angle: 180, orb: 8 },
];

const BODY_ASPECTS_ORDER: BodyKey[] = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

export function computeAspects(positions: PlanetPosition[], date: Date): Aspect[] {
  const byKey = new Map(positions.map((p) => [p.key, p]));
  const aspects: Aspect[] = [];

  for (let i = 0; i < BODY_ASPECTS_ORDER.length; i++) {
    for (let j = i + 1; j < BODY_ASPECTS_ORDER.length; j++) {
      const a = BODY_ASPECTS_ORDER[i];
      const b = BODY_ASPECTS_ORDER[j];
      const pa = byKey.get(a);
      const pb = byKey.get(b);
      if (!pa || !pb) continue;
      const ang = Math.abs(angularDifference(pa.longitude, pb.longitude));
      for (const spec of ASPECT_SPECS) {
        const target = spec.angle;
        const rawDiff = Math.abs(ang - target);
        const diff = Math.min(rawDiff, 360 - rawDiff);
        if (diff <= spec.orb) {
          const applying = isApplying(a, b, pa, pb, target, date);
          aspects.push({
            bodyA: a,
            bodyB: b,
            name: spec.name,
            angle: target,
            orb: diff,
            applying,
          });
          break;
        }
      }
    }
  }
  return aspects.sort((x, y) => x.orb - y.orb);
}

function isApplying(
  a: BodyKey,
  b: BodyKey,
  pa: PlanetPosition,
  pb: PlanetPosition,
  targetAngle: number,
  date: Date,
): boolean {
  try {
    const later = new Date(date.getTime() + 12 * 3600000);
    const la = eclipticLongitudeOfBody(a, later);
    const lb = eclipticLongitudeOfBody(b, later);
    if (la === null || lb === null) return false;
    const nowAng = Math.abs(angularDifference(pa.longitude, pb.longitude));
    const futureAng = Math.abs(angularDifference(la, lb));
    const nowDist = Math.min(Math.abs(nowAng - targetAngle), 360 - Math.abs(nowAng - targetAngle));
    const futureDist = Math.min(Math.abs(futureAng - targetAngle), 360 - Math.abs(futureAng - targetAngle));
    return futureDist < nowDist;
  } catch {
    return false;
  }
}

/**
 * Lunar nodes progress ~3.1 degrees/year, so over a 27-day node cycle they
 * move less than half a degree. Computing the exact node longitude for a given
 * date requires locating the nearest node crossing. We walk backward ~60 days
 * (about 2 node cycles) to ensure we bracket the target date, then pick the
 * closest crossing and read the Moon's ecliptic longitude there.
 */
const NODE_LOOKBACK_DAYS = 60;

function computeNodeLongitude(date: Date, ascending: boolean): number | null {
  try {
    const recent = new Date(date.getTime() - NODE_LOOKBACK_DAYS * 86400000);
    let cur = AE.SearchMoonNode(AE.MakeTime(recent));
    let node = cur;
    let prevNode = cur;
    let guard = 0;
    while (cur.time.date.getTime() < date.getTime() && guard < 8) {
      prevNode = cur;
      cur = AE.NextMoonNode(cur);
      guard++;
    }
    node = cur;
    const closest = Math.abs(node.time.date.getTime() - date.getTime()) <=
      Math.abs(prevNode.time.date.getTime() - date.getTime())
      ? node
      : prevNode;
    const moonAtNode = AE.GeoMoon(new Date(closest.time.date));
    let nodeLon = normalize(AE.Ecliptic(moonAtNode).elon);
    const isAscending = closest.kind === 1;
    if (ascending !== isAscending) {
      nodeLon = normalize(nodeLon + 180);
    }
    return nodeLon;
  } catch {
    return null;
  }
}

export function computeSnapshot(date: Date, includeNodes = true): PlanetarySnapshot {
  const baseKeys: BodyKey[] = [
    "sun",
    "moon",
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "pluto",
  ];

  const keys: BodyKey[] = [...baseKeys];
  if (includeNodes) {
    keys.push("northNode", "southNode");
  }

  const positions: PlanetPosition[] = [];
  for (const key of keys) {
    const pos = computePosition(key, date);
    if (pos) positions.push(pos);
  }

  if (includeNodes) {
    const north = computeNodeLongitude(date, true);
    const south = north === null ? null : normalize(north + 180);
    if (north !== null) {
      const si = longitudeToSign(north);
      positions.push({
        key: "northNode",
        longitude: north,
        sign: si.slug,
        degreeInSign: si.degreeInSign,
        position: `☊ ${Math.floor(si.degreeInSign)}°`,
        retrograde: false,
        speed: 0,
      });
    }
    if (south !== null) {
      const si2 = longitudeToSign(south);
      positions.push({
        key: "southNode",
        longitude: south,
        sign: si2.slug,
        degreeInSign: si2.degreeInSign,
        position: `☋ ${Math.floor(si2.degreeInSign)}°`,
        retrograde: false,
        speed: 0,
      });
    }
  }

  const aspects = computeAspects(positions, date);

  return {
    time: date.toISOString(),
    julianDate: AE.MakeTime(date).ut,
    engineVersion: ENGINE_VERSION_NUMBER,
    positions,
    aspects,
  };
}

export function snapshotForToday(includeNodes = true): PlanetarySnapshot {
  return computeSnapshot(new Date(), includeNodes);
}
