# Frontend Setup

## 준비물

- Node.js 22
- npm

저장소 루트의 `.nvmrc`를 사용하면 Node.js 버전을 맞출 수 있습니다.

## 설치 및 실행

```bash
cd apps/web
npm ci
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 로그인 환경변수

Google 로그인을 사용하려면 `apps/web/.env.local`에 다음 값을 설정합니다.

```dotenv
AUTH_URL=http://localhost:3000
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

`AUTH_SECRET`은 아래 명령으로 생성할 수 있습니다.

```bash
cd apps/web
npx auth secret
```

- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`은 Google Cloud의 OAuth 웹 클라이언트 값입니다.
- `.env.local`은 Git에서 제외되므로 실제 비밀값을 커밋하지 않습니다.
- 로그인 설정의 자세한 내용은 [Authentication](../frontend/authentication.md#한국어)을 참고합니다.

## 검사

```bash
npm run lint
npm run build
```

