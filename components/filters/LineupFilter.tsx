"use client";
import type { Lineup } from "@/lib/types";
import { LINEUP_COLORS } from "@/lib/constants";

const ALL_LINEUPS: readonly Lineup[] = ["ThinkPad", "IdeaPad Pro", "Legion"];

interface LineupFilterProps {
  readonly selected: readonly Lineup[];
  readonly onToggle: (l: Lineup) => void;
}

export const LineupFilter = ({ selected, onToggle }: LineupFilterProps) => (
  <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by lineup">
    {ALL_LINEUPS.map((l) => {
      const colors = LINEUP_COLORS[l];
      const active = selected.includes(l);
      return (
        <button
          key={l}
          onClick={() => onToggle(l)}
          aria-pressed={active}
          aria-label={`${l} lineup${active ? " (active)" : ""}`}
          className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
            active
              ? `${colors.bg} ${colors.text} ${colors.border}`
              : "border-carbon-500 text-carbon-300 hover:border-carbon-400 hover:text-carbon-100"
          }`}
        >
          {l}
        </button>
      );
    })}
  </div>
);
