"use client";
/**
 * Fetches prices from the Cloudflare Workers API (D1-backed).
 * Falls back to empty array on fetch failure — seed prices are always available
 * via the static import in usePrices, so no data is lost.
 *
 * Uses a module-level cache to avoid double-fetching across component remounts.
 */
import { useState, useEffect, useRef } from "react";
import type { SwissPrice } from "@/lib/types";

interface RemotePricesState {
  readonly prices: readonly SwissPrice[];
  readonly loading: boolean;
  readonly error: string | null;
}

const WORKERS_API_URL =
  process.env.NEXT_PUBLIC_WORKERS_URL ?? "https://lenovocompare-prices.franco-longstaff.workers.dev";

let moduleCache: readonly SwissPrice[] | null = null;
let moduleCacheTimestamp = 0;
let moduleFetchPromise: Promise<readonly SwissPrice[]> | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15-minute cache TTL

const fetchPrices = async (): Promise<readonly SwissPrice[]> => {
  if (moduleCache && Date.now() - moduleCacheTimestamp < CACHE_TTL_MS) return moduleCache;

  if (moduleFetchPromise) return moduleFetchPromise;

  moduleFetchPromise = (async () => {
    try {
      const res = await fetch(`${WORKERS_API_URL}/api/prices`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: unknown = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Expected array");
      }
      moduleCache = data as readonly SwissPrice[];
      moduleCacheTimestamp = Date.now();
      return moduleCache;
    } catch (err) {
      console.warn("[useRemotePrices] Fetch failed, falling back to seed prices:", err);
      return [];
    } finally {
      moduleFetchPromise = null;
    }
  })();

  return moduleFetchPromise;
};

export const useRemotePrices = (): RemotePricesState => {
  const [state, setState] = useState<RemotePricesState>(() => ({
    prices: moduleCache ?? [],
    loading: moduleCache === null,
    error: null,
  }));
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current || moduleCache) return;
    didFetch.current = true;

    fetchPrices().then(
      (prices) => setState({ prices, loading: false, error: null }),
      (err) =>
        setState({
          prices: [],
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }),
    );
  }, []);

  return state;
};

/** Reset module cache — for testing only */
export const _resetCache = () => {
  moduleCache = null;
  moduleCacheTimestamp = 0;
  moduleFetchPromise = null;
};
