import uuid
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from marketpilot_api.models import CashTransaction, Order, OrderExecution, Portfolio
from marketpilot_api.repositories.cash_ledger import get_current_cash
from marketpilot_api.repositories.positions import get_available_position_quantity
from marketpilot_api.schemas.orders import (
    OrderCreateRequest,
    OrderExecuteRequest,
    OrderUpdateRequest,
)

MANUAL_STRATEGY_VERSION = "manual-v1"
MANUAL_DECISION_EVIDENCE = "Manual paper order"
MONEY_QUANTIZER = Decimal("0.0001")


class OrderPortfolioNotFoundError(Exception):
    pass


class OrderNotFoundError(Exception):
    pass


class OrderNotPendingError(Exception):
    pass


class OrderNotDeletableError(Exception):
    pass


class OrderInsufficientCashError(Exception):
    pass


class OrderInsufficientPositionError(Exception):
    pass


class OrderExecutionPriceError(Exception):
    pass


def _calculate_gross_amount(quantity: Decimal, price: Decimal) -> Decimal:
    return (quantity * price).quantize(MONEY_QUANTIZER)


def _validate_execution_price(order: Order, price: Decimal) -> None:
    if order.limit_price is None:
        return

    if order.side == "BUY" and price > order.limit_price:
        raise OrderExecutionPriceError

    if order.side == "SELL" and price < order.limit_price:
        raise OrderExecutionPriceError


def _get_reserved_sell_quantity(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    symbol: str,
    excluded_order_id: uuid.UUID | None = None,
) -> Decimal:
    statement = select(
        func.coalesce(
            func.sum(Order.quantity),
            Decimal("0"),
        )
    ).where(
        Order.portfolio_id == portfolio_id,
        Order.symbol == symbol,
        Order.side == "SELL",
        Order.status == "PENDING",
    )

    if excluded_order_id is not None:
        statement = statement.where(Order.id != excluded_order_id)

    return session.scalar(statement)


def _get_reserved_buy_amount(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    excluded_order_id: uuid.UUID | None = None,
) -> Decimal:
    statement = select(
        func.coalesce(
            func.sum(Order.quantity * Order.limit_price),
            Decimal("0"),
        )
    ).where(
        Order.portfolio_id == portfolio_id,
        Order.side == "BUY",
        Order.order_type == "LIMIT",
        Order.status == "PENDING",
    )

    if excluded_order_id is not None:
        statement = statement.where(Order.id != excluded_order_id)

    return session.scalar(statement)


def _calculate_cash_reservation(
    *,
    order_type: str,
    quantity: Decimal,
    limit_price: Decimal | None,
) -> Decimal:
    if order_type != "LIMIT" or limit_price is None:
        return Decimal("0")

    return _calculate_gross_amount(quantity, limit_price)


def _attach_execution_prices(
    session: Session,
    orders: list[Order],
) -> list[Order]:
    if not orders:
        return orders

    execution_details_by_order_id = {
        order_id: {
            "executed_at": executed_at,
            "execution_gross_amount": gross_amount,
            "execution_price": price,
        }
        for order_id, price, gross_amount, executed_at in session.execute(
            select(
                OrderExecution.order_id,
                OrderExecution.price,
                OrderExecution.gross_amount,
                OrderExecution.executed_at,
            ).where(
                OrderExecution.order_id.in_([order.id for order in orders])
            )
        ).all()
    }

    for order in orders:
        execution_details = execution_details_by_order_id.get(order.id)
        if execution_details is None:
            order.execution_price = None
            order.execution_gross_amount = None
            order.executed_at = None
            continue

        order.execution_price = execution_details["execution_price"]
        order.execution_gross_amount = execution_details[
            "execution_gross_amount"
        ]
        order.executed_at = execution_details["executed_at"]

    return orders


