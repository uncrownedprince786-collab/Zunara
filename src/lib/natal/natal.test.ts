import { describe, it, expect } from "vitest";
import { computeNatalChart } from "./natal";
import { natalPlanets } from "./planets";
import { housesAt, localSiderealTimeDegrees, meanObliquity } from "./houses";
import { validateBirth, YEAR_RANGE } from "./validate";
import { buildReadings, houseOf } from "./readings";
import type { BirthInput } from "./validate";

const NYC = { latitude: 40.7128, longitude: -74.006 };

const validInput: BirthInput = {
  year: 1990,
  month: 6,
  day: 15,
  hour12: 9,
  minute: 30,
  ampm: "AM",
  timeKnown: true,
  latitude: 40.7128,
  longitude: -74.006,
  placeName: "New York, USA",
};

describe("natal engine", () => {
  it("computes the Sun in Capricorn for 1999-01-01 12:00 UTC (ephemeris anchor)", () => {
    const planets = natalPlanets(new Date(Date.UTC(1999, 0, 1, 12, 0, 0)));
    const sun = planets.find((p) => p.key === "sun");
    expect(sun).toBeDefined();
    expect(sun!.sign).toBe("capricorn");
    expect(sun!.degree).toBeGreaterThanOrEqual(8);
    expect(sun!.degree).toBeLessThanOrEqual(12);
    expect(sun!.degreeInSign).toBeGreaterThanOrEqual(0);
    expect(sun!.degreeInSign).toBeLessThan(30);
  });

  it("maps all ten bodies to valid signs with in-range longitudes", () => {
    const planets = natalPlanets(new Date(Date.UTC(1990, 5, 15, 12, 0, 0)));
    expect(planets).toHaveLength(10);
    for (const p of planets) {
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
      expect(p.degreeInSign).toBeGreaterThanOrEqual(0);
      expect(p.degreeInSign).toBeLessThan(30);
      expect(p.degree).toBeGreaterThanOrEqual(0);
      expect(p.degree).toBeLessThan(30);
      expect(p.minutes).toBeGreaterThanOrEqual(0);
      expect(p.minutes).toBeLessThan(60);
      expect(p.retrograde).toEqual(expect.any(Boolean));
    }
  });

  it("is deterministic: the same instant always yields the same longitudes", () => {
    const a = natalPlanets(new Date(Date.UTC(1990, 5, 15, 12, 0, 0)));
    const b = natalPlanets(new Date(Date.UTC(1990, 5, 15, 12, 0, 0)));
    a.forEach((p, i) => {
      expect(p.longitude).toBeCloseTo(b[i].longitude, 5);
    });
  });

  it("keeps Local Sidereal Time in [0,24) sidereal hours", () => {
    const lst = localSiderealTimeDegrees(new Date(Date.UTC(1990, 5, 15, 9, 30, 0)), NYC.longitude);
    expect(lst / 15).toBeGreaterThanOrEqual(0);
    expect(lst / 15).toBeLessThan(24);
  });

  it("reports a physically plausible mean obliquity near 23.44°", () => {
    const eps = meanObliquity(new Date(Date.UTC(1990, 5, 15, 12, 0, 0)));
    expect(eps).toBeGreaterThan(23.4);
    expect(eps).toBeLessThan(23.5);
  });

  it("produces twelve whole-sign cusps that tile the zodiac exactly once", () => {
    const houses = housesAt(new Date(Date.UTC(1990, 5, 15, 9, 30, 0)), NYC);
    expect(houses.cusps).toHaveLength(12);
    const signs = houses.cusps.map((c) => c.sign);
    expect(new Set(signs).size).toBe(12);
    for (let i = 1; i < 12; i++) {
      const prev = houses.cusps[i - 1].longitude;
      const cur = houses.cusps[i].longitude;
      const delta = (cur - prev + 360) % 360;
      expect(delta).toBeCloseTo(30, 5);
    }
    expect(houses.cusps[0].longitude).toBeCloseTo(
      Math.floor(houses.ascendantLongitude / 30) * 30,
      5,
    );
  });

  it("sets the Ascendant to a valid, in-range sign", () => {
    const houses = housesAt(new Date(Date.UTC(1990, 5, 15, 9, 30, 0)), NYC);
    expect(houses.ascendantLongitude).toBeGreaterThanOrEqual(0);
    expect(houses.ascendantLongitude).toBeLessThan(360);
    expect(["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"])
      .toContain(houses.ascendant);
  });

  it("flags the noon assumption transparently when time is unknown", () => {
    const cfg = validateBirth({ ...validInput, timeKnown: false })!;
    expect(cfg.ok).toBe(true);
    const chart = computeNatalChart(cfg.config!.date, NYC, { timeAssumed: true });
    expect(chart.timeAssumed).toBe(true);
    expect(chart.timeNote).toContain("12:00 PM (Noon) UTC");
    expect(chart.utcTime).toContain("12:00:00");
  });

  it("composes a full chart with big three + 4 readings", () => {
    const cfg = validateBirth(validInput)!;
    expect(cfg.ok).toBe(true);
    const chart = computeNatalChart(cfg.config!.date, NYC, { timeAssumed: false });
    expect(chart.bigThree.ascendant).toBe(chart.houses.ascendant);
    expect(chart.planets).toHaveLength(10);
    expect(chart.readings.love.key).toBe("love");
    expect(chart.readings.career.key).toBe("career");
    expect(chart.readings.wealth.key).toBe("wealth");
    expect(chart.readings.life.key).toBe("life");
    expect(chart.readings.love.body.length).toBeGreaterThan(40);
  });

  it("numbers houses by ascendant sign index correctly", () => {
    expect(houseOf(0, 0)).toBe(1);
    expect(houseOf(0, 5)).toBe(6);
    expect(houseOf(5, 0)).toBe(8);
    expect(houseOf(11, 10)).toBe(12);
  });
});

