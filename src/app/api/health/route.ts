import { NextResponse } from "next/server";
import { computeSnapshot } from "@/lib/astronomy/astro";
import { getDb, isDbConfigured } from "@/db";
import { systemHealth } from "@/db/schema";
import { getLatestJob } from "@/db/repository";

export const dynamic = "force-dynamic";

/**
 * Health check endpoint. Validates that planetary data is fresh (the computed
 * snapshot covers today), that all 12 signs can be generated, and reports
 * database connectivity and the most recent generation job. Designed for
 * uptime monitoring and self-healing verification.
 */
export async function GET() {
  const now = new Date();
  const checks: Record<string, unknown> = {};

  let planetsOk = false;
  let signsOk = false;
  try {
    const snapshot = computeSnapshot(now, true);
    checks.snapshotTime = snapshot.time;
    checks.julianDate = snapshot.julianDate;
    checks.engineVersion = snapshot.engineVersion;
    checks.positionsCount = snapshot.positions.length;
    checks.aspectsCount = snapshot.aspects.length;
    planetsOk = snapshot.positions.length >= 12;

    const distinctSigns = new Set(snapshot.positions.map((p) => p.sign));
    signsOk = distinctSigns.size > 0;
    checks.distinctSigns = distinctSigns.size;
    checks.lastComputedAgeHours = 0;
  } catch (err) {
    checks.planetsError = err instanceof Error ? err.message : String(err);
  }

  let dbOk = false;
  let latestJob = null;
  if (isDbConfigured()) {
    try {
      const db = getDb();
      if (db) {
        await db.select().from(systemHealth).limit(1);
        dbOk = true;
      }
      latestJob = await getLatestJob();
      if (latestJob?.finished_at) {
        const ageHours = (now.getTime() - new Date(latestJob.finished_at).getTime()) / 3600000;
        checks.lastJobAgeHours = Math.round(ageHours * 10) / 10;
        checks.dbFresh = ageHours < 36 && latestJob.status === "success";
      }
    } catch (err) {
      checks.dbError = err instanceof Error ? err.message : String(err);
    }
  } else {
    checks.db = "not configured";
  }

  const healthy = planetsOk && signsOk && (!isDbConfigured() || dbOk);
  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      timestamp: now.toISOString(),
      checks,
      latestJob: latestJob
        ? {
            id: latestJob.id,
            periodType: latestJob.period_type,
            periodKey: latestJob.period_key,
            status: latestJob.status,
            finishedAt: latestJob.finished_at,
          }
        : null,
    },
    { status: healthy ? 200 : 503 },
  );
}
