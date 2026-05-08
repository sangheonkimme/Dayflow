// ============================================================
// Memos — seeds + selectors + hook
// ============================================================

import { useMemo } from "react";
import type { MemoDoc } from "@/types";
import { getRelativeDateLabel } from "@/lib/date";
import { getDataSource } from "@/data/source";
import {
  useRepositoryQuery,
  type RepositoryQueryView,
} from "@/data/useRepositoryQuery";

// ─────────────────────────────────────────────
// Folder + seed types
// ─────────────────────────────────────────────
export interface MemoFolder {
  id: string;
  label: string;
  icon: string;
  count: number;
  color?: string;
}

export const MEMO_SEEDS: MemoDoc[] = [
  {
    id: 1,
    title: "디자인 시스템 v2 — 컬러 토큰 정리",
    folder: "work",
    tags: ["디자인", "토큰"],
    starred: true,
    pinned: true,
    updated: "오늘 오후 2:14",
    word: 612,
    excerpt:
      "primary / secondary / surface 3-tier로 재정리. 다크 모드 대응은 oklch로…",
    body: `# 디자인 시스템 v2 — 컬러 토큰 정리

오늘 회의에서 결정된 사항 정리.

## 토큰 구조
3단 구조로 간소화한다:
1. **Primitive** — 원시 색상 팔레트 (raw values)
2. **Semantic** — 의미 기반 별칭 (surface / ink / accent)
3. **Component** — 특정 컴포넌트 전용 (button-primary-bg 등)

## 다크 모드
- oklch 기반으로 명도(lightness)만 반전시키는 방식으로 통일.
- 채도(chroma)는 라이트보다 살짝 낮춤 — 눈 피로도 ↓.
- 이전엔 채도까지 같이 건드려서 색이 칙칙해졌었음.

> "토큰은 약속이지, 색상이 아니다."  — 어느 시니어 디자이너

## 다음 단계
- [ ] 피그마 변수 정리 (수요일까지)
- [x] 라이트 토큰 정의
- [ ] 다크 토큰 정의
- [ ] 개발팀에 핸드오프 문서 전달

연락: 민수 PM에게 컬러 시안 슬랙으로 공유 예정.`,
  },
  {
    id: 2,
    title: "이번 분기 회고",
    folder: "personal",
    tags: ["회고", "성장"],
    starred: true,
    pinned: false,
    updated: "어제",
    word: 384,
    excerpt: "잘한 것: 디자인 시스템 안정화, 신규 기능 3건 출시. 아쉬운 것…",
    body: `# 이번 분기 회고

## 잘한 것
- 디자인 시스템 v1 안정화
- 신규 기능 3건 출시
- 팀원 1명 멘토링 — 막내 디자이너 성장 도움

## 아쉬운 것
- 야근이 잦았음. 다음 분기엔 일정 조율 더 적극적으로.
- 책 읽는 시간 부족. 분기에 책 1권은 꼭.
- 운동 빈도가 떨어짐.

## 다음 분기 목표
1. 정시 퇴근 주 3회 이상
2. 디자인 책 2권 완독
3. 필라테스 주 2회`,
  },
  {
    id: 3,
    title: "주말에 갈 동네 카페 리스트",
    folder: "personal",
    tags: ["카페", "주말"],
    starred: false,
    pinned: false,
    updated: "그저께",
    word: 142,
    excerpt: "성수 — 어니언, 대림창고. 연남 — 카멜커피, 피어커피…",
    body: `# 주말 카페 리스트

## 성수
- 어니언 — 빵이 정말 맛있음
- 대림창고 — 사진 찍기 좋음
- 카페 할아버지공장 — 오래 앉아있기 좋은 공간

## 연남
- 카멜커피 — 라떼가 진함
- 피어커피 — 원두 종류가 다양

## 한남
- 콤마콤마 — 분위기 ◎
- 더 카페 1924`,
  },
  {
    id: 4,
    title: "신규 프로젝트 킥오프 — 아이디어 메모",
    folder: "work",
    tags: ["기획", "아이디어"],
    starred: false,
    pinned: false,
    updated: "월요일",
    word: 256,
    excerpt: "타겟: 20-30대 직장인. 핵심 가치: 일과 삶의 분리…",
    body: `# 신규 프로젝트 — 아이디어 노트

## 타겟
- 20-30대 직장인
- 출퇴근 1시간 이상

## 핵심 가치
> 일과 삶의 분리

- 퇴근 후 알림 자동 차단
- 주말엔 업무 데이터 안 보임
- 휴가 모드`,
  },
  {
    id: 5,
    title: "책 — 『생각의 탄생』 발췌",
    folder: "study",
    tags: ["독서", "발췌"],
    starred: false,
    pinned: false,
    updated: "지난주",
    word: 521,
    excerpt: "관찰, 형상화, 추상, 패턴인식… 13가지 생각도구.",
    body: `# 『생각의 탄생』 — 핵심 정리

## 13가지 생각도구
1. 관찰
2. 형상화
3. 추상
4. 패턴인식
5. 패턴형성
6. 유추
7. 몸으로 생각하기
8. 감정이입
9. 차원적 사고
10. 모형 만들기
11. 놀이
12. 변형
13. 통합`,
  },
  {
    id: 6,
    title: "엄마 생신 선물 아이디어",
    folder: "personal",
    tags: ["가족", "선물"],
    starred: false,
    pinned: false,
    updated: "11.20",
    word: 84,
    excerpt: "캐시미어 머플러? 안마의자는 부담스럽고…",
    body: `# 엄마 생신 (12월 14일)

## 후보
- 캐시미어 머플러 (베이지 / 카멜)
- 화분 — 다육이 좋아하심
- 백화점 상품권 (실용적이지만 정 없어 보일까)

## 결정
캐시미어 머플러 + 손편지 조합으로.`,
  },
  {
    id: 7,
    title: "인터뷰 준비 — 자주 받는 질문",
    folder: "study",
    tags: ["커리어"],
    starred: false,
    pinned: false,
    updated: "11.18",
    word: 402,
    excerpt: "본인 소개, 강점/약점, 갈등 해결 사례, 실패 경험…",
    body: `# 인터뷰 준비

## 자주 받는 질문
- 자기소개 (1분 / 3분 버전)
- 강점과 약점
- 갈등 해결 경험
- 실패 경험과 배운 점
- 5년 후 모습

## STAR 프레임워크
- **S**ituation — 상황
- **T**ask — 과제
- **A**ction — 행동
- **R**esult — 결과`,
  },
];

