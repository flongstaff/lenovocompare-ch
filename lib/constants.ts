/**
 * App-wide constants — localStorage keys, retailer names, lineup/series color palettes,
 * comparison slot colors, sort options, and maximum compare count.
 */
import type { Lineup, Series, UseCase } from "./types";

export const STORAGE_KEYS = {
  prices: "lenovocompare-prices",
} as const;

/** Old keys for one-time migration */
export const LEGACY_STORAGE_KEYS = {
  prices: "thinkcompare-prices",
  compare: "thinkcompare-compare",
} as const;

export const RETAILERS = [
  "Digitec",
  "Galaxus",
  "Brack",
  "Lenovo CH",
  "Interdiscount",
  "Fust",
  "MediaMarkt",
  "Toppreise",
  "Revendo",
  "Back Market",
  "Ricardo",
  "Tutti",
] as const;

export const LINEUP_COLORS: Record<Lineup, { accent: string; chipClass: string }> = {
  ThinkPad: { accent: "#a8a8a8", chipClass: "carbon-chip-thinkpad" },
  "IdeaPad Pro": { accent: "#78a9ff", chipClass: "carbon-chip-ideapad" },
  Legion: { accent: "#ff832b", chipClass: "carbon-chip-legion" },
  Yoga: { accent: "#ee5396", chipClass: "carbon-chip-yoga" },
};

export const SERIES_COLORS: Record<Series, { accent: string; chipClass: string }> = {
  // ThinkPad series
  X1: { accent: "#ee5396", chipClass: "carbon-chip-thinkpad" },
  T: { accent: "#4589ff", chipClass: "carbon-chip-thinkpad" },
  P: { accent: "#f1c21b", chipClass: "carbon-chip-thinkpad" },
  L: { accent: "#42be65", chipClass: "carbon-chip-thinkpad" },
  E: { accent: "#be95ff", chipClass: "carbon-chip-thinkpad" },
  // IdeaPad Pro series
  "Pro 5": { accent: "#33b1ff", chipClass: "carbon-chip-ideapad" },
  "Pro 5i": { accent: "#6929c4", chipClass: "carbon-chip-ideapad" },
  "Pro 7": { accent: "#a56eff", chipClass: "carbon-chip-ideapad" },
  // Legion series
  "5": { accent: "#ff832b", chipClass: "carbon-chip-legion" },
  "5i": { accent: "#fa4d56", chipClass: "carbon-chip-legion" },
  "7": { accent: "#fa4d56", chipClass: "carbon-chip-legion" },
  "7i": { accent: "#d12771", chipClass: "carbon-chip-legion" },
  Pro: { accent: "#f1c21b", chipClass: "carbon-chip-legion" },
  Slim: { accent: "#08bdba", chipClass: "carbon-chip-legion" },
  // Yoga series
  "Yoga 6": { accent: "#ee5396", chipClass: "carbon-chip-yoga" },
  "Yoga 7": { accent: "#ff7eb6", chipClass: "carbon-chip-yoga" },
  "Yoga 9": { accent: "#d02670", chipClass: "carbon-chip-yoga" },
  "Yoga Slim": { accent: "#a56eff", chipClass: "carbon-chip-yoga" },
  "Yoga Book": { accent: "#be95ff", chipClass: "carbon-chip-yoga" },
};

export const USE_CASE_COLORS: Record<UseCase, { accent: string }> = {
  "Business Travel": { accent: "#4589ff" },
  Developer: { accent: "#a56eff" },
  "Creative Work": { accent: "#ee5396" },
  Budget: { accent: "#42be65" },
  "Desktop Replacement": { accent: "#f1c21b" },
  Ultraportable: { accent: "#08bdba" },
  Student: { accent: "#33b1ff" },
  "IT Fleet": { accent: "#a8a8a8" },
  "Light Gaming": { accent: "#ff832b" },
};

/** Color-blind safe palette for multi-model comparison charts (passes Protanopia/Deuteranopia/Tritanopia) */
export const COMPARE_COLORS = ["#4589ff", "#d4437a", "#009d9a", "#f1c21b"] as const;

/** Stroke dash patterns for additional differentiation in charts (matches COMPARE_COLORS order) */
export const COMPARE_DASHES = ["", "8 4", "4 4", "12 4 4 4"] as const;

export const MAX_COMPARE = 4;

/** Series-specific accent colors for ScoreBar gradients. Must be raw hex — see ScoreBar color prop constraint. */
export const SERIES_ACCENT: Record<string, string> = {
  // ThinkPad
  X1: "#ee5396",
  T: "#4589ff",
  P: "#f1c21b",
  L: "#42be65",
  E: "#be95ff",
  // IdeaPad Pro
  "Pro 5": "#33b1ff",
  "Pro 5i": "#6929c4",
  "Pro 7": "#a56eff",
  // Legion
  "5": "#ff832b",
  "5i": "#fa4d56",
  "7": "#fa4d56",
  "7i": "#d12771",
  Pro: "#f1c21b",
  Slim: "#08bdba",
  // Yoga
  "Yoga 6": "#ee5396",
  "Yoga 7": "#ff7eb6",
  "Yoga 9": "#d02670",
  "Yoga Slim": "#a56eff",
  "Yoga Book": "#be95ff",
};

/** Benchmark category accent colors (hex) */
export const BENCHMARK_CAT_COLORS: Record<string, string> = {
  cpu: "#4589ff",
  gpu: "#42be65",
  thermal: "#ff832b",
  noise: "#f1c21b",
  battery: "#08bdba",
  battPerf: "#42be65",
  storage: "#4589ff",
  memory: "#be95ff",
  display: "#f1c21b",
  creative: "#be95ff",
  weight: "#a8a8a8",
};

/** Retailer brand colors for price charts (hex) */
export const RETAILER_COLORS: Record<string, string> = {
  Digitec: "#0f62fe",
  Galaxus: "#0f62fe",
  Brack: "#42be65",
  "Lenovo CH": "#da1e28",
  Interdiscount: "#a56eff",
  Fust: "#ff832b",
  MediaMarkt: "#ee5396",
  Toppreise: "#f1c21b",
  Revendo: "#08bdba",
  "Back Market": "#4589ff",
  "Galaxus Used": "#78a9ff",
  Ricardo: "#be95ff",
  Tutti: "#3ddbd9",
};

export const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (Low → High)" },
  { value: "price-desc", label: "Price (High → Low)" },
  { value: "score-desc", label: "Score (Best)" },
  { value: "weight-asc", label: "Weight (Light)" },
  { value: "screen-desc", label: "Screen (Largest)" },
] as const;
