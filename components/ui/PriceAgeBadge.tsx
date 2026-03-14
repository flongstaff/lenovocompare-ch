"use client";

import { getPriceAgeBadge } from "@/lib/formatters";

interface PriceAgeBadgeProps {
  readonly dateAdded: string;
}

export const PriceAgeBadge = ({ dateAdded }: PriceAgeBadgeProps) => {
  const { label, color } = getPriceAgeBadge(dateAdded);

  return (
    <span
      className="inline-flex items-center gap-1 font-mono text-[10px] leading-none tracking-wider"
      style={{ color }}
      title={`Price added ${dateAdded}`}
      aria-label={`Price age: ${label}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      {label}
    </span>
  );
};
