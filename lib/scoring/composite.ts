/**
 * Composite scoring — aggregate model scores, performance dimensions, model benchmarks, and lineup percentile helpers.
 */
import type {
  Laptop,
  SwissPrice,
  GpuBenchmarkEntry,
  GamingTier,
  PerformanceDimensions,
  ModelBenchmarks,
} from "../types";
import { laptops } from "@/data/laptops";
import { modelBenchmarks } from "@/data/model-benchmarks";
import { getPerformanceScore, getCpuSingleCore, getCpuMultiCore } from "./cpu";
import { getGpuBenchmark, getGpuScore, getGamingTier } from "./gpu";
import { getDisplayScore } from "./display";
import { getMemoryScore } from "./memory";
import { getConnectivityScore } from "./connectivity";
import { getPortabilityScore } from "./portability";
import { getValueScore, getLowestPrice } from "./value";

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

export const getModelBenchmarks = (laptopId: string): ModelBenchmarks | null => modelBenchmarks[laptopId] ?? null;

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
