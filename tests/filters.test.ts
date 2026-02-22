import { describe, it, expect } from "vitest";
import { filterThinkPads, sortThinkPads } from "@/lib/filters";
import { laptops } from "@/data/laptops";
import { cpuBenchmarks } from "@/data/cpu-benchmarks";
import type { FilterState, SwissPrice } from "@/lib/types";

const defaultFilter: FilterState = {
  search: "",
  lineup: [],
  series: [],
  sort: "name-asc",
  minPrice: null,
  maxPrice: null,
  minScreenSize: null,
  maxWeight: null,
  year: null,
  ramMin: null,
};

const emptyPrices: readonly SwissPrice[] = [];

describe("filterThinkPads", () => {
  it("returns all models with default/empty filter state", () => {
    const result = filterThinkPads(laptops, defaultFilter, emptyPrices);
    expect(result.length).toBe(laptops.length);
  });

  it("filters by lineup: ThinkPad only", () => {
    const filter: FilterState = { ...defaultFilter, lineup: ["ThinkPad"] };
    const result = filterThinkPads(laptops, filter, emptyPrices);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(laptops.length);
    expect(result.every((m) => m.lineup === "ThinkPad")).toBe(true);
  });

  it("filters by lineup: Legion only", () => {
    const filter: FilterState = { ...defaultFilter, lineup: ["Legion"] };
    const result = filterThinkPads(laptops, filter, emptyPrices);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.lineup === "Legion")).toBe(true);
  });

  it("filters by search query matching model name", () => {
    const filter: FilterState = { ...defaultFilter, search: "X1 Carbon" };
    const result = filterThinkPads(laptops, filter, emptyPrices);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.name.toLowerCase().includes("x1 carbon"))).toBe(true);
  });

  it("filters by search query matching processor name", () => {
    const filter: FilterState = { ...defaultFilter, search: "Ryzen" };
    const result = filterThinkPads(laptops, filter, emptyPrices);
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every(
        (m) =>
          m.processor.name.toLowerCase().includes("ryzen") ||
          m.name.toLowerCase().includes("ryzen") ||
          m.series.toLowerCase().includes("ryzen") ||
          m.lineup.toLowerCase().includes("ryzen"),
      ),
    ).toBe(true);
  });

  it("filters by year", () => {
    const filter: FilterState = { ...defaultFilter, year: 2024 };
    const result = filterThinkPads(laptops, filter, emptyPrices);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.year === 2024)).toBe(true);
  });

  it("filters by max weight", () => {
    const filter: FilterState = { ...defaultFilter, maxWeight: 1.2 };
    const result = filterThinkPads(laptops, filter, emptyPrices);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.weight <= 1.2)).toBe(true);
  });

  it("filters by min screen size", () => {
    const filter: FilterState = { ...defaultFilter, minScreenSize: 16 };
    const result = filterThinkPads(laptops, filter, emptyPrices);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.display.size >= 16)).toBe(true);
  });

  it("filters by min RAM", () => {
    const filter: FilterState = { ...defaultFilter, ramMin: 32 };
    const result = filterThinkPads(laptops, filter, emptyPrices);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((m) => m.ram.size >= 32)).toBe(true);
  });

  it("filters by price range excludes models without prices", () => {
    const filter: FilterState = { ...defaultFilter, minPrice: 1000, maxPrice: 2000 };
    // With no prices, all models should be filtered out
    const result = filterThinkPads(laptops, filter, emptyPrices);
    expect(result.length).toBe(0);
  });

  it("filters by price range includes models with matching prices", () => {
    const prices: SwissPrice[] = [
      { id: "test-1", laptopId: "x1-carbon-gen12", price: 1500, retailer: "Digitec", date: "2024-06-01" },
    ];
    const filter: FilterState = { ...defaultFilter, minPrice: 1000, maxPrice: 2000 };
    const result = filterThinkPads(laptops, filter, prices);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("x1-carbon-gen12");
  });
});

describe("sortThinkPads", () => {
  it("sorts by name-asc alphabetically", () => {
    const models = [...laptops].slice(0, 10);
    const sorted = sortThinkPads([...models], "name-asc", emptyPrices);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].name.localeCompare(sorted[i].name)).toBeLessThanOrEqual(0);
    }
  });

  it("sorts by name-desc reverse alphabetically", () => {
    const models = [...laptops].slice(0, 10);
    const sorted = sortThinkPads([...models], "name-desc", emptyPrices);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].name.localeCompare(sorted[i].name)).toBeGreaterThanOrEqual(0);
    }
  });

  it("sorts by score-desc highest scoring first", () => {
    const models = [...laptops].slice(0, 20);
    const sorted = sortThinkPads([...models], "score-desc", emptyPrices);
    for (let i = 1; i < sorted.length; i++) {
      const prevScore = cpuBenchmarks[sorted[i - 1].processor.name] ?? 0;
      const currScore = cpuBenchmarks[sorted[i].processor.name] ?? 0;
      expect(prevScore).toBeGreaterThanOrEqual(currScore);
    }
  });

  it("sorts by weight-asc lightest first", () => {
    const models = [...laptops].slice(0, 10);
    const sorted = sortThinkPads([...models], "weight-asc", emptyPrices);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].weight).toBeLessThanOrEqual(sorted[i].weight);
    }
  });

  it("sorts by screen-desc largest screen first", () => {
    const models = [...laptops].slice(0, 10);
    const sorted = sortThinkPads([...models], "screen-desc", emptyPrices);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].display.size).toBeGreaterThanOrEqual(sorted[i].display.size);
    }
  });
});
