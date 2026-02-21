"use client";

import { LinuxStatus } from "@/lib/types";

const CONFIG: Record<LinuxStatus, { label: string; className: string } | null> = {
  certified: { label: "Linux Certified", className: "carbon-chip-success" },
  community: { label: "Linux Community", className: "carbon-chip" },
  unknown: null,
};

export const LinuxBadge = ({ status }: { status: LinuxStatus }) => {
  const config = CONFIG[status];
  if (!config) return null;
  return <span className={config.className}>{config.label}</span>;
};
