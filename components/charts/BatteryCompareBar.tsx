"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip } from "recharts";

interface BatteryCompareBarProps {
  readonly pluggedIn: number;
  readonly onBattery: number;
  readonly label?: string;
}

const BatteryCompareBar = ({ pluggedIn, onBattery, label = "Cinebench 2024 Multi" }: BatteryCompareBarProps) => {
  const delta = pluggedIn > 0 ? Math.round(((pluggedIn - onBattery) / pluggedIn) * 100) : 0;
  const data = [
    { name: "Plugged In", score: pluggedIn },
    { name: "On Battery", score: onBattery },
  ];
  const colors = ["#0f62fe", "#6929c4"];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {label}
        </span>
        <span
          className="font-mono text-xs"
          style={{ color: delta > 5 ? "#da1e28" : delta > 0 ? "#f1c21b" : "#42be65" }}
        >
          {delta > 0 ? `-${delta}% on battery` : "No loss on battery"}
        </span>
      </div>
      <div style={{ height: 100 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#393939" horizontal={false} />
            <XAxis type="number" domain={[0, "auto"]} tick={{ fill: "#a8a8a8", fontSize: 11 }} stroke="#525252" />
            <YAxis
              type="category"
              dataKey="name"
              width={85}
              tick={{ fill: "#a8a8a8", fontSize: 11 }}
              stroke="#525252"
            />
            <Tooltip
              contentStyle={{ background: "#262626", border: "1px solid #525252", borderRadius: 4 }}
              labelStyle={{ color: "#f4f4f4" }}
              formatter={(value: unknown) => [String(value), "Score"]}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={18}>
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BatteryCompareBar;
