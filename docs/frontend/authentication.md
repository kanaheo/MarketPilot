# Authentication

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

## English

MarketPilot Web uses Auth.js with JWT sessions. Google OAuth is the first real
authentication provider. Login and signup use the same Google OAuth flow:
the first successful authentication represents signup, while a returning
Google account represents login.

### Current implementation

- Auth.js API route: `/api/auth/[...nextauth]`
- session strategy: encrypted JWT session stored in an HTTP-only cookie
- provider: Google OAuth/OpenID Connect
- provider: email/password through Auth.js Credentials
- callback after Google authentication: `/{locale}`
- supported locale callbacks: `/ko`, `/en`, and `/ja`
- Google buttons stay disabled when credentials are missing
- email validation uses React Hook Form and Zod
- dashboard routes require an authenticated session
- authenticated users are redirected away from login and signup screens
- the sidebar displays the Google profile and provides sign-out

Successful Google authentication synchronizes the identity with the FastAPI
backend and stores the project user ID in the encrypted Auth.js session.
Email/password authentication uses the same Auth.js session boundary as Google.
The web server calls FastAPI for signup and credential verification, so backend
API origins and secrets stay server-only. Account linking is future work. Until
then, password signup rejects an email that already belongs to an existing
user, including a Google OAuth user.

For authenticated user APIs, Next.js reads that ID on the server and creates a
60-second HMAC-signed bearer token. FastAPI verifies the signature, issuer,
audience, lifetime, and database user before a protected router handles the
request. The browser never receives either server secret. The user-sync token
is intentionally not reused for this flow.

### Email and password design

MarketPilot will add email and password authentication after the current Google
OAuth foundation. The recommended direction is a hybrid model:

- keep Auth.js as the web session layer
- keep the encrypted HTTP-only Auth.js JWT cookie
- use a Credentials provider only as the web bridge for email/password login
- let FastAPI own password registration, password verification, reset tokens,
  email verification, throttling, and audit fields
- reject password signup for an email already used by Google OAuth or another
  password credential until an explicit account-linking flow is designed

The backend should store password credentials outside the `users` table, for
example in a `user_password_credentials` table. `users` remains the canonical
project user record, while the credential row stores the normalized email,
email verification state, password hash, hash algorithm metadata, failed login
state, lockout time, and password change timestamps. This avoids forcing OAuth
users to have password-only fields and makes future account linking safer.

Password policy uses a MarketPilot-specific composition rule while keeping the
OWASP/NIST-aligned safeguards for storage, throttling, breached-password
blocking, and generic responses:

- minimum length: 12 characters
- maximum accepted length: at least 64 characters
- allow spaces, symbols, and Unicode
- require at least one lowercase English letter
- require at least one uppercase English letter
- require at least one number
- require at least one special character
- do not force periodic password rotation
- block common or known-compromised passwords before accepting a new password
- never store plaintext passwords
- hash passwords with a password-specific KDF such as Argon2id when available,
  otherwise bcrypt with a documented migration plan
- compare password verification results with safe library functions
- rate-limit signup, login, verification, and reset attempts
- use generic error messages so attackers cannot easily enumerate accounts
- require the current password or a recent reauthentication for password and
  email changes

Signup flow:

1. User submits email and password from `/{locale}/signup`.
2. Next.js server route validates input shape and calls FastAPI.
3. FastAPI normalizes the email, checks rate limits and password policy, hashes
   the password, creates the user and credential records in one transaction,
   and creates a short-lived email verification token.
4. FastAPI stores only the token hash and sends the verification link when an
   email provider is configured. Local development can still show a development
   token for manual testing.
5. The current version requires verification before password login succeeds.

Login flow:

1. User submits email and password from `/{locale}/login`.
2. Auth.js Credentials provider calls a server-only FastAPI verification
   endpoint.
3. FastAPI applies throttling, verifies the password hash, checks account
   status, records success or failure, and returns the project user identity.
