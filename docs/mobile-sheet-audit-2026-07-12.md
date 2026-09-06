# Mobile Bottom Sheet 사이즈/UX 감사 · 2026-07-12

> 대상: `src/screens/mobile/sheets/*` 9종 + 공용 `.dfmSheet*` CSS
> 방식: 코드/CSS 정적 리딩 (실행 없음). WLD 시안, docs 는 제외.
> 상태: 조사만. 코드/CSS 변경 없음.

## 총평

**프로필 편집 시트가 "풀스크린 모달처럼 보이는" 근본 원인은 세 가지가 겹친 결과다.**

1. **공용 `.dfmSheet` base 가 "max-height: 88%" 라는 상한만 걸어둔 컨텐트-드리븐 시트**이다. 즉 콘텐츠가 많으면 자연스럽게 88dvh 까지 자라도록 설계돼 있고, 시트마다 "이 폼은 사실 60%면 충분해요" 같은 다운사이즈 정책을 표현할 방법이 없다.
2. **EditProfileSheet 본체가 필요 이상으로 무겁다** — 실제로 편집할 값은 `name` 하나(handle/bio/emoji 는 저장 로직 없음: `onSave(name)` 만 호출) 인데, 88px 아바타 프리뷰 + 8개 이모지 프리셋 + fake 사용자명(handle) + fake 소개(bio) + 이메일 read-only 카드 + 취소/저장 버튼까지 얹혀 있어 콘텐츠 높이가 ~650px 에 달한다. 폰 뷰포트 (~700–800dvh) 에서 88% 상한에 쉽게 걸리며, 실질적으로 뒤 배경이 거의 안 보이는 풀스크린이 된다.
3. **닫기 UX 가 부실**하다 — 드래그 스와이프 없음, ESC 없음, 백드롭 탭만. 그립(grip) 은 순수 장식이라 유저 입장에서 "이거 그냥 fullscreen 페이지구나" 인상이 강해진다.

**확산도**: 프로필 편집이 가장 대표적이지만, 유사 성격(=콘텐츠가 88% 상한을 채우는) 시트가 **4개 더 존재**한다: AddTxnSheet, AddEventSheet, AddSubSheet, TimerSettingsSheet. Upgrade/Search 는 스스로 `92vh|92dvh` 인라인 override 로 의도적 풀시트라 별개다. 감사 대상 9개 중 6개(≈67%) 가 크기/UX 정책에 손댈 여지가 있다.

---

## 감사표

콘텐츠 높이(=Estimate)는 실제 필드 + 헤더/버튼 padding 합산. 폰 뷰포트 700–800dvh 기준.

