from fastapi.testclient import TestClient

from marketpilot_api.main import app


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
