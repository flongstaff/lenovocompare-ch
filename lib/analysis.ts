/**
 * Auto-generated model analysis — derives pros/cons, use-case recommendations,
 * upgrade paths, gaming tier, and scenario verdicts from raw specs and scores.
 *
 * All output is deterministic (no AI/LLM calls). Series descriptions provide
 * lineup-aware context for each model's positioning.
 */
import type { Laptop, ModelAnalysis, UseCase, UseCaseScenario, ScenarioVerdict } from "./types";
import { getPerformanceScore, getGpuScore, getGamingTier, getMemoryScore } from "./scoring";

const SERIES_DESCRIPTIONS: Record<string, string> = {
  // ThinkPad
  X1: "flagship ultraportable built for executive mobility",
  T: "mainstream business workhorse balancing performance and portability",
  P: "mobile workstation engineered for professional compute tasks",
  L: "value-oriented business laptop prioritizing expandability",
  E: "entry-level ThinkPad delivering core business essentials",
  // IdeaPad Pro
  "Pro 5": "mainstream creator laptop with strong display and solid performance",
  "Pro 5i": "Intel-based creator laptop pairing performance with premium displays",
  "Pro 7": "premium IdeaPad with high-end display and powerful processing",
  // Legion
  "5": "mainstream gaming laptop balancing price and performance",
  "5i": "Intel-based mainstream gaming laptop with capable dGPU",
  "7": "high-performance gaming laptop with premium cooling and display",
  "7i": "Intel-powered high-end gaming laptop with top-tier thermals",
  Pro: "competition-grade gaming laptop with maximum GPU power",
  Slim: "thin gaming laptop trading some thermals for portability",
};

const hasPort = (ports: readonly string[], pattern: string): boolean =>
  ports.some((p) => p.toLowerCase().includes(pattern.toLowerCase()));

const countPort = (ports: readonly string[], pattern: string): number =>
  ports.reduce((count, p) => {
    const match = p.match(/^(\d+)x\s/);
    if (p.toLowerCase().includes(pattern.toLowerCase())) {
      return count + (match ? parseInt(match[1], 10) : 1);
    }
    return count;
  }, 0);

const derivePros = (model: Laptop): string[] => {
  const pros: string[] = [];
  const perfScore = getPerformanceScore(model.processor.name);

  if (model.weight < 1.0) pros.push("Sub-1 kg ultralight chassis");
  else if (model.weight <= 1.15) pros.push("Exceptionally light at " + model.weight + " kg");

  if (model.display.panel === "OLED") pros.push(model.display.resolutionLabel + " OLED display with deep blacks");
  if (model.display.refreshRate >= 120) pros.push(model.display.refreshRate + " Hz smooth refresh rate");
  if (model.display.nits >= 450) pros.push("Bright " + model.display.nits + "-nit display");
  if (model.display.touchscreen) pros.push("Touchscreen input");

  if (model.ram.size >= 32) pros.push(model.ram.size + " GB memory for heavy multitasking");
  if (!model.ram.soldered && model.ram.slots >= 2)
    pros.push("User-upgradeable RAM (" + model.ram.slots + " SODIMM slots)");

  if (model.storage.slots >= 2) pros.push("Dual M.2 storage slots");
  if (model.storage.size >= 1024) pros.push("1 TB+ onboard storage");

  if (model.battery.whr >= 70) pros.push("Large " + model.battery.whr + " Wh battery for all-day use");
  if (model.battery.removable) pros.push("Hot-swappable removable battery");

  const tb4Count = countPort(model.ports, "Thunderbolt 4");
  if (tb4Count >= 2) pros.push(tb4Count + "x Thunderbolt 4 for docking and eGPU");
  else if (tb4Count === 1) pros.push("Thunderbolt 4 connectivity");

  if (hasPort(model.ports, "RJ45")) pros.push("Built-in Ethernet (RJ45)");
  if (hasPort(model.ports, "SD card") || hasPort(model.ports, "SD Express")) pros.push("SD card reader");

  if (model.wireless.some((w) => w.includes("Wi-Fi 7"))) pros.push("Wi-Fi 7 for next-gen wireless speeds");

  if (!model.gpu.integrated)
    pros.push("Discrete " + model.gpu.name + " GPU" + (model.gpu.vram ? " (" + model.gpu.vram + " GB VRAM)" : ""));

  const gamingTier = getGamingTier(model.gpu.name);
  if (gamingTier === "Heavy") pros.push("Capable of heavy gaming at 1080p");
  else if (gamingTier === "Medium") pros.push("Handles medium gaming at 720p–1080p");

  if (model.linuxStatus === "certified") pros.push("Lenovo Linux-certified");

  if (perfScore >= 75) pros.push("High-performance " + model.processor.cores + "-core CPU");

  if (model.keyboard?.trackpoint) pros.push("TrackPoint pointing stick");

  return pros;
};