4. Auth.js stores the project user ID in the existing encrypted HTTP-only JWT
   session.
5. Existing MarketPilot user API calls continue to use the 60-second
   HMAC-signed bearer token generated only on the Next.js server.

Password reset flow:

1. User requests reset with an email address.
2. Response is always generic, whether the account exists or not.
3. FastAPI stores only a hashed reset token with an expiry and one-time-use
   status.
4. Reset completion validates the token, applies password policy, updates the
   password hash, marks the token used, and invalidates active sessions where
   possible.

Implementation should be split into small backend-first steps:

1. Add password credential and token models with Alembic migrations.
2. Add password hashing and token helpers with unit tests.
3. Add signup, login verification, email verification, and reset endpoints.
4. Add Auth.js Credentials provider and server routes. Done.
5. Replace the current email-only placeholder UI with email/password fields.
   Done.
6. Add abuse-defense tests for duplicate email, weak password, wrong password,
   lockout, reset token expiry, and generic responses.

Out of scope for this branch:

- Google/password account linking

Local development can still verify the flow without a mail provider. SMTP email
delivery can be enabled from the FastAPI `.env`, including AWS SES SMTP
credentials. When the API environment is not `production`, signup responses
include a development verification token. The signup UI turns that token into a
`/{locale}/verify-email?token=...` link so the local flow can confirm the email
before password login. Password reset requests can also expose a development
reset link at `/{locale}/reset-password?token=...` in non-production
environments. Email delivery uses the locale submitted by the web signup or
reset screen, so `/ko`, `/en`, and `/ja` requests produce matching links,
subjects, and body copy. Production responses never include these tokens.

References:

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html)

### Local environment

Store local credentials only in `apps/web/.env.local`.

```dotenv
AUTH_URL=http://localhost:3000
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
MARKETPILOT_API_URL=http://127.0.0.1:8000
MARKETPILOT_INTERNAL_API_TOKEN=
MARKETPILOT_USER_API_SIGNING_SECRET=
```

- `AUTH_URL`: canonical local origin used for OAuth callbacks
- `AUTH_SECRET`: protects Auth.js sessions and JWTs
- `AUTH_GOOGLE_ID`: Google OAuth web client ID
- `AUTH_GOOGLE_SECRET`: Google OAuth client secret
- `MARKETPILOT_API_URL`: server-side FastAPI origin
- `MARKETPILOT_INTERNAL_API_TOKEN`: shared server-only user-sync secret
- `MARKETPILOT_USER_API_SIGNING_SECRET`: separate server-only secret for
  short-lived authenticated user API tokens

In production, the web server refuses to start when `AUTH_SECRET`,
`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `MARKETPILOT_API_URL`,
`MARKETPILOT_INTERNAL_API_TOKEN`, or `MARKETPILOT_USER_API_SIGNING_SECRET` is
missing.

Generate `AUTH_SECRET` locally:

```bash
openssl rand -hex 32
```

Never commit `.env.local`, expose these values with a `NEXT_PUBLIC_` prefix,
or place real secrets in screenshots, chat, documentation, or CI files.

### Google Cloud configuration

1. Create or select the `MarketPilot` Google Cloud project.
2. Open Google Auth Platform.
3. Set the audience to **External** and keep the app in **Testing** while
   developing locally.
4. Add the developer's Google account as a test user.
5. Create an OAuth client with application type **Web application**.
6. Use a name such as `MarketPilot Local`.

Authorized JavaScript origins:

```text
http://localhost:3000
```

Authorized redirect URIs:

```text
http://localhost:3000/api/auth/callback/google
```

The redirect URI must match exactly, including protocol, host, port, path, and
the absence of a trailing slash.

### Local verification

Restart the development server after changing `.env.local`.

```bash
cd apps/web
npm run dev
```

Then verify:

1. Open `http://localhost:3000/en/signup`.
2. Confirm the Google button is enabled.
3. Start Google authentication.
4. Complete account selection and any Google security challenge manually.
5. Confirm the browser returns to `/en`, `/ko`, or `/ja`.
6. Confirm `/api/auth/providers` includes the `google` provider.

