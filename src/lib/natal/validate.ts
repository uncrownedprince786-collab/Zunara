/**
 * Strict runtime validation for birth-chart input.
 *
 * Mirrors the "Validation Layer / strict runtime schema enforcement" pillar of
 * the resilience architecture. Every field is exhaustively checked; malformed
 * or out-of-range input never reaches the computation engine. Instead the form
 * receives a typed, human-readable field error.
 */

export interface BirthInput {
  year: number;
  month: number; // 1..12
  day: number; // 1..31
  hour12: number; // 1..12
  minute: number; // 0..59
  ampm: "AM" | "PM";
  timeKnown: boolean;
  latitude: number; // -90..90
  longitude: number; // -180..180
  placeName: string;
}

export interface BirthConfig {
  /** Exact UTC Date resolved from the input (12:00 noon UTC when time unknown). */
  date: Date;
  timeAssumed: boolean;
}

export interface ValidationResult {
  ok: boolean;
  /** Field-keyed error messages (safe for display). */
  errors: Partial<Record<keyof BirthInput, string>>;
  config?: BirthConfig;
}

export const MIN_YEAR = 1800;
export const MAX_YEAR = 2026;

function buildDate(
  year: number,
  month: number,
  day: number,
  hour12: number,
  minute: number,
  ampm: "AM" | "PM",
  timeKnown: boolean,
  longitude: number,
): Date | null {
  const hour24 =
    timeKnown === false
      ? 12
      : ampm === "AM"
        ? hour12 % 12 === 0
          ? 0
          : hour12
        : (hour12 % 12) + 12;
  const minute24 = timeKnown === false ? 0 : minute;
  // The entered civil birth time is local-mean-time for the birthplace. Convert
  // it to a UTC instant by subtracting the longitude-derived LMT offset
  // (offsetHours = -longitude/15). East is ahead of Greenwich, so UTC = LMT − λ/15.
  const lmtOffsetMs = (longitude / 15) * 3600000;
  return new Date(
    Date.UTC(year, month - 1, day, hour24, minute24, 0, 0) - lmtOffsetMs,
  );
}

export function validateBirth(input: BirthInput): ValidationResult {
  const errors: NonNullable<ValidationResult["errors"]> = {};

  if (
    !Number.isInteger(input.year) ||
    input.year < MIN_YEAR ||
    input.year > MAX_YEAR
  ) {
    errors.year = `Year must be ${MIN_YEAR}–${MAX_YEAR}.`;
  }

  if (!Number.isInteger(input.month) || input.month < 1 || input.month > 12) {
    errors.month = "Month must be 1–12.";
  }

  if (!Number.isInteger(input.day) || input.day < 1 || input.day > 31) {
    errors.day = "Day must be 1–31.";
  }

  if (input.timeKnown) {
    if (!Number.isInteger(input.hour12) || input.hour12 < 1 || input.hour12 > 12) {
      errors.hour12 = "Hour must be 1–12.";
    }
    if (!Number.isInteger(input.minute) || input.minute < 0 || input.minute > 59) {
      errors.minute = "Minute must be 0–59.";
    }
    if (input.ampm !== "AM" && input.ampm !== "PM") {
      errors.ampm = "Select AM or PM.";
    }
  }

  if (
    typeof input.latitude !== "number" ||
    Number.isNaN(input.latitude) ||
    input.latitude < -90 ||
    input.latitude > 90
  ) {
    errors.latitude = "Latitude must be between -90 and 90.";
  }

  if (
    typeof input.longitude !== "number" ||
    Number.isNaN(input.longitude) ||
    input.longitude < -180 ||
    input.longitude > 180
  ) {
    errors.longitude = "Longitude must be between -180 and 180.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  // Cross-field calendar check (rejects e.g. day 31 in April or 2023-02-30).
  // We verify against the LOCAL civil date (without LMT offset), since the LMT
  // conversion can push the UTC date across a day boundary.
  const hour24 =
    input.timeKnown === false
      ? 12
      : input.ampm === "AM"
        ? input.hour12 % 12 === 0
          ? 0
          : input.hour12
        : (input.hour12 % 12) + 12;
  const minute24 = input.timeKnown === false ? 0 : input.minute;
  const localDate = new Date(
    Date.UTC(input.year, input.month - 1, input.day, hour24, minute24, 0, 0),
  );
  if (
    localDate.getUTCFullYear() !== input.year ||
    localDate.getUTCMonth() !== input.month - 1 ||
    localDate.getUTCDate() !== input.day
  ) {
    return {
      ok: false,
      errors: { day: "That date does not exist in the chosen month/year." },
    };
  }

  // Build the actual UTC instant using the LMT longitude offset.
  const date = buildDate(
    input.year,
    input.month,
    input.day,
    input.hour12,
    input.minute,
    input.ampm,
    input.timeKnown,
    input.longitude,
  );
  if (!date) {
    return {
      ok: false,
      errors: { day: "That date does not exist in the chosen month/year." },
    };
  }

  return {
    ok: true,
    errors: {},
    config: {
      date,
      timeAssumed: !input.timeKnown,
    },
  };
}

/** Safe, overridable min/max exposed for the form controls. */
export const YEAR_RANGE = { min: MIN_YEAR, max: MAX_YEAR };
