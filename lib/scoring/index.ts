/**
 * Scoring engine — barrel re-export of all scoring sub-modules.
 *
 * Computes 0-100 scores across 6 dimensions for each laptop model.
 * Dimensions: CPU performance, GPU, display quality, memory/storage, connectivity, portability.
 * Scores are absolute across all lineups (Legion dGPUs 55-92, ThinkPad iGPUs 8-40).
 * Value score is derived from composite performance-per-CHF when pricing data is available.
 */

// Shared types
export type { ScoreComponent } from "./utils";

// CPU
export {
  getPerformanceScore,
  getCpuSingleCore,
  getCpuMultiCore,
  getCpuScoreBreakdown,
  getCpuRawBenchmarks,
} from "./cpu";
export type { CpuBreakdown } from "./cpu";

// GPU
export { getGpuBenchmark, getGpuScore, getGamingTier, getGpuScoreBreakdown } from "./gpu";
export type { GpuBreakdown } from "./gpu";

// Display
export { getDisplayScoreBreakdown, getDisplayScore } from "./display";
export type { DisplayBreakdown } from "./display";

// Memory
export { getMemoryScoreBreakdown, getMemoryScore } from "./memory";
export type { MemoryBreakdown } from "./memory";

// Connectivity
export { getConnectivityScoreBreakdown, getConnectivityScore } from "./connectivity";
export type { ConnectivityBreakdown } from "./connectivity";

// Portability
export { getPortabilityScore, getPortabilityScoreBreakdown } from "./portability";
export type { PortabilityBreakdown } from "./portability";

// Value & price helpers
export { getValueScore, getLowestPrice, getPricesForModel } from "./value";

// Composite (aggregate scores, dimensions, benchmarks, percentiles)
export {
  getModelScores,
  getPerformanceDimensions,
  getModelBenchmarks,
  getScorePercentile,
  getLineupMaxScore,
} from "./composite";
export type { ModelScores } from "./composite";
