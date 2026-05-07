# Supabase live 모드 E2E 검증 체크리스트

> Phase S2 작업용. 각 항목은 브라우저에서 직접 확인 후 결과 메모.
> 발견된 문제는 [src/data/source/supabase.ts](../src/data/source/supabase.ts) 또는 매퍼에서 수정.

## 사전 준비

1. `npm run dev`
2. 트윅 패널 → 데이터 모드 = **데모(시드)** 인지 먼저 확인 (기본값)
3. 비로그인 상태 + live 모드 시 auth 화면이 떠야 함

---

## 1. 회원가입 + handle_new_user 트리거 (S2-2)

### 1.1 신규 가입 정상 시드

- [ ] 트윅 패널 → 데이터 모드 = **실데이터** 로 전환
- [ ] 회원가입 화면에서 새 이메일로 가입 (예: `dayflow-test+$(date +%s)@gmail.com`)
- [ ] 이메일 확인 필요 시 메일 클릭 → 로그인 완료
- [ ] **확인 SQL** (Supabase MCP `execute_sql`):

```sql
select kind, count(*) from categories
where user_id = (select id from auth.users where email = '신규이메일')
group by kind;
```

기대: `income=3, expense=10, subscription=8` (총 21개)

- [ ] profiles row 생성 확인:

```sql
select * from profiles where id = (select id from auth.users where email = '신규이메일');
```

기대: display_name 채워져 있음 (이메일 prefix 또는 user_meta_data 의 display_name).

### 1.2 가입 실패 케이스

- [ ] 기존 이메일 재가입 시도 → 한국어 에러 ("이미 가입된 이메일이에요")
- [ ] 짧은 비번 (5자) → 한국어 에러 ("비밀번호가 너무 짧아요")

---

## 2. 도메인별 CRUD 사이클 (S2-3)

각 도메인마다: **추가 → 새로고침으로 리스트 재로딩 → 수정 → 삭제** 순.

### 2.1 transactions (가계부)

- [ ] 홈 → "내역 추가" 버튼 → 빠른 입력 "스타벅스 5000 식비" 저장
- [ ] 새로고침 (cmd+R) — 리스트에 남아있어야 함
- [ ] 같은 거래 클릭 → 편집 모달 → 금액 수정 → 저장 → 새로고침 후 반영 확인
- [ ] 거래 삭제 → 새로고침 후 사라짐 확인
- [ ] **DB 확인**: `select * from transactions order by created_at desc limit 5;`
  - **알려진 갭**: `pay`(결제수단) 입력해도 account_id 미연결 (B3) — 모달이 controlled 폼 아니라서 어차피 저장 안 됨

### 2.2 calendar_events

- [ ] 캘린더 페이지 → 새 일정 추가 → "내일 오후 3시 미팅"
- [ ] 새로고침 후 일정 남아있음
- [ ] 일정 클릭 → 수정 모달 → 제목 수정 → 저장 → 새로고침 후 반영
- [ ] 일정 삭제
- [ ] **알려진 갭**: `place / cat / alarm / repeat` 모달 UI 보이지만 실제 controlled state 아님 → 저장 안 됨 (B4 — Phase S4 제품 wiring 작업)

### 2.3 sticky_notes

- [ ] 홈 → 스티커 메모 추가 → 텍스트 입력 → 새로고침 후 반영
- [ ] 텍스트 수정 → onChange 마다 upsert (autosave 검증)
- [ ] x 버튼으로 삭제

### 2.4 checklist_items

- [ ] 홈 → 체크리스트 입력 → Enter
- [ ] 토글 → 새로고침 후 done 상태 보존
- [ ] 삭제
- [ ] **알려진 갭**: 새로 추가한 항목은 시간 라벨이 비어 보임 (B5 — due_at NULL → formatKoreanTime undefined). UX 페이퍼컷.

### 2.5 daily_logs (B1 fix 검증)