describe("birth input validation", () => {
  it("accepts a well-formed input", () => {
    const res = validateBirth(validInput);
    expect(res.ok).toBe(true);
  });

  it("enforces the year range", () => {
    const res = validateBirth({ ...validInput, year: YEAR_RANGE.min - 1 });
    expect(res.ok).toBe(false);
    expect(res.errors.year).toBeDefined();
  });

  it("rejects out-of-range latitude and longitude", () => {
    const res = validateBirth({ ...validInput, latitude: 91 });
    expect(res.ok).toBe(false);
    expect(res.errors.latitude).toBeDefined();
    const res2 = validateBirth({ ...validInput, longitude: -181 });
    expect(res2.ok).toBe(false);
    expect(res2.errors.longitude).toBeDefined();
  });

  it("rejects impossible calendar dates (2023-02-30)", () => {
    const res = validateBirth({ ...validInput, year: 2023, month: 2, day: 30 });
    expect(res.ok).toBe(false);
    expect(res.errors.day).toBeDefined();
  });

  it("rejects invalid hourly/minute inputs when time is known", () => {
    const r1 = validateBirth({ ...validInput, hour12: 0 });
    expect(r1.ok).toBe(false);
    const r2 = validateBirth({ ...validInput, minute: 60 });
    expect(r2.ok).toBe(false);
  });

  it("builds a correct UTC noon when time is marked unknown", () => {
    const cfg = validateBirth({ ...validInput, timeKnown: false })!;
    const d = cfg.config!.date;
    expect(d.getUTCHours()).toBe(12);
    expect(d.getUTCMinutes()).toBe(0);
  });

  it("resolves AM/PM into the correct 24-hour UTC time", () => {
    const am = validateBirth(validInput)!.config!.date;
    expect(am.getUTCHours()).toBe(9);
    const pm = validateBirth({ ...validInput, hour12: 9, ampm: "PM" })!.config!.date;
    expect(pm.getUTCHours()).toBe(21);
  });
});

