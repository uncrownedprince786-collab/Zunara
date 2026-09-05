import { NextResponse } from "next/server";
import { dateKey } from "@/lib/celebrities/resolver";
import { fetchWikidataBirthdayCelebrities } from "@/lib/celebrities/wikidata";
import { celebritiesForDate } from "@/lib/content/celebrities";
import {
  getCelebrityCache,
  upsertCelebrityCache,
  ensureCelebrityCacheTable,
} from "@/db/repository";
import { recordHealth } from "@/db/repository";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** A freshly stored entry younger than this is left untouched by the cron. */
const FRESH_MS = 18 * 60 * 60 * 1000;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function nextUtcDate(now: Date): Date {
  const copy = new Date(now);
  copy.setUTCDate(now.getUTCDate() + 1);
  return copy;
}

/**
 * Pre-calculated celebrity cache cron. Runs daily before midnight UTC and
 * prefetches the upcoming day's top globally ranked birthday profiles from
 * Wikidata, storing them keyed by `MM-DD` so the home page can serve them with
 * zero latency on the date change. Today and tomorrow are both ensured, and a
 * fresh (non-stale) entry for a date is never rewritten.
 */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Cron not configured" }, { status: 503 });
  }
  const auth = request.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${secret}`) {
    return unauthorized();
  }

  const now = new Date();
  const tomorrow = nextUtcDate(now);

  await ensureCelebrityCacheTable();

  const results = [];
  let failed = false;

  for (const target of [now, tomorrow]) {
    const month = target.getUTCMonth() + 1;
    const day = target.getUTCDate();
    const key = dateKey(month, day);
    const entry: {
      dateKey: string;
      status: string;
      source: string;
      count: number;
      cachedAt: string | null;
      error?: string;
    } = {
      dateKey: key,
      status: "skipped",
      source: "",
      count: 0,
      cachedAt: null,
    };

    try {
      const cached = await getCelebrityCache(key);
      const fresh = cached && now.getTime() - cached.updatedAt.getTime() < FRESH_MS;
      if (fresh && cached) {
        const payload = cached.payload as unknown[];
        entry.status = "fresh";
        entry.source = cached.source;
        entry.count = Array.isArray(payload) ? payload.length : 0;
        entry.cachedAt = cached.updatedAt.toISOString();
        results.push(entry);
        continue;
      }

      let payload: unknown[];
      let source: string;
      try {
        payload = await fetchWikidataBirthdayCelebrities(month, day);
        source = payload.length > 0 ? "wikidata" : "static-fallback";
      } catch (err) {
        payload = [];
        source = "error";
        entry.error = err instanceof Error ? err.message : String(err);
      }
      if (payload.length === 0) {
        // Never leave a date empty: write the static curated set through to the
        // cache so request-path zero-latency holds even without live data.
        payload = celebritiesForDate(month, day) as unknown as unknown[];
        source = "static-fallback";
      }

      await upsertCelebrityCache(key, payload, source);
      entry.status = "updated";
      entry.source = source;
      entry.count = payload.length;
      entry.cachedAt = now.toISOString();
    } catch (err) {
      failed = true;
      entry.status = "error";
      entry.error = err instanceof Error ? err.message : String(err);
    }
    results.push(entry);
  }

  await recordHealth("celebrities-cron", {
    ranAt: now.toISOString(),
    results,
  }).catch(() => undefined);

  return NextResponse.json(
    {
      ok: !failed,
      ranAt: now.toISOString(),
      utcDate: now.toISOString().slice(0, 10),
      results,
    },
    { status: failed ? 500 : 200 },
  );
}