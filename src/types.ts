// ============================================================
// Domain types
// ============================================================
//
// 시드 데이터(여러 컴포넌트 mock)와 모달의 `editing` payload, 그리고
// 추후 Supabase row 매핑 모두 공통으로 따르는 표준 shape.

// ─────────────────────────────────────────────
// 거래 (Transaction)
// ─────────────────────────────────────────────
export type TxnType = "in" | "out";

export interface Txn {
  id: number | string;
  /** "YYYY-MM-DD" — 모든 거래 시드의 정렬 키 */
  date: string;
  /** "HH:MM" — 옵션 (홈 위젯의 간소 시드는 시간 없을 수 있음) */
  time?: string;
  label: string;
  note?: string;
  /** 음수=지출, 양수=수입 (KRW 정수, 원 단위) */
  amount: number;
  type: TxnType;
  /** Icon 컴포넌트 name */
  icon?: string;
  /** 카테고리: 식비/외식/주거/교통/쇼핑/여가/구독/건강/도서/급여/부수입/환불/기타 */
  cat?: string;
  /** 결제수단: 신한카드/현대카드/현금/자동이체 등 */
  pay?: string;
  /** 사용자 메모 (장문) */
  memo?: string;
  /** 월급 강조 표시 (홈 MoneyFlow 위젯 전용) */
  payday?: boolean;
}

/** 모달이 새 거래를 추가할 때 prefill로 받는 부분형. */
export type TxnDraft = Partial<Txn>;

// ─────────────────────────────────────────────
// 일정 (CalendarEvent)
// ─────────────────────────────────────────────
export type EventRepeat = "none" | "매일" | "매주" | "매월";

export interface CalendarEvent {
  id: string;
  title: string;
  /** "YYYY-MM-DD" */
  date: string;
  /** "HH:MM" */
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  /** 업무/개인/운동/금융/기타 */
  cat?: string;
  /** CSS 색상 토큰 또는 HEX */
  color?: string;
  place?: string;
  memo?: string;
  /** 알람 분 단위 (null=알람없음) */
  alarm?: number | null;
  repeat?: EventRepeat;
}

export type EventDraft = Partial<CalendarEvent>;

// ─────────────────────────────────────────────
// 메모 / 스티키
// ─────────────────────────────────────────────
export type StickyColor = "yellow" | "pink" | "blue";

export interface StickyNote {
  id: number;
  color: StickyColor;
  title: string;
  emoji?: string;
  text: string;
  /** 표시용 라벨 (오늘/어제/날짜) — 추후 timestamp로 교체 예정 */
  date: string;
  author?: string;
}

export interface MemoDoc {
  id: number;
  title: string;
  body: string;
  /** all/work/personal/study/trash */
  folder: string;
  tags: string[];
  starred: boolean;
  pinned: boolean;
  /** 표시용 — 추후 ISO timestamp로 교체 */
  updated: string;
  word: number;
  excerpt?: string;
}

// ─────────────────────────────────────────────
// 체크리스트
// ─────────────────────────────────────────────
export interface ChecklistTask {
  id: number;
  text: string;
  done: boolean;
  /** "오전 10:00" 등 표시용 */
  time?: string;
  /** 완료 처리 시각 (ISO 8601). 완료 항목 정렬 키. */
  completedAt?: string;
}

// ─────────────────────────────────────────────
// 정기구독
// ─────────────────────────────────────────────
export type SubCycle = "월" | "년";
export type SubStatus = "active" | "paused";

export interface Subscription {
  id: number | string;
  name: string;
  cat: string;
  price: number;
  cycle: SubCycle;
  /** 다음 결제일 표시용 ("11.07") */
  next?: string;
  /** 결제일 1~31 */
  day?: number;
  color?: string;
  initial?: string;
  status: SubStatus;
  /** "2023.05" */
  started?: string;
}

// ─────────────────────────────────────────────
// 모달 (App-level)
// ─────────────────────────────────────────────
export type ModalState =
  | { type: "txn"; editing?: TxnDraft }
  | { type: "event"; editing?: EventDraft }
  | null;

// ─────────────────────────────────────────────
// 사용자 설정 (Tweaks)
// ─────────────────────────────────────────────
export type AccentColor = "yellow" | "coral" | "mint" | "lilac";
export type NoteStyle = "tilted" | "flat";
export type Density = "comfy" | "compact";
export type AuthPreviewView = "login" | "signup" | "onboarding" | "forgot";

// 모바일 테마 화면 환경설정 (usePreferences 로 persist + Supabase 동기화)
export type MobileFont = "hand" | "sans" | "serif";
export type FontScale = 1 | 2 | 3 | 4;
export type ListDensity = "cozy" | "comfy" | "compact";

/** 알림 설정 — 모바일/PC 공유 스키마. preferences blob 에 저장. */
export interface NotificationPrefs {
  push: boolean;
  daily: boolean;
  weekly: boolean;
  budget: boolean;
  bigSpend: boolean;
  subRenew: boolean;
  cal30: boolean;
  cal1d: boolean;
  quietOn: boolean;
  quietStart: string;
  quietEnd: string;
  sound: string;
}

export interface Tweaks {
  dark: boolean;
  accent: AccentColor;
  noteStyle: NoteStyle;
  density: Density;
  showCalendar: boolean;
  /** 인증 mock — Supabase 도입 시 제거 */
  authed: boolean;
  forceMobile: boolean;
  authPreview: AuthPreviewView;
  // SettingsPage가 동적으로 추가하는 필드들 (월급일 등)
  payday?: number;
  paydayType?: "fixed" | "lastDay" | "firstDay";
  cycleStart?: "payday" | "1st" | "custom";
  // 모바일 테마 화면 (폰트·글자크기·목록 간격·종이질감·햅틱)
  font?: MobileFont;
  fontSize?: FontScale;
  listDensity?: ListDensity;
  paperTexture?: boolean;
  haptics?: boolean;
  // 알림 설정 (모바일/PC 공유)
  notifications?: NotificationPrefs;
  [extra: string]: unknown;
}

export type TweakKey = keyof Tweaks;
export type SetTweak = <K extends TweakKey>(key: K, value: Tweaks[K]) => void;
