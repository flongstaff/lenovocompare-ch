/**
 * Scoring engine — computes 0–100 scores across 6 dimensions for each laptop model.
 *
 * Dimensions: CPU performance, GPU, display quality, memory/storage, connectivity, portability.
 * Scores are absolute across all lineups (Legion dGPUs 55–92, ThinkPad iGPUs 8–40).
 * Value score is derived from performance-per-CHF when pricing data is available.
 */
import type {
  Laptop,
  SwissPrice,
  GamingTier,
  GpuBenchmarkEntry,
  PerformanceDimensions,
  ModelBenchmarks,
  CpuBenchmarkData,
} from "./types";
import { cpuBenchmarks, cpuBenchmarksExpanded } from "@/data/cpu-benchmarks";
import { gpuBenchmarks } from "@/data/gpu-benchmarks";
import { modelBenchmarks } from "@/data/model-benchmarks";

export const getPerformanceScore = (cpu: string): number => cpuBenchmarks[cpu] ?? 0;

export const getCpuSingleCore = (cpuName: string): number => cpuBenchmarksExpanded[cpuName]?.singleCore ?? 0;

export const getCpuMultiCore = (cpuName: string): number => cpuBenchmarksExpanded[cpuName]?.multiCore ?? 0;

export const getGpuBenchmark = (gpuName: string): GpuBenchmarkEntry | null => gpuBenchmarks[gpuName] ?? null;

export const getGpuScore = (gpuName: string): number => gpuBenchmarks[gpuName]?.score ?? 0;

export const getGamingTier = (gpuName: string): GamingTier => gpuBenchmarks[gpuName]?.gamingTier ?? "None";

export const getValueScore = (model: Laptop, prices: readonly SwissPrice[]): number | null => {
  const perf = getPerformanceScore(model.processor.name);
  if (perf === 0) return null;

  const matching = prices.filter((p) => p.laptopId === model.id);
  if (matching.length === 0) return null;

  const lowestPrice = Math.min(...matching.map((p) => p.price));
  // Performance per 1000 CHF, with 1.5x scaling so a mid-range model at typical price ≈ 50
  return Math.round((perf / (lowestPrice / 1000)) * 1.5);
};

export const getPortabilityScore = (model: Laptop): number => {
  // 0.8 kg = floor (lightest ultraportable); 40 = sensitivity (softened from 50 for better mid-range differentiation)
  const weightScore = Math.max(0, 100 - (model.weight - 0.8) * 40);
  // 100 Whr = ceiling for full battery score
  const batteryScore = Math.min(100, (model.battery.whr / 100) * 100);
  // 60/40 split: weight matters more than battery for portability
  return Math.round(weightScore * 0.6 + batteryScore * 0.4);
};

/**
 * Display score breakdown (max 100):
 * - Resolution: 0–30 (ceiling: 3840x2400 / 4K+)
 * - Panel type: 5–25 (OLED > IPS > TN)
 * - Brightness: 0–15 (ceiling: 600 nits)
 * - Refresh rate: 0–15 (60 Hz base, ceiling: 165 Hz)
 * - Touch: 0 or 10
 * - Size: 0–5 (13" base, ceiling: 16")
 */
export const getDisplayScore = (model: Laptop): number => {
  const d = model.display;
  const parts = d.resolution.split("x").map(Number);
  const w = parts[0] ?? 0;
  const h = parts[1] ?? 0;
  const pixels = isNaN(w) || isNaN(h) ? 0 : w * h;
  const resScore = Math.min(30, (pixels / (3840 * 2400)) * 30);
  const panelScore = d.panel === "OLED" ? 25 : d.panel === "IPS" ? 15 : 5;
  const brightnessScore = Math.min(15, (d.nits / 600) * 15);
  const refreshScore = Math.min(15, ((d.refreshRate - 60) / 105) * 15);
  const touchScore = d.touchscreen ? 10 : 0;
  const sizeScore = Math.min(5, ((d.size - 13) / 3) * 5);

  return Math.round(Math.min(100, resScore + panelScore + brightnessScore + refreshScore + touchScore + sizeScore));
};

/**
 * Connectivity score (max ~100). Point budget:
 * TB4: 10/port (max 25), USB-C: 5/port (max 10), USB-A: 10, HDMI: 8,
 * RJ45: 8, SD: 7, Wi-Fi 7/6E/other: 15/10/5, BT 5.3+: 5, 2+ M.2: 5, DP: 5
 */
