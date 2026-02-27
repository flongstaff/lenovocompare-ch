"use client";

import type { PerformanceDimensions } from "@/lib/types";
import { COMPARE_COLORS } from "@/lib/constants";
import { shortName } from "@/lib/formatters";
import { PolarBar } from "@/components/charts/PolarBar";
import type { CompareEntry } from "@/components/charts/PolarBar";

interface ModelData {
  readonly name: string;
  readonly dimensions: PerformanceDimensions;
}

interface PerformanceRadarProps {
  readonly models: readonly ModelData[];
}

const DIMENSION_LABELS: Record<keyof PerformanceDimensions, string> = {
  cpu: "CPU",
  gpu: "GPU",
  memory: "Memory",
  portability: "Portable",
  display: "Display",
  connectivity: "Connect",
};

const DIMENSION_HINTS: Record<keyof PerformanceDimensions, string> = {
  cpu: "Processing power (single + multi-core)",
  gpu: "Graphics capability and gaming potential",
  memory: "RAM size, type, upgradability & storage",
  portability: "Weight and battery capacity",
  display: "Resolution, panel type, brightness & refresh",
  connectivity: "Ports, Thunderbolt, Wi-Fi & Bluetooth",
};

const PerformanceRadar = ({ models }: PerformanceRadarProps) => {
  if (models.length === 1) {
    return (
      <div className="flex w-full justify-center">
        <PolarBar scores={models[0].dimensions} />
      </div>
    );
  }

  const axes = Object.keys(DIMENSION_LABELS) as (keyof PerformanceDimensions)[];

  // First model is primary, rest are compare overlays
  const primary = models[0];
  const compareScores: CompareEntry[] = models.slice(1).map((m, i) => ({
    name: shortName(m.name),
    scores: m.dimensions,
    color: COMPARE_COLORS[(i + 1) % COMPARE_COLORS.length],
  }));

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <PolarBar scores={primary.dimensions} color={COMPARE_COLORS[0]} compareScores={compareScores} />
      </div>
      {models.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3 pb-2 pt-1">
          {models.map((m, i) => (
            <div key={m.name} className="flex items-center gap-1.5 text-xs" style={{ color: "#f4f4f4" }}>
              <span
                className="inline-block h-2.5 w-2.5"
                style={{ background: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
              />
              {shortName(m.name)}
            </div>
          ))}
        </div>
      )}
      {models.length > 1 && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2" style={{ borderTop: "1px solid #393939" }}>
          {axes.map((key) => {
            const scores = models.map((m) => m.dimensions[key]);
            if (scores.length === 0) return null;
            const maxScore = Math.max(...scores);
            const leadIdx = scores.indexOf(maxScore);
            const tied = scores.filter((s) => s === maxScore).length > 1;
            return (
              <div key={key} className="flex items-start gap-1.5 py-0.5 text-[10px]">
                <span className="shrink-0 font-semibold" style={{ color: "#f4f4f4", minWidth: 48 }}>
                  {DIMENSION_LABELS[key]}
                </span>
                <span style={{ color: "#a8a8a8" }}>
                  {DIMENSION_HINTS[key]}
                  {!tied && (
                    <span style={{ color: COMPARE_COLORS[leadIdx % COMPARE_COLORS.length] }}>
                      {" "}
                      · {shortName(models[leadIdx].name)} leads ({maxScore})
                    </span>
                  )}
                  {tied && <span style={{ color: "#c6c6c6" }}> · Tied ({maxScore})</span>}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PerformanceRadar;
