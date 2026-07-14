from typing import Annotated
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from marketpilot_api.db.session import get_db_session
from marketpilot_api.models import MarketDataSchedulerRun
from marketpilot_api.routers.internal_auth import verify_internal_token
from marketpilot_api.repositories.fx_rates import get_fx_rate
from marketpilot_api.repositories.market_quote_snapshots import (
    filter_fresh_market_quote_symbols,
    list_latest_market_quote_snapshots,
    list_market_quote_snapshots as list_recorded_market_quote_snapshots,
    record_market_quote_snapshots,
)
from marketpilot_api.repositories.market_data_scheduler_runs import (
    get_market_data_scheduler_run_status,
    list_market_data_scheduler_runs as list_recorded_market_data_scheduler_runs,
)
from marketpilot_api.repositories.price_quotes import (
    get_market_quote_provider_status,
    list_market_quotes as list_provider_market_quotes,
)
from marketpilot_api.schemas.market_data import (
    FxRateResponse,
    MarketDataSchedulerRunResponse,
    MarketDataSchedulerRunStatusResponse,
    MarketQuoteSnapshotFreshnessResponse,
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
    dependencies=[Depends(verify_internal_token)],
)
def collect_market_quote_snapshots(
    session: Annotated[Session, Depends(get_db_session)],
    currency: SupportedCurrency | None = None,
    symbols: Annotated[list[str] | None, Query()] = None,
    skip_fresh_seconds: Annotated[int | None, Query(ge=1, le=86400)] = None,
) -> MarketQuoteSnapshotCollectionResponse:
    collectable_symbols = _filter_collectable_symbols(
        session=session,
        currency=currency,
        symbols=symbols,
        skip_fresh_seconds=skip_fresh_seconds,
    )
    quotes = list_provider_market_quotes(
        currency=currency,
        symbols=collectable_symbols,
    )
    collection = record_market_quote_snapshots(session, quotes=quotes)
    requested_count = len(symbols) if symbols is not None else len(quotes)
    fresh_skipped_count = (
        0
        if symbols is None
        else len(symbols) - len(collectable_symbols or [])
    )

    return MarketQuoteSnapshotCollectionResponse(
        requested_count=requested_count,
        fresh_skipped_count=fresh_skipped_count,
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


@router.get(
    "/quote-snapshots/freshness",
    response_model=list[MarketQuoteSnapshotFreshnessResponse],
)
def list_market_quote_snapshot_freshness(
    session: Annotated[Session, Depends(get_db_session)],
    currency: SupportedCurrency | None = None,
    symbols: Annotated[list[str] | None, Query()] = None,
    freshness_seconds: Annotated[int, Query(ge=1, le=86400)] = 300,
) -> list[MarketQuoteSnapshotFreshnessResponse]:
    snapshots = list_latest_market_quote_snapshots(
        session,
        currency=currency,
        symbols=symbols,
    )
    snapshots_by_symbol = {snapshot.symbol: snapshot for snapshot in snapshots}
    response_symbols = (
        _normalize_symbol_list(symbols)
        if symbols is not None
        else sorted(snapshots_by_symbol)
    )
    now = datetime.now(timezone.utc)

    return [
        _build_snapshot_freshness_response(
            symbol=symbol,
            snapshot=snapshots_by_symbol.get(symbol),
            freshness_seconds=freshness_seconds,
            now=now,
        )
        for symbol in response_symbols
    ]


@router.get(
    "/scheduler-runs",
    response_model=list[MarketDataSchedulerRunResponse],
)
def list_market_data_scheduler_runs(
    session: Annotated[Session, Depends(get_db_session)],
    job_name: Annotated[str | None, Query(min_length=1, max_length=64)] = None,
    status: Annotated[str | None, Query(pattern="^(running|succeeded|failed)$")] = None,
    limit: Annotated[int, Query(ge=1, le=200)] = 50,
) -> list[MarketDataSchedulerRunResponse]:
    scheduler_runs = list_recorded_market_data_scheduler_runs(
        session,
        job_name=job_name,
        status=status,
        limit=limit,
    )

    return [
        _build_scheduler_run_response(scheduler_run)
        for scheduler_run in scheduler_runs
    ]


@router.get(
    "/scheduler-runs/status",
    response_model=MarketDataSchedulerRunStatusResponse,
)
def retrieve_market_data_scheduler_run_status(
    session: Annotated[Session, Depends(get_db_session)],
    job_name: Annotated[str | None, Query(min_length=1, max_length=64)] = None,
    limit: Annotated[int, Query(ge=1, le=200)] = 20,
) -> MarketDataSchedulerRunStatusResponse:
    scheduler_status = get_market_data_scheduler_run_status(
        session,
        job_name=job_name,
        limit=limit,
    )

    return MarketDataSchedulerRunStatusResponse(
        latest_run=(
            _build_scheduler_run_response(scheduler_status.latest_run)
            if scheduler_status.latest_run is not None
            else None
        ),
        recent_run_count=scheduler_status.recent_run_count,
        running_count=scheduler_status.running_count,
        succeeded_count=scheduler_status.succeeded_count,
        failed_count=scheduler_status.failed_count,
    )


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


def _normalize_symbol_list(symbols: list[str]) -> list[str]:
    return sorted({symbol.strip().upper() for symbol in symbols if symbol.strip()})


def _filter_collectable_symbols(
    *,
    session: Session,
    currency: str | None,
    symbols: list[str] | None,
    skip_fresh_seconds: int | None,
) -> list[str] | None:
    if symbols is None or skip_fresh_seconds is None:
        return symbols

    return filter_fresh_market_quote_symbols(
        session,
        currency=currency,
        freshness_seconds=skip_fresh_seconds,
        now=datetime.now(timezone.utc),
        symbols=symbols,
    )


def _build_snapshot_freshness_response(
    *,
    symbol: str,
    snapshot,
    freshness_seconds: int,
    now: datetime,
) -> MarketQuoteSnapshotFreshnessResponse:
    if snapshot is None:
        return MarketQuoteSnapshotFreshnessResponse(
            symbol=symbol,
            currency=None,
            has_snapshot=False,
            is_fresh=False,
            age_seconds=None,
            current_price=None,
            source=None,
            collected_at=None,
            created_at=None,
        )

    collected_at = _ensure_timezone_aware(snapshot.collected_at)
    age_seconds = max(0, int((now - collected_at).total_seconds()))

    return MarketQuoteSnapshotFreshnessResponse(
        symbol=snapshot.symbol,
        currency=snapshot.currency,
        has_snapshot=True,
        is_fresh=age_seconds <= freshness_seconds,
        age_seconds=age_seconds,
        current_price=snapshot.current_price,
        source=snapshot.source,
        collected_at=snapshot.collected_at,
        created_at=snapshot.created_at,
    )


def _build_scheduler_run_response(
    scheduler_run: MarketDataSchedulerRun,
) -> MarketDataSchedulerRunResponse:
    return MarketDataSchedulerRunResponse(
        id=scheduler_run.id,
        job_name=scheduler_run.job_name,
        status=scheduler_run.status,
        symbols_source=scheduler_run.symbols_source,
        currency=scheduler_run.currency,
        interval_policy=scheduler_run.interval_policy,
        market_phase=scheduler_run.market_phase,
        next_interval_seconds=scheduler_run.next_interval_seconds,
        freshness_seconds=scheduler_run.freshness_seconds,
        started_at=scheduler_run.started_at,
        completed_at=scheduler_run.completed_at,
        requested_count=scheduler_run.requested_count,
        collectable_count=scheduler_run.collectable_count,
        fresh_skipped_count=scheduler_run.fresh_skipped_count,
        returned_count=scheduler_run.returned_count,
        stored_count=scheduler_run.stored_count,
        skipped_count=scheduler_run.skipped_count,
        error_message=scheduler_run.error_message,
        created_at=scheduler_run.created_at,
    )


def _ensure_timezone_aware(value: datetime) -> datetime:
    if value.tzinfo is None or value.utcoffset() is None:
        return value.replace(tzinfo=timezone.utc)

    return value
