/**
 * Value scoring and price helpers.
 */
import type { Laptop, SwissPrice } from "../types";
import { getPerformanceScore } from "./cpu";
import { getGpuScore } from "./gpu";
import { getDisplayScore } from "./display";
import { getMemoryScore } from "./memory";
import { getConnectivityScore } from "./connectivity";
import { getPortabilityScore } from "./portability";

/**
 * Value score (max 100). Uses a weighted composite of all six dimensions
 * to give a fairer assessment than CPU performance alone:
 *   composite = perf*0.30 + gpu*0.15 + display*0.20 + memory*0.15 + connectivity*0.10 + portability*0.10
 * Then: round(composite / (lowestPrice / 1000) * 1.5), capped at 100.
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

export const getLowestPrice = (laptopId: string, prices: readonly SwissPrice[]): number | null => {
  const matching = prices.filter((p) => p.laptopId === laptopId);
  if (matching.length === 0) return null;
  return Math.min(...matching.map((p) => p.price));
};

export const getPricesForModel = (laptopId: string, prices: readonly SwissPrice[]): SwissPrice[] =>
  prices.filter((p) => p.laptopId === laptopId).sort((a, b) => a.price - b.price);
