"use client";

import type { Laptop } from "@/lib/types";
import { getModelBenchmarks, getCpuRawBenchmarks, getGpuBenchmark } from "@/lib/scoring";
import dynamic from "next/dynamic";

const ThermalGauge = dynamic(() => import("@/components/charts/ThermalGauge"), { ssr: false });
const BatteryCompareBar = dynamic(() => import("@/components/charts/BatteryCompareBar"), { ssr: false });

interface BenchmarksSectionProps {
  readonly model: Laptop;
}

/**
 * Lineup-aware thermal thresholds — workstations (P series) and gaming (Legion) run hotter by design.
 * Returns { warm, hot } keyboard temp thresholds in °C.
 */
const getThermalThresholds = (model: Laptop): { warm: number; hot: number } => {
  if (model.lineup === "Legion") return { warm: 44, hot: 50 };
  if (model.series === "P") return { warm: 42, hot: 48 };
  return { warm: 40, hot: 44 };
};

/** Lineup-aware fan noise thresholds in dB */
const getNoiseThresholds = (model: Laptop): { moderate: number; loud: number } => {
  if (model.lineup === "Legion") return { moderate: 42, loud: 50 };
  if (model.series === "P") return { moderate: 40, loud: 48 };
  return { moderate: 38, loud: 45 };
};

const StatBox = ({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number | string;
  unit?: string;
  color?: string;
}) => (
  <div className="rounded p-3" style={{ background: "var(--surface)" }}>
    <div className="mb-1 text-xs" style={{ color: "var(--muted)" }}>
      {label}
    </div>
    <div className="font-mono text-lg font-semibold" style={{ color: color ?? "var(--foreground)" }}>
      {value}
      {unit && (
        <span className="ml-0.5 text-xs font-normal" style={{ color: "var(--muted)" }}>
          {unit}
        </span>
      )}
    </div>
  </div>
);

