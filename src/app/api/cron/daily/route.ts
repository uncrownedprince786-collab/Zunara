import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZODIAC_SIGNS } from "@/lib/zodiac/zodiac";
import { duePeriods, runGenerationForPeriod } from "@/lib/cron/generate";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * Secure daily cron endpoint. Protected by a bearer token derived from
 * CRON_SECRET. Detects daily/weekly/monthly/yearly rollovers by UTC date and
 * runs the generation lifecycle for whichever periods are due. Safe to run
 * repeatedly: persistence is idempotent and every re-run validates content.
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
  const periods = duePeriods(now);

  const results = [];
  for (const period of periods) {
    try {
      const result = await runGenerationForPeriod(period);
      // Revalidate the affected public paths so edge cache reflects new content.
      for (const sign of ZODIAC_SIGNS) {
        revalidatePath(`/horoscope/${sign.slug}`);
        const periodPath = period === "daily" ? "today" : period;
        revalidatePath(`/horoscope/${sign.slug}/${periodPath}`);
      }
      results.push(result);
    } catch (err) {
      results.push({
        periodType: period,
        periodKey: "",
        generatedCount: 0,
        validCount: 0,
        duplicatePairs: 0,
        jobId: "error",
        startedAt: now.toISOString(),
        finishedAt: new Date().toISOString(),
        durationMs: 0,
        persisted: false,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const allOk = results.length > 0 && results.every((r) => r.ok);
  return NextResponse.json(
    {
      ok: allOk,
      ranAt: now.toISOString(),
      utcDate: now.toISOString().slice(0, 10),
      periods: results,
    },
    { status: allOk ? 200 : 500 },
  );
}
