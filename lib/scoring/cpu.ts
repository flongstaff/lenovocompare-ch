/**
 * CPU scoring — composite, single-core, and multi-core benchmark lookups.
 */
import { cpuBenchmarks, cpuBenchmarksExpanded } from "@/data/cpu-benchmarks";
import type { CpuBenchmarkData } from "../types";

export interface CpuBreakdown {
  readonly singleCore: number;
  readonly multiCore: number;
  readonly composite: number;
}

export const getPerformanceScore = (cpu: string): number => cpuBenchmarks[cpu] ?? 0;

export const getCpuSingleCore = (cpuName: string): number => cpuBenchmarksExpanded[cpuName]?.singleCore ?? 0;

export const getCpuMultiCore = (cpuName: string): number => cpuBenchmarksExpanded[cpuName]?.multiCore ?? 0;

export const getCpuScoreBreakdown = (cpuName: string): CpuBreakdown => ({
  singleCore: getCpuSingleCore(cpuName),
  multiCore: getCpuMultiCore(cpuName),
  composite: getPerformanceScore(cpuName),
});

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
