import uuid
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from marketpilot_api.models import CashTransaction, Order, OrderExecution, Portfolio
from marketpilot_api.repositories.cash_ledger import get_current_cash
from marketpilot_api.repositories.positions import get_available_position_quantity
from marketpilot_api.schemas.orders import OrderCreateRequest, OrderExecuteRequest

MANUAL_STRATEGY_VERSION = "manual-v1"
MANUAL_DECISION_EVIDENCE = "Manual paper order"
MONEY_QUANTIZER = Decimal("0.0001")


class OrderPortfolioNotFoundError(Exception):
    pass


class OrderNotFoundError(Exception):
    pass


class OrderNotPendingError(Exception):
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

    return list(
        session.scalars(
            select(Order)
            .where(Order.portfolio_id == portfolio_id)
            .order_by(Order.created_at.desc(), Order.id.desc())
        ).all()
    )
