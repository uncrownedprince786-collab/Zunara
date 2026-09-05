/**
 * 3-tier "Famous Birthdays Today" resolver.
 *
 * Level 1 (cache)    — read the pre-calculated daily-cron payload from the DB.
 * Level 2 (live)     — when the cache is empty or stale, fetch Wikidata live.
 * Level 3 (static)   — if that fails, serve the local curated pool.
 *
 * The live fetch only runs when a database is configured, so static builds and
 * local environments never accidentally hammer the Wikidata endpoint. All
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

function defaultStore(): CacheStore | null {
  if (!isDbConfigured()) return null;
  return {
    get: async (key) => {
      const row = await getCelebrityCache(key);
      if (!row) return null;
      return { payload: row.payload as unknown, source: row.source, updatedAt: row.updatedAt };
    },
    set: (key, payload, source) => upsertCelebrityCache(key, payload, source),
  };
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

  // Level 2 — live Wikidata fallback (only with a store or an injected fetcher).
  const live = deps.fetchLive ?? fetchWikidataBirthdayCelebrities;
  try {
    const people = await live(month, day);
    if (people.length > 0) {
      try {
        await store?.set(key, people as unknown as object, "wikidata");
      } catch {
        // Write-through is best-effort; the payload still serves the request.
      }
      return { people, source: "live" };
    }
  } catch {
    // Fall through to the static tier.
  }

  // Level 3 — offline static dataset.
  return { people: celebritiesForDate(month, day), source: "static" };
}