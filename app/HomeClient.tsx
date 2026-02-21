"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  Laptop as LaptopIcon,
  ChevronDown,
  GraduationCap,
  Feather,
  Code2,
  Palette,
  Gamepad2,
  PiggyBank,
  Search,
} from "lucide-react";
import type { FilterState } from "@/lib/types";
import { useLaptops } from "@/lib/hooks/useLaptops";
import { cpuBenchmarksExpanded } from "@/data/cpu-benchmarks";
import { gpuBenchmarks } from "@/data/gpu-benchmarks";
import { usePrices } from "@/lib/hooks/usePrices";
import { useFilters } from "@/lib/hooks/useFilters";
import { useCompare } from "@/lib/hooks/useCompare";
import { getModelScores } from "@/lib/scoring";
import { FilterBar } from "@/components/filters/FilterBar";
import LaptopCard from "@/components/models/LaptopCard";
import { CompareFloatingBar } from "@/components/compare/CompareFloatingBar";
import { PricePerformanceScatter } from "@/components/charts/PricePerformanceScatter";
import { SkeletonGrid } from "@/components/ui/Skeleton";

/** Animate a number from 0 to target over ~800ms */
const useCounter = (target: number) => {
  const [value, setValue] = useState(0);
  const targetRef = useRef(target);
  targetRef.current = target;
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || target === 0) return;
    hasRun.current = true;
    const duration = 800;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * targetRef.current));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);

  return value;
};

/** Cards shown per page — 12 = 3 rows of 4 on desktop grid, loaded incrementally */
const PAGE_SIZE = 12;

const QUICK_PICKS = [
  {
    id: "student",
    label: "Best for Students",
    desc: "Affordable & reliable",
    icon: GraduationCap,
    color: "#42be65",
    apply: (update: <K extends keyof FilterState>(k: K, v: FilterState[K]) => void) => {
      update("maxPrice", 1200);
    },
  },
  {
    id: "ultraportable",
    label: "Ultraportable",
    desc: "Under 1.3 kg",
    icon: Feather,
    color: "#4589ff",
    apply: (update: <K extends keyof FilterState>(k: K, v: FilterState[K]) => void) => {
      update("maxWeight", 1.3);
    },
  },
  {
    id: "developer",
    label: "Developer",
    desc: "32 GB+ RAM, fast CPU",
    icon: Code2,
    color: "#ee5396",
    apply: (update: <K extends keyof FilterState>(k: K, v: FilterState[K]) => void) => {
      update("ramMin", 32);
    },
  },
  {
    id: "creative",
    label: "Creative Work",
    desc: "OLED & color accuracy",
    icon: Palette,
    color: "#be95ff",
    apply: (update: <K extends keyof FilterState>(k: K, v: FilterState[K]) => void) => {
      update("minScreenSize", 14);
    },
  },
  {
    id: "gaming",
    label: "Gaming",
    desc: "Discrete GPU power",
    icon: Gamepad2,
    color: "#ff832b",
    apply: (
      update: <K extends keyof FilterState>(k: K, v: FilterState[K]) => void,
      toggleLineup: (l: "ThinkPad" | "IdeaPad Pro" | "Legion") => void,
      resetFilters: () => void,
    ) => {
      resetFilters();
      toggleLineup("Legion");
    },
  },
  {
    id: "budget",
    label: "Budget",
    desc: "Under CHF 900",
    icon: PiggyBank,
    color: "#f1c21b",
    apply: (update: <K extends keyof FilterState>(k: K, v: FilterState[K]) => void) => {
      update("maxPrice", 900);
    },
  },
] as const;

