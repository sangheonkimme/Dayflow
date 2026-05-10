"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Icon } from "@/components/Icon";
import { useTransactions } from "@/data/transactions";
import { useEvents } from "@/data/events";
import { useMemos, memoExcerpt } from "@/data/memos";
import styles from "./SearchOverlay.module.css";

// ============================================================
// SEARCH OVERLAY — 글로벌 ⌘K 검색
// ============================================================

export type SearchEntryType = "page" | "txn" | "event" | "memo";

export interface SearchEntry {
  type: SearchEntryType;
  /** 라우팅 키 — 사이드바 active key 와 동일 (home/ledger/calendar/...) */
  id: string;
  label: string;
  sub: string;
  icon: string;
  /** Phase 2 deep-link 용 reservation. 현재는 layout 에서 무시. */
  params?: Record<string, string>;
}

export interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (entry: SearchEntry) => void;
}

const PAGE_INDEX: SearchEntry[] = [
  { type: "page", id: "home", label: "대시보드", sub: "오늘의 한눈에", icon: "home" },
  { type: "page", id: "ledger", label: "가계부", sub: "수입 · 지출 · 통계", icon: "wallet" },
  { type: "page", id: "txns", label: "거래내역", sub: "전체 검색 · 상세", icon: "cash" },
  { type: "page", id: "subs", label: "정기구독", sub: "구독 관리", icon: "repeat" },
  { type: "page", id: "calendar", label: "캘린더", sub: "일정 · 이벤트", icon: "cal" },
  { type: "page", id: "memo", label: "메모", sub: "장문 메모", icon: "note" },
  { type: "page", id: "salary", label: "연봉 계산기", sub: "실수령액 계산", icon: "coin" },
  { type: "page", id: "loan", label: "대출 이자 계산기", sub: "원리금/원금 균등", icon: "cash" },
  { type: "page", id: "crop", label: "이미지 자르기", sub: "비율 / 크롭", icon: "crop" },
  { type: "page", id: "pdf", label: "이미지 → PDF", sub: "한번에 변환", icon: "pdf" },
  { type: "page", id: "settings", label: "환경설정", sub: "테마 · 계정", icon: "settings" },
];

const GROUP_ORDER: SearchEntryType[] = ["page", "txn", "event", "memo"];
const GROUP_LABELS: Record<SearchEntryType, string> = {
  page: "페이지",
  txn: "거래내역",
  event: "일정",
  memo: "메모",
};

function formatTxnSub(amount: number, cat?: string): string {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount).toLocaleString();
  return cat ? `${sign}₩${abs} · ${cat}` : `${sign}₩${abs}`;
}

function formatEventSub(date: string, startTime?: string, allDay?: boolean): string {
  if (allDay) return `${date} · 종일`;
  return startTime ? `${date} ${startTime}` : date;
}

