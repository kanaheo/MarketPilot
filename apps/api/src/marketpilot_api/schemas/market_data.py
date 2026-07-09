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
    fresh_skipped_count: int
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


class MarketQuoteSnapshotFreshnessResponse(BaseModel):
    symbol: str
    currency: SupportedCurrency | None
    has_snapshot: bool
    is_fresh: bool
    age_seconds: int | None
    current_price: Decimal | None
    source: str | None
    collected_at: datetime | None
    created_at: datetime | None


class MarketDataSchedulerRunResponse(BaseModel):
    id: UUID
    job_name: str
    status: str
    symbols_source: str
    currency: SupportedCurrency | None
    started_at: datetime
    completed_at: datetime | None
    requested_count: int
    collectable_count: int
    fresh_skipped_count: int
    returned_count: int
    stored_count: int
    skipped_count: int
    error_message: str | None
    created_at: datetime


class FxRateResponse(BaseModel):
    base_currency: SupportedCurrency
    quote_currency: SupportedCurrency
    rate: Decimal
    source: str
    collected_at: datetime
