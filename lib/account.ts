"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase, supabaseConfigured } from "./supabase";
import type { Shared } from "./game/state";

/*
 * Accounts: Google sign-in through Supabase Auth, a profile (name), saved solo progress and case history.
 * Sign-in is required to play only when NEXT_PUBLIC_REQUIRE_SIGNIN is "true", so it can be switched on
 * once Google sign-in has been set up and checked.
 */

export const signInRequired = supabaseConfigured && process.env.NEXT_PUBLIC_REQUIRE_SIGNIN === "true";
export const accountsAvailable = supabaseConfigured;

export type Profile = { id: string; display_name: string; avatar_url: string | null };
export type AuthState = { ready: boolean; user: User | null; profile: Profile | null };

/* ---------- one shared auth state for every component ---------- */
let state: AuthState = { ready: !supabaseConfigured, user: null, profile: null };
const listeners = new Set<(s: AuthState) => void>();
let started = false;

function set(next: Partial<AuthState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l(state));
}

async function loadProfile(user: User | null) {
  if (!user) return set({ user: null, profile: null, ready: true });
  const sb = await getSupabase();
  const { data } = await sb!.from("profiles").select("id, display_name, avatar_url").eq("id", user.id).maybeSingle();
  // the database trigger makes the profile on first sign-in; fall back to the Google name if it is still missing
  const fallback: Profile = {
    id: user.id,
    display_name: String(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Detective").slice(0, 40),
    avatar_url: (user.user_metadata?.avatar_url as string) ?? null,
  };
  set({ user, profile: (data as Profile) ?? fallback, ready: true });
}

function start() {
  if (started || !supabaseConfigured || typeof window === "undefined") return;
  started = true;
  void getSupabase().then(async (sb) => {
    if (!sb) return set({ ready: true });
    const { data } = await sb.auth.getSession();
    await loadProfile(data.session?.user ?? null);
    sb.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      if (u?.id !== state.user?.id) void loadProfile(u);
    });
  });
}

export function useAuth(): AuthState {
  const [s, setS] = useState<AuthState>(state);
  useEffect(() => {
    start();
    setS(state);
    listeners.add(setS);
    return () => void listeners.delete(setS);
  }, []);
  return s;
}

/** Sends the player to Google, then back to `next` (the page they were on). */
export async function signInWithGoogle(next?: string) {
  const sb = await getSupabase();
  if (!sb) return;
  const back = next ?? window.location.pathname + window.location.search;
  await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(back)}` },
  });
}

export async function signOut() {
  const sb = await getSupabase();
  await sb?.auth.signOut();
  set({ user: null, profile: null });
}

export async function renameProfile(name: string) {
  const sb = await getSupabase();
  const clean = name.trim().slice(0, 40);
  if (!sb || !state.user || !clean) return false;
  const { error } = await sb.from("profiles").upsert({ id: state.user.id, display_name: clean, updated_at: new Date().toISOString() });
  if (error) return false;
  set({ profile: { ...(state.profile as Profile), id: state.user.id, display_name: clean } });
  return true;
}

/* ---------- saved solo progress ---------- */
export type SavedHints = { hintsUsed?: Record<number, number>; hintTexts?: Record<string, string> };
export type SavedProgress = { state: Shared; hints: SavedHints; version: number };

/** The account's saved copy, null if there is none. Throws if it could not be read. */
export async function loadProgress(caseId: string): Promise<SavedProgress | null> {
  const sb = await getSupabase();
  if (!sb || !state.user) return null;
  const { data, error } = await sb.from("solo_progress").select("state, hints, version").eq("user_id", state.user.id).eq("case_id", caseId).maybeSingle();
  if (error) throw error; // unknown, not "nothing saved": the caller must not overwrite the account's copy
  return (data as SavedProgress) ?? null;
}

const pending: Record<string, { state: Shared; hints: SavedHints; timer: number }> = {};
/** Saves a moment after the last change, so a burst of clicks is one write. */
export function saveProgress(caseId: string, s: Shared, hints: SavedHints) {
  if (!state.user) return;
  const p = pending[caseId];
  if (p) window.clearTimeout(p.timer);
  pending[caseId] = { state: s, hints, timer: window.setTimeout(() => void flush(caseId), 1200) };
}
async function flush(caseId: string) {
  const p = pending[caseId];
  delete pending[caseId];
  const sb = await getSupabase();
  if (!p || !sb || !state.user) return;
  await sb.from("solo_progress").upsert({
    user_id: state.user.id,
    case_id: caseId,
    state: p.state,
    hints: p.hints,
    version: p.state.v,
    updated_at: new Date().toISOString(),
  });
}
if (typeof window !== "undefined") {
  // save anything still waiting when the tab is hidden or closed
  window.addEventListener("pagehide", () => Object.keys(pending).forEach((id) => void flush(id)));
  document.addEventListener("visibilitychange", () => document.hidden && Object.keys(pending).forEach((id) => void flush(id)));
}

export async function deleteProgress(caseId: string) {
  const sb = await getSupabase();
  if (!sb || !state.user) return;
  if (pending[caseId]) window.clearTimeout(pending[caseId].timer);
  delete pending[caseId];
  await sb.from("solo_progress").delete().eq("user_id", state.user.id).eq("case_id", caseId);
}

/* ---------- case history ---------- */
export type HistoryRow = {
  id: string;
  case_id: string;
  mode: "solo" | "party";
  verdict: string | null;
  correct: number | null;
  minutes: number | null;
  hints: number | null;
  players: number | null;
  finished_at: string;
};

export async function recordFinish(row: Omit<HistoryRow, "id">) {
  const sb = await getSupabase();
  if (!sb || !state.user) return;
  await sb.from("case_history").upsert({ ...row, user_id: state.user.id }, { onConflict: "user_id,case_id,finished_at", ignoreDuplicates: true });
}

export async function listHistory(): Promise<HistoryRow[]> {
  const sb = await getSupabase();
  if (!sb || !state.user) return [];
  const { data } = await sb
    .from("case_history")
    .select("id, case_id, mode, verdict, correct, minutes, hints, players, finished_at")
    .eq("user_id", state.user.id)
    .order("finished_at", { ascending: false })
    .limit(100);
  return (data as HistoryRow[]) ?? [];
}