def _validate_buy_cash_available(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    order_type: str,
    quantity: Decimal,
    limit_price: Decimal | None,
    excluded_order_id: uuid.UUID | None = None,
) -> None:
    requested_amount = _calculate_cash_reservation(
        order_type=order_type,
        quantity=quantity,
        limit_price=limit_price,
    )
    if requested_amount == 0:
        return

    current_cash = get_current_cash(session, portfolio_id=portfolio_id)
    reserved_amount = _get_reserved_buy_amount(
        session,
        portfolio_id=portfolio_id,
        excluded_order_id=excluded_order_id,
    )

    if requested_amount > current_cash - reserved_amount:
        raise OrderInsufficientCashError


def _validate_sell_quantity_available(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    symbol: str,
    quantity: Decimal,
    excluded_order_id: uuid.UUID | None = None,
) -> None:
    available_quantity = get_available_position_quantity(
        session,
        portfolio_id=portfolio_id,
        symbol=symbol,
    )
    reserved_quantity = _get_reserved_sell_quantity(
        session,
        portfolio_id=portfolio_id,
        symbol=symbol,
        excluded_order_id=excluded_order_id,
    )

    if quantity > available_quantity - reserved_quantity:
        raise OrderInsufficientPositionError


def create_order(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    user_id: uuid.UUID,
    data: OrderCreateRequest,
) -> Order:
    try:
        portfolio = session.scalar(
            select(Portfolio).where(
                Portfolio.id == portfolio_id,
                Portfolio.user_id == user_id,
            )
        )
        if portfolio is None:
            raise OrderPortfolioNotFoundError

        if data.side == "BUY":
            _validate_buy_cash_available(
                session,
                portfolio_id=portfolio.id,
                order_type=data.order_type,
                quantity=data.quantity,
                limit_price=data.limit_price,
            )
        elif data.side == "SELL":
            _validate_sell_quantity_available(
                session,
                portfolio_id=portfolio.id,
                symbol=data.symbol,
                quantity=data.quantity,
            )

        order = Order(
            id=uuid.uuid4(),
            portfolio_id=portfolio.id,
            symbol=data.symbol,
            side=data.side,
            order_type=data.order_type,
            quantity=data.quantity,
            limit_price=data.limit_price,
            currency=portfolio.base_currency,
            status="PENDING",
            strategy_version=MANUAL_STRATEGY_VERSION,
            decision_evidence=(
                data.decision_evidence or MANUAL_DECISION_EVIDENCE
            ),
        )
        session.add(order)
        session.flush()
        session.refresh(order)
        session.commit()
    except Exception:
        session.rollback()
        raise

    return order


def execute_order(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    order_id: uuid.UUID,
    user_id: uuid.UUID,
    data: OrderExecuteRequest,
) -> Order:
    try:
        portfolio = session.scalar(
            select(Portfolio)
            .where(
                Portfolio.id == portfolio_id,
                Portfolio.user_id == user_id,
            )
            .with_for_update()
        )
        if portfolio is None:
            raise OrderPortfolioNotFoundError

        order = session.scalar(
            select(Order)
            .where(
                Order.id == order_id,
                Order.portfolio_id == portfolio_id,
            )
            .with_for_update()
        )
        if order is None:
            raise OrderNotFoundError

        if order.status != "PENDING":
            raise OrderNotPendingError

        _validate_execution_price(order, data.price)

        gross_amount = _calculate_gross_amount(order.quantity, data.price)
        if order.side == "BUY":
            current_cash = get_current_cash(session, portfolio_id=portfolio.id)
            if gross_amount > current_cash:
                raise OrderInsufficientCashError
        else:
            available_quantity = get_available_position_quantity(
                session,
                portfolio_id=portfolio.id,
                symbol=order.symbol,
            )
            if order.quantity > available_quantity:
                raise OrderInsufficientPositionError

        executed_at = data.executed_at
        if executed_at is None:
            raise ValueError("Executed at is required")

        execution = OrderExecution(
            id=uuid.uuid4(),
            order_id=order.id,
            portfolio_id=portfolio.id,
            symbol=order.symbol,
            side=order.side,
            quantity=order.quantity,
            price=data.price,
            gross_amount=gross_amount,
            currency=portfolio.base_currency,
            executed_at=executed_at,
        )
        cash_transaction = CashTransaction(
            id=uuid.uuid4(),
            portfolio_id=portfolio.id,
            transaction_type=(
                "TRADE_BUY" if order.side == "BUY" else "TRADE_SELL"
            ),
            amount=gross_amount,
            currency=portfolio.base_currency,
            occurred_at=executed_at,
            note=f"{order.side} {order.quantity} {order.symbol} @ {data.price}",
        )

        order.status = "FILLED"
        session.add(execution)
        session.add(cash_transaction)
        session.flush()
        session.refresh(order)
        session.commit()
        order.execution_price = data.price
        order.execution_gross_amount = gross_amount
        order.executed_at = executed_at
    except Exception:
        session.rollback()
        raise

    return order