const HomeClient = () => {
  const models = useLaptops();
  const { allPrices } = usePrices();
  const { filters, filtered, setSearch, setSort, toggleLineup, toggleSeries, resetFilters, updateFilter } = useFilters(
    models,
    allPrices,
  );
  const { selectedIds, toggleCompare, clearCompare } = useCompare();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showScatter, setShowScatter] = useState(false);
  const cpuCount = useMemo(() => Object.keys(cpuBenchmarksExpanded).length, []);
  const gpuCount = useMemo(() => Object.keys(gpuBenchmarks).length, []);
  const modelCounter = useCounter(models.length);
  const cpuCounter = useCounter(cpuCount);
  const gpuCounter = useCounter(gpuCount);

  const scatterData = useMemo(
    () =>
      filtered
        .map((m) => {
          const s = getModelScores(m, allPrices);
          return s.lowestPrice
            ? { id: m.id, name: m.name, lineup: m.lineup, price: s.lowestPrice, perf: s.perf }
            : null;
        })
        .filter((d): d is NonNullable<typeof d> => d !== null),
    [filtered, allPrices],
  );

  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filterKey]);

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;
  const hasMore = remaining > 0;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  if (models.length === 0) {
    return <SkeletonGrid count={8} />;
  }

  return (
    <div className="space-y-6">
      <div className="relative py-10 sm:py-14">
        {/* Dot grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div
          className="pointer-events-none absolute -left-16 -top-8 h-64 w-64 rounded-full opacity-[0.04] blur-3xl"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="pointer-events-none absolute -top-4 right-0 h-48 w-48 rounded-full opacity-[0.03] blur-3xl"
          style={{ background: "var(--trackpoint)" }}
        />

        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-carbon-400">
          Swiss Lenovo Laptop Registry
        </p>
        <h1 className="text-4xl font-bold leading-[1.1] text-carbon-50 sm:text-5xl">
          Find Your{" "}
          <span className="relative inline-block">
            <span className="text-trackpoint">Lenovo</span>
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-trackpoint/40" />
          </span>
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-carbon-400">
          Compare specs and Swiss pricing across ThinkPad, IdeaPad Pro, and Legion
        </p>

        {/* Stats row */}
        <div className="mt-6 flex items-center gap-6 sm:gap-8">
          {(
            [
              { value: modelCounter, label: "Models", suffix: "+" },
              { value: cpuCounter, label: "CPUs", suffix: "+" },
              { value: gpuCounter, label: "GPUs", suffix: "+" },
              { value: 3, label: "Lineups", suffix: "" },
            ] as const
          ).map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-6 sm:gap-8">
              {i > 0 && <div className="h-8 w-px bg-carbon-600" />}
              <div>
                <p className="font-mono text-3xl font-bold tabular-nums text-carbon-100 sm:text-4xl">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-carbon-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Hero search bar */}
        <div className="relative mt-6 max-w-md">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-carbon-500" />
          <input
            type="text"
            placeholder="Search models, CPUs, features..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="carbon-input !py-3 !pl-10 !pr-4 !text-sm"
          />
        </div>
      </div>

      {/* Quick Picks */}
      <div className="scrollbar-thin -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2">
        {QUICK_PICKS.map((pick) => {
          const Icon = pick.icon;
          return (
            <button
              key={pick.id}
              onClick={() => {
                resetFilters();
                pick.apply(updateFilter, toggleLineup, resetFilters);
              }}
              className="carbon-card group flex min-w-[140px] shrink-0 snap-start items-start gap-3 p-3 transition-all hover:bg-carbon-700/50"
              style={{ borderLeft: `2px solid ${pick.color}` }}
            >
              <Icon size={16} style={{ color: pick.color }} className="mt-0.5 shrink-0" />
              <div className="min-w-0 text-left">
                <p className="text-[12px] font-medium text-carbon-100">{pick.label}</p>
                <p className="text-[10px] text-carbon-400">{pick.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <FilterBar
        filters={filters}
        resultCount={filtered.length}
        onSearch={setSearch}
        onSort={setSort}
        onToggleLineup={toggleLineup}
        onToggleSeries={toggleSeries}
        onReset={resetFilters}
        onUpdateFilter={updateFilter}
      />

      <div className="flex items-center justify-end">
        <button onClick={() => setShowScatter(!showScatter)} className="carbon-btn-ghost !px-3 !py-1.5 !text-xs">
          {showScatter ? "Hide" : "Show"} Price Map
        </button>
      </div>

      {showScatter && scatterData.length > 0 && (
        <div className="carbon-card mb-4 rounded-lg p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-carbon-400">Price vs Performance</h3>
          <PricePerformanceScatter models={scatterData} />
        </div>
      )}

      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((model, i) => (
              <LaptopCard
                key={model.id}
                model={model}
                prices={allPrices}
                isCompareSelected={selectedIds.includes(model.id)}
                onToggleCompare={toggleCompare}
                index={i}
              />
            ))}
          </div>

          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 pb-2 pt-4"
            >
              <div className="flex items-center gap-3 font-mono text-xs text-carbon-500">
                <span className="h-px w-16 flex-1 bg-carbon-600" />
                <span>
                  {visibleCount} of {filtered.length} models
                </span>
                <span className="h-px w-16 flex-1 bg-carbon-600" />
              </div>
              <button
                onClick={loadMore}
                className="carbon-btn-ghost group flex items-center gap-2 !px-6 !py-2.5 text-sm"
              >
                Show {Math.min(remaining, PAGE_SIZE)} more
                <ChevronDown size={14} className="transition-transform group-hover:translate-y-0.5" />
              </button>
            </motion.div>
          )}

          {!hasMore && filtered.length > PAGE_SIZE && (
            <p className="pt-2 text-center font-mono text-xs text-carbon-500">All {filtered.length} models shown</p>
          )}
        </>
      ) : (
        <div className="py-16 text-center">
          <LaptopIcon size={48} className="mx-auto mb-4 text-carbon-500" />
          <p className="text-lg font-medium text-carbon-100">No models found</p>
          <p className="mt-1 text-sm text-carbon-400">Try adjusting your filters</p>
          <button onClick={resetFilters} className="carbon-btn mt-4">
            Reset Filters
          </button>
        </div>
      )}

      {selectedIds.length > 0 && <CompareFloatingBar count={selectedIds.length} onClear={clearCompare} />}
    </div>
  );
};

export default HomeClient;
