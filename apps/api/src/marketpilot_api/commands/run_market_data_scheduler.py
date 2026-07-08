import argparse
from collections.abc import Callable, Sequence
from dataclasses import dataclass
from datetime import datetime, timezone
from time import sleep as default_sleep

from marketpilot_api.commands.collect_market_quotes import (
    CollectionCommandArgs,
    collect_once,
)
from marketpilot_api.db.session import SessionLocal
from marketpilot_api.repositories.market_data_scheduler_runs import (
    SchedulerRunStart,
    mark_market_data_scheduler_run_failed,
    mark_market_data_scheduler_run_succeeded,
    start_market_data_scheduler_run,
)

Sleep = Callable[[int], None]
Now = Callable[[], datetime]

DEFAULT_JOB_NAME = "market-quote-scheduler"


@dataclass(frozen=True)
class SchedulerCommandArgs:
    job_name: str
    symbols: list[str] | None
    from_holdings: bool
    currency: str | None
    interval_seconds: int | None
    max_runs: int
    skip_fresh_seconds: int | None
    dry_run: bool


def main(
    argv: Sequence[str] | None = None,
    *,
    sleep: Sleep = default_sleep,
    now: Now = lambda: datetime.now(timezone.utc),
) -> int:
    args = _parse_args(argv)
    exit_code = 0

    for run_number in range(1, args.max_runs + 1):
        succeeded = _run_scheduler_once(
            args=args,
            run_number=run_number,
            now=now,
        )
        if not succeeded:
            exit_code = 1

        if run_number < args.max_runs and args.interval_seconds is not None:
            sleep(args.interval_seconds)

    return exit_code


def _parse_args(argv: Sequence[str] | None) -> SchedulerCommandArgs:
    parser = argparse.ArgumentParser(
        prog="run-market-data-scheduler",
        description="Run the local market quote scheduler and record run logs.",
    )
    symbol_source_group = parser.add_mutually_exclusive_group(required=True)
    symbol_source_group.add_argument(
        "--symbols",
        nargs="+",
        help="One or more ticker symbols to collect, for example: AAPL NVDA",
    )
    symbol_source_group.add_argument(
        "--from-holdings",
        action="store_true",
        help="Collect symbols from currently open portfolio holdings.",
    )
    parser.add_argument(
        "--job-name",
        default=DEFAULT_JOB_NAME,
        help="Scheduler job name stored in run logs.",
    )
    parser.add_argument(
        "--currency",
        default=None,
        help="Optional quote currency filter, for example: USD",
    )
    parser.add_argument(
        "--interval-seconds",
        type=_positive_int,
        default=None,
        help="Optional delay between scheduler runs.",
    )
    parser.add_argument(
        "--max-runs",
        type=_positive_int,
        default=1,
        help="Number of scheduler runs before stopping. Defaults to 1.",
    )
    parser.add_argument(
        "--skip-fresh-seconds",
        type=_positive_int,
        default=None,
        help="Skip symbols with fresh snapshots collected within this many seconds.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Record scheduler logs without calling the quote provider or writing snapshots.",
    )
    args = parser.parse_args(argv)
    if args.interval_seconds is None and args.max_runs > 1:
        parser.error("--max-runs greater than 1 requires --interval-seconds")

    return SchedulerCommandArgs(
        job_name=args.job_name,
        symbols=args.symbols,
        from_holdings=args.from_holdings,
        currency=args.currency,
        interval_seconds=args.interval_seconds,
        max_runs=args.max_runs,
        skip_fresh_seconds=args.skip_fresh_seconds,
        dry_run=args.dry_run,
    )


def _run_scheduler_once(
    *,
    args: SchedulerCommandArgs,
    run_number: int,
    now: Now,
) -> bool:
    symbols_source = "holdings" if args.from_holdings else "arguments"
    with SessionLocal() as session:
        scheduler_run = start_market_data_scheduler_run(
            session,
            run_start=SchedulerRunStart(
                job_name=args.job_name,
                symbols_source=symbols_source,
                currency=args.currency,
                started_at=now(),
            ),
        )

    try:
        result = collect_once(
            args=CollectionCommandArgs(
                symbols=args.symbols,
                from_holdings=args.from_holdings,
                currency=args.currency,
                interval_seconds=None,
                max_runs=None,
                skip_fresh_seconds=args.skip_fresh_seconds,
                dry_run=args.dry_run,
            ),
            run_number=run_number,
        )
    except Exception as exc:
        error_message = str(exc)
        with SessionLocal() as session:
            mark_market_data_scheduler_run_failed(
                session,
                scheduler_run=scheduler_run,
                completed_at=now(),
                error_message=error_message,
            )
        print(f"run={run_number}")
        print("status=failed")
        print(f"error={error_message}")
        return False

    with SessionLocal() as session:
        mark_market_data_scheduler_run_succeeded(
            session,
            scheduler_run=scheduler_run,
            completed_at=now(),
            result=result,
        )

    print(f"run={run_number}")
    print("status=succeeded")
    print(f"requested_count={result.requested_count}")
    print(f"fresh_skipped_count={result.fresh_skipped_count}")
    print(f"stored_count={result.stored_count}")

    return True


def _positive_int(value: str) -> int:
    parsed_value = int(value)
    if parsed_value < 1:
        raise argparse.ArgumentTypeError("must be greater than or equal to 1")

    return parsed_value


if __name__ == "__main__":
    raise SystemExit(main())