| #   | Sheet                   | 파일                                             | 트리거                                                             | 실제 필수 필드                                                                         | 현재 높이 정책                                                         | 콘텐츠 est.                 | 문제                                                                                                                                                                                                                                                                                                    | 우선순위                                    | 개선 카테고리                                                                 |
| --- | ----------------------- | ------------------------------------------------ | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------- |
| 1   | **EditProfileSheet**    | `src/screens/mobile/sheets/EditProfileSheet.tsx` | `screens/mobile/screens/Profile.tsx` 헤더 편집 버튼 + "이메일" Row | **1개 (name)**. handle/bio/emoji 는 저장되지 않는 fake 필드                            | `.dfmSheet` 기본 = max-height 88%                                      | ~650px                      | 저장되는 필드는 name 뿐인데 88px 아바타 + 8개 프리셋 + fake 3필드로 88dvh 를 다 채움                                                                                                                                                                                                                    | **High**                                    | **A + B**: fake 필드 제거하고 60dvh 상한. 궁극적으로는 인라인 편집(B) 도 가능 |
| 2   | **ChangePasswordSheet** | `.../ChangePasswordSheet.tsx`                    | `Profile.tsx` "비밀번호 변경" Row                                  | **0개 (확인만)**. step0=이메일 확인 → 재설정 링크 발송, step1=완료 확인                | `.dfmSheet` 기본 = 88%                                                 | step0 ~470px / step1 ~520px | 입력이 0개인 확인/안내 화면인데 시트 상한이 콘텐츠보다 훨씬 크게 잡혀 있어 실제 콘텐츠 위 아래로 여백이 뜨거나(내용 짧을 때) 세로로 커 보임. supabase 실호출도 아니라 목업 상태.                                                                                                                        | **High**                                    | **A + D**: `max-height: fit-content` 또는 `max-height: 55dvh` 로 자동 축소    |
| 3   | **AddTxnSheet**         | `.../AddTxnSheet.tsx`                            | `MobileApp` FAB (홈/가계부 탭)                                     | 5개 (type, amount, cat, name, method). 저장 로직은 아직 `onClose` 만 호출 = **미완성** | `.dfmSheet` 기본 = 88%                                                 | ~600px                      | 콘텐츠 자체는 정당한 밀도. 다만 저장이 안 되고 있는 것과, 88% 시트 하나로 처리 vs 스냅 포인트 도입 여지                                                                                                                                                                                                 | Mid                                         | **C**: medium(60%)/large(88%) 스냅. 금액 입력 시만 확장                       |
| 4   | **AddEventSheet**       | `.../AddEventSheet.tsx`                          | FAB (캘린더 탭)                                                    | 6~7개 (quick 자연어, title, date, allDay, start/end, cat, loc)                         | `.dfmSheet` 기본 = 88%                                                 | ~700px+                     | 밀도는 정당함(캘린더 이벤트). 다만 quick 파서와 폼이 함께 있어 세로가 길다                                                                                                                                                                                                                              | Mid                                         | **C**: 스냅 포인트. 초기엔 quick 입력만 medium, 폼 펼치면 large               |
| 5   | **AddSubSheet**         | `.../AddSubSheet.tsx`                            | FAB (메뉴 > 구독), Subscriptions 추가                              | 6개 (name, price, cycle, cat, day slider, method) + preset chip rail                   | `.dfmSheet` 기본 = 88%                                                 | ~660px                      | 밀도 정당. **[중대 UX 결함]** 결제일이 `<input type="range" min=1 max=31>` 연속 슬라이더 → 31스텝 트랙 (~344px 폭 기준 한 스텝 ≈ 11px, 손가락 pad ≈ 24–28px) 이라 10↔11↔12일 구분이 물리적으로 불가능. 다른 필드는 모두 chip/text 인데 결제일만 연속 슬라이더로 톤·언어도 이탈. + slider 세로 여백 낭비 | **High↑** (기존 Mid → 사용자 리포트로 승격) | **C**(그리드 우선) or **A**(숫자 인풋) — 아래 "결제일 컨트롤 개선안" 참조     |
| 6   | **TimerSettingsSheet**  | `.../TimerSettingsSheet.tsx`                     | `screens/home/timers/*` 설정 아이콘                                | 5개 chip-group + 2 toggle                                                              | `.dfmSheet` 기본 = 88%                                                 | ~750px                      | 콘텐츠가 실제로 크다. 88% 정당. 스크롤 필요                                                                                                                                                                                                                                                             | Low                                         | 유지. (선택) `role="dialog"` 만 보강                                          |
| 7   | **UpgradeSheet**        | `.../UpgradeSheet.tsx`                           | `Profile.tsx` "Pro 로 업그레이드" 배너, `useCheckout` 노출 시점    | 결제 CTA (플랜 2택1)                                                                   | **인라인 override**: `style={{ height: "92vh", maxHeight: "92vh" }}`   | ~800px                      | 상업적 upsell 이라 풀시트 정당. 다만 `vh` 사용 = iOS Safari 하단바 겹칩 위험. `dvh` 로 통일 필요                                                                                                                                                                                                        | Low                                         | **D**: `.dfmSheetXL` 모디파이어로 이관, `dvh` 로 통일                         |
| 8   | **SearchSheet**         | `.../SearchSheet.tsx`                            | 상단 검색 아이콘 (`MobileApp.tsx` 179)                             | 검색 입력 + 코퍼스 그리드                                                              | **인라인 override**: `style={{ height: "92dvh", maxHeight: "92dvh" }}` | full                        | 검색은 풀시트 정당                                                                                                                                                                                                                                                                                      | Low                                         | **D**: `.dfmSheetXL` 로 이관                                                  |
| 9   | **ReceiptSheet**        | `.../ReceiptSheet.tsx`                           | 가계부 거래 클릭 (`TxnDetailBridge`)                               | 영수증 조회 + 메모 + 태그 + 사진                                                       | `.dfmSheet` 기본 = 88%                                                 | 가변                        | 영수증 특성상 길어질 수 있음. 정당                                                                                                                                                                                                                                                                      | Low                                         | 유지                                                                          |