Password auth can be verified locally before real email delivery is connected:

1. Open `http://localhost:3000/en/signup`.
2. Submit an email and a password that satisfies the policy.
3. Open the development verification link shown by the signup screen.
4. Return to `http://localhost:3000/en/login` and log in with the same email
   and password.
5. Open `http://localhost:3000/en/forgot-password`.
6. Request a reset link for the same email.
7. Open the development reset link and set a new password.
8. Confirm the old password no longer works and the new password logs in.

Do not test with a Google account that is absent from the test-user list while
the OAuth app remains in Testing mode.

Use `localhost` consistently during local OAuth testing. `localhost` and
`127.0.0.1` are different cookie hosts, so mixing them can invalidate the
OAuth PKCE check.

### Important behavior

- Changing `AUTH_SECRET` invalidates existing local sessions.
- Google login and Google signup are one OAuth flow, not separate provider
  implementations.
- Auth.js handles OAuth state and callback processing.
- Google users are persisted; additional providers and account linking are
  future work.
- Public market or AI-signal pages may be separated from the authenticated
  personal dashboard in a future step.

---

<a id="한국어"></a>

## 한국어

MarketPilot Web은 Auth.js와 JWT 세션을 사용합니다. 첫 번째 실제 인증 제공자는
Google OAuth입니다. Google 로그인과 회원가입은 같은 OAuth 흐름을 사용하며,
처음 인증한 Google 계정은 회원가입, 다시 방문한 계정은 로그인으로 취급합니다.

### 현재 구현 상태

- Auth.js API 경로: `/api/auth/[...nextauth]`
- 세션 방식: HTTP-only 쿠키에 저장되는 암호화 JWT 세션
- 인증 제공자: Google OAuth/OpenID Connect
- 인증 제공자: Auth.js Credentials를 통한 이메일/비밀번호
- Google 인증 후 이동 경로: `/{locale}`
- 지원 언어 경로: `/ko`, `/en`, `/ja`
- Google 인증정보가 없으면 Google 버튼 비활성화
- 이메일 검증은 React Hook Form과 Zod 사용
- 대시보드 경로는 로그인 세션 필요
- 로그인 사용자는 로그인 및 회원가입 화면에서 대시보드로 이동
- 사이드바에 Google 프로필과 실제 로그아웃 기능 표시

Google 인증에 성공하면 FastAPI가 사용자를 프로젝트 DB와 동기화하고, 프로젝트의
사용자 ID를 암호화된 Auth.js 세션에 저장합니다. 이메일/비밀번호 인증도 같은 Auth.js
세션 경계를 사용합니다. web 서버가 FastAPI에 회원가입과 비밀번호 검증을 요청하므로
backend API 주소와 비밀값은 server-only로 유지됩니다. 계정 연결은 후속 작업입니다.
그 전까지는 Google OAuth 사용자를 포함해 이미 존재하는 사용자 이메일로 password
signup을 만들 수 없습니다.

로그인 사용자 API를 호출할 때 Next.js 서버가 이 ID를 읽고 60초 HMAC 서명 bearer
token을 생성합니다. FastAPI는 보호된 router를 실행하기 전에 서명, 발급자, 대상,
유효시간과 DB 사용자 존재 여부를 검증합니다. 브라우저에는 서버 비밀값이 전달되지
않으며, 사용자 동기화 토큰도 이 흐름에 재사용하지 않습니다.

### 이메일/비밀번호 설계

MarketPilot은 현재 Google OAuth 기반 위에 이메일/비밀번호 인증을 추가합니다.
추천 방향은 하이브리드 구조입니다.

- web 세션 관리는 계속 Auth.js가 담당
- HTTP-only 쿠키에 저장되는 암호화 Auth.js JWT 세션 유지
- 이메일/비밀번호 로그인은 Auth.js Credentials provider를 web 연결부로 사용
- 비밀번호 회원가입, 비밀번호 검증, reset token, 이메일 인증, 로그인 제한,
  감사 필드는 FastAPI가 담당
