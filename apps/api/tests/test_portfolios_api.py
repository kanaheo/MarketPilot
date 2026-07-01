import uuid
from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock

from fastapi.testclient import TestClient

from marketpilot_api.core.user_api_auth import get_current_user
from marketpilot_api.db.session import get_db_session
from marketpilot_api.main import app
from marketpilot_api.models import CashTransaction, Portfolio, User
from marketpilot_api.repositories.portfolios import (
    InsufficientCashError,
    PortfolioDetail,
    PortfolioHolding,
    PortfolioNotFoundError,
    PortfolioWithCash,
)
from marketpilot_api.routers import portfolios as portfolios_router


def override_authenticated_user(user: User):
    def dependency_override() -> User:
        return user

    return dependency_override


def override_session(session: MagicMock):
    def dependency_override():
        yield session

    return dependency_override


def clear_dependency_overrides() -> None:
    app.dependency_overrides.clear()


def test_create_portfolio_rejects_unauthenticated_request() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/portfolios",
            json={
                "name": "My portfolio",
                "base_currency": "USD",
                "initial_capital": "10000",
            },
        )

    assert response.status_code == 401


def test_create_portfolio_returns_created_portfolio(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    session = MagicMock()
    now = datetime.now(timezone.utc)
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=user.id,
        name="My portfolio",
        base_currency="USD",
        created_at=now,
        updated_at=now,
    )
    create_mock = MagicMock(return_value=portfolio)
    monkeypatch.setattr(
        portfolios_router,
        "create_portfolio_with_initial_deposit",
        create_mock,
    )
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(session)

    with TestClient(app) as client:
        response = client.post(
            "/portfolios",
            json={
                "name": "My portfolio",
                "base_currency": "USD",
                "initial_capital": "10000.2500",
            },
        )

    clear_dependency_overrides()
    assert response.status_code == 201
    assert response.json() == {
        "id": str(portfolio.id),
        "name": "My portfolio",
        "base_currency": "USD",
        "current_cash": "10000.2500",
        "created_at": now.isoformat().replace("+00:00", "Z"),
        "updated_at": now.isoformat().replace("+00:00", "Z"),
    }
    assert create_mock.call_args.kwargs["user_id"] == user.id
    assert (
        create_mock.call_args.kwargs["data"].initial_capital
        == Decimal("10000.2500")
    )


def test_create_portfolio_rejects_invalid_input(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    create_mock = MagicMock()
    monkeypatch.setattr(
        portfolios_router,
        "create_portfolio_with_initial_deposit",
        create_mock,
    )
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )

    with TestClient(app) as client:
        zero_capital_response = client.post(
            "/portfolios",
            json={
                "name": "Invalid capital",
                "base_currency": "USD",
                "initial_capital": "0",
            },
        )
        invalid_currency_response = client.post(
            "/portfolios",
            json={
                "name": "Invalid currency",
                "base_currency": "EUR",
                "initial_capital": "10000",
            },
        )
        blank_name_response = client.post(
            "/portfolios",
            json={
                "name": "   ",
                "base_currency": "JPY",
                "initial_capital": "10000",
            },
        )

    clear_dependency_overrides()
    assert zero_capital_response.status_code == 422
    assert invalid_currency_response.status_code == 422
    assert blank_name_response.status_code == 422
    create_mock.assert_not_called()


def test_list_portfolios_uses_authenticated_user(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    session = MagicMock()
    now = datetime.now(timezone.utc)
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=user.id,
        name="My portfolio",
        base_currency="KRW",
        created_at=now,
        updated_at=now,
    )
    list_mock = MagicMock(
        return_value=[
            PortfolioWithCash(
                portfolio=portfolio,
                current_cash=Decimal("5000000.0000"),
            )
        ]
    )
    monkeypatch.setattr(
        portfolios_router,
        "list_portfolios_with_cash",
        list_mock,
    )
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(session)

    with TestClient(app) as client:
        response = client.get("/portfolios")

    clear_dependency_overrides()
    assert response.status_code == 200
    assert response.json()[0]["id"] == str(portfolio.id)
    assert response.json()[0]["current_cash"] == "5000000.0000"
    list_mock.assert_called_once_with(session, user_id=user.id)