export function SearchOverlay({ open, onClose, onNavigate }: SearchOverlayProps) {
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const previousFocus = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 실데이터 — open=false 일 땐 컴포넌트 자체가 unmount 라 hook 호출 순서 안전.
  const { all: txnsAll } = useTransactions();
  const { data: events } = useEvents();
  const { all: memosAll } = useMemos();

  const txnEntries = useMemo<SearchEntry[]>(
    () =>
      txnsAll.map((t) => ({
        type: "txn",
        id: "ledger",
        label: t.label || t.note || t.cat || "(이름 없음)",
        sub: formatTxnSub(t.amount, t.cat),
        icon: t.icon || "cash",
        params: { focus: String(t.id) },
      })),
    [txnsAll],
  );

  const eventEntries = useMemo<SearchEntry[]>(
    () =>
      events.map((e) => ({
        type: "event",
        id: "calendar",
        label: e.title || "(제목 없음)",
        sub: formatEventSub(e.date, e.startTime, e.allDay),
        icon: "cal",
        params: { focus: e.id },
      })),
    [events],
  );

  const memoEntries = useMemo<SearchEntry[]>(
    () =>
      memosAll.map((m) => ({
        type: "memo",
        id: "memo",
        label: m.title || "(제목 없음)",
        sub: memoExcerpt(m, 60),
        icon: "note",
        params: { focus: String(m.id) },
      })),
    [memosAll],
  );

  const fullIndex = useMemo<SearchEntry[]>(
    () => [...PAGE_INDEX, ...txnEntries, ...eventEntries, ...memoEntries],
    [txnEntries, eventEntries, memoEntries],
  );

  const ql = q.trim().toLowerCase();
  const flatResults = useMemo<SearchEntry[]>(() => {
    if (!ql) return PAGE_INDEX.slice(0, 6);
    return fullIndex.filter((it) =>
      (it.label + " " + it.sub).toLowerCase().includes(ql),
    );
  }, [ql, fullIndex]);

  // 그룹핑 — flat index 매핑 함께 보존.
  const groups = useMemo(() => {
    const acc = new Map<SearchEntryType, { entry: SearchEntry; flatIndex: number }[]>();
    flatResults.forEach((entry, flatIndex) => {
      const arr = acc.get(entry.type);
      if (arr) arr.push({ entry, flatIndex });
      else acc.set(entry.type, [{ entry, flatIndex }]);
    });
    return acc;
  }, [flatResults]);

  // 검색어 바뀌면 cursor 리셋.
  useEffect(() => {
    setCursor(0);
  }, [ql]);

  // cursor 가 결과 범위 밖이면 클램프.
  useEffect(() => {
    if (cursor >= flatResults.length) setCursor(Math.max(0, flatResults.length - 1));
  }, [cursor, flatResults.length]);

  // open 시 이전 focus 보관 + ESC 닫기. close 시 focus 복원.
  useEffect(() => {
    if (!open) return;
    previousFocus.current =
      typeof document !== "undefined" ? (document.activeElement as HTMLElement | null) : null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      // close 후 이전 포커스 복원 (오버레이 unmount 직후 실행).
      previousFocus.current?.focus?.();
    };
  }, [open, onClose]);

  const handlePick = useCallback(
    (entry: SearchEntry) => {
      onNavigate(entry);
      onClose();
      setQ("");
      setCursor(0);
    },
    [onNavigate, onClose],
  );

  const handleInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (flatResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (c + 1) % flatResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (c - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = flatResults[cursor] ?? flatResults[0];
      if (pick) handlePick(pick);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.searchOverlay} onClick={onClose}>
      <div
        className={styles.searchModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="빠른 검색"
      >
        <div className={styles.searchInputWrap}>
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            autoFocus
            placeholder="페이지, 거래, 일정, 메모 검색..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleInputKeyDown}
            aria-label="검색어 입력"
          />
          <kbd>ESC</kbd>
        </div>

        <div className={styles.searchResults}>
          {flatResults.length === 0 && (
            <div className={styles.searchEmpty}>
              <div className={styles.searchEmptyMark}>
                <Icon name="search" size={28} />
              </div>
              <b>검색 결과가 없어요</b>
              <small>다른 키워드로 시도해보세요</small>
            </div>
          )}

          {GROUP_ORDER.map((g) => {
            const items = groups.get(g);
            if (!items || items.length === 0) return null;
            return (
              <div key={g} className={styles.searchGroup}>
                <div className={styles.searchGroupLabel}>
                  {ql ? GROUP_LABELS[g] : "바로가기"}
                </div>
                {items.map(({ entry, flatIndex }) => (
                  <button
                    type="button"
                    key={`${entry.type}-${entry.id}-${flatIndex}`}
                    className={styles.searchItem}
                    data-active={flatIndex === cursor}
                    onClick={() => handlePick(entry)}
                    onMouseEnter={() => setCursor(flatIndex)}
                  >
                    <div className={styles.searchItemIco}>
                      <Icon name={entry.icon} size={14} />
                    </div>
                    <div className={styles.searchItemBody}>
                      <b>{entry.label}</b>
                      <small>{entry.sub}</small>
                    </div>
                    <span className={styles.searchItemType}>
                      {GROUP_LABELS[entry.type]}
                    </span>
                    <span className={styles.searchItemArrow}>↵</span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        <div className={styles.searchFoot}>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> 이동
          </span>
          <span>
            <kbd>↵</kbd> 선택
          </span>
          <span>
            <kbd>ESC</kbd> 닫기
          </span>
          <span className={styles.searchFootTip}>⌘K로 다시 열기</span>
        </div>
      </div>
    </div>
  );
}
