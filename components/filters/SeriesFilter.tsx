"use client";
import type { Lineup, Series } from "@/lib/types";
import { SERIES_COLORS } from "@/lib/constants";

const LINEUP_SERIES: Record<Lineup, readonly Series[]> = {
  ThinkPad: ["X1", "T", "P", "L", "E"],
  "IdeaPad Pro": ["Pro 5", "Pro 5i", "Pro 7"],
  Legion: ["5", "5i", "7", "7i", "Pro", "Slim"],
  Yoga: ["Yoga 6", "Yoga 7", "Yoga 9", "Yoga Slim", "Yoga Book"],
};

const ALL_SERIES: readonly Series[] = Object.values(LINEUP_SERIES).flat() as Series[];

interface SeriesFilterProps {
  readonly selected: readonly Series[];
  readonly selectedLineups: readonly Lineup[];
  readonly onToggle: (s: Series) => void;
}

export const SeriesFilter = ({ selected, selectedLineups, onToggle }: SeriesFilterProps) => {
  const visibleSeries = selectedLineups.length > 0 ? selectedLineups.flatMap((l) => [...LINEUP_SERIES[l]]) : ALL_SERIES;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by series">
      {visibleSeries.map((s) => {
        const colors = SERIES_COLORS[s];
        const active = selected.includes(s);
        return (
          <button
            key={s}
            onClick={() => onToggle(s)}
            aria-pressed={active}
            aria-label={`${s} series${active ? " (active)" : ""}`}
            className={`border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide transition-colors ${
              active
                ? colors.chipClass
                : "border-carbon-600 text-carbon-400 hover:border-carbon-400 hover:text-carbon-100"
            }`}
            style={
              active
                ? { color: colors.accent, borderColor: colors.accent + "40", background: colors.accent + "15" }
                : undefined
            }
          >
            {s}
          </button>
        );
      })}
    </div>
  );
};
