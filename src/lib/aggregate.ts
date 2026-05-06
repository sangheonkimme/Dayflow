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
    return a + (typeof v === 'number' ? v : 0);
  }, 0);

export interface CategoryBreakdownEntry {
  cat: string;
  amount: number;
  /** "12.3" — 한 자리 소수까지 문자열로 (기존 UI 포맷 유지) */
  pct: string;
}

/**
 * Returns [{ cat, amount, pct }] sorted by amount desc.
 * `pct` is a string with one decimal place (matches existing display format).
 */
export const categoryBreakdown = <T extends Record<string, unknown>>(
  items: T[],
  catKey: keyof T,
  amtKey: keyof T,
): CategoryBreakdownEntry[] => {
  const map: Record<string, number> = {};
  items.forEach((it) => {
    const k = String(it[catKey]);
    const v = it[amtKey];
    map[k] = (map[k] || 0) + (typeof v === 'number' ? v : 0);
  });
  const total = Object.values(map).reduce((a, n) => a + n, 0);
  return Object.entries(map)
    .map(([cat, amount]) => ({
      cat,
      amount,
      pct: total > 0 ? ((amount / total) * 100).toFixed(1) : '0.0',
    }))
    .sort((a, b) => b.amount - a.amount);
};
