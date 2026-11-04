"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

/** One Supabase client for the whole app: rooms (Realtime) and accounts (Auth, tables). */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = !!(URL && KEY);

let client: SupabaseClient | null = null;
let loading: Promise<SupabaseClient | null> | null = null;

export function getSupabase(): Promise<SupabaseClient | null> {
  if (!supabaseConfigured || typeof window === "undefined") return Promise.resolve(null);
  if (client) return Promise.resolve(client);
  loading ??= import("@supabase/supabase-js").then(({ createClient }) => {
    client = createClient(URL!, KEY!, {
      auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      realtime: { params: { eventsPerSecond: 20 } },
    });
    return client;
  });
  return loading;
}
