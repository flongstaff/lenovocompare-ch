import { laptops } from "@/data/laptops";
import { getCpuSingleCore, getCpuMultiCore, getGpuScore } from "./scoring";

const percentile = (value: number, allValues: number[]): number => {
  const below = allValues.filter((v) => v < value).length;
  return Math.round((below / allValues.length) * 100);
};

const allCpuSingle = laptops.map((l) => getCpuSingleCore(l.processor.name)).filter((s) => s > 0);
const allCpuMulti = laptops.map((l) => getCpuMultiCore(l.processor.name)).filter((s) => s > 0);
const allGpu = laptops.map((l) => getGpuScore(l.gpu.name)).filter((s) => s > 0);

export const getCpuSinglePercentile = (cpuName: string): number | null => {
  const score = getCpuSingleCore(cpuName);
  return score > 0 ? percentile(score, allCpuSingle) : null;
};

export const getCpuMultiPercentile = (cpuName: string): number | null => {
  const score = getCpuMultiCore(cpuName);
  return score > 0 ? percentile(score, allCpuMulti) : null;
};

export const getGpuPercentile = (gpuName: string): number | null => {
  const score = getGpuScore(gpuName);
  return score > 0 ? percentile(score, allGpu) : null;
};
