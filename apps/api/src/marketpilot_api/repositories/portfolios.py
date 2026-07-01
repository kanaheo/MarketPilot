import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from marketpilot_api.models import CashTransaction, Portfolio
from marketpilot_api.repositories.cash_ledger import (
    get_current_cash,
    get_net_contributions,
    signed_cash_amount,
)
from marketpilot_api.repositories.positions import (
    PortfolioHolding,
    get_portfolio_position_summary,
)
from marketpilot_api.schemas.portfolios import (
    CashTransactionCreateRequest,
    PortfolioCreateRequest,
)


@dataclass(frozen=True)
class PortfolioWithCash:
    portfolio: Portfolio
    current_cash: Decimal


@dataclass(frozen=True)
class PortfolioDetail:
    portfolio: Portfolio
    current_cash: Decimal
    invested_value: Decimal
    net_contributions: Decimal
    realized_profit_loss: Decimal
    total_profit_loss: Decimal
    total_return_rate: Decimal
    total_value: Decimal
    unrealized_profit_loss: Decimal
    recent_cash_transactions: list[CashTransaction]
    holdings: list["PortfolioHolding"]


class PortfolioNotFoundError(Exception):
    pass


class InsufficientCashError(Exception):
    pass


def create_portfolio_with_initial_deposit(
    session: Session,
    *,
    user_id: uuid.UUID,
    data: PortfolioCreateRequest,
) -> Portfolio:
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=user_id,
        name=data.name,
        base_currency=data.base_currency,
    )

    try:
        session.add(portfolio)
        session.flush()
        session.add(
            CashTransaction(
                id=uuid.uuid4(),
                portfolio_id=portfolio.id,
                transaction_type="INITIAL_DEPOSIT",
                amount=data.initial_capital,
                currency=data.base_currency,
                occurred_at=datetime.now(timezone.utc),
                note="Initial portfolio funding",
            )
        )
        session.flush()
        session.refresh(portfolio)
        session.commit()
    except Exception:
        session.rollback()
        raise

    return portfolio


def list_portfolios_with_cash(
    session: Session,
    *,
    user_id: uuid.UUID,
) -> list[PortfolioWithCash]:
    statement = (
        select(
            Portfolio,
            func.coalesce(
                func.sum(signed_cash_amount()),
                Decimal("0"),
            ).label("current_cash"),
        )
        .outerjoin(
            CashTransaction,
            CashTransaction.portfolio_id == Portfolio.id,
        )
        .where(Portfolio.user_id == user_id)
        .group_by(Portfolio.id)
        .order_by(Portfolio.created_at.asc(), Portfolio.id.asc())
    )

    return [
        PortfolioWithCash(
            portfolio=portfolio,
            current_cash=current_cash,
        )
        for portfolio, current_cash in session.execute(statement).all()
    ]


def get_portfolio_detail(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    user_id: uuid.UUID,
    recent_transaction_limit: int = 20,
) -> PortfolioDetail | None:
    portfolio = session.scalar(
        select(Portfolio).where(
            Portfolio.id == portfolio_id,
            Portfolio.user_id == user_id,
        )
    )
    if portfolio is None:
        return None

    current_cash = get_current_cash(
        session,
        portfolio_id=portfolio.id,
    )
    net_contributions = get_net_contributions(
        session,
        portfolio_id=portfolio.id,
    )
    recent_transactions = list(
        session.scalars(
            select(CashTransaction)
            .where(CashTransaction.portfolio_id == portfolio.id)
            .order_by(
                CashTransaction.occurred_at.desc(),
                CashTransaction.created_at.desc(),
                CashTransaction.id.desc(),
            )
            .limit(recent_transaction_limit)
        ).all()
    )
    position_summary = get_portfolio_position_summary(
        session,
        portfolio_id=portfolio.id,
    )
    total_value = current_cash + position_summary.invested_value
    total_profit_loss = total_value - net_contributions
    total_return_rate = (
        total_profit_loss / net_contributions
        if net_contributions > 0
        else Decimal("0")
    )

    return PortfolioDetail(
        portfolio=portfolio,
        current_cash=current_cash,
        invested_value=position_summary.invested_value,
        net_contributions=net_contributions,
        realized_profit_loss=position_summary.realized_profit_loss,
        total_profit_loss=total_profit_loss,
        total_return_rate=total_return_rate,
        total_value=total_value,
        unrealized_profit_loss=position_summary.unrealized_profit_loss,
        recent_cash_transactions=recent_transactions,
        holdings=position_summary.holdings,
    )


def create_cash_transaction(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    user_id: uuid.UUID,
    data: CashTransactionCreateRequest,
) -> CashTransaction:
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
            raise PortfolioNotFoundError

        if data.transaction_type == "WITHDRAWAL":
            current_cash = get_current_cash(
                session,
                portfolio_id=portfolio.id,
            )
            if data.amount > current_cash:
                raise InsufficientCashError

        cash_transaction = CashTransaction(
            id=uuid.uuid4(),
            portfolio_id=portfolio.id,
            transaction_type=data.transaction_type,
            amount=data.amount,
            currency=portfolio.base_currency,
            occurred_at=data.occurred_at,
            note=data.note,
        )
        session.add(cash_transaction)
        session.flush()
        session.refresh(cash_transaction)
        session.commit()
    except Exception:
        session.rollback()
        raise

    return cash_transaction
