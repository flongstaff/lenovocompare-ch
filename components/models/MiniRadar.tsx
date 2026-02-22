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

/** 5-point radar as pure SVG — no recharts dependency */
export const MiniRadar = ({ scores, color }: MiniRadarProps) => {
  const cx = 40;
  const cy = 40;
  const r = 30;
  const axes = [scores.perf, scores.display, scores.memory, scores.gpu, scores.portability];

  const point = (i: number, value: number): [number, number] => {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const scaled = (value / 100) * r;
    return [cx + scaled * Math.cos(angle), cy + scaled * Math.sin(angle)];
  };

  const gridPoints = (radius: number) =>
    Array.from({ length: 5 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
    }).join(" ");

  const dataPoints = axes.map((v, i) => point(i, v));
  const polygon = dataPoints.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <svg width={80} height={80} viewBox="0 0 80 80" role="img" aria-label="Performance radar">
      {/* Grid rings */}
      <polygon points={gridPoints(r)} fill="none" stroke="#393939" strokeWidth={0.5} />
      <polygon points={gridPoints(r * 0.5)} fill="none" stroke="#393939" strokeWidth={0.5} />
      {/* Axis lines */}
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(angle)}
            y2={cy + r * Math.sin(angle)}
            stroke="#393939"
            strokeWidth={0.5}
          />
        );
      })}
      {/* Data polygon */}
      <polygon points={polygon} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1.5} />
    </svg>
  );
};
