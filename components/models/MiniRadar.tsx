import { PolarBar } from "@/components/charts/PolarBar";
import type { PerformanceDimensions } from "@/lib/types";

interface MiniRadarProps {
  readonly scores: {
    readonly perf: number;
    readonly display: number;
    readonly memory: number;
    readonly gpu: number;
    readonly portability: number;
  };
  readonly color: string;
}

export const MiniRadar = ({ scores, color }: MiniRadarProps) => {
  const dimensions: PerformanceDimensions = {
    cpu: scores.perf,
    gpu: scores.gpu,
    memory: scores.memory,
    display: scores.display,
    connectivity: 50,
    portability: scores.portability,
  };

  return <PolarBar scores={dimensions} compact color={color} />;
};
