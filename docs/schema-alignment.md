# Schema 정합성 — 도메인 타입 ↔ Supabase 스키마

> **원칙**: DB가 정답(Source of Truth). 도메인 타입은 DB 스키마의 부분집합이거나 매핑 가능한 형태여야 한다.
>
> **분류**:
> - **A** — DB에 없는데 영속이 필요한 필드: 마이그레이션으로 컬럼 추가
> - **B** — 표시·파생 필드: 도메인 타입에서 제거하고 selector로 derive
> - **C** — 이름/표현만 다름: mapper 한 곳에서 변환 (예: `'월'` ↔ `'monthly'`)

---

## 1. transactions

| 도메인 (`Txn`) | DB (`transactions`) | 처리 |
|---|---|---|
| `id` | `id uuid` | C — string으로 통일 |
| `date: "YYYY-MM-DD"` + `time?: "HH:MM"` | `occurred_at timestamptz` | C — mapper에서 분해/조합 |
| `type: 'in'\|'out'` | `kind: 'income'\|'expense'\|'transfer'` | C — 어휘 변환 (transfer는 추후) |
| `cat: '식비'` | `category_id` → join `categories.name` | C — mapper join |
| `pay: '신한카드'` | `account_id` → join `accounts.name` | C — mapper join |
| `label`, `note` | `memo`, (없음) | A — `description` 컬럼 추가 또는 도메인에서 통합 |
| `icon: 'coffee'` | (없음) | **B — `inferIcon(txn)`** (cat/label 기반) |
| `payday: true` | (없음) | **B — `inferPayday(txn)`** (kind+label) |
| `amount` | `amount numeric(14,2)` | OK |

## 2. subscriptions

| 도메인 (`Subscription`) | DB (`subscriptions`) | 처리 |
|---|---|---|
| `cycle: '월'\|'년'` | `cycle: 'monthly'\|'yearly'\|'weekly'` | C — mapper |
| `next: "11.07"` (display) | `next_billing_at: date` | **B — `formatNextBilling(date)`** |
| `day: 7` | (`next_billing_at`에서 derive) | B |
| `status: 'active'\|'paused'` | `active boolean` | C — boolean ↔ 문자열 |
| `cat: '엔터테인먼트'` | `category_id` → join | C |
| `color: '#e25c4d'` | (없음) | **B — `subscriptionColor(sub, cat)`** (카테고리 색에서) |
| `initial: 'N'` | (없음) | **B — `name[0].toUpperCase()`** |
| `started: '2023.05'` | `created_at` | **B — `formatStarted(created_at)`** |

## 3. memos / notes

| 도메인 (`MemoDoc`) | DB (`notes`) | 처리 |
|---|---|---|
| `title`, `body`, `tags` | `title`, `body`, `tags text[]` | OK |
| `pinned` | `pinned boolean` | OK |
| `folder: 'work'\|...` | (없음) | **A — `folder text` 컬럼 추가** |
| `starred` | (없음) | **A — `starred boolean` 추가** |
| `excerpt`, `word: 612` | (없음) | **B — `body`에서 derive** |
| `updated: '오늘 오후 2:14'` | `updated_at timestamptz` | **B — `getRelativeDateLabel(updated_at)`** |

## 4. sticky_notes

| 도메인 (`StickyNote`) | DB (`sticky_notes`) | 처리 |
|---|---|---|
| `color`, `position` | `color`, `position` | OK |
| `title`, `text` | `title`, `body` | C — `text ↔ body` |
| `emoji` | (없음) | **A — `emoji text` 컬럼 추가** |
| `date: '오늘'` (display) | `updated_at` | **B — `getRelativeDateLabel`** |
| `author: '나'` (display) | (`profiles.display_name`에서 derive) | **B** |

## 5. checklist / daily_log / pinned_info

크게 어긋나는 곳 없음. checklist의 `time: '오전 10:00'`은 `due_at timestamptz`에서 포맷 derive (B).

---

## 적용 작업

### Phase 4a — 지금 가능 (Supabase 없어도 ship 가능)

- [ ] `src/data/selectors/derived.ts` 신설 — `inferIcon`, `inferPayday`, `subscriptionColor`, `subscriptionInitial`, `formatNextBilling`, `formatStarted`, `memoExcerpt`, `memoWordCount`, `memoUpdatedLabel`, `stickyDateLabel`
- [ ] 컴포넌트가 `txn.icon` 같이 직접 참조하던 곳을 `inferIcon(txn)` 호출로 교체
- [ ] 도메인 타입은 일단 유지 (선택 필드). seed에 채워진 값이 있으면 selector가 우선 사용, 없으면 derive

### Phase 4b — Supabase 도입 후

- [ ] `0008_schema_alignment.sql` — A 카테고리 컬럼 추가 (notes.folder, notes.starred, sticky_notes.emoji, transactions.description)
- [ ] `src/data/source/mappers/*.ts` — DB row ↔ 도메인 변환 (C 카테고리 처리)
- [ ] 도메인 타입에서 B 필드 제거 (`Txn.icon`, `Subscription.color/initial/next/started`, `MemoDoc.excerpt/word/updated`, `StickyNote.date/author`)

---

## 결정 필요

1. `Txn.label` vs `Txn.note` — DB는 `memo` 한 컬럼만. 두 필드를 어떻게 나눌까?
   - 권장: `description: text not null` 추가 → `label`이 description, `note`는 `memo`로
2. `transactions.kind = 'transfer'` — 도메인 `Txn.type`에 추가할지? (현재 `'in'|'out'`만)
   - 권장: 일단 transfer 미사용. UI 추가 시 도메인 확장
