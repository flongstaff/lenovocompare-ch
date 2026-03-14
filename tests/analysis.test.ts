import { describe, it, expect } from "vitest";
import { generateAnalysis } from "@/lib/analysis";
import { laptops } from "@/data/laptops";
import type { Laptop } from "@/lib/types";

// ---------------------------------------------------------------------------
// Representative fixtures — one per lineup, picked for distinct spec profiles
// ---------------------------------------------------------------------------

// ThinkPad X1 Carbon Gen 12 — flagship ultraportable, OLED, soldered RAM,
// Linux-certified, iGPU, 2x Thunderbolt 4, no RJ45, 1.09 kg
const x1Carbon = laptops.find((l) => l.id === "x1-carbon-gen12")!;

// ThinkPad L14 Gen 5 (Intel) — value L-series, upgradeable 2-slot RAM,
// RJ45, 256 GB storage, 300-nit IPS, trackpoint
const l14 = laptops.find((l) => l.id === "l14-gen5-intel")!;

// Legion 5 16AHP9 — mainstream gaming, discrete RTX 4060 8GB, 2.31 kg,
// dual M.2 slots, no Thunderbolt, RJ45, 80Wh battery
const legion5 = laptops.find((l) => l.id === "legion-5-16-gen9-amd")!;

// IdeaPad Pro 5 14ARP9 — consumer creator, 2.8K OLED, soldered RAM,
// integrated AMD GPU, SD card reader, no RJ45
const ideapadPro5 = laptops.find((l) => l.id === "ideapad-pro-5-14-gen9-amd")!;

// Yoga 7 2-in-1 14AHP9 — convertible, 2.8K OLED, Wi-Fi 7, community
// Linux support, soldered 16 GB maxed, 72Wh battery
const yoga7 = laptops.find((l) => l.id === "yoga-7-2in1-14ahp9")!;

// Legion Pro 7i Gen 10 — top-tier gaming, RTX 5080 16GB VRAM, OLED 240Hz
// 500nit, 32GB DDR5, 2x Thunderbolt 5, SD card reader, RJ45
const legionPro7i = laptops.find((l) => l.id === "legion-pro-7i-16-gen10")!;

// ThinkPad X1 Carbon Gen 11 — older generation to test upgrade path
const x1CarbonGen11 = laptops.find((l) => l.id === "x1-carbon-gen11")!;

// ThinkPad X1 Carbon Gen 13 — latest generation to verify no upgrade path
const x1CarbonGen13 = laptops.find((l) => l.id === "x1-carbon-gen13")!;

// ThinkPad T14 Gen 3 AMD — to test platform-suffix upgrade path matching
const t14Gen3Amd = laptops.find((l) => l.id === "t14-gen3-amd")!;

// ThinkPad T480 — no gen pattern in id, upgrade path should be undefined
const t480 = laptops.find((l) => l.id === "t480")!;

// Guard: fail loudly if a fixture ID is renamed in the data
const fixtures = {
  x1Carbon,
  l14,
  legion5,
  ideapadPro5,
  yoga7,
  legionPro7i,
  x1CarbonGen11,
  x1CarbonGen13,
  t14Gen3Amd,
  t480,
};
for (const [key, model] of Object.entries(fixtures)) {
  if (!model) throw new Error(`Fixture "${key}" not found in laptops data — check the model ID`);
}

// ---------------------------------------------------------------------------
// generateAnalysis — return shape
// ---------------------------------------------------------------------------

describe("generateAnalysis", () => {
  it("should return non-empty pros, cons, useCases, summary for a ThinkPad", () => {
    const analysis = generateAnalysis(x1Carbon, laptops);
    expect(analysis.pros.length).toBeGreaterThan(0);
    expect(analysis.cons.length).toBeGreaterThan(0);
    expect(analysis.useCases.length).toBeGreaterThan(0);
    expect(analysis.summary.length).toBeGreaterThan(0);
  });

  it("should return a pros array", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(Array.isArray(result.pros)).toBe(true);
  });

  it("should return a cons array", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(Array.isArray(result.cons)).toBe(true);
  });

  it("should return a useCases array", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(Array.isArray(result.useCases)).toBe(true);
  });

  it("should return a non-empty summary string", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(typeof result.summary).toBe("string");
    expect(result.summary.length).toBeGreaterThan(0);
  });

  it("should return a scenarios array", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(Array.isArray(result.scenarios)).toBe(true);
  });

  it("should return exactly 6 use-case scenarios", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.scenarios!.length).toBe(6);
  });

  it("should return a gamingTier string", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(["None", "Light", "Medium", "Heavy"]).toContain(result.gamingTier);
  });

  it("should return different analysis for Legion vs ThinkPad model", () => {
    const thinkpadAnalysis = generateAnalysis(x1Carbon, laptops);
    const legionAnalysis = generateAnalysis(legion5, laptops);
    expect(thinkpadAnalysis.pros.join(",")).not.toBe(legionAnalysis.pros.join(","));
  });
});

