// @vitest-environment jsdom
/**
 * Unit tests for useFilters hook.
 * Covers default state, filter updates, URL serialization/deserialization,
 * each filter dimension, and edge cases with invalid/empty values.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFilters } from "@/lib/hooks/useFilters";
import type { Laptop, SwissPrice } from "@/lib/types";

// ─── Minimal fixture data ────────────────────────────────────────────────────

const makeProcessor = () =>
  ({
    name: "Intel Core i7-1355U",
    cores: 10,
    threads: 12,
    baseClock: 1.7,
    boostClock: 5.0,
    tdp: 15,
  }) as const;

const makeModel = (overrides: Partial<Laptop> = {}): Laptop =>
  ({
    id: "t14-gen5-intel",
    name: "ThinkPad T14 Gen 5 Intel",
    lineup: "ThinkPad",
    series: "T",
    year: 2024,
    processor: makeProcessor(),
    ram: { size: 16, type: "DDR5", speed: 5600, maxSize: 64, slots: 1, soldered: true },
    display: {
      size: 14,
      resolution: "1920x1200",
      resolutionLabel: "WUXGA",
      panel: "IPS",
      refreshRate: 60,
      nits: 400,
      touchscreen: false,
    },
    gpu: { name: "Intel Iris Xe", integrated: true },
    storage: { type: "NVMe", size: 512, slots: 1 },
    battery: { whr: 57.5, removable: false },
    weight: 1.38,
    ports: ["USB-C", "USB-A", "HDMI"],
    wireless: ["Wi-Fi 6E"],
    os: "Windows 11 Pro",
    psrefUrl: "https://psref.lenovo.com/Product/ThinkPad/ThinkPad_T14_Gen_5",
    ...overrides,
  }) as Laptop;

const makeLegionModel = (): Laptop =>
  makeModel({
    id: "legion-5i-gen9",
    name: "Legion 5i Gen 9",
    lineup: "Legion",
    series: "5i",
    year: 2024,
    weight: 2.4,
    display: {
      size: 16,
      resolution: "1920x1200",
      resolutionLabel: "WUXGA",
      panel: "IPS",
      refreshRate: 165,
      nits: 350,
      touchscreen: false,
    },
    gpu: { name: "NVIDIA GeForce RTX 4060 Laptop", integrated: false },
    psrefUrl: "https://psref.lenovo.com/Product/Legion/Legion_5i_Gen_9",
  });

const makeYogaModel = (): Laptop =>
  makeModel({
    id: "yoga-7-gen9",
    name: "Yoga 7 Gen 9",
    lineup: "Yoga",
    series: "Yoga 7",
    year: 2023,
    weight: 1.49,
    psrefUrl: "https://psref.lenovo.com/Product/Yoga/Yoga_7_Gen_9",
  });

const models: readonly Laptop[] = [makeModel(), makeLegionModel(), makeYogaModel()];
const prices: readonly SwissPrice[] = [];

// ─── Default state ───────────────────────────────────────────────────────────

describe("useFilters default state", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("should return empty search by default", () => {
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.search).toBe("");
  });

  it("should return empty lineup array by default", () => {
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.lineup).toEqual([]);
  });

  it("should return empty series array by default", () => {
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.series).toEqual([]);
  });

  it("should return name-asc sort by default", () => {
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.sort).toBe("name-asc");
  });

  it("should return null for all numeric filters by default", () => {
    const { result } = renderHook(() => useFilters(models, prices));
    const { minPrice, maxPrice, minScreenSize, maxWeight, year, ramMin } = result.current.filters;
    expect(minPrice).toBeNull();
    expect(maxPrice).toBeNull();
    expect(minScreenSize).toBeNull();
    expect(maxWeight).toBeNull();
    expect(year).toBeNull();
    expect(ramMin).toBeNull();
  });

  it("should return all models when no filters are active", () => {
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filtered).toHaveLength(models.length);
  });
});

// ─── Filter updates ──────────────────────────────────────────────────────────

describe("useFilters setSearch", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("should update search state when setSearch is called", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.setSearch("ThinkPad"));
    expect(result.current.filters.search).toBe("ThinkPad");
  });

  it("should filter models by search query matching name", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.setSearch("Legion"));
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe("legion-5i-gen9");
  });

  it("should return no models when search matches nothing", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.setSearch("zzznomatch"));
    expect(result.current.filtered).toHaveLength(0);
  });

  it("should restore all models when search is cleared", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.setSearch("Legion"));
    await act(async () => result.current.setSearch(""));
    expect(result.current.filtered).toHaveLength(models.length);
  });
});

describe("useFilters setSort", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("should update sort state when setSort is called", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.setSort("name-desc"));
    expect(result.current.filters.sort).toBe("name-desc");
  });

  it("should sort models by name-desc when sort is set", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.setSort("name-desc"));
    const names = result.current.filtered.map((m) => m.name);
    for (let i = 1; i < names.length; i++) {
      expect(names[i - 1].localeCompare(names[i])).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("useFilters toggleLineup", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("should add lineup when toggled on", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.toggleLineup("ThinkPad"));
    expect(result.current.filters.lineup).toContain("ThinkPad");
  });

  it("should remove lineup when toggled off", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.toggleLineup("ThinkPad"));
    await act(async () => result.current.toggleLineup("ThinkPad"));
    expect(result.current.filters.lineup).not.toContain("ThinkPad");
  });

  it("should filter models to only selected lineup", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.toggleLineup("Legion"));
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].lineup).toBe("Legion");
  });

  it("should support multiple lineups simultaneously", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.toggleLineup("ThinkPad"));
    await act(async () => result.current.toggleLineup("Yoga"));
    expect(result.current.filters.lineup).toContain("ThinkPad");
    expect(result.current.filters.lineup).toContain("Yoga");
    expect(result.current.filtered).toHaveLength(2);
  });
});

describe("useFilters toggleSeries", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("should add series when toggled on", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.toggleSeries("T"));
    expect(result.current.filters.series).toContain("T");
  });

  it("should remove series when toggled off", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.toggleSeries("T"));
    await act(async () => result.current.toggleSeries("T"));
    expect(result.current.filters.series).not.toContain("T");
  });

  it("should filter models to only selected series", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.toggleSeries("5i"));
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe("legion-5i-gen9");
  });
});

describe("useFilters updateFilter", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("should update year filter via updateFilter", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.updateFilter("year", 2024));
    expect(result.current.filters.year).toBe(2024);
  });

  it("should filter models by year when year is set", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.updateFilter("year", 2023));
    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].id).toBe("yoga-7-gen9");
  });

  it("should update maxWeight filter via updateFilter", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.updateFilter("maxWeight", 1.5));
    expect(result.current.filters.maxWeight).toBe(1.5);
    // Legion at 2.4kg should be excluded
    expect(result.current.filtered.every((m) => m.weight <= 1.5)).toBe(true);
  });

  it("should clear year filter when set back to null", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.updateFilter("year", 2024));
    await act(async () => result.current.updateFilter("year", null));
    expect(result.current.filters.year).toBeNull();
    expect(result.current.filtered).toHaveLength(models.length);
  });
});

describe("useFilters resetFilters", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("should reset all filters to default values", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.setSearch("Legion"));
    await act(async () => result.current.toggleLineup("ThinkPad"));
    await act(async () => result.current.setSort("name-desc"));
    await act(async () => result.current.resetFilters());
    expect(result.current.filters.search).toBe("");
    expect(result.current.filters.lineup).toEqual([]);
    expect(result.current.filters.sort).toBe("name-asc");
  });

  it("should restore all models after reset", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.toggleLineup("ThinkPad"));
    await act(async () => result.current.resetFilters());
    expect(result.current.filtered).toHaveLength(models.length);
  });
});

// ─── URL serialization ───────────────────────────────────────────────────────

describe("useFilters URL sync", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("should write search to URL query param after update", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.setSearch("Yoga"));
    expect(window.location.search).toContain("search=Yoga");
  });

  it("should write lineup to URL query param after toggle", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.toggleLineup("ThinkPad"));
    expect(window.location.search).toContain("lineup=ThinkPad");
  });

  it("should write series to URL query param after toggle", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.toggleSeries("T"));
    expect(window.location.search).toContain("series=T");
  });

  it("should write sort to URL when not default value", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.setSort("score-desc"));
    expect(window.location.search).toContain("sort=score-desc");
  });

  it("should omit sort from URL when it equals default name-asc", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.setSort("score-desc"));
    await act(async () => result.current.setSort("name-asc"));
    expect(window.location.search).not.toContain("sort=");
  });

  it("should write year to URL param after updateFilter", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.updateFilter("year", 2024));
    expect(window.location.search).toContain("year=2024");
  });

  it("should write comma-separated lineups when multiple are selected", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.toggleLineup("ThinkPad"));
    await act(async () => result.current.toggleLineup("Legion"));
    expect(window.location.search).toMatch(/lineup=ThinkPad%2CLeGion|lineup=ThinkPad,Legion/i);
  });

  it("should clear URL params when all filters are reset", async () => {
    const { result } = renderHook(() => useFilters(models, prices));
    await act(async () => result.current.setSearch("Legion"));
    await act(async () => result.current.resetFilters());
    expect(window.location.search).toBe("");
  });
});

// ─── URL deserialization ─────────────────────────────────────────────────────

describe("useFilters URL deserialization on mount", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("should read search from URL on mount", () => {
    window.history.replaceState(null, "", "/?search=ThinkPad");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.search).toBe("ThinkPad");
  });

  it("should read lineup from URL on mount", () => {
    window.history.replaceState(null, "", "/?lineup=ThinkPad");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.lineup).toEqual(["ThinkPad"]);
  });

  it("should read multiple lineups from URL on mount", () => {
    window.history.replaceState(null, "", "/?lineup=ThinkPad,Legion");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.lineup).toContain("ThinkPad");
    expect(result.current.filters.lineup).toContain("Legion");
  });

  it("should read series from URL on mount", () => {
    window.history.replaceState(null, "", "/?series=T");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.series).toEqual(["T"]);
  });

  it("should read sort from URL on mount", () => {
    window.history.replaceState(null, "", "/?sort=score-desc");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.sort).toBe("score-desc");
  });

  it("should read year from URL on mount", () => {
    window.history.replaceState(null, "", "/?year=2024");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.year).toBe(2024);
  });

  it("should read minPrice and maxPrice from URL on mount", () => {
    window.history.replaceState(null, "", "/?minPrice=1000&maxPrice=2000");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.minPrice).toBe(1000);
    expect(result.current.filters.maxPrice).toBe(2000);
  });

  it("should read maxWeight from URL on mount", () => {
    window.history.replaceState(null, "", "/?maxWeight=1.5");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.maxWeight).toBe(1.5);
  });

  it("should read ramMin from URL on mount", () => {
    window.history.replaceState(null, "", "/?ramMin=32");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.ramMin).toBe(32);
  });

  it("should read minScreen from URL on mount", () => {
    window.history.replaceState(null, "", "/?minScreen=16");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.minScreenSize).toBe(16);
  });
});

// ─── Edge cases: invalid URL values ─────────────────────────────────────────

describe("useFilters URL deserialization edge cases", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("should ignore invalid lineup value from URL", () => {
    window.history.replaceState(null, "", "/?lineup=NotALineup");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.lineup).toEqual([]);
  });

  it("should ignore invalid series value from URL", () => {
    window.history.replaceState(null, "", "/?series=BadSeries");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.series).toEqual([]);
  });

  it("should ignore invalid sort value from URL and use default", () => {
    window.history.replaceState(null, "", "/?sort=invalid-sort");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.sort).toBe("name-asc");
  });

  it("should ignore non-numeric year from URL", () => {
    window.history.replaceState(null, "", "/?year=notanumber");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.year).toBeNull();
  });

  it("should ignore non-numeric maxWeight from URL", () => {
    window.history.replaceState(null, "", "/?maxWeight=heavy");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.maxWeight).toBeNull();
  });

  it("should silently drop invalid values in a comma-separated lineup list", () => {
    window.history.replaceState(null, "", "/?lineup=ThinkPad,BadLineup");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.lineup).toEqual(["ThinkPad"]);
  });

  it("should produce empty lineup when all comma-separated values are invalid", () => {
    window.history.replaceState(null, "", "/?lineup=BadA,BadB");
    const { result } = renderHook(() => useFilters(models, prices));
    expect(result.current.filters.lineup).toEqual([]);
  });

  it("should use defaults when URL has no filter params", () => {
    window.history.replaceState(null, "", "/");
    const { result } = renderHook(() => useFilters(models, prices));
    const f = result.current.filters;
    expect(f.search).toBe("");
    expect(f.sort).toBe("name-asc");
    expect(f.lineup).toEqual([]);
    expect(f.year).toBeNull();
  });
});
