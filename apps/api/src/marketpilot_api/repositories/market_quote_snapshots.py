from collections.abc import Iterable
from dataclasses import dataclass

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
