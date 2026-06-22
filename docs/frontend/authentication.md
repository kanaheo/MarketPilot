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
- callback after Google authentication: `/{locale}`
- supported locale callbacks: `/ko`, `/en`, and `/ja`
- Google buttons stay disabled when credentials are missing
- email validation uses React Hook Form and Zod
- dashboard routes require an authenticated session
- authenticated users are redirected away from login and signup screens
- the sidebar displays the Google profile and provides sign-out

Successful Google authentication synchronizes the identity with the FastAPI
backend and stores the project user ID in the encrypted Auth.js session.
Email authentication and account linking are future work.

For authenticated user APIs, Next.js reads that ID on the server and creates a
60-second HMAC-signed bearer token. FastAPI verifies the signature, issuer,
audience, lifetime, and database user before a protected router handles the
request. The browser never receives either server secret. The user-sync token
is intentionally not reused for this flow.

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
- Google 인증 후 이동 경로: `/{locale}`
- 지원 언어 경로: `/ko`, `/en`, `/ja`
- Google 인증정보가 없으면 Google 버튼 비활성화
- 이메일 검증은 React Hook Form과 Zod 사용
- 대시보드 경로는 로그인 세션 필요
- 로그인 사용자는 로그인 및 회원가입 화면에서 대시보드로 이동
- 사이드바에 Google 프로필과 실제 로그아웃 기능 표시

Google 인증에 성공하면 FastAPI가 사용자를 프로젝트 DB와 동기화하고, 프로젝트의
사용자 ID를 암호화된 Auth.js 세션에 저장합니다. 이메일 실제 인증과 계정 연결은
후속 작업입니다.

로그인 사용자 API를 호출할 때 Next.js 서버가 이 ID를 읽고 60초 HMAC 서명 bearer
token을 생성합니다. FastAPI는 보호된 router를 실행하기 전에 서명, 발급자, 대상,
유효시간과 DB 사용자 존재 여부를 검증합니다. 브라우저에는 서버 비밀값이 전달되지
않으며, 사용자 동기화 토큰도 이 흐름에 재사용하지 않습니다.

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
- Google認証後の遷移先: `/{locale}`
- 対応言語パス: `/ko`、`/en`、`/ja`
- Google認証情報がない場合はGoogleボタンを無効化
- メール検証にはReact Hook FormとZodを使用
- ダッシュボードルートにはログインセッションが必要
- ログイン済みユーザーはログイン・新規登録画面からダッシュボードへ遷移
- サイドバーにGoogleプロフィールと実際のログアウト機能を表示

Google認証に成功すると、FastAPIがユーザーをプロジェクトDBと同期し、
プロジェクトのユーザーIDを暗号化されたAuth.jsセッションに保存します。
メール認証とアカウント連携は今後の作業です。

認証済みユーザーAPIを呼び出す際、Next.jsサーバーがこのIDを読み取り、60秒の
HMAC署名付きbearer tokenを生成します。FastAPIは保護routerを実行する前に、
署名、issuer、audience、有効期間、DBユーザーの存在を検証します。ブラウザへ
サーバーシークレットは渡さず、ユーザー同期トークンも再利用しません。

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
