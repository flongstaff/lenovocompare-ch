"use client";

interface ThermalProfileBarProps {
  readonly keyboardMaxC: number;
  readonly fanNoiseDbA?: number;
  readonly lineup: string;
}

const getTempColor = (temp: number): string => {
  if (temp <= 38) return "#42be65";
  if (temp <= 44) return "#f1c21b";
  if (temp <= 50) return "#ff832b";
  return "#fa4d56";
};

export const ThermalProfileBar = ({
  keyboardMaxC,
  fanNoiseDbA,
}: ThermalProfileBarProps) => {
  const pct = Math.min(100, Math.max(0, ((keyboardMaxC - 30) / 25) * 100));
  const color = getTempColor(keyboardMaxC);

  return (
    <div className="flex flex-col gap-1">
      {/* Temperature value above bar */}
      <div className="relative h-5" style={{ paddingLeft: `${pct}%` }}>
        <span
          className="absolute -translate-x-1/2 font-mono text-xs font-medium"
          style={{ left: `${pct}%`, color }}
        >
          {keyboardMaxC}°C
        </span>
      </div>

      {/* Pointer + gradient bar */}
      <div className="relative">
        {/* Pointer triangle */}
        <div
          className="absolute -top-[6px] -translate-x-1/2"
          style={{ left: `${pct}%` }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: "6px solid #f4f4f4",
            }}
          />
        </div>

        {/* Gradient track */}
        <div
          className="h-3 w-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #42be65, #f1c21b, #ff832b, #fa4d56)",
          }}
        />
      </div>

      {/* Zone labels */}
      <div className="flex justify-between text-xs font-medium">
        <span style={{ color: "#42be65" }}>Cool</span>
        <span style={{ color: "#f1c21b" }}>Warm</span>
        <span style={{ color: "#ff832b" }}>Hot</span>
      </div>

      {/* Fan noise */}
      {fanNoiseDbA != null && (
        <p className="mt-0.5 font-mono text-xs text-[#6f6f6f]">
          Fan: {fanNoiseDbA} dB(A)
        </p>
      )}
    </div>
  );
};
