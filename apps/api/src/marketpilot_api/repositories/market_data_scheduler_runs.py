from dataclasses import dataclass
from datetime import datetime

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from marketpilot_api.commands.collect_market_quotes import CollectionRunResult
from marketpilot_api.models import MarketDataSchedulerRun


@dataclass(frozen=True)
class SchedulerRunStart:
    job_name: str
    symbols_source: str
    currency: str | None
    interval_policy: str
    market_phase: str
    next_interval_seconds: int
    freshness_seconds: int | None
    started_at: datetime


def list_market_data_scheduler_runs(
    session: Session,
    *,
    job_name: str | None = None,
    status: str | None = None,
    limit: int = 50,
) -> list[MarketDataSchedulerRun]:
    statement = _build_market_data_scheduler_runs_query(
        job_name=job_name,
        status=status,
        limit=limit,
    )

    return list(session.scalars(statement).all())


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
        interval_policy=run_start.interval_policy,
        market_phase=run_start.market_phase,
        next_interval_seconds=run_start.next_interval_seconds,
        freshness_seconds=run_start.freshness_seconds,
        started_at=run_start.started_at,
    )
    session.add(scheduler_run)
    session.commit()

    return scheduler_run


def _build_market_data_scheduler_runs_query(
    *,
    job_name: str | None = None,
    status: str | None = None,
    limit: int = 50,
) -> Select[tuple[MarketDataSchedulerRun]]:
    statement = select(MarketDataSchedulerRun)
    normalized_status = status.strip().lower() if status is not None else None
    normalized_job_name = job_name.strip() if job_name is not None else None

    if normalized_job_name:
        statement = statement.where(
            MarketDataSchedulerRun.job_name == normalized_job_name
        )
    if normalized_status:
        statement = statement.where(
            MarketDataSchedulerRun.status == normalized_status
        )

    return statement.order_by(
        MarketDataSchedulerRun.started_at.desc(),
        MarketDataSchedulerRun.created_at.desc(),
    ).limit(limit)


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