def test_retrieve_portfolio_returns_detail_for_owner(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    session = MagicMock()
    now = datetime.now(timezone.utc)
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=user.id,
        name="Detail portfolio",
        base_currency="USD",
        created_at=now,
        updated_at=now,
    )
    cash_transaction = CashTransaction(
        id=uuid.uuid4(),
        portfolio_id=portfolio.id,
        transaction_type="DEPOSIT",
        amount=Decimal("250.0000"),
        currency="USD",
        occurred_at=now,
        note="Extra cash",
        created_at=now,
    )
    detail_mock = MagicMock(
        return_value=PortfolioDetail(
            portfolio=portfolio,
            current_cash=Decimal("10250.0000"),
            invested_value=Decimal("200.0000"),
            net_contributions=Decimal("10000.0000"),
            realized_profit_loss=Decimal("25.0000"),
            total_profit_loss=Decimal("450.0000"),
            total_return_rate=Decimal("0.045"),
            total_value=Decimal("10450.0000"),
            unrealized_profit_loss=Decimal("0"),
            recent_cash_transactions=[cash_transaction],
            holdings=[
                PortfolioHolding(
                    symbol="AAPL",
                    quantity=Decimal("2.00000000"),
                    average_price=Decimal("100.0000"),
                    current_price=Decimal("100.0000"),
                    market_value=Decimal("200.0000"),
                    unrealized_profit_loss=Decimal("0"),
                    return_rate=Decimal("0"),
                    currency="USD",
                    quote_currency="USD",
                    valuation_currency="USD",
                    valuation_fx_rate=Decimal("1.000000"),
                )
            ],
        )
    )
    monkeypatch.setattr(
        portfolios_router,
        "get_portfolio_detail",
        detail_mock,
    )
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(session)

    with TestClient(app) as client:
        response = client.get(f"/portfolios/{portfolio.id}")

    clear_dependency_overrides()
    assert response.status_code == 200
    assert response.json()["current_cash"] == "10250.0000"
    assert response.json()["invested_value"] == "200.0000"
    assert response.json()["net_contributions"] == "10000.0000"
    assert response.json()["realized_profit_loss"] == "25.0000"
    assert response.json()["total_profit_loss"] == "450.0000"
    assert response.json()["total_return_rate"] == "0.045"
    assert response.json()["total_value"] == "10450.0000"
    assert response.json()["unrealized_profit_loss"] == "0"
    assert response.json()["recent_cash_transactions"][0]["note"] == (
        "Extra cash"
    )
    assert response.json()["holdings"][0]["symbol"] == "AAPL"
    assert response.json()["holdings"][0]["quantity"] == "2.00000000"
    assert response.json()["holdings"][0]["market_value"] == "200.0000"
    assert response.json()["holdings"][0]["unrealized_profit_loss"] == "0"
    assert response.json()["orders"] == []
    detail_mock.assert_called_once_with(
        session,
        portfolio_id=portfolio.id,
        user_id=user.id,
    )


def test_retrieve_portfolio_hides_other_users_portfolio(
    monkeypatch,
) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    detail_mock = MagicMock(return_value=None)
    monkeypatch.setattr(
        portfolios_router,
        "get_portfolio_detail",
        detail_mock,
    )
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(MagicMock())
    portfolio_id = uuid.uuid4()

    with TestClient(app) as client:
        response = client.get(f"/portfolios/{portfolio_id}")

    clear_dependency_overrides()
    assert response.status_code == 404
    assert response.json()["detail"] == "Portfolio not found"


def test_add_cash_transaction_uses_authenticated_user(
    monkeypatch,
) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    session = MagicMock()
    portfolio_id = uuid.uuid4()
    now = datetime.now(timezone.utc)
    cash_transaction = CashTransaction(
        id=uuid.uuid4(),
        portfolio_id=portfolio_id,
        transaction_type="WITHDRAWAL",
        amount=Decimal("100.0000"),
        currency="KRW",
        occurred_at=now,
        note=None,
        created_at=now,
    )
    create_mock = MagicMock(return_value=cash_transaction)
    monkeypatch.setattr(
        portfolios_router,
        "create_cash_transaction",
        create_mock,
    )
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(session)

    with TestClient(app) as client:
        response = client.post(
            f"/portfolios/{portfolio_id}/cash-transactions",
            json={
                "transaction_type": "WITHDRAWAL",
                "amount": "100.0000",
                "occurred_at": now.isoformat(),
                "note": "   ",
            },
        )

    clear_dependency_overrides()
    assert response.status_code == 201
    assert response.json()["currency"] == "KRW"
    assert create_mock.call_args.kwargs["user_id"] == user.id
    assert create_mock.call_args.kwargs["data"].note is None


def test_add_cash_transaction_maps_domain_errors(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    portfolio_id = uuid.uuid4()
    now = datetime.now(timezone.utc)
    create_mock = MagicMock(side_effect=PortfolioNotFoundError)
    monkeypatch.setattr(
        portfolios_router,
        "create_cash_transaction",
        create_mock,
    )
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        not_found_response = client.post(
            f"/portfolios/{portfolio_id}/cash-transactions",
            json={
                "transaction_type": "DEPOSIT",
                "amount": "100",
                "occurred_at": now.isoformat(),
            },
        )
        create_mock.side_effect = InsufficientCashError
        insufficient_response = client.post(
            f"/portfolios/{portfolio_id}/cash-transactions",
            json={
                "transaction_type": "WITHDRAWAL",
                "amount": "100",
                "occurred_at": now.isoformat(),
            },
        )

    clear_dependency_overrides()
    assert not_found_response.status_code == 404
    assert insufficient_response.status_code == 409


def test_add_cash_transaction_rejects_invalid_input() -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    portfolio_id = uuid.uuid4()

    with TestClient(app) as client:
        invalid_type_response = client.post(
            f"/portfolios/{portfolio_id}/cash-transactions",
            json={
                "transaction_type": "FEE",
                "amount": "100",
                "occurred_at": datetime.now(timezone.utc).isoformat(),
            },
        )
        negative_amount_response = client.post(
            f"/portfolios/{portfolio_id}/cash-transactions",
            json={
                "transaction_type": "DEPOSIT",
                "amount": "-1",
                "occurred_at": datetime.now(timezone.utc).isoformat(),
            },
        )
        missing_timezone_response = client.post(
            f"/portfolios/{portfolio_id}/cash-transactions",
            json={
                "transaction_type": "DEPOSIT",
                "amount": "100",
                "occurred_at": "2026-06-22T12:00:00",
            },
        )

    clear_dependency_overrides()
    assert invalid_type_response.status_code == 422
    assert negative_amount_response.status_code == 422
    assert missing_timezone_response.status_code == 422