// ---------------------------------------------------------------------------
// generateAnalysis — pros derivation
// ---------------------------------------------------------------------------

describe("generateAnalysis pros", () => {
  it("should include OLED mention when model has OLED display", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.pros.some((p) => p.includes("OLED"))).toBe(true);
  });

  it("should include refresh rate mention when display is 120Hz or above", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.pros.some((p) => p.includes("120 Hz"))).toBe(true);
  });

  it("should include Thunderbolt mention when model has 2x Thunderbolt 4", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.pros.some((p) => p.toLowerCase().includes("thunderbolt"))).toBe(true);
  });

  it("should include Ethernet mention when model has RJ45 port", () => {
    const result = generateAnalysis(legion5, laptops);
    expect(result.pros.some((p) => p.includes("Ethernet") || p.includes("RJ45"))).toBe(true);
  });

  it("should include SD card reader mention when model has SD reader", () => {
    const result = generateAnalysis(ideapadPro5, laptops);
    expect(result.pros.some((p) => p.toLowerCase().includes("sd card"))).toBe(true);
  });

  it("should include discrete GPU mention when model has dGPU", () => {
    const result = generateAnalysis(legion5, laptops);
    expect(result.pros.some((p) => p.toLowerCase().includes("discrete"))).toBe(true);
  });

  it("should include VRAM count in discrete GPU pro when vram is defined", () => {
    // legion5 has RTX 4060 with 8 GB VRAM
    const result = generateAnalysis(legion5, laptops);
    const gpuPro = result.pros.find((p) => p.toLowerCase().includes("discrete"));
    expect(gpuPro).toBeDefined();
    expect(gpuPro!).toContain("8");
  });

  it("should include Linux-certified mention when model has certified linux status", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.pros.some((p) => p.toLowerCase().includes("linux"))).toBe(true);
  });

  it("should include TrackPoint mention when model has trackpoint keyboard", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.pros.some((p) => p.toLowerCase().includes("trackpoint"))).toBe(true);
  });

  it("should include Wi-Fi 7 mention when model supports Wi-Fi 7", () => {
    const result = generateAnalysis(yoga7, laptops);
    expect(result.pros.some((p) => p.includes("Wi-Fi 7"))).toBe(true);
  });

  it("should include battery capacity mention when battery is 70Wh or above", () => {
    // legion5 has 80 Wh battery
    const result = generateAnalysis(legion5, laptops);
    expect(result.pros.some((p) => p.includes("Wh") && p.includes("80"))).toBe(true);
  });

  it("should include dual M.2 storage mention when model has 2 storage slots", () => {
    const result = generateAnalysis(legion5, laptops);
    expect(result.pros.some((p) => p.toLowerCase().includes("dual m.2"))).toBe(true);
  });

  it("should include heavy gaming mention when gaming tier is Heavy", () => {
    const result = generateAnalysis(legionPro7i, laptops);
    expect(result.pros.some((p) => p.toLowerCase().includes("heavy gaming"))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// generateAnalysis — cons derivation
// ---------------------------------------------------------------------------

describe("generateAnalysis cons", () => {
  it("should include soldered RAM mention when RAM is soldered", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.cons.some((c) => c.toLowerCase().includes("soldered"))).toBe(true);
  });

  it("should include no Ethernet mention when model lacks RJ45", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.cons.some((c) => c.toLowerCase().includes("ethernet"))).toBe(true);
  });

  it("should include no SD card reader mention when model lacks SD reader", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.cons.some((c) => c.toLowerCase().includes("sd card"))).toBe(true);
  });

  it("should include weight mention when model is 2.0 kg or heavier", () => {
    // legion5 weighs 2.31 kg
    const result = generateAnalysis(legion5, laptops);
    expect(result.cons.some((c) => c.toLowerCase().includes("kg"))).toBe(true);
  });

  it("should include community Linux mention when linux status is community", () => {
    const result = generateAnalysis(yoga7, laptops);
    expect(result.cons.some((c) => c.toLowerCase().includes("community"))).toBe(true);
  });

  it("should include dim display mention when display brightness is 250 nits or below", () => {
    const dimModel: Laptop = { ...l14, display: { ...l14.display, nits: 250 } };
    const result = generateAnalysis(dimModel, laptops);
    expect(result.cons.some((c) => c.includes("250"))).toBe(true);
  });

  it("should include aging platform mention when model year is 2022 or earlier", () => {
    const oldModel: Laptop = { ...l14, year: 2022 };
    const result = generateAnalysis(oldModel, laptops);
    expect(result.cons.some((c) => c.includes("2022"))).toBe(true);
  });

  it("should include max RAM ceiling mention when maxSize is 16 GB or less", () => {
    // yoga7 has maxSize: 16
    const result = generateAnalysis(yoga7, laptops);
    expect(result.cons.some((c) => c.toLowerCase().includes("gb ram ceiling"))).toBe(true);
  });

  it("should produce different cons lists for different lineups", () => {
    const thinkpadCons = generateAnalysis(x1Carbon, laptops).cons;
    const legionCons = generateAnalysis(legion5, laptops).cons;
    expect(thinkpadCons.join(",")).not.toBe(legionCons.join(","));
  });
});

