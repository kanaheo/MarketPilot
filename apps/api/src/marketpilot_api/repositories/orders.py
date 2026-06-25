import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from marketpilot_api.models import Order, Portfolio
from marketpilot_api.schemas.orders import OrderCreateRequest

MANUAL_STRATEGY_VERSION = "manual-v1"
MANUAL_DECISION_EVIDENCE = "Manual paper order"


class OrderPortfolioNotFoundError(Exception):
    pass


class OrderNotFoundError(Exception):
    pass


class OrderNotPendingError(Exception):
    pass


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
