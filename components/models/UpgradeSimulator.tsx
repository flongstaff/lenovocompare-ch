"use client";

import { useState } from "react";
import { MemoryStick, HardDrive, TrendingUp } from "lucide-react";
import type { Laptop } from "@/lib/types";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { getMemoryScore } from "@/lib/scoring";
import { formatStorage } from "@/lib/formatters";

interface UpgradeSimulatorProps {
  readonly model: Laptop;
}

const RAM_OPTIONS = [8, 16, 32, 64, 96, 128] as const;
const STORAGE_OPTIONS = [256, 512, 1024, 2048, 4096] as const;

const UpgradeSimulator = ({ model }: UpgradeSimulatorProps) => {
  const [simRam, setSimRam] = useState(model.ram.size);
  const [simStorage, setSimStorage] = useState(model.storage.size);
  const [simStorage2, setSimStorage2] = useState(0);

  const canUpgradeRam = !model.ram.soldered;
  const ramChoices = RAM_OPTIONS.filter((r) => r >= model.ram.size && r <= model.ram.maxSize);
  const hasSecondSlot = model.storage.slots >= 2;

  const originalScore = getMemoryScore(model);

  // Build simulated model with overridden RAM/storage
  const simModel: Laptop = {
    ...model,
    ram: { ...model.ram, size: simRam },
    storage: { ...model.storage, size: simStorage + simStorage2 },
  };
  const simScore = getMemoryScore(simModel);
  const delta = simScore - originalScore;

  const hasChanges = simRam !== model.ram.size || simStorage !== model.storage.size || simStorage2 !== 0;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
        <TrendingUp size={18} className="-mt-0.5 mr-2 inline" style={{ color: "var(--accent-light)" }} />
        Upgrade Simulator
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* RAM */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <MemoryStick size={14} style={{ color: "var(--muted)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              RAM
            </span>
          </div>
          {canUpgradeRam ? (
            <>
              <select
                value={simRam}
                onChange={(e) => setSimRam(Number(e.target.value))}
                className="carbon-select w-full text-sm"
              >
                {ramChoices.map((r) => (
                  <option key={r} value={r}>
                    {r}GB {r === model.ram.size ? "(current)" : ""}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                {model.ram.slots} slot{model.ram.slots > 1 ? "s" : ""} · {model.ram.type}-{model.ram.speed} · Max{" "}
                {model.ram.maxSize}GB
              </p>
            </>
          ) : (
            <div className="px-3 py-2 text-sm" style={{ background: "var(--surface)", color: "var(--muted)" }}>
              {model.ram.size}GB {model.ram.type} — Soldered (not upgradeable)
            </div>
          )}
        </div>

        {/* Storage */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <HardDrive size={14} style={{ color: "var(--muted)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Storage {hasSecondSlot ? "(Slot 1)" : ""}
            </span>
          </div>
          <select
            value={simStorage}
            onChange={(e) => setSimStorage(Number(e.target.value))}
            className="carbon-select w-full text-sm"
          >
            {STORAGE_OPTIONS.filter((s) => s >= model.storage.size).map((s) => (
              <option key={s} value={s}>
                {formatStorage(s)} {s === model.storage.size ? "(current)" : ""}
              </option>
            ))}
          </select>

          {hasSecondSlot && (
            <div className="mt-3">
              <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                Storage (Slot 2)
              </span>
              <select
                value={simStorage2}
                onChange={(e) => setSimStorage2(Number(e.target.value))}
                className="carbon-select mt-1 w-full text-sm"
              >
                <option value={0}>Empty</option>
                {STORAGE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {formatStorage(s)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Score comparison */}
      <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Memory Score
          </span>
          {hasChanges && delta !== 0 && (
            <span
              className={`px-1.5 py-0.5 font-mono text-xs font-semibold ${delta > 0 ? "bg-[color-mix(in_srgb,var(--status-success)_15%,transparent)] text-status-success" : "bg-[color-mix(in_srgb,var(--trackpoint)_15%,transparent)] text-trackpoint"}`}
            >
              {delta > 0 ? "+" : ""}
              {delta}
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          {hasChanges && (
            <div className="opacity-40">
              <ScoreBar score={originalScore} label="Current" color="#be95ff" size="md" />
            </div>
          )}
          <ScoreBar score={simScore} label={hasChanges ? "Upgrade" : "Current"} color="#be95ff" size="md" />
        </div>
      </div>
    </div>
  );
};

export default UpgradeSimulator;