### 참고: 시트별 공통 UX 항목

| 항목                                                  | 상태                                                                                                                                                                                                                    |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 드래그 스와이프-다운 닫기                             | **X (전체 없음)** — 그립(`.dfmSheetGrip`) 은 순수 시각 표시. onTouch 핸들러 없음                                                                                                                                        |
| 백드롭 탭 닫기                                        | O (`.dfmSheetScrim onClick={onClose}`)                                                                                                                                                                                  |
| 명시적 X 버튼                                         | 일부 O. 단, **EditProfile / ChangePassword / AddEvent / AddSub / AddTxn / Upgrade 는 `<Ico name="plus">` 를 X 로 오용** (rotate 없음 → 실제로 `+` 로 렌더링). ReceiptSheet / TimerSettingsSheet 만 SVG X path 직렬 삽입 |
| ESC 키 지원                                           | **X (전체 없음)**                                                                                                                                                                                                       |
| Focus trap                                            | **X (전체 없음)**                                                                                                                                                                                                       |
| `role="dialog"` / `aria-labelledby`                   | **X (전체 없음)**. `role="presentation"` 만 scrim 에 부착                                                                                                                                                               |
| Autofocus (첫 인풋)                                   | SearchSheet 만 O (검색 input 80ms 후 focus). 나머지 X                                                                                                                                                                   |
| 스냅 포인트                                           | **X (전체 없음)** — 모두 열림/닫힘 이진                                                                                                                                                                                 |
| 스와이프 인터랙션 방지(input scroll vs sheet dismiss) | 해당 없음(swipe close 자체가 없어서)                                                                                                                                                                                    |
| 다크 모드                                             | 공용 `.dfmSheet` 에서 배경만 `#1a1812` 처리, 내부 컴포넌트 각자 인라인 스타일 사용                                                                                                                                      |
| 키보드(virtual) 대응                                  | 미대응. `viewport-fit=cover` 만 걸려 있고 `interactive-widget=resizes-content` 는 미설정 (`app/layout.tsx:72` viewport export). 인풋 포커스 시 iOS Safari 는 페이지 자체를 밀어올림 → 시트가 잘리는 케이스 발생 가능    |
| PC 모달과 로직 공유                                   | **X**. 모바일 전용 컴포넌트. 데스크톱 대응 모달(예: TxnModal, EventModal) 과 별개 구현                                                                                                                                  |

---

## 공통 근본 원인

### (1) `.dfmSheet` base 스타일이 "상한만" 표현한다

`src/screens/mobile/mobile.module.css:1347` 근처.

```css
.dfmSheet {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  background: #f5ecd2;
  border-radius: 22px 22px 0 0;
  transform: translateY(100%);
  transition: transform 0.28s cubic-bezier(...);
  max-height: 88%;        /* ← 유일한 크기 정책 */
  display: flex;
  flex-direction: column;
  ...
}
```

- `height`/`min-height`/`max-height: fit-content` 같은 "자연스러운 축소" 힌트가 없다. 콘텐츠가 짧으면 짧게 보이긴 하지만, 콘텐츠가 조금만 길면 (>= 88% viewport) 곧바로 풀시트가 된다.
- 즉 "짧은 폼이면 절반만 덮이게" 를 표현하려면 **각 시트가 개별적으로 max-height 를 override 해야** 하는데 그런 컨벤션이 정립돼 있지 않다.
- 실제로 override 하는 시트는 Search/Upgrade 둘뿐이고, 둘 다 **인라인 style** 로 넣는다 (`style={{ height:"92vh", maxHeight:"92vh" }}`, `style={{ height:"92dvh", ... }}`). vh/dvh 도 섞여 있다.

### (2) 콘텐츠가 "실사용 필드 수" 대비 크게 부풀려져 있다 — 특히 EditProfileSheet

`EditProfileSheet.tsx` 의 실제 저장 로직(313 라인 중)은 라인 293 `onSave?.(name.trim() || initialName)` 하나. 즉 **모바일 프로필 편집에서 서버로 나가는 값은 이름 하나뿐이다.** 그런데 UI 는:

