# 환경설정(Settings) 페이지 개선 계획

> 작성일: 2026-06-12 · 상태: 초안(검토 대기) · 코드 변경 없음, 분석/계획 전용

## 0. 요약 (TL;DR)

Settings 페이지는 **8개 섹션의 UI 골격은 완성도 높게 짜여 있으나, 실제 동작하는 건 일부뿐**이다.

- ✅ 실연결: 프로필 이름 변경(Supabase), 외관(다크/액센트/달력, localStorage), 가계부 월급일 일부
- ❌ 목업(저장 핸들러 없음): 알림, 도구, 보안, 데이터(내보내기/삭제), 계정·결제 대부분
- ⚠️ 구조 이슈 3건: (1) preferences가 Supabase 미동기화 → 기기 간 설정 유실 (2) TweaksPanel(개발용 플로팅)과 기능 중복 (3) dashboard 표준 3단 패턴 미준수 + CSS 모듈화 누락
- ⚠️ 모바일에서 `/dashboard/settings` 진입 불가 (desktop-only, 모바일은 Theme/Profile/Notif 화면으로 분산)

핵심 방향: **"보이지만 동작 안 하는" 토글을 줄이고**, 설정을 Supabase로 동기화하며, 중복(TweaksPanel)을 정리한다.

---

## 1. 현황 분석

### 1.1 라우트 / 컴포넌트 구조

```
app/dashboard/settings/page.tsx   ← "use client", prefetch 없음, SettingsPage 직접 import
└ src/screens/settings/SettingsPage.tsx   ← useState("profile")로 8개 탭 전환
   └ sections/{Profile,Appearance,Ledger,Notifications,Tools,Security,Data,Account}.tsx
   └ SettingRow.tsx / ToggleSwitch.tsx (도메인 전용 컴포넌트)
```

- `page.tsx`가 곧장 클라이언트 컴포넌트. 다른 도메인의 **표준 3단(RSC prefetch → *Client → *Page)** 패턴을 따르지 않음.
- 8개 탭은 라우트가 아니라 클라이언트 `useState`. URL에 탭 상태가 없어 딥링크/뒤로가기 불가.
- CLAUDE.md 라우트 표기 정정 필요: `salary/loan/cash`는 실제 별도 라우트로 **존재**하나, `settings`는 단일 라우트에서 **8개 섹션을 useState 탭**으로 전환(섹션별 하위 라우트 아님)임을 명확히 한다.

### 1.2 노출된 설정 항목과 실동작 여부

| 섹션 | 항목 | 실동작 |
|------|------|--------|
| Profile | 이름 | ✅ Supabase `updateDisplayName` |
| Profile | 이메일 / 사진 변경 | ❌ 비활성(읽기 전용) |
| Appearance | 다크모드 / 포인트컬러 / 달력표시 | ✅ localStorage(usePreferences) |
| Appearance | 기본 글꼴 / 글자 크기 | ❌ 미연결(선택해도 반영 안 됨) |
| Ledger | 월급일/유형/주기시작 | ⚠️ 일부(preferences extra 필드) |
| Ledger | 예산알림/통화/천단위/자동카테고리/정기결제 | ❌ 목업 |
| Notifications | 7개 토글 전부 | ❌ 목업(저장 안 됨) |
| Tools | 포모도로/메모 기본값 | ❌ 목업 |
| Security | 잠금/생체/2FA/비번변경 | ❌ 목업(버튼만) |
| Data | 백업/내보내기/삭제/계정삭제 | ❌ 전부 onClick 없음 |
| Account | 플랜 표시/Pro 업그레이드 | ❌ 정적 카드 |

> **8개 섹션 중 실제 저장되는 항목은 약 4개 라인뿐.** 나머지는 사용자가 토글해도 새로고침하면 사라지는 "가짜 컨트롤"이라 신뢰도를 떨어뜨린다.

### 1.3 데이터 흐름

- `usePreferences()` = Zustand + persist → **localStorage `dayflow.preferences`** 에만 저장. **Supabase 동기화 코드 없음.**
- 프로필 이름만 Supabase `auth.users` / `profiles`에 저장. `profiles` 테이블엔 이미 `theme`, `timezone`, `avatar_url` 컬럼이 있으나 **사용되지 않음**.
- `useDataModeStore`(mock/live)는 persist 안 함 → 매 부팅 시 live로 리셋.

### 1.4 TweaksPanel 중복

`app/dashboard/layout.tsx`의 플로팅 `<Tweaks>` 패널이 다크모드/포인트컬러/달력표시/모바일강제/데이터모드/로그아웃을 **Settings와 별개로** 제공. 원래 디자인/프로토타입용 개발 도구지만 프로덕션에도 상시 마운트되어 있어 **설정 진입점이 2개로 갈라진다**(같은 값을 두 군데서 토글).

