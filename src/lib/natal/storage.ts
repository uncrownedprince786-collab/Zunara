"use client";

import type { BirthInput } from "@/lib/natal/validate";

/**
 * Persistent local birth-chart profile sync.
 *
 * Stores validated birth profiles in `localStorage` (single primary "me"
 * profile under `STORAGE_KEY` for backward compatibility, plus a named
 * multi-profile list under `PROFILES_KEY`) so /birthchart, /daily-transit and
 * any future personal tool can reuse charts without re-entering details.
 * All access is guarded so reading/writing never throws in environments
 * without storage (SSR, privacy mode, older browsers).
 */

export const STORAGE_KEY = "zunara_natal_profile";
export const PROFILES_KEY = "zunara_profiles";

export const DEFAULT_PROFILE_ID = "me";

export type StoredProfile = BirthInput & { savedAt: string; id?: string; name?: string };

export function hasStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

function dedupe(list: StoredProfile[]): StoredProfile[] {
  return list.filter((p, i, a) => a.findIndex((x) => x.id === p.id) === i);
}

/**
 * Read the persisted birth profile list (one entry minimum — the primary
 * "me" profile is migrated from the legacy single key when present).
 */
export function listProfiles(): StoredProfile[] {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(PROFILES_KEY);
    if (!raw) {
      const legacy = window.localStorage.getItem(STORAGE_KEY);
      if (!legacy) return [];
      const parsed = JSON.parse(legacy) as Partial<StoredProfile>;
      return parsed && isValidProfile(parsed) ? [{ ...parsed, id: DEFAULT_PROFILE_ID }] : [];
    }
    const parsed = JSON.parse(raw) as Partial<StoredProfile>[];
    const mapped = (Array.isArray(parsed) ? parsed : [])
      .filter(isValidProfile)
      .map((p) => ({ ...p, id: p.id ?? DEFAULT_PROFILE_ID }));
    const withMe = mapped.some((p) => p.id === DEFAULT_PROFILE_ID || (typeof p.id === "undefined" && p.name === undefined))
      ? mapped
      : [...mapped];
    return dedupe(withMe);
  } catch {
    return [];
  }
}

function readProfile(id: string): StoredProfile | null {
  return listProfiles().find((p) => p.id === id) ?? null;
}

function upsertProfile(profile: StoredProfile): void {
  if (!hasStorage()) return;
  const next = listProfiles().filter((p) => p.id !== profile.id);
  next.push(profile);
  window.localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
}

function removeProfile(id: string): void {
  if (!hasStorage()) return;
  try {
    const next = listProfiles().filter((p) => p.id !== id);
    if (next.length === 0) {
      window.localStorage.removeItem(PROFILES_KEY);
    } else {
      window.localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
    }
  } catch {
    // ignore
  }
}

/** Load the primary "me" profile (legacy single-key behavior preserved). */
export function loadNatalProfile(): StoredProfile | null {
  if (!hasStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fromList = readProfile(DEFAULT_PROFILE_ID);
      return fromList;
    }
    const parsed = JSON.parse(raw) as Partial<StoredProfile>;
    if (!isValidProfile(parsed)) return null;
    return { ...parsed, id: parsed.id ?? DEFAULT_PROFILE_ID };
  } catch {
    return null;
  }
}

/**
 * Persist a birth profile as the primary "me" profile, keeping the legacy
 * single key in sync and the multi-profile list up to date. Best-effort.
 */
export function saveNatalProfile(input: BirthInput): StoredProfile | null {
  return saveProfile(input, DEFAULT_PROFILE_ID);
}

/** Persist (or update) a named/`id`-ed profile. Defaults to primary "me". */
export function saveProfile(input: BirthInput, id?: string, name?: string): StoredProfile | null {
  if (!hasStorage()) return null;
  const existing = id ? readProfile(id) : null;
  const profile: StoredProfile = {
    ...input,
    savedAt: new Date().toISOString(),
    id: id ?? DEFAULT_PROFILE_ID,
    name: name ?? existing?.name ?? input.placeName,
  };
  try {
    upsertProfile(profile);
    if (profile.id === DEFAULT_PROFILE_ID) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
    return profile;
  } catch {
    return null;
  }
}

/** Remove a profile. Removing the primary also clears the legacy key. */
export function deleteProfile(id: string): void {
  removeProfile(id);
  if (id === DEFAULT_PROFILE_ID) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}

/** Remove every stored profile. */
export function clearAllProfiles(): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(PROFILES_KEY);
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Remove the persisted primary profile. */
export function clearNatalProfile(): void {
  deleteProfile(DEFAULT_PROFILE_ID);
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