- 88×88 아바타 preview + 8개 이모지 preset 버튼 (~162px)
- 사용자명 handle 입력 (~85px) — 저장 안 됨
- 이메일 read-only pill (~85px)
- 한 줄 소개 textarea + 카운터 (~95px) — 저장 안 됨

로 구성돼 name 하나 편집에 뷰포트의 80~90% 를 소비한다. 사용자가 "이거 왜 풀스크린이지?" 하는 인상의 근본 원인.

### (3) 닫기·접근성 원시성

- 그립 UI 는 있으나 스와이프 제스처 미구현 → 사용자가 그립을 잡고 아래로 끌어도 반응 없음 (기대 위반).
- ESC 미지원 → PC 데스크톱에서 모바일 프리뷰 중일 때도 키보드 닫기 불가.
- `role="dialog"` 미부착 → 스크린리더가 "다이얼로그가 열렸다" 를 인식하지 못하고 배경 콘텐츠에 계속 접근 가능. 포커스 트랩도 없어 Tab 이 배경 요소로 넘어감.

### (4) 닫기 아이콘 오용

EditProfile · ChangePassword · AddEvent · AddSub · AddTxn · Upgrade 6개 시트가 `<Ico name="plus" size={18} />` 를 닫기 버튼에 넣는다. `Ico.tsx:51-55` 의 `plus` 는 `d="M12 5v14M5 12h14"` 로 그냥 `+`. rotate 45deg 처리 CSS 도 없다. 즉 화면에는 실제로 "＋" 가 렌더링되어 "닫기" 시맨틱이 흐트러진다. ReceiptSheet(75) / TimerSettingsSheet(80) 만 인라인 SVG 로 실제 `×` 를 그린다.

### (5) 시트가 `.dfm` 앱 셸(=phone frame) 내부에 배치된다

`.dfm { position: relative; overflow: hidden; }` 안에서 시트가 `position: absolute` 로 뜬다. 실기기(모바일 사파리) 에선 `.dfm` 이 뷰포트 전체이므로 시트 = 전체 화면 하단이 되지만, **desktop 프리뷰(PC 창의 phone 프레임 안)** 에서는 프레임이 실제로 뷰포트만큼 크지 않아 88% 상한이 phone frame 대비 88% 가 된다. 이건 문제 자체는 아니지만 스냅 포인트 도입 시 계산 기준이 애매해질 수 있다.

---

## 결제일 컨트롤 개선안 (AddSubSheet · 사용자 리포트 대응)

### 현황 재확인

`src/screens/mobile/sheets/AddSubSheet.tsx:320-327`

```tsx
<input
  type="range"
  min="1"
  max="31"
  value={day}
  onChange={(e) => setDay(Number(e.target.value))}
  style={{ width: "100%", accentColor: "var(--ink)" }}
/>
```

- 네이티브 `<input type="range">` 를 그대로 사용. tick(눈금) 없음, step 표시 없음, haptic 없음, 스냅 애니메이션 없음, 커스텀 thumb 크기 지정 없음(브라우저 기본 ≈ 18–28px).
- `.dfmSheetBody` 가로 내폭 ≈ 344px(phone frame 380 − padding 36) → 31 스텝 트랙에서 **한 스텝 ≈ 11.1px**. iOS 손가락 pad median ≈ 24–28px (Apple HIG). **한 번의 터치가 2–3일을 동시에 덮는다.**
- 값 표시는 상단 우측 `매월 {day}일` 텍스트 하나뿐 → 손을 뗀 뒤에야 자신이 몇 일을 골랐는지 확인. 시각적 피드백 부족.
- **UX 언어 일관성 이탈**: 같은 시트에서
  - price → text input + numeric inputMode
  - cycle → segmented button (월/년)
  - cat → chip pill (엔터/업무/유틸/기타)
  - method → chip button 4택
  - preset → chip rail
    결제일**만** 연속 슬라이더. 다른 컨트롤은 모두 "탭 = 선택 확정" 이산 언어인데 결제일만 "쓸어 넘기며 조준" 아날로그 언어.

### 옵션 비교

