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
    // Verify toggle buttons exist (they are <button> elements)
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
});
