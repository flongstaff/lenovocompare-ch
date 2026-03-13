/**
 * Scoring engine — computes 0–100 scores across 6 dimensions for each laptop model.
 *
 * Dimensions: CPU performance, GPU, display quality, memory/storage, connectivity, portability.
 * Scores are absolute across all lineups (Legion dGPUs 55–92, ThinkPad iGPUs 8–40).
 * Value score is derived from composite performance-per-CHF when pricing data is available.
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
import { laptops } from "@/data/laptops";
import { cpuBenchmarks, cpuBenchmarksExpanded } from "@/data/cpu-benchmarks";
import { gpuBenchmarks } from "@/data/gpu-benchmarks";
import { modelBenchmarks } from "@/data/model-benchmarks";

export const getPerformanceScore = (cpu: string): number => cpuBenchmarks[cpu] ?? 0;

export const getCpuSingleCore = (cpuName: string): number => cpuBenchmarksExpanded[cpuName]?.singleCore ?? 0;

export const getCpuMultiCore = (cpuName: string): number => cpuBenchmarksExpanded[cpuName]?.multiCore ?? 0;

export const getGpuBenchmark = (gpuName: string): GpuBenchmarkEntry | null => gpuBenchmarks[gpuName] ?? null;

export const getGpuScore = (gpuName: string): number => gpuBenchmarks[gpuName]?.score ?? 0;

export const getGamingTier = (gpuName: string): GamingTier => gpuBenchmarks[gpuName]?.gamingTier ?? "None";

export const getPortabilityScore = (model: Laptop): number => {
  // 0.8 kg = floor (lightest ultraportable); 40 = sensitivity (softened from 50 for better mid-range differentiation)
  const weightScore = Math.max(0, Math.min(100, 100 - (model.weight - 0.8) * 40));
  // 100 Whr = ceiling for full battery score
  const batteryScore = Math.min(100, (model.battery.whr / 100) * 100);
  // 60/40 split: weight matters more than battery for portability
  return Math.min(100, Math.round(weightScore * 0.6 + batteryScore * 0.4));
};

// ── Score Breakdown Types & Functions ──────────────────────────────────────

export interface ScoreComponent {
  readonly label: string;
  readonly earned: number;
  readonly max: number;
}

// ── Display ──────────────────────────────────────────────────────────────────

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
    refresh: { label: "Refresh Rate", earned: Math.max(0, Math.min(15, ((d.refreshRate - 60) / 105) * 15)), max: 15 },
    touch: { label: "Touch", earned: d.touchscreen ? 10 : 0, max: 10 },
    size: { label: "Size", earned: Math.max(0, Math.min(5, ((d.size - 13) / 3) * 5)), max: 5 },
  };
};

/**
 * Display score (max 100): Resolution + Panel + Brightness + Refresh + Touch + Size.
 * Delegates to getDisplayScoreBreakdown so the total always matches the breakdown sum.
 */
export const getDisplayScore = (model: Laptop): number => {
  const bd = getDisplayScoreBreakdown(model);
  const sum =
    bd.resolution.earned +
    bd.panel.earned +
    bd.brightness.earned +
    bd.refresh.earned +
    bd.touch.earned +
    bd.size.earned;
  return Math.round(Math.min(100, sum));
};

// ── Connectivity ──────────────────────────────────────────────────────────────

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

/**
 * Connectivity breakdown (max ~100). Point budget:
 * TB4: 10/port (max 25), USB-C: 5/port (max 10), USB-A: 10, HDMI: 8,
 * RJ45: 8, SD: 7, Wi-Fi 7/6E/other: 15/10/5, BT 5.3+: 5, 2+ M.2: 5, DP: 5
 */
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

/**
 * Connectivity score (max 100). Delegates to getConnectivityScoreBreakdown so the
 * total always matches the breakdown sum.
 */
export const getConnectivityScore = (model: Laptop): number => {
  const bd = getConnectivityScoreBreakdown(model);
  const sum = Object.values(bd).reduce((acc, c) => acc + c.earned, 0);
  return Math.min(100, sum);
};

// ── Memory & Storage ─────────────────────────────────────────────────────────

export interface MemoryBreakdown {
  readonly ramSize: ScoreComponent;
  readonly maxRam: ScoreComponent;
  readonly ramType: ScoreComponent;
  readonly storageSize: ScoreComponent;
  readonly upgradability: ScoreComponent;
  readonly storageSlots: ScoreComponent;
}

