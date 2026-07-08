import argparse
from collections.abc import Sequence
from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime, timezone
from time import sleep as default_sleep

from sqlalchemy.orm import Session

from marketpilot_api.db.session import SessionLocal
from marketpilot_api.repositories.market_quote_snapshots import (
    filter_fresh_market_quote_symbols,
    record_market_quote_snapshots,
)
from marketpilot_api.repositories.positions import list_open_position_symbols
from marketpilot_api.repositories.price_quotes import list_market_quotes

Sleep = Callable[[int], None]


@dataclass(frozen=True)
class CollectionCommandArgs:
    symbols: list[str] | None
    from_holdings: bool
    currency: str | None
    interval_seconds: int | None
    max_runs: int | None
    skip_fresh_seconds: int | None
    dry_run: bool


def main(
    argv: Sequence[str] | None = None,
    *,
    sleep: Sleep = default_sleep,
) -> int:
    args = _parse_args(argv)
    run_count = 0

    while True:
        run_count += 1
        _collect_once(args=args, run_number=run_count)

        if args.max_runs is not None and run_count >= args.max_runs:
            break
        if args.interval_seconds is None:
            break

        sleep(args.interval_seconds)

    return 0


def _parse_args(argv: Sequence[str] | None) -> CollectionCommandArgs:
    parser = argparse.ArgumentParser(
        prog="collect-market-quotes",
        description="Collect market quote snapshots through the backend provider boundary.",
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
        "--currency",
        default=None,
        help="Optional quote currency filter, for example: USD",
    )
    parser.add_argument(
        "--interval-seconds",
        type=_positive_int,
        default=None,
        help=(
            "Optional delay between collection runs. "
            "Omit it for a single collection."
        ),
    )
    parser.add_argument(
        "--max-runs",
        type=_positive_int,
        default=None,
        help=(
            "Optional number of collection runs before stopping. "
            "Use with --interval-seconds for bounded local polling."
        ),
    )
    parser.add_argument(
        "--skip-fresh-seconds",
        type=_positive_int,
        default=None,
        help=(
            "Skip symbols that already have a latest quote snapshot collected "
            "within this many seconds."
        ),
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help=(
            "Resolve and filter symbols, then print what would be collected "
            "without calling the quote provider or writing snapshots."
        ),
    )
    args = parser.parse_args(argv)
    if args.max_runs is not None and args.interval_seconds is None:
        parser.error("--max-runs requires --interval-seconds")

    return CollectionCommandArgs(
        symbols=args.symbols,
        from_holdings=args.from_holdings,
        currency=args.currency,
        interval_seconds=args.interval_seconds,
        max_runs=args.max_runs,
        skip_fresh_seconds=args.skip_fresh_seconds,
        dry_run=args.dry_run,
    )


def _collect_once(
    *,
    args: CollectionCommandArgs,
    run_number: int,
) -> None:
    with SessionLocal() as session:
        symbols = _resolve_collection_symbols(session=session, args=args)
        collectable_symbols = _filter_fresh_symbols(
            session=session,
            symbols=symbols,
            args=args,
            now=datetime.now(timezone.utc),
        )
        if args.dry_run or len(collectable_symbols) == 0:
            quotes = []
            stored_count = 0
            skipped_count = 0
        else:
            quotes = list_market_quotes(
                currency=args.currency,
                symbols=collectable_symbols,
            )
            collection = record_market_quote_snapshots(session, quotes=quotes)
            stored_count = len(collection.snapshots)
            skipped_count = collection.skipped_count

    print(f"run={run_number}")
    print(f"dry_run={args.dry_run}")
    print(
        "symbols_source="
        f"{'holdings' if args.from_holdings else 'arguments'}"
    )
    print(f"requested_count={len(symbols)}")
    print(f"collectable_count={len(collectable_symbols)}")
    print(f"fresh_skipped_count={len(symbols) - len(collectable_symbols)}")
    print(f"returned_count={len(quotes)}")
    print(f"stored_count={stored_count}")
    print(f"skipped_count={skipped_count}")
    for quote in quotes:
        print(
            "quote="
            f"{quote.symbol},"
            f"{quote.currency},"
            f"{quote.current_price},"
            f"{quote.source},"
            f"{quote.collected_at.isoformat() if quote.collected_at else None}"
        )


def _resolve_collection_symbols(
    *,
    session: Session,
    args: CollectionCommandArgs,
) -> list[str]:
    if args.symbols is not None:
        return args.symbols

    return list_open_position_symbols(
        session,
        currency=args.currency,
    )


def _filter_fresh_symbols(
    *,
    session: Session,
    symbols: list[str],
    args: CollectionCommandArgs,
    now: datetime,
) -> list[str]:
    if args.skip_fresh_seconds is None or len(symbols) == 0:
        return symbols

    return filter_fresh_market_quote_symbols(
        session,
        currency=args.currency,
        freshness_seconds=args.skip_fresh_seconds,
        now=now,
        symbols=symbols,
    )


def _positive_int(value: str) -> int:
    parsed_value = int(value)
    if parsed_value < 1:
        raise argparse.ArgumentTypeError("must be greater than or equal to 1")

    return parsed_value


if __name__ == "__main__":
    raise SystemExit(main())
