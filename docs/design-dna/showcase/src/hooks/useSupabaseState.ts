/**
 * useSupabaseState — Subscribes to a Supabase table via Realtime.
 *
 * Returns data + isLive status. When Supabase is not configured,
 * returns the fallback immediately and isLive = false — the caller
 * (OpsContext) falls back to useApexState for local file polling.
 *
 * Uses Realtime Postgres Changes (not broadcast/presence) so we
 * get INSERT/UPDATE/DELETE events directly from the database.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import {
  getSupabaseClient,
  isSupabaseConfigured,
} from "../lib/supabase/client";
import type { Database } from "../lib/supabase/types";

type TableName = keyof Database["public"]["Tables"];

interface UseSupabaseStateResult<T> {
  data: T;
  isLive: boolean;
  lastUpdated: Date | null;
}

/**
 * Subscribe to a Supabase table and transform rows into the app's state shape.
 *
 * @param table    The Supabase table name (e.g. "sessions", "tasks", "agents")
 * @param fallback Default value when no data or Supabase is not configured
 * @param transform Maps an array of raw rows → the shape the OPS app expects
 * @param filter   Optional Realtime filter (e.g. "session_id=eq.xxx")
 */
export function useSupabaseState<T>(
  table: TableName,
  fallback: T,
  transform: (rows: Record<string, unknown>[]) => T,
  filter?: string,
): UseSupabaseStateResult<T> {
  const [data, setData] = useState<T>(fallback);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  // Stable transform ref to avoid re-subscribing on every render
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const fetchInitial = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) return;

    const { data: rows, error } = await client
      .from(table)
      .select("*")
      .order("created_at", { ascending: true });

    if (!mountedRef.current) return;

    if (error || !rows) {
      setIsLive(false);
      return;
    }

    setData(transformRef.current(rows as Record<string, unknown>[]));
    setIsLive(true);
    setLastUpdated(new Date());
  }, [table]);

  useEffect(() => {
    mountedRef.current = true;

    if (!isSupabaseConfigured) return;

    const client = getSupabaseClient();
    if (!client) return;

    // Initial fetch
    void fetchInitial();

    // Subscribe to Realtime changes
    const channel = client
      .channel(`ops-${table}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          ...(filter ? { filter } : {}),
        },
        () => {
          // On any change, re-fetch the full table.
          // This is simpler and more reliable than maintaining local state
          // from individual INSERT/UPDATE/DELETE events.
          void fetchInitial();
        },
      )
      .subscribe((status) => {
        if (!mountedRef.current) return;
        if (status === "SUBSCRIBED") {
          setIsLive(true);
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          setIsLive(false);
        }
      });

    return () => {
      mountedRef.current = false;
      void client.removeChannel(channel);
    };
  }, [table, filter, fetchInitial]);

  return { data, isLive, lastUpdated };
}
