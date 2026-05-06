// ============================================================
// Currency formatting helpers
// ============================================================

/**
 * Unsigned won format: "₩1,234"
 * Floors absolute value before formatting (used by salary calculator etc.)
 */
export const formatWon = (n: number): string =>
  "₩" + Math.abs(Math.floor(n)).toLocaleString();

/**
 * Signed won format: "+₩1,234" / "-₩1,234" / "₩0"
 */
export const formatSignedWon = (n: number): string =>
  (n < 0 ? "-" : n > 0 ? "+" : "") + "₩" + Math.abs(n).toLocaleString();
