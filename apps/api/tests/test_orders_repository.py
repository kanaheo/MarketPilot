import uuid
from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock

import pytest

from marketpilot_api.models import Order, OrderExecution, Portfolio
from marketpilot_api.repositories import orders as orders_repository
from marketpilot_api.repositories.orders import (
    MANUAL_DECISION_EVIDENCE,
    MANUAL_STRATEGY_VERSION,
    OrderExecutionPriceError,
    OrderInsufficientCashError,
    OrderInsufficientPositionError,
    OrderNotDeletableError,
    OrderNotPendingError,
    OrderPortfolioNotFoundError,
    cancel_order,
    create_order,
    delete_order,
    execute_order,
    list_orders,
    update_order,
)
from marketpilot_api.schemas.orders import (
    OrderCreateRequest,
    OrderExecuteRequest,
    OrderUpdateRequest,
)


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


def test_create_order_uses_supplied_decision_evidence(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    session = MagicMock()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        name="Paper portfolio",
        base_currency="KRW",
    )
    session.scalar.return_value = portfolio
    monkeypatch.setattr(
        orders_repository,
        "get_current_cash",
        MagicMock(return_value=Decimal("1000000.0000")),
    )
    monkeypatch.setattr(
        orders_repository,
        "_get_reserved_buy_amount",
        MagicMock(return_value=Decimal("0")),
    )
    data = OrderCreateRequest(
        symbol="005930",
        side="BUY",
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


def test_create_buy_limit_order_rejects_reserved_cash_amount(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    session = MagicMock()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        name="Paper portfolio",
        base_currency="USD",
    )
    session.scalar.return_value = portfolio
    monkeypatch.setattr(
        orders_repository,
        "get_current_cash",
        MagicMock(return_value=Decimal("100.0000")),
    )
    monkeypatch.setattr(
        orders_repository,
        "_get_reserved_buy_amount",
        MagicMock(return_value=Decimal("80.0000")),
    )
    data = OrderCreateRequest(
        symbol="AAPL",
        side="BUY",
        order_type="LIMIT",
        quantity=Decimal("1.00"),
        limit_price=Decimal("30.0000"),
    )

    with pytest.raises(OrderInsufficientCashError):
        create_order(
            session,
            portfolio_id=portfolio.id,
            user_id=portfolio.user_id,
            data=data,
        )

    session.add.assert_not_called()
    session.commit.assert_not_called()
    session.rollback.assert_called_once()


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


def test_create_order_rolls_back_when_database_write_fails(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    session = MagicMock()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        name="Paper portfolio",
        base_currency="JPY",
    )
    session.scalar.return_value = portfolio
    session.flush.side_effect = RuntimeError("database failure")
    monkeypatch.setattr(
        orders_repository,
        "get_current_cash",
        MagicMock(return_value=Decimal("100000.0000")),
    )
    monkeypatch.setattr(
        orders_repository,
        "_get_reserved_buy_amount",
        MagicMock(return_value=Decimal("0")),
    )
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


def test_create_sell_order_rejects_reserved_position_quantity(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    session = MagicMock()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        name="Paper portfolio",
        base_currency="USD",
    )
    session.scalar.return_value = portfolio
    monkeypatch.setattr(
        orders_repository,
        "get_available_position_quantity",
        MagicMock(return_value=Decimal("1.00")),
    )
    monkeypatch.setattr(
        orders_repository,
        "_get_reserved_sell_quantity",
        MagicMock(return_value=Decimal("0.50")),
    )
    data = OrderCreateRequest(
        symbol="AAPL",
        side="SELL",
        order_type="MARKET",
        quantity=Decimal("0.75"),
    )

    with pytest.raises(OrderInsufficientPositionError):
        create_order(
            session,
            portfolio_id=portfolio.id,
            user_id=portfolio.user_id,
            data=data,
        )

    session.add.assert_not_called()
    session.commit.assert_not_called()
    session.rollback.assert_called_once()


def test_execute_buy_order_fills_order_and_records_cash_outflow() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=user_id,
        name="Paper portfolio",
        base_currency="USD",
    )
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=portfolio.id,
        symbol="AAPL",
        side="BUY",
        order_type="LIMIT",
        quantity=Decimal("2.00000000"),
        limit_price=Decimal("190.0000"),
        currency="USD",
        status="PENDING",
        strategy_version=MANUAL_STRATEGY_VERSION,
        decision_evidence=MANUAL_DECISION_EVIDENCE,
    )
    executed_at = datetime.now(timezone.utc)
    session.scalar.side_effect = [portfolio, order, Decimal("1000.0000")]
    data = OrderExecuteRequest(
        price=Decimal("185.2500"),
        executed_at=executed_at,
    )

    result = execute_order(
        session,
        portfolio_id=portfolio.id,
        order_id=order.id,
        user_id=user_id,
        data=data,
    )

    execution = session.add.call_args_list[0].args[0]
    cash_transaction = session.add.call_args_list[1].args[0]
    assert result.status == "FILLED"
    assert execution.order_id == order.id
    assert execution.gross_amount == Decimal("370.5000")
    assert execution.executed_at == executed_at
    assert cash_transaction.transaction_type == "TRADE_BUY"
    assert cash_transaction.amount == Decimal("370.5000")
    assert cash_transaction.occurred_at == executed_at
    session.flush.assert_called_once()
    session.refresh.assert_called_once_with(order)
    session.commit.assert_called_once()
    session.rollback.assert_not_called()


