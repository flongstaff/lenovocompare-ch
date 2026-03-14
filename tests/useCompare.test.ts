// @vitest-environment jsdom
/**
 * Unit tests for useCompare hook.
 * Covers add/toggle/remove/clear, MAX_COMPARE limit, sessionStorage persistence,
 * setIds, isSelected, and edge cases.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCompare } from "@/lib/hooks/useCompare";
import { MAX_COMPARE } from "@/lib/constants";

const SESSION_KEY = "lenovocompare-compare";

// ─── Happy path ──────────────────────────────────────────────────────────────

describe("useCompare initial state", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("should start with an empty selectedIds array", () => {
    const { result } = renderHook(() => useCompare());
    expect(result.current.selectedIds).toEqual([]);
  });

  it("should report isSelected false for any id when empty", () => {
    const { result } = renderHook(() => useCompare());
    expect(result.current.isSelected("t14-gen5-intel")).toBe(false);
  });
});

describe("useCompare toggleCompare", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("should add a model id when toggled on", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.toggleCompare("t14-gen5-intel"));
    expect(result.current.selectedIds).toContain("t14-gen5-intel");
  });

  it("should remove a model id when toggled off", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.toggleCompare("t14-gen5-intel"));
    await act(async () => result.current.toggleCompare("t14-gen5-intel"));
    expect(result.current.selectedIds).not.toContain("t14-gen5-intel");
  });

  it("should not add a duplicate when the same id is toggled on again", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.toggleCompare("x1-carbon-gen12"));
    await act(async () => result.current.toggleCompare("x1-carbon-gen12"));
    // Second toggle removes it — length back to 0, not 2
    expect(result.current.selectedIds).toHaveLength(0);
  });

  it("should support adding multiple distinct model ids", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.toggleCompare("a"));
    await act(async () => result.current.toggleCompare("b"));
    await act(async () => result.current.toggleCompare("c"));
    expect(result.current.selectedIds).toEqual(["a", "b", "c"]);
  });

  it("should preserve insertion order", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.toggleCompare("first"));
    await act(async () => result.current.toggleCompare("second"));
    expect(result.current.selectedIds[0]).toBe("first");
    expect(result.current.selectedIds[1]).toBe("second");
  });
});

// ─── MAX_COMPARE limit ───────────────────────────────────────────────────────

describe("useCompare MAX_COMPARE limit", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("should not exceed MAX_COMPARE selections", async () => {
    const { result } = renderHook(() => useCompare());
    for (let i = 0; i < MAX_COMPARE + 2; i++) {
      await act(async () => result.current.toggleCompare(`model-${i}`));
    }
    expect(result.current.selectedIds).toHaveLength(MAX_COMPARE);
  });

  it("should silently ignore a toggle-on when at MAX_COMPARE capacity", async () => {
    const { result } = renderHook(() => useCompare());
    for (let i = 0; i < MAX_COMPARE; i++) {
      await act(async () => result.current.toggleCompare(`model-${i}`));
    }
    const overflow = "overflow-model";
    await act(async () => result.current.toggleCompare(overflow));
    expect(result.current.selectedIds).not.toContain(overflow);
  });

  it("should allow adding again after removing one when at max capacity", async () => {
    const { result } = renderHook(() => useCompare());
    const ids = ["a", "b", "c", "d"];
    for (const id of ids) {
      await act(async () => result.current.toggleCompare(id));
    }
    // Remove one to make room
    await act(async () => result.current.toggleCompare("a"));
    await act(async () => result.current.toggleCompare("e"));
    expect(result.current.selectedIds).toContain("e");
    expect(result.current.selectedIds).toHaveLength(MAX_COMPARE);
  });

  it("MAX_COMPARE constant should equal 4", () => {
    expect(MAX_COMPARE).toBe(4);
  });
});

// ─── removeFromCompare ───────────────────────────────────────────────────────

describe("useCompare removeFromCompare", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("should remove an existing model id", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.toggleCompare("t14-gen5-intel"));
    await act(async () => result.current.removeFromCompare("t14-gen5-intel"));
    expect(result.current.selectedIds).not.toContain("t14-gen5-intel");
  });

  it("should be a no-op when removing a non-existent model id", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.toggleCompare("a"));
    await act(async () => result.current.removeFromCompare("non-existent"));
    expect(result.current.selectedIds).toEqual(["a"]);
  });

  it("should remove only the targeted model when multiple are selected", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.toggleCompare("a"));
    await act(async () => result.current.toggleCompare("b"));
    await act(async () => result.current.toggleCompare("c"));
    await act(async () => result.current.removeFromCompare("b"));
    expect(result.current.selectedIds).toEqual(["a", "c"]);
  });
});

// ─── clearCompare ────────────────────────────────────────────────────────────

describe("useCompare clearCompare", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("should empty the selection", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.toggleCompare("a"));
    await act(async () => result.current.toggleCompare("b"));
    await act(async () => result.current.clearCompare());
    expect(result.current.selectedIds).toEqual([]);
  });

  it("should be safe to call when already empty", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.clearCompare());
    expect(result.current.selectedIds).toEqual([]);
  });
});

// ─── setIds ──────────────────────────────────────────────────────────────────

describe("useCompare setIds", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("should replace selected ids with the provided array", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.toggleCompare("old-a"));
    await act(async () => result.current.setIds(["new-x", "new-y"]));
    expect(result.current.selectedIds).toEqual(["new-x", "new-y"]);
  });

  it("should truncate to MAX_COMPARE when more ids are provided", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.setIds(["a", "b", "c", "d", "e"]));
    expect(result.current.selectedIds).toHaveLength(MAX_COMPARE);
    expect(result.current.selectedIds).toEqual(["a", "b", "c", "d"]);
  });

  it("should accept an empty array and clear selection", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.toggleCompare("a"));
    await act(async () => result.current.setIds([]));
    expect(result.current.selectedIds).toEqual([]);
  });
});

// ─── isSelected ─────────────────────────────────────────────────────────────

describe("useCompare isSelected", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("should return true for a selected model id", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.toggleCompare("x1-carbon-gen12"));
    expect(result.current.isSelected("x1-carbon-gen12")).toBe(true);
  });

  it("should return false for a model that was toggled off", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.toggleCompare("x1-carbon-gen12"));
    await act(async () => result.current.toggleCompare("x1-carbon-gen12"));
    expect(result.current.isSelected("x1-carbon-gen12")).toBe(false);
  });

  it("should return false for an id that was never added", () => {
    const { result } = renderHook(() => useCompare());
    expect(result.current.isSelected("never-added")).toBe(false);
  });
});

// ─── sessionStorage persistence ─────────────────────────────────────────────

describe("useCompare sessionStorage persistence", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("should persist selections to sessionStorage after toggle", async () => {
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.toggleCompare("t14-gen5-intel"));
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY)!);
    expect(stored).toContain("t14-gen5-intel");
  });

  it("should read existing selection from sessionStorage on mount", () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(["pre-loaded-id"]));
    const { result } = renderHook(() => useCompare());
    expect(result.current.selectedIds).toContain("pre-loaded-id");
  });

  it("should update sessionStorage when an item is removed", async () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(["a", "b"]));
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.removeFromCompare("a"));
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY)!);
    expect(stored).not.toContain("a");
    expect(stored).toContain("b");
  });

  it("should update sessionStorage to empty array after clearCompare", async () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(["a", "b"]));
    const { result } = renderHook(() => useCompare());
    await act(async () => result.current.clearCompare());
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY)!);
    expect(stored).toEqual([]);
  });

  it("should fall back to empty array when sessionStorage contains invalid JSON", () => {
    sessionStorage.setItem(SESSION_KEY, "not-valid-json{{{");
    const { result } = renderHook(() => useCompare());
    expect(result.current.selectedIds).toEqual([]);
  });

  it("should fall back to empty array when sessionStorage contains non-array JSON", () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ids: ["a"] }));
    const { result } = renderHook(() => useCompare());
    expect(result.current.selectedIds).toEqual([]);
  });

  it("should fall back to empty array when sessionStorage array contains non-string items", () => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([1, 2, 3]));
    const { result } = renderHook(() => useCompare());
    expect(result.current.selectedIds).toEqual([]);
  });
});
