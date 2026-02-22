"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Cell,
  Tooltip,
  LabelList,
} from "recharts";
import type { GpuFpsEstimate } from "@/lib/types";

interface FpsChartProps {
  readonly estimates: readonly GpuFpsEstimate[];
}

const getBarColor = (fps: number): string => {
  if (fps >= 60) return "#42be65";
  if (fps >= 30) return "#f1c21b";
  return "#ff832b";
};

const abbreviateRes = (res: string): string => {
  if (res.includes("1920") || res.includes("1080")) return "1080p";
  if (res.includes("2560") || res.includes("1440")) return "1440p";
  if (res.includes("3840") || res.includes("2160")) return "4K";
  return res;
};

const getPlayability = (fps: number): string => {
  if (fps >= 60) return "Smooth";
  if (fps >= 30) return "Playable";
  return "Unplayable";
};

const FpsChart = ({ estimates }: FpsChartProps) => {
  const data = estimates.map((e) => ({
    name: `${e.title} (${abbreviateRes(e.resolution)} ${e.settings})`,
    fps: e.fps,
    title: e.title,
    resolution: e.resolution,
    settings: e.settings,
  }));

  return (
    <div>
      <div className="mt-2 w-full" style={{ height: data.length * 45 + 40 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 40, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#393939" horizontal={false} />
            <XAxis type="number" domain={[0, "auto"]} tick={{ fill: "#a8a8a8", fontSize: 11 }} stroke="#525252" />
            <YAxis type="category" dataKey="name" width={200} tick={{ fill: "#a8a8a8", fontSize: 11 }} stroke="#525252" />
            <ReferenceLine
              x={30}
              stroke="#ff832b"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: "30", fill: "#ff832b", fontSize: 10, position: "top" }}
            />
            <ReferenceLine
              x={60}
              stroke="#42be65"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: "60", fill: "#42be65", fontSize: 10, position: "top" }}
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
                      borderRadius: 6,
                      padding: "8px 12px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                    }}
                  >
                    <p style={{ color: "#f4f4f4", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{d.title}</p>
                    <p style={{ color: "#a8a8a8", fontSize: 11, marginBottom: 4 }}>
                      {d.resolution} · {d.settings}
                    </p>
                    <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
                      <span style={{ color: "#f4f4f4", fontFamily: "monospace", fontWeight: 600 }}>{d.fps} FPS</span>
                      <span style={{ color: getBarColor(d.fps) }}>{getPlayability(d.fps)}</span>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="fps" radius={[0, 4, 4, 0]} barSize={18}>
              {data.map((d, i) => (
                <Cell key={i} fill={getBarColor(d.fps)} />
              ))}
              <LabelList
                dataKey="fps"
                position="right"
                style={{ fill: "#f4f4f4", fontSize: 10, fontWeight: 600, fontFamily: "monospace" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mb-2 mt-1 flex items-center gap-4 text-[10px]" style={{ color: "#a8a8a8" }}>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: "#ff832b" }} /> &lt;30 FPS
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: "#f1c21b" }} /> 30-59 FPS
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: "#42be65" }} /> 60+ FPS
        </span>
      </div>
    </div>
  );
};

export default FpsChart;
