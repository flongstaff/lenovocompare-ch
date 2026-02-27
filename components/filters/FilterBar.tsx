"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import type { FilterState, Lineup, Series, SortOption } from "@/lib/types";
import { SearchInput } from "./SearchInput";
import { LineupFilter } from "./LineupFilter";
import { SeriesFilter } from "./SeriesFilter";
import { SortSelect } from "./SortSelect";
import { laptops } from "@/data/laptops";

const UNIQUE_YEARS = Array.from(new Set(laptops.map((m) => m.year))).sort((a, b) => b - a);
const SCREEN_SIZES = [13, 14, 16] as const;

interface FilterBarProps {
  readonly filters: FilterState;
  readonly resultCount: number;
  readonly onSearch: (v: string) => void;
  readonly onSort: (v: SortOption) => void;
  readonly onToggleLineup: (l: Lineup) => void;
  readonly onToggleSeries: (s: Series) => void;
  readonly onReset: () => void;
  readonly onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

export const FilterBar = ({
  filters,
  resultCount,
  onSearch,
  onSort,
  onToggleLineup,
  onToggleSeries,
  onReset,
  onUpdateFilter,
}: FilterBarProps) => {
  const [expanded, setExpanded] = useState(false);
  const hasActiveFilters =
    filters.search ||
    filters.lineup.length > 0 ||
    filters.series.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.maxWeight !== null ||
    filters.ramMin !== null ||
    filters.year !== null ||
    filters.minScreenSize !== null;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchInput value={filters.search} onChange={onSearch} />
        </div>
        <div className="flex items-center gap-2">
          <SortSelect value={filters.sort} onChange={onSort} />
          <button
            onClick={() => setExpanded(!expanded)}
            className="carbon-btn-ghost !px-3 !py-1.5 text-sm"
            aria-expanded={expanded}
            aria-controls="filter-panel"
          >
            Filters
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {hasActiveFilters && (
            <button onClick={onReset} className="carbon-btn-ghost !px-2 !py-1.5" aria-label="Reset filters">
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <LineupFilter selected={filters.lineup} onToggle={onToggleLineup} />
        <div className="flex items-center justify-between">
          <SeriesFilter selected={filters.series} selectedLineups={filters.lineup} onToggle={onToggleSeries} />
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            {resultCount} model{resultCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {expanded && (
        <fieldset
          id="filter-panel"
          className="carbon-card grid animate-slide-up grid-cols-2 gap-4 border-0 p-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          <div>
            <label htmlFor="filter-min-price" className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
              Min Price (CHF)
            </label>
            <input
              id="filter-min-price"
              type="number"
              placeholder="0"
              value={filters.minPrice ?? ""}
              onChange={(e) => onUpdateFilter("minPrice", e.target.value ? Number(e.target.value) : null)}
              className="carbon-input text-sm"
            />
          </div>
          <div>
            <label htmlFor="filter-max-price" className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
              Max Price (CHF)
            </label>
            <input
              id="filter-max-price"
              type="number"
              placeholder="5000"
              value={filters.maxPrice ?? ""}
              onChange={(e) => onUpdateFilter("maxPrice", e.target.value ? Number(e.target.value) : null)}
              className="carbon-input text-sm"
            />
          </div>
          <div>
            <label htmlFor="filter-max-weight" className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
              Max Weight (kg)
            </label>
            <input
              id="filter-max-weight"
              type="number"
              step="0.1"
              placeholder="2.0"
              value={filters.maxWeight ?? ""}
              onChange={(e) => onUpdateFilter("maxWeight", e.target.value ? Number(e.target.value) : null)}
              className="carbon-input text-sm"
            />
          </div>
          <div>
            <label htmlFor="filter-ram" className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
              Min RAM (GB)
            </label>
            <select
              id="filter-ram"
              value={filters.ramMin ?? ""}
              onChange={(e) => onUpdateFilter("ramMin", e.target.value ? Number(e.target.value) : null)}
              className="carbon-select text-sm"
            >
              <option value="">Any</option>
              <option value="8">8 GB+</option>
              <option value="16">16 GB+</option>
              <option value="32">32 GB+</option>
              <option value="64">64 GB+</option>
            </select>
          </div>
          <div>
            <label htmlFor="filter-year" className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
              Year
            </label>
            <select
              id="filter-year"
              value={filters.year ?? ""}
              onChange={(e) => onUpdateFilter("year", e.target.value ? Number(e.target.value) : null)}
              className="carbon-select text-sm"
            >
              <option value="">Any</option>
              {UNIQUE_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter-screen" className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
              Min Screen
            </label>
            <select
              id="filter-screen"
              value={filters.minScreenSize ?? ""}
              onChange={(e) => onUpdateFilter("minScreenSize", e.target.value ? Number(e.target.value) : null)}
              className="carbon-select text-sm"
            >
              <option value="">Any</option>
              {SCREEN_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}&quot;+
                </option>
              ))}
            </select>
          </div>
        </fieldset>
      )}
    </div>
  );
};
