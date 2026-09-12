import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  STORAGE_KEY,
  loadNatalProfile,
  saveNatalProfile,
  clearNatalProfile,
  clearAllProfiles,
  hasStorage,
  listProfiles,
  saveProfile,
  deleteProfile,
  DEFAULT_PROFILE_ID,
} from "./storage";
import type { BirthInput } from "@/lib/natal/validate";

function installStorage() {
  const store = new Map<string, string>();
  // minimal localStorage-compatible stub
  const stub = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
  };
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: stub,
  } as unknown as Window & typeof globalThis;
}

function uninstallStorage() {
  delete (globalThis as unknown as { window?: unknown }).window;
}

const VALID: BirthInput = {
  year: 1995,
  month: 6,
  day: 21,
  hour12: 12,
  minute: 0,
  ampm: "AM",
  timeKnown: true,
  latitude: 40.7128,
  longitude: -74.006,
  placeName: "New York",
};

describe("natal profile storage", () => {
  beforeEach(installStorage);
  afterEach(uninstallStorage);

  it("detects storage availability", () => {
    expect(hasStorage()).toBe(true);
  });

  it("saves and reloads a full profile", () => {
    const saved = saveNatalProfile(VALID);
    expect(saved).not.toBeNull();
    expect(saved!.placeName).toBe("New York");
    const loaded = loadNatalProfile();
    expect(loaded).not.toBeNull();
    expect(loaded!.year).toBe(1995);
    expect(loaded!.latitude).toBeCloseTo(40.7128, 4);
  });

  it("clears the stored profile", () => {
    saveNatalProfile(VALID);
    clearNatalProfile();
    expect(loadNatalProfile()).toBeNull();
  });

  it("returns null for corrupted JSON", () => {
    (globalThis as unknown as { window: { localStorage: { setItem: (k: string, v: string) => void } } })
      .window.localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadNatalProfile()).toBeNull();
  });

  it("returns null when storage is unavailable", () => {
    uninstallStorage();
    expect(loadNatalProfile()).toBeNull();
    expect(saveNatalProfile(VALID)).toBeNull();
  });
});

describe("multi-profile storage", () => {
  beforeEach(installStorage);
  afterEach(uninstallStorage);

  it("keeps secondary profiles alongside the primary without corrupting it", () => {
    saveNatalProfile(VALID);
    saveProfile({ ...VALID, placeName: "Berlin", latitude: 52.52, longitude: 13.405 }, "partner", "Sarah");
    saveProfile({ ...VALID, placeName: "Lahore", latitude: 31.55, longitude: 74.34 }, "friend", "Ali");

    const profiles = listProfiles();
    expect(profiles.length).toBeGreaterThanOrEqual(3);
    const byName = new Map(profiles.map((p) => [p.name ?? p.placeName, p] as const));
    expect(byName.get("Sarah")?.id).toBe("partner");
    expect(byName.get("Ali")?.id).toBe("friend");
    expect(loadNatalProfile()?.placeName).toBe("New York");

    deleteProfile("partner");
    const after = listProfiles();
    expect(after.some((p) => p.id === "partner")).toBe(false);
    expect(after.some((p) => p.id === DEFAULT_PROFILE_ID)).toBe(true);
  });

  it("updates an existing profile in place when re-saved", () => {
    saveProfile(VALID, "partner", "Sarah");
    saveProfile({ ...VALID, placeName: "Rome", latitude: 41.9, longitude: 12.49 }, "partner", "Sarah");
    const profiles = listProfiles().filter((p) => p.id === "partner");
    expect(profiles).toHaveLength(1);
    expect(profiles[0].latitude).toBeCloseTo(41.9, 4);
  });

  it("returns the defaults id when saving without one", () => {
    expect(saveProfile(VALID)?.id).toBe(DEFAULT_PROFILE_ID);
  });

  it("clears every profile via clearAllProfiles", () => {
    saveNatalProfile(VALID);
    saveProfile({ ...VALID, placeName: "Berlin" }, "partner", "Sarah");
    clearAllProfiles();
    expect(listProfiles()).toHaveLength(0);
    expect(loadNatalProfile()).toBeNull();
  });
});