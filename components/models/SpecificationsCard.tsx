"use client";

import { Cpu, Monitor, HardDrive, Wifi, Battery, Weight, Usb, Keyboard as KeyboardIcon } from "lucide-react";
import type { Laptop } from "@/lib/types";
import { formatWeight, formatStorage } from "@/lib/formatters";

const SpecRow = ({
  label,
  value,
  icon: Icon,
  even,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ size?: string | number; className?: string; style?: React.CSSProperties }>;
  even?: boolean;
}) => (
  <div
    className="flex items-start gap-3 px-2 py-2"
    style={{ background: even ? "var(--surface-inset)" : "transparent" }}
  >
    {Icon && <Icon size={15} style={{ color: "var(--icon-muted)" }} className="mt-0.5 shrink-0" />}
    <span
      className="w-20 shrink-0 font-mono text-[11px] font-medium uppercase tracking-wider"
      style={{ color: "var(--muted)" }}
    >
      {label}
    </span>
    <span className="text-sm leading-snug" style={{ color: "var(--foreground)" }}>
      {value}
    </span>
  </div>
);

export const SpecificationsCard = ({
  model,
  configuredModel,
}: {
  readonly model: Laptop;
  readonly configuredModel: Laptop;
}) => (
  <div id="specs" className="carbon-card scroll-mt-14 p-3">
    <h2 className="mb-2 text-base font-semibold sm:text-lg" style={{ color: "var(--foreground)" }}>
      Specifications
    </h2>
    <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-2">
      <div>
        <SpecRow
          icon={Cpu}
          label="CPU"
          even
          value={`${configuredModel.processor.name} (${configuredModel.processor.cores}C/${configuredModel.processor.threads}T, ${configuredModel.processor.boostClock} GHz, ${configuredModel.processor.tdp}W)`}
        />
        <SpecRow
          icon={Monitor}
          label="Display"
          value={`${configuredModel.display.size}" ${configuredModel.display.resolutionLabel} ${configuredModel.display.panel} · ${configuredModel.display.refreshRate}Hz · ${configuredModel.display.nits} nits${configuredModel.display.touchscreen ? " · Touch" : ""}`}
        />
        <SpecRow
          icon={HardDrive}
          label="RAM"
          even
          value={`${configuredModel.ram.size}GB ${configuredModel.ram.type}-${configuredModel.ram.speed}${configuredModel.ram.soldered ? " (soldered)" : ` (${configuredModel.ram.slots} slot${configuredModel.ram.slots > 1 ? "s" : ""})`} · max ${configuredModel.ram.maxSize}GB`}
        />
        <SpecRow
          icon={HardDrive}
          label="Storage"
          value={`${formatStorage(configuredModel.storage.size)} ${configuredModel.storage.type} (${configuredModel.storage.slots} slot${configuredModel.storage.slots > 1 ? "s" : ""})`}
        />
        <SpecRow
          label="GPU"
          even
          value={`${configuredModel.gpu.name}${configuredModel.gpu.vram ? ` ${configuredModel.gpu.vram}GB` : ""} · ${configuredModel.gpu.integrated ? "integrated" : "discrete"}`}
        />
      </div>
      <div>
        <SpecRow
          icon={Battery}
          label="Battery"
          even
          value={`${model.battery.whr} Wh${model.battery.removable ? " · Removable" : ""}`}
        />
        <SpecRow icon={Weight} label="Weight" value={formatWeight(model.weight)} />
        <SpecRow icon={Usb} label="Ports" even value={model.ports.join(", ")} />
        <SpecRow icon={Wifi} label="Wireless" value={model.wireless.join(", ")} />
        {model.keyboard && (
          <SpecRow
            icon={KeyboardIcon}
            label="Input"
            even
            value={`${model.keyboard.layout}${model.keyboard.backlit ? " · Backlit" : ""}${model.keyboard.trackpoint ? " · TrackPoint" : ""}`}
          />
        )}
      </div>
    </div>
  </div>
);