export const getConnectivityScore = (model: Laptop): number => {
  let score = 0;
  const ports = model.ports;

  // Thunderbolt 4
  const tb4Count = ports.reduce((n, p) => {
    const match = p.match(/^(\d+)x\s.*thunderbolt 4/i);
    return n + (match ? parseInt(match[1], 10) : p.toLowerCase().includes("thunderbolt 4") ? 1 : 0);
  }, 0);
  score += Math.min(25, tb4Count * 10);

  // USB-C count
  const usbC = ports.filter((p) => p.toLowerCase().includes("usb-c")).length;
  score += Math.min(10, usbC * 5);

  // USB-A
  const hasUSBA = ports.some((p) => p.toLowerCase().includes("usb-a"));
  if (hasUSBA) score += 10;

  // HDMI
  const hasHDMI = ports.some((p) => p.toLowerCase().includes("hdmi"));
  if (hasHDMI) score += 8;

  // RJ45
  const hasRJ45 = ports.some((p) => p.toLowerCase().includes("rj45"));
  if (hasRJ45) score += 8;

  // SD card
  const hasSD = ports.some((p) => p.toLowerCase().includes("sd"));
  if (hasSD) score += 7;

  // Wireless
  const hasWifi7 = model.wireless.some((w) => w.includes("Wi-Fi 7"));
  const hasWifi6E = model.wireless.some((w) => w.includes("Wi-Fi 6E"));
  if (hasWifi7) score += 15;
  else if (hasWifi6E) score += 10;
  else score += 5;

  // Bluetooth
  const hasBT53 = model.wireless.some((w) => w.includes("5.3") || w.includes("5.4"));
  if (hasBT53) score += 5;

  // Storage slots
  if (model.storage.slots >= 2) score += 5;

  // DisplayPort
  const hasDP = ports.some((p) => p.toLowerCase().includes("displayport"));
  if (hasDP) score += 5;

  return Math.min(100, score);
};

/**
 * Memory & storage score (max ~95). Breakdown:
 * RAM size: 5–30, max RAM: 4–15, RAM type: 6–12,
 * storage size: 4–15, upgradability: 3–15, storage slots: 3–8
 */
export const getMemoryScore = (model: Laptop): number => {
  let score = 0;

  // RAM size
  if (model.ram.size >= 64) score += 30;
  else if (model.ram.size >= 32) score += 25;
  else if (model.ram.size >= 16) score += 18;
  else if (model.ram.size >= 8) score += 10;
  else score += 5;

  // Max RAM
  if (model.ram.maxSize >= 128) score += 15;
  else if (model.ram.maxSize >= 64) score += 12;
  else if (model.ram.maxSize >= 32) score += 8;
  else score += 4;

  // RAM type
  if (model.ram.type === "LPDDR5x") score += 12;
  else if (model.ram.type === "LPDDR5" || model.ram.type === "DDR5") score += 10;
  else score += 6;

  // Storage size
  if (model.storage.size >= 2048) score += 15;
  else if (model.storage.size >= 1024) score += 12;
  else if (model.storage.size >= 512) score += 8;
  else score += 4;

  // Upgradability
  if (!model.ram.soldered && model.ram.slots >= 2) score += 15;
  else if (!model.ram.soldered) score += 10;
  else score += 3;

  // Storage slots
  if (model.storage.slots >= 2) score += 8;
  else score += 3;

  return Math.min(100, score);
};

export interface ModelScores {
  readonly perf: number;
  readonly singleCore: number;
  readonly multiCore: number;
  readonly gpu: number;
  readonly gpuBenchmark: GpuBenchmarkEntry | null;
  readonly gamingTier: GamingTier;
  readonly display: number;
  readonly memory: number;
  readonly connectivity: number;
  readonly portability: number;
  readonly value: number | null;
  readonly dimensions: PerformanceDimensions;
  readonly lowestPrice: number | null;
}

export const getModelScores = (model: Laptop, prices?: readonly SwissPrice[]): ModelScores => {
  const perf = getPerformanceScore(model.processor.name);
  const display = getDisplayScore(model);
  const memory = getMemoryScore(model);
  const connectivity = getConnectivityScore(model);
  const portability = getPortabilityScore(model);
  const gpu = getGpuScore(model.gpu.name);
  const lowestPrice = prices ? getLowestPrice(model.id, prices) : null;

  return {
    perf,
    singleCore: getCpuSingleCore(model.processor.name),
    multiCore: getCpuMultiCore(model.processor.name),
    gpu,
    gpuBenchmark: getGpuBenchmark(model.gpu.name),
    gamingTier: getGamingTier(model.gpu.name),
    display,
    memory,
    connectivity,
    portability,
    value: prices ? getValueScore(model, prices) : null,
    dimensions: { cpu: perf, gpu, memory, portability, display, connectivity },
    lowestPrice,
  };
};

