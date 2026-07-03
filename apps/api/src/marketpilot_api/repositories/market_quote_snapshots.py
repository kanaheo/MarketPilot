from collections.abc import Iterable
from dataclasses import dataclass

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
