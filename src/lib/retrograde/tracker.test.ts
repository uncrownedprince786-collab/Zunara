import { describe, it, expect } from "vitest";
import {
  retrogradeStatus,
  tabulateRetrogrades,
  liveSkyStats,
  TRACKED_PLANETS,
} from "./tracker";
import type { BodyKey } from "@/lib/astronomy/bodies";

const FIXED_AT = new Date(Date.UTC(2026, 7, 5, 12, 0, 0));

describe("retrograde tracker", () => {
  it("keeps every tracked window with start before end", () => {
    for (const planet of TRACKED_PLANETS) {
      const s = retrogradeStatus(planet, FIXED_AT);
      for (const w of [s.current, s.next]) {
        if (w) {
          expect(w.start.getTime()).toBeLessThan(w.end.getTime());
        }
      }
    }
  });

  it("uses the horizon for the next window and returns real Dates", () => {
    const mercury = retrogradeStatus("mercury", FIXED_AT, { horizonDays: 180 });
    if (mercury.next) {
      expect(mercury.next.start).toBeInstanceOf(Date);
      expect(mercury.next.end).toBeInstanceOf(Date);
      // The next window must begin after `at`.
      expect(mercury.next.start.getTime()).toBeGreaterThan(FIXED_AT.getTime());
    }
    // Mercury retrogrades roughly every 3–4 months, so a next window should be
    // present within a 360-day horizon with high confidence.
    const wide = retrogradeStatus("mercury", FIXED_AT, { horizonDays: 360 });
    expect(wide.next).not.toBeNull();
  });

  it("keeps currentlyRetrograde consistent with current", () => {
    for (const planet of TRACKED_PLANETS) {
      const s = retrogradeStatus(planet, FIXED_AT);
      expect(s.currentlyRetrograde).toBe(s.current !== null);
    }
  });

  it("lastStarted is a Date or null and never precedes the grid start", () => {
    for (const planet of TRACKED_PLANETS) {
      const s = retrogradeStatus(planet, FIXED_AT, { horizonDays: 180 });
      if (s.lastStarted) {
        expect(s.lastStarted).toBeInstanceOf(Date);
        expect(s.lastStarted.getTime()).toBeLessThanOrEqual(FIXED_AT.getTime());
      }
    }
  });

  it("is deterministic across two calls", () => {
    for (const planet of TRACKED_PLANETS) {
      const a = retrogradeStatus(planet, FIXED_AT);
      const b = retrogradeStatus(planet, FIXED_AT);
      expect(a.currentlyRetrograde).toBe(b.currentlyRetrograde);
      expect(a.current?.start.getTime()).toBe(b.current?.start.getTime());
      expect(a.next?.start.getTime()).toBe(b.next?.start.getTime());
    }
  });

  it("tabulates all tracked planets ordered by next start", () => {
    const tabs = tabulateRetrogrades(FIXED_AT);
    expect(tabs).toHaveLength(TRACKED_PLANETS.length);
    const starts = tabs.map((t) => t.start?.getTime() ?? Infinity);
    for (let i = 1; i < starts.length; i++) {
      expect(starts[i - 1]).toBeLessThanOrEqual(starts[i]);
    }
    for (const t of tabs) {
      expect(["mild", "moderate", "intense"]).toContain(t.strength);
      expect(t.advice.length).toBeGreaterThan(20);
      expect(t.planet).toBeTruthy();
    }
  });

  it("reports live sky stats with consistent counts and sign map", () => {
    const stats = liveSkyStats(FIXED_AT);
    expect(stats.retrogradePlanets).toHaveLength(stats.retrogradeCount);
    expect(stats.planetsBySign).toHaveLength(TRACKED_PLANETS.length);
    for (const pl of stats.planetsBySign) {
      expect(TRACKED_PLANETS).toContain(pl.planet as BodyKey);
      expect(pl.sign.length).toBeGreaterThan(0);
    }
    expect(stats.note.length).toBeGreaterThan(20);
  });

  it("live sky stats are deterministic", () => {
    expect(liveSkyStats(FIXED_AT).retrogradeCount).toBe(liveSkyStats(FIXED_AT).retrogradeCount);
  });

  it("returns an empty, non-throwing status for an untracked body", () => {
    const s = retrogradeStatus("sun", FIXED_AT);
    expect(s.currentlyRetrograde).toBe(false);
    expect(s.current).toBeNull();
    expect(s.next).toBeNull();
  });
});
