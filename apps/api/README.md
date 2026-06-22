# MarketPilot API

FastAPI backend for MarketPilot.

## Current foundation

- minimal FastAPI application
- typed `GET /health` endpoint
- endpoint test
- Python 3.12 virtual environment
- typed environment settings
- SQLAlchemy database engine and session
- database-aware `GET /readiness` endpoint

## Commands

```bash
cd apps/api
source .venv/bin/activate
uvicorn marketpilot_api.main:app --reload
python -m pytest
```

Copy `.env.example` to `.env` only when local values need to differ from the
safe defaults. The `.env` file is ignored by Git.

## PostgreSQL

From the repository root, after Docker Desktop is installed and running:

```bash
docker compose up -d postgres
docker compose ps
```

Stop the database without deleting its data:

```bash
docker compose stop postgres
```

Open:

- API: `http://127.0.0.1:8000/health`
- Readiness: `http://127.0.0.1:8000/readiness`
- Swagger UI: `http://127.0.0.1:8000/docs`
