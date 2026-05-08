// ============================================================
// Aggregation helpers
// ============================================================

/** Sum of `arr[i][key]`, treating undefined/non-numeric as 0. */
export const sumBy = <T, K extends keyof T>(
  arr: readonly T[],
  key: K,
): number =>
  arr.reduce((a: number, x) => {
    const v = x[key];
    return a + (typeof v === "number" ? v : 0);
  }, 0);