| 옵션                            | 방식                                                                                                                                     | 장점                                                                                                                                             | 단점                                                                                                                                                                                                            | Dayflow 적합도                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **A. 숫자 인풋**                | `<input type="number" inputMode="numeric" min=1 max=31>` (+ 좌우 스텝퍼 버튼)                                                            | 구현 15분. 정확한 값. tap-to-focus 로 즉시 재입력. min/max 검증 무료.                                                                            | iOS 숫자 키패드 열리며 하단 절반 차지 → 시트 리사이즈 필요. 스텝퍼(± 버튼)까지 붙이면 tap target 2개 늘어 세로 소모. `interactive-widget=resizes-content` 미설정이라 현 상태 그대로면 인풋이 키보드 뒤로 사라짐 | ★★★☆ (키보드 이슈 선결 필요)               |
| **B. 스크롤 휠 피커**           | iOS DatePicker 스타일 세로 휠 (1→31 무한 스크롤). 예: react-mobile-picker, react-ios-picker                                              | 모바일 관용, 감성 좋음. 손가락 flick 한 번에 큰 이동.                                                                                            | 라이브러리 의존 (+8–15KB gz) 또는 자작 시 IntersectionObserver + snap CSS 로 구현 복잡. 접근성 취약(screen reader 어색). PC 프리뷰에서 mouse wheel 과 충돌. dark 대응 별도.                                     | ★★☆☆ (톤 매치는 좋으나 비용/접근성 리스크) |
| **C. 인라인 7×5 그리드 (1–31)** | chip button 31개를 7열 × 5행(마지막 행 3칸)으로 배열. 선택된 날짜만 강조. cat/pay chip 과 같은 스타일 재사용                             | 한 번의 탭으로 확정. 키보드 안 열림. 모든 값이 항상 보임 → "27일 vs 28일" 헷갈릴 여지 0. 기존 chip 언어와 동일. 접근성(각 `<button>`) 자연 획득. | 세로 ≈ 170–200px 소모 (chip 32px + gap 6px × 5행 ≈ 190). "말일(28~31)" 처리 UX 필요 — 2월 29 이후 없는 달 대응. 그리드가 심리적으로 "달력 아님?" 인지혼동 있을 수 있음(달력은 요일 헤더가 있음)                 | ★★★★ (톤·간결·접근성 모두 부합)            |
| **D. 슬라이더 유지 + 개선**     | 현행 range 유지 + `<datalist>` 로 5·10·15·20·25·말일 눈금 + 대형 thumb (touch-action) + iOS haptic (`navigator.vibrate` 는 안드로이드만) | 구현 최소. 파일 diff 짧음.                                                                                                                       | 근본 문제(11px 스텝 폭) 해결 X — 눈금이 있어도 여전히 10↔11 은 정밀 조준. iOS 는 `navigator.vibrate` 미지원 → haptic 사실상 안드로이드 전용. 접근성 개선 없음                                                   | ★☆☆☆ (밴드에이드)                          |

### 시니어 관점 권장: **C (인라인 7×5 그리드)**

이유 세 가지:

1. **컨트롤 언어 통일**. 같은 시트의 cat/pay/preset 이 모두 chip pill 이라, 결제일도 chip 이면 "이 필드는 tap 으로 고르는 것" 이라는 학습이 이미 되어 있다. 슬라이더 하나만 이질적이던 것이 해소된다.
2. **한국 모바일 앱 관용에 부합**. 뱅크샐러드/토스뱅크의 자동이체 등록, 카카오뱅크 정기결제, 왓섭·서브샵 같은 구독 관리 앱 대부분 **캘린더 스타일 그리드 또는 스크롤 휠**로 결제일을 고른다. 슬라이더는 사실상 사례가 없다. 그리드는 사용자의 "결제일 = 달력 위 한 점" 이라는 멘탈모델과도 자연 정렬한다.
3. **접근성 무료 획득**. 31개 `<button>` 각각이 tab/screen reader 로 접근 가능. 슬라이더는 `role="slider"` + aria-valuenow 를 얹어도 KoreanTalkBack 에서 값 낭독이 매끄럽지 않다.

