from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel

from marketpilot_api.schemas.portfolios import SupportedCurrency


class MarketQuoteResponse(BaseModel):
    symbol: str
    currency: SupportedCurrency
    current_price: Decimal
    source: str
    collected_at: datetime


class MarketQuoteProviderStatusResponse(BaseModel):
    configured_provider: str
    active_provider: str
    fallback_provider: str
    finnhub_api_key_configured: bool
    cache_ttl_seconds: int


class MarketQuoteSnapshotCollectionResponse(BaseModel):
    requested_count: int
    stored_count: int
    skipped_count: int
    quotes: list[MarketQuoteResponse]


class MarketQuoteSnapshotResponse(BaseModel):
    id: UUID
    symbol: str
    currency: SupportedCurrency
    current_price: Decimal
    source: str
    collected_at: datetime
    created_at: datetime


class FxRateResponse(BaseModel):
    base_currency: SupportedCurrency
    quote_currency: SupportedCurrency
    rate: Decimal
    source: str
    collected_at: datetime
