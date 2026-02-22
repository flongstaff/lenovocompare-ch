"use client";

import type { Laptop } from "@/lib/types";
import { getModelBenchmarks, getCpuRawBenchmarks, getGpuBenchmark } from "@/lib/scoring";
import { BENCHMARK_CAT_COLORS } from "@/lib/constants";
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

/* ── dB reference points for noise scale ─────────────────── */
const NOISE_REFS = [
  { db: 25, label: "Library" },
  { db: 35, label: "Quiet office" },
  { db: 45, label: "Conversation" },
  { db: 55, label: "Street traffic" },
] as const;

const CAT_COLORS = BENCHMARK_CAT_COLORS;

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
  <div
    className="rounded-md border px-3 py-2.5"
    style={{ borderColor: "var(--border-subtle)", background: "var(--surface-inset)" }}
  >
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
      <div className="h-1.5 rounded-full" style={{ background: "var(--surface-inset)" }}>
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
    <span className="text-[10px] font-medium uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
      {label}
    </span>
    <div className="h-px flex-1" style={{ background: "var(--border-subtle)" }} />
  </div>
);

const InsightRow = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div className="flex items-start gap-2 py-0.5">
    <span
      className="shrink-0 text-[10px] font-semibold uppercase tracking-wide"
      style={{ color: color ?? "var(--muted)", minWidth: 60 }}
    >
      {label}
    </span>
    <span className="text-xs" style={{ color: "var(--muted)" }}>
      {value}
    </span>
  </div>
);