def test_execute_sell_order_records_cash_inflow() -> None:
    session = MagicMock()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        name="Paper portfolio",
        base_currency="JPY",
    )
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=portfolio.id,
        symbol="7203",
        side="SELL",
        order_type="LIMIT",
        quantity=Decimal("3.00000000"),
        limit_price=Decimal("2800.0000"),
        currency="JPY",
        status="PENDING",
        strategy_version=MANUAL_STRATEGY_VERSION,
        decision_evidence=MANUAL_DECISION_EVIDENCE,
    )
    session.scalar.side_effect = [portfolio, order]
    session.scalars.return_value.all.return_value = [
        OrderExecution(
            id=uuid.uuid4(),
            order_id=uuid.uuid4(),
            portfolio_id=portfolio.id,
            symbol="7203",
            side="BUY",
            quantity=Decimal("5.00000000"),
            price=Decimal("2700.0000"),
            gross_amount=Decimal("13500.0000"),
            currency="JPY",
            executed_at=datetime.now(timezone.utc),
        )
    ]

    result = execute_order(
        session,
        portfolio_id=portfolio.id,
        order_id=order.id,
        user_id=portfolio.user_id,
        data=OrderExecuteRequest(price=Decimal("2810.0000")),
    )

    cash_transaction = session.add.call_args_list[1].args[0]
    assert result.status == "FILLED"
    assert cash_transaction.transaction_type == "TRADE_SELL"
    assert cash_transaction.amount == Decimal("8430.0000")
    session.commit.assert_called_once()


def test_execute_sell_order_rejects_insufficient_position() -> None:
    session = MagicMock()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        name="Paper portfolio",
        base_currency="USD",
    )
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=portfolio.id,
        symbol="AAPL",
        side="SELL",
        order_type="MARKET",
        quantity=Decimal("2.00000000"),
        limit_price=None,
        currency="USD",
        status="PENDING",
        strategy_version=MANUAL_STRATEGY_VERSION,
        decision_evidence=MANUAL_DECISION_EVIDENCE,
    )
    session.scalar.side_effect = [portfolio, order]
    session.scalars.return_value.all.return_value = [
        OrderExecution(
            id=uuid.uuid4(),
            order_id=uuid.uuid4(),
            portfolio_id=portfolio.id,
            symbol="AAPL",
            side="BUY",
            quantity=Decimal("1.00000000"),
            price=Decimal("100.0000"),
            gross_amount=Decimal("100.0000"),
            currency="USD",
            executed_at=datetime.now(timezone.utc),
        )
    ]

    with pytest.raises(OrderInsufficientPositionError):
        execute_order(
            session,
            portfolio_id=portfolio.id,
            order_id=order.id,
            user_id=portfolio.user_id,
            data=OrderExecuteRequest(price=Decimal("110.0000")),
        )

    assert order.status == "PENDING"
    session.add.assert_not_called()
    session.commit.assert_not_called()
    session.rollback.assert_called_once()


def test_execute_order_rejects_insufficient_cash() -> None:
    session = MagicMock()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        name="Paper portfolio",
        base_currency="USD",
    )
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=portfolio.id,
        symbol="NVDA",
        side="BUY",
        order_type="MARKET",
        quantity=Decimal("2.00000000"),
        limit_price=None,
        currency="USD",
        status="PENDING",
        strategy_version=MANUAL_STRATEGY_VERSION,
        decision_evidence=MANUAL_DECISION_EVIDENCE,
    )
    session.scalar.side_effect = [portfolio, order, Decimal("100.0000")]

    with pytest.raises(OrderInsufficientCashError):
        execute_order(
            session,
            portfolio_id=portfolio.id,
            order_id=order.id,
            user_id=portfolio.user_id,
            data=OrderExecuteRequest(price=Decimal("90.0000")),
        )

    assert order.status == "PENDING"
    session.add.assert_not_called()
    session.commit.assert_not_called()
    session.rollback.assert_called_once()


