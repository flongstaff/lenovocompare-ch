"use client";
import { RadarChart, PolarGrid, Radar, ResponsiveContainer } from "recharts";

interface MiniRadarProps {
  readonly scores: {
    readonly perf: number;
    readonly display: number;
    readonly memory: number;
    readonly gpu: number;
    readonly portability: number;
  };
  readonly color: string;
}

export const MiniRadar = ({ scores, color }: MiniRadarProps) => {
  const data = [
    { axis: "P", value: scores.perf },
    { axis: "D", value: scores.display },
    { axis: "M", value: scores.memory },
    { axis: "G", value: scores.gpu },
    { axis: "B", value: scores.portability },
  ];

  return (
    <ResponsiveContainer width={80} height={80}>
      <RadarChart outerRadius="75%" data={data}>
        <PolarGrid stroke="#393939" />
        <Radar
          dataKey="value"
          stroke={color}
          fill={color}
          fillOpacity={0.15}
          strokeWidth={1.5}
          dot={false}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
