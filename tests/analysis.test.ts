import { describe, it, expect } from "vitest";
import { generateAnalysis } from "@/lib/analysis";
import { laptops } from "@/data/laptops";

const thinkpad = laptops.find((m) => m.id === "x1-carbon-gen12")!;
const legion = laptops.find((m) => m.id === "legion-5-16-gen9-amd")!;

describe("generateAnalysis", () => {
  it("returns non-empty pros, cons, useCases, summary for a ThinkPad", () => {
    const analysis = generateAnalysis(thinkpad, laptops);
    expect(analysis.pros.length).toBeGreaterThan(0);
    expect(analysis.cons.length).toBeGreaterThan(0);
    expect(analysis.useCases.length).toBeGreaterThan(0);
    expect(analysis.summary.length).toBeGreaterThan(0);
  });

  it("includes scenarios array", () => {
    const analysis = generateAnalysis(thinkpad, laptops);
    expect(analysis.scenarios.length).toBeGreaterThan(0);
  });

  it("returns gamingTier", () => {
    const analysis = generateAnalysis(thinkpad, laptops);
    expect(["None", "Light", "Medium", "Heavy"]).toContain(analysis.gamingTier);
  });

  it("returns different emphasis for a Legion model", () => {
    const analysis = generateAnalysis(legion, laptops);
    // Legion with discrete GPU should mention gaming-related content
    const hasGamingPro = analysis.pros.some(
      (p) =>
        p.toLowerCase().includes("gaming") || p.toLowerCase().includes("discrete") || p.toLowerCase().includes("gpu"),
    );
    expect(hasGamingPro).toBe(true);

    const hasGamingUseCase = analysis.useCases.some((uc) => uc.toLowerCase().includes("gaming"));
    expect(hasGamingUseCase).toBe(true);
  });

  it("derives upgrade path for an older generation model", () => {
    // Find a model that has a newer generation sibling
    const olderModel = laptops.find((m) => m.id === "x1-carbon-gen11");
    if (olderModel) {
      const analysis = generateAnalysis(olderModel, laptops);
      expect(analysis.upgradePath).toBeDefined();
      expect(analysis.upgradePath?.id).toContain("x1-carbon");
    }
  });
});

describe("generateUseCaseScenarios (via generateAnalysis)", () => {
  it("returns array of scenario verdicts", () => {
    const analysis = generateAnalysis(thinkpad, laptops);
    expect(Array.isArray(analysis.scenarios)).toBe(true);
    expect(analysis.scenarios.length).toBeGreaterThan(0);

    for (const s of analysis.scenarios) {
      expect(s).toHaveProperty("scenario");
      expect(s).toHaveProperty("verdict");
      expect(s).toHaveProperty("explanation");
      expect(["insufficient", "marginal", "good", "excellent", "overkill"]).toContain(s.verdict);
    }
  });

  it("ThinkPad gets favorable Business/Office verdict", () => {
    const analysis = generateAnalysis(thinkpad, laptops);
    const office = analysis.scenarios.find((s) => s.scenario.includes("Office"));
    expect(office).toBeDefined();
    expect(["good", "excellent", "overkill"]).toContain(office!.verdict);
  });

  it("Legion gets favorable Gaming verdict", () => {
    const analysis = generateAnalysis(legion, laptops);
    const gaming = analysis.scenarios.find((s) => s.scenario === "Gaming");
    expect(gaming).toBeDefined();
    expect(["good", "excellent", "overkill"]).toContain(gaming!.verdict);
  });

  it("covers standard scenario set", () => {
    const analysis = generateAnalysis(thinkpad, laptops);
    const names = analysis.scenarios.map((s) => s.scenario);
    expect(names).toContain("Office / Productivity");
    expect(names).toContain("Software Development");
    expect(names).toContain("Gaming");
    expect(names).toContain("Video Editing");
    expect(names).toContain("Data Science / ML");
    expect(names).toContain("Virtualization");
  });
});
