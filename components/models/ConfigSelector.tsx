"use client";

import { useState, useCallback } from "react";
import { Settings2, RotateCcw } from "lucide-react";
import type { Laptop } from "@/lib/types";
import {
  type ConfigState,
  initialConfigState,
  formatProcessor,
  formatDisplay,
  formatGpu,
  formatRam,
  formatStorageOption,
  buildConfiguredModel,
} from "@/lib/configUtils";

interface ConfigSelectorProps {
  readonly model: Laptop;
  readonly onConfigChange: (configured: Laptop) => void;
}

const ConfigSelector = ({ model, onConfigChange }: ConfigSelectorProps) => {
  const [config, setConfig] = useState<ConfigState>(initialConfigState);

  const hasOptions =
    (model.processorOptions && model.processorOptions.length > 0) ||
    (model.displayOptions && model.displayOptions.length > 0) ||
    (model.gpuOptions && model.gpuOptions.length > 0) ||
    (model.ramOptions && model.ramOptions.length > 0) ||
    (model.storageOptions && model.storageOptions.length > 0);

  const handleChange = useCallback(
    (key: keyof ConfigState, value: string) => {
      const next = { ...config, [key]: value === "" ? null : Number(value) };
      setConfig(next);
      onConfigChange(buildConfiguredModel(model, next));
    },
    [config, model, onConfigChange],
  );

  const handleReset = useCallback(() => {
    setConfig(initialConfigState);
    onConfigChange(model);
  }, [model, onConfigChange]);

  if (!hasOptions) return null;

  const isModified = Object.values(config).some((v) => v !== null);

  return (
    <div className="carbon-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 size={18} style={{ color: "var(--accent)" }} />
          <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            Configuration
          </h2>
        </div>
        {isModified && (
          <button onClick={handleReset} className="carbon-btn-ghost flex items-center gap-1 !px-2 !py-1 text-xs">
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {model.processorOptions && model.processorOptions.length > 0 && (
          <div>
            <label className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
              Processor
            </label>
            <select
              className="carbon-select w-full text-sm"
              value={config.processor ?? ""}
              onChange={(e) => handleChange("processor", e.target.value)}
            >
              <option value="">Default: {formatProcessor(model.processor)}</option>
              {model.processorOptions.map((p, i) => (
                <option key={i} value={i}>
                  {formatProcessor(p)}
                </option>
              ))}
            </select>
          </div>
        )}

        {model.displayOptions && model.displayOptions.length > 0 && (
          <div>
            <label className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
              Display
            </label>
            <select
              className="carbon-select w-full text-sm"
              value={config.display ?? ""}
              onChange={(e) => handleChange("display", e.target.value)}
            >
              <option value="">Default: {formatDisplay(model.display)}</option>
              {model.displayOptions.map((d, i) => (
                <option key={i} value={i}>
                  {formatDisplay(d)}
                </option>
              ))}
            </select>
          </div>
        )}

        {model.gpuOptions && model.gpuOptions.length > 0 && (
          <div>
            <label className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
              GPU
            </label>
            <select
              className="carbon-select w-full text-sm"
              value={config.gpu ?? ""}
              onChange={(e) => handleChange("gpu", e.target.value)}
            >
              <option value="">Default: {formatGpu(model.gpu)}</option>
              {model.gpuOptions.map((g, i) => (
                <option key={i} value={i}>
                  {formatGpu(g)}
                </option>
              ))}
            </select>
          </div>
        )}

        {model.ramOptions && model.ramOptions.length > 0 && (
          <div>
            <label className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
              Memory
            </label>
            <select
              className="carbon-select w-full text-sm"
              value={config.ram ?? ""}
              onChange={(e) => handleChange("ram", e.target.value)}
            >
              <option value="">Default: {formatRam(model.ram)}</option>
              {model.ramOptions.map((r, i) => (
                <option key={i} value={i}>
                  {formatRam(r)}
                </option>
              ))}
            </select>
          </div>
        )}

        {model.storageOptions && model.storageOptions.length > 0 && (
          <div>
            <label className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
              Storage
            </label>
            <select
              className="carbon-select w-full text-sm"
              value={config.storage ?? ""}
              onChange={(e) => handleChange("storage", e.target.value)}
            >
              <option value="">Default: {formatStorageOption(model.storage)}</option>
              {model.storageOptions.map((s, i) => (
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

export default ConfigSelector;
