from decimal import Decimal

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
