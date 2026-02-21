/**
 * Filter and sort logic for the laptop grid.
 *
 * Applies search, lineup, series, year, screen size, weight, RAM, and price range
 * filters, then sorts by the selected criterion (name, price, score, weight, screen).
 */
import type { Laptop, FilterState, SwissPrice, SortOption } from "./types";
import { cpuBenchmarks } from "@/data/cpu-benchmarks";

const getLowestPrice = (id: string, prices: readonly SwissPrice[]): number | null => {
  const matching = prices.filter((p) => p.laptopId === id);
  if (matching.length === 0) return null;
  return Math.min(...matching.map((p) => p.price));
};

export const filterThinkPads = (
  models: readonly Laptop[],
  filters: FilterState,
  prices: readonly SwissPrice[],
): Laptop[] => {
  let result = [...models];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.processor.name.toLowerCase().includes(q) ||
        m.series.toLowerCase().includes(q) ||
        m.lineup.toLowerCase().includes(q),
    );
  }

  if (filters.lineup.length > 0) {
    result = result.filter((m) => filters.lineup.includes(m.lineup));
  }

  if (filters.series.length > 0) {
    result = result.filter((m) => filters.series.includes(m.series));
  }

  if (filters.year !== null) {
    result = result.filter((m) => m.year === filters.year);
  }

  if (filters.minScreenSize !== null) {
    const min = filters.minScreenSize;
    result = result.filter((m) => m.display.size >= min);
  }

  if (filters.maxWeight !== null) {
    const max = filters.maxWeight;
    result = result.filter((m) => m.weight <= max);
  }

  if (filters.ramMin !== null) {
    const min = filters.ramMin;
    result = result.filter((m) => m.ram.size >= min);
  }

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    result = result.filter((m) => {
      const lowest = getLowestPrice(m.id, prices);
      if (lowest === null) return false;
      if (filters.minPrice !== null && lowest < filters.minPrice) return false;
      if (filters.maxPrice !== null && lowest > filters.maxPrice) return false;
      return true;
    });
  }

  return sortThinkPads(result, filters.sort, prices);
};

export const sortThinkPads = (models: Laptop[], sort: SortOption, prices: readonly SwissPrice[]): Laptop[] => {
  const sorted = [...models];
  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "price-asc":
      return sorted.sort((a, b) => {
        const pa = getLowestPrice(a.id, prices) ?? Infinity;
        const pb = getLowestPrice(b.id, prices) ?? Infinity;
        return pa - pb;
      });
    case "price-desc":
      return sorted.sort((a, b) => {
        const pa = getLowestPrice(a.id, prices) ?? 0;
        const pb = getLowestPrice(b.id, prices) ?? 0;
        return pb - pa;
      });
    case "score-desc":
      return sorted.sort((a, b) => {
        const sa = cpuBenchmarks[a.processor.name] ?? 0;
        const sb = cpuBenchmarks[b.processor.name] ?? 0;
        return sb - sa;
      });
    case "weight-asc":
      return sorted.sort((a, b) => a.weight - b.weight);
    case "screen-desc":
      return sorted.sort((a, b) => b.display.size - a.display.size);
    default:
      return sorted;
  }
};
