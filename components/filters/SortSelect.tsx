"use client";
import { SortOption } from "@/lib/types";
import { SORT_OPTIONS } from "@/lib/constants";

interface SortSelectProps {
  readonly value: SortOption;
  readonly onChange: (v: SortOption) => void;
}

export const SortSelect = ({ value, onChange }: SortSelectProps) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value as SortOption)}
    className="carbon-select !w-auto"
    aria-label="Sort models"
  >
    {SORT_OPTIONS.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);
