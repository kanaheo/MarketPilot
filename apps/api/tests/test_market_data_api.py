import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Iterable
from unittest.mock import MagicMock

from fastapi.testclient import TestClient
from pydantic import SecretStr
import pytest

from marketpilot_api.core.config import get_settings
from marketpilot_api.db.session import get_db_session
from marketpilot_api.main import app
from marketpilot_api.models import MarketQuoteSnapshot
from marketpilot_api.repositories.market_quote_snapshots import (
    MarketQuoteSnapshotCollection,
)
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
    app.dependency_overrides.clear()
    yield
    configure_market_quote_provider(None)
    configure_fx_rate_provider(None)
    app.dependency_overrides.clear()


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


class EmptyMarketQuoteProvider:
    def list_market_quotes(
        self,
        *,
        currency: str | None = None,
        symbols: Iterable[str] | None = None,
    ) -> list[MarketQuote]:
        return []


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


class PartialFinnhubQuoteTransport:
    def __call__(self, symbol: str, api_key: SecretStr) -> dict[str, object]:
        if symbol == "AAPL":
            return {
                "c": 294.38,
                "t": 1782950400,
            }

        return {
            "c": 0,
            "t": 0,
        }


class FailingSymbolFinnhubQuoteTransport:
    def __call__(self, symbol: str, api_key: SecretStr) -> dict[str, object]:
        if symbol == "AAPL":
            return {
                "c": 294.38,
                "t": 1782950400,
            }

        raise RuntimeError("symbol request failed")


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


def override_session(session):
    def dependency_override():
        yield session

    return dependency_override


class FakeSnapshotSession:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, traceback) -> None:
        return None


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


def test_list_market_quotes_uses_latest_snapshot_before_fixture(
    monkeypatch,
) -> None:
    monkeypatch.delenv("PYTEST_CURRENT_TEST", raising=False)
    snapshot = MarketQuoteSnapshot(
        symbol="AAPL",
        currency="USD",
        current_price=Decimal("294.3800"),
        source="finnhub",
        collected_at=EXTERNAL_COLLECTED_AT,
    )
    configure_market_quote_provider(EmptyMarketQuoteProvider())
    monkeypatch.setattr(
        "marketpilot_api.repositories.price_quotes.SessionLocal",
        lambda: FakeSnapshotSession(),
    )
    monkeypatch.setattr(
        "marketpilot_api.repositories.market_quote_snapshots."
        "list_latest_market_quote_snapshots",
        MagicMock(return_value=[snapshot]),
    )

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
            "current_price": "294.3800",
            "source": "finnhub:snapshot",
            "collected_at": "2026-07-02T00:00:00Z",
        }
    ]