export const getPerformanceDimensions = (model: Laptop): PerformanceDimensions => ({
  cpu: getPerformanceScore(model.processor.name),
  gpu: getGpuScore(model.gpu.name),
  memory: getMemoryScore(model),
  portability: getPortabilityScore(model),
  display: getDisplayScore(model),
  connectivity: getConnectivityScore(model),
});

export const getLowestPrice = (laptopId: string, prices: readonly SwissPrice[]): number | null => {
  const matching = prices.filter((p) => p.laptopId === laptopId);
  if (matching.length === 0) return null;
  return Math.min(...matching.map((p) => p.price));
};

export const getPricesForModel = (laptopId: string, prices: readonly SwissPrice[]): SwissPrice[] =>
  prices.filter((p) => p.laptopId === laptopId).sort((a, b) => a.price - b.price);

export const getModelBenchmarks = (laptopId: string): ModelBenchmarks | null => modelBenchmarks[laptopId] ?? null;

export const getCpuRawBenchmarks = (
  cpuName: string,
): Pick<
  CpuBenchmarkData,
  | "cinebench2024Single"
  | "cinebench2024Multi"
  | "geekbench6Single"
  | "geekbench6Multi"
  | "typicalTdpAvg"
  | "typicalTdpMax"
> | null => {
  const data = cpuBenchmarksExpanded[cpuName];
  if (!data) return null;
  const { cinebench2024Single, cinebench2024Multi, geekbench6Single, geekbench6Multi, typicalTdpAvg, typicalTdpMax } =
    data;
  if (!cinebench2024Single && !geekbench6Single) return null;
  return { cinebench2024Single, cinebench2024Multi, geekbench6Single, geekbench6Multi, typicalTdpAvg, typicalTdpMax };
};

// ── Score Breakdown Types & Functions ──────────────────────────────────────

export interface ScoreComponent {
  readonly label: string;
  readonly earned: number;
  readonly max: number;
}

export interface DisplayBreakdown {
  readonly resolution: ScoreComponent;
  readonly panel: ScoreComponent;
  readonly brightness: ScoreComponent;
  readonly refresh: ScoreComponent;
  readonly touch: ScoreComponent;
  readonly size: ScoreComponent;
}

export const getDisplayScoreBreakdown = (model: Laptop): DisplayBreakdown => {
  const d = model.display;
  const parts = d.resolution.split("x").map(Number);
  const w = parts[0] ?? 0;
  const h = parts[1] ?? 0;
  const pixels = isNaN(w) || isNaN(h) ? 0 : w * h;

  return {
    resolution: { label: "Resolution", earned: Math.min(30, (pixels / (3840 * 2400)) * 30), max: 30 },
    panel: { label: "Panel", earned: d.panel === "OLED" ? 25 : d.panel === "IPS" ? 15 : 5, max: 25 },
    brightness: { label: "Brightness", earned: Math.min(15, (d.nits / 600) * 15), max: 15 },
    refresh: { label: "Refresh Rate", earned: Math.min(15, ((d.refreshRate - 60) / 105) * 15), max: 15 },
    touch: { label: "Touch", earned: d.touchscreen ? 10 : 0, max: 10 },
    size: { label: "Size", earned: Math.min(5, ((d.size - 13) / 3) * 5), max: 5 },
  };
};

export interface MemoryBreakdown {
  readonly ramSize: ScoreComponent;
  readonly maxRam: ScoreComponent;
  readonly ramType: ScoreComponent;
  readonly storageSize: ScoreComponent;
  readonly upgradability: ScoreComponent;
  readonly storageSlots: ScoreComponent;
}

export const getMemoryScoreBreakdown = (model: Laptop): MemoryBreakdown => {
  const ramSize =
    model.ram.size >= 64 ? 30 : model.ram.size >= 32 ? 25 : model.ram.size >= 16 ? 18 : model.ram.size >= 8 ? 10 : 5;
  const maxRam = model.ram.maxSize >= 128 ? 15 : model.ram.maxSize >= 64 ? 12 : model.ram.maxSize >= 32 ? 8 : 4;
  const ramType =
    model.ram.type === "LPDDR5x" ? 12 : model.ram.type === "LPDDR5" || model.ram.type === "DDR5" ? 10 : 6;
  const storageSize =
    model.storage.size >= 2048 ? 15 : model.storage.size >= 1024 ? 12 : model.storage.size >= 512 ? 8 : 4;
  const upgradability = !model.ram.soldered && model.ram.slots >= 2 ? 15 : !model.ram.soldered ? 10 : 3;
  const storageSlots = model.storage.slots >= 2 ? 8 : 3;

  return {
    ramSize: { label: "RAM", earned: ramSize, max: 30 },
    maxRam: { label: "Max RAM", earned: maxRam, max: 15 },
    ramType: { label: "RAM Type", earned: ramType, max: 12 },
    storageSize: { label: "Storage", earned: storageSize, max: 15 },
    upgradability: { label: "Upgradability", earned: upgradability, max: 15 },
    storageSlots: { label: "Slots", earned: storageSlots, max: 8 },
  };
};

