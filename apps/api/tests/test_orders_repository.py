import uuid
from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock

import pytest

from marketpilot_api.models import Order, Portfolio
from marketpilot_api.repositories.orders import (
    MANUAL_DECISION_EVIDENCE,
    MANUAL_STRATEGY_VERSION,
    OrderPortfolioNotFoundError,
    create_order,
    list_orders,
)
from marketpilot_api.schemas.orders import OrderCreateRequest


def test_create_order_sets_manual_pending_defaults() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=user_id,
        name="Paper portfolio",
        base_currency="USD",
    )
    session.scalar.return_value = portfolio
    data = OrderCreateRequest(
        symbol=" aapl ",
        side="BUY",
        order_type="MARKET",
        quantity=Decimal("2"),
    )

    result = create_order(
        session,
        portfolio_id=portfolio.id,
        user_id=user_id,
        data=data,
    )

    ownership_statement = session.scalar.call_args.args[0]
    ownership_params = ownership_statement.compile().params.values()
    assert portfolio.id in ownership_params
    assert user_id in ownership_params
    assert isinstance(result, Order)
    assert result.symbol == "AAPL"
    assert result.status == "PENDING"
    assert result.currency == "USD"
    assert result.strategy_version == MANUAL_STRATEGY_VERSION
    assert result.decision_evidence == MANUAL_DECISION_EVIDENCE
    session.add.assert_called_once_with(result)
    session.flush.assert_called_once()
    session.refresh.assert_called_once_with(result)
    session.commit.assert_called_once()
    session.rollback.assert_not_called()


def test_create_order_uses_supplied_decision_evidence() -> None:
    session = MagicMock()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        name="Paper portfolio",
        base_currency="KRW",
    )
    session.scalar.return_value = portfolio
    data = OrderCreateRequest(
        symbol="005930",
        side="SELL",
        order_type="LIMIT",
        quantity=Decimal("1.5"),
        limit_price=Decimal("85000"),
        decision_evidence="Manual rebalance",
    )

    result = create_order(
        session,
        portfolio_id=portfolio.id,
        user_id=portfolio.user_id,
        data=data,
    )

    assert result.limit_price == Decimal("85000")
    assert result.decision_evidence == "Manual rebalance"
    assert result.currency == "KRW"


def test_create_order_rolls_back_for_unowned_portfolio() -> None:
    session = MagicMock()
    session.scalar.return_value = None
    data = OrderCreateRequest(
        symbol="NVDA",
        side="BUY",
        order_type="MARKET",
        quantity=Decimal("1"),
    )

    with pytest.raises(OrderPortfolioNotFoundError):
        create_order(
            session,
            portfolio_id=uuid.uuid4(),
            user_id=uuid.uuid4(),
            data=data,
        )

    session.add.assert_not_called()
    session.commit.assert_not_called()
    session.rollback.assert_called_once()


def test_create_order_rolls_back_when_database_write_fails() -> None:
    session = MagicMock()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        name="Paper portfolio",
        base_currency="JPY",
    )
    session.scalar.return_value = portfolio
    session.flush.side_effect = RuntimeError("database failure")
    data = OrderCreateRequest(
        symbol="7203",
        side="BUY",
        order_type="LIMIT",
        quantity=Decimal("10"),
        limit_price=Decimal("2800"),
    )

    with pytest.raises(RuntimeError, match="database failure"):
        create_order(
            session,
            portfolio_id=portfolio.id,
            user_id=portfolio.user_id,
            data=data,
        )

    session.commit.assert_not_called()
    session.rollback.assert_called_once()


def test_list_orders_checks_owner_and_sorts_newest_first() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    portfolio_id = uuid.uuid4()
    session.scalar.return_value = portfolio_id
    now = datetime.now(timezone.utc)
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=portfolio_id,
        symbol="AAPL",
        side="BUY",
        order_type="MARKET",
        quantity=Decimal("1"),
        limit_price=None,
        currency="USD",
        status="PENDING",
        strategy_version=MANUAL_STRATEGY_VERSION,
        decision_evidence=MANUAL_DECISION_EVIDENCE,
        created_at=now,
        updated_at=now,
    )
    session.scalars.return_value.all.return_value = [order]

    result = list_orders(
        session,
        portfolio_id=portfolio_id,
        user_id=user_id,
    )

    ownership_statement = session.scalar.call_args.args[0]
    ownership_params = ownership_statement.compile().params.values()
    order_statement = session.scalars.call_args.args[0]
    assert portfolio_id in ownership_params
    assert user_id in ownership_params
    assert "ORDER BY orders.created_at DESC" in str(order_statement)
    assert result == [order]
