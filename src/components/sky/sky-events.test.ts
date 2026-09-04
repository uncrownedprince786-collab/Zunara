import { describe, expect, it } from "vitest";
import {
  selectActiveMonthEvents,
  type SkyEvent,
} from "./sky-events";

function ev(month: number, day: number, title = `ev-${month}-${day}`): SkyEvent {
  return {
    title,
    start: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    description: "test event",
  };
}

const NOW = new Date("2026-09-15T12:00:00Z");

describe("selectActiveMonthEvents", () => {
  it("keeps the current month while it still has upcoming events", () => {
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
    expect(result.events.map((e) => e.start)).toEqual(["2026-09-18", "2026-09-25"]);
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
});
