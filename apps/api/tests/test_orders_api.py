import uuid
from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock

from fastapi.testclient import TestClient

from marketpilot_api.core.user_api_auth import get_current_user
from marketpilot_api.db.session import get_db_session
from marketpilot_api.main import app
from marketpilot_api.models import Order, User
from marketpilot_api.repositories.orders import (
    OrderExecutionPriceError,
    OrderInsufficientCashError,
    OrderInsufficientPositionError,
    OrderNotDeletableError,
    OrderNotPendingError,
    OrderPortfolioNotFoundError,
)
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


def test_execute_pending_order_returns_filled_order(monkeypatch) -> None:
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
        order_type="MARKET",
        quantity=Decimal("1.00000000"),
        limit_price=None,
        currency="USD",
        status="FILLED",
        strategy_version="manual-v1",
        decision_evidence="Manual paper order",
        created_at=now,
        updated_at=now,
    )
    execute_mock = MagicMock(return_value=order)
    monkeypatch.setattr(orders_router, "execute_order", execute_mock)
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(session)

    with TestClient(app) as client:
        response = client.patch(
            f"/portfolios/{portfolio_id}/orders/{order.id}/execute",
            json={
                "price": "185.2500",
                "executed_at": now.isoformat(),
            },
        )

    clear_dependency_overrides()
    assert response.status_code == 200
    assert response.json()["status"] == "FILLED"
    assert execute_mock.call_args.kwargs["user_id"] == user.id
    assert execute_mock.call_args.kwargs["data"].price == Decimal("185.2500")


def test_execute_pending_order_rejects_insufficient_cash(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    execute_mock = MagicMock(side_effect=OrderInsufficientCashError)
    monkeypatch.setattr(orders_router, "execute_order", execute_mock)
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.patch(
            f"/portfolios/{uuid.uuid4()}/orders/{uuid.uuid4()}/execute",
            json={"price": "100"},
        )

    clear_dependency_overrides()
    assert response.status_code == 409
    assert response.json()["detail"] == "Insufficient cash balance"


def test_execute_pending_order_rejects_insufficient_position(
    monkeypatch,
) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    execute_mock = MagicMock(side_effect=OrderInsufficientPositionError)
    monkeypatch.setattr(orders_router, "execute_order", execute_mock)
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.patch(
            f"/portfolios/{uuid.uuid4()}/orders/{uuid.uuid4()}/execute",
            json={"price": "100"},
        )

    clear_dependency_overrides()
    assert response.status_code == 409
    assert response.json()["detail"] == "Insufficient position quantity"


def test_execute_pending_order_rejects_limit_price_miss(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    execute_mock = MagicMock(side_effect=OrderExecutionPriceError)
    monkeypatch.setattr(orders_router, "execute_order", execute_mock)
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.patch(
            f"/portfolios/{uuid.uuid4()}/orders/{uuid.uuid4()}/execute",
            json={"price": "100"},
        )

    clear_dependency_overrides()
    assert response.status_code == 422
    assert (
        response.json()["detail"]
        == "Execution price does not satisfy the limit order"
    )


def test_update_pending_order_returns_updated_order(monkeypatch) -> None:
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
        side="SELL",
        order_type="MARKET",
        quantity=Decimal("1.00000000"),
        limit_price=None,
        currency="USD",
        status="PENDING",
        strategy_version="manual-v1",
        decision_evidence="Manual paper order",
        created_at=now,
        updated_at=now,
    )
    update_mock = MagicMock(return_value=order)
    monkeypatch.setattr(orders_router, "update_order", update_mock)
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(session)

    with TestClient(app) as client:
        response = client.patch(
            f"/portfolios/{portfolio_id}/orders/{order.id}",
            json={"quantity": "1"},
        )

    clear_dependency_overrides()
    assert response.status_code == 200
    assert response.json()["quantity"] == "1.00000000"
    assert update_mock.call_args.kwargs["user_id"] == user.id
    assert update_mock.call_args.kwargs["data"].quantity == Decimal("1")


def test_update_pending_order_rejects_non_pending_order(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    update_mock = MagicMock(side_effect=OrderNotPendingError)
    monkeypatch.setattr(orders_router, "update_order", update_mock)
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.patch(
            f"/portfolios/{uuid.uuid4()}/orders/{uuid.uuid4()}",
            json={"quantity": "1"},
        )

    clear_dependency_overrides()
    assert response.status_code == 409
    assert response.json()["detail"] == "Only pending orders can be updated"


def test_update_pending_order_rejects_insufficient_position(
    monkeypatch,
) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    update_mock = MagicMock(side_effect=OrderInsufficientPositionError)
    monkeypatch.setattr(orders_router, "update_order", update_mock)
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.patch(
            f"/portfolios/{uuid.uuid4()}/orders/{uuid.uuid4()}",
            json={"quantity": "3"},
        )

    clear_dependency_overrides()
    assert response.status_code == 409
    assert response.json()["detail"] == "Insufficient position quantity"


def test_cancel_pending_order_returns_cancelled_order(monkeypatch) -> None:
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
        order_type="MARKET",
        quantity=Decimal("1.00000000"),
        limit_price=None,
        currency="USD",
        status="CANCELLED",
        strategy_version="manual-v1",
        decision_evidence="Manual paper order",
        created_at=now,
        updated_at=now,
    )
    cancel_mock = MagicMock(return_value=order)
    monkeypatch.setattr(orders_router, "cancel_order", cancel_mock)
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(session)

    with TestClient(app) as client:
        response = client.patch(
            f"/portfolios/{portfolio_id}/orders/{order.id}/cancel",
        )

    clear_dependency_overrides()
    assert response.status_code == 200
    assert response.json()["status"] == "CANCELLED"
    cancel_mock.assert_called_once_with(
        session,
        portfolio_id=portfolio_id,
        order_id=order.id,
        user_id=user.id,
    )


def test_cancel_pending_order_rejects_non_pending_order(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    cancel_mock = MagicMock(side_effect=OrderNotPendingError)
    monkeypatch.setattr(orders_router, "cancel_order", cancel_mock)
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.patch(
            f"/portfolios/{uuid.uuid4()}/orders/{uuid.uuid4()}/cancel",
        )

    clear_dependency_overrides()
    assert response.status_code == 409
    assert response.json()["detail"] == "Only pending orders can be cancelled"


def test_delete_unfilled_order_returns_no_content(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    session = MagicMock()
    portfolio_id = uuid.uuid4()
    order_id = uuid.uuid4()
    delete_mock = MagicMock(return_value=None)
    monkeypatch.setattr(orders_router, "delete_order", delete_mock)
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(session)

    with TestClient(app) as client:
        response = client.delete(f"/portfolios/{portfolio_id}/orders/{order_id}")

    clear_dependency_overrides()
    assert response.status_code == 204
    assert response.content == b""
    delete_mock.assert_called_once_with(
        session,
        portfolio_id=portfolio_id,
        order_id=order_id,
        user_id=user.id,
    )


def test_delete_unfilled_order_rejects_filled_order(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    delete_mock = MagicMock(side_effect=OrderNotDeletableError)
    monkeypatch.setattr(orders_router, "delete_order", delete_mock)
    app.dependency_overrides[get_current_user] = (
        override_authenticated_user(user)
    )
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.delete(
            f"/portfolios/{uuid.uuid4()}/orders/{uuid.uuid4()}",
        )

    clear_dependency_overrides()
    assert response.status_code == 409
    assert response.json()["detail"] == "Filled orders cannot be deleted"


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
