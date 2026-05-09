# `@ts-nocheck` 파일 인벤토리 (Phase 0 — 2026-05-08)

> Next.js 마이그레이션 전 정리 대상. 총 **27개 파일**. Phase 5에서 전부 제거가 목표.
> 우선순위는 "런타임 사고 가능성 + 영향 범위" 기준.
>
> 사고 사례: `src/pages/landing/LandingPage.tsx` 마지막 줄 `window.Landing = Landing;` 가
> typecheck 우회 → 런타임 `ReferenceError`로 메인 깨짐 (2026-05-08 픽스됨).

## P0 — 사고 가능성 큰 진입점 (즉시 회복 권장)

- [ ] `src/pages/landing/LandingPage.tsx` — 비로그인 진입점, 이미 사고 1회
- [ ] `src/pages/mobile/MobileApp.tsx` — 모바일 단일 진입점, 라우팅 분기 다수

## P1 — 데스크탑 메인 페이지 (라우트 단위)

- [ ] `src/pages/ledger/LedgerPage.tsx`
- [ ] `src/pages/calendar/CalendarPage.tsx`
- [ ] `src/pages/txns/TxnsPage.tsx`
- [ ] `src/pages/subs/SubsPage.tsx`
- [ ] `src/pages/memo/MemoPage.tsx`
- [ ] `src/pages/loan/LoanSearch.tsx`

## P2 — 모바일 탭·시트 (커뮤니티 포함)

- [ ] `src/pages/mobile/tabs/Home.tsx`
- [ ] `src/pages/mobile/tabs/Calendar.tsx`
- [ ] `src/pages/mobile/tabs/Ledger.tsx`
- [ ] `src/pages/mobile/community/CommunityTab.tsx`
- [ ] `src/pages/mobile/community/CommentsSheet.tsx`
- [ ] `src/pages/mobile/community/ComposePostSheet.tsx`
- [ ] `src/pages/mobile/sheets/SearchSheet.tsx`
- [ ] `src/pages/mobile/screens/Profile.tsx`

## P3 — 작은 컴포넌트·모달 (영향 좁음)

- [ ] `src/components/IosFrame.tsx`
- [ ] `src/components/DesignCanvas.tsx`
- [ ] `src/pages/home/StickyNotes.tsx`
- [ ] `src/pages/home/MiniCalendar.tsx`
- [ ] `src/pages/settings/sections/Profile.tsx`
- [ ] `src/pages/ledger/ReceiptUploadModal.tsx`
- [ ] `src/pages/calendar/EventModal.tsx`
- [ ] `src/pages/mobile/shared/TxnDetailBridge.ts`
- [ ] `src/pages/mobile/shared/Ico.tsx`

---

## 운영 규칙

1. **신규 파일에 `@ts-nocheck` 금지**. 코드리뷰에서 차단.
2. 기존 파일 수정 시 가능하면 같은 PR에서 `@ts-nocheck` 제거 시도 (5분 이상 소요되면 별도 PR).
3. Phase 5 전 P0~P2 전부 회복. P3~P4는 Phase 5에서 일괄.
