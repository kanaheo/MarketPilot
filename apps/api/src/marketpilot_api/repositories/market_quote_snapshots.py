from collections.abc import Iterable
from dataclasses import dataclass
from datetime import datetime, timedelta

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from marketpilot_api.models import MarketQuoteSnapshot
from marketpilot_api.repositories.price_quotes import MarketQuote


@dataclass(frozen=True)
class MarketQuoteSnapshotCollection:
    snapshots: list[MarketQuoteSnapshot]
    skipped_count: int


def record_market_quote_snapshots(
    session: Session,
    *,
    quotes: Iterable[MarketQuote],
) -> MarketQuoteSnapshotCollection:
    snapshots: list[MarketQuoteSnapshot] = []
    skipped_count = 0

    for quote in quotes:
        if quote.collected_at is None:
            skipped_count += 1
            continue

        snapshots.append(
            MarketQuoteSnapshot(
                symbol=quote.symbol,
                currency=quote.currency,
                current_price=quote.current_price,
                source=quote.source,
                collected_at=quote.collected_at,
            )
        )

    if len(snapshots) > 0:
        session.add_all(snapshots)
        session.commit()

    return MarketQuoteSnapshotCollection(
        snapshots=snapshots,
        skipped_count=skipped_count,
    )


def list_market_quote_snapshots(
    session: Session,
    *,
    currency: str | None = None,
    symbols: Iterable[str] | None = None,
    limit: int = 50,
) -> list[MarketQuoteSnapshot]:
    statement = _build_market_quote_snapshot_query(
        currency=currency,
        symbols=symbols,
        limit=limit,
    )

    return list(session.scalars(statement).all())


def list_latest_market_quote_snapshots(
    session: Session,
    *,
    currency: str | None = None,
    symbols: Iterable[str] | None = None,
) -> list[MarketQuoteSnapshot]:
    normalized_symbols = (
        sorted({symbol.strip().upper() for symbol in symbols if symbol.strip()})
        if symbols is not None
        else None
    )
    snapshot_map: dict[tuple[str, str], MarketQuoteSnapshot] = {}

    for snapshot in list_market_quote_snapshots(
        session,
        currency=currency,
        symbols=normalized_symbols,
        limit=500,
    ):
        snapshot_key = (snapshot.symbol, snapshot.currency)
        if snapshot_key not in snapshot_map:
            snapshot_map[snapshot_key] = snapshot

        if (
            normalized_symbols is not None
            and len(snapshot_map) >= len(normalized_symbols)
        ):
            break

    return sorted(
        snapshot_map.values(),
        key=lambda snapshot: (snapshot.currency, snapshot.symbol),
    )


def filter_fresh_market_quote_symbols(
    session: Session,
    *,
    currency: str | None = None,
    freshness_seconds: int,
    now: datetime,
    symbols: Iterable[str],
) -> list[str]:
    normalized_symbols = [
        symbol
        for symbol in symbols
        if len(symbol.strip()) > 0
    ]
    if len(normalized_symbols) == 0:
        return []

    freshness_cutoff = now - timedelta(seconds=freshness_seconds)
    fresh_symbols = {
        snapshot.symbol
        for snapshot in list_latest_market_quote_snapshots(
            session,
            currency=currency,
            symbols=normalized_symbols,
        )
        if snapshot.collected_at >= freshness_cutoff
    }

    return [
        symbol
        for symbol in normalized_symbols
        if symbol.strip().upper() not in fresh_symbols
    ]


def _build_market_quote_snapshot_query(
    *,
    currency: str | None = None,
    symbols: Iterable[str] | None = None,
    limit: int = 50,
) -> Select[tuple[MarketQuoteSnapshot]]:
    statement = select(MarketQuoteSnapshot)
    normalized_currency = currency.upper() if currency is not None else None
    normalized_symbols = (
        sorted({symbol.strip().upper() for symbol in symbols if symbol.strip()})
        if symbols is not None
        else None
    )

    if normalized_currency is not None:
        statement = statement.where(
            MarketQuoteSnapshot.currency == normalized_currency
        )
    if normalized_symbols is not None:
        statement = statement.where(
            MarketQuoteSnapshot.symbol.in_(normalized_symbols)
        )

    return statement.order_by(
        MarketQuoteSnapshot.collected_at.desc(),
        MarketQuoteSnapshot.created_at.desc(),
    ).limit(limit)
