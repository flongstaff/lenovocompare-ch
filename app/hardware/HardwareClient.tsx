"use client";

import { useState, useMemo } from "react";
import { Search, Cpu, Monitor } from "lucide-react";
import { cpuGuide, gpuGuide } from "@/data/hardware-guide";
import { cpuBenchmarks } from "@/data/cpu-benchmarks";
import { gpuBenchmarks } from "@/data/gpu-benchmarks";
import ChipDetailCard from "@/components/models/ChipDetailCard";
import { ScoreBar } from "@/components/ui/ScoreBar";

type Tab = "cpu" | "gpu";
type SortMode = "score" | "name";

const HardwareClient = () => {
  const [tab, setTab] = useState<Tab>("cpu");
  const [search, setSearch] = useState("");
  const [archFilter, setArchFilter] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("score");
  const [compareA, setCompareA] = useState("");
  const [compareB, setCompareB] = useState("");

  const guide = tab === "cpu" ? cpuGuide : gpuGuide;
  const scores =
    tab === "cpu" ? cpuBenchmarks : Object.fromEntries(Object.entries(gpuBenchmarks).map(([k, v]) => [k, v.score]));

  // Collect unique architectures
  const architectures = useMemo(
    () => Array.from(new Set(Object.values(guide).map((e) => e.architecture))).sort(),
    [guide],
  );

  // Filter & sort
  const entries = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return Object.entries(guide)
      .filter(([name, entry]) => {
        if (lowerSearch && !name.toLowerCase().includes(lowerSearch)) return false;
        if (archFilter && entry.architecture !== archFilter) return false;
        return true;
      })
      .sort(([aName], [bName]) => {
        if (sortMode === "score") {
          return (scores[bName] ?? 0) - (scores[aName] ?? 0);
        }
        return aName.localeCompare(bName);
      });
  }, [guide, search, archFilter, sortMode, scores]);

  // Chip names for compare dropdowns
  const chipNames = useMemo(() => Object.keys(guide).sort(), [guide]);

  const compareEntryA = compareA ? guide[compareA] : null;
  const compareEntryB = compareB ? guide[compareB] : null;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: "var(--foreground)" }}>
          Hardware Guide
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          In-depth analysis of every CPU and GPU across ThinkPad, IdeaPad Pro, and Legion
        </p>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setTab("cpu");
            setArchFilter(null);
            setSearch("");
            setCompareA("");
            setCompareB("");
          }}
          className={`carbon-btn flex items-center gap-1.5 !px-4 !py-1.5 text-sm ${tab === "cpu" ? "" : "!border-carbon-500 !bg-transparent"}`}
          style={tab === "cpu" ? {} : { color: "var(--muted)" }}
        >
          <Cpu size={14} /> CPUs ({Object.keys(cpuGuide).length})
        </button>
        <button
          onClick={() => {
            setTab("gpu");
            setArchFilter(null);
            setSearch("");
            setCompareA("");
            setCompareB("");
          }}
          className={`carbon-btn flex items-center gap-1.5 !px-4 !py-1.5 text-sm ${tab === "gpu" ? "" : "!border-carbon-500 !bg-transparent"}`}
          style={tab === "gpu" ? {} : { color: "var(--muted)" }}
        >
          <Monitor size={14} /> GPUs ({Object.keys(gpuGuide).length})
        </button>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${tab === "cpu" ? "CPUs" : "GPUs"}...`}
            className="carbon-input w-full pl-9"
          />
        </div>
        <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)} className="carbon-select">
          <option value="score">Sort by Score</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Architecture filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setArchFilter(null)}
          className={`carbon-chip text-xs ${!archFilter ? "carbon-chip-success" : ""}`}
        >
          All
        </button>
        {architectures.map((arch) => (
          <button
            key={arch}
            onClick={() => setArchFilter(archFilter === arch ? null : arch)}
            className={`carbon-chip text-xs ${archFilter === arch ? "carbon-chip-success" : ""}`}
          >
            {arch}
          </button>
        ))}
      </div>

      {/* Chip list */}
      <div className="space-y-3">
        {entries.length === 0 && (
          <p className="py-8 text-center text-sm" style={{ color: "var(--muted)" }}>
            No {tab === "cpu" ? "CPUs" : "GPUs"} match your filters.
          </p>
        )}
        {entries.map(([name, entry]) => (
          <ChipDetailCard key={name} name={name} entry={entry} score={scores[name]} type={tab} compact />
        ))}
      </div>

      {/* Quick Compare */}
      <div className="carbon-card space-y-4 rounded-lg p-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
          Quick Compare
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select value={compareA} onChange={(e) => setCompareA(e.target.value)} className="carbon-select">
            <option value="">Select first {tab === "cpu" ? "CPU" : "GPU"}</option>
            {chipNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <select value={compareB} onChange={(e) => setCompareB(e.target.value)} className="carbon-select">
            <option value="">Select second {tab === "cpu" ? "CPU" : "GPU"}</option>
            {chipNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {compareA && compareB && compareEntryA && compareEntryB && (
          <div className="space-y-4">
            {/* Score comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2 text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  {compareA}
                </p>
                <ScoreBar
                  score={scores[compareA] ?? 0}
                  label="Score"
                  color={tab === "cpu" ? "#0f62fe" : "#42be65"}
                  size="md"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  {compareB}
                </p>
                <ScoreBar
                  score={scores[compareB] ?? 0}
                  label="Score"
                  color={tab === "cpu" ? "#0f62fe" : "#42be65"}
                  size="md"
                />
              </div>
            </div>

            {/* Architecture comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm" style={{ color: "var(--carbon-300)" }}>
                <span className="font-medium" style={{ color: "var(--muted)" }}>
                  Architecture:
                </span>{" "}
                {compareEntryA.architecture}
              </div>
              <div className="text-sm" style={{ color: "var(--carbon-300)" }}>
                <span className="font-medium" style={{ color: "var(--muted)" }}>
                  Architecture:
                </span>{" "}
                {compareEntryB.architecture}
              </div>
            </div>

            {/* Side-by-side summaries */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ChipDetailCard name={compareA} entry={compareEntryA} score={scores[compareA]} type={tab} />
              <ChipDetailCard name={compareB} entry={compareEntryB} score={scores[compareB]} type={tab} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HardwareClient;
