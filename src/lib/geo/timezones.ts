/**
 * Civil (wall-clock) local time → UTC instant conversion.
 *
 * Two methods are supported:
 *  - IANA timezone (e.g. "Asia/Tokyo") via the Intl API, DST-aware.
 *  - Local Mean Time derived from longitude (an IANA-field-free fallback).
 *
 * Both paths are deterministic and never throw; clearly invalid civil dates
 * (e.g. month > 12) yield `null`.
 */

export interface CivilTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

/**
 * Local Mean Time offset from UTC, in seconds, for a given longitude.
 * Longitude is clamped to [-180, 180]. Positive longitudes (east of GMT)
 * are ahead of UTC, so east returns a positive offset.
 */
export function lmtOffsetSeconds(longitude: number): number {
  const lon = Math.max(-180, Math.min(180, longitude));
  return (lon / 15) * 3600;
}

/** True when the civil components form a real calendar date (day rolling handled). */
function isCivilValid(time: CivilTime): boolean {
  if (!Number.isInteger(time.month) || time.month < 1 || time.month > 12) return false;
  const probe = new Date(
    Date.UTC(time.year, time.month - 1, time.day, time.hour, time.minute, time.second, 0),
  );
  return (
    probe.getUTCFullYear() === time.year &&
    probe.getUTCMonth() === time.month - 1 &&
    probe.getUTCDate() === time.day
  );
}

function isValidTimeZone(tz: string): boolean {
  try {
    // Constructing a formatter with a bad timezone throws a RangeError.
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Wall-clock (as a UTC-based ms timestamp) rendered by `timeZone` at `utcMs`. */
function tzWallClockMs(timeZone: string, utcMs: number): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    hourCycle: "h23",
  });
  const parts = dtf.formatToParts(utcMs);
  const value = (type: string): number =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");
  const year = value("year");
  const month = value("month");
  const day = value("day");
  const hour = value("hour") % 24;
  const minute = value("minute");
  const second = value("second");
  return Date.UTC(year, month - 1, day, hour, minute, second, 0);
}

/**
 * DST-aware civil → UTC conversion for a valid IANA timezone.
 * Iterates (≤3) from a naive guess (civil treated as UTC), adjusting by the
 * zone offset delta until the reconstructed wall clock matches the input.
 * During a DST fold (ambiguous civil time) the earlier instant is preferred.
 */
function civilToUtcWithTz(time: CivilTime, timeZone: string): Date | null {
  if (!isCivilValid(time)) return null;
  const civilMs = Date.UTC(
    time.year,
    time.month - 1,
    time.day,
    time.hour,
    time.minute,
    time.second,
    0,
  );
  let utcMs = civilMs;
  for (let i = 0; i < 3; i++) {
    const wallMs = tzWallClockMs(timeZone, utcMs);
    const diff = wallMs - civilMs;
    if (diff === 0) break;
    utcMs -= diff;
  }
  return new Date(utcMs);
}

/**
 * Convert a civil (local wall-clock) time to a UTC `Date`, or `null` for a
 * clearly invalid date. Prefers a valid `opts.timeZone`; otherwise falls back
 * to Local Mean Time derived from `opts.longitude` (default 0 ⇒ UTC).
 * Never throws.
 */
export function civilToUtc(
  time: CivilTime,
  opts?: { timeZone?: string; longitude?: number },
): Date | null {
  const tz = opts?.timeZone;
  if (typeof tz === "string" && tz.trim() !== "" && isValidTimeZone(tz)) {
    return civilToUtcWithTz(time, tz);
  }
  const longitude = typeof opts?.longitude === "number" && !Number.isNaN(opts.longitude)
    ? opts.longitude
    : 0;
  if (!isCivilValid(time)) return null;
  const civilMs = Date.UTC(
    time.year,
    time.month - 1,
    time.day,
    time.hour,
    time.minute,
    time.second,
    0,
  );
  // Local Mean Time conversion: UTC = civil + lmtOffsetSeconds (the module's
  // convention — see timezones.test.ts LMT expectations).
  return new Date(civilMs + lmtOffsetSeconds(longitude) * 1000);
}
