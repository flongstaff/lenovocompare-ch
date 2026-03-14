/**
 * PSREF → benchmark key normalization maps.
 *
 * PSREF names include suffixes like "Processor", "Laptop GPU", etc.
 * These maps convert scraped names to match our cpu-benchmarks.ts / gpu-benchmarks.ts keys.
 */

/** Regex-based CPU name normalizations applied in order */
export const cpuNameNormalizations: readonly [RegExp, string][] = [
  // Strip trailing "Processor" or "processor"
  [/\s+Processor$/i, ""],
  // Strip trailing "vPro®" / "vPro" suffixes
  [/\s+with.*?vPro.*$/i, ""],
  // Strip "with Intel vPro Enterprise" etc.
  [/\s+with\s+Intel\s+.*$/i, ""],
  // Strip trademark symbols
  [/[®™©]/g, ""],
  // Collapse multiple spaces
  [/\s{2,}/g, " "],
];

/** Regex-based GPU name normalizations applied in order */
export const gpuNameNormalizations: readonly [RegExp, string][] = [
  // Strip trademark symbols first (Specs tab uses "Intel® Arc™ Graphics")
  [/[®™©]/g, ""],
  // "NVIDIA GeForce RTX 4060 Laptop GPU" → "NVIDIA GeForce RTX 4060 Laptop"
  [/\s+GPU$/i, ""],
  // "NVIDIA GeForce RTX 4060 8GB Laptop" → "NVIDIA GeForce RTX 4060 Laptop"
  [/\s+\d+GB\s+(Laptop)/i, " $1"],
  // Collapse multiple spaces
  [/\s{2,}/g, " "],
];

/** Exact CPU name overrides: PSREF name → benchmark key */
export const cpuNameOverrides: Record<string, string> = {
  // Add overrides here as discovered during scraping
  // "Intel Core Ultra 7 155U Processor": "Intel Core Ultra 7 155U",
};

/** Exact GPU name overrides: PSREF name → benchmark key */
export const gpuNameOverrides: Record<string, string> = {
  // Integrated GPU name variations
  "Intel Iris Xe Graphics": "Intel Iris Xe",
  "Intel UHD Graphics 620": "Intel UHD 620",
  "Intel UHD Graphics": "Intel UHD 620",
  "Integrated Intel Graphics": "Intel Arc Graphics",
  "Intel Graphics": "Intel Arc Graphics",
  "AMD Radeon Integrated Graphics": "AMD Radeon Graphics",
  "AMD Radeon Vega 8 Graphics": "AMD Radeon Graphics",
  "Integrated AMD Radeon Graphics": "AMD Radeon Graphics",
  "Integrated Intel Iris Xe Graphics": "Intel Iris Xe",
  "Intel Arc Graphics (different from Intel Arc 140V)": "Intel Arc Graphics",
};

/**
 * Normalize a CPU name from PSREF to match our benchmark keys.
 * Specs tab omits "Intel" prefix (e.g., "Core Ultra 5 125H" → "Intel Core Ultra 5 125H").
 * Also handles "Ryzen" without "AMD" prefix.
 */
export const normalizeCpuName = (raw: string): string => {
  if (cpuNameOverrides[raw]) return cpuNameOverrides[raw];
  let name = raw.trim();
  for (const [pattern, replacement] of cpuNameNormalizations) {
    name = name.replace(pattern, replacement);
  }
  name = name.trim();
  // Add "Intel" prefix if starts with "Core" (Specs tab format)
  if (/^Core\s/i.test(name)) name = `Intel ${name}`;
  // Add "AMD" prefix if starts with "Ryzen" (Specs tab format)
  if (/^Ryzen\s/i.test(name)) name = `AMD ${name}`;
  return name;
};

/**
 * Normalize a GPU name from PSREF to match our benchmark keys.
 */
export const normalizeGpuName = (raw: string): string => {
  if (gpuNameOverrides[raw]) return gpuNameOverrides[raw];
  let name = raw.trim();
  for (const [pattern, replacement] of gpuNameNormalizations) {
    name = name.replace(pattern, replacement);
  }
  return name.trim();
};
