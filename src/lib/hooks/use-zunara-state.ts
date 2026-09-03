"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Horizon = "today" | "weekly" | "monthly" | "yearly";

export const HORIZONS: Horizon[] = ["today", "weekly", "monthly", "yearly"];

/**
 * Stateless (in-memory) personalization store.
 *
 * Holds the reader's chosen sign / horizon for the *current page session only*.
 * Nothing is written to localStorage, cookies, or any persistent storage, so
 * every returning or new visitor lands on `/` with a clean slate and must pick
 * any sign manually. The store resets on every fresh page load.
 */

type Listener = () => void;

let signValue = "";
let horizonValue: Horizon = "today";

const signListeners = new Set<Listener>();
const horizonListeners = new Set<Listener>();

function emitSign() {
  for (const l of signListeners) l();
}
function emitHorizon() {
  for (const l of horizonListeners) l();
}

function subscribeSign(onChange: () => void) {
  signListeners.add(onChange);
  return () => signListeners.delete(onChange);
}
function subscribeHorizon(onChange: () => void) {
  horizonListeners.add(onChange);
  return () => horizonListeners.delete(onChange);
}

function getSign(): string {
  return signValue;
}
function getHorizon(): Horizon {
  return horizonValue;
}

/**
 * Lightweight in-memory personalization via useSyncExternalStore (no
 * localStorage / cookies). Selection lasts only for the current page session.
 */
export function useZunaraState() {
  const userZodiacSign = useSyncExternalStore(subscribeSign, getSign, () => "");
  const activeHorizon = useSyncExternalStore(subscribeHorizon, getHorizon, () => "today" as Horizon);

  const setUserZodiacSign = useCallback((sign: string) => {
    signValue = sign;
    emitSign();
  }, []);

  const setActiveHorizon = useCallback((horizon: Horizon) => {
    horizonValue = horizon;
    emitHorizon();
  }, []);

  return {
    userZodiacSign: userZodiacSign || null,
    setUserZodiacSign,
    activeHorizon,
    setActiveHorizon,
    ready: typeof window !== "undefined",
  };
}
