from fastapi import FastAPI

from marketpilot_api.core.config import get_settings
from marketpilot_api.routers.internal_auth import router as internal_auth_router
from marketpilot_api.routers.system import router as system_router

settings = get_settings()

app = FastAPI(
    debug=settings.debug,
    title=settings.app_name,
    version=settings.app_version,
)

app.include_router(system_router)
app.include_router(internal_auth_router)
