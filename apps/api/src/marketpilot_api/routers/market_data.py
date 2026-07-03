from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from marketpilot_api.db.session import get_db_session
from marketpilot_api.repositories.fx_rates import get_fx_rate
from marketpilot_api.repositories.market_quote_snapshots import (
    list_market_quote_snapshots as list_recorded_market_quote_snapshots,
    record_market_quote_snapshots,
)
from marketpilot_api.repositories.price_quotes import (
    get_market_quote_provider_status,
    list_market_quotes as list_provider_market_quotes,
)
from marketpilot_api.schemas.market_data import (
    FxRateResponse,
    MarketQuoteSnapshotCollectionResponse,
    MarketQuoteSnapshotResponse,
    MarketQuoteProviderStatusResponse,
    MarketQuoteResponse,
)
from marketpilot_api.schemas.portfolios import SupportedCurrency

router = APIRouter(prefix="/market-data", tags=["market-data"])


@router.get(
    "/quote-provider-status",
    response_model=MarketQuoteProviderStatusResponse,
)
def retrieve_quote_provider_status() -> MarketQuoteProviderStatusResponse:
    provider_status = get_market_quote_provider_status()

    return MarketQuoteProviderStatusResponse(
        configured_provider=provider_status.configured_provider,
        active_provider=provider_status.active_provider,
        fallback_provider=provider_status.fallback_provider,
        finnhub_api_key_configured=provider_status.finnhub_api_key_configured,
        cache_ttl_seconds=provider_status.cache_ttl_seconds,
    )


@router.get("/quotes", response_model=list[MarketQuoteResponse])
def list_market_quotes(
    currency: SupportedCurrency | None = None,
    symbols: Annotated[list[str] | None, Query()] = None,
) -> list[MarketQuoteResponse]:
    return [
        MarketQuoteResponse(
            symbol=quote.symbol,
            currency=quote.currency,
            current_price=quote.current_price,
            source=quote.source,
            collected_at=quote.collected_at,
        )
        for quote in list_provider_market_quotes(
            currency=currency,
            symbols=symbols,
        )
    ]


@router.post(
    "/quote-snapshots/collect",
    response_model=MarketQuoteSnapshotCollectionResponse,
)
def collect_market_quote_snapshots(
    session: Annotated[Session, Depends(get_db_session)],
    currency: SupportedCurrency | None = None,
    symbols: Annotated[list[str] | None, Query()] = None,
) -> MarketQuoteSnapshotCollectionResponse:
    quotes = list_provider_market_quotes(
        currency=currency,
        symbols=symbols,
    )
    collection = record_market_quote_snapshots(session, quotes=quotes)

    return MarketQuoteSnapshotCollectionResponse(
        requested_count=len(symbols) if symbols is not None else len(quotes),
        stored_count=len(collection.snapshots),
        skipped_count=collection.skipped_count,
        quotes=[
            MarketQuoteResponse(
                symbol=quote.symbol,
                currency=quote.currency,
                current_price=quote.current_price,
                source=quote.source,
                collected_at=quote.collected_at,
            )
            for quote in quotes
        ],
    )


@router.get(
    "/quote-snapshots",
    response_model=list[MarketQuoteSnapshotResponse],
)
def list_market_quote_snapshots(
    session: Annotated[Session, Depends(get_db_session)],
    currency: SupportedCurrency | None = None,
    symbols: Annotated[list[str] | None, Query()] = None,
    limit: Annotated[int, Query(ge=1, le=200)] = 50,
) -> list[MarketQuoteSnapshotResponse]:
    snapshots = list_recorded_market_quote_snapshots(
        session,
        currency=currency,
        symbols=symbols,
        limit=limit,
    )

    return [
        MarketQuoteSnapshotResponse(
            id=snapshot.id,
            symbol=snapshot.symbol,
            currency=snapshot.currency,
            current_price=snapshot.current_price,
            source=snapshot.source,
            collected_at=snapshot.collected_at,
            created_at=snapshot.created_at,
        )
        for snapshot in snapshots
    ]


@router.get("/fx-rates", response_model=FxRateResponse)
def retrieve_fx_rate(
    base_currency: SupportedCurrency,
    quote_currency: SupportedCurrency,
) -> FxRateResponse:
    fx_rate = get_fx_rate(
        base_currency=base_currency,
        quote_currency=quote_currency,
    )

    if fx_rate is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FX rate not found",
        )

    return FxRateResponse(
        base_currency=fx_rate.base_currency,
        quote_currency=fx_rate.quote_currency,
        rate=fx_rate.rate,
        source=fx_rate.source,
        collected_at=fx_rate.collected_at,
    )
