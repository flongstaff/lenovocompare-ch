/**
 * App-wide constants — localStorage keys, retailer names, lineup/series color palettes,
 * comparison slot colors, sort options, and maximum compare count.
 */
import type { Lineup, Series, UseCase } from "./types";

export const STORAGE_KEYS = {
  prices: "lenovocompare-prices",
  compare: "lenovocompare-compare",
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

/** IBM Carbon palette colors assigned to each model slot in multi-model comparison charts */
export const COMPARE_COLORS = ["#4589ff", "#ee5396", "#42be65", "#f1c21b"] as const;

export const MAX_COMPARE = 4;

export const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (Low → High)" },
  { value: "price-desc", label: "Price (High → Low)" },
  { value: "score-desc", label: "Score (Best)" },
  { value: "weight-asc", label: "Weight (Light)" },
  { value: "screen-desc", label: "Screen (Largest)" },
] as const;
