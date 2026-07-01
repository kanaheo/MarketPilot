from dataclasses import dataclass
from decimal import Decimal

FixtureFxRateKey = tuple[str, str]


@dataclass(frozen=True)
class FxRate:
    base_currency: str
    quote_currency: str
    rate: Decimal
    source: str


FIXTURE_FX_RATES: dict[FixtureFxRateKey, Decimal] = {
    ("USD", "KRW"): Decimal("1380.000000"),
    ("USD", "JPY"): Decimal("160.000000"),
    ("JPY", "KRW"): Decimal("8.625000"),
}


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
    )
