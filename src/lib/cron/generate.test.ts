import { describe, it, expect } from "vitest";
import { duePeriods, runGenerationForPeriod } from "./generate";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";

describe("cron automation", () => {
  describe("duePeriods rollover detection", () => {
    it("daily runs every day", () => {
      expect(duePeriods(new Date("2026-08-15T04:00:00Z"))).toContain("daily");
      expect(duePeriods(new Date("2026-01-01T04:00:00Z"))).toContain("daily");
    });

    it("weekly runs on Monday (UTC day 1)", () => {
      const monday = duePeriods(new Date("2026-08-31T04:00:00Z")); // Aug 31 2026 is a Monday
      expect(monday).toContain("weekly");
      const tuesday = duePeriods(new Date("2026-09-01T04:00:00Z"));
      expect(tuesday).not.toContain("weekly");
    });

    it("monthly runs on the 1st", () => {
      const first = duePeriods(new Date("2026-09-01T04:00:00Z"));
      expect(first).toContain("monthly");
      const mid = duePeriods(new Date("2026-09-15T04:00:00Z"));
      expect(mid).not.toContain("monthly");
    });

    it("yearly runs on Jan 1", () => {
      const jan1 = duePeriods(new Date("2027-01-01T04:00:00Z"));
      expect(jan1).toContain("yearly");
      const feb1 = duePeriods(new Date("2027-02-01T04:00:00Z"));
      expect(feb1).not.toContain("yearly");
    });

    it("handles future years with no hardcoding", () => {
      const future = duePeriods(new Date("2032-01-01T04:00:00Z"));
      expect(future).toContain("yearly");
      expect(future).toContain("monthly");
      expect(future).toContain("daily");
    });

    it("Monday that is also the 1st triggers weekly and monthly together", () => {
      // Sep 1 2025 is a Monday
      expect(duePeriods(new Date("2025-09-01T04:00:00Z"))).toEqual(
        expect.arrayContaining(["daily", "weekly", "monthly"]),
      );
    });
  });

  describe("runGenerationForPeriod", () => {
    it("generates all 12 signs without a database", async () => {
      const result = await runGenerationForPeriod("daily");
      expect(result.generatedCount).toBe(ZODIAC_SIGNS.length);
      expect(result.validCount).toBe(ZODIAC_SIGNS.length);
      expect(result.ok).toBe(true);
      expect(result.duplicatePairs).toBe(0);
      expect(result.periodType).toBe("daily");
    });
  });
});