- Google OAuth나 다른 password credential에서 이미 사용 중인 email은 명시적인
  계정 연결 흐름을 만들기 전까지 password signup을 거부

백엔드는 비밀번호 정보를 `users` 테이블에 직접 섞지 않고
`user_password_credentials` 같은 별도 테이블에 저장하는 방향이 좋습니다.
`users`는 프로젝트의 실제 사용자 기준 record로 유지하고, credential row에는 정규화된
email, 이메일 인증 상태, password hash, hash 알고리즘 metadata, 로그인 실패 상태,
잠금 해제 시각, 비밀번호 변경 시각을 저장합니다. 이렇게 하면 OAuth 사용자에게
비밀번호 전용 필드를 억지로 붙이지 않아도 되고, 나중에 계정 연결도 안전해집니다.

비밀번호 정책은 MarketPilot 전용 조합 규칙을 사용하되, 저장 방식, 로그인 제한,
유출 비밀번호 차단, 일반화된 응답은 OWASP/NIST에 맞춰 안전하게 유지합니다.

- 최소 12자
- 최소 64자까지 허용
- 공백, 기호, Unicode 허용
- 영문 소문자 1개 이상 필수
- 영문 대문자 1개 이상 필수
- 숫자 1개 이상 필수
- 특수문자 1개 이상 필수
- 주기적인 비밀번호 변경 강제 금지
- 흔한 비밀번호나 유출된 비밀번호 차단
- 평문 비밀번호 저장 금지
- 가능하면 Argon2id 같은 비밀번호 전용 KDF 사용, 어렵다면 bcrypt로 시작하되
  나중에 Argon2id로 옮길 계획 문서화
- 검증 비교는 라이브러리의 안전한 함수 사용
- 가입, 로그인, 이메일 인증, 비밀번호 재설정 요청에 rate limit 적용
- 계정 존재 여부를 쉽게 알 수 없도록 에러 문구는 일반화
- 비밀번호나 이메일 변경은 현재 비밀번호 확인 또는 최근 재인증 요구

회원가입 흐름:

1. 사용자가 `/{locale}/signup`에서 email과 password 입력
2. Next.js server route가 입력 형태를 검증하고 FastAPI 호출
3. FastAPI가 email 정규화, rate limit, 비밀번호 정책 검사를 수행
4. FastAPI가 password를 hash하고 user와 credential을 하나의 transaction으로 생성
5. FastAPI가 짧은 수명의 이메일 인증 token 생성
6. 실제 메일 발송은 후속 mail provider 작업으로 분리
7. 현재 버전은 이메일 인증 전 password login을 막음

로그인 흐름:

1. 사용자가 `/{locale}/login`에서 email과 password 입력
2. Auth.js Credentials provider가 서버 전용 FastAPI 검증 endpoint 호출
3. FastAPI가 throttling, password hash 검증, 계정 상태 확인, 성공/실패 기록 수행
4. Auth.js가 기존처럼 프로젝트 사용자 ID를 암호화된 HTTP-only JWT 세션에 저장
5. 기존 MarketPilot 사용자 API 호출은 그대로 Next.js 서버가 60초 HMAC bearer token을
   만들어 사용

비밀번호 재설정 흐름:

1. 사용자가 email로 reset 요청
2. 계정 존재 여부와 상관없이 같은 응답 반환
3. FastAPI는 reset token 원문이 아니라 hash만 저장하고 만료 시각과 1회 사용 여부 기록
4. reset 완료 시 token 검증, 비밀번호 정책 검사, password hash 업데이트,
   token 사용 처리, 가능한 범위의 기존 세션 무효화 수행

구현은 작은 backend-first 단계로 나눕니다.

