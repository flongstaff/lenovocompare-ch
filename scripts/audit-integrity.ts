/**
 * Comprehensive cross-file data integrity audit.
 * Run with: npx tsx scripts/audit-integrity.ts
 */
import { laptops } from "../data/laptops";
import { cpuBenchmarksExpanded } from "../data/cpu-benchmarks";
import { gpuBenchmarks } from "../data/gpu-benchmarks";
import { modelBenchmarks } from "../data/model-benchmarks";
import { linuxCompat } from "../data/linux-compat";
import { modelEditorial } from "../data/model-editorial";
import { seedPrices } from "../data/seed-prices";
import { priceBaselines } from "../data/price-baselines";
import { cpuGuide, gpuGuide } from "../data/hardware-guide";

const laptopIds = new Set(laptops.map((l) => l.id));
console.log("Total laptops:", laptopIds.size);

const allCpuNames = new Set<string>();
const allGpuNames = new Set<string>();
for (const l of laptops) {
  allCpuNames.add(l.processor.name);
  if (l.processorOptions) l.processorOptions.forEach((o) => allCpuNames.add(o.name));
  allGpuNames.add(l.gpu.name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lap = l as any;
  if (lap.gpuOptions) lap.gpuOptions.forEach((o: { name: string }) => allGpuNames.add(o.name));
}

console.log("\n=== MODEL BENCHMARKS ===");
const mbIds = new Set(Object.keys(modelBenchmarks));
for (const id of laptopIds) {
  if (mbIds.has(id) === false) console.log("  MISSING:", id);
}
for (const id of mbIds) {
  if (laptopIds.has(id) === false) console.log("  ORPHAN:", id);
}
console.log("Entries:", mbIds.size, "Expected:", laptopIds.size);

for (const [id, m] of Object.entries(modelBenchmarks)) {
  if (m.thermals) {
    if (m.thermals.keyboardMaxC < 25 || m.thermals.keyboardMaxC > 100)
      console.log("  IMPLAUSIBLE thermals.keyboard", id, m.thermals.keyboardMaxC);
    if (m.thermals.undersideMaxC < 25 || m.thermals.undersideMaxC > 100)
      console.log("  IMPLAUSIBLE thermals.underside", id, m.thermals.undersideMaxC);
  }
  if (m.battery) {
    if (m.battery.officeHours < 2 || m.battery.officeHours > 25)
      console.log("  IMPLAUSIBLE battery.office", id, m.battery.officeHours);
    if (m.battery.videoHours < 2 || m.battery.videoHours > 25)
      console.log("  IMPLAUSIBLE battery.video", id, m.battery.videoHours);
  }
  if (m.fanNoise !== undefined && (m.fanNoise < 20 || m.fanNoise > 60))
    console.log("  IMPLAUSIBLE fanNoise", id, m.fanNoise);
}

console.log("\n=== LINUX COMPAT ===");
const lcIds = new Set(Object.keys(linuxCompat));
for (const id of laptopIds) {
  if (lcIds.has(id) === false) console.log("  MISSING:", id);
}
for (const id of lcIds) {
  if (laptopIds.has(id) === false) console.log("  ORPHAN:", id);
}
console.log("Entries:", lcIds.size, "Expected:", laptopIds.size);

console.log("\n=== EDITORIAL ===");
const edIds = new Set(Object.keys(modelEditorial));
for (const id of laptopIds) {
  if (edIds.has(id) === false) console.log("  MISSING:", id);
}
for (const id of edIds) {
  if (laptopIds.has(id) === false) console.log("  ORPHAN:", id);
}
console.log("Entries:", edIds.size, "Expected:", laptopIds.size);

console.log("\n=== SEED PRICES ===");
const spLaptopIds = new Set(seedPrices.map((p) => p.laptopId));
for (const id of laptopIds) {
  if (spLaptopIds.has(id) === false) console.log("  MISSING:", id);
}
const orphanPrices = new Set<string>();
for (const p of seedPrices) {
  if (laptopIds.has(p.laptopId) === false) orphanPrices.add(p.laptopId);
}
orphanPrices.forEach((id) => console.log("  ORPHAN laptopId:", id));
console.log("Entries:", seedPrices.length, "Models:", spLaptopIds.size, "Expected:", laptopIds.size);

const spIdNums = seedPrices.map((p) => parseInt(p.id.replace("sp-", "")));
const maxSpId = Math.max(...spIdNums);
const minSpId = Math.min(...spIdNums);
const spIdSet = new Set(spIdNums);
const gaps: number[] = [];
for (let i = minSpId; i <= maxSpId; i++) {
  if (spIdSet.has(i) === false) gaps.push(i);
}
console.log("ID range: sp-" + minSpId + " to sp-" + maxSpId);
if (gaps.length > 0) console.log("  GAPS:", gaps.map((g) => "sp-" + g).join(", "));
else console.log("  No gaps");
const dupeNums = spIdNums.filter((id: number, idx: number) => spIdNums.indexOf(id) !== idx);
if (dupeNums.length > 0)
  console.log("  DUPLICATE IDs:", [...new Set(dupeNums)].map((n: number) => "sp-" + n).join(", "));

console.log("\n=== PRICE BASELINES ===");
const pbIds = new Set(Object.keys(priceBaselines));
for (const id of laptopIds) {
  if (pbIds.has(id) === false) console.log("  MISSING:", id);
}
for (const id of pbIds) {
  if (laptopIds.has(id) === false) console.log("  ORPHAN:", id);
}
console.log("Entries:", pbIds.size, "Expected:", laptopIds.size);
for (const [id, p] of Object.entries(priceBaselines)) {
  if (p.historicalLowCHF > p.typicalRetailCHF)
    console.log("  WARNING low>retail", id, p.historicalLowCHF, ">", p.typicalRetailCHF);
  if (p.typicalRetailCHF > p.msrpCHF) console.log("  WARNING retail>msrp", id, p.typicalRetailCHF, ">", p.msrpCHF);
}

console.log("\n=== CPU BENCHMARKS ===");
const cpuBenchmarkNames = new Set(Object.keys(cpuBenchmarksExpanded));
const missingCPU: string[] = [];
for (const cpu of allCpuNames) {
  if (cpuBenchmarkNames.has(cpu) === false) missingCPU.push(cpu);
}
const unusedCPU: string[] = [];
for (const cpu of cpuBenchmarkNames) {
  if (allCpuNames.has(cpu) === false) unusedCPU.push(cpu);
}
console.log("CPUs in laptops:", allCpuNames.size, "Benchmarks:", cpuBenchmarkNames.size);
missingCPU.forEach((c) => console.log("  MISSING BENCHMARK:", c));
unusedCPU.forEach((c) => console.log("  UNUSED BENCHMARK:", c));

console.log("\n=== GPU BENCHMARKS ===");
const gpuBenchmarkNames = new Set(Object.keys(gpuBenchmarks));
const missingGPU: string[] = [];
for (const gpu of allGpuNames) {
  if (gpuBenchmarkNames.has(gpu) === false) missingGPU.push(gpu);
}
const unusedGPU: string[] = [];
for (const gpu of gpuBenchmarkNames) {
  if (allGpuNames.has(gpu) === false) unusedGPU.push(gpu);
}
console.log("GPUs in laptops:", allGpuNames.size, "Benchmarks:", gpuBenchmarkNames.size);
missingGPU.forEach((g) => console.log("  MISSING BENCHMARK:", g));
unusedGPU.forEach((g) => console.log("  UNUSED BENCHMARK:", g));

console.log("\n=== HARDWARE GUIDE ===");
const cpuGuideNames = new Set(Object.keys(cpuGuide));
const gpuGuideNames = new Set(Object.keys(gpuGuide));
const missingCpuGuide: string[] = [];
for (const cpu of allCpuNames) {
  if (cpuGuideNames.has(cpu) === false) missingCpuGuide.push(cpu);
}
const missingGpuGuide: string[] = [];
for (const gpu of allGpuNames) {
  if (gpuGuideNames.has(gpu) === false) missingGpuGuide.push(gpu);
}
console.log("CPU guide:", cpuGuideNames.size, "(missing:", missingCpuGuide.length + ")");
missingCpuGuide.forEach((c) => console.log("  MISSING CPU GUIDE:", c));
console.log("GPU guide:", gpuGuideNames.size, "(missing:", missingGpuGuide.length + ")");
missingGpuGuide.forEach((g) => console.log("  MISSING GPU GUIDE:", g));
const orphanCpuGuide: string[] = [];
for (const cpu of cpuGuideNames) {
  if (allCpuNames.has(cpu) === false) orphanCpuGuide.push(cpu);
}
const orphanGpuGuide: string[] = [];
for (const gpu of gpuGuideNames) {
  if (allGpuNames.has(gpu) === false) orphanGpuGuide.push(gpu);
}
if (orphanCpuGuide.length) {
  console.log("  Orphan CPU guide:", orphanCpuGuide.length);
  orphanCpuGuide.forEach((c) => console.log("    ORPHAN:", c));
}
if (orphanGpuGuide.length) {
  console.log("  Orphan GPU guide:", orphanGpuGuide.length);
  orphanGpuGuide.forEach((g) => console.log("    ORPHAN:", g));
}

console.log("\n=== DUPLICATE IDS ===");
const idCounts = new Map<string, number>();
for (const l of laptops) {
  idCounts.set(l.id, (idCounts.get(l.id) || 0) + 1);
}
let dc = 0;
for (const [id, count] of idCounts) {
  if (count > 1) {
    console.log("  DUPLICATE:", id, "x" + count);
    dc++;
  }
}
if (dc === 0) console.log("  No duplicates");

console.log("\n========================================");
console.log("SUMMARY");
console.log("========================================");
console.log("Laptops:", laptopIds.size);
console.log(
  "Model benchmarks:",
  mbIds.size,
  "(missing:",
  [...laptopIds].filter((id) => mbIds.has(id) === false).length + ", orphan:",
  [...mbIds].filter((id) => laptopIds.has(id) === false).length + ")",
);
console.log(
  "Linux compat:",
  lcIds.size,
  "(missing:",
  [...laptopIds].filter((id) => lcIds.has(id) === false).length + ", orphan:",
  [...lcIds].filter((id) => laptopIds.has(id) === false).length + ")",
);
console.log(
  "Editorial:",
  edIds.size,
  "(missing:",
  [...laptopIds].filter((id) => edIds.has(id) === false).length + ", orphan:",
  [...edIds].filter((id) => laptopIds.has(id) === false).length + ")",
);
console.log(
  "Seed prices:",
  seedPrices.length,
  "entries,",
  spLaptopIds.size,
  "models (missing:",
  [...laptopIds].filter((id) => spLaptopIds.has(id) === false).length + ", gaps:",
  gaps.length + ")",
);
console.log(
  "Price baselines:",
  pbIds.size,
  "(missing:",
  [...laptopIds].filter((id) => pbIds.has(id) === false).length + ", orphan:",
  [...pbIds].filter((id) => laptopIds.has(id) === false).length + ")",
);
console.log(
  "CPU benchmarks:",
  cpuBenchmarkNames.size,
  "(missing:",
  missingCPU.length + ", unused:",
  unusedCPU.length + ")",
);
console.log(
  "GPU benchmarks:",
  gpuBenchmarkNames.size,
  "(missing:",
  missingGPU.length + ", unused:",
  unusedGPU.length + ")",
);
console.log(
  "Hardware guide: CPU",
  cpuGuideNames.size,
  "(missing:",
  missingCpuGuide.length + "), GPU",
  gpuGuideNames.size,
  "(missing:",
  missingGpuGuide.length + ")",
);
