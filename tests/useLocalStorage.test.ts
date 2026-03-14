// @vitest-environment jsdom
/**
 * Unit tests for useLocalStorage hook.
 * Covers string/number/object values, default values, legacy key migration,
 * validator callback, functional updates, and invalid JSON handling.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

// Dynamic import pattern from existing tests to avoid module-level `migrated` singleton
const getHook = async () => {
  const mod = await import("@/lib/hooks/useLocalStorage");
  return mod.useLocalStorage;
};

// ─── Default value ───────────────────────────────────────────────────────────

describe("useLocalStorage default value", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return the default value when the key does not exist", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("missing-key", "default-string"));
    expect(result.current[0]).toBe("default-string");
  });

  it("should return a numeric default when the key does not exist", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("missing-num", 0));
    expect(result.current[0]).toBe(0);
  });

  it("should return a boolean default when the key does not exist", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("missing-bool", false));
    expect(result.current[0]).toBe(false);
  });

  it("should return an array default when the key does not exist", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage<string[]>("missing-arr", []));
    expect(result.current[0]).toEqual([]);
  });

  it("should return an object default when the key does not exist", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("missing-obj", { count: 0 }));
    expect(result.current[0]).toEqual({ count: 0 });
  });
});

// ─── Reading existing values ─────────────────────────────────────────────────

describe("useLocalStorage reading stored values", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should read a stored string value", async () => {
    localStorage.setItem("str-key", JSON.stringify("hello world"));
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("str-key", "default"));
    expect(result.current[0]).toBe("hello world");
  });

  it("should read a stored number value", async () => {
    localStorage.setItem("num-key", JSON.stringify(42));
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("num-key", 0));
    expect(result.current[0]).toBe(42);
  });

  it("should read a stored object value", async () => {
    const stored = { name: "ThinkPad T14", price: 1299 };
    localStorage.setItem("obj-key", JSON.stringify(stored));
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("obj-key", {}));
    expect(result.current[0]).toEqual(stored);
  });

  it("should read a stored array value", async () => {
    const stored = ["a", "b", "c"];
    localStorage.setItem("arr-key", JSON.stringify(stored));
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage<string[]>("arr-key", []));
    expect(result.current[0]).toEqual(stored);
  });

  it("should read a stored boolean value", async () => {
    localStorage.setItem("bool-key", JSON.stringify(true));
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("bool-key", false));
    expect(result.current[0]).toBe(true);
  });
});

// ─── Writing values ──────────────────────────────────────────────────────────

describe("useLocalStorage setValue", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should update state when setValue is called with a new value", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("write-str", "initial"));
    await act(async () => result.current[1]("updated"));
    expect(result.current[0]).toBe("updated");
  });

  it("should persist the new value to localStorage", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("write-persist", "initial"));
    await act(async () => result.current[1]("saved"));
    expect(JSON.parse(localStorage.getItem("write-persist")!)).toBe("saved");
  });

  it("should write a number to localStorage", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("write-num", 0));
    await act(async () => result.current[1](99));
    expect(JSON.parse(localStorage.getItem("write-num")!)).toBe(99);
  });

  it("should write an object to localStorage as JSON", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("write-obj", {}));
    await act(async () => result.current[1]({ count: 7 }));
    expect(JSON.parse(localStorage.getItem("write-obj")!)).toEqual({ count: 7 });
  });

  it("should write an array to localStorage as JSON", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage<string[]>("write-arr", []));
    await act(async () => result.current[1](["x", "y"]));
    expect(JSON.parse(localStorage.getItem("write-arr")!)).toEqual(["x", "y"]);
  });
});

// ─── Functional updates ──────────────────────────────────────────────────────

describe("useLocalStorage functional updates", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should support a functional updater that receives previous value", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("func-num", 0));
    await act(async () => result.current[1]((prev: number) => prev + 10));
    expect(result.current[0]).toBe(10);
  });

  it("should accumulate functional updates correctly", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("func-acc", 0));
    await act(async () => result.current[1]((prev: number) => prev + 1));
    await act(async () => result.current[1]((prev: number) => prev + 5));
    expect(result.current[0]).toBe(6);
  });

  it("should support appending to an array via functional updater", async () => {
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage<string[]>("func-arr", ["a"]));
    await act(async () => result.current[1]((prev: string[]) => [...prev, "b"]));
    expect(result.current[0]).toEqual(["a", "b"]);
  });
});

// ─── Invalid JSON handling ───────────────────────────────────────────────────

describe("useLocalStorage invalid JSON handling", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return the default value when localStorage contains invalid JSON", async () => {
    localStorage.setItem("bad-json", "not-valid-json{{{");
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("bad-json", "fallback"));
    expect(result.current[0]).toBe("fallback");
  });

  it("should return the default value when localStorage contains empty string", async () => {
    localStorage.setItem("empty-val", "");
    const useLocalStorage = await getHook();
    const { result } = renderHook(() => useLocalStorage("empty-val", "fallback"));
    // Empty string fails JSON.parse — should return default
    expect(result.current[0]).toBe("fallback");
  });

  it("should not throw when localStorage contains malformed JSON", async () => {
    localStorage.setItem("throw-key", "{broken");
    const useLocalStorage = await getHook();
    expect(() => {
      renderHook(() => useLocalStorage("throw-key", null));
    }).not.toThrow();
  });
});

// ─── Validator callback ──────────────────────────────────────────────────────

describe("useLocalStorage validator", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return stored value when validator passes", async () => {
    localStorage.setItem("valid-key", JSON.stringify(42));
    const useLocalStorage = await getHook();
    const isNumber = (v: unknown): v is number => typeof v === "number";
    const { result } = renderHook(() => useLocalStorage("valid-key", 0, isNumber));
    expect(result.current[0]).toBe(42);
  });

  it("should return default value when validator fails", async () => {
    localStorage.setItem("invalid-typed", JSON.stringify("not-a-number"));
    const useLocalStorage = await getHook();
    const isNumber = (v: unknown): v is number => typeof v === "number";
    const { result } = renderHook(() => useLocalStorage("invalid-typed", 99, isNumber));
    expect(result.current[0]).toBe(99);
  });

  it("should use default when validator rejects stored array contents", async () => {
    localStorage.setItem("bad-arr", JSON.stringify([1, 2, 3]));
    const useLocalStorage = await getHook();
    // Validator expects array of strings
    const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");
    const { result } = renderHook(() => useLocalStorage("bad-arr", [] as string[], isStringArray));
    expect(result.current[0]).toEqual([]);
  });

  it("should accept valid data that passes array validator", async () => {
    localStorage.setItem("good-arr", JSON.stringify(["x", "y"]));
    const useLocalStorage = await getHook();
    const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");
    const { result } = renderHook(() => useLocalStorage("good-arr", [] as string[], isStringArray));
    expect(result.current[0]).toEqual(["x", "y"]);
  });
});

// ─── Legacy key migration ────────────────────────────────────────────────────

describe("useLocalStorage legacy key migration", () => {
  beforeEach(() => {
    localStorage.clear();
    // Remove migration flag so each test runs migration fresh
    localStorage.removeItem("lenovocompare-migrated");
  });

  it("should migrate thinkcompare-prices to lenovocompare-prices", async () => {
    localStorage.setItem("thinkcompare-prices", JSON.stringify([{ id: "sp-1" }]));
    // Isolate module so singleton `migrated` variable is reset
    vi.resetModules();
    const mod = await import("@/lib/hooks/useLocalStorage");
    const { result } = renderHook(() => mod.useLocalStorage("lenovocompare-prices", []));
    const stored = result.current[0] as unknown[];
    expect(stored).toHaveLength(1);
    // Old key should be removed
    expect(localStorage.getItem("thinkcompare-prices")).toBeNull();
  });

  it("should set the migration sentinel key after first run", async () => {
    vi.resetModules();
    const mod = await import("@/lib/hooks/useLocalStorage");
    renderHook(() => mod.useLocalStorage("any-key", null));
    expect(localStorage.getItem("lenovocompare-migrated")).toBe("1");
  });

  it("should not overwrite lenovocompare-prices if it already exists", async () => {
    localStorage.setItem("thinkcompare-prices", JSON.stringify([{ id: "old" }]));
    localStorage.setItem("lenovocompare-prices", JSON.stringify([{ id: "existing" }]));
    vi.resetModules();
    const mod = await import("@/lib/hooks/useLocalStorage");
    const { result } = renderHook(() => mod.useLocalStorage("lenovocompare-prices", []));
    const stored = result.current[0] as Array<{ id: string }>;
    expect(stored[0].id).toBe("existing");
  });

  it("should not run migration again after sentinel key is set", async () => {
    localStorage.setItem("lenovocompare-migrated", "1");
    localStorage.setItem("thinkcompare-prices", JSON.stringify([{ id: "old" }]));
    vi.resetModules();
    const mod = await import("@/lib/hooks/useLocalStorage");
    renderHook(() => mod.useLocalStorage("lenovocompare-prices", []));
    // Old key should still be present — migration was skipped
    expect(localStorage.getItem("thinkcompare-prices")).not.toBeNull();
  });
});
