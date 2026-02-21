"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Laptop, ChevronDown } from "lucide-react";
import { useLaptops } from "@/lib/hooks/useLaptops";
import { usePrices } from "@/lib/hooks/usePrices";
import { useFilters } from "@/lib/hooks/useFilters";
import { useCompare } from "@/lib/hooks/useCompare";
import { FilterBar } from "@/components/filters/FilterBar";
import ThinkPadCard from "@/components/thinkpad/ThinkPadCard";
import { CompareFloatingBar } from "@/components/compare/CompareFloatingBar";
import { SkeletonGrid } from "@/components/ui/Skeleton";

/** Cards shown per page — 12 = 3 rows of 4 on desktop grid, loaded incrementally */
const PAGE_SIZE = 12;

const HomeClient = () => {
  const models = useLaptops();
  const { allPrices } = usePrices();
  const { filters, filtered, setSearch, setSort, toggleLineup, toggleSeries, resetFilters, updateFilter } = useFilters(
    models,
    allPrices,
  );
  const { selectedIds, toggleCompare, clearCompare } = useCompare();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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
        <div
          className="pointer-events-none absolute -left-16 -top-8 h-64 w-64 rounded-full opacity-[0.04] blur-3xl"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="pointer-events-none absolute -top-4 right-0 h-48 w-48 rounded-full opacity-[0.03] blur-3xl"
          style={{ background: "var(--trackpoint)" }}
        />

        <p className="text-carbon-400 mb-3 font-mono text-xs uppercase tracking-[0.3em]">
          Swiss Lenovo Laptop Registry
        </p>
        <h1 className="text-carbon-50 text-4xl font-bold leading-[1.1] sm:text-5xl">
          Find Your{" "}
          <span className="relative inline-block">
            <span className="text-trackpoint">Lenovo</span>
            <span className="bg-trackpoint/40 absolute -bottom-1 left-0 right-0 h-[3px]" />
          </span>
        </h1>
        <p className="text-carbon-400 mt-3 max-w-lg text-sm leading-relaxed">
          Compare specs and Swiss pricing for{" "}
          <span className="text-carbon-200 font-medium">{models.length} models</span> across ThinkPad, IdeaPad Pro, and
          Legion
        </p>
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

      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((model, i) => (
              <ThinkPadCard
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
              <div className="text-carbon-500 flex items-center gap-3 font-mono text-xs">
                <span className="bg-carbon-600 h-px w-16 flex-1" />
                <span>
                  {visibleCount} of {filtered.length} models
                </span>
                <span className="bg-carbon-600 h-px w-16 flex-1" />
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
            <p className="text-carbon-500 pt-2 text-center font-mono text-xs">All {filtered.length} models shown</p>
          )}
        </>
      ) : (
        <div className="py-16 text-center">
          <Laptop size={48} className="text-carbon-500 mx-auto mb-4" />
          <p className="text-carbon-100 text-lg font-medium">No models found</p>
          <p className="text-carbon-400 mt-1 text-sm">Try adjusting your filters</p>
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
