import uuid
from decimal import Decimal

from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from marketpilot_api.models import CashTransaction

CASH_OUTFLOW_TYPES = ("WITHDRAWAL", "FEE", "TRADE_BUY")


def signed_cash_amount():
    return case(
        (
            CashTransaction.transaction_type.in_(CASH_OUTFLOW_TYPES),
            -CashTransaction.amount,
        ),
        else_=CashTransaction.amount,
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