- [ ] 홈 → 오늘의 한 줄 입력 → 새로고침 후 텍스트 보존
- [ ] 무드 이모지 변경 → 새로고침 후 보존
- [ ] **DB 확인**: `select * from daily_logs where user_id = ...;`
  - 같은 날짜에 여러 row 가 생기지 않아야 함 (onConflict='user_id,date' 작동 확인)

### 2.6 notes (메모)

- [ ] 메모 페이지 → 새 메모 추가 → 제목/본문 입력
- [ ] 별표 토글 / 핀 토글 → 새로고침 후 상태 보존
- [ ] 폴더 변경 → 보존
- [ ] 삭제 (휴지통 이동? 영구 삭제?)

### 2.7 pinned_info (자주 쓰는 정보)

- [ ] 홈 → DeskPile → 핀 추가
- [ ] label/value 인라인 편집
- [ ] 복사 버튼
- [ ] 삭제

### 2.8 subscriptions

- [ ] 구독 페이지에서 **읽기만** 작동 (현재 UI 에 add/edit 버튼 미연결 — Phase S4)
- [ ] mock 시드와 다른 데이터 보이는지 (live = 새 사용자라 빈 리스트)

---

## 3. 모드 전환 / 인증 흐름

- [ ] 데모 → 실데이터 전환 시 React 트리 remount 확인 (도메인 hook 들이 새 store 구독)
- [ ] 로그아웃 → live 모드에서는 다시 auth 화면. mock 모드에서는 데모 데이터 표시.
- [ ] 다른 브라우저 (또는 시크릿 창)으로 같은 계정 로그인 → 데이터 동일하게 보임
- [ ] 로그아웃 후 RQ 캐시 / category 캐시 무효화 확인 (다른 계정으로 로그인 시 이전 사용자 데이터 안 보임)

---

## 4. RLS 검증

데이터 격리가 정말 되는지 한 번은 확인.

```sql
-- A 계정 로그인 상태에서 B 계정의 데이터 select 시도 → 0 rows 나와야 함.
-- (Supabase 대시보드 SQL Editor 에서는 service role 이라 다 보이므로
--  앱에서 직접 시도하거나, anon key + Authorization 헤더로 curl)
```

curl 테스트 예:

```bash
curl "https://<PROJECT>.supabase.co/rest/v1/notes?select=*" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <A 계정 access_token>"
# B 계정 데이터는 빠진 상태로 응답되어야 함
```

---

## 발견된 알려진 갭 (Phase S4 에서 처리)

| ID  | 영역                | 설명                                                                         | 우선순위               |
| --- | ------------------- | ---------------------------------------------------------------------------- | ---------------------- |
| B2  | subscriptions toRow | partial update 시 next_billing_at 오늘로 덮어쓰기 (현재 호출자 없어 dormant) | 중                     |
| B3  | transactions toRow  | pay → account_id 변환 헬퍼 부재 (UI 미완성이라 dormant)                      | 중                     |
| B4  | calendar_events     | place/cat/alarm/repeat 컬럼 부재 또는 매퍼 누락                              | 중                     |
| B5  | checklist           | 새 항목의 시간 라벨 사라짐 (due_at NULL → undefined)                         | 낮                     |
| B6  | subscriptions       | DB 의 'weekly' 가 도메인 '월'로 silent 매핑                                  | 낮                     |
| B7  | id 타입             | memos/sticky/checklist 도메인 `id: number` 인데 UUID 강제 캐스팅             | 낮 (마이그레이션 부채) |

## 운영 노트

- **기존 가입자 3명** (`sangheon1646` ×2, `yoonjy`): 가입 시점이 `handle_new_user` v1 (profiles 만 insert) 이라 categories 가 0개. 신규 가입자는 v2 (profiles + 21 categories) 로 정상 시드됨. 결정 필요:
  - 그대로 두면 `resolveCategoryId` 가 lazy-create (작동 OK, UX 살짝 어색)
  - 삭제하고 다시 가입 (가장 깔끔)
  - 21개 카테고리 SQL 백필