const deriveCons = (model: Laptop): string[] => {
  const cons: string[] = [];
  const perfScore = getPerformanceScore(model.processor.name);

  if (model.ram.soldered) cons.push("RAM soldered — not user-upgradeable");
  if (model.ram.maxSize <= 16) cons.push("Maximum " + model.ram.maxSize + " GB RAM ceiling");

  if (!hasPort(model.ports, "RJ45")) cons.push("No built-in Ethernet");
  if (!hasPort(model.ports, "SD card") && !hasPort(model.ports, "SD Express")) cons.push("No SD card reader");

  if (model.storage.size <= 256 && model.storage.slots === 1)
    cons.push("Small " + model.storage.size + " GB single storage slot");

  if (model.display.nits <= 250) cons.push("Dim " + model.display.nits + "-nit display");
  if (model.display.panel === "TN") cons.push("TN panel with poor viewing angles");

  if (model.battery.whr < 47) cons.push("Small " + model.battery.whr + " Wh battery");

  if (model.weight >= 2.0) cons.push("Heavy at " + model.weight + " kg");
  else if (model.weight >= 1.7) cons.push("On the heavier side at " + model.weight + " kg");

  if (model.display.panel === "OLED" && model.display.refreshRate <= 60) cons.push("OLED limited to 60 Hz");

  if (model.year <= 2022) cons.push("Aging " + model.year + " platform — limited vendor support horizon");

  if (model.wireless.some((w) => w.includes("Wi-Fi 5")) || model.wireless.some((w) => w === "Wi-Fi 6")) {
    const wifiVer = model.wireless.find((w) => w.startsWith("Wi-Fi"));
    if (wifiVer) cons.push("Older " + wifiVer + " wireless standard");
  }

  if (model.linuxStatus === "community") cons.push("Community-only Linux support (no official certification)");

  if (perfScore > 0 && perfScore <= 35) cons.push("Low CPU performance by current standards");

  const gpuScore = getGpuScore(model.gpu.name);
  if (gpuScore > 0 && gpuScore <= 15) cons.push("Very weak integrated GPU — no gaming capability");
  if (model.gpu.integrated && gpuScore > 15 && gpuScore <= 25)
    cons.push("Basic integrated GPU — limited to light esports titles");

  return cons;
};

const deriveUseCases = (model: Laptop): UseCase[] => {
  const cases: UseCase[] = [];
  const perfScore = getPerformanceScore(model.processor.name);

  if (model.weight < 1.4 && model.battery.whr >= 50) cases.push("Business Travel");
  if (model.weight < 1.1) cases.push("Ultraportable");

  if (model.ram.size >= 16 && (model.ram.maxSize >= 32 || model.ram.size >= 32) && perfScore >= 55)
    cases.push("Developer");

  if (model.display.panel === "OLED" || (!model.gpu.integrated && model.display.nits >= 400))
    cases.push("Creative Work");

  if (model.display.size >= 15.5 && perfScore >= 50) cases.push("Desktop Replacement");

  if (model.series === "L" || model.series === "E") cases.push("Budget");

  if ((model.series === "E" || model.series === "L") && model.ram.size <= 16) cases.push("Student");
  if (model.lineup === "IdeaPad Pro" && model.ram.size <= 16) cases.push("Student");

  if (!model.ram.soldered && hasPort(model.ports, "RJ45") && model.series !== "X1") cases.push("IT Fleet");

  const gamingTier = getGamingTier(model.gpu.name);
  if (
    gamingTier === "Medium" ||
    gamingTier === "Heavy" ||
    (gamingTier === "Light" && getGpuScore(model.gpu.name) >= 25)
  ) {
    cases.push("Light Gaming");
  }

  return cases;
};

