/**
 * Display scoring — resolution, panel type, brightness, refresh, touch, size.
 */
import type { Laptop } from "../types";
import type { ScoreComponent } from "./utils";

export interface DisplayBreakdown {
  readonly resolution: ScoreComponent;
  readonly panel: ScoreComponent;
  readonly brightness: ScoreComponent;
  readonly refresh: ScoreComponent;
  readonly touch: ScoreComponent;
  readonly size: ScoreComponent;
}

export const getDisplayScoreBreakdown = (model: Laptop): DisplayBreakdown => {
  const d = model.display;
  const parts = d.resolution.split("x").map(Number);
  const w = parts[0] ?? 0;
  const h = parts[1] ?? 0;
  const pixels = isNaN(w) || isNaN(h) ? 0 : w * h;

  return {
    resolution: { label: "Resolution", earned: Math.min(30, (pixels / (3840 * 2400)) * 30), max: 30 },
    panel: { label: "Panel", earned: d.panel === "OLED" ? 25 : d.panel === "IPS" ? 15 : 5, max: 25 },
    brightness: { label: "Brightness", earned: Math.min(15, (d.nits / 600) * 15), max: 15 },
    refresh: { label: "Refresh Rate", earned: Math.max(0, Math.min(15, ((d.refreshRate - 60) / 105) * 15)), max: 15 },
    touch: { label: "Touch", earned: d.touchscreen ? 10 : 0, max: 10 },
    size: { label: "Size", earned: Math.max(0, Math.min(5, ((d.size - 13) / 3) * 5)), max: 5 },
  };
};

/**
 * Display score (max 100): Resolution + Panel + Brightness + Refresh + Touch + Size.
 * Delegates to getDisplayScoreBreakdown so the total always matches the breakdown sum.
 */
export const getDisplayScore = (model: Laptop): number => {
  const bd = getDisplayScoreBreakdown(model);
  const sum =
    bd.resolution.earned +
    bd.panel.earned +
    bd.brightness.earned +
    bd.refresh.earned +
    bd.touch.earned +
    bd.size.earned;
  return Math.round(Math.min(100, sum));
};
