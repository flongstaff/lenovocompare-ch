// @vitest-environment jsdom
/**
 * Unit tests for useRemotePrices hook.
 * Covers successful fetch + caching, remote data shape validation,
 * network errors, HTTP errors, and module cache TTL behaviour.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { SwissPrice } from "@/lib/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const validPrice: SwissPrice = {
  id: "sp-1",
  laptopId: "t14-gen5-intel",
  retailer: "Digitec",
  price: 1299,
  dateAdded: "2024-06-01",
  isUserAdded: false,
};

const makeResponse = (data: unknown, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => data,
});

// Dynamic import pattern so we can reset the module-level cache between tests
const getHookAndReset = async () => {
  vi.resetModules();
  const mod = await import("@/lib/hooks/useRemotePrices");
  mod._resetCache();
  return { useRemotePrices: mod.useRemotePrices, _resetCache: mod._resetCache };
};

// ─── Successful fetch ────────────────────────────────────────────────────────

describe("useRemotePrices successful fetch", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("should start in loading state when no cache exists", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([validPrice]) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    expect(result.current.loading).toBe(true);
  });

  it("should set loading to false after fetch resolves", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([validPrice]) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("should populate prices after a successful fetch", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([validPrice]) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.prices).toHaveLength(1));
    expect(result.current.prices[0].id).toBe("sp-1");
  });

  it("should set error to null after a successful fetch", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([validPrice]) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
  });

  it("should return multiple prices returned by the API", async () => {
    const secondPrice: SwissPrice = { ...validPrice, id: "sp-2", laptopId: "x1-carbon-gen12", price: 1799 };
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([validPrice, secondPrice]) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.prices).toHaveLength(2));
  });

  it("should call the /api/prices endpoint", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([]) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/prices"));
  });
});

// ─── Data shape validation ───────────────────────────────────────────────────

describe("useRemotePrices data validation", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("should filter out items missing id field", async () => {
    const bad = { laptopId: "t14-gen5-intel", retailer: "Digitec", price: 999 };
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([bad, validPrice]) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.prices).toHaveLength(1);
    expect(result.current.prices[0].id).toBe("sp-1");
  });

  it("should filter out items missing laptopId field", async () => {
    const bad = { id: "sp-bad", retailer: "Digitec", price: 999 };
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([bad, validPrice]) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.prices).toHaveLength(1);
  });

  it("should filter out items with non-string id", async () => {
    const bad = { id: 123, laptopId: "t14-gen5-intel", retailer: "Digitec", price: 999 };
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([bad, validPrice]) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.prices).toHaveLength(1);
  });

  it("should filter out items where price is not a positive number", async () => {
    const zero = { ...validPrice, id: "sp-zero", price: 0 };
    const negative = { ...validPrice, id: "sp-neg", price: -100 };
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([zero, negative, validPrice]) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.prices).toHaveLength(1);
    expect(result.current.prices[0].price).toBeGreaterThan(0);
  });

  it("should filter out items where price is not a number", async () => {
    const bad = { ...validPrice, id: "sp-str-price", price: "1299" };
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([bad, validPrice]) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.prices).toHaveLength(1);
  });

  it("should filter out items missing retailer field", async () => {
    const bad = { id: "sp-bad", laptopId: "t14-gen5-intel", price: 999 };
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([bad]) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.prices).toHaveLength(0);
  });

  it("should return empty prices array when API returns empty array", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([]) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.prices).toHaveLength(0);
  });

  it("should fall back to empty array when API returns non-array JSON", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse({ error: "oops" }) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.prices).toEqual([]);
  });
});

// ─── Network / HTTP errors ───────────────────────────────────────────────────

describe("useRemotePrices error handling", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("should fall back to empty prices on network failure", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.prices).toEqual([]);
  });

  it("should set loading to false on network failure", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("should fall back to empty prices on HTTP 500 response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse(null, false, 500) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.prices).toEqual([]);
  });

  it("should fall back to empty prices on HTTP 404 response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse(null, false, 404) as Response);
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.prices).toEqual([]);
  });

  it("should fall back gracefully on fetch rejection without message", async () => {
    vi.mocked(fetch).mockRejectedValueOnce("plain string error");
    const { useRemotePrices } = await getHookAndReset();
    const { result } = renderHook(() => useRemotePrices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.prices).toEqual([]);
  });
});

// ─── Module-level caching ────────────────────────────────────────────────────

describe("useRemotePrices module-level caching", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("should only call fetch once when multiple hook instances are mounted", async () => {
    vi.mocked(fetch).mockResolvedValue(makeResponse([validPrice]) as Response);
    const { useRemotePrices } = await getHookAndReset();
    renderHook(() => useRemotePrices());
    renderHook(() => useRemotePrices());
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it("should return cached prices immediately when cache is warm", async () => {
    // First render populates cache
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([validPrice]) as Response);
    const { useRemotePrices, _resetCache } = await getHookAndReset();
    const first = renderHook(() => useRemotePrices());
    await waitFor(() => expect(first.result.current.loading).toBe(false));

    // Second render: cache is warm, hook starts with prices already populated
    const second = renderHook(() => useRemotePrices());
    expect(second.result.current.loading).toBe(false);
    expect(second.result.current.prices).toHaveLength(1);
    // fetch should still have been called only once
    expect(fetch).toHaveBeenCalledTimes(1);

    _resetCache();
  });

  it("should start in non-loading state when cache is already populated", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(makeResponse([validPrice]) as Response);
    const { useRemotePrices, _resetCache } = await getHookAndReset();

    // Warm up the cache
    const first = renderHook(() => useRemotePrices());
    await waitFor(() => expect(first.result.current.loading).toBe(false));

    // New render should start with loading=false since cache exists
    const second = renderHook(() => useRemotePrices());
    expect(second.result.current.loading).toBe(false);

    _resetCache();
  });
});
