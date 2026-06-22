import uuid
from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock

from fastapi.testclient import TestClient

from marketpilot_api.core.user_api_auth import get_current_user
from marketpilot_api.db.session import get_db_session
from marketpilot_api.main import app
from marketpilot_api.models import Portfolio, User
from marketpilot_api.repositories.portfolios import PortfolioWithCash
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
