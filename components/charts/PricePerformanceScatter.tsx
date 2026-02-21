"use client";

import { useRouter } from "next/navigation";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ScatterDataPoint {
  readonly id: string;
  readonly name: string;
  readonly lineup: string;
  readonly price: number;
  readonly perf: number;
}

interface PricePerformanceScatterProps {
  readonly models: readonly ScatterDataPoint[];
}

const LINEUP_COLORS: Record<string, string> = {
  ThinkPad: "#0f62fe",
  "IdeaPad Pro": "#be95ff",
  Legion: "#42be65",
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: readonly { payload: ScatterDataPoint }[];
}) => {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded border px-3 py-2 text-xs" style={{ background: "#262626", borderColor: "#525252" }}>
      <p className="mb-1 font-medium text-carbon-100">{d.name}</p>
      <p className="text-carbon-400">
        CHF {d.price.toLocaleString("de-CH")} · Score {d.perf}
      </p>
    </div>
  );
};

export const PricePerformanceScatter = ({ models }: PricePerformanceScatterProps) => {
  const router = useRouter();

  const handleClick = (entry: ScatterDataPoint) => {
    router.push(`/model/${entry.id}`);
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid stroke="#393939" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="price"
            name="Price"
            tick={{ fill: "#a8a8a8", fontSize: 10 }}
            label={{
              value: "Price (CHF)",
              position: "insideBottom",
              offset: -10,
              fill: "#a8a8a8",
              fontSize: 11,
            }}
          />
          <YAxis
            type="number"
            dataKey="perf"
            name="Performance"
            domain={[0, 100]}
            tick={{ fill: "#a8a8a8", fontSize: 10 }}
            label={{
              value: "Performance",
              angle: -90,
              position: "insideLeft",
              offset: 5,
              fill: "#a8a8a8",
              fontSize: 11,
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3", stroke: "#525252" }} />
          <Scatter
            data={models as ScatterDataPoint[]}
            onClick={(data: { payload?: ScatterDataPoint }) => {
              if (data?.payload) handleClick(data.payload);
            }}
            cursor="pointer"
          >
            {models.map((entry) => (
              <Cell key={entry.id} fill={LINEUP_COLORS[entry.lineup] ?? "#a8a8a8"} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-4">
        {Object.entries(LINEUP_COLORS).map(([lineup, color]) => (
          <div key={lineup} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
            <span className="text-[10px] text-carbon-400">{lineup}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