export interface ConnectivityBreakdown {
  readonly thunderbolt: ScoreComponent;
  readonly usbC: ScoreComponent;
  readonly usbA: ScoreComponent;
  readonly hdmi: ScoreComponent;
  readonly rj45: ScoreComponent;
  readonly sd: ScoreComponent;
  readonly wifi: ScoreComponent;
  readonly bluetooth: ScoreComponent;
  readonly m2Slots: ScoreComponent;
  readonly displayPort: ScoreComponent;
}

export const getConnectivityScoreBreakdown = (model: Laptop): ConnectivityBreakdown => {
  const ports = model.ports;
  const tb4Count = ports.reduce((n, p) => {
    const match = p.match(/^(\d+)x\s.*thunderbolt 4/i);
    return n + (match ? parseInt(match[1], 10) : p.toLowerCase().includes("thunderbolt 4") ? 1 : 0);
  }, 0);
  const usbC = ports.filter((p) => p.toLowerCase().includes("usb-c")).length;

  return {
    thunderbolt: { label: "TB4", earned: Math.min(25, tb4Count * 10), max: 25 },
    usbC: { label: "USB-C", earned: Math.min(10, usbC * 5), max: 10 },
    usbA: { label: "USB-A", earned: ports.some((p) => p.toLowerCase().includes("usb-a")) ? 10 : 0, max: 10 },
    hdmi: { label: "HDMI", earned: ports.some((p) => p.toLowerCase().includes("hdmi")) ? 8 : 0, max: 8 },
    rj45: { label: "RJ45", earned: ports.some((p) => p.toLowerCase().includes("rj45")) ? 8 : 0, max: 8 },
    sd: { label: "SD", earned: ports.some((p) => p.toLowerCase().includes("sd")) ? 7 : 0, max: 7 },
    wifi: {
      label: "Wi-Fi",
      earned: model.wireless.some((w) => w.includes("Wi-Fi 7"))
        ? 15
        : model.wireless.some((w) => w.includes("Wi-Fi 6E"))
          ? 10
          : 5,
      max: 15,
    },
    bluetooth: {
      label: "BT",
      earned: model.wireless.some((w) => w.includes("5.3") || w.includes("5.4")) ? 5 : 0,
      max: 5,
    },
    m2Slots: { label: "M.2", earned: model.storage.slots >= 2 ? 5 : 0, max: 5 },
    displayPort: { label: "DP", earned: ports.some((p) => p.toLowerCase().includes("displayport")) ? 5 : 0, max: 5 },
  };
};

export interface PortabilityBreakdown {
  readonly weight: ScoreComponent;
  readonly battery: ScoreComponent;
}

export const getPortabilityScoreBreakdown = (model: Laptop): PortabilityBreakdown => {
  const weightRaw = Math.max(0, 100 - (model.weight - 0.8) * 40);
  const batteryRaw = Math.min(100, (model.battery.whr / 100) * 100);
  return {
    weight: { label: "Weight", earned: Math.round(weightRaw * 0.6 * 10) / 10, max: 60 },
    battery: { label: "Battery", earned: Math.round(batteryRaw * 0.4 * 10) / 10, max: 40 },
  };
};

export interface CpuBreakdown {
  readonly singleCore: number;
  readonly multiCore: number;
  readonly composite: number;
}

export const getCpuScoreBreakdown = (cpuName: string): CpuBreakdown => ({
  singleCore: getCpuSingleCore(cpuName),
  multiCore: getCpuMultiCore(cpuName),
  composite: getPerformanceScore(cpuName),
});

export interface GpuBreakdown {
  readonly score: number;
  readonly tier: GamingTier;
}

export const getGpuScoreBreakdown = (gpuName: string): GpuBreakdown => ({
  score: getGpuScore(gpuName),
  tier: getGamingTier(gpuName),
});
