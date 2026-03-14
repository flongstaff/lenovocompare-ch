"use client";

import type { Laptop } from "@/lib/types";
import type { getModelScores } from "@/lib/scoring";
import { formatWeight, formatStorage } from "@/lib/formatters";
import dynamic from "next/dynamic";

const ChartSkeleton = () => <div className="carbon-card animate-pulse" style={{ height: 200 }} />;
const PerformanceRadar = dynamic(() => import("@/components/charts/PerformanceRadar"), {
  ssr: false,
  loading: ChartSkeleton,
});
const BenchmarkBar = dynamic(() => import("@/components/charts/BenchmarkBar"), { ssr: false, loading: ChartSkeleton });
const ScoreCardExpanded = dynamic(() => import("@/components/models/ScoreCardExpanded"), {
  ssr: false,
  loading: ChartSkeleton,
});
const AiDevReadiness = dynamic(() => import("@/components/models/AiDevReadiness"), {
  ssr: false,
  loading: ChartSkeleton,
});

export const PerformanceOverview = ({
  model,
  configuredModel,
  sc,
}: {
  readonly model: Laptop;
  readonly configuredModel: Laptop;
  readonly sc: ReturnType<typeof getModelScores>;
}) => (
  <div id="performance" className="carbon-card scroll-mt-14 p-4">
    <h2 className="mb-3 text-lg font-semibold sm:text-xl" style={{ color: "var(--foreground)" }}>
      Performance Overview
    </h2>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <PerformanceRadar models={[{ name: model.name, dimensions: sc.dimensions }]} />
        <AiDevReadiness
          ramGb={configuredModel.ram.size}
          cores={configuredModel.processor.cores}
          threads={configuredModel.processor.threads}
        />
      </div>
      <div className="space-y-2">
        <ScoreCardExpanded
          model={configuredModel}
          dimensions={[
            {
              key: "cpu",
              label: "CPU",
              score: sc.dimensions.cpu,
              color: "#0f62fe",
              detail: `${configuredModel.processor.name} · ${configuredModel.processor.cores}C/${configuredModel.processor.threads}T`,
            },
            {
              key: "gpu",
              label: "GPU",
              score: sc.dimensions.gpu,
              color: "#42be65",
              detail: `${configuredModel.gpu.name}${configuredModel.gpu.integrated ? " (iGPU)" : ""}`,
            },
            {
              key: "memory",
              label: "Memory",
              score: sc.dimensions.memory,
              color: "#be95ff",
              detail: `${configuredModel.ram.size}GB ${configuredModel.ram.type} · ${formatStorage(configuredModel.storage.size)}`,
            },
            {
              key: "display",
              label: "Display",
              score: sc.dimensions.display,
              color: "#ee5396",
              detail: `${configuredModel.display.size}" ${configuredModel.display.resolutionLabel} ${configuredModel.display.panel} ${configuredModel.display.refreshRate}Hz`,
            },
            {
              key: "connectivity",
              label: "Connect",
              score: sc.dimensions.connectivity,
              color: "#08bdba",
              detail: `${configuredModel.ports.length} ports${model.wireless.length > 0 ? ` · ${model.wireless[0]}` : ""}`,
            },
            {
              key: "portability",
              label: "Portable",
              score: sc.dimensions.portability,
              color: "#42be65",
              detail: `${formatWeight(model.weight)} · ${model.battery.whr} Wh`,
            },
          ]}
        />
      </div>
    </div>
    {(sc.singleCore > 0 || sc.multiCore > 0 || sc.gpu > 0) && (
      <div className="mt-4">
        <BenchmarkBar
          items={[
            ...(sc.singleCore > 0 ? [{ label: "Single-Core", value: sc.singleCore, color: "#4589ff" }] : []),
            ...(sc.multiCore > 0 ? [{ label: "Multi-Core", value: sc.multiCore, color: "#ee5396" }] : []),
            ...(sc.gpu > 0 ? [{ label: "GPU", value: sc.gpu, color: "#42be65" }] : []),
          ]}
        />
      </div>
    )}
  </div>
);
