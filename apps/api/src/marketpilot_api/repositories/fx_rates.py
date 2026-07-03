from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Protocol

from marketpilot_api.core.config import get_settings

FixtureFxRateKey = tuple[str, str]
FxRateCacheKey = tuple[str, str]


@dataclass(frozen=True)
class FxRate:
    base_currency: str
    quote_currency: str
    rate: Decimal
    source: str
    collected_at: datetime


class FxRateProvider(Protocol):
    def get_fx_rate(
        self,
        *,
        base_currency: str,
        quote_currency: str,
    ) -> FxRate | None:
        ...


@dataclass(frozen=True)
class FxRateCacheEntry:
    fx_rate: FxRate
    expires_at: datetime


class FixtureFxRateProvider:
    def get_fx_rate(
        self,
        *,
        base_currency: str,
        quote_currency: str,
    ) -> FxRate | None:
        rate = get_fixture_fx_rate(
            base_currency=base_currency,
            quote_currency=quote_currency,
        )
        if rate is None:
            return None

        return FxRate(
            base_currency=base_currency.upper(),
            quote_currency=quote_currency.upper(),
            rate=rate,
            source="fixture",
            collected_at=FIXTURE_FX_COLLECTED_AT,
        )


FIXTURE_FX_RATES: dict[FixtureFxRateKey, Decimal] = {
    ("USD", "KRW"): Decimal("1380.000000"),
    ("USD", "JPY"): Decimal("160.000000"),
    ("JPY", "KRW"): Decimal("8.625000"),
}
FIXTURE_FX_COLLECTED_AT = datetime(2026, 7, 1, tzinfo=timezone.utc)
_fixture_provider = FixtureFxRateProvider()
_external_provider: FxRateProvider | None = None
_fx_rate_cache: dict[FxRateCacheKey, FxRateCacheEntry] = {}


def get_fixture_fx_rate(
    *,
    base_currency: str,
    quote_currency: str,
) -> Decimal | None:
    normalized_base_currency = base_currency.upper()
    normalized_quote_currency = quote_currency.upper()

    if normalized_base_currency == normalized_quote_currency:
        return Decimal("1.000000")

    direct_rate = FIXTURE_FX_RATES.get(
        (normalized_base_currency, normalized_quote_currency)
    )
    if direct_rate is not None:
        return direct_rate

    inverse_rate = FIXTURE_FX_RATES.get(
        (normalized_quote_currency, normalized_base_currency)
    )
    if inverse_rate is None:
        return None

    return Decimal("1.000000") / inverse_rate


def get_fx_rate(
    *,
    base_currency: str,
    quote_currency: str,
) -> FxRate | None:
    cache_key = _get_fx_rate_cache_key(
        base_currency=base_currency,
        quote_currency=quote_currency,
    )
    now = datetime.now(timezone.utc)
    cached_fx_rate = _get_cached_fx_rate(cache_key=cache_key, now=now)
    if cached_fx_rate is not None:
        return cached_fx_rate

    fx_rate = _fetch_uncached_fx_rate(
        base_currency=base_currency,
        quote_currency=quote_currency,
    )
    if fx_rate is None:
        return None

    _set_cached_fx_rate(cache_key=cache_key, fx_rate=fx_rate, now=now)
    return fx_rate


def configure_fx_rate_provider(provider: FxRateProvider | None) -> None:
    global _external_provider

    _external_provider = provider
    clear_fx_rate_cache()


def clear_fx_rate_cache() -> None:
    _fx_rate_cache.clear()


def _fetch_uncached_fx_rate(
    *,
    base_currency: str,
    quote_currency: str,
) -> FxRate | None:
    if _external_provider is not None:
        try:
            fx_rate = _external_provider.get_fx_rate(
                base_currency=base_currency,
                quote_currency=quote_currency,
            )
        except Exception:
            fx_rate = None

        if fx_rate is not None:
            return fx_rate

    return _fixture_provider.get_fx_rate(
        base_currency=base_currency,
        quote_currency=quote_currency,
    )


def _get_fx_rate_cache_key(
    *,
    base_currency: str,
    quote_currency: str,
) -> FxRateCacheKey:
    return (base_currency.upper(), quote_currency.upper())


def _get_cached_fx_rate(
    *,
    cache_key: FxRateCacheKey,
    now: datetime,
) -> FxRate | None:
    ttl_seconds = get_settings().market_data_cache_ttl_seconds
    if ttl_seconds <= 0:
        return None

    cached_entry = _fx_rate_cache.get(cache_key)
    if cached_entry is None or cached_entry.expires_at <= now:
        return None

    return cached_entry.fx_rate


def _set_cached_fx_rate(
    *,
    cache_key: FxRateCacheKey,
    fx_rate: FxRate,
    now: datetime,
) -> None:
    ttl_seconds = get_settings().market_data_cache_ttl_seconds
    if ttl_seconds <= 0:
        return

    _fx_rate_cache[cache_key] = FxRateCacheEntry(
        fx_rate=fx_rate,
        expires_at=now + timedelta(seconds=ttl_seconds),
    )