// ---------------------------------------------------------------------------
// generateAnalysis — summary
// ---------------------------------------------------------------------------

describe("generateAnalysis summary", () => {
  it("should include the model name in the summary", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.summary).toContain(x1Carbon.name);
  });

  it("should include the model year in the summary", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.summary).toContain(String(x1Carbon.year));
  });

  it("should include the processor name in the summary", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.summary).toContain(x1Carbon.processor.name);
  });

  it("should include the model weight in the summary", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.summary).toContain(String(x1Carbon.weight));
  });

  it("should describe OLED models with OLED in the summary", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.summary).toContain("OLED");
  });

  it("should produce different summaries for different lineups", () => {
    const thinkpadSummary = generateAnalysis(x1Carbon, laptops).summary;
    const legionSummary = generateAnalysis(legion5, laptops).summary;
    expect(thinkpadSummary).not.toBe(legionSummary);
  });
});

// ---------------------------------------------------------------------------
// generateAnalysis — use-case scenarios
// ---------------------------------------------------------------------------

describe("generateUseCaseScenarios (via generateAnalysis)", () => {
  const VALID_VERDICTS = new Set(["overkill", "excellent", "good", "marginal", "insufficient"]);

  it("should return array of scenario verdicts", () => {
    const analysis = generateAnalysis(x1Carbon, laptops);
    expect(Array.isArray(analysis.scenarios)).toBe(true);
    expect(analysis.scenarios!.length).toBeGreaterThan(0);

    for (const s of analysis.scenarios!) {
      expect(s).toHaveProperty("scenario");
      expect(s).toHaveProperty("verdict");
      expect(s).toHaveProperty("explanation");
      expect(["insufficient", "marginal", "good", "excellent", "overkill"]).toContain(s.verdict);
    }
  });

  it("should cover standard scenario set", () => {
    const analysis = generateAnalysis(x1Carbon, laptops);
    const names = analysis.scenarios!.map((s) => s.scenario);
    expect(names).toContain("Office / Productivity");
    expect(names).toContain("Software Development");
    expect(names).toContain("Gaming");
    expect(names).toContain("Video Editing");
    expect(names).toContain("Data Science / ML");
    expect(names).toContain("Virtualization");
  });

  it("should return valid verdict values for all scenarios", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    for (const scenario of result.scenarios!) {
      expect(VALID_VERDICTS.has(scenario.verdict)).toBe(true);
    }
  });

  it("should return non-empty explanations for all scenarios", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    for (const scenario of result.scenarios!) {
      expect(scenario.explanation.length).toBeGreaterThan(0);
    }
  });

  it("should give ThinkPad a favorable Office verdict", () => {
    const analysis = generateAnalysis(x1Carbon, laptops);
    const office = analysis.scenarios!.find((s) => s.scenario.includes("Office"));
    expect(office).toBeDefined();
    expect(["good", "excellent", "overkill"]).toContain(office!.verdict);
  });

  it("should give Legion a favorable Gaming verdict", () => {
    const analysis = generateAnalysis(legion5, laptops);
    const gaming = analysis.scenarios!.find((s) => s.scenario === "Gaming");
    expect(gaming).toBeDefined();
    expect(["good", "excellent", "overkill"]).toContain(gaming!.verdict);
  });

  it("should give Legion a better Gaming verdict than ThinkPad with iGPU", () => {
    const verdictRank = { insufficient: 0, marginal: 1, good: 2, excellent: 3, overkill: 4 };
    const legionGaming = generateAnalysis(legion5, laptops).scenarios!.find((s) => s.scenario === "Gaming")!;
    const thinkpadGaming = generateAnalysis(x1Carbon, laptops).scenarios!.find((s) => s.scenario === "Gaming")!;
    expect(verdictRank[legionGaming.verdict]).toBeGreaterThan(verdictRank[thinkpadGaming.verdict]);
  });

  it("should give flagship Legion overkill or excellent for Gaming", () => {
    const result = generateAnalysis(legionPro7i, laptops);
    const gaming = result.scenarios!.find((s) => s.scenario === "Gaming")!;
    expect(["overkill", "excellent"]).toContain(gaming.verdict);
  });

  it("should give ThinkPad with Intel Arc iGPU at most good for Gaming", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    const gaming = result.scenarios!.find((s) => s.scenario === "Gaming")!;
    // Intel Arc Graphics is a capable iGPU — not insufficient, but not excellent either
    const verdictRank = { insufficient: 0, marginal: 1, good: 2, excellent: 3, overkill: 4 };
    expect(verdictRank[gaming.verdict]).toBeLessThanOrEqual(verdictRank["good"]);
  });

  it("should give well-spec'd ThinkPad at least good verdict for Software Development", () => {
    // x1-carbon-gen12: strong CPU + 32 GB RAM
    const verdictRank = { insufficient: 0, marginal: 1, good: 2, excellent: 3, overkill: 4 };
    const result = generateAnalysis(x1Carbon, laptops);
    const dev = result.scenarios!.find((s) => s.scenario === "Software Development")!;
    expect(verdictRank[dev.verdict]).toBeGreaterThanOrEqual(verdictRank["good"]);
  });

  it("should give Legion Pro with dGPU better ML verdict than ThinkPad iGPU", () => {
    const verdictRank = { insufficient: 0, marginal: 1, good: 2, excellent: 3, overkill: 4 };
    const legionML = generateAnalysis(legionPro7i, laptops).scenarios!.find((s) => s.scenario === "Data Science / ML")!;
    const thinkpadML = generateAnalysis(x1Carbon, laptops).scenarios!.find((s) => s.scenario === "Data Science / ML")!;
    expect(verdictRank[legionML.verdict]).toBeGreaterThan(verdictRank[thinkpadML.verdict]);
  });

  it("should give Legion Pro with large RAM at least as good Virtualization verdict as L14", () => {
    const verdictRank = { insufficient: 0, marginal: 1, good: 2, excellent: 3, overkill: 4 };
    const legionVirt = generateAnalysis(legionPro7i, laptops).scenarios!.find((s) => s.scenario === "Virtualization")!;
    const l14Virt = generateAnalysis(l14, laptops).scenarios!.find((s) => s.scenario === "Virtualization")!;
    expect(verdictRank[legionVirt.verdict]).toBeGreaterThanOrEqual(verdictRank[l14Virt.verdict]);
  });

  it("should produce identical scenario results when called twice with the same model", () => {
    const result1 = generateAnalysis(ideapadPro5, laptops);
    const result2 = generateAnalysis(ideapadPro5, laptops);
    expect(result1.scenarios!.map((s) => s.verdict)).toEqual(result2.scenarios!.map((s) => s.verdict));
  });
});

