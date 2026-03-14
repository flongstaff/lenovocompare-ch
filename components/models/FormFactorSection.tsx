"use client";

import { Wifi, Keyboard as KeyboardIcon } from "lucide-react";
import type { Laptop } from "@/lib/types";
import { formatWeight } from "@/lib/formatters";
import dynamic from "next/dynamic";

const SectionSkeleton = () => <div className="carbon-card animate-pulse" style={{ height: 120 }} />;
const BlueprintDiagram = dynamic(
  () => import("@/components/models/BlueprintDiagram").then((m) => ({ default: m.BlueprintDiagram })),
  { loading: SectionSkeleton },
);

/** Parse port strings like "2x Thunderbolt 4" into structured data */
const parsePortBreakdown = (ports: readonly string[]) => {
  const tb: string[] = [];
  const usbC: string[] = [];
  const usbA: string[] = [];
  const video: string[] = [];
  const other: string[] = [];

  for (const p of ports) {
    const lower = p.toLowerCase();
    if (lower.includes("thunderbolt")) tb.push(p);
    else if (lower.includes("usb-c") || lower.includes("usb c")) usbC.push(p);
    else if (lower.includes("usb-a") || lower.includes("usb a")) usbA.push(p);
    else if (lower.includes("hdmi") || lower.includes("displayport") || lower.includes("vga")) video.push(p);
    else other.push(p);
  }
  return { tb, usbC, usbA, video, other };
};

const PortChip = ({ label, accent }: { label: string; accent: string }) => (
  <span
    className="inline-flex items-center px-1.5 py-0.5 font-mono text-[10px] font-medium"
    style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}
  >
    {label}
  </span>
);

const PhysicalStat = ({ label, value, unit }: { label: string; value: string; unit?: string }) => (
  <div className="flex flex-col items-center">
    <span className="font-mono text-sm font-semibold leading-tight" style={{ color: "var(--foreground)" }}>
      {value}
      {unit && (
        <span className="ml-0.5 text-[10px] font-normal" style={{ color: "var(--muted)" }}>
          {unit}
        </span>
      )}
    </span>
    <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
      {label}
    </span>
  </div>
);

export const FormFactorSection = ({
  model,
  configuredModel,
}: {
  readonly model: Laptop;
  readonly configuredModel: Laptop;
}) => {
  const portInfo = parsePortBreakdown(model.ports);
  const totalPorts = model.ports.reduce((sum, p) => {
    const match = p.match(/^(\d+)x\s/);
    return sum + (match ? parseInt(match[1], 10) : 1);
  }, 0);

  return (
    <div id="form-factor" className="carbon-card scroll-mt-14 p-4">
      <h2 className="mb-3 text-base font-semibold sm:text-lg" style={{ color: "var(--foreground)" }}>
        Form Factor
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Blueprint diagram */}
        <div className="flex items-center justify-center">
          <BlueprintDiagram
            displaySize={configuredModel.display.size}
            weight={configuredModel.weight}
            lineup={configuredModel.lineup}
            series={configuredModel.series}
          />
        </div>

        {/* Physical build context — unique info not in Specs */}
        <div className="flex flex-col justify-between gap-3">
          {/* Quick physical stats — 2x2 grid */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div
              className="border px-2.5 py-2"
              style={{ borderColor: "var(--border-subtle)", background: "var(--surface-inset)" }}
            >
              <PhysicalStat label="Weight" value={formatWeight(model.weight)} />
            </div>
            <div
              className="border px-2.5 py-2"
              style={{ borderColor: "var(--border-subtle)", background: "var(--surface-inset)" }}
            >
              <PhysicalStat label="Battery" value={`${model.battery.whr}`} unit="Wh" />
            </div>
            <div
              className="border px-2.5 py-2"
              style={{ borderColor: "var(--border-subtle)", background: "var(--surface-inset)" }}
            >
              <PhysicalStat label="Screen" value={`${configuredModel.display.size}"`} />
            </div>
            <div
              className="border px-2.5 py-2"
              style={{ borderColor: "var(--border-subtle)", background: "var(--surface-inset)" }}
            >
              <PhysicalStat label="Total I/O" value={`${totalPorts}`} unit="ports" />
            </div>
          </div>

          {/* Port breakdown */}
          <div className="space-y-1.5">
            <span
              className="font-mono text-[10px] font-medium uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              I/O Breakdown
            </span>
            <div className="flex flex-wrap gap-1.5">
              {portInfo.tb.map((p) => (
                <PortChip key={p} label={p} accent="#0f62fe" />
              ))}
              {portInfo.usbC.map((p) => (
                <PortChip key={p} label={p} accent="#08bdba" />
              ))}
              {portInfo.usbA.map((p) => (
                <PortChip key={p} label={p} accent="#be95ff" />
              ))}
              {portInfo.video.map((p) => (
                <PortChip key={p} label={p} accent="#f1c21b" />
              ))}
              {portInfo.other.map((p) => (
                <PortChip key={p} label={p} accent="#6f6f6f" />
              ))}
            </div>
          </div>

          {/* Connectivity + build details */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "var(--muted)" }}>
            {model.wireless.map((w) => (
              <span key={w}>
                <Wifi size={11} className="mr-1 inline" style={{ color: "var(--muted)" }} />
                {w}
              </span>
            ))}
            {model.keyboard && (
              <span>
                <KeyboardIcon size={11} className="mr-1 inline" style={{ color: "var(--muted)" }} />
                {model.keyboard.layout}
                {model.keyboard.backlit ? " · Backlit" : ""}
                {model.keyboard.trackpoint ? " · TrackPoint" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
