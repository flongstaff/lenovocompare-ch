"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip, LabelList } from "recharts";

interface BenchmarkItem {
  readonly label: string;
  readonly value: number;
  readonly color?: string;
}

interface BenchmarkBarProps {
  readonly items: readonly BenchmarkItem[];
  readonly maxValue?: number;
}

const DEFAULT_COLOR = "#4589ff";

const BenchmarkBar = ({ items, maxValue = 100 }: BenchmarkBarProps) => (
  <div className="w-full" style={{ height: items.length * 36 + 16 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={[...items]} layout="vertical" margin={{ left: 0, right: 20, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="#2a2a2a" horizontal={false} />
        <XAxis type="number" domain={[0, maxValue]} tick={{ fill: "#a8a8a8", fontSize: 11 }} stroke="#393939" />
        <YAxis type="category" dataKey="label" width={85} tick={{ fill: "#a8a8a8", fontSize: 11 }} stroke="#393939" />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload as BenchmarkItem;
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
                <p style={{ color: "#f4f4f4", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{d.label}</p>
                <p style={{ color: "#f4f4f4", fontSize: 13, fontWeight: 600, fontFamily: "monospace" }}>
                  {d.value}/{maxValue}
                </p>
              </div>
            );
          }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
          {items.map((item, i) => (
            <Cell key={i} fill={item.color ?? DEFAULT_COLOR} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            style={{ fill: "#f4f4f4", fontSize: 11, fontWeight: 600, fontFamily: "monospace" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BenchmarkBar;
