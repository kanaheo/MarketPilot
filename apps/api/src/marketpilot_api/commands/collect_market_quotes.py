import argparse
from collections.abc import Sequence

from marketpilot_api.db.session import SessionLocal
from marketpilot_api.repositories.market_quote_snapshots import (
    record_market_quote_snapshots,
)
from marketpilot_api.repositories.price_quotes import list_market_quotes


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="collect-market-quotes",
        description="Collect market quote snapshots through the backend provider boundary.",
    )
    parser.add_argument(
        "--symbols",
        nargs="+",
        required=True,
        help="One or more ticker symbols to collect, for example: AAPL NVDA",
    )
    parser.add_argument(
        "--currency",
        default=None,
        help="Optional quote currency filter, for example: USD",
    )
    args = parser.parse_args(argv)

    quotes = list_market_quotes(
        currency=args.currency,
        symbols=args.symbols,
    )
    with SessionLocal() as session:
        collection = record_market_quote_snapshots(session, quotes=quotes)

    print(f"requested_count={len(args.symbols)}")
    print(f"returned_count={len(quotes)}")
    print(f"stored_count={len(collection.snapshots)}")
    print(f"skipped_count={collection.skipped_count}")
    for quote in quotes:
        print(
            "quote="
            f"{quote.symbol},"
            f"{quote.currency},"
            f"{quote.current_price},"
            f"{quote.source},"
            f"{quote.collected_at.isoformat() if quote.collected_at else None}"
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
