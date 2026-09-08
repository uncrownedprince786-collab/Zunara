import { describe, expect, it } from "vitest";
import {
  celebrityMatchesFilter,
  CELEBRITY_FILTER_GROUPS,
} from "./filters";
import type { Celebrity } from "@/lib/content/celebrities";
import { celebritiesForDate } from "@/lib/content/celebrities";

describe("celebrity filter groups", () => {
  it("maps cinema to cinema category", () => {
    expect(CELEBRITY_FILTER_GROUPS.cinema).toEqual(["cinema"]);
  });

  it("maps music to music category", () => {
    expect(CELEBRITY_FILTER_GROUPS.music).toEqual(["music"]);
  });

  it("maps science to science, tech-business, and world-leaders", () => {
    expect(CELEBRITY_FILTER_GROUPS.science).toEqual([
      "science",
      "tech-business",
      "world-leaders",
    ]);
  });

  it("maps sports to sports category", () => {
    expect(CELEBRITY_FILTER_GROUPS.sports).toEqual(["sports"]);
  });
});

describe("celebrityMatchesFilter", () => {
  it("returns true for 'all' on any celebrity", () => {
    const c: Celebrity = {
      month: 1,
      day: 1,
      name: "Test",
      profession: "Cook",
      region: "Global",
      star: "test",
      url: "",
    };
    expect(celebrityMatchesFilter(c, "all")).toBe(true);
  });

  it("matches known Hollywood actors to cinema", () => {
    const actor: Celebrity = {
      month: 7,
      day: 3,
      name: "Tom Cruise",
      profession: "Actor",
      region: "Hollywood",
      star: "test",
      url: "",
    };
    expect(celebrityMatchesFilter(actor, "cinema")).toBe(true);
    expect(celebrityMatchesFilter(actor, "music")).toBe(false);
  });

  it("matches known musicians to music", () => {
    const singer: Celebrity = {
      month: 8,
      day: 29,
      name: "Michael Jackson",
      profession: "Singer",
      region: "Global",
      star: "test",
      url: "",
    };
    expect(celebrityMatchesFilter(singer, "music")).toBe(true);
    expect(celebrityMatchesFilter(singer, "cinema")).toBe(false);
  });

  it("matches known athletes to sports", () => {
    const athlete: Celebrity = {
      month: 2,
      day: 17,
      name: "Michael Jordan",
      profession: "Basketball player",
      region: "Sports",
      star: "test",
      url: "",
    };
    expect(celebrityMatchesFilter(athlete, "sports")).toBe(true);
    expect(celebrityMatchesFilter(athlete, "cinema")).toBe(false);
  });

  it("matches physicists and statesmen to science group", () => {
    const physicist: Celebrity = {
      month: 3,
      day: 14,
      name: "Albert Einstein",
      profession: "Physicist",
      region: "Global",
      star: "test",
      url: "",
    };
    expect(celebrityMatchesFilter(physicist, "science")).toBe(true);
    expect(celebrityMatchesFilter(physicist, "cinema")).toBe(false);

    const statesman: Celebrity = {
      month: 7,
      day: 18,
      name: "Nelson Mandela",
      profession: "Statesman",
      region: "Global",
      star: "test",
      url: "",
    };
    expect(celebrityMatchesFilter(statesman, "science")).toBe(true);
  });

  it("handles celebrities with explicit category field", () => {
    const c: Celebrity = {
      month: 1,
      day: 1,
      name: "Test",
      profession: "Cook",
      region: "Global",
      star: "test",
      url: "",
      category: "music",
    };
    expect(celebrityMatchesFilter(c, "music")).toBe(true);
    expect(celebrityMatchesFilter(c, "cinema")).toBe(false);
  });

  it("never throws on unknown professions", () => {
    const c: Celebrity = {
      month: 1,
      day: 1,
      name: "Test",
      profession: "zzz-unclassified",
      region: "Global",
      star: "zzz",
      url: "",
    };
    expect(() => celebrityMatchesFilter(c, "all")).not.toThrow();
    expect(() => celebrityMatchesFilter(c, "cinema")).not.toThrow();
    expect(() => celebrityMatchesFilter(c, "music")).not.toThrow();
    expect(() => celebrityMatchesFilter(c, "science")).not.toThrow();
    expect(() => celebrityMatchesFilter(c, "sports")).not.toThrow();
  });

  it("matches curated September 7 celebrities correctly", () => {
    const sept7 = celebritiesForDate(9, 7);
    const singers = sept7.filter(
      (c) => c.profession.toLowerCase() === "singer",
    );
    for (const s of singers) {
      expect(celebrityMatchesFilter(s, "music")).toBe(true);
    }
    const athletes = sept7.filter(
      (c) => c.profession.toLowerCase() === "basketball player",
    );
    for (const a of athletes) {
      expect(celebrityMatchesFilter(a, "sports")).toBe(true);
    }
  });
});
