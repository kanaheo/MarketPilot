from fastapi import FastAPI

from marketpilot_api.core.config import get_settings
from marketpilot_api.routers.internal_auth import router as internal_auth_router
from marketpilot_api.routers.market_data import router as market_data_router
from marketpilot_api.routers.orders import router as orders_router
from marketpilot_api.routers.portfolios import router as portfolios_router
from marketpilot_api.routers.system import router as system_router

settings = get_settings()

app = FastAPI(
    debug=settings.debug,
    title=settings.app_name,
    version=settings.app_version,
)

app.include_router(system_router)
app.include_router(internal_auth_router)
app.include_router(market_data_router)
app.include_router(portfolios_router)
app.include_router(orders_router)
