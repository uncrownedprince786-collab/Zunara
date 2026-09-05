import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  STORAGE_KEY,
  loadNatalProfile,
  saveNatalProfile,
  clearNatalProfile,
  hasStorage,
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