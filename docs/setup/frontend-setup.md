# Frontend Setup

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

## English

### Requirements

- Node.js 22
- npm

The root `.nvmrc` defines the supported Node.js version.

### Install and run

```bash
cd apps/web
npm ci
npm run dev
```

Open `http://localhost:3000`.

### Authentication environment

Add the following values to `apps/web/.env.local`.

```dotenv
AUTH_URL=http://localhost:3000
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
MARKETPILOT_API_URL=http://127.0.0.1:8000
MARKETPILOT_INTERNAL_API_TOKEN=
```

Generate `AUTH_SECRET` with `npx auth secret`. Google credentials come from
the Google OAuth web client. `MARKETPILOT_INTERNAL_API_TOKEN` must exactly
match the value in `apps/api/.env` and must never use a `NEXT_PUBLIC_` prefix.
Do not commit `.env.local`.

See [Authentication](../frontend/authentication.md#english) for OAuth setup.

### Checks

```bash
npm run lint
npm run build
```

---

<a id="한국어"></a>

## 한국어

### 준비물

- Node.js 22
- npm

저장소 루트의 `.nvmrc`가 지원 Node.js 버전을 지정합니다.

### 설치 및 실행

```bash
cd apps/web
npm ci
npm run dev
```

`http://localhost:3000`을 엽니다.

### 인증 환경변수

`apps/web/.env.local`에 다음 값을 추가합니다.

```dotenv
AUTH_URL=http://localhost:3000
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
MARKETPILOT_API_URL=http://127.0.0.1:8000
MARKETPILOT_INTERNAL_API_TOKEN=
```

`AUTH_SECRET`은 `npx auth secret`으로 생성합니다. Google 값은 OAuth 웹
클라이언트에서 발급받습니다. `MARKETPILOT_INTERNAL_API_TOKEN`은
`apps/api/.env`와 정확히 같아야 하며 `NEXT_PUBLIC_` 접두사를 붙이면 안 됩니다.
`.env.local`은 커밋하지 않습니다.

OAuth 설정은 [인증 문서](../frontend/authentication.md#한국어)를 참고합니다.

### 검사

```bash
npm run lint
npm run build
```

---

<a id="日本語"></a>

## 日本語

### 必要環境

- Node.js 22
- npm

ルートの`.nvmrc`が対応するNode.jsバージョンを定義します。

### インストールと実行

```bash
cd apps/web
npm ci
npm run dev
```

`http://localhost:3000`を開きます。

### 認証環境変数

`apps/web/.env.local`に次の値を追加します。

```dotenv
AUTH_URL=http://localhost:3000
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
MARKETPILOT_API_URL=http://127.0.0.1:8000
MARKETPILOT_INTERNAL_API_TOKEN=
```

`AUTH_SECRET`は`npx auth secret`で生成します。Googleの値はOAuth Web
クライアントから取得します。`MARKETPILOT_INTERNAL_API_TOKEN`は
`apps/api/.env`と完全に一致させ、`NEXT_PUBLIC_`を付けないでください。
`.env.local`はコミットしません。

OAuth設定は[認証ドキュメント](../frontend/authentication.md#日本語)を参照します。

### チェック

```bash
npm run lint
npm run build
```
