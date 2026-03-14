"use client";

import { useState } from "react";
import { Laptop } from "@/lib/types";
import { formatCHF } from "@/lib/formatters";

interface ValueScoringProps {
  readonly model: Laptop;
}

interface ValueMetric {
  readonly label: string;
  readonly value: number;
  readonly unit: string;
  readonly quality: "good" | "ok" | "poor";
}

/** Quality thresholds based on Swiss market averages (CHF/core <80 = good, CHF/GB <30 = good, CHF/100g <80 = good) */
const getQuality = (metric: string, value: number): "good" | "ok" | "poor" => {
  switch (metric) {
    case "chfPerCore":
      return value < 80 ? "good" : value < 150 ? "ok" : "poor";
    case "chfPerGb":
      return value < 30 ? "good" : value < 60 ? "ok" : "poor";
    case "chfPer100g":
      return value < 80 ? "good" : value < 120 ? "ok" : "poor";
    default:
      return "ok";
  }
};

const QUALITY_STYLES = {
  good: "text-status-success bg-status-success/15 border-status-success/30",
  ok: "text-status-warning bg-status-warning/15 border-status-warning/30",
  poor: "text-carbon-400 bg-carbon-700/30 border-carbon-600",
} as const;

export const ValueScoring = ({ model }: ValueScoringProps) => {
  const [price, setPrice] = useState<string>("");

  const numPrice = parseFloat(price);
  const isValid = !isNaN(numPrice) && numPrice > 0;

  const metrics: readonly ValueMetric[] = isValid
    ? [
        {
          label: "CHF / Core",
          value: numPrice / model.processor.cores,
          unit: "CHF",
          quality: getQuality("chfPerCore", numPrice / model.processor.cores),
        },
        {
          label: "CHF / GB RAM",
          value: numPrice / model.ram.size,
          unit: "CHF",
          quality: getQuality("chfPerGb", numPrice / model.ram.size),
        },
        {
          label: "CHF / 100g",
          value: numPrice / (model.weight * 10),
          unit: "CHF",
          quality: getQuality("chfPer100g", numPrice / (model.weight * 10)),
        },
      ]
    : [];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-carbon-400">CHF</span>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price..."
          className="carbon-input flex-1 !py-1.5 font-mono !text-sm"
          min="0"
          step="10"
          aria-label="Price in CHF"
        />
      </div>

      {isValid && metrics.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {metrics.map((m) => (
            <div key={m.label} className={`border p-2 text-center ${QUALITY_STYLES[m.quality]}`}>
              <p className="font-mono text-lg font-semibold">
                {m.value < 10 ? m.value.toFixed(1) : Math.round(m.value)}
              </p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider opacity-80">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      {isValid && (
        <p className="text-[10px] text-carbon-400">
          Based on {formatCHF(numPrice)} for {model.processor.cores} cores, {model.ram.size}GB RAM, {model.weight}kg
        </p>
      )}
    </div>
  );
};
