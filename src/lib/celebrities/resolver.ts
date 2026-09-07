/**
 * 3-tier "Famous Birthdays Today" resolver.
 *
 * Level 1 (cache)    — read the pre-calculated daily-cron payload from the DB.
 * Level 2 (live)     — when the cache is empty or stale, fetch Wikidata live.
 * Level 3 (static)   — if that fails, serve the local curated pool.
 *
 * The live fetch always runs unless a database-backed cache serves the date,
 * so "Famous Birthdays Today" is dynamic in every environment. When no
 * database is configured, a small process-lifetime memory cache backs the live
 * tier, so repeat visitors never hammer the Wikidata endpoint. All
 * dependencies are injectable for deterministic unit tests.
 */
import type { Celebrity } from "@/lib/content/celebrities";
import { celebritiesForDate } from "@/lib/content/celebrities";
import { isDbConfigured } from "@/db";
import { getCelebrityCache, upsertCelebrityCache } from "@/db/repository";
import { fetchWikidataBirthdayCelebrities } from "./wikidata";

export type CelebritySource = "cache" | "live" | "static";

export interface ResolvedCelebrities {
  people: Celebrity[];
  source: CelebritySource;
  cachedAt?: Date;
}

export interface CachedCelebrities {
  payload: unknown;
  source: string;
  updatedAt: Date;
}

export interface CacheStore {
  get(key: string): Promise<CachedCelebrities | null>;
  set(key: string, payload: object, source: string): Promise<boolean>;
}

export interface LiveFetcher {
  (month: number, day: number): Promise<Celebrity[]>;
}

export interface ResolveDeps {
  store?: CacheStore;
  fetchLive?: LiveFetcher;
  now?: Date;
}

/** A cached payload is considered stale after 26h (cron prefetches tomorrow). */
export const CACHE_STALE_MS = 26 * 60 * 60 * 1000;

export function dateKey(month: number, day: number): string {
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Process-lifetime cache used when no database is configured. Lets the live
 * tier run (dynamic birthdays for every date) while reusing fresh results
 * across page loads. Expired entries are treated as stale by the resolver and
 * refreshed on the next visit; stale rows are pruned on write to bound memory.
 */
export function createMemoryCache(): CacheStore {
  const map = new Map<string, CachedCelebrities>();
  return {
    get: async (key) => map.get(key) ?? null,
    set: async (key, payload, source) => {
      map.set(key, { payload, source, updatedAt: new Date() });
      for (const [k, v] of map) {
        if (Date.now() - v.updatedAt.getTime() > CACHE_STALE_MS * 2) {
          map.delete(k);
        }
      }
      return true;
    },
  };
}

let memoryCache: CacheStore | null = null;

function defaultStore(): CacheStore | null {
  if (isDbConfigured()) {
    return {
      get: async (key) => {
        const row = await getCelebrityCache(key);
        if (!row) return null;
        return { payload: row.payload as unknown, source: row.source, updatedAt: row.updatedAt };
      },
      set: (key, payload, source) => upsertCelebrityCache(key, payload, source),
    };
  }
  // No database configured: back the live tier with a shared in-memory cache
  // so birthdays stay dynamic without hammering Wikidata per page view. Tests
  // opt out so they never touch the network.
  if (process.env.NODE_ENV === "test") return null;
  memoryCache ??= createMemoryCache();
  return memoryCache;
}

function asCelebrities(payload: unknown): Celebrity[] {
  const raw = payload as unknown;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is Celebrity =>
      typeof item === "object" && item !== null && "name" in item,
  );
}

export async function resolveCelebritiesForDate(
  month: number,
  day: number,
  deps: ResolveDeps = {},
): Promise<ResolvedCelebrities> {
  const now = deps.now ?? new Date();
  const store = deps.store ?? (defaultStore() ?? undefined);
  const key = dateKey(month, day);

  // Level 1 — pre-calculated cron cache.
  if (store) {
    try {
      const cached = await store.get(key);
      if (cached) {
        const age = now.getTime() - cached.updatedAt.getTime();
        if (age < CACHE_STALE_MS) {
          return {
            people: asCelebrities(cached.payload),
            source: "cache",
            cachedAt: cached.updatedAt,
          };
        }
      }
    } catch {
      // Fall through to the live tier; the DB may be unreachable.
    }
  }

  // Level 2 — live Wikidata fallback. Runs whenever no fresh cache exists
  // (DB-backed or in-memory), or a fetcher was explicitly injected, so the
  // section stays dynamic in every environment. A failed live attempt simply
  // falls through to the offline static tier.
  const live = deps.fetchLive ?? fetchWikidataBirthdayCelebrities;
  const allowLive = Boolean(store) || Boolean(deps.fetchLive);
  if (allowLive) {
    try {
      const people = await live(month, day);
      if (people.length > 0) {
        try {
          await store?.set(key, people as unknown as object, "wikidata");
        } catch {
          // Write-through is best-effort; the payload still serves the request.
        }
        // Top up a sparse live result with the curated same-date pool so the
        // grid never renders a single lonely card.
        const staticPeople = celebritiesForDate(month, day);
        const usedUrls = new Set(people.map((p) => p.url));
        const merged = [...people, ...staticPeople.filter((p) => !usedUrls.has(p.url))];
        return { people: merged.slice(0, 12), source: "live" };
      }
    } catch {
      // Fall through to the static tier.
    }
  }

  // Level 3 — offline static dataset.
  return { people: celebritiesForDate(month, day), source: "static" };
}