describe("readings", () => {
  it("builds deterministic readings that cite real placements", () => {
    const planets = natalPlanets(new Date(Date.UTC(1990, 5, 15, 9, 30, 0)));
    const asc = "virgo";
    const readings = buildReadings(planets, asc);
    const all = [readings.love, readings.career, readings.wealth, readings.life];
    for (const r of all) {
      expect(r.body.length).toBeGreaterThan(40);
      expect(r.body).not.toContain("TODO");
      expect(r.body).not.toContain("lorem");
      expect(r.drivers.length).toBeGreaterThanOrEqual(2);
    }
    expect(new Set(all.map((r) => r.key)).size).toBe(4);
  });
});

const SIGNS = [
  "aries","taurus","gemini","cancer","leo","virgo",
  "libra","scorpio","sagittarius","capricorn","aquarius","pisces",
];

describe("verification matrix (5 reference natal cases)", () => {
  // Exact UTC instants: noon UTC, with observer at New York.
  const CASES: { label: string; year: number; month: number; day: number }[] = [
    { label: "1995-03-21", year: 1995, month: 3, day: 21 },
    { label: "1988-11-12", year: 1988, month: 11, day: 12 },
    { label: "2001-07-04", year: 2001, month: 7, day: 4 },
    { label: "1975-01-15", year: 1975, month: 1, day: 15 },
    { label: "2010-09-30", year: 2010, month: 9, day: 30 },
  ];

  it.each(CASES)(
    "produces a valid, deterministic full chart for $label",
    ({ year, month, day }) => {
      const input: BirthInput = {
        year, month, day,
        hour12: 12, minute: 0, ampm: "PM",
        timeKnown: true,
        latitude: NYC.latitude, longitude: NYC.longitude,
        placeName: "New York, USA",
      };
      const cfg = validateBirth(input);
      expect(cfg.ok).toBe(true);
      const a = computeNatalChart(cfg.config!.date, NYC, { timeAssumed: false });
      const b = computeNatalChart(cfg.config!.date, NYC, { timeAssumed: false });

      // Big three all map to real signs with valid longitudes.
      expect(SIGNS).toContain(a.bigThree.sun.sign);
      expect(SIGNS).toContain(a.bigThree.moon.sign);
      expect(SIGNS).toContain(a.bigThree.ascendant);
      expect(a.bigThree.sun.longitude).toBeGreaterThanOrEqual(0);
      expect(a.bigThree.moon.longitude).toBeLessThan(360);

      // All ten bodies present and deterministic across runs.
      expect(a.planets).toHaveLength(10);
      a.planets.forEach((p, i) => {
        expect(p.longitude).toBeCloseTo(b.planets[i].longitude, 5);
        expect(p.sign).toBe(b.planets[i].sign);
      });

      // Ascendant + houses deterministic.
      expect(a.houses.ascendantLongitude).toBeCloseTo(b.houses.ascendantLongitude, 5);

      // Every reading renders real, substantial copy.
      const all = [a.readings.love, a.readings.career, a.readings.wealth, a.readings.life];
      for (const r of all) {
        expect(r.body.length).toBeGreaterThan(40);
        expect(r.body).not.toContain("TODO");
        expect(r.body).not.toContain("lorem");
      }
      expect(a.engineVersion).toBe(b.engineVersion);
    },
  );

  it("resolves the historical sign boundaries within the matrix", () => {
    const sunSigns = CASES.map(({ year, month, day }) => {
      const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
      const planets = natalPlanets(date);
      return planets.find((p) => p.key === "sun")!.sign;
    });
    expect(sunSigns[0]).toBe("aries");       // 1995-03-21
    expect(sunSigns[1]).toBe("scorpio");     // 1988-11-12
    expect(sunSigns[2]).toBe("cancer");      // 2001-07-04
    expect(sunSigns[3]).toBe("capricorn");   // 1975-01-15
    expect(sunSigns[4]).toBe("libra");       // 2010-09-30
  });
});