export const FOLDERS: MemoFolder[] = [
  { id: "all", label: "전체 메모", icon: "note", count: 7 },
  { id: "starred", label: "즐겨찾기", icon: "star", count: 2 },
  { id: "work", label: "업무", icon: "folder", count: 2, color: "#e89aac" },
  { id: "personal", label: "개인", icon: "folder", count: 3, color: "#8ec0d6" },
  {
    id: "study",
    label: "공부 · 독서",
    icon: "folder",
    count: 2,
    color: "#a8d09b",
  },
  { id: "trash", label: "휴지통", icon: "trash", count: 0 },
];

export const ALL_TAGS = [
  "디자인",
  "토큰",
  "회고",
  "성장",
  "카페",
  "주말",
  "기획",
  "아이디어",
  "독서",
  "가족",
  "커리어",
];

// ─────────────────────────────────────────────
// Derived display selectors
// ─────────────────────────────────────────────
export function memoExcerpt(
  memo: Pick<MemoDoc, "excerpt" | "body">,
  max = 140,
): string {
  if (memo.excerpt) return memo.excerpt;
  const flat = (memo.body ?? "").replace(/\s+/g, " ").trim();
  return flat.length > max ? flat.slice(0, max) + "…" : flat;
}

export function memoWordCount(memo: Pick<MemoDoc, "word" | "body">): number {
  if (typeof memo.word === "number") return memo.word;
  return (memo.body ?? "").replace(/\s/g, "").length;
}

/**
 * memo.updated 가 ISO timestamp(2026-05-08T23:07:49.809723+00:00) 일 때
 * 사람이 읽을 수 있는 형태(M월 D일 HH:MM)로 포맷. 비-ISO 자유 문자열
 * ('방금', '어제') 은 그대로 통과.
 */
function formatUpdated(value: string): string {
  // ISO 패턴: 4자리-2자리-2자리T 시작
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  if (sameDay) return `오늘 ${hh}:${mm}`;
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${hh}:${mm}`;
}

export function memoUpdatedLabel(
  memo: Pick<MemoDoc, "updated">,
  fallbackDate?: Date,
): string {
  if (memo.updated) return formatUpdated(memo.updated);
  if (fallbackDate) return getRelativeDateLabel(fallbackDate);
  return "—";
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export interface MemosView extends RepositoryQueryView<MemoDoc> {
  all: readonly MemoDoc[];
}

export function useMemos(folder?: string): MemosView {
  const view = useRepositoryQuery(getDataSource().memos, {
    queryKey: ["memos"],
  });
  const { data: all } = view;
  const data = useMemo(() => {
    if (!folder || folder === "all") return all;
    if (folder === "starred") return all.filter((m) => m.starred);
    if (folder === "trash") return [];
    return all.filter((m) => m.folder === folder);
  }, [all, folder]);
  return useMemo(() => ({ ...view, data, all }), [view, data, all]);
}
