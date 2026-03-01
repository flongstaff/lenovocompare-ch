"use client";
import type { Lineup } from "@/lib/types";
import { LINEUP_COLORS } from "@/lib/constants";

const ALL_LINEUPS: readonly Lineup[] = ["ThinkPad", "IdeaPad Pro", "Legion", "Yoga"];

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
          className={`border px-3 py-1 font-mono text-xs font-medium uppercase tracking-wide transition-colors ${
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
          {l}
        </button>
      );
    })}
  </div>
);
