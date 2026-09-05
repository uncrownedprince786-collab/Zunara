"use client";

import type { BirthInput } from "@/lib/natal/validate";

/**
 * Persistent local birth-chart profile sync.
 *
 * Stores the validated birth profile in `localStorage` so that a chart
 * generated on /birthchart can be reused automatically by /daily-transit (and
 * any future personal tool) without re-entering the details. All access is
 * guarded so reading/writing never throws in environments without storage
 * (SSR, privacy mode, older browsers).
 */

export const STORAGE_KEY = "zunara_natal_profile";

export type StoredProfile = BirthInput & { savedAt: string };

export function hasStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

/** Read the persisted birth profile, or null when absent/invalid. */
export function loadNatalProfile(): StoredProfile | null {
  if (!hasStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredProfile>;
    if (!isValidProfile(parsed)) return null;
    return parsed as StoredProfile;
  } catch {
    return null;
  }
}

/** Persist a birth profile, merging a saved-at timestamp. Best-effort. */
export function saveNatalProfile(input: BirthInput): StoredProfile | null {
  if (!hasStorage()) return null;
  const profile: StoredProfile = { ...input, savedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return profile;
  } catch {
    return null;
  }
}

/** Remove the persisted profile. */
export function clearNatalProfile(): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function isValidProfile(p: Partial<StoredProfile> | null | undefined): p is StoredProfile {
  return Boolean(
    p &&
      typeof p === "object" &&
      typeof p.year === "number" &&
      typeof p.month === "number" &&
      typeof p.day === "number" &&
      typeof p.hour12 === "number" &&
      typeof p.minute === "number" &&
      (p.ampm === "AM" || p.ampm === "PM") &&
      typeof p.timeKnown === "boolean" &&
      typeof p.latitude === "number" &&
      typeof p.longitude === "number" &&
      typeof p.placeName === "string",
  );
}
