# MarketPilot API

FastAPI backend for MarketPilot.

## Current foundation

- minimal FastAPI application
- typed `GET /health` endpoint
- endpoint test
- Python 3.12 virtual environment

## Commands

```bash
cd apps/api
source .venv/bin/activate
uvicorn marketpilot_api.main:app --reload
pytest
```

Open:

- API: `http://127.0.0.1:8000/health`
- Swagger UI: `http://127.0.0.1:8000/docs`
