# delete-account Edge Function

회원 탈퇴 처리. 호출자의 JWT 로 신원을 확인하고 `service_role` 키로
`auth.users` 에서 본인 계정을 삭제한다. 모든 도메인 테이블과 `profiles` 는
`references auth.users(id) on delete cascade` 라 함께 정리된다.

## 흐름

```
클라(Settings → 데이터 → 계정 삭제)
  └ 비밀번호 재인증(reauthenticate) 통과
      └ supabase.functions.invoke("delete-account")  // Authorization 자동 첨부
          └ Edge Function: getUser(token) → admin.deleteUser(user.id)
              └ FK cascade 로 전체 데이터 삭제
  └ 성공 시 클라에서 signOut → 랜딩으로 이동
```

## 필요한 시크릿

`SUPABASE_URL`, `SUPABASE_ANON_KEY` 는 플랫폼이 기본 주입한다. service role 만 수동 설정:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

## 배포 (검토 후 직접 실행 — 자동 deploy 안 함)

```bash
# 프로젝트 링크 (최초 1회)
supabase link --project-ref <project-ref>

# 함수 배포
supabase functions deploy delete-account

# 로컬 테스트
supabase functions serve delete-account
```

## 선행 마이그레이션

`supabase/migrations/0009_profiles_preferences.sql` 와 무관. cascade 는 기존
스키마(0004~0007)의 `on delete cascade` FK 로 이미 보장된다. 추가 마이그레이션 불필요.

## 주의

- OAuth(Google) 전용 사용자는 비밀번호가 없어 클라 재인증이 불가하다. 현재
  UI 는 비밀번호 재인증을 요구하므로 이메일/비번 사용자만 셀프 탈퇴 가능.
  OAuth 사용자 탈퇴 경로는 후속 작업(재인증 방식 분기)에서 다룬다.
- 비가역 작업. 클라에서 확인 모달 + "삭제" 텍스트 입력 + 비밀번호 재인증 3중 게이트.
