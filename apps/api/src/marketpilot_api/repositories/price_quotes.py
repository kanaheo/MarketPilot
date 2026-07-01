from decimal import Decimal
from typing import Iterable

FixturePriceKey = tuple[str, str]

FIXTURE_CURRENT_PRICES: dict[FixturePriceKey, Decimal] = {
    ("AAPL", "USD"): Decimal("195.0000"),
    ("NVDA", "USD"): Decimal("125.0000"),
    ("7203", "JPY"): Decimal("2800.0000"),
}


def get_fixture_current_price(
    *,
    symbol: str,
    currency: str,
) -> Decimal | None:
    return FIXTURE_CURRENT_PRICES.get((symbol.upper(), currency.upper()))


def list_fixture_current_prices(
    *,
    currency: str | None = None,
    symbols: Iterable[str] | None = None,
) -> list[tuple[str, str, Decimal]]:
    normalized_currency = currency.upper() if currency is not None else None
    normalized_symbols = (
        {symbol.upper() for symbol in symbols}
        if symbols is not None
        else None
    )

    quotes: list[tuple[str, str, Decimal]] = []
    for (symbol, quote_currency), current_price in FIXTURE_CURRENT_PRICES.items():
        if normalized_currency is not None and quote_currency != normalized_currency:
            continue
        if normalized_symbols is not None and symbol not in normalized_symbols:
            continue
        quotes.append((symbol, quote_currency, current_price))

    return sorted(quotes, key=lambda quote: (quote[1], quote[0]))
