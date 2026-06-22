from fastapi import FastAPI

from marketpilot_api.core.config import get_settings
from marketpilot_api.schemas.health import HealthResponse

settings = get_settings()

app = FastAPI(
    debug=settings.debug,
    title=settings.app_name,
    version=settings.app_version,
)


@app.get("/health", response_model=HealthResponse, tags=["system"])
def health() -> HealthResponse:
    return HealthResponse(status="ok", service="marketpilot-api")
