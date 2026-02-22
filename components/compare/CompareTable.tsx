"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Laptop, SwissPrice } from "@/lib/types";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { formatCHF, formatWeight, formatStorage, getPriceDiscount, getPriceDiscountClasses } from "@/lib/formatters";
import {
  getModelScores,
  getLowestPrice,
  getCpuSingleCore,
  getCpuMultiCore,
  getGpuScore,
  getGamingTier,
} from "@/lib/scoring";
import { linuxCompat } from "@/data/linux-compat";
import { priceBaselines } from "@/data/price-baselines";

interface CompareTableProps {
  readonly models: readonly Laptop[];
  readonly prices: readonly SwissPrice[];
  readonly onRemove: (id: string) => void;
}

interface SpecRow {
  readonly label: string;
  readonly section?: string;
  readonly getValue: (m: Laptop) => string;
  readonly getNumeric?: (m: Laptop) => number;
  readonly highlight?: "min" | "max";
  readonly wrapLong?: boolean;
}

const Delta = ({ score, bestScore }: { score: number; bestScore: number }) => {
  const diff = score - bestScore;
  if (diff === 0) return <span className="ml-1 text-[10px] text-green-400">Best</span>;
  return <span className="ml-1 text-[10px] text-red-400">{diff}</span>;
};

/**
 * Spec row definitions for the compare table.
 * - highlight: "min"/"max" marks the best value green across models
 * - wrapLong: true renders comma-separated values as stacked lines
 * - section: creates a group header row above this row
 */
const SPEC_ROWS: readonly SpecRow[] = [
  { section: "Pricing", label: "Best Price", getValue: () => "", highlight: "min" },
  { section: "Performance", label: "Processor", getValue: (m) => m.processor.name },
  {
    label: "Cores / Threads",
    getValue: (m) => `${m.processor.cores}C / ${m.processor.threads}T`,
    getNumeric: (m) => m.processor.threads,
    highlight: "max",
  },
  {
    label: "Single-Core",
    getValue: (m) => `${getCpuSingleCore(m.processor.name) || "—"}`,
    getNumeric: (m) => getCpuSingleCore(m.processor.name),
    highlight: "max",
  },
  {
    label: "Multi-Core",
    getValue: (m) => `${getCpuMultiCore(m.processor.name) || "—"}`,
    getNumeric: (m) => getCpuMultiCore(m.processor.name),
    highlight: "max",
  },
  { label: "TDP", getValue: (m) => `${m.processor.tdp}W` },
  { label: "GPU", getValue: (m) => `${m.gpu.name}${m.gpu.vram ? ` ${m.gpu.vram}GB` : ""}` },
  {
    label: "GPU Score",
    getValue: (m) => `${getGpuScore(m.gpu.name) || "—"}`,
    getNumeric: (m) => getGpuScore(m.gpu.name),
    highlight: "max",
  },
  { label: "Gaming Tier", getValue: (m) => getGamingTier(m.gpu.name) },
  {
    section: "Memory & Storage",
    label: "RAM",
    getValue: (m) => `${m.ram.size}GB ${m.ram.type}`,
    getNumeric: (m) => m.ram.size,
    highlight: "max",
  },
  { label: "Max RAM", getValue: (m) => `${m.ram.maxSize}GB` },
  { label: "RAM Slots", getValue: (m) => (m.ram.soldered ? "Soldered" : `${m.ram.slots} slots`) },
  {
    label: "Storage",
    getValue: (m) => `${formatStorage(m.storage.size)} ${m.storage.type}`,
    getNumeric: (m) => m.storage.size,
    highlight: "max",
  },
  {
    section: "Display",
    label: "Screen",
    getValue: (m) => `${m.display.size}" ${m.display.resolutionLabel}`,
    getNumeric: (m) => m.display.size,
    highlight: "max",
  },
  { label: "Panel", getValue: (m) => m.display.panel },
  {
    label: "Refresh Rate",
    getValue: (m) => `${m.display.refreshRate}Hz`,
    getNumeric: (m) => m.display.refreshRate,
    highlight: "max",
  },
  {
    label: "Brightness",
    getValue: (m) => `${m.display.nits} nits`,
    getNumeric: (m) => m.display.nits,
    highlight: "max",
  },
  { label: "Touchscreen", getValue: (m) => (m.display.touchscreen ? "Yes" : "No") },
  {
    section: "Chassis",
    label: "Weight",
    getValue: (m) => formatWeight(m.weight),
    getNumeric: (m) => m.weight,
    highlight: "min",
  },
  { label: "Battery", getValue: (m) => `${m.battery.whr} Wh`, getNumeric: (m) => m.battery.whr, highlight: "max" },
  { section: "Connectivity", label: "Ports", getValue: (m) => m.ports.join(", "), wrapLong: true },
  { label: "Wireless", getValue: (m) => m.wireless.join(", "), wrapLong: true },
  {
    section: "Linux",
    label: "Linux Status",
    getValue: (m) =>
      m.linuxStatus === "certified" ? "Certified" : m.linuxStatus === "community" ? "Community" : "Unknown",
  },
  { label: "Recommended Kernel", getValue: (m) => linuxCompat[m.id]?.recommendedKernel ?? "—" },
] as const;