const deriveSummary = (model: Laptop): string => {
  const seriesDesc = SERIES_DESCRIPTIONS[model.series] ?? (model.lineup === "Legion" ? "gaming laptop" : "laptop");
  const portability =
    model.weight < 1.2 ? "exceptionally portable" : model.weight < 1.5 ? "highly portable" : "desk-friendly";

  const displayHighlight =
    model.display.panel === "OLED"
      ? model.display.resolutionLabel + " OLED"
      : model.display.resolutionLabel + " " + model.display.panel;

  const ramNote = model.ram.soldered
    ? model.ram.size + " GB soldered " + model.ram.type
    : model.ram.size + " GB upgradeable " + model.ram.type;

  return (
    "The " +
    model.name +
    " is a " +
    model.year +
    " " +
    seriesDesc +
    ". It pairs a " +
    model.processor.name +
    " with " +
    ramNote +
    " and a " +
    displayHighlight +
    " panel at " +
    model.display.size +
    '". ' +
    "At " +
    model.weight +
    " kg with a " +
    model.battery.whr +
    " Wh battery, it is " +
    portability +
    "."
  );
};

/**
 * Parse model line and generation from its id to find a same-line newer model.
 * Pattern: {line}-gen{N}(-variant)? where line is like "x1-carbon", "t14s", "t14"
 * and variant is "intel" or "amd".
 */
const deriveUpgradePath = (model: Laptop, allModels: readonly Laptop[]): { id: string; name: string } | undefined => {
  const id = model.id;

  // Extract line prefix and generation number
  const genMatch = id.match(/^(.+)-gen(\d+)(.*)$/);
  if (!genMatch) return undefined;

  const [, linePrefix, genStr, suffix] = genMatch;
  const gen = parseInt(genStr, 10);

  // Look for same line + suffix with higher generation
  const candidates = allModels
    .filter((m) => {
      if (m.id === id) return false;
      const mMatch = m.id.match(/^(.+)-gen(\d+)(.*)$/);
      if (!mMatch) return false;
      const [, mLine, mGenStr, mSuffix] = mMatch;
      return mLine === linePrefix && mSuffix === suffix && parseInt(mGenStr, 10) > gen;
    })
    .sort((a, b) => {
      const aGen = parseInt(a.id.match(/gen(\d+)/)?.[1] ?? "0", 10);
      const bGen = parseInt(b.id.match(/gen(\d+)/)?.[1] ?? "0", 10);
      return aGen - bGen; // closest upgrade first
    });

  if (candidates.length === 0) return undefined;
  return { id: candidates[0].id, name: candidates[0].name };
};

/** Maps a score to a verdict using 4 ascending thresholds creating 5 ranges: insufficient < marginal < good < excellent < overkill */
const verdictFor = (score: number, thresholds: readonly [number, number, number, number]): ScenarioVerdict => {
  const [insuf, marg, good, exc] = thresholds;
  if (score >= exc) return "overkill";
  if (score >= good) return "excellent";
  if (score >= marg) return "good";
  if (score >= insuf) return "marginal";
  return "insufficient";
};

