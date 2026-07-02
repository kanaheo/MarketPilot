from datetime import datetime, timezone
from decimal import Decimal
from typing import Iterable

from fastapi.testclient import TestClient
from pydantic import SecretStr
import pytest

from marketpilot_api.main import app
from marketpilot_api.repositories.fx_rates import (
    FxRate,
    configure_fx_rate_provider,
)
from marketpilot_api.repositories.price_quotes import (
    FinnhubMarketQuoteProvider,
    MarketQuote,
    configure_market_quote_provider,
)


FIXTURE_COLLECTED_AT = "2026-07-01T00:00:00Z"
EXTERNAL_COLLECTED_AT = datetime(2026, 7, 2, tzinfo=timezone.utc)


@pytest.fixture(autouse=True)
def reset_market_data_providers() -> None:
    configure_market_quote_provider(None)
    configure_fx_rate_provider(None)
    yield
    configure_market_quote_provider(None)
    configure_fx_rate_provider(None)


class CountingMarketQuoteProvider:
    def __init__(self) -> None:
        self.call_count = 0

    def list_market_quotes(
        self,
        *,
        currency: str | None = None,
        symbols: Iterable[str] | None = None,
    ) -> list[MarketQuote]:
        self.call_count += 1
        return [
            MarketQuote(
                symbol="MSFT",
                currency="USD",
                current_price=Decimal("420.0000"),
                source="mock-external",
                collected_at=EXTERNAL_COLLECTED_AT,
            )
        ]


class FailingMarketQuoteProvider:
    def list_market_quotes(
        self,
        *,
        currency: str | None = None,
        symbols: Iterable[str] | None = None,
    ) -> list[MarketQuote]:
        raise RuntimeError("provider unavailable")


class FakeFinnhubQuoteTransport:
    def __init__(self) -> None:
        self.calls: list[tuple[str, str]] = []

    def __call__(self, symbol: str, api_key: SecretStr) -> dict[str, object]:
        self.calls.append((symbol, api_key.get_secret_value()))
        return {
            "c": 430.12,
            "d": 1.5,
            "dp": 0.35,
            "h": 431,
            "l": 425,
            "o": 426,
            "pc": 428.62,
            "t": 1782950400,
        }


class CountingFxRateProvider:
    def __init__(self) -> None:
        self.call_count = 0

    def get_fx_rate(
        self,
        *,
        base_currency: str,
        quote_currency: str,
    ) -> FxRate | None:
        self.call_count += 1
        return FxRate(
            base_currency=base_currency.upper(),
            quote_currency=quote_currency.upper(),
            rate=Decimal("1400.000000"),
            source="mock-external",
            collected_at=EXTERNAL_COLLECTED_AT,
        )


class FailingFxRateProvider:
    def get_fx_rate(
        self,
        *,
        base_currency: str,
        quote_currency: str,
    ) -> FxRate | None:
        raise RuntimeError("provider unavailable")


def test_list_market_quotes_returns_fixture_quotes() -> None:
    with TestClient(app) as client:
        response = client.get("/market-data/quotes")

    assert response.status_code == 200
    quotes = response.json()
    assert {
        "symbol": "AAPL",
        "currency": "USD",
        "current_price": "195.0000",
        "source": "fixture",
        "collected_at": FIXTURE_COLLECTED_AT,
    } in quotes


def test_list_market_quotes_filters_by_currency() -> None:
    with TestClient(app) as client:
        response = client.get("/market-data/quotes", params={"currency": "JPY"})

    assert response.status_code == 200
    assert response.json() == [
        {
            "symbol": "7203",
            "currency": "JPY",
            "current_price": "2800.0000",
            "source": "fixture",
            "collected_at": FIXTURE_COLLECTED_AT,
        }
    ]


def test_list_market_quotes_filters_by_symbols() -> None:
    with TestClient(app) as client:
        response = client.get(
            "/market-data/quotes",
            params=[("symbols", "aapl"), ("symbols", "nvda")],
        )

    assert response.status_code == 200
    assert [quote["symbol"] for quote in response.json()] == ["AAPL", "NVDA"]


def test_retrieve_fx_rate_returns_fixture_rate() -> None:
    with TestClient(app) as client:
        response = client.get(
            "/market-data/fx-rates",
            params={"base_currency": "USD", "quote_currency": "KRW"},
        )

    assert response.status_code == 200
    assert response.json() == {
        "base_currency": "USD",
        "quote_currency": "KRW",
        "rate": "1380.000000",
        "source": "fixture",
        "collected_at": FIXTURE_COLLECTED_AT,
    }


