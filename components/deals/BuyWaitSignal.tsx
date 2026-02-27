"use client";

import Link from "next/link";
import type { Laptop, PriceBaseline, BuySignal } from "@/lib/types";
import { formatCHF } from "@/lib/formatters";
import { getBuySignalMeta } from "@/lib/deals";
import { LINEUP_COLORS } from "@/lib/constants";

interface BuyWaitSignalProps {
  readonly model: Laptop;
  readonly baseline: PriceBaseline;
  readonly bestPrice: number;
  readonly signal: BuySignal;
}

const BuyWaitSignal = ({ model, baseline, bestPrice, signal }: BuyWaitSignalProps) => {
  const meta = getBuySignalMeta(signal);
  const range = baseline.msrp - baseline.historicalLow;
  const position = range > 0 ? Math.max(0, Math.min(100, ((baseline.msrp - bestPrice) / range) * 100)) : 50;
  const lineupColor = LINEUP_COLORS[model.lineup];
  const savingsFromMsrp = baseline.msrp - bestPrice;
  const pctOff = baseline.msrp > 0 ? Math.round((savingsFromMsrp / baseline.msrp) * 100) : 0;

  return (
    <Link
      href={`/model/${model.id}`}
      className="group block border transition-all duration-200 hover:border-carbon-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      style={{
        borderColor: "var(--border-subtle)",
        background: "var(--surface-alt)",
        borderLeft: `3px solid ${meta.color}`,
      }}
    >
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Left: model info + bar */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span
              className="truncate text-sm font-semibold transition-colors group-hover:text-white"
              style={{ color: "var(--foreground)" }}
            >
              {model.name}
            </span>
            <span className={`flex-shrink-0 ${meta.chipClass}`}>{meta.label}</span>
            {lineupColor && (
              <span
                className="hidden flex-shrink-0 sm:inline-flex"
                style={{
                  fontSize: 9,
                  fontFamily: "var(--font-geist-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: lineupColor.accent,
                  opacity: 0.7,
                }}
              >
                {model.lineup}
              </span>
            )}
          </div>

          {/* Price bar */}
          <div className="mt-2 flex items-center gap-2.5">
            <span className="w-14 text-right font-mono text-[10px] text-status-success">
              {formatCHF(baseline.historicalLow)}
            </span>
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-carbon-600/60">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                style={{
                  width: `${position}%`,
                  background: `linear-gradient(90deg, ${meta.color}cc, ${meta.color})`,
                }}
              />
              {range > 0 && (
                <div
                  className="absolute top-0 h-full w-px bg-carbon-300/40"
                  style={{
                    left: `${Math.max(0, Math.min(100, ((baseline.msrp - baseline.typicalRetail) / range) * 100))}%`,
                  }}
                  title={`Typical: ${formatCHF(baseline.typicalRetail)}`}
                />
              )}
            </div>
            <span className="w-14 font-mono text-[10px]" style={{ color: "var(--muted)" }}>
              {formatCHF(baseline.msrp)}
            </span>
          </div>
        </div>

        {/* Right: best price */}
        <div className="flex-shrink-0 text-right">
          <div className="text-base font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
            {formatCHF(bestPrice)}
          </div>
          {pctOff > 0 && (
            <div className="text-[10px] font-medium tabular-nums" style={{ color: meta.color }}>
              -{pctOff}% off
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BuyWaitSignal;
