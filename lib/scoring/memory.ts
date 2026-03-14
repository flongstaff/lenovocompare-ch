/**
 * Memory & storage scoring — RAM size/type/upgradability + storage capacity/slots.
 */
import type { Laptop } from "../types";
import type { ScoreComponent } from "./utils";

export interface MemoryBreakdown {
  readonly ramSize: ScoreComponent;
  readonly maxRam: ScoreComponent;
  readonly ramType: ScoreComponent;
  readonly storageSize: ScoreComponent;
  readonly upgradability: ScoreComponent;
  readonly storageSlots: ScoreComponent;
}

/**
 * Memory & storage breakdown (max ~95):
 * RAM size: 5-30, max RAM: 4-15, RAM type: 6-12,
 * storage size: 4-15, upgradability: 3-15, storage slots: 3-8
 */
export const getMemoryScoreBreakdown = (model: Laptop): MemoryBreakdown => {
  const ramSize =
    model.ram.size >= 64 ? 30 : model.ram.size >= 32 ? 25 : model.ram.size >= 16 ? 18 : model.ram.size >= 8 ? 10 : 5;
  const maxRam = model.ram.maxSize >= 128 ? 15 : model.ram.maxSize >= 64 ? 12 : model.ram.maxSize >= 32 ? 8 : 4;
  const ramType = model.ram.type === "LPDDR5x" ? 12 : model.ram.type === "LPDDR5" || model.ram.type === "DDR5" ? 10 : 6;
  const storageSize =
    model.storage.size >= 2048 ? 15 : model.storage.size >= 1024 ? 12 : model.storage.size >= 512 ? 8 : 4;
  const upgradability = !model.ram.soldered && model.ram.slots >= 2 ? 15 : !model.ram.soldered ? 10 : 3;
  const storageSlots = model.storage.slots >= 2 ? 8 : 3;

  return {
    ramSize: { label: "RAM", earned: ramSize, max: 30 },
    maxRam: { label: "Max RAM", earned: maxRam, max: 15 },
    ramType: { label: "RAM Type", earned: ramType, max: 12 },
    storageSize: { label: "Storage", earned: storageSize, max: 15 },
    upgradability: { label: "Upgradability", earned: upgradability, max: 15 },
    storageSlots: { label: "Slots", earned: storageSlots, max: 8 },
  };
};

/**
 * Memory & storage score (max 100). Delegates to getMemoryScoreBreakdown so the
 * total always matches the breakdown sum.
 */
export const getMemoryScore = (model: Laptop): number => {
  const bd = getMemoryScoreBreakdown(model);
  const sum =
    bd.ramSize.earned +
    bd.maxRam.earned +
    bd.ramType.earned +
    bd.storageSize.earned +
    bd.upgradability.earned +
    bd.storageSlots.earned;
  return Math.min(100, sum);
};
