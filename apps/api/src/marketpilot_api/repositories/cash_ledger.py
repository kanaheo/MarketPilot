import uuid
from decimal import Decimal

from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from marketpilot_api.models import CashTransaction

CASH_OUTFLOW_TYPES = ("WITHDRAWAL", "FEE", "TRADE_BUY")
CAPITAL_OUTFLOW_TYPES = ("WITHDRAWAL",)
CAPITAL_INFLOW_TYPES = ("INITIAL_DEPOSIT", "DEPOSIT")


def signed_cash_amount():
    return case(
        (
            CashTransaction.transaction_type.in_(CASH_OUTFLOW_TYPES),
            -CashTransaction.amount,
        ),
        else_=CashTransaction.amount,
    )


def signed_capital_amount():
    return case(
        (
            CashTransaction.transaction_type.in_(CAPITAL_OUTFLOW_TYPES),
            -CashTransaction.amount,
        ),
        (
            CashTransaction.transaction_type.in_(CAPITAL_INFLOW_TYPES),
            CashTransaction.amount,
        ),
        else_=Decimal("0"),
    )


def get_current_cash(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
) -> Decimal:
    return session.scalar(
        select(
            func.coalesce(
                func.sum(signed_cash_amount()),
                Decimal("0"),
            )
        ).where(CashTransaction.portfolio_id == portfolio_id)
    )


def get_net_contributions(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
) -> Decimal:
    return session.scalar(
        select(
            func.coalesce(
                func.sum(signed_capital_amount()),
                Decimal("0"),
            )
        ).where(CashTransaction.portfolio_id == portfolio_id)
    )
