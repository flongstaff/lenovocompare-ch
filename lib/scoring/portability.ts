/**
 * Portability scoring — weight and battery capacity.
 */
import type { Laptop } from "../types";
import type { ScoreComponent } from "./utils";

export interface PortabilityBreakdown {
  readonly weight: ScoreComponent;
  readonly battery: ScoreComponent;
}

export const getPortabilityScore = (model: Laptop): number => {
  // 0.8 kg = floor (lightest ultraportable); 40 = sensitivity (softened from 50 for better mid-range differentiation)
  const weightScore = Math.max(0, Math.min(100, 100 - (model.weight - 0.8) * 40));
  // 100 Whr = ceiling for full battery score
  const batteryScore = Math.min(100, (model.battery.whr / 100) * 100);
  // 60/40 split: weight matters more than battery for portability
  return Math.min(100, Math.round(weightScore * 0.6 + batteryScore * 0.4));
};

export const getPortabilityScoreBreakdown = (model: Laptop): PortabilityBreakdown => {
  const weightRaw = Math.max(0, 100 - (model.weight - 0.8) * 40);
  const batteryRaw = Math.min(100, (model.battery.whr / 100) * 100);
  return {
    weight: { label: "Weight", earned: Math.round(weightRaw * 0.6 * 10) / 10, max: 60 },
    battery: { label: "Battery", earned: Math.round(batteryRaw * 0.4 * 10) / 10, max: 40 },
  };
};
