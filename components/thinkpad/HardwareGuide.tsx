"use client";

import { cpuGuide, gpuGuide } from "@/data/hardware-guide";
import { cpuBenchmarks } from "@/data/cpu-benchmarks";
import { gpuBenchmarks } from "@/data/gpu-benchmarks";
import ChipDetailCard from "./ChipDetailCard";

interface HardwareGuideProps {
  readonly cpuName: string;
  readonly gpuName: string;
}

const HardwareGuide = ({ cpuName, gpuName }: HardwareGuideProps) => {
  const cpuEntry = cpuGuide[cpuName];
  const gpuEntry = gpuGuide[gpuName];

  if (!cpuEntry && !gpuEntry) return null;

  const cpuScore = cpuBenchmarks[cpuName];
  const gpuScore = gpuBenchmarks[gpuName]?.score;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
        Hardware Guide
      </h2>
      {cpuEntry && <ChipDetailCard name={cpuName} entry={cpuEntry} score={cpuScore} type="cpu" compact />}
      {gpuEntry && <ChipDetailCard name={gpuName} entry={gpuEntry} score={gpuScore} type="gpu" compact />}
    </div>
  );
};

export default HardwareGuide;
