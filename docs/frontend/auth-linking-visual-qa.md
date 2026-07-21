# Auth Linking Visual QA

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

## English

Use this checklist after `feature/auth-account-linking` is merged and the local
database is migrated.

### Scope

- Verify that a same-email Google login links to an existing password user.
- Verify that the dashboard still shows the same project user state after login.
- Do not create or test real-money trading behavior.

### Setup

```bash
cd apps/api
source .venv/bin/activate
alembic upgrade head
uvicorn marketpilot_api.main:app --reload
```

```bash
cd apps/web
npm run dev
```

### Checklist

1. Open `http://localhost:3000/en/signup`.
2. Create a password account with the same email as a Google test user.
3. Open the development verification link shown on the signup screen.
4. Log in at `http://localhost:3000/en/login` with the password account.
5. Sign out.
6. Log in with Google using the same email.
7. Confirm the browser returns to the dashboard.
8. Confirm portfolio/dashboard data belongs to the same project user, not a new
   empty account.
9. Confirm a second Google login with the same account still succeeds.

### Expected Result

- One `users` row represents the person.
- `user_auth_identities` contains both `password` and `google` identities for
  that user.
- Password signup with an already-used email is still rejected.

### Result Log

Record the manual QA result after running the checklist.

- Date:
- Tester:
- Environment:
- Password signup verified: Not verified
- Email verification verified: Not verified
- Password login verified: Not verified
- Google same-email linking verified: Not verified
- Duplicate password signup rejection verified: Not verified
- Notes:

---

<a id="한국어"></a>

## 한국어

`feature/auth-account-linking`이 merge되고 로컬 DB migration이 적용된 뒤 이 목록을
확인합니다.

### 범위

- 같은 이메일의 Google 로그인이 기존 password user에 연결되는지 확인합니다.
- 로그인 후 대시보드가 같은 프로젝트 user 상태를 보여주는지 확인합니다.
- 실제 돈 거래 기능은 만들거나 테스트하지 않습니다.

### 준비

```bash
cd apps/api
source .venv/bin/activate
alembic upgrade head
uvicorn marketpilot_api.main:app --reload
```

```bash
cd apps/web
npm run dev
```

### 체크리스트

1. `http://localhost:3000/en/signup`에 접속합니다.
2. Google 테스트 user와 같은 이메일로 password 계정을 만듭니다.
3. signup 화면에 표시되는 개발용 인증 링크를 엽니다.
4. `http://localhost:3000/en/login`에서 password 계정으로 로그인합니다.
5. 로그아웃합니다.
6. 같은 이메일의 Google 계정으로 로그인합니다.
7. 브라우저가 dashboard로 돌아오는지 확인합니다.
8. 포트폴리오/dashboard 데이터가 새 빈 계정이 아니라 같은 프로젝트 user의 데이터인지
   확인합니다.
9. 같은 Google 계정으로 다시 로그인해도 정상 동작하는지 확인합니다.

### 기대 결과

- 한 사람은 하나의 `users` row로 유지됩니다.
- `user_auth_identities`에는 같은 user의 `password`, `google` identity가 모두
  있습니다.
- 이미 사용 중인 이메일로 password signup을 다시 시도하면 계속 거부됩니다.

### 결과 기록

체크리스트를 실행한 뒤 수동 QA 결과를 기록합니다.

- 날짜:
- 확인자:
- 환경:
- password signup 확인: 미확인
- 이메일 인증 확인: 미확인
- password login 확인: 미확인
- Google 같은 이메일 연결 확인: 미확인
- 중복 password signup 거부 확인: 미확인
- 메모:

---

<a id="日本語"></a>

## 日本語

`feature/auth-account-linking`をmergeし、local DB migrationを適用した後で確認します。

### 範囲

- 同じemailのGoogle loginが既存password userへlinkされることを確認します。
- login後のdashboardが同じproject user状態を表示することを確認します。
- real-money trading behaviorは作成・テストしません。

### 準備

```bash
cd apps/api
source .venv/bin/activate
alembic upgrade head
uvicorn marketpilot_api.main:app --reload
```

```bash
cd apps/web
npm run dev
```

### チェックリスト

1. `http://localhost:3000/en/signup`を開きます。
2. Google test userと同じemailでpassword accountを作成します。
3. signup画面に表示されるdevelopment verification linkを開きます。
4. `http://localhost:3000/en/login`でpassword accountとしてloginします。
5. logoutします。
6. 同じemailのGoogle accountでloginします。
7. browserがdashboardへ戻ることを確認します。
8. portfolio/dashboard dataが新しい空accountではなく、同じproject userのdataであることを
   確認します。
9. 同じGoogle accountで再loginしても正常に動作することを確認します。

### 期待結果

- 1人を1つの`users` rowで表します。
- `user_auth_identities`には同じuserの`password`と`google` identityがあります。
- 既に使われているemailでpassword signupを再試行すると、引き続き拒否されます。

### 結果記録

checklistを実行した後、manual QA結果を記録します。

- 日付:
- 確認者:
- 環境:
- password signup確認: 未確認
- email verification確認: 未確認
- password login確認: 未確認
- Google same-email linking確認: 未確認
- duplicate password signup rejection確認: 未確認
- メモ:
