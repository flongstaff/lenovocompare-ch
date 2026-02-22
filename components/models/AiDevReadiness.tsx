"use client";

import { Cpu, Container } from "lucide-react";

interface AiDevReadinessProps {
  readonly ramGb: number;
  readonly cores: number;
  readonly threads: number;
}

type LlmTier = "smooth" | "usable" | "slow" | "N/A";

interface LlmModel {
  readonly label: string;
  readonly requiredRamGb: number;
}

const LLM_MODELS: readonly LlmModel[] = [
  { label: "7B", requiredRamGb: 6 },
  { label: "13B", requiredRamGb: 10 },
  { label: "34B", requiredRamGb: 20 },
  { label: "70B", requiredRamGb: 40 },
] as const;

const getLlmTier = (ramGb: number, requiredRamGb: number): LlmTier => {
  const headroom = ramGb - requiredRamGb;
  if (headroom >= 8) return "smooth";
  if (headroom >= 2) return "usable";
  if (headroom >= -2) return "slow";
  return "N/A";
};

const TIER_COLORS: Record<LlmTier, string> = {
  smooth: "#42be65",
  usable: "#4589ff",
  slow: "#f1c21b",
  "N/A": "#525252",
};

const TIER_BARS: Record<LlmTier, number> = {
  smooth: 100,
  usable: 65,
  slow: 30,
  "N/A": 5,
};

const getDockerEstimate = (ramGb: number, cores: number): { containers: number; note: string } => {
  // Assume ~2GB per typical dev container, OS needs ~4GB
  const availableRam = Math.max(0, ramGb - 4);
  const ramContainers = Math.floor(availableRam / 2);
  // Also limited by cores — each container benefits from ~2 cores
  const coreContainers = Math.floor(cores / 2);
  const containers = Math.min(ramContainers, coreContainers);

  if (containers >= 6) return { containers, note: "Full microservices stack" };
  if (containers >= 3) return { containers, note: "Good for multi-service dev" };
  if (containers >= 1) return { containers, note: "Basic containerized dev" };
  return { containers: 0, note: "Minimal Docker capacity" };
};

const AiDevReadiness = ({ ramGb, cores, threads }: AiDevReadinessProps) => {
  const docker = getDockerEstimate(ramGb, cores);

  return (
    <div className="space-y-3 rounded-lg p-3" style={{ background: "var(--surface)" }}>
      <h4
        className="border-l-[3px] pl-2 text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--muted)", borderColor: "var(--accent)" }}
      >
        AI &amp; Dev Readiness
      </h4>

      {/* Local LLMs */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Cpu size={12} style={{ color: "var(--accent)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
            Local LLMs
          </span>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            ({ramGb}GB RAM)
          </span>
        </div>
        <div className="space-y-1">
          {LLM_MODELS.map((m) => {
            const tier = getLlmTier(ramGb, m.requiredRamGb);
            const color = TIER_COLORS[tier];
            const barPct = TIER_BARS[tier];
            return (
              <div key={m.label} className="flex items-center gap-2">
                <span className="w-8 shrink-0 text-right font-mono text-xs font-medium" style={{ color }}>
                  {m.label}
                </span>
                <div className="h-1.5 flex-1 rounded-full" style={{ background: "var(--border-subtle)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${barPct}%`, background: color }}
                  />
                </div>
                <span className="w-14 shrink-0 text-xs" style={{ color }}>
                  {tier}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Docker */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <Container size={12} style={{ color: "#08bdba" }} />
          <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
            Docker
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-semibold" style={{ color: "#08bdba" }}>
            ~{docker.containers}
          </span>
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            containers ({ramGb}GB, {cores}C/{threads}T)
          </span>
        </div>
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {docker.note}
        </span>
      </div>
    </div>
  );
};

export default AiDevReadiness;
