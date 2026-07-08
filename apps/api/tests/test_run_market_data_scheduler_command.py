from datetime import datetime, timezone
from unittest.mock import MagicMock

from marketpilot_api.commands import run_market_data_scheduler
from marketpilot_api.commands.collect_market_quotes import CollectionRunResult


class FakeSession:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, traceback) -> None:
        return None


def test_run_market_data_scheduler_records_success(
    capsys,
    monkeypatch,
) -> None:
    scheduler_run = object()
    start_mock = MagicMock(return_value=scheduler_run)
    success_mock = MagicMock()
    failure_mock = MagicMock()
    collect_mock = MagicMock(
        return_value=CollectionRunResult(
            run_number=1,
            dry_run=True,
            symbols_source="arguments",
            requested_count=2,
            collectable_count=2,
            fresh_skipped_count=0,
            returned_count=0,
            stored_count=0,
            skipped_count=0,
            quotes=[],
        )
    )
    session = FakeSession()
    now_values = [
        datetime(2026, 7, 8, 9, tzinfo=timezone.utc),
        datetime(2026, 7, 8, 9, 1, tzinfo=timezone.utc),
    ]

    monkeypatch.setattr(run_market_data_scheduler, "SessionLocal", lambda: session)
    monkeypatch.setattr(
        run_market_data_scheduler,
        "start_market_data_scheduler_run",
        start_mock,
    )
    monkeypatch.setattr(
        run_market_data_scheduler,
        "mark_market_data_scheduler_run_succeeded",
        success_mock,
    )
    monkeypatch.setattr(
        run_market_data_scheduler,
        "mark_market_data_scheduler_run_failed",
        failure_mock,
    )
    monkeypatch.setattr(run_market_data_scheduler, "collect_once", collect_mock)

    exit_code = run_market_data_scheduler.main(
        [
            "--symbols",
            "aapl",
            "nvda",
            "--currency",
            "USD",
            "--skip-fresh-seconds",
            "300",
            "--dry-run",
        ],
        now=lambda: now_values.pop(0),
    )

    output = capsys.readouterr().out
    assert exit_code == 0
    assert "status=succeeded" in output
    assert "requested_count=2" in output
    start_mock.assert_called_once()
    collect_args = collect_mock.call_args.kwargs["args"]
    assert collect_args.symbols == ["aapl", "nvda"]
    assert collect_args.currency == "USD"
    assert collect_args.skip_fresh_seconds == 300
    assert collect_args.dry_run is True
    success_mock.assert_called_once()
    failure_mock.assert_not_called()


def test_run_market_data_scheduler_records_failure(
    capsys,
    monkeypatch,
) -> None:
    scheduler_run = object()
    start_mock = MagicMock(return_value=scheduler_run)
    success_mock = MagicMock()
    failure_mock = MagicMock()
    collect_mock = MagicMock(side_effect=RuntimeError("provider unavailable"))
    session = FakeSession()
    now_values = [
        datetime(2026, 7, 8, 9, tzinfo=timezone.utc),
        datetime(2026, 7, 8, 9, 1, tzinfo=timezone.utc),
    ]

    monkeypatch.setattr(run_market_data_scheduler, "SessionLocal", lambda: session)
    monkeypatch.setattr(
        run_market_data_scheduler,
        "start_market_data_scheduler_run",
        start_mock,
    )
    monkeypatch.setattr(
        run_market_data_scheduler,
        "mark_market_data_scheduler_run_succeeded",
        success_mock,
    )
    monkeypatch.setattr(
        run_market_data_scheduler,
        "mark_market_data_scheduler_run_failed",
        failure_mock,
    )
    monkeypatch.setattr(run_market_data_scheduler, "collect_once", collect_mock)

    exit_code = run_market_data_scheduler.main(
        ["--from-holdings", "--currency", "USD"],
        now=lambda: now_values.pop(0),
    )

    output = capsys.readouterr().out
    assert exit_code == 1
    assert "status=failed" in output
    assert "error=provider unavailable" in output
    success_mock.assert_not_called()
    failure_mock.assert_called_once()
