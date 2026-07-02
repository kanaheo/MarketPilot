from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Iterable, Protocol

from marketpilot_api.core.config import get_settings

FixturePriceKey = tuple[str, str]
MarketQuoteCacheKey = tuple[str | None, tuple[str, ...] | None]


@dataclass(frozen=True)
class MarketQuote:
    symbol: str
    currency: str
    current_price: Decimal
    source: str
    collected_at: datetime | None


class MarketQuoteProvider(Protocol):
    def list_market_quotes(
        self,
        *,
        currency: str | None = None,
        symbols: Iterable[str] | None = None,
    ) -> list[MarketQuote]:
        ...


@dataclass(frozen=True)
class MarketQuoteCacheEntry:
    quotes: list[MarketQuote]
    expires_at: datetime


class FixtureMarketQuoteProvider:
    def list_market_quotes(
        self,
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


FIXTURE_CURRENT_PRICES: dict[FixturePriceKey, Decimal] = {
    ("AAPL", "USD"): Decimal("195.0000"),
    ("NVDA", "USD"): Decimal("125.0000"),
    ("7203", "JPY"): Decimal("2800.0000"),
}
FIXTURE_QUOTE_COLLECTED_AT = datetime(2026, 7, 1, tzinfo=timezone.utc)
_fixture_provider = FixtureMarketQuoteProvider()
_external_provider: MarketQuoteProvider | None = None
_quote_cache: dict[MarketQuoteCacheKey, MarketQuoteCacheEntry] = {}


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
    quote = get_market_quote(symbol=symbol, currency=currency)
    if quote is None:
        return None

    return quote.current_price


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
    cache_key = _get_market_quote_cache_key(currency=currency, symbols=symbols)
    now = datetime.now(timezone.utc)
    cached_quotes = _get_cached_market_quotes(cache_key=cache_key, now=now)
    if cached_quotes is not None:
        return cached_quotes

    quotes = _fetch_uncached_market_quotes(currency=currency, symbols=symbols)
    _set_cached_market_quotes(cache_key=cache_key, quotes=quotes, now=now)
    return quotes


def configure_market_quote_provider(
    provider: MarketQuoteProvider | None,
) -> None:
    global _external_provider

    _external_provider = provider
    clear_market_quote_cache()


def clear_market_quote_cache() -> None:
    _quote_cache.clear()


def _fetch_uncached_market_quotes(
    *,
    currency: str | None = None,
    symbols: Iterable[str] | None = None,
) -> list[MarketQuote]:
    if _external_provider is not None:
        try:
            quotes = _external_provider.list_market_quotes(
                currency=currency,
                symbols=symbols,
            )
        except Exception:
            quotes = []

        if len(quotes) > 0:
            return sorted(quotes, key=lambda quote: (quote.currency, quote.symbol))

    return _fixture_provider.list_market_quotes(currency=currency, symbols=symbols)


def _get_market_quote_cache_key(
    *,
    currency: str | None = None,
    symbols: Iterable[str] | None = None,
) -> MarketQuoteCacheKey:
    normalized_currency = currency.upper() if currency is not None else None
    normalized_symbols = (
        tuple(sorted({symbol.upper() for symbol in symbols}))
        if symbols is not None
        else None
    )
    return (normalized_currency, normalized_symbols)


def _get_cached_market_quotes(
    *,
    cache_key: MarketQuoteCacheKey,
    now: datetime,
) -> list[MarketQuote] | None:
    ttl_seconds = get_settings().market_data_cache_ttl_seconds
    if ttl_seconds <= 0:
        return None

    cached_entry = _quote_cache.get(cache_key)
    if cached_entry is None or cached_entry.expires_at <= now:
        return None

    return list(cached_entry.quotes)


def _set_cached_market_quotes(
    *,
    cache_key: MarketQuoteCacheKey,
    quotes: list[MarketQuote],
    now: datetime,
) -> None:
    ttl_seconds = get_settings().market_data_cache_ttl_seconds
    if ttl_seconds <= 0:
        return

    _quote_cache[cache_key] = MarketQuoteCacheEntry(
        quotes=list(quotes),
        expires_at=now + timedelta(seconds=ttl_seconds),
    )
