/**
 * GPU scoring — score lookup, gaming tier, and benchmark entry access.
 */
import { gpuBenchmarks } from "@/data/gpu-benchmarks";
import type { GamingTier, GpuBenchmarkEntry } from "../types";

export interface GpuBreakdown {
  readonly score: number;
  readonly tier: GamingTier;
}

export const getGpuBenchmark = (gpuName: string): GpuBenchmarkEntry | null => gpuBenchmarks[gpuName] ?? null;

export const getGpuScore = (gpuName: string): number => gpuBenchmarks[gpuName]?.score ?? 0;

export const getGamingTier = (gpuName: string): GamingTier => gpuBenchmarks[gpuName]?.gamingTier ?? "None";

export const getGpuScoreBreakdown = (gpuName: string): GpuBreakdown => ({
  score: getGpuScore(gpuName),
  tier: getGamingTier(gpuName),
});
