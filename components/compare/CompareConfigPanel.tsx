"use client";

import { useState, useCallback } from "react";
import { Settings2, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import type { Laptop } from "@/lib/types";
import {
  type ConfigState,
  initialConfigState,
  formatProcessor,
  formatDisplay,
  formatGpu,
  formatRam,
  formatStorageOption,
  hasConfigOptions,
} from "@/lib/configUtils";

interface CompareConfigPanelProps {
  readonly models: readonly Laptop[];
  readonly configs: Record<string, ConfigState>;
  readonly onConfigChange: (laptopId: string, config: ConfigState) => void;
  readonly onResetAll: () => void;
}

const ConfigCard = ({
  model,
  config,
  onChange,
}: {
  model: Laptop;
  config: ConfigState;
  onChange: (key: keyof ConfigState, value: string) => void;
}) => {
  return (
    <div className="carbon-card p-3">
      <h3 className="mb-2 text-sm font-semibold" style={{ color: "var(--foreground)" }}>
        {model.name}
      </h3>
      <div className="space-y-2">
        {(model.processorOptions?.length ?? 0) > 0 && (
          <div>
            <label className="mb-0.5 block text-[11px]" style={{ color: "var(--muted)" }}>
              Processor
            </label>
            <select
              className="carbon-select w-full text-xs"
              value={config.processor ?? ""}
              onChange={(e) => onChange("processor", e.target.value)}
            >
              <option value="">{formatProcessor(model.processor)}</option>
              {model.processorOptions!.map((p, i) => (
                <option key={i} value={i}>
                  {formatProcessor(p)}
                </option>
              ))}
            </select>
          </div>
        )}
        {(model.displayOptions?.length ?? 0) > 0 && (
          <div>
            <label className="mb-0.5 block text-[11px]" style={{ color: "var(--muted)" }}>
              Display
            </label>
            <select
              className="carbon-select w-full text-xs"
              value={config.display ?? ""}
              onChange={(e) => onChange("display", e.target.value)}
            >
              <option value="">{formatDisplay(model.display)}</option>
              {model.displayOptions!.map((d, i) => (
                <option key={i} value={i}>
                  {formatDisplay(d)}
                </option>
              ))}
            </select>
          </div>
        )}
        {(model.gpuOptions?.length ?? 0) > 0 && (
          <div>
            <label className="mb-0.5 block text-[11px]" style={{ color: "var(--muted)" }}>
              GPU
            </label>
            <select
              className="carbon-select w-full text-xs"
              value={config.gpu ?? ""}
              onChange={(e) => onChange("gpu", e.target.value)}
            >
              <option value="">{formatGpu(model.gpu)}</option>
              {model.gpuOptions!.map((g, i) => (
                <option key={i} value={i}>
                  {formatGpu(g)}
                </option>
              ))}
            </select>
          </div>
        )}
        {(model.ramOptions?.length ?? 0) > 0 && (
          <div>
            <label className="mb-0.5 block text-[11px]" style={{ color: "var(--muted)" }}>
              Memory
            </label>
            <select
              className="carbon-select w-full text-xs"
              value={config.ram ?? ""}
              onChange={(e) => onChange("ram", e.target.value)}
            >
              <option value="">{formatRam(model.ram)}</option>
              {model.ramOptions!.map((r, i) => (
                <option key={i} value={i}>
                  {formatRam(r)}
                </option>
              ))}
            </select>
          </div>
        )}
        {(model.storageOptions?.length ?? 0) > 0 && (
          <div>
            <label className="mb-0.5 block text-[11px]" style={{ color: "var(--muted)" }}>
              Storage
            </label>
            <select
              className="carbon-select w-full text-xs"
              value={config.storage ?? ""}
              onChange={(e) => onChange("storage", e.target.value)}
            >
              <option value="">{formatStorageOption(model.storage)}</option>
              {model.storageOptions!.map((s, i) => (
                <option key={i} value={i}>
                  {formatStorageOption(s)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export const CompareConfigPanel = ({ models, configs, onConfigChange, onResetAll }: CompareConfigPanelProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = useCallback(
    (laptopId: string, key: keyof ConfigState, value: string) => {
      const current = configs[laptopId] ?? initialConfigState;
      const next = { ...current, [key]: value === "" ? null : Number(value) };
      onConfigChange(laptopId, next);
    },
    [configs, onConfigChange],
  );

  const modelsWithOptions = models.filter(hasConfigOptions);
  if (modelsWithOptions.length === 0) return null;

  const hasAnyOverride = Object.values(configs).some((c) => Object.values(c).some((v) => v !== null));

  return (
    <div className="carbon-card overflow-hidden">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-carbon-600"
      >
        <div className="flex items-center gap-2">
          <Settings2 size={16} style={{ color: "var(--accent)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Configure Models
          </span>
          {hasAnyOverride && <span className="carbon-chip-success px-1.5 py-0.5 text-[10px]">Modified</span>}
        </div>
        {expanded ? (
          <ChevronUp size={14} style={{ color: "var(--muted)" }} />
        ) : (
          <ChevronDown size={14} style={{ color: "var(--muted)" }} />
        )}
      </button>
      {expanded && (
        <div className="border-t border-carbon-500 p-4">
          {hasAnyOverride && (
            <div className="mb-3 flex justify-end">
              <button onClick={onResetAll} className="carbon-btn-ghost flex items-center gap-1 !px-2 !py-1 text-xs">
                <RotateCcw size={12} /> Reset All
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {modelsWithOptions.map((model) => (
              <ConfigCard
                key={model.id}
                model={model}
                config={configs[model.id] ?? initialConfigState}
                onChange={(key, value) => handleChange(model.id, key, value)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
