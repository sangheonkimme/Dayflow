// ============================================================
// Date helpers
// ============================================================

export const DOW = ["일", "월", "화", "수", "목", "금", "토"] as const;
export const MONTHS = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
] as const;

export type DateInput = Date | string | number;

/** 로컬 기준 "YYYY-MM-DD" — toISOString 은 UTC 라 자정 전후 날짜가 밀리므로 금지 */
export const toLocalYmd = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** 로컬 기준 "HH:MM" */
export const toLocalHm = (d: Date): string =>
  `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

/** "MM.DD (요일)" — used for txn day groupings */
export const formatDateWithDow = (date: DateInput): string => {
  const d = date instanceof Date ? date : new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}.${dd} (${DOW[d.getDay()]})`;
};

/** "M월 D일 HH:MM" — sticky-note style absolute timestamp */
export const formatDateTimeShort = (date: DateInput): string => {
  const d = date instanceof Date ? date : new Date(date);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${m}월 ${day}일 ${hh}:${mm}`;
};

/**
 * "오늘" / "어제" / "MM.DD (요일)"
 * Returns relative label if the given date is today or yesterday relative to `today`.
 */
export const getRelativeDateLabel = (
  date: DateInput,
  today: Date = new Date(),
): string => {
  const d = date instanceof Date ? date : new Date(date);
  const startOfDay = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOfDay(d) - startOfDay(today)) / 86400000);
  if (diffDays === 0) return "오늘";
  if (diffDays === -1) return "어제";
  return formatDateWithDow(d);
};
