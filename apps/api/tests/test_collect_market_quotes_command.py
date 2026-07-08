from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock

import pytest

from marketpilot_api.commands import collect_market_quotes
from marketpilot_api.models import MarketQuoteSnapshot
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


def test_collect_market_quotes_command_repeats_with_interval(
    capsys,
    monkeypatch,
) -> None:
    collected_at = datetime(2026, 7, 2, tzinfo=timezone.utc)
    quote = MarketQuote(
        symbol="NVDA",
        currency="USD",
        current_price=Decimal("125.0000"),
        source="fixture",
        collected_at=collected_at,
    )
    list_mock = MagicMock(return_value=[quote])
    record_mock = MagicMock(
        return_value=MarketQuoteSnapshotCollection(
            snapshots=[object()],
            skipped_count=0,
        )
    )
    sleep_mock = MagicMock()
    session = FakeSession()
    monkeypatch.setattr(collect_market_quotes, "list_market_quotes", list_mock)
    monkeypatch.setattr(
        collect_market_quotes,
        "record_market_quote_snapshots",
        record_mock,
    )
    monkeypatch.setattr(collect_market_quotes, "SessionLocal", lambda: session)

    exit_code = collect_market_quotes.main(
        [
            "--symbols",
            "nvda",
            "--currency",
            "USD",
            "--interval-seconds",
            "300",
            "--max-runs",
            "2",
        ],
        sleep=sleep_mock,
    )

    output = capsys.readouterr().out
    assert exit_code == 0
    assert output.count("run=1") == 1
    assert output.count("run=2") == 1
    assert "run=1" in output
    assert "run=2" in output
    assert list_mock.call_count == 2
    assert record_mock.call_count == 2
    sleep_mock.assert_called_once_with(300)


