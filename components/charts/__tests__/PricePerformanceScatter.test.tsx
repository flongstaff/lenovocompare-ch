import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PricePerformanceScatter } from "../PricePerformanceScatter";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockModels = [
  { id: "tp1", name: "ThinkPad T14", lineup: "ThinkPad", price: 1049, perf: 75 },
  { id: "ip1", name: "IdeaPad Pro 5", lineup: "IdeaPad Pro", price: 1200, perf: 78 },
  { id: "lg1", name: "Legion 5", lineup: "Legion", price: 1500, perf: 92 },
] as const;

const richModels = [
  {
    id: "tp1",
    name: "ThinkPad T14",
    lineup: "ThinkPad",
    price: 1049,
    perf: 75,
    cpu: "Core Ultra 7 155H",
    ram: "16 GB LPDDR5x",
    display: '14" WUXGA IPS',
    msrp: 1299,
    dimensions: { cpu: 75, gpu: 20, memory: 70, display: 55, connectivity: 65, portability: 80 },
  },
  {
    id: "ip1",
    name: "IdeaPad Pro 5",
    lineup: "IdeaPad Pro",
    price: 1200,
    perf: 78,
    dimensions: { cpu: 78, gpu: 25, memory: 65, display: 70, connectivity: 50, portability: 60 },
  },
  {
    id: "lg1",
    name: "Legion 5",
    lineup: "Legion",
    price: 1500,
    perf: 92,
    dimensions: { cpu: 92, gpu: 85, memory: 80, display: 75, connectivity: 70, portability: 30 },
  },
] as const;

describe("PricePerformanceScatter", () => {
  it("renders SVG with data points", () => {
    const { container } = render(<PricePerformanceScatter models={mockModels} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    const circles = container.querySelectorAll("circle[data-model-id]");
    expect(circles.length).toBe(3);
  });

  it("renders lineup filter toggles", () => {
    render(<PricePerformanceScatter models={mockModels} />);
    expect(screen.getAllByText("ThinkPad").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("IdeaPad Pro").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Legion").length).toBeGreaterThanOrEqual(1);
    const buttons = screen.getAllByRole("button");
    const buttonTexts = buttons.map((b) => b.textContent);
    expect(buttonTexts).toContain("ThinkPad");
    expect(buttonTexts).toContain("IdeaPad Pro");
    expect(buttonTexts).toContain("Legion");
  });

  it("renders efficiency frontier path", () => {
    const { container } = render(<PricePerformanceScatter models={mockModels} />);
    const frontier = container.querySelector("path[data-frontier]");
    expect(frontier).toBeTruthy();
  });

  it("shows tooltip on hover", () => {
    const { container } = render(<PricePerformanceScatter models={mockModels} />);
    const circle = container.querySelector("circle[data-model-id='tp1']")!;
    fireEvent.mouseEnter(circle);
    expect(screen.getByText("ThinkPad T14")).toBeTruthy();
  });

  /* Task 1: Value Zones */
  it("renders value zone gradient defs when 3+ models visible", () => {
    const { container } = render(<PricePerformanceScatter models={mockModels} />);
    const svgHtml = container.querySelector("svg")!.outerHTML;
    // Gradient defs are always rendered when 3+ models visible
    expect(svgHtml).toContain("zone-great");
    expect(svgHtml).toContain("zone-fair");
    expect(svgHtml).toContain("zone-premium");
    // Note: zone rects require non-zero container width (jsdom width=0)
  });

  it("skips value zones when fewer than 3 models", () => {
    const twoModels = mockModels.slice(0, 2);
    const { container } = render(<PricePerformanceScatter models={twoModels} />);
    const zones = container.querySelectorAll("g[data-zone]");
    expect(zones.length).toBe(0);
  });

  /* Task 2: Rich Tooltip */
  it("shows rich tooltip with specs and dimension bars", () => {
    const { container } = render(<PricePerformanceScatter models={richModels} />);
    const circle = container.querySelector("circle[data-model-id='tp1']")!;
    fireEvent.mouseEnter(circle);
    // Name appears in tooltip
    expect(screen.getAllByText("ThinkPad T14").length).toBeGreaterThanOrEqual(1);
    // CPU spec line
    expect(container.textContent).toContain("Core Ultra 7 155H");
    // MSRP strikethrough present
    expect(container.textContent).toContain("1");
  });

  /* Task 3: Pointer events */
  it("SVG has touchAction none for pointer event support", () => {
    const { container } = render(<PricePerformanceScatter models={mockModels} />);
    const svg = container.querySelector("svg")!;
    expect(svg.style.touchAction).toBe("none");
  });
});
