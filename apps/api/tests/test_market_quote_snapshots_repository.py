from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock

from marketpilot_api.models import MarketQuoteSnapshot
from marketpilot_api.repositories.market_quote_snapshots import (
    list_latest_market_quote_snapshots,
    list_market_quote_snapshots,
    record_market_quote_snapshots,
)
from marketpilot_api.repositories.price_quotes import MarketQuote


def test_record_market_quote_snapshots_stores_collected_quotes() -> None:
    session = MagicMock()
    collected_at = datetime(2026, 7, 2, tzinfo=timezone.utc)
    quotes = [
        MarketQuote(
            symbol="AAPL",
            currency="USD",
            current_price=Decimal("294.3800"),
            source="finnhub",
            collected_at=collected_at,
        ),
        MarketQuote(
            symbol="MISSING",
            currency="USD",
            current_price=Decimal("0"),
            source="unknown",
            collected_at=None,
        ),
    ]

    result = record_market_quote_snapshots(session, quotes=quotes)

    assert len(result.snapshots) == 1
    assert result.skipped_count == 1
    snapshot = result.snapshots[0]
    assert snapshot.symbol == "AAPL"
    assert snapshot.currency == "USD"
    assert snapshot.current_price == Decimal("294.3800")
    assert snapshot.source == "finnhub"
    assert snapshot.collected_at == collected_at
    session.add_all.assert_called_once_with(result.snapshots)
    session.commit.assert_called_once()


def test_record_market_quote_snapshots_skips_commit_when_empty() -> None:
    session = MagicMock()

    result = record_market_quote_snapshots(session, quotes=[])

    assert result.snapshots == []
    assert result.skipped_count == 0
    session.add_all.assert_not_called()
    session.commit.assert_not_called()


def test_list_market_quote_snapshots_filters_and_limits_results() -> None:
    snapshot = MarketQuoteSnapshot(
        symbol="AAPL",
        currency="USD",
        current_price=Decimal("294.3800"),
        source="finnhub",
        collected_at=datetime(2026, 7, 2, tzinfo=timezone.utc),
    )
    session = MagicMock()
    session.scalars.return_value.all.return_value = [snapshot]

    result = list_market_quote_snapshots(
        session,
        currency="usd",
        symbols=[" aapl ", "nvda"],
        limit=20,
    )

    assert result == [snapshot]
    statement = session.scalars.call_args.args[0]
    compiled_params = statement.compile().params
    assert "USD" in compiled_params.values()
    assert ["AAPL", "NVDA"] in compiled_params.values()
    assert 20 in compiled_params.values()


def test_list_latest_market_quote_snapshots_returns_one_per_symbol() -> None:
    older_snapshot = MarketQuoteSnapshot(
        symbol="AAPL",
        currency="USD",
        current_price=Decimal("290.0000"),
        source="finnhub",
        collected_at=datetime(2026, 7, 1, tzinfo=timezone.utc),
    )
    latest_snapshot = MarketQuoteSnapshot(
        symbol="AAPL",
        currency="USD",
        current_price=Decimal("294.3800"),
        source="finnhub",
        collected_at=datetime(2026, 7, 2, tzinfo=timezone.utc),
    )
    nvda_snapshot = MarketQuoteSnapshot(
        symbol="NVDA",
        currency="USD",
        current_price=Decimal("125.0000"),
        source="fixture",
        collected_at=datetime(2026, 7, 2, tzinfo=timezone.utc),
    )
    session = MagicMock()
    session.scalars.return_value.all.return_value = [
        latest_snapshot,
        nvda_snapshot,
        older_snapshot,
    ]

    result = list_latest_market_quote_snapshots(
        session,
        currency="USD",
        symbols=["AAPL", "NVDA"],
    )

    assert result == [latest_snapshot, nvda_snapshot]
