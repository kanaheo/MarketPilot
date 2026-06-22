# MarketPilot API

FastAPI backend for MarketPilot.

## Current unit

Backend foundation **1-1**:

- minimal FastAPI application
- typed `GET /health` endpoint
- endpoint test

Python 3.12 environment setup and dependency installation are handled in unit
1-2.

## Commands after unit 1-2

```bash
cd apps/api
source .venv/bin/activate
pip install -e ".[dev]"
uvicorn marketpilot_api.main:app --reload
pytest
```

Open:

- API: `http://127.0.0.1:8000/health`
- Swagger UI: `http://127.0.0.1:8000/docs`
