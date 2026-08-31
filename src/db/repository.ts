import { getDb } from "./index";
import { horoscopes, generationJobs, systemHealth, planetarySnapshots } from "./schema";
import type { GeneratedHoroscope } from "../lib/horoscope/generate";
import type { PeriodType } from "../lib/calendar/periods";

/**
 * Persists generated horoscopes idempotently. Uses an upsert keyed on
 * the composite (sign_slug, period_type, period_key) so re-running a cron
 * safely overwrites rather than duplicates.
 */
export async function upsertHoroscopes(horoscopesData: GeneratedHoroscope[], snapshotId?: string) {
  const db = getDb();
  if (!db) return { persisted: false, reason: "database not configured" };
  for (const h of horoscopesData) {
    await db
      .insert(horoscopes)
      .values({
        sign_slug: h.sign.slug,
        period_type: h.content.periodType,
        period_key: h.content.periodKeyStr,
        seed: h.content.seed,
        overview: h.content.overview,
        sections: h.content.sections as unknown as object,
        advice: h.content.advice,
        disclaimer: h.content.disclaimer,
        snapshot_id: snapshotId ?? null,
      })
      .onConflictDoUpdate({
        target: [horoscopes.sign_slug, horoscopes.period_type, horoscopes.period_key],
        set: {
          overview: h.content.overview,
          sections: h.content.sections as unknown as object,
          advice: h.content.advice,
          seed: h.content.seed,
          snapshot_id: snapshotId ?? null,
          generated_at: new Date(),
        },
      });
  }
  return { persisted: true };
}

export async function recordJob(job: {
  id: string;
  periodType: PeriodType;
  periodKey: string;
  status: string;
  startedAt: Date;
  finishedAt?: Date;
  durationMs?: number;
  generatedCount?: number;
  validCount?: number;
  duplicatePairs?: number;
  error?: string;
}) {
  const db = getDb();
  if (!db) return;
  await db
    .insert(generationJobs)
    .values({
      id: job.id,
      period_type: job.periodType,
      period_key: job.periodKey,
      status: job.status,
      started_at: job.startedAt,
      finished_at: job.finishedAt ?? null,
      duration_ms: job.durationMs ?? null,
      generated_count: job.generatedCount ?? null,
      valid_count: job.validCount ?? null,
      duplicate_pairs: job.duplicatePairs ?? null,
      error: job.error ?? null,
    })
    .onConflictDoUpdate({
      target: generationJobs.id,
      set: {
        status: job.status,
        finished_at: job.finishedAt ?? null,
        duration_ms: job.durationMs ?? null,
        generated_count: job.generatedCount ?? null,
        valid_count: job.validCount ?? null,
        duplicate_pairs: job.duplicatePairs ?? null,
        error: job.error ?? null,
      },
    });
}

export async function recordHealth(kind: string, value: unknown) {
  const db = getDb();
  if (!db) return;
  await db.insert(systemHealth).values({ id: `${kind}-${Date.now()}`, kind, value: value as object });
}

export async function persistSnapshot(snapshot: {
  id: string;
  time: Date;
  julianDate: string;
  engineVersion: string;
  positions: object;
  aspects: object;
}) {
  const db = getDb();
  if (!db) return null;
  await db
    .insert(planetarySnapshots)
    .values({
      id: snapshot.id,
      time: snapshot.time,
      julian_date: snapshot.julianDate,
      engine_version: snapshot.engineVersion,
      positions: snapshot.positions,
      aspects: snapshot.aspects,
    })
    .onConflictDoUpdate({
      target: planetarySnapshots.id,
      set: { positions: snapshot.positions, aspects: snapshot.aspects },
    });
  return snapshot.id;
}

export async function getLatestHealth() {
  const db = getDb();
  if (!db) return null;
  const rows = await db.select().from(systemHealth).orderBy(systemHealth.recorded_at).limit(1);
  return rows[0] ?? null;
}

export async function getLatestJob() {
  const db = getDb();
  if (!db) return null;
  const rows = await db.select().from(generationJobs).orderBy(generationJobs.started_at).limit(1);
  return rows[0] ?? null;
}
