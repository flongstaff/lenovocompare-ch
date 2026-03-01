"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Laptop } from "@/lib/types";
import type { getModelScores } from "@/lib/scoring";
import { SeriesBadge } from "@/components/models/SeriesBadge";
import { LinuxBadge } from "@/components/ui/LinuxBadge";
import { getPsrefSearchUrl } from "@/lib/retailers";

export const ModelHeader = ({
  model,
  sc,
}: {
  readonly model: Laptop;
  readonly sc: ReturnType<typeof getModelScores>;
}) => (
  <>
    <Link
      href="/"
      className="inline-flex items-center gap-1 text-sm hover:underline"
      style={{ color: "var(--accent-light)" }}
    >
      <ArrowLeft size={14} /> Back to models
    </Link>

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div>
        <div className="flex items-center gap-2">
          <SeriesBadge series={model.series} />
          {model.linuxStatus && <LinuxBadge status={model.linuxStatus} />}
        </div>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: "var(--foreground)" }}>
          {model.name}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          {model.year} · {model.os}
        </p>
      </div>
      {model.psrefUrl && (
        <div className="flex flex-col items-end gap-1 self-start">
          <a
            href={model.psrefUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="carbon-btn-ghost !px-3 !py-1.5 text-sm"
          >
            PSREF <ExternalLink size={12} />
          </a>
          <a
            href={getPsrefSearchUrl(model)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:underline"
            style={{ color: "var(--muted)" }}
          >
            Search PSREF
          </a>
        </div>
      )}
    </div>

    {/* Quick score strip */}
    <div className="flex flex-wrap gap-2">
      {[
        { label: "CPU", score: sc.dimensions.cpu, color: "#0f62fe" },
        { label: "GPU", score: sc.dimensions.gpu, color: "#42be65" },
        { label: "Display", score: sc.dimensions.display, color: "#ee5396" },
        { label: "Memory", score: sc.dimensions.memory, color: "#be95ff" },
        { label: "Connect", score: sc.dimensions.connectivity, color: "#08bdba" },
        { label: "Portable", score: sc.dimensions.portability, color: "#42be65" },
      ].map((d) => (
        <div
          key={d.label}
          className="flex items-center gap-1.5 border px-2 py-1"
          style={{ borderColor: "#393939", background: "var(--surface-inset)" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            {d.label}
          </span>
          <span className="font-mono text-sm font-semibold" style={{ color: d.color }}>
            {d.score}
          </span>
        </div>
      ))}
    </div>
  </>
);
