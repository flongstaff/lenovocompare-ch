import { describe, it, expect } from "vitest";
import { validatePrice, MIN_PRICE_CHF, MAX_PRICE_CHF } from "@/lib/validators";

describe("validatePrice", () => {
  it("should accept prices within valid range", () => {
    expect(validatePrice(500)).toEqual({ valid: true });
    expect(validatePrice(1499)).toEqual({ valid: true });
    expect(validatePrice(200)).toEqual({ valid: true });
    expect(validatePrice(15000)).toEqual({ valid: true });
  });

  it("should reject zero and negative prices", () => {
    expect(validatePrice(0).valid).toBe(false);
    expect(validatePrice(-100).valid).toBe(false);
  });

  it("should reject prices below minimum", () => {
    const result = validatePrice(99);
    expect(result.valid).toBe(false);
    expect(result.warning).toContain(`${MIN_PRICE_CHF}`);
  });

  it("should reject prices above maximum", () => {
    const result = validatePrice(20000);
    expect(result.valid).toBe(false);
    expect(result.warning).toContain("too high");
  });

  it("should accept boundary values", () => {
    expect(validatePrice(MIN_PRICE_CHF).valid).toBe(true);
    expect(validatePrice(MAX_PRICE_CHF).valid).toBe(true);
  });

  it("should reject just below minimum boundary", () => {
    expect(validatePrice(MIN_PRICE_CHF - 1).valid).toBe(false);
  });

  it("should reject just above maximum boundary", () => {
    expect(validatePrice(MAX_PRICE_CHF + 1).valid).toBe(false);
  });

  it("should reject NaN and Infinity", () => {
    expect(validatePrice(NaN).valid).toBe(false);
    expect(validatePrice(Infinity).valid).toBe(false);
    expect(validatePrice(-Infinity).valid).toBe(false);
  });
});