1. password credential/token model과 Alembic migration 추가
2. password hashing/token helper와 unit test 추가
3. signup, login verify, email verify, password reset endpoint 추가
4. Auth.js Credentials provider와 server route 연결 완료
5. 현재 email-only placeholder UI를 email/password 입력으로 교체 완료
6. 중복 email, 약한 password, 잘못된 password, lockout, reset token 만료,
   일반화된 응답 테스트 추가

이번 브랜치 범위에서 제외:

- Google/password 계정 연결

로컬 개발에서는 mail provider 없이도 흐름을 확인할 수 있습니다. SMTP 이메일 발송은
FastAPI `.env`에서 켤 수 있습니다. API 환경이 `production`이 아니면 signup 응답에
개발용 인증 token이 포함됩니다. signup UI는 이 token을
`/{locale}/verify-email?token=...` 링크로 바꿔서 password login 전에 이메일 인증을 완료할 수
있게 합니다. password reset 요청도 non-production 환경에서는 개발용 reset link를
`/{locale}/reset-password?token=...` 형태로 보여줄 수 있습니다. 이메일 발송은 web의
signup/reset 화면에서 전달한 locale을 사용하므로 `/ko`, `/en`, `/ja` 요청은 각각 같은
locale의 링크, 제목, 본문을 만듭니다. production 응답에는 이 token들을 절대 포함하지
않습니다.

참고:

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html)

### 로컬 환경변수

로컬 인증정보는 `apps/web/.env.local`에만 저장합니다.

```dotenv
AUTH_URL=http://localhost:3000
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
MARKETPILOT_API_URL=http://127.0.0.1:8000
MARKETPILOT_INTERNAL_API_TOKEN=
MARKETPILOT_USER_API_SIGNING_SECRET=
```

- `AUTH_URL`: OAuth callback에 사용하는 로컬 기준 주소
- `AUTH_SECRET`: Auth.js 세션과 JWT를 보호하는 내부 비밀키
- `AUTH_GOOGLE_ID`: Google OAuth 웹 클라이언트 ID
- `AUTH_GOOGLE_SECRET`: Google OAuth 클라이언트 보안 비밀번호
- `MARKETPILOT_API_URL`: 서버에서 호출하는 FastAPI 주소
- `MARKETPILOT_INTERNAL_API_TOKEN`: 사용자 동기화용 서버 전용 비밀키
- `MARKETPILOT_USER_API_SIGNING_SECRET`: 로그인 사용자 API의 짧은 수명 토큰을
  위한 별도 서버 전용 서명 비밀키

운영 환경에서는 `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`,
`MARKETPILOT_API_URL`, `MARKETPILOT_INTERNAL_API_TOKEN`,
`MARKETPILOT_USER_API_SIGNING_SECRET` 중 하나라도 없으면 web 서버가 시작되지
않습니다.

`AUTH_SECRET` 생성 명령:

```bash
openssl rand -hex 32
```

`.env.local`을 커밋하거나, `NEXT_PUBLIC_` 접두사를 붙이거나, 실제 시크릿을
스크린샷·채팅·문서·CI 파일에 기록하지 않습니다.

### Google Cloud 설정

1. Google Cloud에서 `MarketPilot` 프로젝트를 생성하거나 선택합니다.
2. Google 인증 플랫폼을 엽니다.
3. 대상은 **외부**로 설정하고 로컬 개발 중에는 **테스트** 상태를 유지합니다.
4. 개발에 사용할 Google 계정을 테스트 사용자로 추가합니다.
5. 애플리케이션 유형을 **웹 애플리케이션**으로 선택해 OAuth 클라이언트를
   생성합니다.
6. 이름은 `MarketPilot Local`처럼 지정합니다.

승인된 JavaScript 원본:

```text
http://localhost:3000
```

승인된 리디렉션 URI:

```text
http://localhost:3000/api/auth/callback/google
```

리디렉션 URI는 프로토콜, 호스트, 포트, 경로 및 마지막 슬래시 여부까지 정확히
일치해야 합니다.

