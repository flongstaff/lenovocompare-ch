"use client";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  readonly value: string;
  readonly onChange: (v: string) => void;
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => (
  <div className="relative">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
    <input
      type="text"
      placeholder="Search models, CPUs..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="carbon-input !pl-9 !pr-8"
      aria-label="Search models or CPUs"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        className="absolute right-2 top-1/2 -translate-y-1/2"
        style={{ color: "var(--muted)" }}
        aria-label="Clear search"
      >
        <X size={14} />
      </button>
    )}
  </div>
);
