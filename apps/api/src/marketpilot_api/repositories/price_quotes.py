from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal
from typing import Iterable

FixturePriceKey = tuple[str, str]


@dataclass(frozen=True)
class MarketQuote:
    symbol: str
    currency: str
    current_price: Decimal
    source: str
    collected_at: datetime | None


FIXTURE_CURRENT_PRICES: dict[FixturePriceKey, Decimal] = {
    ("AAPL", "USD"): Decimal("195.0000"),
    ("NVDA", "USD"): Decimal("125.0000"),
    ("7203", "JPY"): Decimal("2800.0000"),
}
FIXTURE_QUOTE_COLLECTED_AT = datetime(2026, 7, 1, tzinfo=timezone.utc)


def get_fixture_current_price(
    *,
    symbol: str,
    currency: str,
) -> Decimal | None:
    return FIXTURE_CURRENT_PRICES.get((symbol.upper(), currency.upper()))


def get_current_price(
    *,
    symbol: str,
    currency: str,
) -> Decimal | None:
    return get_fixture_current_price(symbol=symbol, currency=currency)


def get_market_quote(
    *,
    symbol: str,
    currency: str | None = None,
) -> MarketQuote | None:
    quotes = list_market_quotes(currency=currency, symbols=[symbol])
    if len(quotes) != 1:
        return None

    return quotes[0]


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


def list_market_quotes(
    *,
    currency: str | None = None,
    symbols: Iterable[str] | None = None,
) -> list[MarketQuote]:
    return [
        MarketQuote(
            symbol=symbol,
            currency=quote_currency,
            current_price=current_price,
            source="fixture",
            collected_at=FIXTURE_QUOTE_COLLECTED_AT,
        )
        for symbol, quote_currency, current_price in list_fixture_current_prices(
            currency=currency,
            symbols=symbols,
        )
    ]
