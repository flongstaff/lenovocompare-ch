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
  critical: { bg: "bg-red-900/30", border: "border-red-700", icon: AlertTriangle, iconColor: "text-red-400" },
  warning: { bg: "bg-yellow-900/20", border: "border-yellow-700", icon: TrendingUp, iconColor: "text-yellow-400" },
  good: { bg: "bg-green-900/20", border: "border-green-700", icon: Info, iconColor: "text-green-400" },
} as const;

const MarketAlertBanner = ({ severity, headline, detail, updatedDate, componentMarkets }: MarketAlertBannerProps) => {
  const [expanded, setExpanded] = useState(false);
  const styles = severityStyles[severity];
  const Icon = styles.icon;

  return (
    <div className={`rounded-lg border ${styles.border} ${styles.bg} p-4`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-3 text-left"
        aria-expanded={expanded}
      >
        <Icon size={20} className={`mt-0.5 flex-shrink-0 ${styles.iconColor}`} />
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
                    className="rounded border px-3 py-2"
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