/**
 * Memory & storage breakdown (max ~95):
 * RAM size: 5–30, max RAM: 4–15, RAM type: 6–12,
 * storage size: 4–15, upgradability: 3–15, storage slots: 3–8
 */
export const getMemoryScoreBreakdown = (model: Laptop): MemoryBreakdown => {
  const ramSize =
    model.ram.size >= 64 ? 30 : model.ram.size >= 32 ? 25 : model.ram.size >= 16 ? 18 : model.ram.size >= 8 ? 10 : 5;
  const maxRam = model.ram.maxSize >= 128 ? 15 : model.ram.maxSize >= 64 ? 12 : model.ram.maxSize >= 32 ? 8 : 4;
  const ramType = model.ram.type === "LPDDR5x" ? 12 : model.ram.type === "LPDDR5" || model.ram.type === "DDR5" ? 10 : 6;
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

/**
 * Memory & storage score (max 100). Delegates to getMemoryScoreBreakdown so the
 * total always matches the breakdown sum.
 */
export const getMemoryScore = (model: Laptop): number => {
  const bd = getMemoryScoreBreakdown(model);
  const sum =
    bd.ramSize.earned +
    bd.maxRam.earned +
    bd.ramType.earned +
    bd.storageSize.earned +
    bd.upgradability.earned +
    bd.storageSlots.earned;
  return Math.min(100, sum);
};

// ── Value ─────────────────────────────────────────────────────────────────────

/**
 * Value score (max 100). Uses a weighted composite of all six dimensions
 * to give a fairer assessment than CPU performance alone:
 *   composite = perf×0.30 + gpu×0.15 + display×0.20 + memory×0.15 + connectivity×0.10 + portability×0.10
 * Then: round(composite / (lowestPrice / 1000) × 1.5), capped at 100.
 * Returns null when CPU score is 0 (unrecognised CPU) or no price data exists.
 */
export const getValueScore = (model: Laptop, prices: readonly SwissPrice[]): number | null => {
  const perf = getPerformanceScore(model.processor.name);
  if (perf === 0) return null;

  const matching = prices.filter((p) => p.laptopId === model.id);
  if (matching.length === 0) return null;

  const lowestPrice = Math.min(...matching.map((p) => p.price));
  if (lowestPrice === 0) return null;

  const gpu = getGpuScore(model.gpu.name);
  const display = getDisplayScore(model);
  const memory = getMemoryScore(model);
  const connectivity = getConnectivityScore(model);
  const portability = getPortabilityScore(model);

  const overallScore = perf * 0.3 + gpu * 0.15 + display * 0.2 + memory * 0.15 + connectivity * 0.1 + portability * 0.1;

  return Math.min(100, Math.round((overallScore / (lowestPrice / 1000)) * 1.5));
};

// ── Aggregate Scores ──────────────────────────────────────────────────────────

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

// ── Remaining Breakdown Functions ─────────────────────────────────────────────

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

// ── Lineup Percentile Helpers ─────────────────────────────────────────────────

// Memoized lineup dimension scores — computed once since data is static
const lineupDimensionCache = new Map<string, number[]>();
const getLineupDimensionScores = (dimension: keyof PerformanceDimensions, lineup: string): number[] => {
  const key = `${lineup}:${dimension}`;
  let cached = lineupDimensionCache.get(key);
  if (!cached) {
    cached = laptops.filter((m) => m.lineup === lineup).map((m) => getPerformanceDimensions(m)[dimension]);
    lineupDimensionCache.set(key, cached);
  }
  return cached;
};

/** Compute what % of models in the same lineup this score beats */
export const getScorePercentile = (score: number, dimension: keyof PerformanceDimensions, lineup: string): number => {
  const scores = getLineupDimensionScores(dimension, lineup);
  if (scores.length === 0) return 0;
  const below = scores.filter((s) => s < score).length;
  return Math.round((below / scores.length) * 100);
};

/** Get the max score for a dimension within a lineup */
export const getLineupMaxScore = (dimension: keyof PerformanceDimensions, lineup: string): number => {
  const scores = getLineupDimensionScores(dimension, lineup);
  if (scores.length === 0) return 0;
  return Math.max(...scores);
};
