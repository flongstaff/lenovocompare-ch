"use client";

interface ThermalGaugeProps {
  readonly keyboardMaxC: number;
  readonly undersideMaxC: number;
}

const getColor = (temp: number): string => {
  if (temp < 35) return "#42be65";
  if (temp < 42) return "#f1c21b";
  if (temp < 48) return "#ff832b";
  return "#da1e28";
};

const getLabel = (temp: number): string => {
  if (temp < 35) return "Cool";
  if (temp < 42) return "Warm";
  if (temp < 48) return "Hot";
  return "Very Hot";
};

const ThermalBar = ({ label, temp }: { label: string; temp: number }) => {
  const color = getColor(temp);
  const pct = Math.min(100, (temp / 60) * 100);

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs" style={{ color: "var(--muted)" }}>
        {label}
      </span>
      <div className="h-5 flex-1 rounded" style={{ background: "var(--surface)" }}>
        <div
          className="flex h-full items-center justify-end rounded px-2 transition-all"
          style={{ width: `${pct}%`, background: `${color}30`, borderRight: `3px solid ${color}` }}
        >
          <span className="font-mono text-xs font-semibold" style={{ color }}>
            {temp}°C
          </span>
        </div>
      </div>
      <span className="w-16 text-right text-xs" style={{ color }}>
        {getLabel(temp)}
      </span>
    </div>
  );
};

const ThermalGauge = ({ keyboardMaxC, undersideMaxC }: ThermalGaugeProps) => (
  <div className="space-y-2">
    <ThermalBar label="Keyboard" temp={keyboardMaxC} />
    <ThermalBar label="Underside" temp={undersideMaxC} />
  </div>
);

export default ThermalGauge;
