"use client";

import { TrendingDown, TrendingUp, Minus, Tag } from "lucide-react";
import type { SwissPrice, PriceBaseline } from "@/lib/types";
import {
  formatCHF,
  formatDate,
  getPriceDiscount,
  getPriceDiscountColor,
  getPriceDiscountClasses,
} from "@/lib/formatters";
import { PriceAgeBadge } from "@/components/ui/PriceAgeBadge";
import { PriceTrendChart } from "@/components/pricing/PriceTrendChart";

interface PriceHistoryCardProps {
  readonly baseline: PriceBaseline | null;
  readonly priceHistory: readonly SwissPrice[];
}

const getPriceBadge = (price: number, baseline: PriceBaseline) => {
  const pctOff = getPriceDiscount(price, baseline.msrp);
  if (pctOff <= 0) return null;

  return (
    <span className={`border px-1.5 py-0.5 text-[10px] ${getPriceDiscountClasses(pctOff)}`}>{pctOff}% off MSRP</span>
  );
};

const PriceTypeLabel = ({ type }: { type?: string }) => {
  if (!type) return null;
  const styles: Record<string, string> = {
    msrp: "carbon-chip",
    retail: "bg-carbon-700/30 text-carbon-300 border-carbon-600",
    sale: "carbon-chip-success",
    used: "carbon-chip-warning",
    refurbished: "carbon-chip",
  };
  return (
    <span
      className={`border px-1 py-0.5 font-mono text-[10px] uppercase tracking-wider ${styles[type] ?? styles.retail}`}
    >
      {type}
    </span>
  );
};

const PriceHistoryCard = ({ baseline, priceHistory }: PriceHistoryCardProps) => {
  if (!baseline && priceHistory.length === 0) {
    return (
      <div className="carbon-card p-4">
        <h2 className="mb-2 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
          Price History
        </h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          No price history yet.
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--border-subtle)" }}>
          Add prices on the Pricing page to build history for this model.
        </p>
      </div>
    );
  }

  const lowestCurrent = priceHistory.length > 0 ? Math.min(...priceHistory.map((p) => p.price)) : null;

  const nearHistoricalLow = baseline && lowestCurrent ? lowestCurrent <= baseline.historicalLow * 1.05 : false;

  return (
    <div className="carbon-card p-4">
      <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
        Price History
      </h2>

      {/* Combined header: current best + baselines inline */}
      {(lowestCurrent !== null || baseline) && (
        <div className="mb-3 flex flex-wrap items-end gap-4 p-3" style={{ background: "var(--surface)" }}>
          {/* Current best — prominent */}
          {lowestCurrent !== null && (
            <div className="flex items-center gap-2">
              {nearHistoricalLow ? (
                <TrendingDown size={16} style={{ color: "#42be65" }} />
              ) : baseline && lowestCurrent > baseline.typicalRetail ? (
                <TrendingUp size={16} style={{ color: "#da1e28" }} />
              ) : (
                <Minus size={16} style={{ color: "var(--muted)" }} />
              )}
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Best Price
                </div>
                <span
                  className="font-mono text-lg font-bold leading-tight"
                  style={{
                    color: baseline
                      ? getPriceDiscountColor(getPriceDiscount(lowestCurrent, baseline.msrp))
                      : "var(--foreground)",
                  }}
                >
                  {formatCHF(lowestCurrent)}
                </span>
              </div>
              {baseline && getPriceBadge(lowestCurrent, baseline)}
              {nearHistoricalLow && <span className="carbon-chip-success px-1.5 py-0.5 text-[10px]">Near Low</span>}
            </div>
          )}

          {/* Baselines — compact inline */}
          {baseline && (
            <div className="ml-auto flex gap-4">
              <div className="text-center">
                <div className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "#da1e2890" }}>
                  MSRP
                </div>
                <div className="font-mono text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {formatCHF(baseline.msrp)}
                </div>
              </div>
              <div className="text-center">
                <div className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Typical
                </div>
                <div className="font-mono text-xs font-medium" style={{ color: "var(--muted)" }}>
                  {formatCHF(baseline.typicalRetail)}
                </div>
              </div>
              <div className="text-center">
                <div className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "#42be6590" }}>
                  Hist. Low
                </div>
                <div className="font-mono text-xs font-medium" style={{ color: "#42be65" }}>
                  {formatCHF(baseline.historicalLow)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Price trend chart — only show when 3+ entries for meaningful visualization */}
      {priceHistory.length >= 3 && <PriceTrendChart prices={priceHistory} baseline={baseline} />}

      {/* Price timeline */}
      {priceHistory.length > 0 && (
        <div className="space-y-0">
          <div className="mb-2 font-mono text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Timeline ({priceHistory.length} entries)
          </div>
          {priceHistory.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between py-1.5"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-sm" style={{ color: "var(--foreground)" }}>
                  {p.retailer}
                </span>
                <PriceTypeLabel type={p.priceType} />
                {p.note && (
                  <span className="flex items-center gap-0.5 truncate text-[10px]" style={{ color: "var(--muted)" }}>
                    <Tag size={8} /> {p.note}
                  </span>
                )}
              </div>
              <div className="ml-2 flex shrink-0 items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
                  {formatDate(p.dateAdded)}
                  <PriceAgeBadge dateAdded={p.dateAdded} />
                </span>
                <span
                  className="font-mono text-sm font-semibold"
                  style={{
                    color: baseline
                      ? getPriceDiscountColor(getPriceDiscount(p.price, baseline.msrp))
                      : "var(--foreground)",
                  }}
                >
                  {formatCHF(p.price)}
                </span>
                {baseline && getPriceBadge(p.price, baseline)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceHistoryCard;