def test_execute_order_rejects_limit_price_miss() -> None:
    session = MagicMock()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        name="Paper portfolio",
        base_currency="USD",
    )
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=portfolio.id,
        symbol="AAPL",
        side="BUY",
        order_type="LIMIT",
        quantity=Decimal("1.00000000"),
        limit_price=Decimal("190.0000"),
        currency="USD",
        status="PENDING",
        strategy_version=MANUAL_STRATEGY_VERSION,
        decision_evidence=MANUAL_DECISION_EVIDENCE,
    )
    session.scalar.side_effect = [portfolio, order]

    with pytest.raises(OrderExecutionPriceError):
        execute_order(
            session,
            portfolio_id=portfolio.id,
            order_id=order.id,
            user_id=portfolio.user_id,
            data=OrderExecuteRequest(price=Decimal("191.0000")),
        )

    assert order.status == "PENDING"
    session.add.assert_not_called()
    session.commit.assert_not_called()
    session.rollback.assert_called_once()


def test_update_order_changes_pending_order_quantity() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    portfolio_id = uuid.uuid4()
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=portfolio_id,
        symbol="AAPL",
        side="BUY",
        order_type="MARKET",
        quantity=Decimal("3.00000000"),
        limit_price=None,
        currency="USD",
        status="PENDING",
        strategy_version=MANUAL_STRATEGY_VERSION,
        decision_evidence=MANUAL_DECISION_EVIDENCE,
    )
    session.scalar.side_effect = [portfolio_id, order]

    result = update_order(
        session,
        portfolio_id=portfolio_id,
        order_id=order.id,
        user_id=user_id,
        data=OrderUpdateRequest(quantity=Decimal("1.00")),
    )

    assert result.quantity == Decimal("1.00000000")
    session.flush.assert_called_once()
    session.refresh.assert_called_once_with(order)
    session.commit.assert_called_once()
    session.rollback.assert_not_called()


def test_update_order_rejects_non_pending_order() -> None:
    session = MagicMock()
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=uuid.uuid4(),
        symbol="AAPL",
        side="SELL",
        order_type="MARKET",
        quantity=Decimal("1.00000000"),
        limit_price=None,
        currency="USD",
        status="FILLED",
        strategy_version=MANUAL_STRATEGY_VERSION,
        decision_evidence=MANUAL_DECISION_EVIDENCE,
    )
    session.scalar.side_effect = [order.portfolio_id, order]

    with pytest.raises(OrderNotPendingError):
        update_order(
            session,
            portfolio_id=order.portfolio_id,
            order_id=order.id,
            user_id=uuid.uuid4(),
            data=OrderUpdateRequest(quantity=Decimal("2.00")),
        )

    assert order.quantity == Decimal("1.00000000")
    session.commit.assert_not_called()
    session.rollback.assert_called_once()


def test_update_order_rejects_insufficient_position_quantity(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    session = MagicMock()
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=uuid.uuid4(),
        symbol="AAPL",
        side="SELL",
        order_type="MARKET",
        quantity=Decimal("1.00000000"),
        limit_price=None,
        currency="USD",
        status="PENDING",
        strategy_version=MANUAL_STRATEGY_VERSION,
        decision_evidence=MANUAL_DECISION_EVIDENCE,
    )
    session.scalar.side_effect = [order.portfolio_id, order]
    monkeypatch.setattr(
        orders_repository,
        "get_available_position_quantity",
        MagicMock(return_value=Decimal("1.00000000")),
    )
    monkeypatch.setattr(
        orders_repository,
        "_get_reserved_sell_quantity",
        MagicMock(return_value=Decimal("0")),
    )

    with pytest.raises(OrderInsufficientPositionError):
        update_order(
            session,
            portfolio_id=order.portfolio_id,
            order_id=order.id,
            user_id=uuid.uuid4(),
            data=OrderUpdateRequest(quantity=Decimal("3.00")),
        )

    assert order.quantity == Decimal("1.00000000")
    session.commit.assert_not_called()
    session.rollback.assert_called_once()


def test_update_order_rejects_reserved_position_quantity(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    session = MagicMock()
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=uuid.uuid4(),
        symbol="AAPL",
        side="SELL",
        order_type="MARKET",
        quantity=Decimal("1.00"),
        limit_price=None,
        currency="USD",
        status="PENDING",
        strategy_version=MANUAL_STRATEGY_VERSION,
        decision_evidence=MANUAL_DECISION_EVIDENCE,
    )
    session.scalar.side_effect = [order.portfolio_id, order]
    monkeypatch.setattr(
        orders_repository,
        "get_available_position_quantity",
        MagicMock(return_value=Decimal("2.00")),
    )
    monkeypatch.setattr(
        orders_repository,
        "_get_reserved_sell_quantity",
        MagicMock(return_value=Decimal("0.75")),
    )

    with pytest.raises(OrderInsufficientPositionError):
        update_order(
            session,
            portfolio_id=order.portfolio_id,
            order_id=order.id,
            user_id=uuid.uuid4(),
            data=OrderUpdateRequest(quantity=Decimal("1.50")),
        )

    assert order.quantity == Decimal("1.00")
    session.commit.assert_not_called()
    session.rollback.assert_called_once()


