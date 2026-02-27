import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
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
});
