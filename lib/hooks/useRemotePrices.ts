"use client";
/**
 * Fetches merged prices from /data/prices.json (generated at build time).
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

let moduleCache: readonly SwissPrice[] | null = null;
let moduleFetchPromise: Promise<readonly SwissPrice[]> | null = null;

const getBasePath = (): string => {
  if (typeof window === "undefined") return "";
  // Next.js injects __NEXT_DATA__ with basePath when configured
  try {
    const nextData = (window as unknown as Record<string, unknown>).__NEXT_DATA__ as { basePath?: string } | undefined;
    return nextData?.basePath ?? "";
  } catch {
    return "";
  }
};

const fetchPrices = async (): Promise<readonly SwissPrice[]> => {
  if (moduleCache) return moduleCache;

  if (moduleFetchPromise) return moduleFetchPromise;

  moduleFetchPromise = (async () => {
    try {
      const basePath = getBasePath();
      const res = await fetch(`${basePath}/data/prices.json`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: unknown = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Expected array");
      }
      moduleCache = data as readonly SwissPrice[];
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
    if (didFetch.current || moduleCache) {
      if (moduleCache && state.loading) {
        setState({ prices: moduleCache, loading: false, error: null });
      }
      return;
    }
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
};

/** Reset module cache — for testing only */
export const _resetCache = () => {
  moduleCache = null;
  moduleFetchPromise = null;
};
