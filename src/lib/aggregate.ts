// ============================================================
// Aggregation helpers
// ============================================================

/** Sum of `arr[i][key]`, treating undefined/non-numeric as 0. */
export const sumBy = <T extends Record<string, unknown>, K extends keyof T>(
  arr: T[],
  key: K,
): number =>
  arr.reduce((a, x) => {
    const v = x[key];
    return a + (typeof v === "number" ? v : 0);
  }, 0);

