from fastapi import FastAPI

from marketpilot_api.schemas.health import HealthResponse

app = FastAPI(
    title="MarketPilot API",
    version="0.1.0",
)


@app.get("/health", response_model=HealthResponse, tags=["system"])
def health() -> HealthResponse:
    return HealthResponse(status="ok", service="marketpilot-api")
