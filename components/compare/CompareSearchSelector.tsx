"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import type { Laptop } from "@/lib/types";

interface CompareSearchSelectorProps {
  readonly models: readonly Laptop[];
  readonly excludeIds: readonly string[];
  readonly onSelect: (id: string) => void;
}

const LISTBOX_ID = "compare-search-listbox";

export const CompareSearchSelector = ({ models, excludeIds, onSelect }: CompareSearchSelectorProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const available = models.filter((m) => !excludeIds.includes(m.id));

  const hasQuery = query.trim().length > 0;

  const filtered = hasQuery
    ? available.filter((m) => {
        const q = query.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) || m.series.toLowerCase().includes(q) || m.lineup.toLowerCase().includes(q)
        );
      })
    : [];

  const results = filtered.slice(0, 8);

  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id);
      setQuery("");
      setOpen(false);
      setActiveIndex(-1);
    },
    [onSelect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open || results.length === 0) {
        if (e.key === "Escape") {
          setOpen(false);
          setActiveIndex(-1);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < results.length) {
            handleSelect(results[activeIndex].id);
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          setOpen(false);
          setActiveIndex(-1);
          break;
        }
      }
    },
    [open, results, activeIndex, handleSelect],
  );

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isExpanded = open && results.length > 0;
  const activeDescendant =
    activeIndex >= 0 && activeIndex < results.length ? `compare-option-${results[activeIndex].id}` : undefined;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--muted)" }}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          className="carbon-input w-full pl-9 pr-3 text-sm"
          placeholder="Search models to add..."
          value={query}
          role="combobox"
          aria-expanded={isExpanded}
          aria-controls={LISTBOX_ID}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendant}
          aria-label="Search models to compare"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (hasQuery) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>
      {open && results.length > 0 && (
        <div
          id={LISTBOX_ID}
          role="listbox"
          aria-label="Search results"
          className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto border border-carbon-500 shadow-lg"
          style={{ background: "var(--card-bg)" }}
        >
          {results.map((m, index) => (
            <button
              key={m.id}
              id={`compare-option-${m.id}`}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => handleSelect(m.id)}
              onMouseEnter={() => setActiveIndex(index)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors"
              style={{
                background: index === activeIndex ? "var(--carbon-600, #525252)" : undefined,
              }}
            >
              <Plus size={14} className="shrink-0" style={{ color: "var(--accent)" }} aria-hidden="true" />
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
      {open && hasQuery && results.length === 0 && (
        <div
          id={LISTBOX_ID}
          role="listbox"
          className="absolute z-20 mt-1 w-full border border-carbon-500 px-3 py-3 text-sm shadow-lg"
          style={{ background: "var(--card-bg)", color: "var(--muted)" }}
        >
          No models found
        </div>
      )}
    </div>
  );
};
