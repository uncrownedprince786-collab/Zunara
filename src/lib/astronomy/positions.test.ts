import { describe, it, expect } from "vitest";
import { computePosition, computeSnapshot } from "@/lib/astronomy/astro";

describe("accuracy: known Sun longitudes", () => {
  it("J2000 epoch: Sun longitude ≈ 280.46°", () => {
    const pos = computePosition("sun", new Date("2000-01-01T12:00:00Z"));
    expect(pos).not.toBeNull();
    expect(Math.abs(pos!.longitude - 280.46)).toBeLessThan(0.6);
  });

  it("March equinox 2026: Sun longitude within ±1.5° of 0°/360°", () => {
    const pos = computePosition("sun", new Date("2026-03-20T12:00:00Z"));
    expect(pos).not.toBeNull();
    const diff = Math.min(
      Math.abs(pos!.longitude - 0),
      360 - Math.abs(pos!.longitude - 0),
    );
    expect(diff).toBeLessThan(1.5);
  });
});

const SAMPLE_DATES = [
  new Date("1800-01-01T12:00:00Z"),
  new Date("1900-03-01T12:00:00Z"),
  new Date("2024-02-29T12:00:00Z"),
  new Date("2026-09-07T12:00:00Z"),
  new Date("2100-12-31T12:00:00Z"),
  new Date("2199-06-15T12:00:00Z"),
];

type BodyKey = "sun" | "moon" | "jupiter";
const SAMPLE_BODIES: BodyKey[] = ["sun", "moon", "jupiter"];

describe("sample robustness & determinism", () => {
  for (const date of SAMPLE_DATES) {
    const label = date.toISOString();
    describe(label, () => {
      for (const key of SAMPLE_BODIES) {
        it(`${key}: finite, in [0,360), retrograde is boolean, deterministic`, () => {
          const a = computePosition(key, date);
          expect(a).not.toBeNull();
          expect(Number.isFinite(a!.longitude)).toBe(true);
          expect(a!.longitude).toBeGreaterThanOrEqual(0);
          expect(a!.longitude).toBeLessThan(360);
          expect(typeof a!.retrograde).toBe("boolean");

          const b = computePosition(key, date);
          expect(b).not.toBeNull();
          expect(a!.longitude).toBe(b!.longitude);
          expect(a!.retrograde).toBe(b!.retrograde);
          expect(a!.sign).toBe(b!.sign);
        });
      }
    });
  }
});

it("full snapshot for 2026-09-07 is deterministic", () => {
  const a = computeSnapshot(new Date("2026-09-07T12:00:00Z"), false);
  const b = computeSnapshot(new Date("2026-09-07T12:00:00Z"), false);
  expect(a).toEqual(b);
});