### 로컬 확인 방법

`.env.local`을 수정한 뒤 개발 서버를 재시작합니다.

```bash
cd apps/web
npm run dev
```

다음 항목을 확인합니다.

1. `http://localhost:3000/en/signup`에 접속합니다.
2. Google 버튼이 활성화되었는지 확인합니다.
3. Google 인증을 시작합니다.
4. 계정 선택과 Google 보안 인증은 사용자가 직접 완료합니다.
5. 인증 후 `/en`, `/ko` 또는 `/ja`로 돌아오는지 확인합니다.
6. `/api/auth/providers` 응답에 `google` 제공자가 포함되는지 확인합니다.

실제 이메일 발송을 연결하기 전에도 password auth는 로컬에서 확인할 수 있습니다.

1. `http://localhost:3000/en/signup`에 접속합니다.
2. 정책을 만족하는 email과 password로 가입합니다.
3. signup 화면에 표시되는 개발용 인증 링크를 엽니다.
4. `http://localhost:3000/en/login`으로 돌아가 같은 email/password로 로그인합니다.
5. `http://localhost:3000/en/forgot-password`에 접속합니다.
6. 같은 email로 reset link를 요청합니다.
7. 개발용 reset link를 열고 새 password를 설정합니다.
8. 기존 password는 실패하고 새 password는 로그인되는지 확인합니다.

OAuth 앱이 테스트 상태인 동안에는 테스트 사용자 목록에 등록된 Google 계정으로만
검증합니다.

로컬 OAuth 테스트에서는 항상 `localhost`를 사용합니다. `localhost`와
`127.0.0.1`은 서로 다른 쿠키 호스트이므로 섞어서 사용하면 OAuth PKCE 검증이
실패할 수 있습니다.

### 알아둘 동작

- `AUTH_SECRET`을 변경하면 기존 로컬 로그인 세션이 무효화됩니다.
- Google 로그인과 Google 회원가입은 서로 다른 구현이 아니라 하나의 OAuth
  흐름입니다.
- OAuth state 검증과 callback 처리는 Auth.js가 담당합니다.
- Google 사용자는 영구 저장하며, 추가 제공자와 계정 연결은 후속 작업입니다.
- 공개 시장 정보나 AI 신호 화면은 추후 개인 대시보드와 분리할 수 있습니다.

---

<a id="日本語"></a>

## 日本語

MarketPilot WebはAuth.jsとJWTセッションを使用します。最初の実認証プロバイダーは
Google OAuthです。Googleログインと新規登録は同じOAuthフローを使用し、初回認証を
新規登録、再訪問したGoogleアカウントをログインとして扱います。

### 現在の実装

- Auth.js APIパス: `/api/auth/[...nextauth]`
- セッション方式: HTTP-only Cookieに保存される暗号化JWTセッション
- 認証プロバイダー: Google OAuth/OpenID Connect
- 認証プロバイダー: Auth.js Credentialsによるメール/パスワード
- Google認証後の遷移先: `/{locale}`
- 対応言語パス: `/ko`、`/en`、`/ja`
- Google認証情報がない場合はGoogleボタンを無効化
- メール検証にはReact Hook FormとZodを使用
- ダッシュボードルートにはログインセッションが必要
- ログイン済みユーザーはログイン・新規登録画面からダッシュボードへ遷移
- サイドバーにGoogleプロフィールと実際のログアウト機能を表示

Google認証に成功すると、FastAPIがユーザーをプロジェクトDBと同期し、
プロジェクトのユーザーIDを暗号化されたAuth.jsセッションに保存します。
メール/パスワード認証も同じAuth.js session境界を使用します。web serverがFastAPIへ
signupとcredential verificationを依頼するため、backend API originとsecretはserver-onlyに
保たれます。アカウント連携は今後の作業です。それまでは、Google OAuth userを含む
既存userのemailではpassword signupを作成できません。

