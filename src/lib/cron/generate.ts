import { randomUUID } from "crypto";
import { generateAllSigns, summarizeGeneration } from "@/lib/horoscope/generate";
import { computeSnapshot } from "@/lib/astronomy/astro";
import { recordJob, upsertHoroscopes, persistSnapshot } from "@/db/repository";
import type { PeriodType } from "@/lib/calendar/periods";
import { periodKey } from "@/lib/calendar/periods";

export interface CronRunResult {
  periodType: PeriodType;
  periodKey: string;
  generatedCount: number;
  validCount: number;
  duplicatePairs: number;
  jobId: string;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  persisted: boolean;
  ok: boolean;
  error?: string;
}

/**
 * Runs the full generation lifecycle for a period type: compute the shared
 * planetary snapshot once, generate all 12 signs, validate each, persist
 * idempotently, and record job telemetry. Deterministic and safe to re-run.
 */
export async function runGenerationForPeriod(periodType: PeriodType): Promise<CronRunResult> {
  const startedAt = new Date();
  const jobId = randomUUID();
  const now = new Date();
  const key = periodKey(periodType, now);

  try {
    const snapshot = computeSnapshot(now, true);

    const snapshotId = await persistSnapshot({
      id: `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`,
      time: now,
      julianDate: String(snapshot.julianDate),
      engineVersion: snapshot.engineVersion,
      positions: snapshot.positions as unknown as object,
      aspects: snapshot.aspects as unknown as object,
    });

    const horoscopes = generateAllSigns(periodType, now, snapshot);
    const summary = summarizeGeneration(horoscopes, periodType, now);
    const persistence = await upsertHoroscopes(horoscopes, snapshotId ?? undefined);

    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - startedAt.getTime();

    await recordJob({
      id: jobId,
      periodType,
      periodKey: key,
      status: "success",
      startedAt,
      finishedAt,
      durationMs,
      generatedCount: summary.generatedCount,
      validCount: summary.validCount,
      duplicatePairs: summary.duplicatePairs,
    });

    return {
      periodType,
      periodKey: key,
      generatedCount: summary.generatedCount,
      validCount: summary.validCount,
      duplicatePairs: summary.duplicatePairs,
      jobId,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs,
      persisted: persistence.persisted,
      ok: summary.validCount === summary.generatedCount,
    };
  } catch (err) {
    const finishedAt = new Date();
    const message = err instanceof Error ? err.message : String(err);
    await recordJob({
      id: jobId,
      periodType,
      periodKey: key,
      status: "error",
      startedAt,
      finishedAt,
      error: message.slice(0, 2000),
    });
    return {
      periodType,
      periodKey: key,
      generatedCount: 0,
      validCount: 0,
      duplicatePairs: 0,
      jobId,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      persisted: false,
      ok: false,
    };
  }
}

/** Determine which period types should run for a given UTC date. */
export function duePeriods(now: Date): PeriodType[] {
  const periods: PeriodType[] = ["daily"];
  const utcDay = now.getUTCDay(); // 0 = Sunday, 1 = Monday
  const date = now.getUTCDate();
  const month = now.getUTCMonth(); // 0-based

  if (utcDay === 1) periods.push("weekly");
  if (date === 1) periods.push("monthly");
  if (month === 0 && date === 1) periods.push("yearly");

  return periods;
}
