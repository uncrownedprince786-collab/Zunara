import { describe, expect, it } from "vitest";
import {
  calculateSkyEvents,
  calculateSkyEventsForYear,
  mergeSkyEventSources,
  seasonKeyOf,
  SKY_CALC_HORIZON_DAYS,
} from "./sky-events-calculated";
import { ANNUAL_SHOWER_PEAKS } from "./sky-events-data";
import type { SkyEvent } from "./sky-events-data";

const NOW = new Date("2026-09-15T12:00:00Z");
const ts = (iso: string) => new Date(`${iso}T00:00:00Z`).getTime();

describe("calculateSkyEvents", () => {
  it("only contains events at or after the reference date", () => {
    for (const e of calculateSkyEvents(NOW)) {
      expect(ts(e.start)).toBeGreaterThanOrEqual(ts("2026-09-14"));
    }
  });

  it("finds the autumnal equinox and the coming moon quarters", () => {
    const keys = calculateSkyEvents(NOW).map((e) => e.titleKey).join(" ");
    expect(keys).toContain("skyEvents.events.autumnalEquinox.title");
    expect(keys).toContain("phases.fullMoon");
    expect(keys).toContain("phases.newMoon");
    expect(keys).toContain("phases.firstQuarter");
  });

  it("keeps every event inside the rolling horizon", () => {
    const horizonMs = NOW.getTime() + SKY_CALC_HORIZON_DAYS * 86400000;
    for (const e of calculateSkyEvents(NOW)) {
      expect(ts(e.start)).toBeLessThanOrEqual(horizonMs + 86400000);
    }
  });

  it("returns events sorted oldest-first", () => {
    const events = calculateSkyEvents(NOW);
    const times = events.map((e) => ts(e.start));
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it("classifies lunar phases and seasonal points by category", () => {
    const events = calculateSkyEvents(NOW);
    expect(events.some((e) => e.category === "moon-phases")).toBe(true);
    expect(events.some((e) => e.category === "seasonal")).toBe(true);
  });

  it("is deterministic for a fixed reference date", () => {
    expect(calculateSkyEvents(NOW)).toEqual(calculateSkyEvents(NOW));
  });
});

describe("mergeSkyEventSources", () => {
  const generic: SkyEvent = {
    title: "Full Moon",
    start: "2026-09-26",
    description: "generic",
    category: "moon-phases",
  };
  const named: SkyEvent = {
    title: "Full Moon · Harvest Moon",
    start: "2026-09-26",
    description: "named",
    category: "moon-phases",
  };
  const meteor: SkyEvent = {
    title: "Orionids",
    start: "2026-10-21",
    description: "sky",
    category: "meteor-showers",
  };

  it("keeps the first source of a same-date, same-category duplicate", () => {
    const merged = mergeSkyEventSources([named], [generic]);
    expect(merged).toHaveLength(1);
    expect(merged[0].title).toBe("Full Moon · Harvest Moon");
  });

  it("keeps events from different categories even on the same day", () => {
    const sameDay = mergeSkyEventSources(
      [{ ...named, start: "2026-10-21" }],
      [meteor],
    );
    expect(sameDay).toHaveLength(2);
  });

  it("is a pure first-wins merge regardless of input order", () => {
    const a = mergeSkyEventSources([generic], [meteor]);
    const b = mergeSkyEventSources([meteor], [generic]);
    expect(a).toHaveLength(2);
    expect(b).toHaveLength(2);
  });

  it("collapses seasonal equinox duplicates even when the date differs by a day", () => {
    const curated: SkyEvent = {
      title: "Autumnal Equinox",
      start: "2026-09-22",
      description: "curated day",
      category: "seasonal",
      titleKey: "skyEvents.events.autumnalEquinox.title",
      descKey: "skyEvents.events.autumnalEquinox.desc",
    };
    const computed: SkyEvent = {
      title: "autumnalEquinox",
      start: "2026-09-23",
      description: "computed crossing",
      category: "seasonal",
      titleKey: "skyEvents.events.autumnalEquinox.title",
      descKey: "skyEvents.events.autumnalEquinox.desc",
    };
    const feed: SkyEvent = {
      title: "September Equinox",
      start: "2026-09-23",
      description: "live feed day",
      category: "eclipses",
    };
    const merged = mergeSkyEventSources([feed], [computed], [curated]);
    expect(merged).toHaveLength(1);
    expect(merged[0].title).toBe("September Equinox");
  });

  it("keeps ordinary same-category events on different days", () => {
    const dayA: SkyEvent = {
      title: "Full Moon",
      start: "2026-09-26",
      description: "a",
      category: "moon-phases",
    };
    const dayB: SkyEvent = {
      title: "Full Moon",
      start: "2026-09-27",
      description: "b",
      category: "moon-phases",
    };
    expect(mergeSkyEventSources([dayA], [dayB])).toHaveLength(2);
  });
});

describe("seasonKeyOf", () => {
  it("returns null for non-seasonal events", () => {
    expect(seasonKeyOf({ title: "Full Moon", start: "2026-09-26", description: "" })).toBeNull();
  });

  it("maps an equinox to a stable season token", () => {
    expect(seasonKeyOf({ title: "Autumnal Equinox", start: "2026-09-22", description: "" }))
      .toBe("season|2026|autumn|equinox");
  });
});

const YEAR = 2026;
const yearStartTs = Date.UTC(YEAR, 0, 1);
const yearEndTs = Date.UTC(YEAR, 11, 31, 23, 59, 59);

describe("calculateSkyEventsForYear", () => {
  const events = calculateSkyEventsForYear(YEAR);

  it("generates exactly 4 seasonal events", () => {
    const seasonal = events.filter((e) => e.category === "seasonal");
    expect(seasonal).toHaveLength(4);
  });

  it("seasonal events have full ISO datetime starts", () => {
    const seasonal = events.filter((e) => e.category === "seasonal");
    for (const e of seasonal) {
      expect(e.start.length).toBeGreaterThan(10);
      expect(Number.isNaN(new Date(e.start).getTime())).toBe(false);
    }
  });

  it("generates moon phases in the expected range", () => {
    const phases = events.filter((e) => e.category === "moon-phases");
    expect(phases.length).toBeGreaterThanOrEqual(12);
    expect(phases.length).toBeLessThanOrEqual(60);
  });

  it("all moon phases are sorted", () => {
    const phases = events.filter((e) => e.category === "moon-phases");
    const times = phases.map((e) => new Date(e.start).getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it("generates exactly the expected number of meteor showers", () => {
    const showers = events.filter((e) => e.category === "meteor-showers");
    expect(showers).toHaveLength(ANNUAL_SHOWER_PEAKS.length);
  });

  it("meteor showers have date-only starts", () => {
    const showers = events.filter((e) => e.category === "meteor-showers");
    for (const e of showers) {
      expect(e.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("generates at least one conjunction", () => {
    const conjunctions = events.filter((e) => e.category === "conjunctions");
    expect(conjunctions.length).toBeGreaterThanOrEqual(1);
  });

  it("conjunction events have truthy bodyA and bodyB", () => {
    const conjunctions = events.filter((e) => e.category === "conjunctions");
    for (const e of conjunctions) {
      expect(e.bodyA).toBeTruthy();
      expect(e.bodyB).toBeTruthy();
    }
  });

  it("conjunction events have parseable starts", () => {
    const conjunctions = events.filter((e) => e.category === "conjunctions");
    for (const e of conjunctions) {
      expect(Number.isNaN(new Date(e.start).getTime())).toBe(false);
    }
  });

  it("every start is a valid ISO date or datetime within the year", () => {
    for (const e of events) {
      expect(e.start).toMatch(/^\d{4}-\d{2}-\d{2}/);
      const ts = new Date(e.start).getTime();
      expect(ts).toBeGreaterThanOrEqual(yearStartTs);
      expect(ts).toBeLessThanOrEqual(yearEndTs);
    }
  });

  it("returns events globally sorted by start", () => {
    const times = events.map((e) => new Date(e.start).getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it("is deterministic across calls", () => {
    const a = calculateSkyEventsForYear(YEAR);
    const b = calculateSkyEventsForYear(YEAR);
    expect(a).toEqual(b);
  });
});