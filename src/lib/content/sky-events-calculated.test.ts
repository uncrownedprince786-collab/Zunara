import { describe, expect, it } from "vitest";
import {
  calculateSkyEvents,
  mergeSkyEventSources,
  SKY_CALC_HORIZON_DAYS,
} from "./sky-events-calculated";
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
    expect(events.some((e) => e.category === "eclipses")).toBe(true);
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
});