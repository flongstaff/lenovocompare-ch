"use client";

import type { ComponentMarket } from "@/lib/types";
import { getTrendMeta } from "@/lib/deals";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ComponentTrackerProps {
  readonly markets: readonly ComponentMarket[];
}

const trendIcons = {
  rising: TrendingUp,
  stable: Minus,
  falling: TrendingDown,
} as const;

const ComponentTracker = ({ markets }: ComponentTrackerProps) => (
  <div className="carbon-card p-4">
    <h3 className="mb-3 text-sm font-semibold" style={{ color: "var(--foreground)" }}>
      Component Market Tracker
    </h3>
    <div className="grid gap-3 sm:grid-cols-2">
      {markets.map((cm) => {
        const meta = getTrendMeta(cm.trend);
        const Icon = trendIcons[cm.trend];
        return (
          <div
            key={cm.component}
            className="border p-3"
            style={{ borderColor: "var(--border-subtle)", background: "var(--surface-alt)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {cm.label}
              </span>
              <div className="flex items-center gap-1.5">
                <Icon size={14} style={{ color: meta.color }} />
                <span className="font-mono text-sm font-bold" style={{ color: meta.color }}>
                  {cm.changePercent > 0 ? "+" : ""}
                  {cm.changePercent}%
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
              {cm.summary}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {cm.affectedTiers.map((tier) => (
                <span
                  key={tier}
                  className="px-1.5 py-0.5 text-xs"
                  style={{ background: "var(--carbon-700)", color: "var(--muted)" }}
                >
                  {tier}
                </span>
              ))}
            </div>
            {cm.source && (
              <p className="mt-2 text-xs italic" style={{ color: "var(--muted)" }}>
                Source: {cm.source}
              </p>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default ComponentTracker;
