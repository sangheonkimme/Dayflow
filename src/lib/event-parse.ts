import { DOW } from "@/lib/date";
import { EVENT_CATEGORIES, EVENT_CATEGORY_COLORS } from "@/lib/categories";

// ─────────────────────────────────────────────
// 캘린더 "빠른 일정(자연어)" 파서 — PC EventModal 과 모바일 AddEventSheet 공유.
// 순수 함수라 어느 화면에서도 재사용 가능. UI 는 각 화면이 담당.
// ─────────────────────────────────────────────

/** 카테고리 → 캘린더 범례 색상 (빠른 입력은 색을 안 고르므로 자동 매핑) */
export const CAT_COLOR: Record<string, string> = Object.fromEntries(
  EVENT_CATEGORY_COLORS as [string, string][],
);

export type ParsedEvent = {
  date: Date;
  hour: number;
  min: number;
  cat: string;
  title: string;
  allDay: boolean;
  repeat: "none" | "매일" | "매주" | "매월";
};

// 파싱한 토큰은 rest 에서 지워가며 남는 텍스트를 제목으로 쓴다.
export function parseEvent(input: string): ParsedEvent {
  let rest = input;

  const cat =
    EVENT_CATEGORIES.find((c) => rest.includes(c)) ||
    (/(미팅|회의|스탠드업|리뷰)/.test(rest)
      ? "업무"
      : /(운동|헬스|러닝|요가)/.test(rest)
        ? "운동"
        : "개인");
  rest = rest.replace(cat, "");

  // 반복: "매일/매주/매월"
  let repeat: "none" | "매일" | "매주" | "매월" = "none";
  const rep = rest.match(/매(일|주|월)/);
  if (rep) {
    repeat = `매${rep[1]}` as typeof repeat;
    rest = rest.replace(rep[0], "");
  }

  // 날짜: 내일/모레 → "5/15" 형식 → "금요일"
  const today = new Date();
  const date = new Date(today);
  const md = rest.match(/(\d{1,2})\s*\/\s*(\d{1,2})/);
  if (/내일/.test(rest)) date.setDate(date.getDate() + 1);
  else if (/모레/.test(rest)) date.setDate(date.getDate() + 2);
  else if (md) {
    date.setMonth(parseInt(md[1], 10) - 1, parseInt(md[2], 10));
    // 이미 지난 날짜면 내년으로
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    if (date < startOfToday) date.setFullYear(date.getFullYear() + 1);
    rest = rest.replace(md[0], "");
  } else {
    // "요" 필수 — 없으면 "월급/입금"의 월·금이 요일로 오인된다.
    const m = rest.match(/([일월화수목금토])요(?:일)?/);
    if (m) {
      const target = DOW.indexOf(m[1] as (typeof DOW)[number]);
      let diff = target - date.getDay();
      if (diff <= 0) diff += 7;
      date.setDate(date.getDate() + diff);
      rest = rest.replace(m[0], "");
    }
  }
  rest = rest.replace(/(오늘|내일|모레)/, "");

  // 종일 여부 (시간보다 먼저 소비)
  const allDay = /종일/.test(rest);
  rest = rest.replace(/종일/, "");

  // 시간 (종일이면 무시) — 날짜 토큰 제거 후 매칭해야 "5/15"의 5를 시간으로 안 읽음
  let hour = 14,
    min = 0;
  if (!allDay) {
    // "3시" / "10:30" / "오전 11시 30분" — 맨숫자("3명" 등) 오인 방지로 시·분 표기는 필수
    const tm = rest.match(
      /(오전|오후)?\s*(\d{1,2})(?::(\d{2})\s*시?|\s*시)\s*(?:(\d{1,2})\s*분)?/,
    );
    if (tm) {
      hour = parseInt(tm[2], 10);
      min = tm[3] ? parseInt(tm[3], 10) : tm[4] ? parseInt(tm[4], 10) : 0;
      if (tm[1] === "오후" && hour < 12) hour += 12;
      if (tm[1] === "오전" && hour === 12) hour = 0;
      rest = rest.replace(tm[0], "");
    }
  }

  const title = rest.replace(/\s+/g, " ").trim() || "새 일정";

  return { date, hour, min, cat, title, allDay, repeat };
}

export const fmtDate = (d: Date) =>
  `${d.getMonth() + 1}월 ${d.getDate()}일 (${DOW[d.getDay()]})`;

export const fmtTime = (h: number, m: number) => {
  const ampm = h < 12 ? "오전" : "오후";
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${ampm} ${hh}:${String(m).padStart(2, "0")}`;
};
