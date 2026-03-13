"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, LabelList } from "recharts";
import type { Laptop } from "@/lib/types";
import { getGpuScore, getGamingTier } from "@/lib/scoring";
import { COMPARE_COLORS } from "@/lib/constants";
import { shortName } from "@/lib/formatters";

interface GpuCompareChartProps {
  readonly models: readonly Laptop[];
}

const TIER_LABELS: Record<string, string> = {
  Heavy: "Heavy Gaming",
  Medium: "Medium Gaming",
  Light: "Light Gaming",
  None: "No Gaming",
};

const TIER_ABBREV: Record<string, string> = {
  Heavy: "H",
  Medium: "M",
  Light: "L",
  None: "—",
};

const GpuCompareChart = ({ models }: GpuCompareChartProps) => {
  const data = models.map((m, i) => {
    const tier = getGamingTier(m.gpu.name);
    return {
      name: shortName(m.name),
      score: getGpuScore(m.gpu.name),
      tier,
      tierLabel: TIER_LABELS[tier] ?? tier,
      gpu: m.gpu.name,
      color: COMPARE_COLORS[i % COMPARE_COLORS.length],
    };
  });

  const chartHeight = Math.max(100, models.length * 36 + 30);
  const barSize = models.length >= 4 ? 10 : models.length >= 3 ? 12 : 16;

  const modelNames = models.map((m) => shortName(m.name)).join(" vs ");

  return (
    <div className="w-full" aria-label={`GPU comparison chart: ${modelNames}`}>
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#393939" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: "#a8a8a8", fontSize: 10 }} stroke="#393939" />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fill: "#f4f4f4", fontSize: 11 }}
              stroke="#393939"
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as (typeof data)[number];
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
                    <p style={{ color: "#f4f4f4", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{d.name}</p>
                    <p style={{ color: "#a8a8a8", fontSize: 11, marginBottom: 4 }}>{d.gpu}</p>
                    <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
                      <span style={{ color: "#f4f4f4", fontFamily: "monospace", fontWeight: 600 }}>{d.score}/100</span>
                      <span
                        style={{
                          color:
                            d.tier === "Heavy"
                              ? "#42be65"
                              : d.tier === "Medium"
                                ? "#f1c21b"
                                : d.tier === "Light"
                                  ? "#ff832b"
                                  : "#6f6f6f",
                        }}
                      >
                        {d.tierLabel}
                      </span>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="score" radius={0} barSize={barSize}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
              <LabelList
                dataKey="tier"
                position="right"
                formatter={(tier: unknown) => TIER_ABBREV[String(tier)] ?? String(tier)}
                style={{ fill: "#a8a8a8", fontSize: 10, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <details className="sr-only">
        <summary>View data table</summary>
        <table>
          <caption>GPU scores: {modelNames}</caption>
          <thead>
            <tr>
              <th scope="col">Model</th>
              <th scope="col">GPU</th>
              <th scope="col">Score</th>
              <th scope="col">Gaming Tier</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={entry.name}>
                <td>{entry.name}</td>
                <td>{entry.gpu}</td>
                <td>{entry.score}/100</td>
                <td>{entry.tierLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
};

export default GpuCompareChart;
