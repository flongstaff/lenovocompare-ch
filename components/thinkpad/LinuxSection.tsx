"use client";

import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import type { LinuxCompatEntry, DriverStatus } from "@/lib/types";

interface LinuxSectionProps {
  readonly compat: LinuxCompatEntry;
}

const STATUS_ICON: Record<DriverStatus, { Icon: typeof CheckCircle; color: string }> = {
  works: { Icon: CheckCircle, color: "#42be65" },
  partial: { Icon: AlertTriangle, color: "#f1c21b" },
  broken: { Icon: XCircle, color: "#da1e28" },
  unknown: { Icon: HelpCircle, color: "#a8a8a8" },
};

const LinuxSection = ({ compat }: LinuxSectionProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        Linux Compatibility
      </h2>
      <code className="bg-carbon-700 text-carbon-200 px-1.5 py-0.5 text-[10px]">
        Kernel {compat.recommendedKernel}+
      </code>
    </div>

    {compat.certifiedDistros.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {compat.certifiedDistros.map((d) => (
          <span key={d} className="carbon-chip-success text-[10px]">
            {d}
          </span>
        ))}
      </div>
    )}

    {compat.driverNotes.length > 0 && (
      <div className="grid grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-2">
        {compat.driverNotes.map((note) => {
          const { Icon, color } = STATUS_ICON[note.status];
          return (
            <div
              key={note.component}
              className="flex items-center gap-2 py-1"
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <Icon size={12} style={{ color }} className="shrink-0" />
              <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                {note.component}
              </span>
              <span className="truncate text-[10px]" style={{ color: "var(--muted)" }}>
                {note.notes}
              </span>
            </div>
          );
        })}
      </div>
    )}

    {compat.fedoraNotes && (
      <div className="rounded p-2" style={{ background: "#1a3a5c", border: "1px solid #264a7a" }}>
        <span className="text-xs font-semibold" style={{ color: "#78aeed" }}>
          Fedora:{" "}
        </span>
        <span className="text-xs" style={{ color: "#a8c8f0" }}>
          {compat.fedoraNotes}
        </span>
      </div>
    )}

    {compat.generalNotes && (
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        {compat.generalNotes}
      </p>
    )}
  </div>
);

export default LinuxSection;