def test_retrieve_fx_rate_returns_identity_rate() -> None:
    with TestClient(app) as client:
        response = client.get(
            "/market-data/fx-rates",
            params={"base_currency": "JPY", "quote_currency": "JPY"},
        )

    assert response.status_code == 200
    assert response.json() == {
        "base_currency": "JPY",
        "quote_currency": "JPY",
        "rate": "1.000000",
        "source": "fixture",
        "collected_at": FIXTURE_COLLECTED_AT,
    }


def test_list_market_quotes_uses_cached_external_provider_result() -> None:
    provider = CountingMarketQuoteProvider()
    configure_market_quote_provider(provider)

    with TestClient(app) as client:
        first_response = client.get(
            "/market-data/quotes",
            params=[("symbols", "MSFT")],
        )
        second_response = client.get(
            "/market-data/quotes",
            params=[("symbols", "MSFT")],
        )

    assert first_response.status_code == 200
    assert second_response.status_code == 200
    assert provider.call_count == 1
    assert first_response.json() == [
        {
            "symbol": "MSFT",
            "currency": "USD",
            "current_price": "420.0000",
            "source": "mock-external",
            "collected_at": "2026-07-02T00:00:00Z",
        }
    ]
    assert second_response.json() == first_response.json()


def test_list_market_quotes_falls_back_to_fixture_when_provider_fails() -> None:
    configure_market_quote_provider(FailingMarketQuoteProvider())

    with TestClient(app) as client:
        response = client.get(
            "/market-data/quotes",
            params=[("symbols", "AAPL")],
        )

    assert response.status_code == 200
    assert response.json() == [
        {
            "symbol": "AAPL",
            "currency": "USD",
            "current_price": "195.0000",
            "source": "fixture",
            "collected_at": FIXTURE_COLLECTED_AT,
        }
    ]


def test_finnhub_market_quote_provider_maps_quote_payload() -> None:
    transport = FakeFinnhubQuoteTransport()
    provider = FinnhubMarketQuoteProvider(
        api_key=SecretStr("test-finnhub-key"),
        transport=transport,
    )

    quotes = provider.list_market_quotes(symbols=["msft"])

    assert transport.calls == [("MSFT", "test-finnhub-key")]
    assert quotes == [
        MarketQuote(
            symbol="MSFT",
            currency="USD",
            current_price=Decimal("430.12"),
            source="finnhub",
            collected_at=datetime(2026, 7, 2, tzinfo=timezone.utc),
        )
    ]


def test_finnhub_market_quote_provider_skips_non_usd_currency() -> None:
    transport = FakeFinnhubQuoteTransport()
    provider = FinnhubMarketQuoteProvider(
        api_key=SecretStr("test-finnhub-key"),
        transport=transport,
    )

    quotes = provider.list_market_quotes(currency="JPY", symbols=["7203"])

    assert quotes == []
    assert transport.calls == []


def test_retrieve_fx_rate_uses_cached_external_provider_result() -> None:
    provider = CountingFxRateProvider()
    configure_fx_rate_provider(provider)

    with TestClient(app) as client:
        first_response = client.get(
            "/market-data/fx-rates",
            params={"base_currency": "USD", "quote_currency": "KRW"},
        )
        second_response = client.get(
            "/market-data/fx-rates",
            params={"base_currency": "USD", "quote_currency": "KRW"},
        )

    assert first_response.status_code == 200
    assert second_response.status_code == 200
    assert provider.call_count == 1
    assert first_response.json() == {
        "base_currency": "USD",
        "quote_currency": "KRW",
        "rate": "1400.000000",
        "source": "mock-external",
        "collected_at": "2026-07-02T00:00:00Z",
    }
    assert second_response.json() == first_response.json()


def test_retrieve_fx_rate_falls_back_to_fixture_when_provider_fails() -> None:
    configure_fx_rate_provider(FailingFxRateProvider())

    with TestClient(app) as client:
        response = client.get(
            "/market-data/fx-rates",
            params={"base_currency": "USD", "quote_currency": "KRW"},
        )

    assert response.status_code == 200
    assert response.json() == {
        "base_currency": "USD",
        "quote_currency": "KRW",
        "rate": "1380.000000",
        "source": "fixture",
        "collected_at": FIXTURE_COLLECTED_AT,
    }
