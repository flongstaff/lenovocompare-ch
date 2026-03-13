/**
 * Price validation for user-submitted and imported prices.
 * Enforces sanity bounds for Swiss laptop market (CHF).
 */

export interface PriceValidationResult {
  readonly valid: boolean;
  readonly warning?: string;
}

/** Absolute floor — no Lenovo laptop sells below this in Switzerland */
const MIN_PRICE_CHF = 200;

/** Absolute ceiling — even maxed-out P-series workstations stay below this */
const MAX_PRICE_CHF = 15_000;

/**
 * Validate a single price value against Swiss market sanity bounds.
 * Returns `valid: false` with a user-facing warning for prices outside the range.
 */
export const validatePrice = (price: number): PriceValidationResult => {
  if (!Number.isFinite(price)) {
    return { valid: false, warning: "Price must be a valid number" };
  }
  if (price <= 0) {
    return { valid: false, warning: "Price must be positive" };
  }
  if (price < MIN_PRICE_CHF) {
    return {
      valid: false,
      warning: `Price seems too low (min CHF ${MIN_PRICE_CHF})`,
    };
  }
  if (price > MAX_PRICE_CHF) {
    return {
      valid: false,
      warning: `Price seems too high (max CHF ${MAX_PRICE_CHF.toLocaleString("de-CH")})`,
    };
  }
  return { valid: true };
};

export { MIN_PRICE_CHF, MAX_PRICE_CHF };
