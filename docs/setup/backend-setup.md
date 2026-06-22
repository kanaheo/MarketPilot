# Backend Setup

[English](#english) | [한국어](#한국어) | [日本語](#日本語)

<a id="english"></a>

## English

### Requirements and Python environment

- Python 3.12
- Docker Desktop

```bash
cd apps/api
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
```

Activate `.venv` again whenever a new terminal is opened.

### Environment variables

The API and database health endpoints use safe local defaults. User
synchronization additionally requires `apps/api/.env`.

```bash
cd apps/api
touch .env
openssl rand -hex 32
```

Store the generated value as `MARKETPILOT_INTERNAL_API_TOKEN`.

```dotenv
MARKETPILOT_INTERNAL_API_TOKEN=
```

The same value must be added to `apps/web/.env.local`. Optional settings such
as `MARKETPILOT_DATABASE_URL` are documented in the application settings and
normally do not need local overrides. Never commit `.env`.

### Database, migrations, and API

From the repository root:

```bash
docker compose up -d postgres
docker compose ps
```

From `apps/api` with `.venv` active:

```bash
alembic upgrade head
uvicorn marketpilot_api.main:app --reload
```

- Health: `http://127.0.0.1:8000/health`
- Readiness: `http://127.0.0.1:8000/readiness`
- Swagger UI: `http://127.0.0.1:8000/docs`

### Checks and shutdown

```bash
python -m pytest
alembic current
```

From the repository root, stop PostgreSQL without deleting data:

```bash
docker compose stop postgres
```

---

<a id="한국어"></a>

## 한국어

### 준비물과 Python 환경

- Python 3.12
- Docker Desktop

```bash
cd apps/api
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
```

새 터미널을 열면 `.venv`를 다시 활성화합니다.

### 환경변수

API와 DB 상태 확인은 안전한 로컬 기본값으로 실행됩니다. 사용자 동기화에는
`apps/api/.env`가 추가로 필요합니다.

```bash
cd apps/api
touch .env
openssl rand -hex 32
```

생성된 값을 `MARKETPILOT_INTERNAL_API_TOKEN`에 입력합니다.

```dotenv
MARKETPILOT_INTERNAL_API_TOKEN=
```

같은 값을 `apps/web/.env.local`에도 입력합니다. `MARKETPILOT_DATABASE_URL` 같은
선택 설정은 애플리케이션 기본 설정에 있으며 일반적인 로컬 개발에서는 변경하지
않아도 됩니다. `.env`는 커밋하지 않습니다.

### DB, 마이그레이션, API 실행

저장소 루트에서:

```bash
docker compose up -d postgres
docker compose ps
```

`apps/api`에서 `.venv`를 활성화한 후:

```bash
alembic upgrade head
uvicorn marketpilot_api.main:app --reload
```

- 상태 확인: `http://127.0.0.1:8000/health`
- DB 준비 상태: `http://127.0.0.1:8000/readiness`
- Swagger UI: `http://127.0.0.1:8000/docs`

### 검사와 종료

```bash
python -m pytest
alembic current
```

저장소 루트에서 데이터는 유지하고 PostgreSQL만 중지합니다.

```bash
docker compose stop postgres
```

---

<a id="日本語"></a>

## 日本語

### 必要環境とPython環境

- Python 3.12
- Docker Desktop

```bash
cd apps/api
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
```

新しいターミナルを開いた場合は`.venv`を再度有効化します。

### 環境変数

APIとDBの状態確認は安全なローカル既定値で動作します。ユーザー同期には
`apps/api/.env`が追加で必要です。

```bash
cd apps/api
touch .env
openssl rand -hex 32
```

生成した値を`MARKETPILOT_INTERNAL_API_TOKEN`に設定します。

```dotenv
MARKETPILOT_INTERNAL_API_TOKEN=
```

同じ値を`apps/web/.env.local`にも設定します。`MARKETPILOT_DATABASE_URL`などの
任意設定はアプリケーションに既定値があり、通常のローカル開発では変更不要です。
`.env`はコミットしません。

### DB、マイグレーション、APIの実行

リポジトリルートで:

```bash
docker compose up -d postgres
docker compose ps
```

`apps/api`で`.venv`を有効にして:

```bash
alembic upgrade head
uvicorn marketpilot_api.main:app --reload
```

- ヘルス: `http://127.0.0.1:8000/health`
- DB準備状態: `http://127.0.0.1:8000/readiness`
- Swagger UI: `http://127.0.0.1:8000/docs`

### チェックと終了

```bash
python -m pytest
alembic current
```

リポジトリルートでデータを残したままPostgreSQLを停止します。

```bash
docker compose stop postgres
```
