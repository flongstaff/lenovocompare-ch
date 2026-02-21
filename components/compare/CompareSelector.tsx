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
          className="carbon-card hover:border-accent group p-3 text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <Plus size={14} className="text-carbon-400 group-hover:text-accent shrink-0" />
            <div>
              <p className="text-carbon-100 text-sm font-medium">{m.name}</p>
              <p className="text-carbon-400 text-xs">
                {m.year} &middot; {m.series} Series
              </p>
            </div>
          </div>
        </button>
      ))}
    </>
  );
};
