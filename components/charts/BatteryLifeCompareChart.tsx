"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { Laptop } from "@/lib/types";
import { getModelBenchmarks } from "@/lib/scoring";
import { COMPARE_COLORS } from "@/lib/constants";
import { shortName } from "@/lib/formatters";

interface BatteryLifeCompareChartProps {
  readonly models: readonly Laptop[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#262626",
        border: "1px solid #525252",
        borderRadius: 0,
        padding: "8px 12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
      }}
    >
      <p style={{ color: "#f4f4f4", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <div
          key={p.name}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#c6c6c6", padding: "2px 0" }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 0, background: p.color, flexShrink: 0 }} />
          <span>{p.name}</span>
          <span style={{ marginLeft: "auto", fontWeight: 600, color: "#f4f4f4", fontFamily: "monospace" }}>
            {p.value}h
          </span>
        </div>
      ))}
    </div>
  );
};

const BatteryLifeCompareChart = ({ models }: BatteryLifeCompareChartProps) => {
  const data = [
    {
      metric: "Office Hours",
      ...Object.fromEntries(models.map((m, i) => [`model${i}`, getModelBenchmarks(m.id)?.battery?.officeHours ?? 0])),
    },
    {
      metric: "Video Hours",
      ...Object.fromEntries(models.map((m, i) => [`model${i}`, getModelBenchmarks(m.id)?.battery?.videoHours ?? 0])),
    },
  ];

  const chartHeight = Math.max(120, models.length * 28 + 60);
  const barSize = models.length >= 4 ? 6 : models.length >= 3 ? 7 : 8;

  return (
    <div className="w-full">
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 20, top: 5, bottom: 5 }}
            barGap={1}
            barCategoryGap="25%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#393939" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#a8a8a8", fontSize: 10 }} stroke="#393939" />
            <YAxis
              type="category"
              dataKey="metric"
              width={90}
              tick={{ fill: "#f4f4f4", fontSize: 11, fontWeight: 500 }}
              stroke="#393939"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            {models.map((m, i) => (
              <Bar
                key={m.id}
                dataKey={`model${i}`}
                name={shortName(m.name)}
                fill={COMPARE_COLORS[i % COMPARE_COLORS.length]}
                radius={0}
                barSize={barSize}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-3 pb-1 pt-1">
        {models.map((m, i) => (
          <div key={m.id} className="flex items-center gap-1.5 text-xs" style={{ color: "#f4f4f4" }}>
            <span
              className="inline-block h-2.5 w-2.5"
              style={{ background: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
            />
            {shortName(m.name)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatteryLifeCompareChart;