認証済みユーザーAPIを呼び出す際、Next.jsサーバーがこのIDを読み取り、60秒の
HMAC署名付きbearer tokenを生成します。FastAPIは保護routerを実行する前に、
署名、issuer、audience、有効期間、DBユーザーの存在を検証します。ブラウザへ
サーバーシークレットは渡さず、ユーザー同期トークンも再利用しません。

### メール/パスワード設計

MarketPilotは現在のGoogle OAuth基盤の上に、メール/パスワード認証を追加します。
推奨方針はハイブリッド構成です。

- webセッション層はAuth.jsを維持
- HTTP-only Cookieに保存される暗号化Auth.js JWTセッションを維持
- メール/パスワードログインはAuth.js Credentials providerをweb側の橋渡しにする
- パスワード登録、検証、reset token、メール確認、試行制限、監査項目はFastAPIが担当
- Google OAuthや他のpassword credentialで既に使われているemailは、明示的な
  アカウント連携を設計するまでpassword signupを拒否する

バックエンドでは、パスワード情報を`users`へ直接混ぜず、
`user_password_credentials`のような別テーブルに保存します。`users`はproject userの
基準recordとして維持し、credential rowに正規化email、メール確認状態、password hash、
hashアルゴリズムmetadata、ログイン失敗状態、ロック解除時刻、パスワード変更時刻を
保存します。これによりOAuthユーザーへパスワード専用fieldを強制せず、将来の
アカウント連携も安全にできます。

パスワードポリシーはMarketPilot独自のcomposition ruleを使いながら、保存方式、
試行制限、漏えい済みパスワード拒否、generic responseはOWASP/NISTに沿って安全に保ちます。

- 最小12文字
- 少なくとも64文字まで受け付ける
- 空白、記号、Unicodeを許可
- 英小文字を1文字以上必須
- 英大文字を1文字以上必須
- 数字を1文字以上必須
- 特殊文字を1文字以上必須
- 定期的なパスワード変更を強制しない
- よく使われる、または漏えい済みのパスワードを拒否
- 平文パスワードを保存しない
- 可能ならArgon2idなどのpassword KDFを使い、難しい場合はbcryptで始めて移行計画を残す
- signup、login、email verification、reset requestにrate limitを適用
- account enumerationを避けるため、エラー文言は一般化
- パスワードやメール変更には現在パスワード確認または最近の再認証を要求

実装はbackend-firstで小さく進めます。

1. password credential/token modelとAlembic migrationを追加
2. password hashing/token helperとunit testを追加
3. signup、login verify、email verify、password reset endpointを追加
4. Auth.js Credentials providerとserver routeを接続済み
5. 現在のemail-only placeholder UIをemail/password入力へ置き換え済み
6. duplicate email、weak password、wrong password、lockout、reset token expiry、
   generic responseのテストを追加

このbranchの対象外:

- Google/password account linking

local developmentではmail providerなしでもflowを確認できます。SMTP email deliveryは
FastAPI `.env`で有効化できます。API environmentが`production`でない場合、
signup responseにdevelopment verification tokenを含めます。
signup UIはそのtokenを`/{locale}/verify-email?token=...` linkに変換し、password login前に
email verificationを完了できます。password reset requestもnon-production環境では
development reset linkを`/{locale}/reset-password?token=...`として表示できます。
email deliveryはwebのsignup/reset画面から渡されたlocaleを使うため、`/ko`、`/en`、
`/ja`のrequestはそれぞれ同じlocaleのlink、subject、body copyを作ります。
production responseにはこれらのtokenを含めません。

References:

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html)

### ローカル環境変数

ローカル認証情報は`apps/web/.env.local`だけに保存します。

```dotenv
AUTH_URL=http://localhost:3000
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
MARKETPILOT_API_URL=http://127.0.0.1:8000
MARKETPILOT_INTERNAL_API_TOKEN=
MARKETPILOT_USER_API_SIGNING_SECRET=
```

