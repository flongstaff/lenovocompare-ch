import React from "react";
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { PolarBar } from "../PolarBar";
import type { PerformanceDimensions } from "@/lib/types";

const mockScores: PerformanceDimensions = {
  cpu: 80,
  gpu: 65,
  memory: 70,
  display: 90,
  connectivity: 50,
  portability: 75,
};

describe("PolarBar", () => {
  it("renders an SVG with 6 petal path elements", () => {
    const { container } = render(<PolarBar scores={mockScores} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();

    const petals = container.querySelectorAll("path[data-petal]");
    expect(petals).toHaveLength(6);
  });

  it("renders dimension labels in normal mode", () => {
    const { container } = render(<PolarBar scores={mockScores} />);
    const labels = Array.from(container.querySelectorAll("text")).map((t) => t.textContent);
    expect(labels).toContain("CPU");
    expect(labels).toContain("GPU");
    expect(labels).toContain("Memory");
    expect(labels).toContain("Display");
    expect(labels).toContain("Connect");
    expect(labels).toContain("Portable");
    expect(labels).toHaveLength(6);
  });

  it("renders 80x80 SVG with no labels in compact mode", () => {
    const { container } = render(<PolarBar scores={mockScores} compact />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "80");
    expect(svg).toHaveAttribute("height", "80");

    // No text labels in compact mode
    const texts = container.querySelectorAll("text");
    expect(texts).toHaveLength(0);
  });

  it("renders 200x200 SVG in normal mode", () => {
    const { container } = render(<PolarBar scores={mockScores} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "200");
    expect(svg).toHaveAttribute("height", "200");
  });

  it("has aria-label for accessibility", () => {
    const { container } = render(<PolarBar scores={mockScores} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label");
  });

  it("renders grid rings", () => {
    const { container } = render(<PolarBar scores={mockScores} />);
    const rings = container.querySelectorAll("polygon[data-grid-ring]");
    expect(rings).toHaveLength(4); // 25%, 50%, 75%, 100%
  });

  it("renders axis lines from center", () => {
    const { container } = render(<PolarBar scores={mockScores} />);
    const axes = container.querySelectorAll("line[data-axis]");
    expect(axes).toHaveLength(6);
  });

  it("applies single color override when color prop is provided", () => {
    const { container } = render(<PolarBar scores={mockScores} color="#ff0000" />);
    const petals = container.querySelectorAll("path[data-petal]");
    petals.forEach((petal) => {
      expect(petal).toHaveAttribute("fill", "#ff0000");
    });
  });

  /* Task 4: Hover tooltip */
  it("shows tooltip on petal hover in normal mode", () => {
    const { container } = render(<PolarBar scores={mockScores} />);
    const cpuPetal = container.querySelector("path[data-petal='cpu']")!;
    fireEvent.mouseEnter(cpuPetal);
    // Tooltip should show score and tier
    expect(container.textContent).toContain("CPU");
    expect(container.textContent).toContain("80");
    expect(container.textContent).toContain("Excellent");
  });

  it("dims non-hovered petals", () => {
    const { container } = render(<PolarBar scores={mockScores} />);
    const cpuPetal = container.querySelector("path[data-petal='cpu']")!;
    fireEvent.mouseEnter(cpuPetal);
    const gpuPetal = container.querySelector("path[data-petal='gpu']")!;
    expect(gpuPetal.getAttribute("fill-opacity")).toBe("0.4");
    expect(cpuPetal.getAttribute("fill-opacity")).toBe("0.9");
  });

  it("does not show tooltip in compact mode on hover", () => {
    const { container } = render(<PolarBar scores={mockScores} compact />);
    const cpuPetal = container.querySelector("path[data-petal='cpu']")!;
    fireEvent.mouseEnter(cpuPetal);
    // All petals stay at 0.7 opacity (no hover effect in compact mode)
    expect(cpuPetal.getAttribute("fill-opacity")).toBe("0.7");
  });

  /* Task 5: Compare mode */
  it("renders compare petals when compareScores provided", () => {
    const compare = [
      {
        name: "Model B",
        scores: { cpu: 60, gpu: 70, memory: 50, display: 80, connectivity: 40, portability: 90 },
        color: "#4589ff",
      },
    ];
    const { container } = render(<PolarBar scores={mockScores} compareScores={compare} color="#d4437a" />);
    const comparePetals = container.querySelectorAll("path[data-compare-petal]");
    expect(comparePetals).toHaveLength(6);
    comparePetals.forEach((p) => {
      expect(p.getAttribute("fill")).toBe("#4589ff");
      expect(p.getAttribute("fill-opacity")).toBe("0.4");
    });
  });
});