const MiniBar = ({
  label,
  value,
  maxValue,
  color,
  unit,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  unit?: string;
}) => {
  const pct = Math.min(100, (value / maxValue) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span style={{ color: "var(--muted)" }}>{label}</span>
        <span className="font-mono" style={{ color }}>
          {value.toLocaleString()}
          {unit && ` ${unit}`}
        </span>
      </div>
      <div className="h-2 rounded-full" style={{ background: "var(--surface)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
};

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
      {title}
    </h4>
    {children}
  </div>
);

const SOURCE_DISPLAY: Record<string, string> = {
  notebookcheck: "NotebookCheck",
  geekbench: "Geekbench",
  tomshardware: "Tom's Hardware",
  jarrodtech: "Jarrod'sTech",
  justjoshtech: "JustJoshTech",
  community: "Community",
};

const BenchmarksSection = ({ model }: BenchmarksSectionProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used in JSX conditionals below
  const thermalT = getThermalThresholds(model);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used in JSX conditionals below
  const noiseT = getNoiseThresholds(model);
  const chassisBench = getModelBenchmarks(model.id);
  const cpuRaw = getCpuRawBenchmarks(model.processor.name);
  const gpuBench = getGpuBenchmark(model.gpu.name);

  // Hide entirely if no data at all
  const hasAnyCpuRaw = cpuRaw && (cpuRaw.cinebench2024Single || cpuRaw.geekbench6Single);
  const hasAnyGpuExtra = gpuBench && (gpuBench.timeSpyScore || gpuBench.cyberpunk1080pUltraFps);
  if (!chassisBench && !hasAnyCpuRaw && !hasAnyGpuExtra) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
        Benchmarks
      </h3>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* CPU Raw Benchmarks */}
        {hasAnyCpuRaw && (
          <SubSection title="CPU Performance">
            <div className="space-y-2">
              {cpuRaw.cinebench2024Single && (
                <MiniBar
                  label="Cinebench 2024 Single"
                  value={cpuRaw.cinebench2024Single}
                  maxValue={150}
                  color="#4589ff"
                />
              )}
              {cpuRaw.cinebench2024Multi && (
                <MiniBar
                  label="Cinebench 2024 Multi"
                  value={cpuRaw.cinebench2024Multi}
                  maxValue={1400}
                  color="#0f62fe"
                />
              )}
              {cpuRaw.geekbench6Single && (
                <MiniBar label="Geekbench 6 Single" value={cpuRaw.geekbench6Single} maxValue={3200} color="#ee5396" />
              )}
              {cpuRaw.geekbench6Multi && (
                <MiniBar label="Geekbench 6 Multi" value={cpuRaw.geekbench6Multi} maxValue={21000} color="#be95ff" />
              )}
            </div>
          </SubSection>
        )}

        {/* Power & Thermals */}
        {(cpuRaw?.typicalTdpAvg || model.processor.tdp || chassisBench?.thermals || chassisBench?.fanNoise) && (
          <SubSection title="Power & Thermals">
            <div className="mb-3 grid grid-cols-2 gap-2">
              {cpuRaw?.typicalTdpAvg ? (
                <>
                  <StatBox label="Avg TDP" value={cpuRaw.typicalTdpAvg} unit="W" color="#f1c21b" />
                  {cpuRaw.typicalTdpMax && (
                    <StatBox label="Max TDP" value={cpuRaw.typicalTdpMax} unit="W" color="#ff832b" />
                  )}
                </>
              ) : (
                <StatBox label="Rated TDP" value={model.processor.tdp} unit="W" color="#f1c21b" />
              )}
            </div>
            {chassisBench?.thermals && (
              <>
                <ThermalGauge
                  keyboardMaxC={chassisBench.thermals.keyboardMaxC}
                  undersideMaxC={chassisBench.thermals.undersideMaxC}
                />
                <div className="mt-1 flex gap-2">
                  <span
                    className="rounded px-1 py-0.5 text-[10px]"
                    style={{
                      background:
                        chassisBench.thermals.keyboardMaxC > thermalT.hot
                          ? "#da1e2820"
                          : chassisBench.thermals.keyboardMaxC > thermalT.warm
                            ? "#f1c21b20"
                            : "#42be6520",
                      color:
                        chassisBench.thermals.keyboardMaxC > thermalT.hot
                          ? "#da1e28"
                          : chassisBench.thermals.keyboardMaxC > thermalT.warm
                            ? "#f1c21b"
                            : "#42be65",
                    }}
                  >
                    {chassisBench.thermals.keyboardMaxC > thermalT.hot
                      ? "Hot under load"
                      : chassisBench.thermals.keyboardMaxC > thermalT.warm
                        ? "Warm under load"
                        : "Cool under load"}
                    {(model.lineup === "Legion" || model.series === "P") && (
                      <span className="ml-1 text-[9px] opacity-70">
                        (normal for {model.lineup === "Legion" ? "gaming" : "workstation"})
                      </span>
                    )}
                  </span>
                </div>
              </>
            )}
            {chassisBench?.fanNoise && (
              <div className="mt-2">
                <StatBox
                  label="Fan Noise (Max Load)"
                  value={chassisBench.fanNoise}
                  unit="dB"
                  color={chassisBench.fanNoise > noiseT.loud ? "#da1e28" : chassisBench.fanNoise > noiseT.moderate ? "#f1c21b" : "#42be65"}
                />
                <div className="mt-1">
                  <span
                    className="rounded px-1 py-0.5 text-[10px]"
                    style={{
                      background:
                        chassisBench.fanNoise > noiseT.loud
                          ? "#da1e2820"
                          : chassisBench.fanNoise > noiseT.moderate
                            ? "#f1c21b20"
                            : "#42be6520",
                      color:
                        chassisBench.fanNoise > noiseT.loud ? "#da1e28" : chassisBench.fanNoise > noiseT.moderate ? "#f1c21b" : "#42be65",
                    }}
                  >
                    {chassisBench.fanNoise > noiseT.loud
                      ? "Loud — noticeable in quiet rooms"
                      : chassisBench.fanNoise > noiseT.moderate
                        ? "Moderate — audible under load"
                        : "Quiet — barely noticeable"}
                  </span>
                </div>
              </div>
            )}
          </SubSection>
        )}

        {/* Battery Life */}
        {chassisBench?.battery && (
          <SubSection title="Battery Life">
            <div className="grid grid-cols-2 gap-2">
              <StatBox label="Office / Web" value={chassisBench.battery.officeHours} unit="hrs" color="#42be65" />
              <StatBox label="Video Playback" value={chassisBench.battery.videoHours} unit="hrs" color="#08bdba" />
            </div>
          </SubSection>
        )}

        {/* Battery Performance */}
        {chassisBench?.batteryPerformance && (
          <SubSection title="Battery Performance">
            <BatteryCompareBar
              pluggedIn={chassisBench.batteryPerformance.pluggedIn}
              onBattery={chassisBench.batteryPerformance.onBattery}
            />
          </SubSection>
        )}

        {/* GPU Extras */}
        {hasAnyGpuExtra && (
          <SubSection title="GPU Benchmarks">
            <div className="space-y-2">
              {gpuBench.timeSpyScore && (
                <MiniBar label="3DMark Time Spy" value={gpuBench.timeSpyScore} maxValue={22000} color="#42be65" />
              )}
              {gpuBench.cyberpunk1080pUltraFps && (
                <MiniBar
                  label="Cyberpunk 2077 1080p Ultra"
                  value={gpuBench.cyberpunk1080pUltraFps}
                  maxValue={100}
                  color="#ee5396"
                  unit="FPS"
                />
              )}
            </div>
          </SubSection>
        )}

        {/* Storage Speed */}
        {chassisBench?.ssdSpeed && (
          <SubSection title="Storage Speed">
            <div className="space-y-2">
              <MiniBar
                label="Sequential Read"
                value={chassisBench.ssdSpeed.seqReadMBs}
                maxValue={8000}
                color="#4589ff"
                unit="MB/s"
              />
              <MiniBar
                label="Sequential Write"
                value={chassisBench.ssdSpeed.seqWriteMBs}
                maxValue={7000}
                color="#0f62fe"
                unit="MB/s"
              />
            </div>
          </SubSection>
        )}

        {/* Memory Bandwidth */}
        {chassisBench?.memoryBandwidthGBs && (
          <SubSection title="Memory Bandwidth">
            <MiniBar
              label="Bandwidth"
              value={chassisBench.memoryBandwidthGBs}
              maxValue={100}
              color="#be95ff"
              unit="GB/s"
            />
          </SubSection>
        )}

        {/* Display */}
        {chassisBench?.displayBrightness && (
          <SubSection title="Display (Measured)">
            <div className="grid grid-cols-2 gap-2">
              <StatBox label="Measured" value={chassisBench.displayBrightness} unit="nits" color="#f1c21b" />
              <StatBox label="Spec" value={model.display.nits} unit="nits" color="var(--muted)" />
            </div>
          </SubSection>
        )}

        {/* Content Creation */}
        {(chassisBench?.pugetPremiere || chassisBench?.pugetDavinci) && (
          <SubSection title="Content Creation">
            <div className="grid grid-cols-2 gap-2">
              {chassisBench.pugetPremiere && (
                <StatBox label="Puget Premiere" value={chassisBench.pugetPremiere} color="#be95ff" />
              )}
              {chassisBench.pugetDavinci && (
                <StatBox label="Puget DaVinci" value={chassisBench.pugetDavinci} color="#6929c4" />
              )}
            </div>
          </SubSection>
        )}

        {/* Weight with Charger */}
        {chassisBench?.weightWithChargerGrams && (
          <SubSection title="Travel Weight">
            <div className="grid grid-cols-2 gap-2">
              <StatBox label="Laptop Only" value={(model.weight * 1000).toFixed(0)} unit="g" />
              <StatBox label="+ Charger" value={chassisBench.weightWithChargerGrams} unit="g" color="#f1c21b" />
            </div>
          </SubSection>
        )}
      </div>

      {/* Sources */}
      {chassisBench?.sources && chassisBench.sources.length > 0 && (
        <div className="pt-2 text-xs" style={{ color: "var(--muted)", borderTop: "1px solid var(--border-subtle)" }}>
          Sources:{" "}
          {chassisBench.sourceUrls && chassisBench.sourceUrls.length > 0
            ? chassisBench.sources.map((src, i) => {
                const url = chassisBench.sourceUrls?.[i];
                const display = SOURCE_DISPLAY[src] ?? src;
                return (
                  <span key={src}>
                    {i > 0 && ", "}
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: "var(--accent-light)" }}
                      >
                        {display}
                      </a>
                    ) : (
                      display
                    )}
                  </span>
                );
              })
            : chassisBench.sources.map((s) => SOURCE_DISPLAY[s] ?? s).join(", ")}
        </div>
      )}
    </div>
  );
};

export default BenchmarksSection;
