import uuid
from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock

from fastapi.testclient import TestClient

from marketpilot_api.core.user_api_auth import get_current_user
from marketpilot_api.db.session import get_db_session
from marketpilot_api.main import app
from marketpilot_api.models import Order, User
from marketpilot_api.repositories.orders import OrderPortfolioNotFoundError
from marketpilot_api.routers import orders as orders_router


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


def test_submit_order_rejects_unauthenticated_request() -> None:
    with TestClient(app) as client:
        response = client.post(
            f"/portfolios/{uuid.uuid4()}/orders",
            json={
                "symbol": "AAPL",
                "side": "BUY",
                "order_type": "MARKET",
                "quantity": "1",
            },
        )

    assert response.status_code == 401


def test_submit_order_returns_pending_order(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    session = MagicMock()
    portfolio_id = uuid.uuid4()
    now = datetime.now(timezone.utc)
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=portfolio_id,
        symbol="AAPL",
        side="BUY",
        order_type="LIMIT",
        quantity=Decimal("2.00000000"),
        limit_price=Decimal("190.0000"),
        currency="USD",
        status="PENDING",
        strategy_version="manual-v1",
        decision_evidence="Manual paper order",
        created_at=now,
        updated_at=now,
    )
    create_mock = MagicMock(return_value=order)
    monkeypatch.setattr(orders_router, "create_order", create_mock)
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(session)

    with TestClient(app) as client:
        response = client.post(
            f"/portfolios/{portfolio_id}/orders",
            json={
                "symbol": " aapl ",
                "side": "BUY",
                "order_type": "LIMIT",
                "quantity": "2",
                "limit_price": "190",
            },
        )

    clear_dependency_overrides()
    assert response.status_code == 201
    assert response.json()["status"] == "PENDING"
    assert response.json()["symbol"] == "AAPL"
    assert create_mock.call_args.kwargs["user_id"] == user.id
    assert create_mock.call_args.kwargs["data"].symbol == "AAPL"


def test_submit_order_rejects_invalid_order_shape() -> None:
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
        market_with_price = client.post(
            f"/portfolios/{portfolio_id}/orders",
            json={
                "symbol": "AAPL",
                "side": "BUY",
                "order_type": "MARKET",
                "quantity": "1",
                "limit_price": "100",
            },
        )
        limit_without_price = client.post(
            f"/portfolios/{portfolio_id}/orders",
            json={
                "symbol": "AAPL",
                "side": "BUY",
                "order_type": "LIMIT",
                "quantity": "1",
            },
        )
        zero_quantity = client.post(
            f"/portfolios/{portfolio_id}/orders",
            json={
                "symbol": "AAPL",
                "side": "BUY",
                "order_type": "MARKET",
                "quantity": "0",
            },
        )
        invalid_symbol = client.post(
            f"/portfolios/{portfolio_id}/orders",
            json={
                "symbol": "AAPL<script>",
                "side": "BUY",
                "order_type": "MARKET",
                "quantity": "1",
            },
        )

    clear_dependency_overrides()
    assert market_with_price.status_code == 422
    assert limit_without_price.status_code == 422
    assert zero_quantity.status_code == 422
    assert invalid_symbol.status_code == 422


def test_submit_order_hides_unowned_portfolio(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    create_mock = MagicMock(side_effect=OrderPortfolioNotFoundError)
    monkeypatch.setattr(orders_router, "create_order", create_mock)
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.post(
            f"/portfolios/{uuid.uuid4()}/orders",
            json={
                "symbol": "NVDA",
                "side": "BUY",
                "order_type": "MARKET",
                "quantity": "1",
            },
        )

    clear_dependency_overrides()
    assert response.status_code == 404
    assert response.json()["detail"] == "Portfolio not found"


def test_retrieve_orders_returns_owner_orders(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    session = MagicMock()
    portfolio_id = uuid.uuid4()
    now = datetime.now(timezone.utc)
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=portfolio_id,
        symbol="7203",
        side="SELL",
        order_type="MARKET",
        quantity=Decimal("3.00000000"),
        limit_price=None,
        currency="JPY",
        status="PENDING",
        strategy_version="manual-v1",
        decision_evidence="Manual paper order",
        created_at=now,
        updated_at=now,
    )
    list_mock = MagicMock(return_value=[order])
    monkeypatch.setattr(orders_router, "list_orders", list_mock)
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(session)

    with TestClient(app) as client:
        response = client.get(f"/portfolios/{portfolio_id}/orders")

    clear_dependency_overrides()
    assert response.status_code == 200
    assert response.json()[0]["symbol"] == "7203"
    list_mock.assert_called_once_with(
        session,
        portfolio_id=portfolio_id,
        user_id=user.id,
    )