// ---------------------------------------------------------------------------
// generateAnalysis — upgrade paths (via upgradePath field on ModelAnalysis)
// ---------------------------------------------------------------------------

describe("generateAnalysis upgradePath", () => {
  it("should return an upgradePath when a newer generation of the same model line exists", () => {
    const result = generateAnalysis(x1CarbonGen11, laptops);
    expect(result.upgradePath).toBeDefined();
    expect(result.upgradePath!.id).toContain("x1-carbon");
  });

  it("should return undefined upgradePath for the latest generation in a line", () => {
    // x1-carbon-gen13 is the most recent X1 Carbon in the dataset
    const result = generateAnalysis(x1CarbonGen13, laptops);
    expect(result.upgradePath).toBeUndefined();
  });

  it("should suggest a model with a higher generation number", () => {
    const result = generateAnalysis(x1CarbonGen11, laptops);
    const suggestedGenMatch = result.upgradePath?.id.match(/gen(\d+)/);
    expect(suggestedGenMatch).not.toBeNull();
    expect(parseInt(suggestedGenMatch![1], 10)).toBeGreaterThan(11);
  });

  it("should respect platform suffix and stay on AMD variant for AMD upgrade paths", () => {
    const result = generateAnalysis(t14Gen3Amd, laptops);
    if (result.upgradePath) {
      expect(result.upgradePath.id).toContain("amd");
    }
  });

  it("should not suggest an Intel model as upgrade for an AMD model", () => {
    const result = generateAnalysis(t14Gen3Amd, laptops);
    if (result.upgradePath) {
      expect(result.upgradePath.id).not.toMatch(/intel/);
    }
  });

  it("should return undefined upgradePath for a model with no gen pattern in its id", () => {
    const result = generateAnalysis(t480, laptops);
    expect(result.upgradePath).toBeUndefined();
  });

  it("should return undefined upgradePath when allModels is empty", () => {
    const result = generateAnalysis(x1Carbon, []);
    expect(result.upgradePath).toBeUndefined();
  });

  it("should include name and id fields when upgradePath is defined", () => {
    const result = generateAnalysis(x1CarbonGen11, laptops);
    if (result.upgradePath) {
      expect(typeof result.upgradePath.id).toBe("string");
      expect(typeof result.upgradePath.name).toBe("string");
      expect(result.upgradePath.id.length).toBeGreaterThan(0);
      expect(result.upgradePath.name.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// generateAnalysis — gaming tier
// ---------------------------------------------------------------------------

describe("generateAnalysis gamingTier", () => {
  it("should return None for an older ThinkPad with Intel UHD 620 GPU", () => {
    // t480 uses Intel UHD 620 which has gamingTier "None" in gpu-benchmarks
    const result = generateAnalysis(t480, laptops);
    expect(result.gamingTier).toBe("None");
  });

  it("should return a tier other than None for a Legion with RTX dGPU", () => {
    const result = generateAnalysis(legion5, laptops);
    expect(result.gamingTier).not.toBe("None");
  });

  it("should return Heavy tier for flagship Legion with RTX 5080", () => {
    const result = generateAnalysis(legionPro7i, laptops);
    expect(result.gamingTier).toBe("Heavy");
  });

  it("should return Light or Medium for IdeaPad Pro with Radeon 780M iGPU", () => {
    const result = generateAnalysis(ideapadPro5, laptops);
    // AMD Radeon 780M is a capable iGPU — enough for light/medium gaming
    expect(["Light", "Medium"]).toContain(result.gamingTier);
  });

  it("should return a higher tier for Legion than for ThinkPad", () => {
    const tierRank: Record<string, number> = { None: 0, Light: 1, Medium: 2, Heavy: 3 };
    const thinkpadTier = generateAnalysis(x1Carbon, laptops).gamingTier ?? "None";
    const legionTier = generateAnalysis(legion5, laptops).gamingTier ?? "None";
    expect(tierRank[legionTier]).toBeGreaterThan(tierRank[thinkpadTier]);
  });

  it("should return a valid GamingTier value for every fixture", () => {
    const validTiers = new Set(["None", "Light", "Medium", "Heavy"]);
    for (const model of [x1Carbon, l14, legion5, ideapadPro5, yoga7, legionPro7i]) {
      const result = generateAnalysis(model, laptops);
      expect(validTiers.has(result.gamingTier!)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// generateAnalysis — use cases
// ---------------------------------------------------------------------------

describe("generateAnalysis useCases", () => {
  it("should include Business Travel for lightweight model with 50Wh+ battery", () => {
    // x1-carbon: 1.09 kg, 57 Wh — satisfies weight < 1.4 && whr >= 50
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.useCases).toContain("Business Travel");
  });

  it("should include Ultraportable for sub-1.1kg model", () => {
    // x1-carbon: 1.09 kg < 1.1
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.useCases).toContain("Ultraportable");
  });

  it("should include IT Fleet for L-series ThinkPad with RJ45 and upgradeable RAM", () => {
    // l14: series L, not soldered, has RJ45
    const result = generateAnalysis(l14, laptops);
    expect(result.useCases).toContain("IT Fleet");
  });

  it("should include Creative Work for model with OLED display", () => {
    const result = generateAnalysis(ideapadPro5, laptops);
    expect(result.useCases).toContain("Creative Work");
  });

  it("should include Light Gaming for Legion with dGPU", () => {
    const result = generateAnalysis(legion5, laptops);
    expect(result.useCases).toContain("Light Gaming");
  });

  it("should include Desktop Replacement for 16-inch high-performance Legion", () => {
    // legion5: 16-inch, strong CPU, perfScore should be >= 50
    const result = generateAnalysis(legion5, laptops);
    expect(result.useCases).toContain("Desktop Replacement");
  });

  it("should include Student for IdeaPad Pro with 16GB or less RAM", () => {
    // ideapadPro5: IdeaPad Pro lineup, 16 GB RAM
    const result = generateAnalysis(ideapadPro5, laptops);
    expect(result.useCases).toContain("Student");
  });
});

// ---------------------------------------------------------------------------
// generateAnalysis — edge cases and defensive behaviour
// ---------------------------------------------------------------------------

describe("generateAnalysis edge cases", () => {
  it("should not throw when keyboard field is absent", () => {
    const noKeyboard: Laptop = { ...x1Carbon, keyboard: undefined };
    expect(() => generateAnalysis(noKeyboard, laptops)).not.toThrow();
  });

  it("should not include TrackPoint pro when keyboard field is absent", () => {
    const noKeyboard: Laptop = { ...x1Carbon, keyboard: undefined };
    const result = generateAnalysis(noKeyboard, laptops);
    expect(result.pros.some((p) => p.toLowerCase().includes("trackpoint"))).toBe(false);
  });

  it("should not throw when allModels is empty", () => {
    expect(() => generateAnalysis(x1Carbon, [])).not.toThrow();
  });

  it("should not include Ethernet pro when model has no RJ45 port", () => {
    const result = generateAnalysis(x1Carbon, laptops);
    expect(result.pros.some((p) => p.includes("RJ45") || p.includes("Ethernet"))).toBe(false);
  });

  it("should not include Ethernet con for a model that does have RJ45", () => {
    const result = generateAnalysis(legion5, laptops);
    expect(result.cons.some((c) => c.toLowerCase().includes("no built-in ethernet"))).toBe(false);
  });

  it("should not include TrackPoint pro when trackpoint is false", () => {
    const noTrackpoint: Laptop = {
      ...x1Carbon,
      keyboard: { ...x1Carbon.keyboard!, trackpoint: false },
    };
    const result = generateAnalysis(noTrackpoint, laptops);
    expect(result.pros.some((p) => p.toLowerCase().includes("trackpoint"))).toBe(false);
  });

  it("should include 1TB+ storage pro when storage size is 1024 GB or more", () => {
    const bigStorage: Laptop = { ...x1Carbon, storage: { ...x1Carbon.storage, size: 1024 } };
    const result = generateAnalysis(bigStorage, laptops);
    expect(result.pros.some((p) => p.toLowerCase().includes("1 tb"))).toBe(true);
  });

  it("should include small storage con when storage is 256 GB with single slot", () => {
    // l14 base: 256 GB, 1 slot
    const result = generateAnalysis(l14, laptops);
    expect(result.cons.some((c) => c.includes("256"))).toBe(true);
  });

  it("should return all scenario verdicts within the valid set for all fixtures", () => {
    const validVerdicts = new Set(["overkill", "excellent", "good", "marginal", "insufficient"]);
    for (const model of [x1Carbon, l14, legion5, ideapadPro5, yoga7, legionPro7i]) {
      const result = generateAnalysis(model, laptops);
      for (const scenario of result.scenarios!) {
        expect(validVerdicts.has(scenario.verdict)).toBe(true);
      }
    }
  });
});
