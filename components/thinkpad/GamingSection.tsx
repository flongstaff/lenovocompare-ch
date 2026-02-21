"use client";

import { Gamepad2 } from "lucide-react";
import type { GamingTier, GpuBenchmarkEntry } from "@/lib/types";
import FpsChart from "@/components/charts/FpsChart";

interface GamingSectionProps {
  readonly gpuName: string;
  readonly gamingTier: GamingTier;
  readonly benchmark: GpuBenchmarkEntry | null;
}

const TIER_CONFIG: Record<GamingTier, { label: string; color: string; advice: string }> = {
  None: {
    label: "Not for Gaming",
    color: "#da1e28",
    advice: "This GPU is too weak for meaningful gaming. Stick to 2D indie titles or cloud gaming services.",
  },
  Light: {
    label: "Light Gaming",
    color: "#f1c21b",
    advice: "Handles esports and indie titles at low settings. Expect 30-60 FPS in competitive shooters at 720p.",
  },
  Medium: {
    label: "Medium Gaming",
    color: "#42be65",
    advice: "Playable in most titles at 720p-1080p low-medium. Good for esports at 1080p.",
  },
  Heavy: {
    label: "Heavy Gaming",
    color: "#4589ff",
    advice: "Capable of running AAA titles at 1080p medium-high. Solid 60+ FPS in esports at high settings.",
  },
};

const GamingSection = ({ gpuName, gamingTier, benchmark }: GamingSectionProps) => {
  const config = TIER_CONFIG[gamingTier];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Gamepad2 size={18} style={{ color: "var(--muted)" }} />
        <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
          Gaming Capability
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="px-2 py-1 text-xs font-semibold uppercase tracking-wider"
          style={{ background: config.color + "20", color: config.color, border: `1px solid ${config.color}40` }}
        >
          {config.label}
        </span>
        <span className="text-sm" style={{ color: "var(--muted)" }}>
          {gpuName}
        </span>
      </div>

      <p className="text-sm" style={{ color: "var(--muted)" }}>
        {config.advice}
      </p>

      {benchmark && benchmark.fpsEstimates.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium" style={{ color: "var(--foreground)" }}>
            Estimated FPS
          </h3>
          <FpsChart estimates={benchmark.fpsEstimates} />
          <p className="mt-2 text-[10px]" style={{ color: "var(--muted)" }}>
            Estimates based on publicly available benchmark data. Actual performance varies by driver version, thermal
            throttling, and game updates.
          </p>
        </div>
      )}
    </div>
  );
};

export default GamingSection;