const NoiseScale = ({ dbValue }: { dbValue: number }) => {
  const pct = Math.min(100, Math.max(0, ((dbValue - 20) / 40) * 100));
  return (
    <div className="space-y-1">
      <div className="relative h-2 rounded-full" style={{ background: "var(--surface-inset)" }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: "100%",
            background: "linear-gradient(90deg, #42be65 0%, #f1c21b 50%, #ff832b 80%, #da1e28 100%)",
            opacity: 0.25,
          }}
        />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2"
          style={{
            left: `${pct}%`,
            background: dbValue > 45 ? "#ff832b" : dbValue > 35 ? "#f1c21b" : "#42be65",
            borderColor: "#161616",
            transform: `translate(-50%, -50%)`,
          }}
        />
      </div>
      <div className="flex justify-between">
        {NOISE_REFS.map((ref) => (
          <span
            key={ref.db}
            className="text-[9px]"
            style={{
              color: Math.abs(dbValue - ref.db) < 5 ? "var(--foreground)" : "var(--icon-muted)",
              fontWeight: Math.abs(dbValue - ref.db) < 5 ? 600 : 400,
            }}
          >
            {ref.label}
          </span>
        ))}
      </div>
    </div>
  );
};

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

            {hasAnyGpuExtra ? (
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
            ) : (
              <SubSection title="Performance Context" accent="#6f6f6f">
                {cpuRaw && (
                  <div className="space-y-2">
                    {cpuRaw.cinebench2024Single && cpuRaw.cinebench2024Multi && (
                      <div className="grid grid-cols-2 gap-2">
                        <StatBox
                          label="Multi / Single"
                          value={`${(cpuRaw.cinebench2024Multi / cpuRaw.cinebench2024Single).toFixed(1)}×`}
                          color="#4589ff"
                        />
                        <StatBox
                          label="Per-Core Perf"
                          value={Math.round(cpuRaw.cinebench2024Multi / model.processor.cores)}
                          color="#be95ff"
                        />
                      </div>
                    )}
                    <div className="space-y-0.5">
                      <InsightRow
                        label="Scaling"
                        value={
                          cpuRaw.cinebench2024Single && cpuRaw.cinebench2024Multi
                            ? cpuRaw.cinebench2024Multi / cpuRaw.cinebench2024Single > model.processor.cores * 0.75
                              ? "Excellent multi-thread scaling for this core count"
                              : cpuRaw.cinebench2024Multi / cpuRaw.cinebench2024Single > model.processor.cores * 0.55
                                ? "Good scaling — some thermal or power throttling"
                                : "Moderate scaling — likely TDP-limited"
                            : "Benchmark data needed for scaling analysis"
                        }
                        color={
                          cpuRaw.cinebench2024Single && cpuRaw.cinebench2024Multi
                            ? cpuRaw.cinebench2024Multi / cpuRaw.cinebench2024Single > model.processor.cores * 0.75
                              ? "#42be65"
                              : cpuRaw.cinebench2024Multi / cpuRaw.cinebench2024Single > model.processor.cores * 0.55
                                ? "#4589ff"
                                : "#f1c21b"
                            : undefined
                        }
                      />
                      {cpuRaw.typicalTdpAvg && (
                        <InsightRow
                          label="Efficiency"
                          value={`${((cpuRaw.cinebench2024Multi ?? 0) / cpuRaw.typicalTdpAvg).toFixed(1)} pts/W — ${
                            (cpuRaw.cinebench2024Multi ?? 0) / cpuRaw.typicalTdpAvg > 20
                              ? "highly efficient"
                              : (cpuRaw.cinebench2024Multi ?? 0) / cpuRaw.typicalTdpAvg > 12
                                ? "good efficiency"
                                : "performance-focused"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                )}
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
                  <ThermalProfileBar keyboardMaxC={chassisBench.thermals.keyboardMaxC} />
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
                <div className="grid grid-cols-2 gap-2">
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
                  <StatBox
                    label="Idle (est.)"
                    value={chassisBench.fanNoise <= 33 ? "Silent" : `~${Math.round(chassisBench.fanNoise * 0.7)}`}
                    unit={chassisBench.fanNoise <= 33 ? "" : "dB"}
                    color="var(--icon-muted)"
                  />
                </div>
                <NoiseScale dbValue={chassisBench.fanNoise} />
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
                <InsightRow
                  label="Tier"
                  value={
                    chassisBench.ssdSpeed.seqReadMBs >= 7000
                      ? "PCIe 4.0 top-tier — fast OS, app, and game loads"
                      : chassisBench.ssdSpeed.seqReadMBs >= 5000
                        ? "PCIe 4.0 mid-range — snappy for most workloads"
                        : chassisBench.ssdSpeed.seqReadMBs >= 3000
                          ? "PCIe 3.0 / entry 4.0 — adequate for general use"
                          : "Entry-level — noticeable in large file transfers"
                  }
                  color={
                    chassisBench.ssdSpeed.seqReadMBs >= 7000
                      ? "#42be65"
                      : chassisBench.ssdSpeed.seqReadMBs >= 5000
                        ? "#4589ff"
                        : "#f1c21b"
                  }
                />
              </SubSection>
            )}

            {chassisBench?.memoryBandwidthGBs ? (
              <SubSection title="Memory Bandwidth" accent={CAT_COLORS.memory}>
                <MiniBar
                  label="Bandwidth"
                  value={chassisBench.memoryBandwidthGBs}
                  maxValue={100}
                  color="#be95ff"
                  unit="GB/s"
                />
                <InsightRow
                  label="Rating"
                  value={
                    chassisBench.memoryBandwidthGBs >= 70
                      ? "Excellent — great for content creation and large datasets"
                      : chassisBench.memoryBandwidthGBs >= 45
                        ? "Good — handles multitasking and dev workloads well"
                        : "Standard — sufficient for typical office and web use"
                  }
                  color={
                    chassisBench.memoryBandwidthGBs >= 70
                      ? "#42be65"
                      : chassisBench.memoryBandwidthGBs >= 45
                        ? "#be95ff"
                        : undefined
                  }
                />
                {model.ram.soldered && (
                  <InsightRow
                    label="Note"
                    value="Soldered RAM — bandwidth is fixed and not upgradeable"
                    color="#f1c21b"
                  />
                )}
              </SubSection>
            ) : null}
          </div>
        </div>
      )}

      {/* Display & Creative */}
      {hasDisplay && (
        <div className="space-y-3">
          <Divider label="Display & Creative" />
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {chassisBench?.displayBrightness &&
              (() => {
                const diff = chassisBench.displayBrightness - model.display.nits;
                const diffPct = Math.round((diff / model.display.nits) * 100);
                const overSpec = diff > 0;
                return (
                  <SubSection title="Display (Measured)" accent={CAT_COLORS.display}>
                    <div className="grid grid-cols-2 gap-2">
                      <StatBox label="Measured" value={chassisBench.displayBrightness} unit="nits" color="#f1c21b" />
                      <StatBox label="Spec" value={model.display.nits} unit="nits" color="var(--muted)" />
                    </div>
                    <InsightRow
                      label="Accuracy"
                      value={
                        overSpec
                          ? `+${diffPct}% above spec — exceeds advertised brightness`
                          : Math.abs(diffPct) <= 5
                            ? "Matches spec — accurate manufacturer claim"
                            : `${diffPct}% below spec — dimmer than advertised`
                      }
                      color={overSpec ? "#42be65" : Math.abs(diffPct) <= 5 ? "#4589ff" : "#ff832b"}
                    />
                    <InsightRow
                      label="Use"
                      value={
                        chassisBench.displayBrightness >= 500
                          ? "Outdoor-capable — comfortable in direct sunlight"
                          : chassisBench.displayBrightness >= 350
                            ? "Indoor-excellent — handles bright office lighting"
                            : chassisBench.displayBrightness >= 250
                              ? "Indoor-adequate — may struggle near windows"
                              : "Dim — best in controlled lighting environments"
                      }
                    />
                  </SubSection>
                );
              })()}

            {chassisBench?.pugetPremiere || chassisBench?.pugetDavinci ? (
              <SubSection title="Content Creation" accent={CAT_COLORS.creative}>
                <div className="grid grid-cols-2 gap-2">
                  {chassisBench.pugetPremiere && (
                    <StatBox label="Puget Premiere" value={chassisBench.pugetPremiere} color="#be95ff" />
                  )}
                  {chassisBench.pugetDavinci && (
                    <StatBox label="Puget DaVinci" value={chassisBench.pugetDavinci} color="#6929c4" />
                  )}
                </div>
                <InsightRow
                  label="Rating"
                  value={
                    (chassisBench.pugetPremiere ?? 0) >= 8000 || (chassisBench.pugetDavinci ?? 0) >= 5000
                      ? "Professional-grade — smooth 4K timeline editing"
                      : (chassisBench.pugetPremiere ?? 0) >= 5000 || (chassisBench.pugetDavinci ?? 0) >= 3000
                        ? "Capable — handles 1080p editing and moderate 4K"
                        : "Basic — suitable for light editing and short projects"
                  }
                  color={
                    (chassisBench.pugetPremiere ?? 0) >= 8000 || (chassisBench.pugetDavinci ?? 0) >= 5000
                      ? "#42be65"
                      : "#be95ff"
                  }
                />
              </SubSection>
            ) : chassisBench?.displayBrightness ? (
              <SubSection title="Display Quality" accent="#6f6f6f">
                <div className="space-y-0.5">
                  <InsightRow
                    label="Panel"
                    value={
                      model.display.panel === "OLED"
                        ? "OLED — perfect blacks, wide color gamut, burn-in risk with static content"
                        : model.display.panel === "IPS"
                          ? "IPS — consistent colors at wide angles, good for productivity"
                          : "TN — fast response but narrow viewing angles"
                    }
                    color={model.display.panel === "OLED" ? "#f1c21b" : undefined}
                  />
                  <InsightRow
                    label="Refresh"
                    value={
                      model.display.refreshRate >= 165
                        ? `${model.display.refreshRate} Hz — competitive gaming and ultra-smooth scrolling`
                        : model.display.refreshRate >= 120
                          ? `${model.display.refreshRate} Hz — noticeably smoother than 60 Hz`
                          : `${model.display.refreshRate} Hz — standard refresh for productivity`
                    }
                    color={model.display.refreshRate >= 120 ? "#42be65" : undefined}
                  />
                  <InsightRow
                    label="PPI"
                    value={(() => {
                      const [w, h] = model.display.resolution.split("x").map(Number);
                      const diag = Math.sqrt(w * w + h * h) / model.display.size;
                      const ppi = Math.round(diag);
                      return ppi >= 200
                        ? `${ppi} — Retina-class, text is crisp at any distance`
                        : ppi >= 150
                          ? `${ppi} — sharp, individual pixels rarely visible`
                          : `${ppi} — adequate at normal viewing distance`;
                    })()}
                  />
                </div>
              </SubSection>
            ) : null}
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
