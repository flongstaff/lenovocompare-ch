"use client";

import type { Laptop, PriceBaseline, BuySignal } from "@/lib/types";
import { formatCHF } from "@/lib/formatters";
import { getBuySignalMeta } from "@/lib/deals";

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

  return (
    <div
      className="flex items-center gap-3 rounded border px-3 py-2"
      style={{ borderColor: "var(--border-subtle)", background: "var(--surface-alt)" }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>
            {model.name}
          </span>
          <span
            className={`flex-shrink-0 rounded border px-1.5 py-0.5 text-xs font-semibold ${meta.bgClass} ${meta.textClass} ${meta.borderClass}`}
          >
            {meta.label}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="w-16 text-right font-mono text-xs text-green-400">{formatCHF(baseline.historicalLow)}</span>
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-carbon-600">
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ width: `${position}%`, background: meta.color }}
            />
            {range > 0 && (
              <div
                className="absolute top-0 h-2 w-0.5 bg-carbon-300 opacity-50"
                style={{
                  left: `${Math.max(0, Math.min(100, ((baseline.msrp - baseline.typicalRetail) / range) * 100))}%`,
                }}
                title={`Typical: ${formatCHF(baseline.typicalRetail)}`}
              />
            )}
          </div>
          <span className="w-16 font-mono text-xs" style={{ color: "var(--muted)" }}>
            {formatCHF(baseline.msrp)}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <div className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
          {formatCHF(bestPrice)}
        </div>
        <div className="text-xs" style={{ color: "var(--muted)" }}>
          best price
        </div>
      </div>
    </div>
  );
};

export default BuyWaitSignal;
