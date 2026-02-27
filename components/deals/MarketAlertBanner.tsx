"use client";

import { useState } from "react";
import { AlertTriangle, TrendingUp, ChevronDown, ChevronUp, Info } from "lucide-react";
import type { ComponentMarket } from "@/lib/types";
import { getTrendMeta } from "@/lib/deals";

interface MarketAlertBannerProps {
  readonly severity: "warning" | "critical" | "good";
  readonly headline: string;
  readonly detail: string;
  readonly updatedDate: string;
  readonly componentMarkets: readonly ComponentMarket[];
}

const severityStyles = {
  critical: {
    icon: AlertTriangle,
    style: {
      background: "color-mix(in srgb, var(--status-warning) 15%, transparent)",
      borderColor: "var(--status-warning)",
    },
  },
  warning: {
    icon: TrendingUp,
    style: {
      background: "color-mix(in srgb, var(--status-warning) 8%, transparent)",
      borderColor: "var(--status-warning)",
    },
  },
  good: {
    icon: Info,
    style: {
      background: "color-mix(in srgb, var(--status-success) 12%, transparent)",
      borderColor: "var(--status-success)",
    },
  },
} as const;

const MarketAlertBanner = ({ severity, headline, detail, updatedDate, componentMarkets }: MarketAlertBannerProps) => {
  const [expanded, setExpanded] = useState(false);
  const styles = severityStyles[severity];
  const Icon = styles.icon;

  return (
    <div className="border p-4" style={styles.style}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-3 text-left"
        aria-expanded={expanded}
      >
        <Icon size={20} className="mt-0.5 flex-shrink-0" style={{ color: styles.style.borderColor }} />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {headline}
          </h2>
          <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
            Updated {updatedDate}
          </p>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="mt-1 flex-shrink-0" style={{ color: "var(--muted)" }} />
        ) : (
          <ChevronDown size={16} className="mt-1 flex-shrink-0" style={{ color: "var(--muted)" }} />
        )}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 pl-8">
          <p className="text-sm" style={{ color: "var(--foreground)" }}>
            {detail}
          </p>
          {componentMarkets.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {componentMarkets.map((cm) => {
                const meta = getTrendMeta(cm.trend);
                return (
                  <div
                    key={cm.component}
                    className="border px-3 py-2"
                    style={{ borderColor: "var(--border-subtle)", background: "var(--surface-alt)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                        {cm.label}
                      </span>
                      <span className="font-mono text-xs" style={{ color: meta.color }}>
                        {meta.arrow} {cm.changePercent > 0 ? "+" : ""}
                        {cm.changePercent}%
                      </span>
                    </div>
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                      {cm.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketAlertBanner;
