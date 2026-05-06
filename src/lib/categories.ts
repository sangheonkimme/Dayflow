// ============================================================
// Category & color maps
// ============================================================

/**
 * 거래/가계부 카테고리 → 색상.
 * 식비/외식/주거/교통/쇼핑/여가/구독/건강/도서/급여/부수입/환불/기타.
 */
export const TRANSACTION_CATEGORIES = {
  식비: "#e89aac",
  외식: "#e25c4d",
  주거: "#1f1d18",
  교통: "#8ec0d6",
  쇼핑: "#e8c84a",
  여가: "#a8d09b",
  구독: "#a259ff",
  건강: "#4a8d5a",
  도서: "#2c5e8b",
  급여: "#4a8d5a",
  부수입: "#4a8d5a",
  환불: "#4a8d5a",
  기타: "#c9bd9f",
};

/** Event modal categories (업무/개인/운동/금융/기타). */
export const EVENT_CATEGORIES = ["업무", "개인", "운동", "금융", "기타"];

/** Color palette used in event create/edit modals. */
export const EVENT_COLOR_PALETTE = [
  "var(--red)",
  "#e89aac",
  "#8ec0d6",
  "#4a8d5a",
  "#e8c84a",
  "#d4c1f0",
  "var(--ink)",
];

/** Calendar legend mapping (event category → display color). */
export const EVENT_CATEGORY_COLORS = [
  ["업무", "var(--red)"],
  ["개인", "#e89aac"],
  ["운동", "#8ec0d6"],
  ["금융", "#4a8d5a"],
  ["기타", "var(--ink-soft)"],
];

/** 정기구독 카테고리 ({ id, label, color }). */
export const SUBS_CATEGORIES = [
  { id: "all", label: "전체", color: "var(--ink)" },
  { id: "업무 도구", label: "업무 도구", color: "#a259ff" },
  { id: "엔터테인먼트", label: "엔터테인먼트", color: "#e25c4d" },
  { id: "음악", label: "음악", color: "#4a8d5a" },
  { id: "클라우드", label: "클라우드", color: "#3a8dde" },
  { id: "쇼핑", label: "쇼핑", color: "#e8c84a" },
  { id: "독서", label: "독서", color: "#2c5e8b" },
  { id: "건강", label: "건강", color: "#a8d09b" },
  { id: "기타", label: "기타", color: "#c9bd9f" },
];
