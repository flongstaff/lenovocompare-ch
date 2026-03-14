"use client";

import { Plus } from "lucide-react";
import { Laptop } from "@/lib/types";

interface CompareSelectorProps {
  readonly models: readonly Laptop[];
  readonly excludeIds: readonly string[];
  readonly onSelect: (id: string) => void;
}

export const CompareSelector = ({ models, excludeIds, onSelect }: CompareSelectorProps) => {
  const available = models.filter((m) => !excludeIds.includes(m.id));

  return (
    <>
      {available.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          className="carbon-card group p-3 text-left transition-colors hover:border-accent"
        >
          <div className="flex items-center gap-2">
            <Plus size={14} className="shrink-0 text-carbon-400 group-hover:text-accent" />
            <div>
              <p className="text-sm font-medium text-carbon-100">{m.name}</p>
              <p className="text-xs text-carbon-400">
                {m.year} &middot; {m.series} Series
              </p>
            </div>
          </div>
        </button>
      ))}
    </>
  );
};
