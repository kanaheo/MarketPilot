from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock

from marketpilot_api.commands.collect_market_quotes import CollectionRunResult
from marketpilot_api.models import MarketDataSchedulerRun
from marketpilot_api.repositories.market_data_scheduler_runs import (
    SchedulerRunStart,
    list_market_data_scheduler_runs,
    mark_market_data_scheduler_run_failed,
    mark_market_data_scheduler_run_succeeded,
    start_market_data_scheduler_run,
)
from marketpilot_api.repositories.price_quotes import MarketQuote


class FakeSession:
    def __init__(self) -> None:
        self.add = MagicMock()
        self.commit = MagicMock()

    def merge(self, value):
        return value


def test_start_market_data_scheduler_run_records_running_state() -> None:
    session = FakeSession()
    started_at = datetime(2026, 7, 8, 9, tzinfo=timezone.utc)

    scheduler_run = start_market_data_scheduler_run(
        session,
        run_start=SchedulerRunStart(
            job_name="market-quote-scheduler",
            symbols_source="holdings",
            currency="usd",
            started_at=started_at,
        ),
    )

    assert scheduler_run.job_name == "market-quote-scheduler"
    assert scheduler_run.status == "running"
    assert scheduler_run.symbols_source == "holdings"
    assert scheduler_run.currency == "USD"
    assert scheduler_run.started_at == started_at
    session.add.assert_called_once_with(scheduler_run)
    session.commit.assert_called_once()


def test_list_market_data_scheduler_runs_filters_and_limits_results() -> None:
    scheduler_run = MarketDataSchedulerRun(
        job_name="market-quote-scheduler",
        status="succeeded",
        symbols_source="holdings",
        currency="USD",
        started_at=datetime(2026, 7, 8, 9, tzinfo=timezone.utc),
    )
    session = MagicMock()
    session.scalars.return_value.all.return_value = [scheduler_run]

    result = list_market_data_scheduler_runs(
        session,
        job_name=" market-quote-scheduler ",
        status="SUCCEEDED",
        limit=20,
    )

    assert result == [scheduler_run]
    statement = session.scalars.call_args.args[0]
    compiled_params = statement.compile().params
    assert "market-quote-scheduler" in compiled_params.values()
    assert "succeeded" in compiled_params.values()
    assert 20 in compiled_params.values()


def test_mark_market_data_scheduler_run_succeeded_stores_counts() -> None:
    session = FakeSession()
    started_at = datetime(2026, 7, 8, 9, tzinfo=timezone.utc)
    completed_at = datetime(2026, 7, 8, 9, 1, tzinfo=timezone.utc)
    scheduler_run = start_market_data_scheduler_run(
        session,
        run_start=SchedulerRunStart(
            job_name="market-quote-scheduler",
            symbols_source="arguments",
            currency="USD",
            started_at=started_at,
        ),
    )
    result = CollectionRunResult(
        run_number=1,
        dry_run=False,
        symbols_source="arguments",
        requested_count=2,
        collectable_count=1,
        fresh_skipped_count=1,
        returned_count=1,
        stored_count=1,
        skipped_count=0,
        quotes=[
            MarketQuote(
                symbol="AAPL",
                currency="USD",
                current_price=Decimal("294.3800"),
                source="finnhub",
                collected_at=completed_at,
            )
        ],
    )

    updated_run = mark_market_data_scheduler_run_succeeded(
        session,
        scheduler_run=scheduler_run,
        completed_at=completed_at,
        result=result,
    )

    assert updated_run.status == "succeeded"
    assert updated_run.completed_at == completed_at
    assert updated_run.requested_count == 2
    assert updated_run.collectable_count == 1
    assert updated_run.fresh_skipped_count == 1
    assert updated_run.returned_count == 1
    assert updated_run.stored_count == 1
    assert updated_run.skipped_count == 0
    assert updated_run.error_message is None


def test_mark_market_data_scheduler_run_failed_stores_error_message() -> None:
    session = FakeSession()
    scheduler_run = start_market_data_scheduler_run(
        session,
        run_start=SchedulerRunStart(
            job_name="market-quote-scheduler",
            symbols_source="holdings",
            currency=None,
            started_at=datetime(2026, 7, 8, 9, tzinfo=timezone.utc),
        ),
    )
    completed_at = datetime(2026, 7, 8, 9, 1, tzinfo=timezone.utc)

    updated_run = mark_market_data_scheduler_run_failed(
        session,
        scheduler_run=scheduler_run,
        completed_at=completed_at,
        error_message="provider unavailable",
    )

    assert updated_run.status == "failed"
    assert updated_run.completed_at == completed_at
    assert updated_run.error_message == "provider unavailable"
