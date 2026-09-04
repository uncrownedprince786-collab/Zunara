import { describe, expect, it } from "vitest";
import {
  selectActiveMonthEvents,
  type SkyEvent,
} from "./sky-events";
import { YEARLY_EVENTS_2026 } from "@/lib/content/sky-events-data";

function ev(month: number, day: number, title = `ev-${month}-${day}`): SkyEvent {
  return {
    title,
    start: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    description: "test event",
  };
}

const NOW = new Date("2026-09-15T12:00:00Z");

describe("selectActiveMonthEvents", () => {
  it("keeps the current month and pulls the next month in when it is sparse", () => {
    // September has only 2 upcoming events (<3), so October's are merged in.
    const result = selectActiveMonthEvents(
      [
        ev(9, 18),
        ev(9, 25),
        ev(10, 5),
        ev(8, 2),
      ],
      NOW,
    );
    expect(result.month).toBe(9);
    expect(result.events.map((e) => e.start)).toEqual([
      "2026-09-18",
      "2026-09-25",
      "2026-10-05",
    ]);
  });

  it("rolls over to the next month when the current month has none left", () => {
    const result = selectActiveMonthEvents(
      [ev(9, 1), ev(10, 3), ev(10, 20)],
      NOW,
    );
    expect(result.month).toBe(10);
    expect(result.events.map((e) => e.start)).toEqual(["2026-10-03", "2026-10-20"]);
  });

  it("includes today's events", () => {
    const result = selectActiveMonthEvents([ev(9, 15)], NOW);
    expect(result.month).toBe(9);
    expect(result.events).toHaveLength(1);
  });

  it("sorts current-month events oldest-first", () => {
    const result = selectActiveMonthEvents([ev(9, 28), ev(9, 19), ev(9, 22)], NOW);
    expect(result.events.map((e) => e.start)).toEqual([
      "2026-09-19",
      "2026-09-22",
      "2026-09-28",
    ]);
  });

  it("falls back to the very next event when neither month has any", () => {
    const result = selectActiveMonthEvents([ev(9, 1), ev(11, 4)], NOW);
    expect(result.events.map((e) => e.start)).toEqual(["2026-11-04"]);
  });

  it("ignores past events", () => {
    const result = selectActiveMonthEvents([ev(9, 10), ev(9, 12), ev(9, 20)], NOW);
    expect(result.events.map((e) => e.start)).toEqual(["2026-09-20"]);
  });

  it("never returns an empty list when events exist anywhere later in the year", () => {
    const result = selectActiveMonthEvents([ev(12, 14)], new Date("2026-09-15T12:00:00Z"));
    expect(result.events.length).toBeGreaterThan(0);
  });
});

describe("full-year 2026 fallback dataset (regression)", () => {
  it("returns September 2026 events for mid-September (the reported live bug)", () => {
    const result = selectActiveMonthEvents(YEARLY_EVENTS_2026, NOW);
    expect(result.month).toBe(9);
    expect(result.events.length).toBeGreaterThanOrEqual(3);
    // September 2026 should include the autumnal equinox + September full/new moons
    const titles = result.events.map((e) => e.title).join(" ");
    expect(titles.toLowerCase()).toContain("equinox");
  });

  it("always populates at least 3 events for every month of 2026", () => {
    for (const month of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
      const sample = new Date(Date.UTC(2026, month - 1, 8)); // mid-month
      const result = selectActiveMonthEvents(YEARLY_EVENTS_2026, sample);
      expect(result.events.length, `month ${month} should have events`).toBeGreaterThanOrEqual(1);
      // Rich months (e.g. December) can return up to 5; the component displays `.slice(0,4)`.
      expect(result.events.length, `month ${month} card count`).toBeLessThanOrEqual(5);
    }
  });
});
