import uuid
from dataclasses import dataclass
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from marketpilot_api.models import OrderExecution


@dataclass(frozen=True)
class PortfolioHolding:
    symbol: str
    quantity: Decimal
    average_price: Decimal
    current_price: Decimal
    market_value: Decimal
    return_rate: Decimal
    currency: str


@dataclass(frozen=True)
class PortfolioPositionSummary:
    holdings: list[PortfolioHolding]
    realized_profit_loss: Decimal


@dataclass
class HoldingAccumulator:
    symbol: str
    currency: str
    quantity: Decimal = Decimal("0")
    cost_basis: Decimal = Decimal("0")
    realized_profit_loss: Decimal = Decimal("0")

    def apply_execution(self, execution: OrderExecution) -> None:
        if execution.side == "BUY":
            self.quantity += execution.quantity
            self.cost_basis += execution.gross_amount
            return

        if self.quantity <= 0:
            return

        average_price = self.average_price
        sold_quantity = min(execution.quantity, self.quantity)
        self.realized_profit_loss += (
            execution.price - average_price
        ) * sold_quantity
        self.quantity -= sold_quantity
        self.cost_basis -= average_price * sold_quantity
        if self.quantity == 0:
            self.cost_basis = Decimal("0")

    @property
    def average_price(self) -> Decimal:
        if self.quantity <= 0:
            return Decimal("0")

        return self.cost_basis / self.quantity


def _list_order_executions(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    symbol: str | None = None,
) -> list[OrderExecution]:
    statement = select(OrderExecution).where(
        OrderExecution.portfolio_id == portfolio_id,
    )
    if symbol is not None:
        statement = statement.where(OrderExecution.symbol == symbol)

    return list(
        session.scalars(
            statement.order_by(
                OrderExecution.symbol.asc(),
                OrderExecution.executed_at.asc(),
                OrderExecution.id.asc(),
            )
        ).all()
    )


def build_holding_accumulators(
    executions: list[OrderExecution],
) -> dict[str, HoldingAccumulator]:
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

    return holdings_by_symbol


def list_portfolio_holdings(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
) -> list[PortfolioHolding]:
    return get_portfolio_position_summary(
        session,
        portfolio_id=portfolio_id,
    ).holdings


def get_portfolio_position_summary(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
) -> PortfolioPositionSummary:
    holdings = []
    realized_profit_loss = Decimal("0")

    for accumulator in build_holding_accumulators(
        _list_order_executions(session, portfolio_id=portfolio_id)
    ).values():
        realized_profit_loss += accumulator.realized_profit_loss
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

    return PortfolioPositionSummary(
        holdings=holdings,
        realized_profit_loss=realized_profit_loss,
    )


def get_available_position_quantity(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    symbol: str,
) -> Decimal:
    accumulator = build_holding_accumulators(
        _list_order_executions(
            session,
            portfolio_id=portfolio_id,
            symbol=symbol,
        )
    ).get(symbol)

    if accumulator is None:
        return Decimal("0")

    return accumulator.quantity
