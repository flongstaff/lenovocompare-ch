import type { ModelBenchmarks } from "@/lib/types";

/**
 * Per-model chassis benchmark data from NotebookCheck reviews and other sources.
 * Keyed by laptopId. Sources:
 *   "notebookcheck" — Data from in-house NotebookCheck review (verified or closely derived)
 *   "community"     — Estimated from specs, related models, and community data
 *   "jarrodtech"    — Data from JarrodsTech (https://jarrods.tech) review
 *   "justjoshtech"  — Data from JustJosh (https://www.youtube.com/@JustJoshTech) review
 * See BenchmarkSource type in lib/types.ts for all valid sources.
 *
 * Content creation fields (pugetPremiere, pugetDavinci) sourced from
 * PugetBench (https://www.pugetsystems.com/pugetbench/) by Puget Systems.
 */
export const modelBenchmarks: Record<string, ModelBenchmarks> = {
  // ============================================================
  // ThinkPad X1 Series
  // ============================================================

  // === ThinkPad X1 Carbon Gen 13 (2025, Core Ultra 7 258V) ===
  "x1-carbon-gen13": {
    thermals: { keyboardMaxC: 41.2, undersideMaxC: 45.8 },
    fanNoise: 35.4,
    battery: { officeHours: 12.5, videoHours: 15.2 },
    batteryPerformance: { pluggedIn: 510, onBattery: 420 },
    ssdSpeed: { seqReadMBs: 7200, seqWriteMBs: 5600 },
    displayBrightness: 425,
    weightWithChargerGrams: 1680,
    memoryBandwidthGBs: 72.8,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 Carbon Gen 12 (2024, Core Ultra 7 155U) ===
  "x1-carbon-gen12": {
    thermals: { keyboardMaxC: 42.5, undersideMaxC: 47.2 },
    fanNoise: 36.8,
    battery: { officeHours: 10.2, videoHours: 12.8 },
    batteryPerformance: { pluggedIn: 740, onBattery: 520 },
    ssdSpeed: { seqReadMBs: 7050, seqWriteMBs: 5200 },
    displayBrightness: 412,
    weightWithChargerGrams: 1690,
    memoryBandwidthGBs: 68.4,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 Carbon Gen 11 (2023, i7-1365U) ===
  "x1-carbon-gen11": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 45.0 },
    fanNoise: 42.0,
    battery: { officeHours: 10.5, videoHours: 12.5 },
    ssdSpeed: { seqReadMBs: 6500, seqWriteMBs: 4800 },
    displayBrightness: 410,
    weightWithChargerGrams: 1500,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 Carbon Gen 10 (2022, i7-1270P) ===
  "x1-carbon-gen10": {
    thermals: { keyboardMaxC: 45.0, undersideMaxC: 47.0 },
    fanNoise: 35.5,
    battery: { officeHours: 10.2, videoHours: 12.0 },
    ssdSpeed: { seqReadMBs: 6500, seqWriteMBs: 4800 },
    displayBrightness: 411,
    weightWithChargerGrams: 1490,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 2-in-1 Gen 10 (2025, Core Ultra 7 256V) ===
  "x1-2in1-gen10": {
    thermals: { keyboardMaxC: 39.0, undersideMaxC: 42.0 },
    fanNoise: 32.0,
    battery: { officeHours: 14.0, videoHours: 17.0 },
    ssdSpeed: { seqReadMBs: 14245, seqWriteMBs: 13518 },
    displayBrightness: 520,
    weightWithChargerGrams: 1572,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 2-in-1 Gen 9 (2025, Core Ultra 7 258V) ===
  "x1-2in1-gen9": {
    thermals: { keyboardMaxC: 40.5, undersideMaxC: 44.5 },
    fanNoise: 34.5,
    battery: { officeHours: 11.0, videoHours: 13.0 },
    ssdSpeed: { seqReadMBs: 7000, seqWriteMBs: 5200 },
    displayBrightness: 420,
    weightWithChargerGrams: 1679,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 Yoga Gen 9 (2024, Core Ultra 7 155U) ===
  "x1-yoga-gen9": {
    thermals: { keyboardMaxC: 40.2, undersideMaxC: 44.8 },
    fanNoise: 33.8,
    battery: { officeHours: 10.8, videoHours: 13.4 },
    ssdSpeed: { seqReadMBs: 6900, seqWriteMBs: 5100 },
    displayBrightness: 445,
    weightWithChargerGrams: 1810,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 Yoga Gen 8 (2023, i7-1365U) ===
  "x1-yoga-gen8": {
    thermals: { keyboardMaxC: 40.5, undersideMaxC: 44.5 },
    fanNoise: 34.0,
    battery: { officeHours: 11.5, videoHours: 14.0 },
    ssdSpeed: { seqReadMBs: 6800, seqWriteMBs: 5000 },
    displayBrightness: 420,
    weightWithChargerGrams: 1680,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 Yoga Gen 7 (2022, i7-1270P) ===
  "x1-yoga-gen7": {
    thermals: { keyboardMaxC: 42.5, undersideMaxC: 46.0 },
    fanNoise: 37.0,
    battery: { officeHours: 9.0, videoHours: 10.5 },
    ssdSpeed: { seqReadMBs: 6500, seqWriteMBs: 4800 },
    displayBrightness: 430,
    weightWithChargerGrams: 1780,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 Yoga Gen 6 (2021, i7-1165G7) ===
  "x1-yoga-gen6": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 46.0 },
    fanNoise: 45.0,
    battery: { officeHours: 11.3, videoHours: 15.0 },
    ssdSpeed: { seqReadMBs: 5450, seqWriteMBs: 3547 },
    displayBrightness: 531,
    weightWithChargerGrams: 1697,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 Yoga Gen 5 (2020, i7-10610U) ===
  "x1-yoga-gen5": {
    thermals: { keyboardMaxC: 41.0, undersideMaxC: 48.4 },
    fanNoise: 33.7,
    battery: { officeHours: 11.0, videoHours: 13.0 },
    ssdSpeed: { seqReadMBs: 3200, seqWriteMBs: 2000 },
    displayBrightness: 420,
    weightWithChargerGrams: 1657,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 Yoga 4th Gen (2019, i7-8665U) ===
  "x1-yoga-4th": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 50.0 },
    fanNoise: 39.2,
    battery: { officeHours: 9.0, videoHours: 10.5 },
    ssdSpeed: { seqReadMBs: 3200, seqWriteMBs: 1800 },
    displayBrightness: 410,
    weightWithChargerGrams: 1702,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 Yoga 3rd Gen (2018, i7-8550U) ===
  "x1-yoga-3rd": {
    thermals: { keyboardMaxC: 43.0, undersideMaxC: 46.0 },
    fanNoise: 36.0,
    battery: { officeHours: 9.0, videoHours: 10.5 },
    ssdSpeed: { seqReadMBs: 1889, seqWriteMBs: 1400 },
    displayBrightness: 477,
    weightWithChargerGrams: 1779,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 Titanium Yoga (2021, i5-1135G7) ===
  "x1-titanium-yoga": {
    thermals: { keyboardMaxC: 40.0, undersideMaxC: 43.0 },
    fanNoise: 34.0,
    battery: { officeHours: 10.9, videoHours: 12.5 },
    ssdSpeed: { seqReadMBs: 2233, seqWriteMBs: 1511 },
    displayBrightness: 467,
    weightWithChargerGrams: 1512,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 Nano Gen 3 (2023, i7-1360P) ===
  "x1-nano-gen3": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 48.0 },
    fanNoise: 38.5,
    battery: { officeHours: 8.5, videoHours: 10.0 },
    ssdSpeed: { seqReadMBs: 6800, seqWriteMBs: 5000 },
    displayBrightness: 460,
    weightWithChargerGrams: 1265,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X1 Nano Gen 2 (2022, i7-1270P) ===
  "x1-nano-gen2": {
    thermals: { keyboardMaxC: 48.0, undersideMaxC: 50.0 },
    fanNoise: 40.0,
    battery: { officeHours: 8.0, videoHours: 9.5 },
    ssdSpeed: { seqReadMBs: 2700, seqWriteMBs: 1800 },
    displayBrightness: 450,
    weightWithChargerGrams: 1258,
    sources: ["notebookcheck"],
  },

  // ============================================================
  // ThinkPad T14s Series
  // ============================================================

  // === ThinkPad T14s Gen 6 Intel (2025, Core Ultra 7 258V) ===
  "t14s-gen6-intel": {
    thermals: { keyboardMaxC: 38.0, undersideMaxC: 41.0 },
    fanNoise: 32.0,
    battery: { officeHours: 21.0, videoHours: 16.0 },
    ssdSpeed: { seqReadMBs: 7200, seqWriteMBs: 5600 },
    displayBrightness: 500,
    weightWithChargerGrams: 1540,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T14s Gen 6 AMD (2025, Ryzen 7 PRO 8840HS) ===
  "t14s-gen6-amd": {
    thermals: { keyboardMaxC: 41.0, undersideMaxC: 45.0 },
    fanNoise: 36.0,
    battery: { officeHours: 7.5, videoHours: 9.0 },
    ssdSpeed: { seqReadMBs: 6800, seqWriteMBs: 5000 },
    displayBrightness: 420,
    weightWithChargerGrams: 1550,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T14s Gen 5 Intel (2024, Core Ultra 7 155U) ===
  "t14s-gen5-intel": {
    thermals: { keyboardMaxC: 40.8, undersideMaxC: 44.6 },
    fanNoise: 34.2,
    battery: { officeHours: 11.5, videoHours: 14.2 },
    batteryPerformance: { pluggedIn: 460, onBattery: 380 },
    ssdSpeed: { seqReadMBs: 6800, seqWriteMBs: 4900 },
    displayBrightness: 386,
    weightWithChargerGrams: 1580,
    memoryBandwidthGBs: 52.6,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T14s Gen 5 AMD (2024, Ryzen 7 PRO 8840U) ===
  "t14s-gen5-amd": {
    thermals: { keyboardMaxC: 39.6, undersideMaxC: 43.8 },
    fanNoise: 33.5,
    battery: { officeHours: 12.8, videoHours: 15.6 },
    batteryPerformance: { pluggedIn: 720, onBattery: 580 },
    ssdSpeed: { seqReadMBs: 7100, seqWriteMBs: 5400 },
    displayBrightness: 392,
    weightWithChargerGrams: 1560,
    memoryBandwidthGBs: 56.8,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T14s Gen 4 Intel (2023, i7-1365U) ===
  "t14s-gen4-intel": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 44.0 },
    fanNoise: 37.0,
    battery: { officeHours: 8.0, videoHours: 9.5 },
    ssdSpeed: { seqReadMBs: 6500, seqWriteMBs: 4800 },
    displayBrightness: 350,
    weightWithChargerGrams: 1540,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T14s Gen 4 AMD (2023, Ryzen 7 PRO 7840U) ===
  "t14s-gen4-amd": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 44.0 },
    fanNoise: 39.2,
    battery: { officeHours: 12.0, videoHours: 14.5 },
    ssdSpeed: { seqReadMBs: 5000, seqWriteMBs: 4000 },
    displayBrightness: 410,
    weightWithChargerGrams: 1540,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T14s Gen 3 Intel (2022, i7-1270P) ===
  "t14s-gen3-intel": {
    thermals: { keyboardMaxC: 41.0, undersideMaxC: 43.0 },
    fanNoise: 35.0,
    battery: { officeHours: 10.0, videoHours: 12.0 },
    ssdSpeed: { seqReadMBs: 6500, seqWriteMBs: 4800 },
    displayBrightness: 400,
    weightWithChargerGrams: 1540,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T14s Gen 3 AMD (2022, Ryzen 7 PRO 6850U) ===
  "t14s-gen3-amd": {
    thermals: { keyboardMaxC: 38.0, undersideMaxC: 40.0 },
    fanNoise: 27.3,
    battery: { officeHours: 12.0, videoHours: 14.0 },
    ssdSpeed: { seqReadMBs: 3500, seqWriteMBs: 3000 },
    displayBrightness: 400,
    weightWithChargerGrams: 1540,
    sources: ["notebookcheck"],
  },

  // ============================================================
  // ThinkPad T14 Series
  // ============================================================

  // === ThinkPad T14 Gen 6 Intel (2025, Core Ultra 5 235U) ===
  "t14-gen6-intel": {
    thermals: { keyboardMaxC: 39.0, undersideMaxC: 42.0 },
    fanNoise: 33.5,
    battery: { officeHours: 12.0, videoHours: 14.5 },
    ssdSpeed: { seqReadMBs: 7000, seqWriteMBs: 5200 },
    displayBrightness: 320,
    weightWithChargerGrams: 1720,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T14 Gen 6 AMD (2025, Ryzen 7 PRO 8840U) ===
  "t14-gen6-amd": {
    thermals: { keyboardMaxC: 41.0, undersideMaxC: 44.0 },
    fanNoise: 36.0,
    battery: { officeHours: 9.5, videoHours: 11.5 },
    ssdSpeed: { seqReadMBs: 6800, seqWriteMBs: 5000 },
    displayBrightness: 320,
    weightWithChargerGrams: 1720,
    sources: ["community"],
  },

  // === ThinkPad T14 Gen 5 Intel (2024, Core Ultra 5 125U) ===
  "t14-gen5-intel": {
    thermals: { keyboardMaxC: 41.4, undersideMaxC: 45.2 },
    fanNoise: 35.6,
    battery: { officeHours: 9.8, videoHours: 11.5 },
    ssdSpeed: { seqReadMBs: 6400, seqWriteMBs: 4200 },
    displayBrightness: 328,
    weightWithChargerGrams: 1820,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T14 Gen 5 AMD (2024, Ryzen 5 PRO 8540U) ===
  "t14-gen5-amd": {
    thermals: { keyboardMaxC: 43.0, undersideMaxC: 47.0 },
    fanNoise: 38.0,
    battery: { officeHours: 9.0, videoHours: 11.0 },
    ssdSpeed: { seqReadMBs: 6800, seqWriteMBs: 5000 },
    displayBrightness: 310,
    weightWithChargerGrams: 1720,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T14 Gen 4 Intel (2023, i7-1360P) ===
  "t14-gen4-intel": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 44.0 },
    fanNoise: 38.0,
    battery: { officeHours: 9.0, videoHours: 10.5 },
    ssdSpeed: { seqReadMBs: 6500, seqWriteMBs: 4800 },
    displayBrightness: 410,
    weightWithChargerGrams: 1720,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T14 Gen 4 AMD (2023, Ryzen 7 PRO 7840U) ===
  "t14-gen4-amd": {
    thermals: { keyboardMaxC: 39.0, undersideMaxC: 41.0 },
    fanNoise: 35.0,
    battery: { officeHours: 11.0, videoHours: 13.0 },
    ssdSpeed: { seqReadMBs: 5000, seqWriteMBs: 4000 },
    displayBrightness: 410,
    weightWithChargerGrams: 1720,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T14 Gen 3 Intel (2022, i7-1270P) ===
  "t14-gen3-intel": {
    thermals: { keyboardMaxC: 43.0, undersideMaxC: 45.0 },
    fanNoise: 40.0,
    battery: { officeHours: 7.5, videoHours: 9.0 },
    ssdSpeed: { seqReadMBs: 6500, seqWriteMBs: 4800 },
    displayBrightness: 310,
    weightWithChargerGrams: 1730,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T14 Gen 3 AMD (2022, Ryzen 7 PRO 6850U) ===
  "t14-gen3-amd": {
    thermals: { keyboardMaxC: 40.0, undersideMaxC: 42.0 },
    fanNoise: 36.0,
    battery: { officeHours: 11.0, videoHours: 13.0 },
    ssdSpeed: { seqReadMBs: 3000, seqWriteMBs: 2500 },
    displayBrightness: 400,
    weightWithChargerGrams: 1720,
    sources: ["notebookcheck"],
  },

  // ============================================================
  // ThinkPad T16 Series
  // ============================================================

  // === ThinkPad T16 Gen 3 Intel (2024, Core Ultra 7 155U) ===
  "t16-gen3-intel": {
    thermals: { keyboardMaxC: 42.8, undersideMaxC: 46.4 },
    fanNoise: 36.2,
    battery: { officeHours: 9.4, videoHours: 11.8 },
    ssdSpeed: { seqReadMBs: 6500, seqWriteMBs: 4600 },
    displayBrightness: 348,
    weightWithChargerGrams: 2320,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T16 Gen 2 Intel (2023, i7-1360P) ===
  "t16-gen2-intel": {
    thermals: { keyboardMaxC: 39.0, undersideMaxC: 41.0 },
    fanNoise: 34.0,
    battery: { officeHours: 10.0, videoHours: 12.0 },
    ssdSpeed: { seqReadMBs: 6500, seqWriteMBs: 4800 },
    displayBrightness: 410,
    weightWithChargerGrams: 1990,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T16 Gen 1 Intel (2022, i7-1270P) ===
  "t16-gen1-intel": {
    thermals: { keyboardMaxC: 38.0, undersideMaxC: 40.0 },
    fanNoise: 33.0,
    battery: { officeHours: 9.5, videoHours: 11.5 },
    ssdSpeed: { seqReadMBs: 6500, seqWriteMBs: 4800 },
    displayBrightness: 413,
    weightWithChargerGrams: 1990,
    sources: ["notebookcheck"],
  },

  // ============================================================
  // ThinkPad T480 Series (Legacy)
  // ============================================================

  // === ThinkPad T480 (2018, i7-8550U) ===
  t480: {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 45.0 },
    fanNoise: 37.0,
    battery: { officeHours: 10.5, videoHours: 12.5 },
    ssdSpeed: { seqReadMBs: 3200, seqWriteMBs: 1700 },
    displayBrightness: 270,
    weightWithChargerGrams: 2100,
    sources: ["notebookcheck"],
  },

  // === ThinkPad T480s (2018, i7-8550U) ===
  t480s: {
    thermals: { keyboardMaxC: 41.0, undersideMaxC: 44.0 },
    fanNoise: 37.0,
    battery: { officeHours: 9.0, videoHours: 10.5 },
    ssdSpeed: { seqReadMBs: 3200, seqWriteMBs: 1700 },
    displayBrightness: 302,
    weightWithChargerGrams: 1650,
    sources: ["notebookcheck"],
  },

  // ============================================================
  // ThinkPad X13 Series
  // ============================================================

  // === ThinkPad X13 Gen 5 (2024, Core Ultra 5 125U) ===
  "x13-gen5": {
    thermals: { keyboardMaxC: 41.0, undersideMaxC: 45.0 },
    fanNoise: 35.0,
    battery: { officeHours: 10.0, videoHours: 12.0 },
    ssdSpeed: { seqReadMBs: 6600, seqWriteMBs: 4800 },
    displayBrightness: 415,
    weightWithChargerGrams: 1490,
    sources: ["community"],
  },

  // === ThinkPad X13 Gen 4 Intel (2023, i7-1365U) ===
  "x13-gen4-intel": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 46.0 },
    fanNoise: 41.5,
    battery: { officeHours: 9.0, videoHours: 11.0 },
    ssdSpeed: { seqReadMBs: 6500, seqWriteMBs: 4800 },
    displayBrightness: 410,
    weightWithChargerGrams: 1510,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X13 Yoga Gen 4 (2023, i7-1355U) ===
  "x13-yoga-gen4": {
    thermals: { keyboardMaxC: 41.0, undersideMaxC: 44.0 },
    fanNoise: 35.0,
    battery: { officeHours: 10.5, videoHours: 12.5 },
    ssdSpeed: { seqReadMBs: 6500, seqWriteMBs: 4800 },
    displayBrightness: 431,
    weightWithChargerGrams: 1570,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X13 Yoga Gen 3 (2022, i7-1255U) ===
  "x13-yoga-gen3": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 47.0 },
    fanNoise: 42.0,
    battery: { officeHours: 8.5, videoHours: 10.0 },
    ssdSpeed: { seqReadMBs: 6500, seqWriteMBs: 4800 },
    displayBrightness: 410,
    weightWithChargerGrams: 1570,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X13 Yoga Gen 2 (2021, i7-1165G7) ===
  "x13-yoga-gen2": {
    thermals: { keyboardMaxC: 43.0, undersideMaxC: 51.5 },
    fanNoise: 33.9,
    battery: { officeHours: 9.0, videoHours: 11.0 },
    ssdSpeed: { seqReadMBs: 3500, seqWriteMBs: 2500 },
    displayBrightness: 423,
    weightWithChargerGrams: 1600,
    sources: ["notebookcheck"],
  },

  // === ThinkPad X13 Yoga Gen 1 (2020, i7-10510U) ===
  "x13-yoga-gen1": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 45.0 },
    fanNoise: 35.0,
    battery: { officeHours: 11.5, videoHours: 13.5 },
    ssdSpeed: { seqReadMBs: 3200, seqWriteMBs: 2000 },
    displayBrightness: 302,
    weightWithChargerGrams: 1610,
    sources: ["notebookcheck"],
  },

  // ============================================================
  // ThinkPad P Series (Workstations)
  // ============================================================

  // === ThinkPad P1 Gen 7 (2024, Core Ultra 9 185H + RTX 3000 Ada) ===
  "p1-gen7": {
    thermals: { keyboardMaxC: 45.6, undersideMaxC: 50.2 },
    fanNoise: 42.8,
    battery: { officeHours: 6.2, videoHours: 7.8 },
    batteryPerformance: { pluggedIn: 918, onBattery: 620 },
    ssdSpeed: { seqReadMBs: 7100, seqWriteMBs: 5800 },
    displayBrightness: 480,
    weightWithChargerGrams: 2680,
    memoryBandwidthGBs: 72.4,
    pugetPremiere: 980,
    pugetDavinci: 820,
    sources: ["notebookcheck"],
  },

  // === ThinkPad P16 Gen 2 (2023, i9-13980HX) ===
  "p16-gen2": {
    thermals: { keyboardMaxC: 50.0, undersideMaxC: 55.0 },
    fanNoise: 48.0,
    battery: { officeHours: 5.5, videoHours: 7.0 },
    ssdSpeed: { seqReadMBs: 7000, seqWriteMBs: 5500 },
    displayBrightness: 500,
    weightWithChargerGrams: 3600,
    sources: ["notebookcheck"],
  },

  // === ThinkPad P16s Gen 3 Intel (2024, Core Ultra 7 155H) ===
  "p16s-gen3-intel": {
    thermals: { keyboardMaxC: 43.0, undersideMaxC: 47.0 },
    fanNoise: 37.5,
    battery: { officeHours: 7.5, videoHours: 9.0 },
    ssdSpeed: { seqReadMBs: 6600, seqWriteMBs: 4800 },
    displayBrightness: 410,
    weightWithChargerGrams: 2080,
    sources: ["community"],
  },

  // === ThinkPad P16s Gen 2 (2023, i7-1360P) ===
  "p16s-gen2": {
    thermals: { keyboardMaxC: 41.0, undersideMaxC: 43.0 },
    fanNoise: 36.0,
    battery: { officeHours: 10.0, videoHours: 12.0 },
    ssdSpeed: { seqReadMBs: 5000, seqWriteMBs: 4000 },
    displayBrightness: 410,
    weightWithChargerGrams: 2050,
    sources: ["community"],
  },

  // === ThinkPad P14s Gen 5 Intel (2024, Core Ultra 7 155H) ===
  "p14s-gen5-intel": {
    thermals: { keyboardMaxC: 43.5, undersideMaxC: 48.0 },
    fanNoise: 38.0,
    battery: { officeHours: 7.5, videoHours: 9.0 },
    ssdSpeed: { seqReadMBs: 6600, seqWriteMBs: 4800 },
    displayBrightness: 420,
    weightWithChargerGrams: 1790,
    sources: ["notebookcheck"],
  },

  // === ThinkPad P14s Gen 4 (2023, i7-1360P) ===
  "p14s-gen4": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 44.0 },
    fanNoise: 37.0,
    battery: { officeHours: 7.0, videoHours: 8.5 },
    ssdSpeed: { seqReadMBs: 6500, seqWriteMBs: 4800 },
    displayBrightness: 350,
    weightWithChargerGrams: 1770,
    sources: ["notebookcheck"],
  },

  // ============================================================
  // ThinkPad L14 / L16 Series
  // ============================================================

  // === ThinkPad L14 Gen 5 Intel (2024, Core Ultra 5 125U) ===
  "l14-gen5-intel": {
    thermals: { keyboardMaxC: 43.8, undersideMaxC: 47.6 },
    fanNoise: 37.4,
    battery: { officeHours: 8.2, videoHours: 10.4 },
    ssdSpeed: { seqReadMBs: 3400, seqWriteMBs: 2800 },
    displayBrightness: 310,
    weightWithChargerGrams: 2120,
    sources: ["notebookcheck"],
  },

  // === ThinkPad L14 Gen 5 AMD (2024, Ryzen 5 PRO 7535U) ===
  "l14-gen5-amd": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 46.0 },
    fanNoise: 36.5,
    battery: { officeHours: 8.5, videoHours: 10.5 },
    ssdSpeed: { seqReadMBs: 3500, seqWriteMBs: 2500 },
    displayBrightness: 310,
    weightWithChargerGrams: 1750,
    sources: ["notebookcheck"],
  },

  // === ThinkPad L14 Gen 4 Intel (2023, i5-1345U) ===
  "l14-gen4-intel": {
    thermals: { keyboardMaxC: 43.0, undersideMaxC: 45.0 },
    fanNoise: 37.0,
    battery: { officeHours: 9.0, videoHours: 10.5 },
    ssdSpeed: { seqReadMBs: 3500, seqWriteMBs: 2500 },
    displayBrightness: 310,
    weightWithChargerGrams: 1750,
    sources: ["notebookcheck"],
  },

  // === ThinkPad L14 Gen 3 Intel (2022, i5-1245U) ===
  "l14-gen3-intel": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 44.0 },
    fanNoise: 37.0,
    battery: { officeHours: 9.0, videoHours: 10.5 },
    ssdSpeed: { seqReadMBs: 3000, seqWriteMBs: 2000 },
    displayBrightness: 305,
    weightWithChargerGrams: 1780,
    sources: ["community"],
  },

  // === ThinkPad L16 Gen 3 Intel (2024, Core Ultra 5 125U) ===
  "l16-gen3-intel": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 46.0 },
    fanNoise: 36.0,
    battery: { officeHours: 10.5, videoHours: 12.5 },
    ssdSpeed: { seqReadMBs: 6400, seqWriteMBs: 4600 },
    displayBrightness: 310,
    weightWithChargerGrams: 2090,
    sources: ["community"],
  },

  // ============================================================
  // ThinkPad L13 Yoga / 2-in-1 Series
  // ============================================================

  // === ThinkPad L13 2-in-1 Gen 6 Intel (2025, Core Ultra 5 225U) ===
  "l13-2in1-gen6-intel": {
    thermals: { keyboardMaxC: 40.0, undersideMaxC: 43.0 },
    fanNoise: 34.0,
    battery: { officeHours: 10.0, videoHours: 12.0 },
    ssdSpeed: { seqReadMBs: 7000, seqWriteMBs: 5200 },
    displayBrightness: 315,
    weightWithChargerGrams: 1680,
    sources: ["community"],
  },

  // === ThinkPad L13 2-in-1 Gen 6 AMD (2025, Ryzen 5 PRO 8540U) ===
  "l13-2in1-gen6-amd": {
    thermals: { keyboardMaxC: 41.0, undersideMaxC: 44.0 },
    fanNoise: 35.0,
    battery: { officeHours: 9.5, videoHours: 11.0 },
    ssdSpeed: { seqReadMBs: 6800, seqWriteMBs: 5000 },
    displayBrightness: 315,
    weightWithChargerGrams: 1680,
    sources: ["community"],
  },

  // === ThinkPad L13 2-in-1 Gen 5 Intel (2024, Core Ultra 5 125U) ===
  "l13-2in1-gen5-intel": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 45.0 },
    fanNoise: 36.0,
    battery: { officeHours: 8.5, videoHours: 10.0 },
    ssdSpeed: { seqReadMBs: 6200, seqWriteMBs: 4400 },
    displayBrightness: 310,
    weightWithChargerGrams: 1680,
    sources: ["community"],
  },

  // === ThinkPad L13 Yoga Gen 4 AMD (2023, Ryzen 7 PRO 7730U) ===
  "l13-yoga-gen4-amd": {
    thermals: { keyboardMaxC: 40.0, undersideMaxC: 46.5 },
    fanNoise: 30.1,
    battery: { officeHours: 7.0, videoHours: 8.5 },
    ssdSpeed: { seqReadMBs: 3500, seqWriteMBs: 2500 },
    displayBrightness: 320,
    weightWithChargerGrams: 1691,
    sources: ["notebookcheck"],
  },

  // === ThinkPad L13 Yoga Gen 4 Intel (2023, i7-1355U) ===
  "l13-yoga-gen4-intel": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 45.0 },
    fanNoise: 35.0,
    battery: { officeHours: 8.5, videoHours: 10.0 },
    ssdSpeed: { seqReadMBs: 3500, seqWriteMBs: 2500 },
    displayBrightness: 315,
    weightWithChargerGrams: 1700,
    sources: ["community"],
  },

  // === ThinkPad L13 Yoga Gen 3 Intel (2022, i7-1255U) ===
  "l13-yoga-gen3-intel": {
    thermals: { keyboardMaxC: 43.0, undersideMaxC: 46.0 },
    fanNoise: 37.0,
    battery: { officeHours: 8.0, videoHours: 9.5 },
    ssdSpeed: { seqReadMBs: 3500, seqWriteMBs: 2500 },
    displayBrightness: 310,
    weightWithChargerGrams: 1750,
    sources: ["community"],
  },

  // === ThinkPad L13 Yoga Gen 3 AMD (2022, Ryzen 7 PRO 5875U) ===
  "l13-yoga-gen3-amd": {
    thermals: { keyboardMaxC: 41.0, undersideMaxC: 44.0 },
    fanNoise: 35.0,
    battery: { officeHours: 9.0, videoHours: 10.5 },
    ssdSpeed: { seqReadMBs: 3500, seqWriteMBs: 2500 },
    displayBrightness: 310,
    weightWithChargerGrams: 1750,
    sources: ["community"],
  },

  // === ThinkPad L13 Yoga Gen 2 Intel (2021, i7-1165G7) ===
  "l13-yoga-gen2-intel": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 45.0 },
    fanNoise: 36.0,
    battery: { officeHours: 7.0, videoHours: 8.5 },
    ssdSpeed: { seqReadMBs: 3200, seqWriteMBs: 2000 },
    displayBrightness: 310,
    weightWithChargerGrams: 1760,
    sources: ["notebookcheck"],
  },

  // === ThinkPad L13 Yoga Gen 2 AMD (2021, Ryzen 7 PRO 5850U) ===
  "l13-yoga-gen2-amd": {
    thermals: { keyboardMaxC: 41.0, undersideMaxC: 44.0 },
    fanNoise: 35.0,
    battery: { officeHours: 8.0, videoHours: 9.5 },
    ssdSpeed: { seqReadMBs: 3200, seqWriteMBs: 2000 },
    displayBrightness: 310,
    weightWithChargerGrams: 1760,
    sources: ["notebookcheck"],
  },

  // === ThinkPad L13 Yoga Gen 1 (2019, i7-10510U) ===
  "l13-yoga-gen1": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 45.0 },
    fanNoise: 36.0,
    battery: { officeHours: 8.2, videoHours: 9.5 },
    ssdSpeed: { seqReadMBs: 3000, seqWriteMBs: 1800 },
    displayBrightness: 318,
    weightWithChargerGrams: 1784,
    sources: ["notebookcheck"],
  },

  // ============================================================
  // ThinkPad E Series
  // ============================================================

  // === ThinkPad E14 Gen 6 Intel (2024, Core Ultra 5 125U) ===
  "e14-gen6-intel": {
    thermals: { keyboardMaxC: 42.5, undersideMaxC: 46.0 },
    fanNoise: 36.5,
    battery: { officeHours: 8.8, videoHours: 10.5 },
    ssdSpeed: { seqReadMBs: 6200, seqWriteMBs: 4400 },
    displayBrightness: 315,
    weightWithChargerGrams: 1910,
    sources: ["notebookcheck"],
  },

  // === ThinkPad E14 Gen 5 AMD (2023, Ryzen 5 7530U) ===
  "e14-gen5": {
    thermals: { keyboardMaxC: 41.0, undersideMaxC: 43.0 },
    fanNoise: 36.0,
    battery: { officeHours: 9.0, videoHours: 10.5 },
    ssdSpeed: { seqReadMBs: 3500, seqWriteMBs: 2500 },
    displayBrightness: 350,
    weightWithChargerGrams: 1910,
    sources: ["notebookcheck"],
  },

  // === ThinkPad E14 Gen 4 Intel (2022, i5-1240P) ===
  "e14-gen4": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 44.0 },
    fanNoise: 37.0,
    battery: { officeHours: 8.5, videoHours: 10.0 },
    ssdSpeed: { seqReadMBs: 3500, seqWriteMBs: 2500 },
    displayBrightness: 310,
    weightWithChargerGrams: 1910,
    sources: ["community"],
  },

  // === ThinkPad E16 Gen 2 AMD (2024, Ryzen 5 7535HS) ===
  "e16-gen2-amd": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 44.0 },
    fanNoise: 37.0,
    battery: { officeHours: 8.5, videoHours: 10.0 },
    ssdSpeed: { seqReadMBs: 3500, seqWriteMBs: 2500 },
    displayBrightness: 310,
    weightWithChargerGrams: 2090,
    sources: ["notebookcheck"],
  },

  // ============================================================
  // IdeaPad Pro Series
  // ============================================================

  // === IdeaPad Pro 5 14AKP10 (2025, Ryzen AI 7 350) ===
  "ideapad-pro-5-14-gen10-amd": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 46.0 },
    fanNoise: 40.0,
    battery: { officeHours: 14.0, videoHours: 16.0 },
    ssdSpeed: { seqReadMBs: 7000, seqWriteMBs: 5200 },
    displayBrightness: 420,
    weightWithChargerGrams: 1770,
    sources: ["notebookcheck"],
  },

  // === IdeaPad Pro 5 16AKP10 (2025, Ryzen AI 7 350) ===
  "ideapad-pro-5-16-gen10-amd": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 46.0 },
    fanNoise: 38.0,
    battery: { officeHours: 14.0, videoHours: 17.0 },
    ssdSpeed: { seqReadMBs: 7000, seqWriteMBs: 5200 },
    displayBrightness: 365,
    weightWithChargerGrams: 2210,
    sources: ["community"],
  },

  // === IdeaPad Pro 5i 14IAH10 (2025, Core Ultra 7 255H) ===
  "ideapad-pro-5i-14-gen10": {
    thermals: { keyboardMaxC: 42.0, undersideMaxC: 46.0 },
    fanNoise: 38.0,
    battery: { officeHours: 10.0, videoHours: 12.0 },
    ssdSpeed: { seqReadMBs: 7000, seqWriteMBs: 5200 },
    displayBrightness: 420,
    weightWithChargerGrams: 1770,
    sources: ["community"],
  },

  // === IdeaPad Pro 5i 16IAH10 (2025, Core Ultra 7 255H) ===
  "ideapad-pro-5i-16-gen10": {
    thermals: { keyboardMaxC: 38.0, undersideMaxC: 40.0 },
    fanNoise: 50.0,
    battery: { officeHours: 12.5, videoHours: 12.5 },
    batteryPerformance: { pluggedIn: 1120, onBattery: 1131 },
    ssdSpeed: { seqReadMBs: 7000, seqWriteMBs: 5200 },
    displayBrightness: 365,
    weightWithChargerGrams: 2210,
    sources: ["justjoshtech"],
  },

  // === IdeaPad Pro 5 14ARP9 (2024, Ryzen 7 8845HS) ===
  "ideapad-pro-5-14-gen9-amd": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 48.0 },
    fanNoise: 44.0,
    battery: { officeHours: 12.0, videoHours: 14.0 },
    ssdSpeed: { seqReadMBs: 6600, seqWriteMBs: 4800 },
    displayBrightness: 405,
    weightWithChargerGrams: 1810,
    sources: ["notebookcheck"],
  },

  // === IdeaPad Pro 5 16ARP9 (2024, Ryzen 7 8845HS) ===
  "ideapad-pro-5-16-gen9-amd": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 49.0 },
    fanNoise: 42.0,
    battery: { officeHours: 12.5, videoHours: 15.0 },
    ssdSpeed: { seqReadMBs: 6600, seqWriteMBs: 4800 },
    displayBrightness: 365,
    weightWithChargerGrams: 2280,
    sources: ["community"],
  },

  // === IdeaPad Pro 5i 14IMH9 (2024, Core Ultra 7 155H) ===
  "ideapad-pro-5i-14-gen9": {
    thermals: { keyboardMaxC: 43.0, undersideMaxC: 47.0 },
    fanNoise: 38.0,
    battery: { officeHours: 9.0, videoHours: 11.0 },
    ssdSpeed: { seqReadMBs: 6600, seqWriteMBs: 4800 },
    displayBrightness: 415,
    weightWithChargerGrams: 1790,
    sources: ["community"],
  },

  // === IdeaPad Pro 5i 16IMH9 (2024, Core Ultra 7 155H) ===
  "ideapad-pro-5i-16-gen9": {
    thermals: { keyboardMaxC: 43.2, undersideMaxC: 48.4 },
    fanNoise: 38.6,
    battery: { officeHours: 8.5, videoHours: 10.2 },
    ssdSpeed: { seqReadMBs: 6600, seqWriteMBs: 4800 },
    displayBrightness: 380,
    weightWithChargerGrams: 2180,
    sources: ["notebookcheck"],
  },

  // === IdeaPad Pro 7 14ASP9 (2024, Core Ultra 9 185H) ===
  "ideapad-pro-7-14-gen9": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 49.0 },
    fanNoise: 42.0,
    battery: { officeHours: 8.5, videoHours: 10.0 },
    ssdSpeed: { seqReadMBs: 7000, seqWriteMBs: 5200 },
    displayBrightness: 620,
    weightWithChargerGrams: 1940,
    sources: ["community"],
  },

  // === IdeaPad Pro 7 16ASP9 (2024, Core Ultra 9 185H) ===
  "ideapad-pro-7-16-gen9": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 49.0 },
    fanNoise: 42.0,
    battery: { officeHours: 9.0, videoHours: 11.0 },
    ssdSpeed: { seqReadMBs: 7000, seqWriteMBs: 5200 },
    displayBrightness: 620,
    weightWithChargerGrams: 2290,
    sources: ["community"],
  },

  // === IdeaPad Pro 5 14ARP8 (2023, Ryzen 7 7840HS) ===
  "ideapad-pro-5-14-gen8-amd": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 49.0 },
    fanNoise: 43.0,
    battery: { officeHours: 8.5, videoHours: 10.0 },
    ssdSpeed: { seqReadMBs: 6400, seqWriteMBs: 4600 },
    displayBrightness: 410,
    weightWithChargerGrams: 1810,
    sources: ["community"],
  },

  // === IdeaPad Pro 5 16ARP8 (2023, Ryzen 7 7735HS) ===
  "ideapad-pro-5-16-gen8-amd": {
    thermals: { keyboardMaxC: 43.0, undersideMaxC: 48.0 },
    fanNoise: 40.0,
    battery: { officeHours: 10.0, videoHours: 12.0 },
    ssdSpeed: { seqReadMBs: 6400, seqWriteMBs: 4600 },
    displayBrightness: 360,
    weightWithChargerGrams: 2240,
    sources: ["community"],
  },

  // === IdeaPad Pro 5i 14IRH8 (2023, i7-13700H) ===
  "ideapad-pro-5i-14-gen8": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 49.0 },
    fanNoise: 42.0,
    battery: { officeHours: 8.0, videoHours: 10.0 },
    ssdSpeed: { seqReadMBs: 6400, seqWriteMBs: 4600 },
    displayBrightness: 415,
    weightWithChargerGrams: 1790,
    sources: ["community"],
  },

  // === IdeaPad Pro 5i 16IRH8 (2023, i7-13700H) ===
  "ideapad-pro-5i-16-gen8": {
    thermals: { keyboardMaxC: 43.0, undersideMaxC: 48.0 },
    fanNoise: 40.0,
    battery: { officeHours: 11.6, videoHours: 14.0 },
    ssdSpeed: { seqReadMBs: 6400, seqWriteMBs: 4600 },
    displayBrightness: 365,
    weightWithChargerGrams: 2240,
    sources: ["community"],
  },

  // ============================================================
  // Legion Series
  // ============================================================

  // === Legion 7i 16 Gen 10 (2025, Core Ultra 9 275HX + RTX 5070/5080) ===
  "legion-7i-16-gen10": {
    thermals: { keyboardMaxC: 45.0, undersideMaxC: 53.0 },
    fanNoise: 49.0,
    battery: { officeHours: 5.0, videoHours: 6.5 },
    ssdSpeed: { seqReadMBs: 7200, seqWriteMBs: 6000 },
    displayBrightness: 500,
    weightWithChargerGrams: 3600,
    sources: ["community"],
  },

  // === Legion Pro 5 16 Gen 10 AMD (2025, Ryzen 7 9755HX + RTX 5060/5070) ===
  "legion-pro-5-16-gen10-amd": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 52.0 },
    fanNoise: 48.0,
    battery: { officeHours: 5.0, videoHours: 6.5 },
    ssdSpeed: { seqReadMBs: 7200, seqWriteMBs: 5800 },
    displayBrightness: 400,
    weightWithChargerGrams: 3400,
    sources: ["community"],
  },

  // === Legion Pro 5i 16 Gen 10 (2025, Core Ultra 7/9 275HX + RTX 5060/5070/5070 Ti) ===
  "legion-pro-5i-16-gen10": {
    thermals: { keyboardMaxC: 45.0, undersideMaxC: 52.0 },
    fanNoise: 49.0,
    battery: { officeHours: 4.5, videoHours: 6.0 },
    ssdSpeed: { seqReadMBs: 7200, seqWriteMBs: 5800 },
    displayBrightness: 400,
    weightWithChargerGrams: 3500,
    sources: ["community"],
  },

  // === Legion Pro 7i 16 Gen 10 (2025, Core Ultra 9 275HX + RTX 5080) ===
  "legion-pro-7i-16-gen10": {
    thermals: { keyboardMaxC: 46.0, undersideMaxC: 54.0 },
    fanNoise: 50.0,
    battery: { officeHours: 5.0, videoHours: 6.5 },
    ssdSpeed: { seqReadMBs: 7200, seqWriteMBs: 6000 },
    displayBrightness: 520,
    weightWithChargerGrams: 3850,
    sources: ["notebookcheck"],
  },

  // === Legion 5i 16 Gen 10 (2025, Core Ultra 7 275HX) ===
  "legion-5i-15-gen10": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 51.0 },
    fanNoise: 48.0,
    battery: { officeHours: 4.5, videoHours: 6.0 },
    ssdSpeed: { seqReadMBs: 7200, seqWriteMBs: 5800 },
    displayBrightness: 365,
    weightWithChargerGrams: 3300,
    sources: ["community"],
  },

  // === Legion 5 16 Gen 10 AMD (2025, Ryzen 7 9755HX) ===
  "legion-5-15-gen10-amd": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 51.0 },
    fanNoise: 48.0,
    battery: { officeHours: 5.5, videoHours: 7.0 },
    ssdSpeed: { seqReadMBs: 7200, seqWriteMBs: 5800 },
    displayBrightness: 365,
    weightWithChargerGrams: 3300,
    sources: ["community"],
  },

  // === Legion 7i 16 Gen 9 (2024, i9-14900HX + RTX 4080) ===
  "legion-7i-16-gen9": {
    thermals: { keyboardMaxC: 44.8, undersideMaxC: 52.6 },
    fanNoise: 48.2,
    battery: { officeHours: 5.8, videoHours: 7.2 },
    batteryPerformance: { pluggedIn: 1240, onBattery: 580 },
    ssdSpeed: { seqReadMBs: 7200, seqWriteMBs: 6100 },
    displayBrightness: 520,
    weightWithChargerGrams: 3840,
    memoryBandwidthGBs: 78.4,
    pugetPremiere: 1180,
    pugetDavinci: 980,
    sources: ["notebookcheck", "jarrodtech"],
  },

  // === Legion 5i 16 Gen 9 (2024, i7-14700HX + RTX 4060) ===
  "legion-5i-16-gen9": {
    thermals: { keyboardMaxC: 43.6, undersideMaxC: 50.4 },
    fanNoise: 46.5,
    battery: { officeHours: 5.2, videoHours: 6.8 },
    batteryPerformance: { pluggedIn: 1020, onBattery: 480 },
    ssdSpeed: { seqReadMBs: 7000, seqWriteMBs: 5600 },
    displayBrightness: 340,
    weightWithChargerGrams: 3420,
    memoryBandwidthGBs: 74.2,
    sources: ["notebookcheck"],
  },

  // === Legion 5 16 Gen 9 AMD (2024, Ryzen 7 8845HS + RTX 4060) ===
  "legion-5-16-gen9-amd": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 51.0 },
    fanNoise: 47.0,
    battery: { officeHours: 5.0, videoHours: 6.5 },
    ssdSpeed: { seqReadMBs: 7000, seqWriteMBs: 5600 },
    displayBrightness: 360,
    weightWithChargerGrams: 3310,
    sources: ["community"],
  },

  // === Legion Pro 5i 16 Gen 9 (2024, i9-14900HX + RTX 4070) ===
  "legion-pro-5i-16-gen9": {
    thermals: { keyboardMaxC: 50.2, undersideMaxC: 55.0 },
    fanNoise: 59.0,
    battery: { officeHours: 4.5, videoHours: 5.5 },
    ssdSpeed: { seqReadMBs: 6600, seqWriteMBs: 5200 },
    displayBrightness: 375,
    weightWithChargerGrams: 3640,
    sources: ["notebookcheck"],
  },

  // === Legion Pro 5 16 Gen 9 AMD (2024, Ryzen 9 8945HS + RTX 4070) ===
  "legion-pro-5-16-gen9-amd": {
    thermals: { keyboardMaxC: 46.0, undersideMaxC: 53.0 },
    fanNoise: 49.0,
    battery: { officeHours: 4.5, videoHours: 6.0 },
    ssdSpeed: { seqReadMBs: 7000, seqWriteMBs: 5600 },
    displayBrightness: 520,
    weightWithChargerGrams: 3490,
    sources: ["community"],
  },

  // === Legion Slim 5 14 Gen 9 AMD (2024, Ryzen 7 8845HS + RTX 4060) ===
  "legion-slim-5-14-gen9-amd": {
    thermals: { keyboardMaxC: 40.5, undersideMaxC: 52.0 },
    fanNoise: 50.0,
    battery: { officeHours: 8.5, videoHours: 10.0 },
    ssdSpeed: { seqReadMBs: 6800, seqWriteMBs: 4800 },
    displayBrightness: 395,
    weightWithChargerGrams: 1990,
    sources: ["community"],
  },

  // === Legion Slim 5 16 Gen 9 AMD (2024, Ryzen 7 8845HS + RTX 4060) ===
  "legion-slim-5-16-gen9-amd": {
    thermals: { keyboardMaxC: 43.0, undersideMaxC: 50.0 },
    fanNoise: 48.0,
    battery: { officeHours: 6.0, videoHours: 7.5 },
    ssdSpeed: { seqReadMBs: 6800, seqWriteMBs: 5000 },
    displayBrightness: 370,
    weightWithChargerGrams: 2610,
    sources: ["community"],
  },

  // === Legion Pro 5i 16 Gen 8 (2023, i9-13900HX + RTX 4070) ===
  "legion-pro-5i-16-gen8": {
    thermals: { keyboardMaxC: 46.0, undersideMaxC: 53.0 },
    fanNoise: 48.0,
    battery: { officeHours: 4.6, videoHours: 6.0 },
    ssdSpeed: { seqReadMBs: 6800, seqWriteMBs: 5200 },
    displayBrightness: 406,
    weightWithChargerGrams: 3720,
    sources: ["notebookcheck"],
  },

  // === Legion 5i 16 Gen 8 (2023, i7-13700H + RTX 4060) ===
  "legion-5i-16-gen8": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 51.0 },
    fanNoise: 47.0,
    battery: { officeHours: 5.0, videoHours: 6.5 },
    ssdSpeed: { seqReadMBs: 6600, seqWriteMBs: 5000 },
    displayBrightness: 360,
    weightWithChargerGrams: 3360,
    sources: ["community"],
  },

  // === Legion 5 15 Gen 8 AMD (2023, Ryzen 7 7840HS + RTX 4060) ===
  "legion-5-15-gen8-amd": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 51.0 },
    fanNoise: 47.0,
    battery: { officeHours: 5.0, videoHours: 6.5 },
    ssdSpeed: { seqReadMBs: 6600, seqWriteMBs: 5000 },
    displayBrightness: 320,
    weightWithChargerGrams: 3400,
    sources: ["community"],
  },

  // === Legion 5i 15 Gen 7 (2022, i7-12700H + RTX 3060) ===
  "legion-5i-15-gen7": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 51.0 },
    fanNoise: 53.0,
    battery: { officeHours: 5.5, videoHours: 7.0 },
    ssdSpeed: { seqReadMBs: 6400, seqWriteMBs: 4800 },
    displayBrightness: 390,
    weightWithChargerGrams: 3400,
    sources: ["notebookcheck"],
  },

  // === Legion 5 15 Gen 7 AMD (2022, Ryzen 7 6800H + RTX 3060) ===
  "legion-5-15-gen7-amd": {
    thermals: { keyboardMaxC: 44.0, undersideMaxC: 51.0 },
    fanNoise: 50.0,
    battery: { officeHours: 5.5, videoHours: 7.0 },
    ssdSpeed: { seqReadMBs: 6400, seqWriteMBs: 4800 },
    displayBrightness: 320,
    weightWithChargerGrams: 3400,
    sources: ["community"],
  },
};
