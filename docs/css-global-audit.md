# 글로벌 CSS 셀렉터 감사 (Phase 0 — 2026-05-08)

> 사고 사례:
>
> 1. `styles.css` 의 사이드바 `.nav { display: flex; flex-direction: column }` → 랜딩 `<nav class="nav">` 까지 column 강제. 한 줄 navbar 가 세 줄로 쌓임. (`.sidebar .nav` 로 스코프하여 픽스, 2026-05-08)
> 2. `LandingPage.tsx` 끝의 `window.Landing = Landing;` (시안 잔재) → `ReferenceError` 로 메인 깨짐. (제거, 2026-05-08)
>
> 두 사고 모두 "동일 클래스명을 다른 컨텍스트가 공유" 가 원인. CSS Modules / Tailwind 도입 전까지 **글로벌 셀렉터 namespacing** 을 강제 규칙으로 둔다.

## 감사 방법

```sh
# styles.css 가 글로벌(스코프 없이) 정의한 클래스
grep -oE '^\.[a-zA-Z][a-zA-Z0-9_-]+' src/styles/styles.css | sort -u

# landing.css 가 어디서든 참조하는 클래스 이름
grep -oE '\.[a-zA-Z][a-zA-Z0-9_-]+' src/styles/landing.css | sort -u

# 교집합 = 잠재 leak
```

## 발견된 leak 후보 (2026-05-08)

| 클래스       | styles.css 위치   | 의도                | 조치                        |
| ------------ | ----------------- | ------------------- | --------------------------- |
| `.nav`       | line 248 (사이드바 nav)        | 사이드바 스크롤 컨테이너 | `.sidebar .nav` 로 스코프 (이미 픽스) |
| `.brand-mark` | line 184          | 사이드바 로고 마크  | `.app .brand-mark` 로 스코프 |
| `.brand-mark::after` | line 199   | 사이드바 로고 점    | `.app .brand-mark::after`   |
| `.brand-name` | line 209          | 사이드바 로고 텍스트 | `.app .brand-name`          |
| `.swatch`    | line 641          | 스티커 색상 피커    | `.app .swatch` 로 스코프    |

## 위험은 낮지만 향후 정리 권장

`styles.css` 에 글로벌로 정의된 채 흔한 이름 (영향 범위가 넓을 가능성):

- `.card`, `.card-pad`, `.card-head`, `.card-title`, `.card-sub` — 대시보드 카드. 다른 컨텍스트에서 `.card` 쓰면 충돌.
- `.btn` 계열 — landing.css 에는 `.btn-primary` 등이 `.landing-root` 스코프로 있음. 다행히 styles.css 는 `.btn` 만 글로벌, 형태가 달라 시각 충돌 가능성 있음.
- `.topbar`, `.main`, `.grid`, `.section`, `.app`, `.avatar` — 흔한 이름. 신규 페이지 추가 시 주의.

→ Phase 4 (스타일 마이그레이션) 에서 CSS Modules / Tailwind 로 전환하며 자연 해소.

## 운영 규칙 (즉시 적용)

1. **`styles.css` 에 신규 글로벌 클래스 추가 금지**. 반드시 부모(`.app`, `.sidebar`, `.notes-card` 등) 로 스코프.
2. **`landing.css` 의 모든 규칙은 `.landing-root` 안에서만**. 신규 클래스도 동일.
3. PR 리뷰 시 `^\.[a-z]` 신규 라인 보이면 스코프 검토.
4. 코드리뷰: 새 클래스명을 정할 때 흔한 이름(`.nav`, `.card`, `.btn`, `.section`, `.brand`) 피하기. 페이지 prefix 권장 (예: `.ledger-card`, `.calendar-grid`).
