# Backend Setup

## 준비물

- Python 3.12
- Docker Desktop

Docker Desktop을 먼저 실행한 상태에서 아래 순서대로 진행합니다.

## 1. Python 환경 준비

```bash
cd apps/api
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
```

터미널을 새로 열었다면 다시 `source .venv/bin/activate`를 실행합니다.

## 2. 환경변수

현재 로컬 기본값은 `compose.yaml`의 PostgreSQL 설정과 일치합니다. 따라서 기본
API와 DB 상태 확인만 할 때는 `.env` 없이도 실행됩니다.

사용자 인증 연결을 실행할 때는 `apps/api/.env` 파일이 필요합니다.

```bash
cd apps/api
touch .env
openssl rand -hex 32
```

마지막 명령이 출력한 값을 복사해 아래
`MARKETPILOT_INTERNAL_API_TOKEN`에 입력합니다.

```dotenv
MARKETPILOT_APP_NAME=MarketPilot API
MARKETPILOT_APP_VERSION=0.1.0
MARKETPILOT_ENVIRONMENT=local
MARKETPILOT_DEBUG=true
MARKETPILOT_DATABASE_URL=postgresql+psycopg://marketpilot:marketpilot@127.0.0.1:5432/marketpilot
MARKETPILOT_INTERNAL_API_TOKEN=
```

- `MARKETPILOT_DATABASE_URL`은 `드라이버://사용자:비밀번호@호스트:포트/DB명`
  형식입니다.
- 현재 계정과 비밀번호는 로컬 Docker 개발 전용입니다.
- `MARKETPILOT_INTERNAL_API_TOKEN`은 Next.js 서버가 내부 사용자 동기화 API를
  호출할 때 사용하는 비밀키이며, 프론트 `.env.local`에도 동일한 값을 넣습니다.
- 배포 환경에서는 반드시 별도의 강한 비밀번호와 DB 주소를 사용합니다.
- `apps/api/.env`는 Git에서 제외되며 실제 비밀값을 커밋하지 않습니다.

## 3. PostgreSQL 실행

저장소 루트에서 실행합니다.

```bash
docker compose up -d postgres
docker compose ps
```

## 4. DB 마이그레이션

API 폴더와 가상환경에서 실행합니다.

```bash
cd apps/api
source .venv/bin/activate
alembic upgrade head
```

이 명령은 현재 코드가 요구하는 테이블 구조를 PostgreSQL에 반영합니다.

## 5. API 실행

```bash
uvicorn marketpilot_api.main:app --reload
```

- Health: `http://127.0.0.1:8000/health`
- Readiness: `http://127.0.0.1:8000/readiness`
- Swagger UI: `http://127.0.0.1:8000/docs`

## 검사와 종료

```bash
python -m pytest
alembic current
```

PostgreSQL을 중지하되 데이터는 유지하려면 저장소 루트에서 실행합니다.

```bash
docker compose stop postgres
```
