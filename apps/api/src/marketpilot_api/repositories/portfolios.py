import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from marketpilot_api.models import CashTransaction, OrderExecution, Portfolio
from marketpilot_api.repositories.cash_ledger import (
    get_current_cash,
    signed_cash_amount,
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
    recent_cash_transactions: list[CashTransaction]
    holdings: list["PortfolioHolding"]


@dataclass(frozen=True)
class PortfolioHolding:
    symbol: str
    quantity: Decimal
    average_price: Decimal
    current_price: Decimal
    market_value: Decimal
    return_rate: Decimal
    currency: str


@dataclass
class HoldingAccumulator:
    symbol: str
    currency: str
    quantity: Decimal = Decimal("0")
    cost_basis: Decimal = Decimal("0")

    def apply_execution(self, execution: OrderExecution) -> None:
        if execution.side == "BUY":
            self.quantity += execution.quantity
            self.cost_basis += execution.gross_amount
            return

        if self.quantity <= 0:
            return

        average_price = self.average_price
        sold_quantity = min(execution.quantity, self.quantity)
        self.quantity -= sold_quantity
        self.cost_basis -= average_price * sold_quantity
        if self.quantity == 0:
            self.cost_basis = Decimal("0")

    @property
    def average_price(self) -> Decimal:
        if self.quantity <= 0:
            return Decimal("0")

        return self.cost_basis / self.quantity


class PortfolioNotFoundError(Exception):
    pass


class InsufficientCashError(Exception):
    pass


def _get_portfolio_holdings(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
) -> list[PortfolioHolding]:
    executions = list(
        session.scalars(
            select(OrderExecution)
            .where(OrderExecution.portfolio_id == portfolio_id)
            .order_by(
                OrderExecution.symbol.asc(),
                OrderExecution.executed_at.asc(),
                OrderExecution.id.asc(),
            )
        ).all()
    )
    holdings_by_symbol: dict[str, HoldingAccumulator] = {}

    for execution in executions:
        accumulator = holdings_by_symbol.setdefault(
            execution.symbol,
            HoldingAccumulator(
                symbol=execution.symbol,
                currency=execution.currency,
            ),
        )
        accumulator.apply_execution(execution)

    holdings: list[PortfolioHolding] = []
    for accumulator in holdings_by_symbol.values():
        if accumulator.quantity <= 0:
            continue

        average_price = accumulator.average_price
        current_price = average_price
        market_value = accumulator.quantity * current_price

        holdings.append(
            PortfolioHolding(
                symbol=accumulator.symbol,
                quantity=accumulator.quantity,
                average_price=average_price,
                current_price=current_price,
                market_value=market_value,
                return_rate=Decimal("0"),
                currency=accumulator.currency,
            )
        )

    return holdings


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
    holdings = _get_portfolio_holdings(session, portfolio_id=portfolio.id)

    return PortfolioDetail(
        portfolio=portfolio,
        current_cash=current_cash,
        recent_cash_transactions=recent_transactions,
        holdings=holdings,
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