- `AUTH_URL`: OAuth callbackで使用するローカル基準URL
- `AUTH_SECRET`: Auth.jsのセッションとJWTを保護する内部シークレット
- `AUTH_GOOGLE_ID`: Google OAuth WebクライアントID
- `AUTH_GOOGLE_SECRET`: Google OAuthクライアントシークレット
- `MARKETPILOT_API_URL`: サーバーから呼び出すFastAPI URL
- `MARKETPILOT_INTERNAL_API_TOKEN`: ユーザー同期用サーバー専用シークレット
- `MARKETPILOT_USER_API_SIGNING_SECRET`: 認証済みユーザーAPIの短命トークン用
  サーバー専用署名シークレット

本番環境では、`AUTH_SECRET`、`AUTH_GOOGLE_ID`、`AUTH_GOOGLE_SECRET`、
`MARKETPILOT_API_URL`、`MARKETPILOT_INTERNAL_API_TOKEN`、
`MARKETPILOT_USER_API_SIGNING_SECRET`のいずれかがない場合、webサーバーは
起動しません。

`AUTH_SECRET`の生成:

```bash
openssl rand -hex 32
```

`.env.local`をコミットしたり、`NEXT_PUBLIC_`を付けたり、実際のシークレットを
スクリーンショット、チャット、文書、CIファイルに記録したりしません。

### Google Cloud設定

1. Google Cloudで`MarketPilot`プロジェクトを作成または選択します。
2. Google Auth Platformを開きます。
3. 対象を**外部**に設定し、ローカル開発中は**テスト**状態を維持します。
4. 開発に使用するGoogleアカウントをテストユーザーへ追加します。
5. アプリケーションの種類を**ウェブ アプリケーション**にしてOAuthクライアントを
   作成します。
6. 名前は`MarketPilot Local`などに設定します。

承認済みJavaScript生成元:

```text
http://localhost:3000
```

承認済みリダイレクトURI:

```text
http://localhost:3000/api/auth/callback/google
```

リダイレクトURIはプロトコル、ホスト、ポート、パス、末尾スラッシュの有無まで
完全に一致する必要があります。

### ローカル確認

`.env.local`を変更した後、開発サーバーを再起動します。

```bash
cd apps/web
npm run dev
```

次の項目を確認します。

1. `http://localhost:3000/en/signup`を開きます。
2. Googleボタンが有効になっていることを確認します。
3. Google認証を開始します。
4. アカウント選択とGoogleのセキュリティ認証はユーザーが直接完了します。
5. 認証後に`/en`、`/ko`、または`/ja`へ戻ることを確認します。
6. `/api/auth/providers`の応答に`google`プロバイダーが含まれることを確認します。

実際のメール送信を接続する前でも、password authはローカルで確認できます。

1. `http://localhost:3000/en/signup`を開きます。
2. policyを満たすemailとpasswordでsignupします。
3. signup画面に表示されるdevelopment verification linkを開きます。
4. `http://localhost:3000/en/login`へ戻り、同じemail/passwordでloginします。
5. `http://localhost:3000/en/forgot-password`を開きます。
6. 同じemailでreset linkをrequestします。
7. development reset linkを開き、新しいpasswordを設定します。
8. 古いpasswordでは失敗し、新しいpasswordでloginできることを確認します。

OAuthアプリがテスト状態の間は、テストユーザーとして登録したGoogleアカウントで
検証します。

ローカルOAuthテストでは常に`localhost`を使用します。`localhost`と
`127.0.0.1`は異なるCookieホストのため、混在させるとOAuth PKCE検証が失敗する
場合があります。

### 注意点

- `AUTH_SECRET`を変更すると既存のローカルログインセッションは無効になります。
- GoogleログインとGoogle新規登録は別実装ではなく、同じOAuthフローです。
- OAuth state検証とcallback処理はAuth.jsが担当します。
- Googleユーザーは永続保存し、追加プロバイダーとアカウント連携は今後対応します。
- 公開市場情報やAIシグナル画面は、今後個人ダッシュボードから分離できます。
