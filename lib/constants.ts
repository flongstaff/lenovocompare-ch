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

export const LINEUP_COLORS: Record<Lineup, { bg: string; text: string; border: string }> = {
  ThinkPad: { bg: "bg-zinc-800/40", text: "text-zinc-300", border: "border-zinc-600" },
  "IdeaPad Pro": { bg: "bg-sky-900/30", text: "text-sky-400", border: "border-sky-700" },
  Legion: { bg: "bg-orange-900/30", text: "text-orange-400", border: "border-orange-700" },
};

export const SERIES_COLORS: Record<Series, { bg: string; text: string; border: string }> = {
  // ThinkPad series
  X1: { bg: "bg-red-900/30", text: "text-red-400", border: "border-red-700" },
  T: { bg: "bg-blue-900/30", text: "text-blue-400", border: "border-blue-700" },
  P: { bg: "bg-amber-900/30", text: "text-amber-400", border: "border-amber-700" },
  L: { bg: "bg-green-900/30", text: "text-green-400", border: "border-green-700" },
  E: { bg: "bg-purple-900/30", text: "text-purple-400", border: "border-purple-700" },
  // IdeaPad Pro series
  "Pro 5": { bg: "bg-sky-900/30", text: "text-sky-400", border: "border-sky-700" },
  "Pro 5i": { bg: "bg-indigo-900/30", text: "text-indigo-400", border: "border-indigo-700" },
  "Pro 7": { bg: "bg-violet-900/30", text: "text-violet-400", border: "border-violet-700" },
  // Legion series
  "5": { bg: "bg-orange-900/30", text: "text-orange-400", border: "border-orange-700" },
  "5i": { bg: "bg-rose-900/30", text: "text-rose-400", border: "border-rose-700" },
  "7": { bg: "bg-red-900/30", text: "text-red-400", border: "border-red-700" },
  "7i": { bg: "bg-fuchsia-900/30", text: "text-fuchsia-400", border: "border-fuchsia-700" },
  Pro: { bg: "bg-yellow-900/30", text: "text-yellow-400", border: "border-yellow-700" },
  Slim: { bg: "bg-teal-900/30", text: "text-teal-400", border: "border-teal-700" },
};

export const USE_CASE_COLORS: Record<UseCase, { bg: string; text: string }> = {
  "Business Travel": { bg: "bg-blue-900/30", text: "text-blue-400" },
  Developer: { bg: "bg-violet-900/30", text: "text-violet-400" },
  "Creative Work": { bg: "bg-pink-900/30", text: "text-pink-400" },
  Budget: { bg: "bg-green-900/30", text: "text-green-400" },
  "Desktop Replacement": { bg: "bg-amber-900/30", text: "text-amber-400" },
  Ultraportable: { bg: "bg-cyan-900/30", text: "text-cyan-400" },
  Student: { bg: "bg-teal-900/30", text: "text-teal-400" },
  "IT Fleet": { bg: "bg-slate-700/30", text: "text-slate-400" },
  "Light Gaming": { bg: "bg-orange-900/30", text: "text-orange-400" },
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
