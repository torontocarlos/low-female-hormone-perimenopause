"use client";

import { SessionState } from "./types";

// v0 persistence is localStorage only. The Supabase-backed session store
// (mpz_sessions / mpz_intake / mpz_instrument_results / ...) and the magic-link
// save-and-continue flow are PARKING-LOT items. The schema is already written
// in supabase/migrations so the swap is mechanical.

const KEY = "ahc_perimenopause_session_v1";
export const APP_VERSION = "0.1.0";
export const INTAKE_VERSION = 1;

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function newSession(): SessionState {
  const now = new Date().toISOString();
  return {
    sessionId: uuid(),
    appVersion: APP_VERSION,
    intakeVersion: INTAKE_VERSION,
    status: "in_progress",
    answers: {},
    instruments: {},
    stepIndex: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function loadSession(): SessionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionState;
  } catch {
    return null;
  }
}

export function saveSession(s: SessionState): void {
  if (typeof window === "undefined") return;
  const next = { ...s, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
