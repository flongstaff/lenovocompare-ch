"use client";

interface ThermalProfileBarProps {
  readonly keyboardMaxC: number;
  readonly fanNoiseDbA?: number;
  readonly lineup: string; // reserved for lineup-aware thresholds
}

const getTempColor = (temp: number): string => {
  if (temp <= 38) return "#42be65";
  if (temp <= 44) return "#f1c21b";
  if (temp <= 50) return "#ff832b";
  return "#fa4d56";
};

export const ThermalProfileBar = ({ keyboardMaxC }: ThermalProfileBarProps) => {
  const pct = Math.min(100, Math.max(0, ((keyboardMaxC - 30) / 25) * 100));
  const labelPct = Math.min(92, Math.max(8, pct));
  const color = getTempColor(keyboardMaxC);

  return (
    <div className="flex flex-col gap-1">
      {/* Temperature value above bar */}
      <div className="relative h-5" style={{ paddingLeft: `${labelPct}%` }}>
        <span
          className="absolute -translate-x-1/2 font-mono text-xs font-medium"
          style={{ left: `${labelPct}%`, color }}
        >
          {keyboardMaxC}°C
        </span>
      </div>

      {/* Pointer + gradient bar */}
      <div className="relative">
        {/* Pointer triangle */}
        <div className="absolute -top-[6px] -translate-x-1/2" style={{ left: `${labelPct}%` }}>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: `6px solid ${color}`,
            }}
          />
        </div>

        {/* Gradient track */}
        <div
          className="h-3 w-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #42be65, #f1c21b, #ff832b, #fa4d56)",
          }}
        />
      </div>

      {/* Zone labels */}
      <div
        className="relative mb-1 mt-0.5 flex font-mono text-[9px] uppercase tracking-wider"
        style={{ height: "14px" }}
      >
        <span className="absolute left-0" style={{ color: "#42be65" }}>
          Cool
        </span>
        <span className="absolute left-[32%] -translate-x-1/2" style={{ color: "#f1c21b" }}>
          Warm
        </span>
        <span className="absolute left-[56%] -translate-x-1/2" style={{ color: "#ff832b" }}>
          Hot
        </span>
        <span className="absolute right-0 text-right" style={{ color: "#fa4d56" }}>
          Critical
        </span>
      </div>
    </div>
  );
};