### 1.5 모바일 대응

- `/dashboard/settings`는 **desktop-only**. `forceMobile` 또는 좁은 뷰포트에선 `MobileApp` 단일 렌더라 접근 불가.
- 모바일은 별도 화면으로 분산: `screens/mobile/screens/{Theme,Profile,Notifications}.tsx` (메뉴 스택 네비). **데스크톱 Settings와 항목/로직이 이원화** → 한쪽 수정이 다른 쪽에 반영 안 됨.

### 1.6 스타일

- Settings 전용 클래스가 전부 글로벌 `src/styles/pages.css`(L453~651)에 정의. **CSS Module 미이전**(Phase 4b 대상 목록에도 빠져 있음).
- `set-input`, `switch`, `timer-btn` 등 글로벌 공유 클래스에 의존.

---

## 2. 개선 항목 (현황 → 제안 → 우선순위 → 범위)

### A. 정직성: 목업 토글 정리 — **High**
- **현황**: 알림/도구/보안/데이터 섹션 토글이 저장되지 않음. 사용자가 켜도 무의미.
- **제안**: ① 단기 — 미구현 항목에 "준비 중" 뱃지/비활성 처리로 **솔직하게 표시**(가짜 동작 제거). ② 중기 — 항목별로 실제 저장 로직 연결. 한 번에 다 못 하면 **노출 자체를 줄이는 게 신뢰에 이득**.
- **범위**: `sections/{Notifications,Tools,Security,Data}.tsx` · 난이도 下(비활성화) / 中(연결).

### B. preferences Supabase 동기화 — **High**
- **현황**: 모든 환경설정이 localStorage에만. 기기/브라우저 바꾸면 초기화. `profiles.theme` 등 빈 컬럼 방치.
- **제안**: `usePreferences`에 **로그인 시 Supabase upsert + 부팅 시 머지** 추가. 비로그인은 localStorage 유지(현 동작). 충돌은 "최신 업데이트 우선" 단순 정책. `profiles`에 `preferences jsonb` 컬럼 추가 또는 기존 `theme` 컬럼 활용.
- **범위**: `src/data/preferences.ts`, `src/store/preferences.ts`, 신규 `supabase/migrations/*.sql`, mapper · 난이도 中. (데이터 레이어 변경 → `data-layer-curator`/`schema-mapper` 에이전트 적합)

### C. 계정 관리 실구현 — **High**
- **현황**: 비밀번호 변경/이메일 변경/회원 탈퇴/데이터 내보내기 모두 버튼만.
- **제안**:
  - 비밀번호 변경: Supabase `updateUser({ password })` 연결 (재인증 UX 포함).
  - 데이터 내보내기(JSON/CSV): 클라에서 도메인 데이터 조회 후 Blob 다운로드 — 서버 불필요, **가장 쉽고 가치 큰 quick win**.
  - 회원 탈퇴/전체 삭제: Supabase RPC 또는 Edge Function 필요(RLS·cascade 고려) → 신중히.
- **범위**: `sections/{Security,Data}.tsx`, `src/data/auth.ts`, (탈퇴는) Edge Function · 난이도 中~上.

### D. dashboard 패턴 일관성 — **Mid**
- **현황**: 3단 패턴 미준수, page.tsx가 클라 컴포넌트.
- **제안**: Settings는 서버 데이터 prefetch가 거의 없어 **3단 강제는 과함**. 대신 ① `SettingsClient` 경계만 도입해 컨벤션 정렬 ② 프로필 등 서버값은 RSC에서 초기 props로 내려주면 깜빡임 감소. **무리한 리팩터보다 최소 정렬 권장.**
- **범위**: `app/dashboard/settings/` · 난이도 下~中.

### E. 탭을 URL 라우트/쿼리로 — **Mid**
- **현황**: 8개 탭이 `useState` → 딥링크/뒤로가기/새로고침 시 첫 탭으로.
- **제안**: `?tab=notifications` 쿼리 또는 `settings/[section]` 라우트로 승격. 검색/딥링크 기반.
- **범위**: `SettingsPage.tsx` + `page.tsx` · 난이도 中.

### F. TweaksPanel 정리 — **Mid**
- **현황**: 개발용 플로팅 패널이 프로덕션 상시 노출 + Settings와 중복.
- **제안**: 프로덕션 빌드에서 **개발 전용 항목(데이터모드/모바일강제/authPreview)만 dev-gate**(`NODE_ENV`/플래그)로 숨기고, 사용자용(다크/액센트)은 Settings로 일원화. 중복 토글 제거.
- **범위**: `app/dashboard/layout.tsx`, `src/components/TweaksPanel.tsx` · 난이도 下.

