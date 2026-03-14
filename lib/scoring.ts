/**
 * Scoring engine — re-exports from tree-shakeable sub-modules in lib/scoring/.
 *
 * This file exists for backward compatibility so that `import from "@/lib/scoring"`
 * continues to work. New code can import directly from sub-modules:
 *   import { getDisplayScore } from "@/lib/scoring/display";
 *
 * Dimensions: CPU performance, GPU, display quality, memory/storage, connectivity, portability.
 * Scores are absolute across all lineups (Legion dGPUs 55-92, ThinkPad iGPUs 8-40).
 * Value score is derived from composite performance-per-CHF when pricing data is available.
 */

// Shared types
export type { ScoreComponent } from "./scoring/utils";

// CPU
export {
  getPerformanceScore,
  getCpuSingleCore,
  getCpuMultiCore,
  getCpuScoreBreakdown,
  getCpuRawBenchmarks,
} from "./scoring/cpu";
export type { CpuBreakdown } from "./scoring/cpu";

// GPU
export { getGpuBenchmark, getGpuScore, getGamingTier, getGpuScoreBreakdown } from "./scoring/gpu";
export type { GpuBreakdown } from "./scoring/gpu";

// Display
export { getDisplayScoreBreakdown, getDisplayScore } from "./scoring/display";
export type { DisplayBreakdown } from "./scoring/display";

// Memory
export { getMemoryScoreBreakdown, getMemoryScore } from "./scoring/memory";
export type { MemoryBreakdown } from "./scoring/memory";

// Connectivity
export { getConnectivityScoreBreakdown, getConnectivityScore } from "./scoring/connectivity";
export type { ConnectivityBreakdown } from "./scoring/connectivity";

// Portability
export { getPortabilityScore, getPortabilityScoreBreakdown } from "./scoring/portability";
export type { PortabilityBreakdown } from "./scoring/portability";

// Value & price helpers
export { getValueScore, getLowestPrice, getPricesForModel } from "./scoring/value";

// Composite (aggregate scores, dimensions, benchmarks, percentiles)
export {
  getModelScores,
  getPerformanceDimensions,
  getModelBenchmarks,
  getScorePercentile,
  getLineupMaxScore,
} from "./scoring/composite";
export type { ModelScores } from "./scoring/composite";
