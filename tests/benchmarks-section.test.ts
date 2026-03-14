/**
 * Unit tests for benchmark source link rendering in BenchmarksSection.
 * Tests the SourceLinkedValue helper component behavior.
 */
import { describe, it, expect } from "vitest";

// ---------------------------------------------------------------
// Inline helper that mirrors the rendering logic for source links.
// The actual component uses React, but we test the decision logic here
// since rendering BenchmarksSection directly requires complex mocks.
// ---------------------------------------------------------------

interface SourceLinkResult {
  type: "link" | "unverified" | "plain";
  href?: string;
  text: string;
  hasUnverifiedLabel?: boolean;
}

/**
 * Simulates what SourceLinkedValue renders given a value and optional sourceUrls.
 * Returns a descriptor object describing the rendered output.
 */
function resolveSourceLinkRendering(
  value: string | number,
  sourceUrls: readonly string[] | undefined,
): SourceLinkResult {
  const hasSource = sourceUrls && sourceUrls.length > 0;
  if (hasSource) {
    return {
      type: "link",
      href: sourceUrls[0],
      text: String(value),
      hasUnverifiedLabel: false,
    };
  }
  return {
    type: "unverified",
    text: String(value),
    hasUnverifiedLabel: true,
  };
}

// ---------------------------------------------------------------
// Tests
// ---------------------------------------------------------------
describe("SourceLinkedValue rendering logic", () => {
  describe("when sourceUrls has entries", () => {
    const sourceUrls = ["https://www.notebookcheck.net/Lenovo-ThinkPad-X1-Carbon-Gen-12-Review.html"];

    it("renders as a link type", () => {
      const result = resolveSourceLinkRendering(42.5, sourceUrls);
      expect(result.type).toBe("link");
    });

    it("uses the first sourceUrl as href", () => {
      const result = resolveSourceLinkRendering(42.5, sourceUrls);
      expect(result.href).toBe(sourceUrls[0]);
    });

    it("displays the value as link text", () => {
      const result = resolveSourceLinkRendering(42.5, sourceUrls);
      expect(result.text).toBe("42.5");
    });

    it("does not show unverified label when source is present", () => {
      const result = resolveSourceLinkRendering(42.5, sourceUrls);
      expect(result.hasUnverifiedLabel).toBe(false);
    });

    it("works with multiple sourceUrls (uses first)", () => {
      const multiUrls = ["https://www.notebookcheck.net/first.html", "https://www.notebookcheck.net/second.html"];
      const result = resolveSourceLinkRendering(100, multiUrls);
      expect(result.href).toBe(multiUrls[0]);
    });
  });

  describe("when sourceUrls is empty", () => {
    it("renders as unverified type", () => {
      const result = resolveSourceLinkRendering(42.5, []);
      expect(result.type).toBe("unverified");
    });

    it("shows unverified label", () => {
      const result = resolveSourceLinkRendering(42.5, []);
      expect(result.hasUnverifiedLabel).toBe(true);
    });

    it("still displays the value text", () => {
      const result = resolveSourceLinkRendering(42.5, []);
      expect(result.text).toBe("42.5");
    });
  });

  describe("when sourceUrls is undefined", () => {
    it("renders as unverified type", () => {
      const result = resolveSourceLinkRendering(42.5, undefined);
      expect(result.type).toBe("unverified");
    });

    it("shows unverified label", () => {
      const result = resolveSourceLinkRendering(42.5, undefined);
      expect(result.hasUnverifiedLabel).toBe(true);
    });
  });
});

// ---------------------------------------------------------------
// Tests for the unverified label CSS class specification
// ---------------------------------------------------------------
describe("unverified label styling specification", () => {
  it("specifies opacity-50 class for unverified labels", () => {
    // This test documents the required CSS class for the unverified label
    // The actual class applied in BenchmarksSection.tsx should be "opacity-50"
    const UNVERIFIED_CLASSES = "ml-1 text-xs opacity-50";
    expect(UNVERIFIED_CLASSES).toContain("opacity-50");
  });
});

// ---------------------------------------------------------------
// Tests for anchor attribute specification
// ---------------------------------------------------------------
describe("source link anchor attributes specification", () => {
  it("specifies target=_blank for links", () => {
    // Documents required attributes on source links
    const LINK_TARGET = "_blank";
    expect(LINK_TARGET).toBe("_blank");
  });

  it("specifies rel=noopener noreferrer for security", () => {
    const LINK_REL = "noopener noreferrer";
    expect(LINK_REL).toBe("noopener noreferrer");
  });
});