def test_list_market_quotes_fills_missing_snapshot_symbols_from_fixture(
    monkeypatch,
) -> None:
    monkeypatch.delenv("PYTEST_CURRENT_TEST", raising=False)
    snapshot = MarketQuoteSnapshot(
        symbol="AAPL",
        currency="USD",
        current_price=Decimal("294.3800"),
        source="finnhub",
        collected_at=EXTERNAL_COLLECTED_AT,
    )
    configure_market_quote_provider(EmptyMarketQuoteProvider())
    monkeypatch.setattr(
        "marketpilot_api.repositories.price_quotes.SessionLocal",
        lambda: FakeSnapshotSession(),
    )
    monkeypatch.setattr(
        "marketpilot_api.repositories.market_quote_snapshots."
        "list_latest_market_quote_snapshots",
        MagicMock(return_value=[snapshot]),
    )

    with TestClient(app) as client:
        response = client.get(
            "/market-data/quotes",
            params=[("symbols", "AAPL"), ("symbols", "NVDA")],
        )

    assert response.status_code == 200
    assert response.json() == [
        {
            "symbol": "AAPL",
            "currency": "USD",
            "current_price": "294.3800",
            "source": "finnhub:snapshot",
            "collected_at": "2026-07-02T00:00:00Z",
        },
        {
            "symbol": "NVDA",
            "currency": "USD",
            "current_price": "125.0000",
            "source": "fixture",
            "collected_at": FIXTURE_COLLECTED_AT,
        },
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


def test_list_market_quotes_fills_missing_provider_symbols_from_fixture() -> None:
    provider = FinnhubMarketQuoteProvider(
        api_key=SecretStr("test-finnhub-key"),
        transport=PartialFinnhubQuoteTransport(),
    )
    configure_market_quote_provider(provider)

    with TestClient(app) as client:
        response = client.get(
            "/market-data/quotes",
            params=[("symbols", "AAPL"), ("symbols", "NVDA")],
        )

    assert response.status_code == 200
    assert response.json() == [
        {
            "symbol": "AAPL",
            "currency": "USD",
            "current_price": "294.38",
            "source": "finnhub",
            "collected_at": "2026-07-02T00:00:00Z",
        },
        {
            "symbol": "NVDA",
            "currency": "USD",
            "current_price": "125.0000",
            "source": "fixture",
            "collected_at": FIXTURE_COLLECTED_AT,
        },
    ]


def test_finnhub_market_quote_provider_keeps_successful_symbol_when_one_fails() -> None:
    provider = FinnhubMarketQuoteProvider(
        api_key=SecretStr("test-finnhub-key"),
        transport=FailingSymbolFinnhubQuoteTransport(),
    )

    quotes = provider.list_market_quotes(symbols=["AAPL", "NVDA"])

    assert quotes == [
        MarketQuote(
            symbol="AAPL",
            currency="USD",
            current_price=Decimal("294.38"),
            source="finnhub",
            collected_at=datetime(2026, 7, 2, tzinfo=timezone.utc),
        )
    ]


def test_retrieve_quote_provider_status_hides_finnhub_api_key(
    monkeypatch,
) -> None:
    monkeypatch.setenv("MARKETPILOT_MARKET_DATA_QUOTE_PROVIDER", "finnhub")
    monkeypatch.setenv("MARKETPILOT_FINNHUB_API_KEY", "test-finnhub-key")
    monkeypatch.setenv("MARKETPILOT_MARKET_DATA_CACHE_TTL_SECONDS", "60")
    get_settings.cache_clear()

    with TestClient(app) as client:
        response = client.get("/market-data/quote-provider-status")

    get_settings.cache_clear()

    assert response.status_code == 200
    assert response.json() == {
        "configured_provider": "finnhub",
        "active_provider": "finnhub",
        "fallback_provider": "snapshot-cache,fixture",
        "finnhub_api_key_configured": True,
        "cache_ttl_seconds": 60,
    }
    assert "test-finnhub-key" not in response.text


def test_collect_market_quote_snapshots_records_provider_quotes(
    monkeypatch,
) -> None:
    session = object()
    provider = CountingMarketQuoteProvider()
    configure_market_quote_provider(provider)
    record_mock = MagicMock(
        return_value=MarketQuoteSnapshotCollection(
            snapshots=[object()],
            skipped_count=0,
        )
    )
    monkeypatch.setattr(
        "marketpilot_api.routers.market_data.record_market_quote_snapshots",
        record_mock,
    )
    app.dependency_overrides[get_db_session] = override_session(session)

    with TestClient(app) as client:
        response = client.post(
            "/market-data/quote-snapshots/collect",
            params=[("symbols", "MSFT")],
        )

    assert response.status_code == 200
    assert response.json() == {
        "requested_count": 1,
        "stored_count": 1,
        "skipped_count": 0,
        "quotes": [
            {
                "symbol": "MSFT",
                "currency": "USD",
                "current_price": "420.0000",
                "source": "mock-external",
                "collected_at": "2026-07-02T00:00:00Z",
            }
        ],
    }
    assert provider.call_count == 1
    record_mock.assert_called_once()
    assert record_mock.call_args.args[0] is session


def test_list_market_quote_snapshots_returns_recorded_quotes(
    monkeypatch,
) -> None:
    session = object()
    snapshot_id = uuid.uuid4()
    created_at = datetime(2026, 7, 3, 9, 0, tzinfo=timezone.utc)
    collected_at = datetime(2026, 7, 2, 20, 0, tzinfo=timezone.utc)
    snapshot = MarketQuoteSnapshot(
        id=snapshot_id,
        symbol="AAPL",
        currency="USD",
        current_price=Decimal("294.3800"),
        source="finnhub",
        collected_at=collected_at,
        created_at=created_at,
    )
    list_mock = MagicMock(return_value=[snapshot])
    monkeypatch.setattr(
        "marketpilot_api.routers.market_data.list_recorded_market_quote_snapshots",
        list_mock,
    )
    app.dependency_overrides[get_db_session] = override_session(session)

    with TestClient(app) as client:
        response = client.get(
            "/market-data/quote-snapshots",
            params=[("symbols", "aapl"), ("currency", "USD"), ("limit", "20")],
        )

    assert response.status_code == 200
    assert response.json() == [
        {
            "id": str(snapshot_id),
            "symbol": "AAPL",
            "currency": "USD",
            "current_price": "294.3800",
            "source": "finnhub",
            "collected_at": "2026-07-02T20:00:00Z",
            "created_at": "2026-07-03T09:00:00Z",
        }
    ]
    list_mock.assert_called_once_with(
        session,
        currency="USD",
        symbols=["aapl"],
        limit=20,
    )


def test_list_market_quote_snapshots_rejects_invalid_limit() -> None:
    with TestClient(app) as client:
        response = client.get(
            "/market-data/quote-snapshots",
            params={"limit": "0"},
        )

    assert response.status_code == 422


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
