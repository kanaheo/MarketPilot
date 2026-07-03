from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock

from marketpilot_api.commands import collect_market_quotes
from marketpilot_api.repositories.market_quote_snapshots import (
    MarketQuoteSnapshotCollection,
)
from marketpilot_api.repositories.price_quotes import MarketQuote


class FakeSession:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, traceback) -> None:
        return None


def test_collect_market_quotes_command_records_quotes(
    capsys,
    monkeypatch,
) -> None:
    collected_at = datetime(2026, 7, 2, tzinfo=timezone.utc)
    quote = MarketQuote(
        symbol="AAPL",
        currency="USD",
        current_price=Decimal("294.3800"),
        source="finnhub",
        collected_at=collected_at,
    )
    list_mock = MagicMock(return_value=[quote])
    record_mock = MagicMock(
        return_value=MarketQuoteSnapshotCollection(
            snapshots=[object()],
            skipped_count=0,
        )
    )
    session = FakeSession()
    monkeypatch.setattr(collect_market_quotes, "list_market_quotes", list_mock)
    monkeypatch.setattr(
        collect_market_quotes,
        "record_market_quote_snapshots",
        record_mock,
    )
    monkeypatch.setattr(collect_market_quotes, "SessionLocal", lambda: session)

    exit_code = collect_market_quotes.main(
        ["--symbols", "aapl", "nvda", "--currency", "USD"]
    )

    output = capsys.readouterr().out
    assert exit_code == 0
    assert "requested_count=2" in output
    assert "returned_count=1" in output
    assert "stored_count=1" in output
    assert "skipped_count=0" in output
    assert "quote=AAPL,USD,294.3800,finnhub,2026-07-02T00:00:00+00:00" in output
    list_mock.assert_called_once_with(
        currency="USD",
        symbols=["aapl", "nvda"],
    )
    record_mock.assert_called_once_with(session, quotes=[quote])
