"use client";
import { ExternalLink, Trash2, Tag } from "lucide-react";
import type { SwissPrice, Laptop } from "@/lib/types";
import { formatCHF, formatDate } from "@/lib/formatters";

const PRICE_TYPE_STYLES: Record<string, string> = {
  msrp: "bg-blue-900/30 text-blue-400 border-blue-700",
  retail: "bg-slate-700/30 text-slate-300 border-slate-600",
  sale: "bg-green-900/30 text-green-400 border-green-700",
  used: "bg-amber-900/30 text-amber-400 border-amber-700",
  refurbished: "bg-teal-900/30 text-teal-400 border-teal-700",
};

interface PriceDisplayProps {
  readonly price: SwissPrice;
  readonly model?: Laptop;
  readonly onRemove?: (id: string) => void;
}

export const PriceDisplay = ({ price, model, onRemove }: PriceDisplayProps) => (
  <div
    className="flex items-center justify-between px-3 py-2.5"
    style={{ borderBottom: "1px solid var(--border-subtle)" }}
  >
    <div className="min-w-0 flex-1">
      {model && (
        <p className="truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>
          {model.name}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
        <span>{price.retailer}</span>
        <span>·</span>
        <span>{formatDate(price.dateAdded)}</span>
        {price.priceType && (
          <span
            className={`border px-1 py-0.5 text-[10px] uppercase tracking-wider ${PRICE_TYPE_STYLES[price.priceType] ?? PRICE_TYPE_STYLES.retail}`}
          >
            {price.priceType}
          </span>
        )}
        {price.isUserAdded && <span className="carbon-chip !text-[10px]">User</span>}
        {price.note && (
          <span className="flex items-center gap-0.5 text-[10px]" style={{ color: "var(--muted)" }}>
            <Tag size={8} /> {price.note}
          </span>
        )}
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className="font-mono font-semibold" style={{ color: "var(--foreground)" }}>
        {formatCHF(price.price)}
      </span>
      {price.url && (
        <a href={price.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-light)" }}>
          <ExternalLink size={14} />
        </a>
      )}
      {price.isUserAdded && onRemove && (
        <button
          onClick={() => onRemove(price.id)}
          className="text-carbon-400 transition-colors hover:text-trackpoint"
          aria-label="Remove price"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  </div>
);