### G. 모바일 설정 통합 — **Mid**
- **현황**: 데스크톱 Settings ↔ 모바일 Theme/Profile/Notif 이원화.
- **제안**: 공통 설정 로직(항목 정의·저장 핸들러)을 **단일 소스로 추출**해 양쪽이 공유. UI 셸만 플랫폼별로. 최소한 항목/저장 동작은 한 곳에서.
- **범위**: `src/data/preferences.ts`(로직), `screens/mobile/screens/*` · 난이도 中.

### H. 접근성 / 정보구조 / 검색 — **Low~Mid**
- **현황**: 검색 없음, 토글의 `aria-*`/포커스 상태 점검 필요, 항목 그룹핑은 양호.
- **제안**: ① 설정 검색 박스(항목 메타 배열 기반 필터) ② ToggleSwitch에 `role="switch"`/`aria-checked`/키보드 ③ 위험 영역(삭제) 시각 강조 + 확인 모달.
- **범위**: `SettingsPage.tsx`, `ToggleSwitch.tsx`, `sections/Data.tsx` · 난이도 下~中.

### I. CSS Module 이전 — **Low**
- **현황**: 글로벌 `pages.css`에 settings 클래스 집중.
- **제안**: Phase 4b 흐름에 맞춰 `SettingsPage.module.css`로 격리.
- **범위**: `pages.css`(해당 블록 추출) → `*.module.css` · 난이도 下(기계적).

### J. 문서 정합성 — **Low**
- **현황**: CLAUDE.md의 settings 라우트 설명이 모호함(섹션별 하위 라우트로 오해 가능). `salary/loan/cash`는 실제 별도 라우트로 존재.
- **제안**: `settings`는 단일 라우트 + 8섹션 useState 탭임을 명시하고, `salary/loan/cash`는 별도 라우트로 분리 표기.
- **범위**: `CLAUDE.md` · 난이도 下.

---

## 3. 실행 로드맵

### Phase 1 — 정직성 & 기반 (신뢰 회복)
> "보이는데 안 되는" 문제부터 없앤다. 가장 ROI 높음.
- **A** 목업 토글 비활성/뱃지 처리
- **C(부분)** 데이터 내보내기(JSON/CSV) quick win + 비밀번호 변경 연결
- **J** CLAUDE.md 문서 정합성 수정
- 산출물: 사용자가 만지는 모든 컨트롤이 "실제로 동작하거나, 준비 중임이 명확"

### Phase 2 — 동기화 & 계정 (실기능)
> 설정이 기기를 넘어 따라오고, 계정을 스스로 관리.
- **B** preferences Supabase 동기화 (마이그레이션 + upsert/머지)
- **C(잔여)** 회원 탈퇴/전체 삭제 (Edge Function·RLS 고려)
- **F** TweaksPanel dev-gate 정리(중복 제거)
- 산출물: 로그인하면 설정 복원, 개발 패널과 분리

### Phase 3 — 구조 & 다듬기
> 패턴/모바일/접근성 정렬.
- **D** SettingsClient 경계 + 최소 RSC 정렬
- **E** 탭 URL 라우팅
- **G** 모바일 설정 로직 단일화
- **H** 검색 + a11y + 위험영역 확인모달
- **I** CSS Module 이전
- 산출물: 컨벤션 일치, 모바일/데스크톱 일원화, 접근성 충족

---

## 4. 우선순위 매트릭스

| 항목 | 우선순위 | 난이도 | Phase |
|------|:---:|:---:|:---:|
| A 목업 토글 정리 | High | 下 | 1 |
| C 데이터 내보내기/비번변경 | High | 中 | 1 |
| B preferences Supabase 동기화 | High | 中 | 2 |
| C 회원탈퇴/삭제 | High | 上 | 2 |
| F TweaksPanel 정리 | Mid | 下 | 2 |
| D 패턴 정렬 | Mid | 下~中 | 3 |
| E 탭 URL 라우팅 | Mid | 中 | 3 |
| G 모바일 통합 | Mid | 中 | 3 |
| H 검색/a11y | Low~Mid | 下~中 | 3 |
| I CSS Module | Low | 下 | 3 |
| J 문서 수정 | Low | 下 | 1 |

---

## 5. 리스크 / 주의

- **회원 탈퇴/전체 삭제**는 비가역 + RLS/cascade 영향 → Edge Function·확인모달·재인증 필수. 별도 검토.
- **Supabase 동기화** 충돌 정책은 단순(최신 우선)하게 시작, 추후 정교화.
- 기존 localStorage 사용자 마이그레이션 경로(첫 로그인 시 로컬→서버 1회 push) 설계 필요.
- 모바일 통합은 UI 셸 차이가 커서 **로직만 공유, UI는 분리** 권장(과도한 추상화 금지).