def update_order(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    order_id: uuid.UUID,
    user_id: uuid.UUID,
    data: OrderUpdateRequest,
) -> Order:
    try:
        portfolio_exists = session.scalar(
            select(Portfolio.id).where(
                Portfolio.id == portfolio_id,
                Portfolio.user_id == user_id,
            )
        )
        if portfolio_exists is None:
            raise OrderPortfolioNotFoundError

        order = session.scalar(
            select(Order)
            .where(
                Order.id == order_id,
                Order.portfolio_id == portfolio_id,
            )
            .with_for_update()
        )
        if order is None:
            raise OrderNotFoundError

        if order.status != "PENDING":
            raise OrderNotPendingError

        if order.side == "BUY":
            _validate_buy_cash_available(
                session,
                portfolio_id=portfolio_id,
                order_type=order.order_type,
                quantity=data.quantity,
                limit_price=order.limit_price,
                excluded_order_id=order.id,
            )
        elif order.side == "SELL":
            _validate_sell_quantity_available(
                session,
                portfolio_id=portfolio_id,
                symbol=order.symbol,
                quantity=data.quantity,
                excluded_order_id=order.id,
            )

        order.quantity = data.quantity
        session.flush()
        session.refresh(order)
        session.commit()
    except Exception:
        session.rollback()
        raise

    return order


def cancel_order(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    order_id: uuid.UUID,
    user_id: uuid.UUID,
) -> Order:
    try:
        portfolio_exists = session.scalar(
            select(Portfolio.id).where(
                Portfolio.id == portfolio_id,
                Portfolio.user_id == user_id,
            )
        )
        if portfolio_exists is None:
            raise OrderPortfolioNotFoundError

        order = session.scalar(
            select(Order)
            .where(
                Order.id == order_id,
                Order.portfolio_id == portfolio_id,
            )
            .with_for_update()
        )
        if order is None:
            raise OrderNotFoundError

        if order.status != "PENDING":
            raise OrderNotPendingError

        order.status = "CANCELLED"
        session.flush()
        session.refresh(order)
        session.commit()
    except Exception:
        session.rollback()
        raise

    return order


def delete_order(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    order_id: uuid.UUID,
    user_id: uuid.UUID,
) -> None:
    try:
        portfolio_exists = session.scalar(
            select(Portfolio.id).where(
                Portfolio.id == portfolio_id,
                Portfolio.user_id == user_id,
            )
        )
        if portfolio_exists is None:
            raise OrderPortfolioNotFoundError

        order = session.scalar(
            select(Order)
            .where(
                Order.id == order_id,
                Order.portfolio_id == portfolio_id,
            )
            .with_for_update()
        )
        if order is None:
            raise OrderNotFoundError

        if order.status == "FILLED":
            raise OrderNotDeletableError

        session.delete(order)
        session.commit()
    except Exception:
        session.rollback()
        raise


def list_orders(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    user_id: uuid.UUID,
) -> list[Order]:
    portfolio_exists = session.scalar(
        select(Portfolio.id).where(
            Portfolio.id == portfolio_id,
            Portfolio.user_id == user_id,
        )
    )
    if portfolio_exists is None:
        raise OrderPortfolioNotFoundError

    orders = list(
        session.scalars(
            select(Order)
            .where(Order.portfolio_id == portfolio_id)
            .order_by(Order.created_at.desc(), Order.id.desc())
        ).all()
    )

    return _attach_execution_prices(session, orders)
