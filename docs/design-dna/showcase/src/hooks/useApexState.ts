import { useEffect, useRef, useState } from "react";

interface UseApexStateResult<T> {
  data: T;
  isLive: boolean;
  lastUpdated: Date | null;
}

/**
 * Polls `.apex/state/{filename}` every 2 seconds for live sync between
 * Claude Code and the HUB. Falls back to demo data when the file is absent
 * or the network request fails.
 */
export function useApexState<T>(
  filename: string,
  fallback: T
): UseApexStateResult<T> {
  const [data, setData] = useState<T>(fallback);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Keep a stable ref to the latest serialised value to skip no-op updates.
  const prevJsonRef = useRef<string | null>(null);
  // Guard against setState after unmount.
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    async function fetchState() {
      try {
        const res = await fetch(`/.apex/state/${filename}`, {
          // Prevent the browser from serving a stale 200 from disk cache.
          cache: "no-store",
        });

        if (!mountedRef.current) return;

        if (!res.ok) {
          // 404 or any non-2xx → fall back to demo data.
          if (isLive) {
            setIsLive(false);
            setData(fallback);
            setLastUpdated(null);
            prevJsonRef.current = null;
          }
          return;
        }

        const text = await res.text();
        if (!mountedRef.current) return;

        // Skip the re-render if the payload hasn't changed.
        if (text === prevJsonRef.current) return;

        let parsed: T;
        try {
          parsed = JSON.parse(text) as T;
        } catch {
          // Malformed JSON → treat as unavailable.
          setIsLive(false);
          setData(fallback);
          setLastUpdated(null);
          prevJsonRef.current = null;
          return;
        }

        prevJsonRef.current = text;
        setData(parsed);
        setIsLive(true);
        setLastUpdated(new Date());
      } catch {
        // Network error → fall back silently.
        if (!mountedRef.current) return;
        setIsLive(false);
        setData(fallback);
        setLastUpdated(null);
        prevJsonRef.current = null;
      }
    }

    // Fetch immediately, then on every interval tick.
    void fetchState();
    const intervalId = setInterval(() => void fetchState(), 2000);

    return () => {
      mountedRef.current = false;
      clearInterval(intervalId);
    };
    // `fallback` is intentionally excluded: callers typically pass object
    // literals and we don't want to restart the interval on every render.
    // `isLive` is similarly excluded to avoid a self-referential dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filename]);

  return { data, isLive, lastUpdated };
}
