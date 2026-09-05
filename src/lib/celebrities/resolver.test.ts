import { describe, expect, it } from "vitest";
import type { Celebrity } from "@/lib/content/celebrities";
import {
  dateKey,
  resolveCelebritiesForDate,
  CACHE_STALE_MS,
  type CacheStore,
  type CachedCelebrities,
} from "./resolver";

function person(name: string): Celebrity {
  return {
    month: 9,
    day: 3,
    name,
    profession: "Figure",
    region: "Global",
    star: name,
    url: `https://en.wikipedia.org/wiki/${name.replace(/ /g, "_")}`,
  };
}

function freshCache(payload: Celebrity[]): CacheStore {
  const updatedAt = new Date("2026-09-04T00:00:00.000Z");
  const map = new Map<string, CachedCelebrities>();
  map.set("09-03", { payload, source: "cache", updatedAt });
  return {
    get: async (key) => map.get(key) ?? null,
    set: async (key, payload, source) => {
      map.set(key, { payload, source, updatedAt });
      return true;
    },
  };
}

describe("3-tier celebrity resolver", () => {
  it("Level 1: returns the cached payload and reports the cache source", async () => {
    const store = freshCache([person("Cached Star")]);
    const result = await resolveCelebritiesForDate(9, 3, {
      store,
      now: new Date("2026-09-04T12:00:00.000Z"),
    });
    expect(result.source).toBe("cache");
    expect(result.people).toHaveLength(1);
    expect(result.people[0].name).toBe("Cached Star");
  });

  it("Level 2: fetches live when the cache is missing and write-throughs it", async () => {
    let wrote = false;
    const store: CacheStore = {
      get: async () => null,
      set: async () => {
        wrote = true;
        return true;
      },
    };
    const result = await resolveCelebritiesForDate(9, 3, {
      store,
      fetchLive: async (m, d) => {
        expect(m).toBe(9);
        expect(d).toBe(3);
        return [person("Live Star")];
      },
    });
    expect(result.source).toBe("live");
    expect(result.people[0].name).toBe("Live Star");
    expect(wrote).toBe(true);
  });

  it("Level 3: falls back to the static pool when live fetch fails", async () => {
    const result = await resolveCelebritiesForDate(7, 14, {
      fetchLive: async () => {
        throw new Error("network down");
      },
    });
    expect(result.source).toBe("static");
    expect(result.people.length).toBeGreaterThan(0);
    expect(result.people.every((p) => p.month === 7 && p.day === 14)).toBe(true);
  });

  it("Level 3: falls back to static when live returns an empty list", async () => {
    const result = await resolveCelebritiesForDate(7, 14, {
      fetchLive: async () => [],
    });
    expect(result.source).toBe("static");
    expect(result.people.length).toBeGreaterThan(0);
  });

  it("treats a stale cache as stale and refreshes via live", async () => {
    const old = new Map<string, CachedCelebrities>();
    old.set("09-03", {
      payload: [person("Old Star")] as unknown as object,
      source: "cache",
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    const store: CacheStore = {
      get: async (key) => old.get(key) ?? null,
      set: async (key, payload) => {
        old.set(key, {
          payload,
          source: "live",
          updatedAt: new Date("2026-09-04T12:00:00.000Z"),
        });
        return true;
      },
    };
    const result = await resolveCelebritiesForDate(9, 3, {
      store,
      now: new Date("2026-09-04T12:00:00.000Z"),
      fetchLive: async () => [person("Fresh Star")],
    });
    expect(result.source).toBe("live");
    expect(result.people[0].name).toBe("Fresh Star");
  });

  it("exposes a stable date key (zero-padded)", () => {
    expect(dateKey(9, 3)).toBe("09-03");
    expect(dateKey(12, 31)).toBe("12-31");
  });

  it("surfaces the cached timestamp on a cache hit", async () => {
    const store = freshCache([person("Star")]);
    const result = await resolveCelebritiesForDate(9, 3, {
      store,
      now: new Date("2026-09-04T12:00:00.000Z"),
    });
    expect(result.source).toBe("cache");
    expect(result.cachedAt?.toISOString()).toBe("2026-09-04T00:00:00.000Z");
  });

  it("constant defines the staleness threshold as 26h", () => {
    expect(CACHE_STALE_MS).toBe(26 * 60 * 60 * 1000);
  });
});