def test_update_order_rejects_reserved_cash_amount(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    session = MagicMock()
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=uuid.uuid4(),
        symbol="AAPL",
        side="BUY",
        order_type="LIMIT",
        quantity=Decimal("1.00"),
        limit_price=Decimal("40.0000"),
        currency="USD",
        status="PENDING",
        strategy_version=MANUAL_STRATEGY_VERSION,
        decision_evidence=MANUAL_DECISION_EVIDENCE,
    )
    session.scalar.side_effect = [order.portfolio_id, order]
    monkeypatch.setattr(
        orders_repository,
        "get_current_cash",
        MagicMock(return_value=Decimal("100.0000")),
    )
    monkeypatch.setattr(
        orders_repository,
        "_get_reserved_buy_amount",
        MagicMock(return_value=Decimal("50.0000")),
    )

    with pytest.raises(OrderInsufficientCashError):
        update_order(
            session,
            portfolio_id=order.portfolio_id,
            order_id=order.id,
            user_id=uuid.uuid4(),
            data=OrderUpdateRequest(quantity=Decimal("2.00")),
        )

    assert order.quantity == Decimal("1.00")
    session.commit.assert_not_called()
    session.rollback.assert_called_once()


def test_cancel_order_marks_pending_order_cancelled() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    portfolio_id = uuid.uuid4()
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
    )
    session.scalar.side_effect = [portfolio_id, order]

    result = cancel_order(
        session,
        portfolio_id=portfolio_id,
        order_id=order.id,
        user_id=user_id,
    )

    portfolio_statement = session.scalar.call_args_list[0].args[0]
    order_statement = session.scalar.call_args_list[1].args[0]
    assert portfolio_id in portfolio_statement.compile().params.values()
    assert user_id in portfolio_statement.compile().params.values()
    assert order.id in order_statement.compile().params.values()
    assert result.status == "CANCELLED"
    session.flush.assert_called_once()
    session.refresh.assert_called_once_with(order)
    session.commit.assert_called_once()
    session.rollback.assert_not_called()


def test_cancel_order_rejects_non_pending_order() -> None:
    session = MagicMock()
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=uuid.uuid4(),
        symbol="AAPL",
        side="BUY",
        order_type="MARKET",
        quantity=Decimal("1"),
        limit_price=None,
        currency="USD",
        status="FILLED",
        strategy_version=MANUAL_STRATEGY_VERSION,
        decision_evidence=MANUAL_DECISION_EVIDENCE,
    )
    session.scalar.side_effect = [order.portfolio_id, order]

    with pytest.raises(OrderNotPendingError):
        cancel_order(
            session,
            portfolio_id=order.portfolio_id,
            order_id=order.id,
            user_id=uuid.uuid4(),
        )

    assert order.status == "FILLED"
    session.commit.assert_not_called()
    session.rollback.assert_called_once()


def test_delete_order_removes_unfilled_order() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    portfolio_id = uuid.uuid4()
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
        strategy_version=MANUAL_STRATEGY_VERSION,
        decision_evidence=MANUAL_DECISION_EVIDENCE,
    )
    session.scalar.side_effect = [portfolio_id, order]

    delete_order(
        session,
        portfolio_id=portfolio_id,
        order_id=order.id,
        user_id=user_id,
    )

    session.delete.assert_called_once_with(order)
    session.commit.assert_called_once()
    session.rollback.assert_not_called()


def test_delete_order_rejects_filled_order() -> None:
    session = MagicMock()
    order = Order(
        id=uuid.uuid4(),
        portfolio_id=uuid.uuid4(),
        symbol="AAPL",
        side="BUY",
        order_type="MARKET",
        quantity=Decimal("1.00000000"),
        limit_price=None,
        currency="USD",
        status="FILLED",
        strategy_version=MANUAL_STRATEGY_VERSION,
        decision_evidence=MANUAL_DECISION_EVIDENCE,
    )
    session.scalar.side_effect = [order.portfolio_id, order]

    with pytest.raises(OrderNotDeletableError):
        delete_order(
            session,
            portfolio_id=order.portfolio_id,
            order_id=order.id,
            user_id=uuid.uuid4(),
        )

    session.delete.assert_not_called()
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
