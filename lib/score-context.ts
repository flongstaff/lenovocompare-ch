import type { Laptop } from "./types";
import { laptops } from "@/data/laptops";
import {
  getPerformanceScore,
  getGpuScore,
  getDisplayScore,
  getMemoryScore,
  getConnectivityScore,
  getPortabilityScore,
} from "./scoring";

export type Dimension =
  | "cpu"
  | "gpu"
  | "memory"
  | "display"
  | "connectivity"
  | "portability";

interface ScoreContext {
  readonly average: number;
  readonly groupLabel: string;
  readonly percentile: number;
  readonly comparisonText: string;
}

const getDimensionScore = (dim: Dimension, model: Laptop): number => {
  switch (dim) {
    case "cpu":
      return getPerformanceScore(model.processor.name);
    case "gpu":
      return getGpuScore(model.gpu.name);
    case "display":
      return getDisplayScore(model);
    case "memory":
      return getMemoryScore(model);
    case "connectivity":
      return getConnectivityScore(model);
    case "portability":
      return getPortabilityScore(model);
  }
};

export const getScoreContext = (dim: Dimension, model: Laptop): ScoreContext => {
  const allScores = laptops.map((m) => getDimensionScore(dim, m));
  const modelScore = getDimensionScore(dim, model);

  // Series group — fall back to lineup if series has < 3 models
  const seriesModels = laptops.filter(
    (m) => m.lineup === model.lineup && m.series === model.series,
  );
  const useSeriesGroup = seriesModels.length >= 3;

  const groupModels = useSeriesGroup
    ? seriesModels
    : laptops.filter((m) => m.lineup === model.lineup);
  const groupLabel = useSeriesGroup
    ? `${model.lineup} ${model.series}-series`
    : `${model.lineup} lineup`;

  const groupScores = groupModels.map((m) => getDimensionScore(dim, m));
  const average = Math.round(
    groupScores.reduce((a, b) => a + b, 0) / groupScores.length,
  );

  // Percentile
  const below = allScores.filter((s) => s < modelScore).length;
  const percentile = Math.round((below / allScores.length) * 100);

  // Comparison text
  const diff = modelScore - average;
  const diffLabel = diff > 0 ? `+${diff}` : `${diff}`;
  const relation = diff > 5 ? "Above" : diff < -5 ? "Below" : "Near";
  const comparisonText = `${relation} ${groupLabel} avg (${average}, ${diffLabel}) · Top ${100 - percentile}% overall`;

  return { average, groupLabel, percentile, comparisonText };
};

const interpretations: Record<
  Dimension,
  readonly [string, string, string, string]
> = {
  cpu: [
    "Heavy compilation, video encoding, and ML workloads",
    "Strong multitasking and moderate content creation",
    "Office work, web browsing, and light development",
    "Basic tasks — may lag under sustained load",
  ],
  gpu: [
    "Modern gaming at 1080p+ and GPU-accelerated rendering",
    "Light gaming, photo editing, and hardware video decode",
    "Video playback and basic graphics tasks",
    "Display output only — no GPU-intensive work",
  ],
  memory: [
    "Large datasets, VMs, and heavy multitasking with room to grow",
    "Comfortable for most professional workloads",
    "Adequate for everyday use, limited upgrade headroom",
    "Constrained — may struggle with multiple apps",
  ],
  display: [
    "Exceptional for color-critical work and media consumption",
    "Good visual quality for professional and creative tasks",
    "Serviceable for productivity and casual use",
    "Basic display — fine for text-heavy work",
  ],
  connectivity: [
    "Fully loaded — docking, peripherals, and fast networking covered",
    "Strong port selection for most workflows",
    "Covers the basics but may need adapters",
    "Limited — adapter or dock recommended",
  ],
  portability: [
    "Ultra-portable — easy all-day carry with long battery",
    "Good balance of weight and battery life",
    "Reasonable for occasional travel",
    "Desktop replacement — best used stationary",
  ],
};

export const getInterpretation = (dim: Dimension, score: number): string => {
  const texts = interpretations[dim];
  if (score >= 80) return texts[0];
  if (score >= 60) return texts[1];
  if (score >= 40) return texts[2];
  return texts[3];
};