const generateUseCaseScenarios = (model: Laptop): UseCaseScenario[] => {
  const perfScore = getPerformanceScore(model.processor.name);
  const gpuScore = getGpuScore(model.gpu.name);
  const memScore = getMemoryScore(model);
  const gamingTier = getGamingTier(model.gpu.name);

  const scenarios: UseCaseScenario[] = [];

  // Weighted scores per scenario. Base offsets set the floor (e.g. +40 for office = most laptops pass).
  // Office: 30% CPU + 30% memory + 40 base
  const officeScore = perfScore * 0.3 + memScore * 0.3 + 40;
  const officeVerdict = verdictFor(officeScore, [30, 50, 65, 85]);
  scenarios.push({
    scenario: "Office / Productivity",
    verdict: officeVerdict,
    explanation:
      officeVerdict === "overkill"
        ? "Way more power than needed for office tasks"
        : officeVerdict === "excellent"
          ? "Excellent for all office workloads"
          : officeVerdict === "good"
            ? "Handles office work comfortably"
            : officeVerdict === "marginal"
              ? "Adequate for basic office tasks"
              : "May struggle with heavy multitasking",
  });

  // Dev: 35% CPU + 35% memory + screen size bonus (15" earns 15 pts, 14" earns 10)
  const devScore =
    perfScore * 0.35 + memScore * 0.35 + (model.display.size >= 15 ? 15 : model.display.size >= 14 ? 10 : 5);
  const devVerdict = verdictFor(devScore, [25, 40, 55, 75]);
  scenarios.push({
    scenario: "Software Development",
    verdict: devVerdict,
    explanation:
      devVerdict === "overkill"
        ? "More than enough for any development workflow"
        : devVerdict === "excellent"
          ? "Excellent for IDEs, containers, and compilation"
          : devVerdict === "good"
            ? "Good for most development tasks"
            : devVerdict === "marginal"
              ? "Can develop but may feel slow with heavy projects"
              : "Insufficient RAM or CPU for development",
  });

  // Gaming
  const gamingVerdict: ScenarioVerdict =
    gamingTier === "Heavy"
      ? "excellent"
      : gamingTier === "Medium"
        ? "good"
        : gamingTier === "Light"
          ? "marginal"
          : "insufficient";
  scenarios.push({
    scenario: "Gaming",
    verdict: gamingVerdict,
    explanation:
      gamingTier === "Heavy"
        ? "Can handle AAA titles at 1080p medium-high settings"
        : gamingTier === "Medium"
          ? "Playable in many titles at 720p\u20131080p low-medium"
          : gamingTier === "Light"
            ? "Limited to esports and indie titles at low settings"
            : "Not suitable for gaming beyond very basic 2D titles",
  });

  // Video Editing
  const videoScore = perfScore * 0.3 + gpuScore * 0.3 + memScore * 0.2 + (model.display.panel === "OLED" ? 15 : 5);
  const videoVerdict = verdictFor(videoScore, [20, 35, 50, 70]);
  scenarios.push({
    scenario: "Video Editing",
    verdict: videoVerdict,
    explanation:
      videoVerdict === "overkill"
        ? "Professional-grade editing capability"
        : videoVerdict === "excellent"
          ? "Handles 4K editing and rendering well"
          : videoVerdict === "good"
            ? "Good for 1080p editing, manageable 4K"
            : videoVerdict === "marginal"
              ? "Can edit basic 1080p, 4K will be very slow"
              : "Insufficient for video editing",
  });

  // Data Science / ML
  const mlScore = perfScore * 0.25 + gpuScore * 0.35 + memScore * 0.25 + (model.ram.size >= 32 ? 10 : 0);
  const mlVerdict = verdictFor(mlScore, [20, 35, 50, 70]);
  scenarios.push({
    scenario: "Data Science / ML",
    verdict: mlVerdict,
    explanation:
      mlVerdict === "overkill"
        ? "Excellent for local model training and large datasets"
        : mlVerdict === "excellent"
          ? "Strong for data analysis, moderate model training"
          : mlVerdict === "good"
            ? "Good for data analysis, limited local training"
            : mlVerdict === "marginal"
              ? "Can run notebooks, but slow for large datasets"
              : "Insufficient GPU/RAM for meaningful ML work",
  });

  // Virtualization
  const virtScore = perfScore * 0.35 + memScore * 0.45 + (model.ram.maxSize >= 64 ? 10 : 0);
  const virtVerdict = verdictFor(virtScore, [25, 40, 55, 75]);
  scenarios.push({
    scenario: "Virtualization",
    verdict: virtVerdict,
    explanation:
      virtVerdict === "overkill"
        ? "Can run many VMs simultaneously"
        : virtVerdict === "excellent"
          ? "Comfortable running 2-3 VMs"
          : virtVerdict === "good"
            ? "Can run 1-2 VMs alongside host workloads"
            : virtVerdict === "marginal"
              ? "A single lightweight VM is possible"
              : "Insufficient RAM for virtualization",
  });

  return scenarios;
};

export const generateAnalysis = (model: Laptop, allModels: readonly Laptop[]): ModelAnalysis => ({
  pros: derivePros(model),
  cons: deriveCons(model),
  useCases: deriveUseCases(model),
  summary: deriveSummary(model),
  upgradePath: deriveUpgradePath(model, allModels),
  scenarios: generateUseCaseScenarios(model),
  gamingTier: getGamingTier(model.gpu.name),
});
