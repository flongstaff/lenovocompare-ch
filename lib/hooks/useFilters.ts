"use client";
/**
 * Filter state management with bidirectional URL query-string sync.
 * Reads filter params from URL on mount, writes them back on change.
 * Returns filtered + sorted models and filter update functions.
 */
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { FilterState, Laptop, SwissPrice, Lineup, Series, SortOption } from "@/lib/types";
import { filterThinkPads } from "@/lib/filters";

const VALID_LINEUPS = ["ThinkPad", "IdeaPad Pro", "Legion"] as const satisfies readonly Lineup[];
const VALID_SERIES = [
  "X1",
  "T",
  "P",
  "L",
  "E",
  "Pro 5",
  "Pro 5i",
  "Pro 7",
  "5",
  "5i",
  "7",
  "7i",
  "Pro",
  "Slim",
] as const satisfies readonly Series[];
const VALID_SORTS = [
  "name-asc",
  "name-desc",
  "price-asc",
  "price-desc",
  "score-desc",
  "weight-asc",
  "screen-desc",
] as const satisfies readonly SortOption[];

const defaultFilters: FilterState = {
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

type MutableFilterState = { -readonly [K in keyof FilterState]: FilterState[K] };

const parseFiltersFromUrl = (): Partial<MutableFilterState> => {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const result: Partial<MutableFilterState> = {};

  const search = p.get("search");
  if (search) result.search = search;

  const lineup = p.get("lineup");
  if (lineup) {
    const valid = lineup.split(",").filter((l): l is Lineup => (VALID_LINEUPS as readonly string[]).includes(l));
    if (valid.length > 0) result.lineup = valid;
  }

  const series = p.get("series");
  if (series) {
    const valid = series.split(",").filter((s): s is Series => (VALID_SERIES as readonly string[]).includes(s));
    if (valid.length > 0) result.series = valid;
  }

  const sort = p.get("sort");
  if (sort && (VALID_SORTS as readonly string[]).includes(sort)) result.sort = sort as SortOption;

  const parseNum = (v: string | null): number | null => {
    if (!v) return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
  };

  result.minPrice = parseNum(p.get("minPrice"));
  result.maxPrice = parseNum(p.get("maxPrice"));
  result.year = parseNum(p.get("year"));
  result.ramMin = parseNum(p.get("ramMin"));
  result.maxWeight = parseNum(p.get("maxWeight"));
  result.minScreenSize = parseNum(p.get("minScreen"));

  return result;
};

const syncFiltersToUrl = (filters: FilterState) => {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams();

  if (filters.search) p.set("search", filters.search);
  if (filters.lineup.length > 0) p.set("lineup", filters.lineup.join(","));
  if (filters.series.length > 0) p.set("series", filters.series.join(","));
  if (filters.sort !== "name-asc") p.set("sort", filters.sort);
  if (filters.minPrice !== null) p.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== null) p.set("maxPrice", String(filters.maxPrice));
  if (filters.year !== null) p.set("year", String(filters.year));
  if (filters.ramMin !== null) p.set("ramMin", String(filters.ramMin));
  if (filters.maxWeight !== null) p.set("maxWeight", String(filters.maxWeight));
  if (filters.minScreenSize !== null) p.set("minScreen", String(filters.minScreenSize));

  const qs = p.toString();
  const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState(null, "", newUrl);
};

export const useFilters = (models: readonly Laptop[], prices: readonly SwissPrice[]) => {
  const initialized = useRef(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Read URL params on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const fromUrl = parseFiltersFromUrl();
    if (Object.keys(fromUrl).length > 0) {
      setFilters((f) => ({ ...f, ...fromUrl }));
    }
  }, []);

  // Sync to URL on change (skip initial)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    syncFiltersToUrl(filters);
  }, [filters]);

  const filtered = useMemo(() => filterThinkPads(models, filters, prices), [models, filters, prices]);

  const setSearch = useCallback((search: string) => setFilters((f) => ({ ...f, search })), []);
  const setSort = useCallback((sort: SortOption) => setFilters((f) => ({ ...f, sort })), []);
  const toggleLineup = useCallback(
    (l: Lineup) =>
      setFilters((f) => ({
        ...f,
        lineup: f.lineup.includes(l) ? f.lineup.filter((x) => x !== l) : [...f.lineup, l],
      })),
    [],
  );
  const toggleSeries = useCallback(
    (s: Series) =>
      setFilters((f) => ({
        ...f,
        series: f.series.includes(s) ? f.series.filter((x) => x !== s) : [...f.series, s],
      })),
    [],
  );
  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => setFilters((f) => ({ ...f, [key]: value })),
    [],
  );

  return { filters, filtered, setSearch, setSort, toggleLineup, toggleSeries, resetFilters, updateFilter };
};
