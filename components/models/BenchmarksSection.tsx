"use client";

import type { Laptop } from "@/lib/types";
import { getModelBenchmarks, getCpuRawBenchmarks, getGpuBenchmark } from "@/lib/scoring";
import { ThermalProfileBar } from "@/components/models/ThermalProfileBar";
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

/* ── Category accent colors ─────────────────────────────── */
const CAT_COLORS: Record<string, string> = {
  cpu: "#4589ff",
  gpu: "#42be65",
  thermal: "#ff832b",
  noise: "#f1c21b",
  battery: "#08bdba",
  battPerf: "#42be65",
  storage: "#4589ff",
  memory: "#be95ff",
  display: "#f1c21b",
  creative: "#be95ff",
  weight: "#a8a8a8",
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
  <div className="rounded-md border px-3 py-2.5" style={{ borderColor: "var(--border-subtle)", background: "#1e1e1e" }}>
    <div className="mb-0.5 text-xs tracking-wide" style={{ color: "var(--muted)" }}>
      {label}
    </div>
    <div className="font-mono text-lg font-semibold leading-tight" style={{ color: color ?? "var(--foreground)" }}>
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
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="truncate" style={{ color: "var(--muted)" }}>
          {label}
        </span>
        <span className="shrink-0 font-mono text-xs font-medium tabular-nums" style={{ color }}>
          {value.toLocaleString()}
          {unit && ` ${unit}`}
        </span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "#1e1e1e" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}66, ${color})` }}
        />
      </div>
    </div>
  );
};

const CategoryHeader = ({ title, accent }: { title: string; accent: string }) => (
  <div className="flex items-center gap-2">
    <div className="h-4 w-1 rounded-full" style={{ background: accent }} />
    <h4 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
      {title}
    </h4>
  </div>
);

const SubSection = ({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) => (
  <div
    className="flex flex-col gap-2.5 rounded-lg border p-3"
    style={{ borderColor: "var(--border-subtle)", background: "var(--surface)" }}
  >
    <CategoryHeader title={title} accent={accent} />
    {children}
  </div>
);

const Divider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 px-1">
    <div className="h-px flex-1" style={{ background: "var(--border-subtle)" }} />
    <span className="text-[10px] font-medium uppercase tracking-[0.15em]" style={{ color: "#6f6f6f" }}>
      {label}
    </span>
    <div className="h-px flex-1" style={{ background: "var(--border-subtle)" }} />
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

  // Group related sections for clearer visual hierarchy
  const hasThermals = cpuRaw?.typicalTdpAvg || model.processor.tdp || chassisBench?.thermals || chassisBench?.fanNoise;
  const hasBattery = chassisBench?.battery || chassisBench?.batteryPerformance;
  const hasStorage = chassisBench?.ssdSpeed || chassisBench?.memoryBandwidthGBs;
  const hasDisplay = chassisBench?.displayBrightness || chassisBench?.pugetPremiere || chassisBench?.pugetDavinci;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
        Benchmarks
      </h3>

      {/* Processing — CPU + GPU side by side */}
      {(hasAnyCpuRaw || hasAnyGpuExtra) && (
        <div className="space-y-3">
          <Divider label="Processing" />
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {hasAnyCpuRaw && (
              <SubSection title="CPU Performance" accent={CAT_COLORS.cpu}>
                <div className="space-y-2.5">
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
                    <MiniBar
                      label="Geekbench 6 Single"
                      value={cpuRaw.geekbench6Single}
                      maxValue={3200}
                      color="#ee5396"
                    />
                  )}
                  {cpuRaw.geekbench6Multi && (
                    <MiniBar
                      label="Geekbench 6 Multi"
                      value={cpuRaw.geekbench6Multi}
                      maxValue={21000}
                      color="#be95ff"
                    />
                  )}
                </div>
              </SubSection>
            )}

            {hasAnyGpuExtra && (
              <SubSection title="GPU Benchmarks" accent={CAT_COLORS.gpu}>
                <div className="space-y-2.5">
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
          </div>
        </div>
      )}

      {/* Thermals & Power */}
      {hasThermals && (
        <div className="space-y-3">
          <Divider label="Thermals & Power" />
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <SubSection title="Power & Thermals" accent={CAT_COLORS.thermal}>
              <div className="grid grid-cols-2 gap-2">
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
                <div className="space-y-2">
                  <ThermalProfileBar
                    keyboardMaxC={chassisBench.thermals.keyboardMaxC}
                    fanNoiseDbA={chassisBench?.fanNoise}
                    lineup={model.lineup}
                  />
                  <ThermalGauge
                    keyboardMaxC={chassisBench.thermals.keyboardMaxC}
                    undersideMaxC={chassisBench.thermals.undersideMaxC}
                  />
                  <span
                    className="inline-block rounded px-1.5 py-0.5 text-xs"
                    style={{
                      background:
                        chassisBench.thermals.keyboardMaxC > thermalT.hot
                          ? "#ff832b20"
                          : chassisBench.thermals.keyboardMaxC > thermalT.warm
                            ? "#f1c21b20"
                            : "#42be6520",
                      color:
                        chassisBench.thermals.keyboardMaxC > thermalT.hot
                          ? "#ff832b"
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
                      <span className="ml-1 text-[10px] opacity-70">
                        (normal for {model.lineup === "Legion" ? "gaming" : "workstation"})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </SubSection>

            {chassisBench?.fanNoise && (
              <SubSection title="Fan Noise" accent={CAT_COLORS.noise}>
                <StatBox
                  label="Max Load"
                  value={chassisBench.fanNoise}
                  unit="dB"
                  color={
                    chassisBench.fanNoise > noiseT.loud
                      ? "#ff832b"
                      : chassisBench.fanNoise > noiseT.moderate
                        ? "#f1c21b"
                        : "#42be65"
                  }
                />
                <span
                  className="inline-block rounded px-1.5 py-0.5 text-xs"
                  style={{
                    background:
                      chassisBench.fanNoise > noiseT.loud
                        ? "#ff832b20"
                        : chassisBench.fanNoise > noiseT.moderate
                          ? "#f1c21b20"
                          : "#42be6520",
                    color:
                      chassisBench.fanNoise > noiseT.loud
                        ? "#ff832b"
                        : chassisBench.fanNoise > noiseT.moderate
                          ? "#f1c21b"
                          : "#42be65",
                  }}
                >
                  {chassisBench.fanNoise > noiseT.loud
                    ? "Loud — noticeable in quiet rooms"
                    : chassisBench.fanNoise > noiseT.moderate
                      ? "Moderate — audible under load"
                      : "Quiet — barely noticeable"}
                </span>
              </SubSection>
            )}
          </div>
        </div>
      )}

      {/* Battery & Endurance */}
      {hasBattery && (
        <div className="space-y-3">
          <Divider label="Battery & Endurance" />
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {chassisBench?.battery && (
              <SubSection title="Battery Life" accent={CAT_COLORS.battery}>
                <div className="grid grid-cols-2 gap-2">
                  <StatBox label="Office / Web" value={chassisBench.battery.officeHours} unit="hrs" color="#42be65" />
                  <StatBox label="Video Playback" value={chassisBench.battery.videoHours} unit="hrs" color="#08bdba" />
                </div>
              </SubSection>
            )}

            {chassisBench?.batteryPerformance && (
              <SubSection title="Battery Performance" accent={CAT_COLORS.battPerf}>
                <BatteryCompareBar
                  pluggedIn={chassisBench.batteryPerformance.pluggedIn}
                  onBattery={chassisBench.batteryPerformance.onBattery}
                />
              </SubSection>
            )}

            {/* Travel Weight — co-located with battery since both are about mobility */}
            {chassisBench?.weightWithChargerGrams && (
              <SubSection title="Travel Weight" accent={CAT_COLORS.weight}>
                <div className="grid grid-cols-2 gap-2">
                  <StatBox label="Laptop Only" value={(model.weight * 1000).toFixed(0)} unit="g" />
                  <StatBox label="+ Charger" value={chassisBench.weightWithChargerGrams} unit="g" color="#f1c21b" />
                </div>
              </SubSection>
            )}
          </div>
        </div>
      )}

      {/* Storage & Memory */}
      {hasStorage && (
        <div className="space-y-3">
          <Divider label="Storage & Memory" />
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {chassisBench?.ssdSpeed && (
              <SubSection title="Storage Speed" accent={CAT_COLORS.storage}>
                <div className="space-y-2.5">
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

            {chassisBench?.memoryBandwidthGBs && (
              <SubSection title="Memory Bandwidth" accent={CAT_COLORS.memory}>
                <MiniBar
                  label="Bandwidth"
                  value={chassisBench.memoryBandwidthGBs}
                  maxValue={100}
                  color="#be95ff"
                  unit="GB/s"
                />
              </SubSection>
            )}
          </div>
        </div>
      )}

      {/* Display & Creative */}
      {hasDisplay && (
        <div className="space-y-3">
          <Divider label="Display & Creative" />
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {chassisBench?.displayBrightness && (
              <SubSection title="Display (Measured)" accent={CAT_COLORS.display}>
                <div className="grid grid-cols-2 gap-2">
                  <StatBox label="Measured" value={chassisBench.displayBrightness} unit="nits" color="#f1c21b" />
                  <StatBox label="Spec" value={model.display.nits} unit="nits" color="var(--muted)" />
                </div>
              </SubSection>
            )}

            {(chassisBench?.pugetPremiere || chassisBench?.pugetDavinci) && (
              <SubSection title="Content Creation" accent={CAT_COLORS.creative}>
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
          </div>
        </div>
      )}

      {/* Sources */}
      {chassisBench?.sources && chassisBench.sources.length > 0 && (
        <div className="pt-2 text-sm" style={{ color: "var(--muted)", borderTop: "1px solid var(--border-subtle)" }}>
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