def test_collect_market_quotes_command_collects_from_holdings(
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
    list_symbols_mock = MagicMock(return_value=["AAPL", "NVDA"])
    list_quotes_mock = MagicMock(return_value=[quote])
    record_mock = MagicMock(
        return_value=MarketQuoteSnapshotCollection(
            snapshots=[object()],
            skipped_count=0,
        )
    )
    session = FakeSession()
    monkeypatch.setattr(
        collect_market_quotes,
        "list_open_position_symbols",
        list_symbols_mock,
    )
    monkeypatch.setattr(
        collect_market_quotes,
        "list_market_quotes",
        list_quotes_mock,
    )
    monkeypatch.setattr(
        collect_market_quotes,
        "record_market_quote_snapshots",
        record_mock,
    )
    monkeypatch.setattr(collect_market_quotes, "SessionLocal", lambda: session)

    exit_code = collect_market_quotes.main(
        ["--from-holdings", "--currency", "USD"]
    )

    output = capsys.readouterr().out
    assert exit_code == 0
    assert "symbols_source=holdings" in output
    assert "requested_count=2" in output
    list_symbols_mock.assert_called_once_with(session, currency="USD")
    list_quotes_mock.assert_called_once_with(
        currency="USD",
        symbols=["AAPL", "NVDA"],
    )
    record_mock.assert_called_once_with(session, quotes=[quote])


def test_collect_market_quotes_command_skips_fresh_snapshots(
    capsys,
    monkeypatch,
) -> None:
    collected_at = datetime(2026, 7, 2, tzinfo=timezone.utc)
    quote = MarketQuote(
        symbol="NVDA",
        currency="USD",
        current_price=Decimal("125.0000"),
        source="finnhub",
        collected_at=collected_at,
    )
    fresh_snapshot = MarketQuoteSnapshot(
        symbol="AAPL",
        currency="USD",
        current_price=Decimal("294.3800"),
        source="finnhub",
        collected_at=collected_at,
    )
    filter_mock = MagicMock(return_value=["nvda"])
    list_quotes_mock = MagicMock(return_value=[quote])
    record_mock = MagicMock(
        return_value=MarketQuoteSnapshotCollection(
            snapshots=[object()],
            skipped_count=0,
        )
    )
    session = FakeSession()
    monkeypatch.setattr(
        collect_market_quotes,
        "filter_fresh_market_quote_symbols",
        filter_mock,
    )
    monkeypatch.setattr(
        collect_market_quotes,
        "list_market_quotes",
        list_quotes_mock,
    )
    monkeypatch.setattr(
        collect_market_quotes,
        "record_market_quote_snapshots",
        record_mock,
    )
    monkeypatch.setattr(collect_market_quotes, "SessionLocal", lambda: session)
    monkeypatch.setattr(
        collect_market_quotes,
        "datetime",
        MagicMock(
            now=MagicMock(
                return_value=datetime(2026, 7, 2, 0, 5, tzinfo=timezone.utc)
            ),
        ),
    )

    exit_code = collect_market_quotes.main(
        [
            "--symbols",
            "aapl",
            "nvda",
            "--currency",
            "USD",
            "--skip-fresh-seconds",
            "600",
        ]
    )

    output = capsys.readouterr().out
    assert exit_code == 0
    assert "requested_count=2" in output
    assert "fresh_skipped_count=1" in output
    filter_mock.assert_called_once_with(
        session,
        currency="USD",
        freshness_seconds=600,
        now=datetime(2026, 7, 2, 0, 5, tzinfo=timezone.utc),
        symbols=["aapl", "nvda"],
    )
    list_quotes_mock.assert_called_once_with(
        currency="USD",
        symbols=["nvda"],
    )
    record_mock.assert_called_once_with(session, quotes=[quote])


def test_collect_market_quotes_command_dry_run_does_not_collect_or_store(
    capsys,
    monkeypatch,
) -> None:
    list_quotes_mock = MagicMock()
    record_mock = MagicMock()
    session = FakeSession()
    monkeypatch.setattr(
        collect_market_quotes,
        "list_market_quotes",
        list_quotes_mock,
    )
    monkeypatch.setattr(
        collect_market_quotes,
        "record_market_quote_snapshots",
        record_mock,
    )
    monkeypatch.setattr(collect_market_quotes, "SessionLocal", lambda: session)

    exit_code = collect_market_quotes.main(
        ["--symbols", "aapl", "nvda", "--currency", "USD", "--dry-run"]
    )

    output = capsys.readouterr().out
    assert exit_code == 0
    assert "dry_run=True" in output
    assert "requested_count=2" in output
    assert "collectable_count=2" in output
    assert "returned_count=0" in output
    assert "stored_count=0" in output
    list_quotes_mock.assert_not_called()
    record_mock.assert_not_called()


def test_collect_market_quotes_command_skips_provider_when_no_symbols(
    capsys,
    monkeypatch,
) -> None:
    list_symbols_mock = MagicMock(return_value=[])
    list_quotes_mock = MagicMock()
    record_mock = MagicMock()
    session = FakeSession()
    monkeypatch.setattr(
        collect_market_quotes,
        "list_open_position_symbols",
        list_symbols_mock,
    )
    monkeypatch.setattr(
        collect_market_quotes,
        "list_market_quotes",
        list_quotes_mock,
    )
    monkeypatch.setattr(
        collect_market_quotes,
        "record_market_quote_snapshots",
        record_mock,
    )
    monkeypatch.setattr(collect_market_quotes, "SessionLocal", lambda: session)

    exit_code = collect_market_quotes.main(
        ["--from-holdings", "--currency", "USD"]
    )

    output = capsys.readouterr().out
    assert exit_code == 0
    assert "requested_count=0" in output
    assert "collectable_count=0" in output
    assert "returned_count=0" in output
    assert "stored_count=0" in output
    list_symbols_mock.assert_called_once_with(session, currency="USD")
    list_quotes_mock.assert_not_called()
    record_mock.assert_not_called()


def test_collect_market_quotes_command_requires_interval_for_max_runs(
    capsys,
) -> None:
    with pytest.raises(SystemExit) as exc_info:
        collect_market_quotes.main(["--symbols", "aapl", "--max-runs", "2"])

    assert exc_info.value.code == 2
    assert "--max-runs requires --interval-seconds" in capsys.readouterr().err
