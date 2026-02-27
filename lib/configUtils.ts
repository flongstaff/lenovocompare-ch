import type { Laptop, Processor, Display, Gpu, Ram, Storage } from "@/lib/types";

export interface ConfigState {
  processor: number | null;
  display: number | null;
  gpu: number | null;
  ram: number | null;
  storage: number | null;
}

export const initialConfigState: ConfigState = {
  processor: null,
  display: null,
  gpu: null,
  ram: null,
  storage: null,
};

export const formatProcessor = (p: Processor) => `${p.name} (${p.cores}C/${p.threads}T, ${p.tdp}W)`;

export const formatDisplay = (d: Display) =>
  `${d.size}" ${d.resolutionLabel} ${d.panel}, ${d.refreshRate}Hz, ${d.nits} nits${d.touchscreen ? ", Touch" : ""}`;

export const formatGpu = (g: Gpu) => `${g.name}${g.vram ? ` ${g.vram}GB` : ""}`;

export const formatRam = (r: Ram) => `${r.size}GB ${r.type}-${r.speed}${r.soldered ? " (soldered)" : ""}`;

export const formatStorageOption = (s: Storage) =>
  `${s.size >= 1024 ? `${s.size / 1024}TB` : `${s.size}GB`} ${s.type} (${s.slots} slot${s.slots > 1 ? "s" : ""})`;

export const buildConfiguredModel = (model: Laptop, config: ConfigState): Laptop =>
  ({
    ...model,
    processor:
      config.processor !== null && model.processorOptions?.[config.processor]
        ? model.processorOptions[config.processor]
        : model.processor,
    display:
      config.display !== null && model.displayOptions?.[config.display]
        ? model.displayOptions[config.display]
        : model.display,
    gpu: config.gpu !== null && model.gpuOptions?.[config.gpu] ? model.gpuOptions[config.gpu] : model.gpu,
    ram: config.ram !== null && model.ramOptions?.[config.ram] ? model.ramOptions[config.ram] : model.ram,
    storage:
      config.storage !== null && model.storageOptions?.[config.storage]
        ? model.storageOptions[config.storage]
        : model.storage,
  }) as Laptop;

export const hasConfigOptions = (model: Laptop): boolean =>
  (model.processorOptions?.length ?? 0) > 0 ||
  (model.displayOptions?.length ?? 0) > 0 ||
  (model.gpuOptions?.length ?? 0) > 0 ||
  (model.ramOptions?.length ?? 0) > 0 ||
  (model.storageOptions?.length ?? 0) > 0;
