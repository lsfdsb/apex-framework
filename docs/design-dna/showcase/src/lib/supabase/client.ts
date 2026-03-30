/**
 * Supabase client singleton for the APEX OPS HUB.
 *
 * Uses sb_publishable_ key (new Supabase API keys, post-Nov 2025).
 * Falls back gracefully when env vars are not set — the app works
 * entirely on local .apex/state/ files without Supabase.
 *
 * Env vars (set in .env or .env.local):
 *   VITE_SUPABASE_URL           — e.g. https://xxx.supabase.co
 *   VITE_SUPABASE_PUBLISHABLE_KEY — sb_publishable_xxx (browser-safe)
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/**
 * Whether Supabase is configured. When false, the OPS HUB
 * falls back to local file polling (useApexState).
 */
export const isSupabaseConfigured =
  typeof SUPABASE_URL === "string" &&
  SUPABASE_URL.length > 0 &&
  typeof SUPABASE_KEY === "string" &&
  SUPABASE_KEY.length > 0;

let _client: SupabaseClient<Database> | null = null;

/**
 * Returns the Supabase client singleton, or null if not configured.
 * Safe to call at any point — the client is only created once.
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) return null;
  if (!_client) {
    _client = createClient<Database>(SUPABASE_URL!, SUPABASE_KEY!, {
      realtime: {
        params: { eventsPerSecond: 10 },
      },
    });
  }
  return _client;
}
