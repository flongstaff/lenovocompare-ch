"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import type { Laptop } from "@/lib/types";

interface CompareSearchSelectorProps {
  readonly models: readonly Laptop[];
  readonly excludeIds: readonly string[];
  readonly onSelect: (id: string) => void;
}

export const CompareSearchSelector = ({ models, excludeIds, onSelect }: CompareSearchSelectorProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const available = models.filter((m) => !excludeIds.includes(m.id));

  const filtered = query.trim()
    ? available.filter((m) => {
        const q = query.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) || m.series.toLowerCase().includes(q) || m.lineup.toLowerCase().includes(q)
        );
      })
    : available;

  const results = filtered.slice(0, 8);

  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id);
      setQuery("");
      setOpen(false);
    },
    [onSelect],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--muted)" }}
        />
        <input
          type="text"
          className="carbon-input w-full pl-9 pr-3 text-sm"
          placeholder="Search models to add..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && results.length > 0 && (
        <div
          className="absolute z-20 mt-1 w-full overflow-hidden border border-carbon-500 shadow-lg"
          style={{ background: "var(--card-bg)" }}
        >
          {results.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelect(m.id)}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-carbon-600"
            >
              <Plus size={14} className="shrink-0" style={{ color: "var(--accent)" }} />
              <div className="min-w-0 flex-1">
                <span style={{ color: "var(--foreground)" }}>{m.name}</span>
                <span className="ml-2 text-xs" style={{ color: "var(--muted)" }}>
                  {m.year} · {m.series}
                </span>
              </div>
            </button>
          ))}
          {filtered.length > 8 && (
            <div className="px-3 py-2 text-xs" style={{ color: "var(--muted)" }}>
              {filtered.length - 8} more — refine your search
            </div>
          )}
        </div>
      )}
      {open && query.trim() && results.length === 0 && (
        <div
          className="absolute z-20 mt-1 w-full border border-carbon-500 px-3 py-3 text-sm shadow-lg"
          style={{ background: "var(--card-bg)", color: "var(--muted)" }}
        >
          No models found
        </div>
      )}
    </div>
  );
};