**"말일(28–31)" 처리**: 그리드 하단에 `말일 자동 조정` 토글 하나 추가 — 켜면 실제 매월 마지막 날로 자동 shift (2월=28, 4월=30 등). 도메인 저장 값은 그대로 두고 렌더 시점에만 clamp. 이 토글이 슬라이더에는 붙일 자리도 없었다는 점이 그리드의 부수 이득.

**대안 조합**: 세로 여백이 정말 부담이면 **C의 그리드를 팝오버**로 (`매월 __일` 라벨 tap → 그리드 오픈, 선택 시 자동 닫힘). 시트 base 는 짧아지고 그리드 세로 190px 은 온디맨드. 단 tap 한 번이 추가된다 → 초심자에겐 그리드 인라인이 더 명확.

**실행 스케치**:

- `AddSubSheet.tsx` 292–328 (billing day 블록) 을 chip grid 로 교체.
- 스타일은 이미 있는 `cats.map` chip 패턴 재사용 (padding 축소, width 고정).
- `day` state 는 그대로 `number` 유지 — 데이터 스키마 변경 없음.
- Phase 1 range 로 커밋 가능. 라이브러리 무증가.

---

## 개선 로드맵

### Phase 1 — Quick win (짧게, 이번 sprint 내)

1. **EditProfileSheet 축소** (사용자 리포트 즉시 대응)
   - fake 필드(handle, bio, emoji preset) 를 제거하거나, "곧 지원" placeholder 로 분리.
   - `.dfmSheet` 위에 `styles.dfmSheetCompact` 모디파이어 추가 (`max-height: 60dvh; height: fit-content`) 를 붙여 짧은 폼 전용 시트로 명시.
   - 이름 변경만 남기면 실질적으로 인풋 1개 → 시트 대신 **인라인 편집** 도 검토 가능(카테고리 B). ProfileScreen 의 hero 카드 내부에서 pencil 아이콘 → inline input 으로 대체.

2. **ChangePasswordSheet 축소**
   - 실제 supabase `resetPasswordForEmail` 배선 여부 확인 (현재 목업). 배선까지의 임시 UI 라도 `.dfmSheetCompact` 로 55dvh 상한 걸어 시각적으로 "안내 카드" 처럼 보이게.

3. **X 아이콘 통일**
   - `Ico.tsx` 에 `close` (`d="M6 6l12 12M18 6L6 18"`) 신설 → 6개 시트의 `<Ico name="plus">` → `<Ico name="close">` 로 교체. 그래픽 언어와 시맨틱 일치.

4. **Upgrade `92vh` → `92dvh` 단위 통일** (iOS 하단바 이슈 예방)

5. **AddSubSheet 결제일 컨트롤 교체 (슬라이더 → 7×5 그리드)** — 사용자 리포트 즉시 대응
   - 위 "결제일 컨트롤 개선안 · 옵션 C" 채택.
   - 범위: `AddSubSheet.tsx` 292–328 라인만 수정 (day state/스키마 무변경).
   - 부가: `말일 자동 조정` 토글은 Phase 1 에선 skip, 우선 1–31 chip 그리드만 도입 → 후속 sprint 에서 토글 추가.
   - 회귀 위험 낮음 (컴포넌트 격리, 라이브러리 무증가).

### Phase 2 — 시스템 개선 (다음 sprint)

5. **`.dfmSheet` 공용 모디파이어 확립** (카테고리 D)
   - `.dfmSheet`: 기본은 유지 (콘텐츠 드리븐 + max 88dvh).
   - `.dfmSheetCompact`: `max-height: 55dvh` — 확인/안내/짧은 폼.
   - `.dfmSheetXL`: `height: 92dvh; max-height: 92dvh` — Search/Upgrade 인라인 스타일 대체.
   - 다크 모드/`padding-bottom: var(--dfm-safe-bottom)` 승계.

6. **스냅 포인트 도입** (카테고리 C) — AddTxnSheet / AddEventSheet / AddSubSheet
   - `medium (60dvh)` / `large (88dvh)` 두 스냅. 그립 드래그 or 첫 인풋 포커스 시 large 로 승격.
   - `useSheetSnap` 훅 하나로 통합 (JS 애니메이션 or CSS var 로 transform 위치 제어).

