import { describe, it, expect } from "vitest";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { ASTROLOGY_TOPICS } from "@/lib/astrology/topics";
import { horoscopeMetadata, signIndexMetadata } from "./metadata";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("SEO", () => {
  const aries = ZODIAC_SIGNS[0];

  describe("metadata", () => {
    it("produces canonical URLs for daily horoscope", () => {
      const meta = horoscopeMetadata(aries, "daily", "Monday, August 31, 2026");
      expect(meta.alternates?.canonical).toContain("/horoscope/aries/today");
    });

    it("produces canonical URLs for weekly", () => {
      const meta = horoscopeMetadata(aries, "weekly", "Week of Aug 31");
      expect(meta.alternates?.canonical).toContain("/horoscope/aries/weekly");
    });

    it("includes a meaningful description", () => {
      const meta = horoscopeMetadata(aries, "daily", "Monday, August 31, 2026");
      expect(meta.description).toBeTruthy();
      expect(meta.description!.length).toBeGreaterThan(20);
    });

    it("sign index metadata has canonical", () => {
      const meta = signIndexMetadata(aries);
      expect(meta.alternates?.canonical).toContain("/horoscope/aries");
      expect(meta.title).toContain("Aries");
    });
  });

  describe("sitemap", () => {
    const entries = sitemap();
    it("covers all 12 sign hubs", () => {
      for (const sign of ZODIAC_SIGNS) {
        expect(entries.some((e) => e.url.endsWith(`/horoscope/${sign.slug}`))).toBe(true);
      }
    });
    it("covers all period pages for every sign", () => {
      for (const sign of ZODIAC_SIGNS) {
        for (const period of ["today", "weekly", "monthly", "yearly"]) {
          expect(entries.some((e) => e.url.endsWith(`/horoscope/${sign.slug}/${period}`))).toBe(true);
        }
      }
    });
    it("covers the homepage and horoscope index", () => {
      expect(entries.some((e) => e.url.endsWith("/"))).toBe(true);
      expect(entries.some((e) => e.url.endsWith("/horoscope"))).toBe(true);
    });
    it("covers all astrology topics", () => {
      for (const topic of ASTROLOGY_TOPICS) {
        expect(entries.some((e) => e.url.endsWith(`/astrology/${topic.slug}`))).toBe(true);
      }
    });
    it("all entries have absolute URLs", () => {
      for (const e of entries) {
        expect(e.url.startsWith("http")).toBe(true);
      }
    });
  });

  describe("robots", () => {
    const config = robots();
    it("disallows api and admin paths", () => {
      const rule = Array.isArray(config.rules) ? config.rules[0] : config.rules;
      const disallowed = rule?.disallow ?? [];
      expect(disallowed).toContain("/api/");
      expect(disallowed).toContain("/admin/");
    });
    it("points to the sitemap", () => {
      expect(config.sitemap).toContain("/sitemap.xml");
    });
  });
});
