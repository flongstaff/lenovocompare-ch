"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from "recharts";
import type { PerformanceDimensions } from "@/lib/types";
import { COMPARE_COLORS, COMPARE_DASHES } from "@/lib/constants";
import { shortName } from "@/lib/formatters";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { PolarBar } from "@/components/charts/PolarBar";

interface ModelData {
  readonly name: string;
  readonly dimensions: PerformanceDimensions;
}

interface PerformanceRadarProps {
  readonly models: readonly ModelData[];
}

const DIMENSION_LABELS: Record<keyof PerformanceDimensions, string> = {
  cpu: "CPU",
  gpu: "GPU",
  memory: "Memory",
  portability: "Portable",
  display: "Display",
  connectivity: "Connect",
};

const DIMENSION_HINTS: Record<keyof PerformanceDimensions, string> = {
  cpu: "Processing power (single + multi-core)",
  gpu: "Graphics capability and gaming potential",
  memory: "RAM size, type, upgradability & storage",
  portability: "Weight and battery capacity",
  display: "Resolution, panel type, brightness & refresh",
  connectivity: "Ports, Thunderbolt, Wi-Fi & Bluetooth",
};

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
    <ChartTooltip>
      <p style={{ color: "#f4f4f4", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <div
          key={p.name}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#c6c6c6", padding: "1px 0" }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
          <span>{p.name}</span>
          <span style={{ marginLeft: "auto", fontWeight: 600, color: "#f4f4f4", fontFamily: "monospace" }}>
            {p.value}
          </span>
        </div>
      ))}
    </ChartTooltip>
  );
};

const PerformanceRadar = ({ models }: PerformanceRadarProps) => {
  if (models.length === 1) {
    return (
      <div className="flex w-full justify-center">
        <PolarBar scores={models[0].dimensions} />
      </div>
    );
  }

  const axes = Object.keys(DIMENSION_LABELS) as (keyof PerformanceDimensions)[];
  const data = axes.map((key) => {
    const entry: Record<string, string | number> = { dimension: DIMENSION_LABELS[key] };
    models.forEach((m, i) => {
      entry[`model${i}`] = m.dimensions[key];
    });
    return entry;
  });

  const compact = models.length === 1;
  const chartHeight = compact ? 150 : 210;
  const outerRadius = compact ? "55%" : "62%";
  const margin = compact ? { top: 12, right: 35, bottom: 12, left: 35 } : { top: 18, right: 42, bottom: 18, left: 42 };

  return (
    <div className="w-full">
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius={outerRadius} margin={margin}>
            <PolarGrid stroke="#393939" strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="dimension" tick={{ fill: "#f4f4f4", fontSize: 12, fontWeight: 500 }} />
            <Tooltip content={<CustomTooltip />} />
            {models.map((m, i) => (
              <Radar
                key={m.name}
                name={shortName(m.name)}
                dataKey={`model${i}`}
                stroke={COMPARE_COLORS[i % COMPARE_COLORS.length]}
                fill={COMPARE_COLORS[i % COMPARE_COLORS.length]}
                fillOpacity={0.12}
                strokeWidth={2}
                strokeDasharray={models.length > 1 ? COMPARE_DASHES[i % COMPARE_DASHES.length] : undefined}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {models.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3 pb-2 pt-1">
          {models.map((m, i) => (
            <div key={m.name} className="flex items-center gap-1.5 text-xs" style={{ color: "#f4f4f4" }}>
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ background: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
              />
              {shortName(m.name)}
            </div>
          ))}
        </div>
      )}
      {models.length > 1 && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2" style={{ borderTop: "1px solid #393939" }}>
          {axes.map((key) => {
            const scores = models.map((m) => m.dimensions[key]);
            if (scores.length === 0) return null;
            const maxScore = Math.max(...scores);
            const leadIdx = scores.indexOf(maxScore);
            const tied = scores.filter((s) => s === maxScore).length > 1;
            return (
              <div key={key} className="flex items-start gap-1.5 py-0.5 text-[10px]">
                <span className="shrink-0 font-semibold" style={{ color: "#f4f4f4", minWidth: 48 }}>
                  {DIMENSION_LABELS[key]}
                </span>
                <span style={{ color: "#a8a8a8" }}>
                  {DIMENSION_HINTS[key]}
                  {!tied && (
                    <span style={{ color: COMPARE_COLORS[leadIdx % COMPARE_COLORS.length] }}>
                      {" "}
                      · {shortName(models[leadIdx].name)} leads ({maxScore})
                    </span>
                  )}
                  {tied && <span style={{ color: "#c6c6c6" }}> · Tied ({maxScore})</span>}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PerformanceRadar;
