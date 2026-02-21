"use client";

import type { Laptop } from "@/lib/types";
import { COMPARE_COLORS } from "@/lib/constants";
import { shortName } from "@/lib/formatters";

interface PortabilityCompareChartProps {
  readonly models: readonly Laptop[];
}

interface MetricDef {
  label: string;
  unit: string;
  getValue: (m: Laptop) => number;
  format: (v: number) => string;
  lowerIsBetter: boolean;
}

const METRICS: MetricDef[] = [
  {
    label: "Weight",
    unit: "kg",
    getValue: (m) => m.weight,
    format: (v) => `${v.toFixed(2)} kg`,
    lowerIsBetter: true,
  },
  {
    label: "Battery",
    unit: "Wh",
    getValue: (m) => m.battery.whr,
    format: (v) => `${v} Wh`,
    lowerIsBetter: false,
  },
  {
    label: "Display",
    unit: '"',
    getValue: (m) => m.display.size,
    format: (v) => `${v}"`,
    lowerIsBetter: false,
  },
];

const MetricRow = ({ metric, models }: { metric: MetricDef; models: readonly Laptop[] }) => {
  const values = models.map((m) => metric.getValue(m));
  if (values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  // Find best value index
  const bestIdx = metric.lowerIsBetter ? values.indexOf(min) : values.indexOf(max);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
          {metric.label}
        </span>
        <span className="text-[10px]" style={{ color: "var(--muted)" }}>
          {metric.lowerIsBetter ? "lower is better" : "higher is better"}
        </span>
      </div>
      {models.map((m, i) => {
        const val = values[i];
        // Normalize: bar width from 30% (min) to 100% (max) for visual contrast
        // Always: larger value = wider bar. The star marks the best value.
        const barPct = range === 0 ? 100 : 30 + ((val - min) / range) * 70;
        const isBest = i === bestIdx;

        return (
          <div key={m.id} className="flex items-center gap-2">
            <div className="relative h-5 flex-1 rounded-sm" style={{ background: "var(--surface)" }}>
              <div
                className="absolute inset-y-0 left-0 rounded-sm transition-all"
                style={{
                  width: `${range === 0 ? 100 : barPct}%`,
                  background: COMPARE_COLORS[i % COMPARE_COLORS.length],
                  opacity: isBest ? 1 : 0.6,
                }}
              />
              <span
                className="absolute inset-y-0 left-2 flex items-center text-[10px] font-medium"
                style={{ color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
              >
                {metric.format(val)}
                {isBest && range > 0 && <span className="ml-1 text-[9px] opacity-80">★</span>}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const PortabilityCompareChart = ({ models }: PortabilityCompareChartProps) => (
  <div className="w-full space-y-4">
    {METRICS.map((metric) => (
      <MetricRow key={metric.label} metric={metric} models={models} />
    ))}
    <div className="flex flex-wrap justify-center gap-3 pt-1">
      {models.map((m, i) => (
        <div key={m.id} className="flex items-center gap-1.5 text-xs" style={{ color: "#f4f4f4" }}>
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
          />
          {shortName(m.name)}
        </div>
      ))}
    </div>
  </div>
);

export default PortabilityCompareChart;
