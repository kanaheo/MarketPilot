from dataclasses import dataclass
from datetime import datetime

from sqlalchemy.orm import Session

from marketpilot_api.commands.collect_market_quotes import CollectionRunResult
from marketpilot_api.models import MarketDataSchedulerRun


@dataclass(frozen=True)
class SchedulerRunStart:
    job_name: str
    symbols_source: str
    currency: str | None
    started_at: datetime


def start_market_data_scheduler_run(
    session: Session,
    *,
    run_start: SchedulerRunStart,
) -> MarketDataSchedulerRun:
    scheduler_run = MarketDataSchedulerRun(
        job_name=run_start.job_name,
        status="running",
        symbols_source=run_start.symbols_source,
        currency=(
            run_start.currency.upper()
            if run_start.currency is not None
            else None
        ),
        started_at=run_start.started_at,
    )
    session.add(scheduler_run)
    session.commit()

    return scheduler_run


def mark_market_data_scheduler_run_succeeded(
    session: Session,
    *,
    scheduler_run: MarketDataSchedulerRun,
    completed_at: datetime,
    result: CollectionRunResult,
) -> MarketDataSchedulerRun:
    scheduler_run = session.merge(scheduler_run)
    scheduler_run.status = "succeeded"
    scheduler_run.completed_at = completed_at
    scheduler_run.requested_count = result.requested_count
    scheduler_run.collectable_count = result.collectable_count
    scheduler_run.fresh_skipped_count = result.fresh_skipped_count
    scheduler_run.returned_count = result.returned_count
    scheduler_run.stored_count = result.stored_count
    scheduler_run.skipped_count = result.skipped_count
    scheduler_run.error_message = None
    session.commit()

    return scheduler_run


def mark_market_data_scheduler_run_failed(
    session: Session,
    *,
    scheduler_run: MarketDataSchedulerRun,
    completed_at: datetime,
    error_message: str,
) -> MarketDataSchedulerRun:
    scheduler_run = session.merge(scheduler_run)
    scheduler_run.status = "failed"
    scheduler_run.completed_at = completed_at
    scheduler_run.error_message = error_message[:1000]
    session.commit()

    return scheduler_run
