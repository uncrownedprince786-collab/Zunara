import { describe, expect, it } from "vitest";
import { onThisDay, type OnThisDayEvent } from "./on-this-day";

const ALL_DATES: { month: number; day: number }[] = [];
for (let m = 1; m <= 12; m++) {
  const dim = new Date(2024, m, 0).getDate();
  for (let d = 1; d <= dim; d++) ALL_DATES.push({ month: m, day: d });
}

function flatten(rows: OnThisDayEvent[]) {
  return rows.map((r) => `${r.month}-${r.day}`);
}

describe("on-this-day dataset", () => {
  it("covers every calendar date (incl. leap day) with at least 3 events", () => {
    const covered = new Set(flatten(ALL_DATES.map(({ month, day }) => onThisDay(month, day)).flat()));
    expect(covered.size).toBe(366);
    for (const d of ALL_DATES) {
      const events = onThisDay(d.month, d.day);
      expect(events.length, `${d.month}-${d.day} has ${events.length} events`).toBeGreaterThanOrEqual(3);
      expect(events.length).toBeLessThanOrEqual(4);
    }
  });

  it("all years are within 1000..2025 and summaries are well-formed", () => {
    for (const d of ALL_DATES) {
      for (const e of onThisDay(d.month, d.day)) {
        expect(e.year, `${d.month}-${d.day}`).toBeGreaterThanOrEqual(1000);
        expect(e.year, `${d.month}-${d.day}`).toBeLessThanOrEqual(2025);
        expect(e.summary.length, `${d.month}-${d.day}`).toBeGreaterThan(24);
        expect(e.summary.length, `${d.month}-${d.day}`).toBeLessThan(400);
        expect(e.summary, `${d.month}-${d.day}`).toMatch(/^[\p{L}\p{N}"“]/u);
        expect(e.summary, `${d.month}-${d.day}`).toMatch(/[.!?]$/);
        expect(e.summary, `${d.month}-${d.day}`).not.toMatch(/[.!?]{2,}$/);
      }
    }
  });

  it("no leftover wikitext markup in summaries", () => {
    for (const d of ALL_DATES) {
      for (const e of onThisDay(d.month, d.day)) {
        expect(e.summary, `${d.month}-${d.day}`).not.toMatch(/[\[\]{}]|<|>/);
      }
    }
  });

  it("each date has no duplicate (year, summary) pairs", () => {
    for (const d of ALL_DATES) {
      const events = onThisDay(d.month, d.day);
      const keys = events.map((e) => `${e.year}|${e.summary}`);
      expect(new Set(keys).size, `${d.month}-${d.day}`).toBe(keys.length);
    }
  });

  it("results are deterministic and sorted by year ascending", () => {
    for (const d of ALL_DATES) {
      const a = onThisDay(d.month, d.day);
      const b = onThisDay(d.month, d.day);
      expect(b).toEqual(a);
      for (let i = 1; i < a.length; i++) {
        expect(a[i].year, `${d.month}-${d.day}`).toBeGreaterThan(a[i - 1].year);
      }
    }
  });
});