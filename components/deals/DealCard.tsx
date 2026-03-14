"use client";

import { ExternalLink } from "lucide-react";
import type { DealHighlight, Laptop, PriceBaseline } from "@/lib/types";
import { formatCHF, getPriceDiscount } from "@/lib/formatters";
import { isDealStale } from "@/lib/deals";
import { LINEUP_COLORS } from "@/lib/constants";

interface DealCardProps {
  readonly deal: DealHighlight;
  readonly model: Laptop | undefined;
  readonly baseline: PriceBaseline | null;
}

const priceTypeBadge: Record<string, string> = {
  sale: "carbon-chip-success",
  clearance: "carbon-chip-warning",
  refurbished: "carbon-chip",
};

const DealCard = ({ deal, model, baseline }: DealCardProps) => {
  const pctOff = baseline ? getPriceDiscount(deal.price, baseline.msrp) : null;
  const badge = priceTypeBadge[deal.priceType] ?? priceTypeBadge.sale;
  const lineupColor = model ? LINEUP_COLORS[model.lineup] : null;
  const isExpired = deal.expiryDate ? new Date(deal.expiryDate) < new Date() : false;
  const stale = !isExpired && isDealStale(deal);

  return (
    <div
      className={`carbon-card overflow-hidden ${isExpired ? "opacity-50" : ""}`}
      style={{ borderLeft: `3px solid ${lineupColor ? "var(--accent)" : "var(--border-subtle)"}` }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {model?.name ?? deal.laptopId}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {lineupColor && <span className={`carbon-chip ${lineupColor.chipClass}`}>{model?.lineup}</span>}
              <span className={`px-1.5 py-0.5 text-xs ${badge}`}>{deal.priceType}</span>
              {isExpired && <span className="bg-carbon-800 px-1.5 py-0.5 text-xs text-carbon-500">expired</span>}
              {stale && (
                <span className="bg-status-warning/10 px-1.5 py-0.5 text-xs text-status-warning">Unverified</span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
              {formatCHF(deal.price)}
            </div>
            {pctOff !== null && pctOff > 0 && (
              <div className="text-xs font-semibold text-status-success">-{pctOff}% off MSRP</div>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
          {deal.note}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {deal.retailer} · {deal.addedDate}
            {deal.verified && <span className="ml-1 text-status-success">✓</span>}
          </span>
          {deal.url && (
            <a
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="carbon-btn-ghost !px-2 !py-1 text-xs"
            >
              <ExternalLink size={12} /> View
            </a>
          )}
        </div>
        {baseline && (
          <div
            className="mt-3 flex gap-3 border-t pt-2 text-xs"
            style={{ borderColor: "var(--border-subtle)", color: "var(--muted)" }}
          >
            <span>MSRP {formatCHF(baseline.msrp)}</span>
            <span>Low {formatCHF(baseline.historicalLow)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealCard;
