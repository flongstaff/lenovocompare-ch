// @vitest-environment jsdom
/**
 * Hook tests for useCompare and useLocalStorage.
 *
 * Note: React 18 + RTL can reuse roots between tests in the same file,
 * causing state to leak. We test useCompare as a single comprehensive
 * lifecycle test to avoid this issue.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCompare } from "@/lib/hooks/useCompare";

/* ── useCompare ──────────────────────────────────────────── */

describe("useCompare", () => {
  it("manages selection lifecycle: add, toggle off, limit, remove, clear, isSelected", async () => {
    const { result } = renderHook(() => useCompare());

    // Starts empty
    expect(result.current.selectedIds).toEqual([]);

    // Add models
    await act(async () => result.current.toggleCompare("t14-gen5-intel"));
    expect(result.current.selectedIds).toEqual(["t14-gen5-intel"]);

    await act(async () => result.current.toggleCompare("x1-carbon-gen12"));
    expect(result.current.selectedIds).toEqual(["t14-gen5-intel", "x1-carbon-gen12"]);

    // Toggle off (remove via re-toggle)
    await act(async () => result.current.toggleCompare("t14-gen5-intel"));
    expect(result.current.selectedIds).toEqual(["x1-carbon-gen12"]);

    // isSelected
    expect(result.current.isSelected("x1-carbon-gen12")).toBe(true);
    expect(result.current.isSelected("t14-gen5-intel")).toBe(false);

    // removeFromCompare
    await act(async () => result.current.toggleCompare("p1-gen7"));
    await act(async () => result.current.removeFromCompare("x1-carbon-gen12"));
    expect(result.current.selectedIds).toEqual(["p1-gen7"]);

    // clearCompare
    await act(async () => result.current.toggleCompare("e14-gen6-intel"));
    await act(async () => result.current.clearCompare());
    expect(result.current.selectedIds).toEqual([]);

    // MAX_COMPARE=4 enforcement
    await act(async () => result.current.toggleCompare("a"));
    await act(async () => result.current.toggleCompare("b"));
    await act(async () => result.current.toggleCompare("c"));
    await act(async () => result.current.toggleCompare("d"));
    await act(async () => result.current.toggleCompare("e")); // 5th, should be ignored
    expect(result.current.selectedIds).toHaveLength(4);
    expect(result.current.selectedIds).toEqual(["a", "b", "c", "d"]);
  });
});

/* ── useLocalStorage ─────────────────────────────────────── */

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const getHook = async () => {
    const mod = await import("@/lib/hooks/useLocalStorage");
    return mod.useLocalStorage;
  };

  it("returns the default value when key is missing", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("test-default", 42));
    expect(result.current[0]).toBe(42);
  });

  it("reads existing value from localStorage", async () => {
    localStorage.setItem("test-read", JSON.stringify("hello"));
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("test-read", "default"));
    await new Promise((r) => setTimeout(r, 50));
    expect(result.current[0]).toBe("hello");
  });

  it("writes value to localStorage via setValue", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("test-write", "initial"));
    await act(async () => result.current[1]("updated"));
    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(localStorage.getItem("test-write")!)).toBe("updated");
  });

  it("returns default value for invalid JSON in localStorage", async () => {
    localStorage.setItem("test-invalid", "not-valid-json{{{");
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("test-invalid", "fallback"));
    await new Promise((r) => setTimeout(r, 50));
    expect(result.current[0]).toBe("fallback");
  });

  it("supports functional updates", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("test-func", 0));
    await act(async () => result.current[1]((prev: number) => prev + 1));
    expect(result.current[0]).toBe(1);
    await act(async () => result.current[1]((prev: number) => prev + 5));
    expect(result.current[0]).toBe(6);
  });
});
