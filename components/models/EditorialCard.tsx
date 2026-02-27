"use client";

import { AlertTriangle, Globe, Terminal } from "lucide-react";
import { EditorialOverlay, LinuxStatus } from "@/lib/types";

interface EditorialCardProps {
  readonly editorial: EditorialOverlay;
  readonly linuxStatus?: LinuxStatus;
}

const EditorialCard = ({ editorial, linuxStatus }: EditorialCardProps) => {
  return (
    <div className="carbon-card space-y-4 p-4">
      <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
        Editorial Notes
      </h2>

      {editorial.editorialNotes && (
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          {editorial.editorialNotes}
        </p>
      )}

      {editorial.knownIssues && (
        <div
          className="p-3"
          style={{ backgroundColor: "rgba(218, 163, 30, 0.08)", border: "1px solid rgba(218, 163, 30, 0.2)" }}
        >
          <div className="mb-1.5 flex items-center gap-1.5">
            <AlertTriangle size={13} style={{ color: "var(--warning)" }} />
            <span className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: "var(--warning)" }}>
              Known Issues
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
            {editorial.knownIssues}
          </p>
        </div>
      )}

      {editorial.swissMarketNotes && (
        <div className="flex items-start gap-2">
          <Globe size={14} className="mt-0.5 shrink-0" style={{ color: "var(--accent-light)" }} />
          <div>
            <span
              className="font-mono text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--accent-light)" }}
            >
              Swiss Market
            </span>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {editorial.swissMarketNotes}
            </p>
          </div>
        </div>
      )}

      {editorial.linuxNotes && linuxStatus && (
        <div className="flex items-start gap-2">
          <Terminal size={14} className="mt-0.5 shrink-0" style={{ color: "var(--success)" }} />
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: "var(--success)" }}>
              Linux
            </span>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {editorial.linuxNotes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorialCard;