/** Sections shown by default in "Quick Compare" mode */
const QUICK_SECTIONS = new Set(["Pricing", "Performance", "Display", "Chassis"]);

const CompareTable = ({ models, prices, onRemove }: CompareTableProps) => {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const getBest = (row: SpecRow): number | null => {
    if (!row.getNumeric || !row.highlight) return null;
    const vals = models.map((m) => row.getNumeric!(m));
    if (vals.length === 0) return null;
    return row.highlight === "max" ? Math.max(...vals) : Math.min(...vals);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="scrollbar-thin overflow-x-auto border border-carbon-500">
        <table className="w-full min-w-[600px] table-fixed border-collapse text-sm">
          <thead>
            <tr className="bg-accent">
              <th
                scope="col"
                className="sticky left-0 z-10 w-36 min-w-[144px] bg-accent px-4 py-3 text-left font-medium text-white"
              >
                Spec
              </th>
              {models.map((m) => (
                <th scope="col" key={m.id} className="max-w-[220px] px-4 py-3 text-left font-medium text-white">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <Link href={`/model/${m.id}`} className="hover:underline">
                        {m.name}
                      </Link>
                      <div className="mt-0.5 text-xs font-normal text-blue-200">{m.year}</div>
                    </div>
                    <button
                      onClick={() => onRemove(m.id)}
                      className="p-1 text-blue-200 hover:text-white"
                      aria-label={`Remove ${m.name} from comparison`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPEC_ROWS.map((row, i) => {
              const best = getBest(row);
              const isPriceRow = row.label === "Best Price";
              const currentSection = row.section ?? SPEC_ROWS.slice(0, i).findLast((r) => r.section)?.section ?? "";
              const isHidden = !showAll && !QUICK_SECTIONS.has(currentSection);
              const isCollapsed = collapsedSections.has(currentSection);

              return (
                <React.Fragment key={row.label}>
                  {row.section && (
                    <tr>
                      <td
                        colSpan={models.length + 1}
                        className="cursor-pointer select-none border-t border-carbon-500 bg-carbon-600 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-carbon-200 transition-colors hover:bg-carbon-500"
                        onClick={() => toggleSection(row.section!)}
                      >
                        <span className="flex items-center justify-between">
                          {row.section}
                          {collapsedSections.has(row.section) ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                        </span>
                      </td>
                    </tr>
                  )}
                  {isHidden || isCollapsed ? null : (
                    <tr className={i % 2 === 0 ? "bg-carbon-800" : "bg-carbon-700"}>
                      <td
                        className="sticky left-0 z-10 border-t border-carbon-600 px-4 py-3 font-medium text-carbon-200"
                        style={{ background: i % 2 === 0 ? "#161616" : "#262626" }}
                      >
                        {row.label}
                      </td>
                      {models.map((m) => {
                        if (isPriceRow) {
                          const p = getLowestPrice(m.id, prices);
                          const lowestAll = models.map((x) => getLowestPrice(x.id, prices) ?? Infinity);
                          const isLowest = p !== null && p === Math.min(...lowestAll);
                          const bl = priceBaselines[m.id];
                          const pctOff = bl && p ? getPriceDiscount(p, bl.msrp) : 0;
                          const pctClass = getPriceDiscountClasses(pctOff);
                          return (
                            <td
                              key={m.id}
                              className={`border-t border-carbon-600 px-4 py-3 font-mono text-lg font-semibold ${isLowest ? "text-green-400" : "text-carbon-50"}`}
                            >
                              {p !== null ? formatCHF(p) : "—"}
                              {isLowest && (
                                <span className="ml-1.5 border border-green-700 bg-green-900/40 px-1 py-0.5 text-[10px] text-green-400">
                                  Best
                                </span>
                              )}
                              {p !== null && pctOff > 0 && (
                                <span className={`ml-1.5 border px-1 py-0.5 text-[10px] ${pctClass}`}>
                                  {pctOff}% off
                                </span>
                              )}
                            </td>
                          );
                        }

                        const val = row.getValue(m);
                        const numVal = row.getNumeric?.(m);
                        const isBest = best !== null && numVal === best;

                        return (
                          <td
                            key={m.id}
                            className={`break-words border-t border-carbon-600 px-4 py-3 ${isBest ? "font-semibold text-green-400" : "text-carbon-50"}`}
                          >
                            {row.wrapLong ? (
                              <div className="space-y-0.5">
                                {val.split(", ").map((item, idx) => (
                                  <div key={idx} className="text-[13px]">
                                    {item}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="line-clamp-2">{val}</span>
                            )}
                            {isBest && (
                              <span className="ml-1.5 border border-green-700 bg-green-900/40 px-1 py-0.5 text-[10px] text-green-400">
                                Best
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {/* Scores */}
            <tr>
              <td
                colSpan={models.length + 1}
                className="border-t border-carbon-500 bg-carbon-600 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-carbon-200"
              >
                Scores
              </td>
            </tr>
            {(() => {
              const allScores = models.map((m) => getModelScores(m, prices));
              if (allScores.length === 0) return null;
              const best = {
                perf: Math.max(...allScores.map((s) => s.perf)),
                display: Math.max(...allScores.map((s) => s.display)),
                memory: Math.max(...allScores.map((s) => s.memory)),
                connectivity: Math.max(...allScores.map((s) => s.connectivity)),
                port: Math.max(...allScores.map((s) => s.portability)),
                value: Math.max(...allScores.map((s) => s.value ?? 0)),
              };
              return (
                <tr className="bg-carbon-800">
                  <td className="sticky left-0 z-10 border-t border-carbon-600 bg-carbon-800 px-4 py-3 font-medium text-carbon-200">
                    Ratings
                  </td>
                  {models.map((m, mi) => {
                    const s = allScores[mi];
                    return (
                      <td key={m.id} className="border-t border-carbon-600 px-4 py-3">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="flex-1">
                              <ScoreBar score={s.perf} label="Perf" color="#0f62fe" size="md" />
                            </div>
                            <Delta score={s.perf} bestScore={best.perf} />
                          </div>
                          <div className="flex items-center">
                            <div className="flex-1">
                              <ScoreBar score={s.display} label="Display" color="#ee5396" size="md" />
                            </div>
                            <Delta score={s.display} bestScore={best.display} />
                          </div>
                          <div className="flex items-center">
                            <div className="flex-1">
                              <ScoreBar score={s.memory} label="Memory" color="#be95ff" size="md" />
                            </div>
                            <Delta score={s.memory} bestScore={best.memory} />
                          </div>
                          <div className="flex items-center">
                            <div className="flex-1">
                              <ScoreBar score={s.connectivity} label="Connect" color="#08bdba" size="md" />
                            </div>
                            <Delta score={s.connectivity} bestScore={best.connectivity} />
                          </div>
                          <div className="flex items-center">
                            <div className="flex-1">
                              <ScoreBar score={s.portability} label="Port" color="#42be65" size="md" />
                            </div>
                            <Delta score={s.portability} bestScore={best.port} />
                          </div>
                          {s.value !== null && (
                            <div className="flex items-center">
                              <div className="flex-1">
                                <ScoreBar score={Math.min(100, s.value)} label="Value" color="#f1c21b" size="md" />
                              </div>
                              <Delta score={s.value} bestScore={best.value} />
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>
      {!showAll && (
        <button onClick={() => setShowAll(true)} className="carbon-btn-ghost mt-3 w-full justify-center text-sm">
          Show all sections (Memory, Connectivity, Linux)
          <ChevronDown size={14} />
        </button>
      )}
      {showAll && (
        <button onClick={() => setShowAll(false)} className="carbon-btn-ghost mt-3 w-full justify-center text-sm">
          Show quick compare only
          <ChevronUp size={14} />
        </button>
      )}
    </motion.div>
  );
};

export default React.memo(CompareTable);
