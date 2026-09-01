"use client";

import { useCallback, useSyncExternalStore } from "react";

const SIGN_KEY = "zunara-zodiac-sign";
const HORIZON_KEY = "zunara-active-horizon";

export type Horizon = "today" | "weekly" | "monthly" | "yearly";

export const HORIZONS: Horizon[] = ["today", "weekly", "monthly", "yearly"];

function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function subscribe(key: string, onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === key) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

function getSign(): string {
  return readStorage(SIGN_KEY) ?? "";
}

function getHorizon(): Horizon {
  const v = readStorage(HORIZON_KEY);
  return v && HORIZONS.includes(v as Horizon) ? (v as Horizon) : "today";
}

/**
 * Simple localStorage-backed personalization via the canonical
 * useSyncExternalStore API (no setState-in-effect lint hazards).
 * - userZodiacSign: reader's chosen sign (drives the home banner / quick nav).
 * - setUserZodiacSign / setActiveHorizon: persist a value on write.
 * - ready: true once the browser store is hydrated.
 */
export function useZunaraState() {
  const userZodiacSign = useSyncExternalStore(
    (cb) => subscribe(SIGN_KEY, cb),
    getSign,
    () => "",
  );

  const activeHorizon = useSyncExternalStore(
    (cb) => subscribe(HORIZON_KEY, cb),
    getHorizon,
    () => "today" as Horizon,
  );

  const setUserZodiacSign = useCallback((sign: string) => {
    try {
      window.localStorage.setItem(SIGN_KEY, sign);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const setActiveHorizon = useCallback((horizon: Horizon) => {
    try {
      window.localStorage.setItem(HORIZON_KEY, horizon);
    } catch {
      /* storage unavailable */
    }
  }, []);

  return {
    userZodiacSign: userZodiacSign || null,
    setUserZodiacSign,
    activeHorizon,
    setActiveHorizon,
    ready: typeof window !== "undefined",
  };
}