7. **접근성 & 인터랙션**
   - `useSheet(open, onClose)` 커스텀 훅으로 통합:
     - `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (시트 head 의 `.ttl` id 연결)
     - ESC 키 리스너 (`document.addEventListener('keydown', ...)`)
     - Focus trap (`inert` on background 또는 tab loop)
     - 스와이프-다운 close 제스처 (grip 영역에서 pointerdown → translateY 추적 → 임계값 초과 시 onClose)
     - 열림 시 첫 focusable 자동 포커스 (선택적)

8. **키보드 대응**
   - `app/layout.tsx` viewport export 에 `interactiveWidget: "resizes-content"` 추가 (Next.js 16 지원). 이러면 시트가 절대 위치임에도 뷰포트가 축소돼 시트 내부 스크롤로 인풋이 자연스럽게 노출됨.

---

## 다음 sprint 착수 Top 3 (2026-07-12 재정렬)

> 재정렬 근거: 사용자 리포트 (AddSubSheet 결제일 슬라이더) 가 추가되어 3번 슬롯 후보가 (a) 결제일 그리드 교체 (b) 공용 close 아이콘 + 접근성 최소 세트 로 경합. **결제일 문제는 "정확한 값 선택 불가 = 데이터 오입력 = 도메인(가계부/구독) 신뢰 훼손"** 인 반면 close 아이콘은 시맨틱 결함이나 유저는 이미 백드롭 탭으로 우회 가능. → 결제일 그리드를 3번으로 승격, 공용 close/접근성은 4번으로 강등.

1. **[High] EditProfileSheet: fake 필드 제거 + `.dfmSheetCompact` 도입**
   - 사용자가 즉시 체감. 근본 원인 (1)(2) 를 한 방에 해결.
   - 산출물: `mobile.module.css` 에 modifier 추가, EditProfile 파일에서 handle/bio/emoji 블록 삭제, className `${styles.dfmSheet} ${styles.dfmSheetCompact}` 로 변경.

2. **[High] ChangePasswordSheet: `.dfmSheetCompact` 재사용 + supabase 실배선 확인/배선**
   - 같은 modifier 재사용이라 1번 세트로 처리하면 비용 저렴.
   - 부가 작업: `signUpAction` 옆에 `sendPasswordResetAction` 존재 여부 확인 (`app/(auth)/_actions.ts`) 후 wire.

3. **[High] AddSubSheet 결제일: range 슬라이더 → 인라인 7×5 chip 그리드** (신규, 승격)
   - 슬라이더 한 스텝 ≈ 11px vs 손가락 pad ≈ 24–28px = 정확 선택 물리적 불가.
   - 같은 시트의 cat/pay chip 스타일 그대로 재사용 → 시각 언어 통일, 세로도 오히려 소폭 절약.
   - 스키마 무변경. `말일 자동 조정` 토글은 Phase 2 로 이월.
   - 부수 효과: 구독 도메인 데이터 정확도 향상 → MoneyFlow/Ledger 프리뷰 신뢰도.

4. **[Mid] 공용 close 아이콘 + 접근성 최소 세트** (기존 3번에서 강등)
   - `Ico.tsx` 에 `close` 추가, 6개 시트 교체.
   - 최소 `role="dialog"`, `aria-labelledby`, ESC handler 만이라도 공용 훅으로 도입. Focus trap / 스와이프 다운은 후속 sprint 로.

---

## 부록: 근거 파일 & 라인

- 공용 시트 CSS base: `src/screens/mobile/mobile.module.css` — `.dfmSheetScrim` 라인 ~1334, `.dfmSheet` 라인 ~1347–1364 (`max-height: 88%` 여기), `.dfmSheetHead` ~1376, `.dfmSheetBody` ~1401
- EditProfileSheet: `src/screens/mobile/sheets/EditProfileSheet.tsx` — 저장 로직 293 라인 (`onSave?.(name.trim() || initialName)` — name 만)
- ChangePasswordSheet: `src/screens/mobile/sheets/ChangePasswordSheet.tsx` — 목업 send/resend (26–38)
- Profile 진입: `src/screens/mobile/screens/Profile.tsx` — 편집 버튼 113 (`setEditOpen(true)`), 비번 변경 289 (`setPwOpen(true)`)
- 인라인 92vh/92dvh: `UpgradeSheet.tsx:71`, `SearchSheet.tsx:255`
- AddSubSheet 결제일 슬라이더: `src/screens/mobile/sheets/AddSubSheet.tsx:320-327` (`<input type="range" min="1" max="31" style={{ width: "100%", accentColor: "var(--ink)" }} />`, tick/step/haptic 전무)
- AddSubSheet 다른 컨트롤 언어 대비: price(text+numeric) 142–155, cycle(segmented) 217–237, cat(chip pill) 258–288, method(chip 4택) 343–362 — **모두 이산 tap, 결제일만 연속 슬라이더**
- close 아이콘 오용: 6곳 (`EditProfileSheet.tsx:36`, `ChangePasswordSheet.tsx:54`, `AddEventSheet.tsx:84`, `AddSubSheet.tsx:65`, `AddTxnSheet.tsx:34`, `UpgradeSheet.tsx:82`)
- Ico plus path: `src/screens/mobile/shared/Ico.tsx:51-55`
- 시트 마운트 지점 (Profile 제외): `src/screens/mobile/MobileApp.tsx:238–259`
- 시트 마운트 지점 (Profile 내): `src/screens/mobile/screens/Profile.tsx:365–379`
- Viewport meta: `app/layout.tsx:72` viewport export (interactive-widget 미설정)

---

## 진행 기록 (Phase 2 → Phase 3)

> Viewport meta 는 이후 `interactiveWidget: "resizes-content"` 로 이미 설정됨 (스프린트 2). 위 "미설정" 표기는 감사 시점 기준.

### Phase 1 (완료 · c5519d3)

fake 필드 제거·`.dfmSheetCompact`·`Ico close`·`role="dialog"`/`aria-modal`. 결제일 슬라이더 → 7×5 그리드(#29 에서 radiogroup 접근성 + 44px 보강).

### Phase 2 (완료 · #30)

공용 `useSheet` 훅으로 통합: 스냅 포인트(medium/large, Add\* 폼 3종)·focus trap·swipe-down close. legacy close 아이콘 스윕(Receipt/Timer SVG → `Ico close`). AddSubSheet 칩 44px. 키보드는 `resizes-content` 체인으로 이미 대응(패딩 불요).

### Phase 3 (완료)

- **배경 `inert`**: 시트 열림 시 형제 배경 요소(자신/스크림 제외)에 `inert` → SR/포커스 완전 격리. `useSheet` 내 자기완결(MobileApp/Profile 무수정).
- **`.dfmChip` 44px**: Ledger 필터 레일도 시트 폼 칩과 접근성 통일.
- **`useSheet` 최적화**: `onClose` latest-ref 안정화(드래그 중 리스너 churn 제거) + 불필요한 `useCallback` 제거.
- **스냅 확대 검토 → 확대 안 함(결정)**: compact 시트(EditProfile/ChangePassword)는 이미 60% 고정이라 스냅 무의미, XL 시트(Search/Upgrade)는 의도적 풀시트라 스냅이 목적과 상충, TimerSettings 는 콘텐츠가 실제로 커서 medium 이 설정을 가림, Receipt 는 읽기용 상세라 medium peek 가치 낮음 + 가변 높이라 어색. → 스냅은 Add(Txn/Event/Sub) 3종 유지가 적정.

### 남은 항목 (Phase 4 후보)

- **실단말 키보드 QA 필요**: `resizes-content` 체인은 코드상 완결(dvh 축소 → `.dfm` flex → 시트 상승)이나, 시뮬레이터/데스크톱 프리뷰로는 iOS 가상 키보드 리사이즈를 재현 못 함. **실기기(iPhone Safari, Android Chrome)에서 각 폼 시트 인풋 포커스 시 시트가 키보드 위로 밀리는지 육안 확인 필요.** pre-iOS-16.4(interactive-widget 미지원)는 키보드가 오버레이될 수 있음 — 필요 시 fallback 별도 검토.
- **`inert` Profile 상단바 엣지**: Profile 화면의 시트는 Profile `<div>` 형제만 inert → 그 바깥 `dfmTop`/`dfmTabbar` 는 비-inert(스크림이 pointer 는 차단). Profile 은 메뉴 서브스크린이라 실害 낮으나, 완전 격리하려면 호스트 레벨 inert 로 확장 검토.
