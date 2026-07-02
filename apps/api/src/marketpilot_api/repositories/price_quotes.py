import json
import os
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Callable, Iterable, Mapping, Protocol
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from pydantic import SecretStr

from marketpilot_api.core.config import Settings
from marketpilot_api.core.config import get_settings

FixturePriceKey = tuple[str, str]
MarketQuoteCacheKey = tuple[str | None, tuple[str, ...] | None]
FinnhubQuoteTransport = Callable[[str, SecretStr], Mapping[str, object]]
FINNHUB_QUOTE_URL = "https://finnhub.io/api/v1/quote"


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


class FinnhubMarketQuoteProvider:
    def __init__(
        self,
        *,
        api_key: SecretStr,
        transport: FinnhubQuoteTransport | None = None,
    ) -> None:
        self._api_key = api_key
        self._transport = transport or _fetch_finnhub_quote_payload

    def list_market_quotes(
        self,
        *,
        currency: str | None = None,
        symbols: Iterable[str] | None = None,
    ) -> list[MarketQuote]:
        normalized_currency = currency.upper() if currency is not None else None
        if normalized_currency is not None and normalized_currency != "USD":
            return []

        normalized_symbols = _normalize_symbols(symbols)
        if len(normalized_symbols) == 0:
            return []

        quotes: list[MarketQuote] = []
        for symbol in normalized_symbols:
            payload = self._transport(symbol, self._api_key)
            quote = _parse_finnhub_quote_payload(symbol=symbol, payload=payload)
            if quote is not None:
                quotes.append(quote)

        return sorted(quotes, key=lambda quote: (quote.currency, quote.symbol))


FIXTURE_CURRENT_PRICES: dict[FixturePriceKey, Decimal] = {
    ("AAPL", "USD"): Decimal("195.0000"),
    ("NVDA", "USD"): Decimal("125.0000"),
    ("7203", "JPY"): Decimal("2800.0000"),
}
FIXTURE_QUOTE_COLLECTED_AT = datetime(2026, 7, 1, tzinfo=timezone.utc)
_fixture_provider = FixtureMarketQuoteProvider()
_external_provider: MarketQuoteProvider | None = None
_external_provider_is_configured = False
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
    global _external_provider_is_configured

    _external_provider = provider
    _external_provider_is_configured = True
    clear_market_quote_cache()


def clear_market_quote_cache() -> None:
    _quote_cache.clear()


def _fetch_uncached_market_quotes(
    *,
    currency: str | None = None,
    symbols: Iterable[str] | None = None,
) -> list[MarketQuote]:
    provider = _get_external_market_quote_provider()
    if provider is not None:
        try:
            quotes = provider.list_market_quotes(
                currency=currency,
                symbols=symbols,
            )
        except Exception:
            quotes = []

        if len(quotes) > 0:
            return sorted(quotes, key=lambda quote: (quote.currency, quote.symbol))

    return _fixture_provider.list_market_quotes(currency=currency, symbols=symbols)


def _get_external_market_quote_provider() -> MarketQuoteProvider | None:
    if _external_provider_is_configured:
        return _external_provider

    return _get_settings_market_quote_provider(settings=get_settings())


def _get_settings_market_quote_provider(
    *,
    settings: Settings,
) -> MarketQuoteProvider | None:
    if os.environ.get("PYTEST_CURRENT_TEST") is not None:
        return None
    if settings.market_data_quote_provider != "finnhub":
        return None
    if settings.finnhub_api_key is None:
        return None

    return FinnhubMarketQuoteProvider(api_key=settings.finnhub_api_key)


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


def _normalize_symbols(symbols: Iterable[str] | None) -> tuple[str, ...]:
    if symbols is None:
        return ()

    return tuple(
        sorted(
            {
                symbol.strip().upper()
                for symbol in symbols
                if len(symbol.strip()) > 0
            }
        )
    )


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


def _fetch_finnhub_quote_payload(
    symbol: str,
    api_key: SecretStr,
) -> Mapping[str, object]:
    query = urlencode(
        {
            "symbol": symbol,
            "token": api_key.get_secret_value(),
        }
    )
    request = Request(
        f"{FINNHUB_QUOTE_URL}?{query}",
        headers={
            "Accept": "application/json",
            "User-Agent": "MarketPilot API",
        },
    )
    with urlopen(request, timeout=5) as response:
        payload = json.load(response)

    if not isinstance(payload, dict):
        return {}

    return payload


def _parse_finnhub_quote_payload(
    *,
    symbol: str,
    payload: Mapping[str, object],
) -> MarketQuote | None:
    current_price = _parse_decimal(payload.get("c"))
    if current_price is None or current_price <= Decimal("0"):
        return None

    collected_at = _parse_unix_timestamp(payload.get("t"))
    if collected_at is None:
        return None

    return MarketQuote(
        symbol=symbol.upper(),
        currency="USD",
        current_price=current_price,
        source="finnhub",
        collected_at=collected_at,
    )


def _parse_decimal(value: object) -> Decimal | None:
    if value is None:
        return None

    try:
        return Decimal(str(value))
    except Exception:
        return None


def _parse_unix_timestamp(value: object) -> datetime | None:
    if value is None:
        return None

    try:
        timestamp = int(str(value))
    except ValueError:
        return None

    if timestamp <= 0:
        return None

    return datetime.fromtimestamp(timestamp, tz=timezone.utc)
