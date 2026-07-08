import uuid
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from marketpilot_api.models import OrderExecution
from marketpilot_api.repositories.fx_rates import FxRate, get_fx_rate
from marketpilot_api.repositories.price_quotes import MarketQuote, get_market_quote

VALUATION_FX_RATE_IDENTITY = Decimal("1.000000")


@dataclass(frozen=True)
class PortfolioHolding:
    symbol: str
    quantity: Decimal
    average_price: Decimal
    current_price: Decimal
    market_value: Decimal
    unrealized_profit_loss: Decimal
    return_rate: Decimal
    currency: str
    quote_currency: str
    valuation_currency: str
    valuation_fx_rate: Decimal
    current_price_source: str = "execution_fallback"
    current_price_collected_at: datetime | None = None
    valuation_fx_source: str = "fixture"
    valuation_fx_collected_at: datetime | None = None


@dataclass(frozen=True)
class PortfolioPositionSummary:
    holdings: list[PortfolioHolding]
    invested_value: Decimal
    realized_profit_loss: Decimal
    unrealized_profit_loss: Decimal


@dataclass
class HoldingAccumulator:
    symbol: str
    currency: str
    quantity: Decimal = Decimal("0")
    cost_basis: Decimal = Decimal("0")
    valuation_cost_basis: Decimal = Decimal("0")
    realized_profit_loss: Decimal = Decimal("0")

    def apply_execution(self, execution: OrderExecution) -> None:
        execution_fx_rate = (
            execution.execution_fx_rate or VALUATION_FX_RATE_IDENTITY
        )
        if execution.side == "BUY":
            self.quantity += execution.quantity
            self.cost_basis += execution.gross_amount
            self.valuation_cost_basis += (
                execution.gross_amount * execution_fx_rate
            )
            return

        if self.quantity <= 0:
            return

        average_price = self.average_price
        average_valuation_price = self.average_valuation_price
        sold_quantity = min(execution.quantity, self.quantity)
        self.realized_profit_loss += (
            execution.price * execution_fx_rate - average_valuation_price
        ) * sold_quantity
        self.valuation_cost_basis -= average_valuation_price * sold_quantity
        self.cost_basis -= average_price * sold_quantity
        self.quantity -= sold_quantity
        if self.quantity == 0:
            self.cost_basis = Decimal("0")
            self.valuation_cost_basis = Decimal("0")

    @property
    def average_price(self) -> Decimal:
        if self.quantity <= 0:
            return Decimal("0")

        return self.cost_basis / self.quantity

    @property
    def average_valuation_price(self) -> Decimal:
        if self.quantity <= 0:
            return Decimal("0")

        return self.valuation_cost_basis / self.quantity

    def unrealized_profit_loss(self, market_value: Decimal) -> Decimal:
        return market_value - self.valuation_cost_basis

    def return_rate(self, market_value: Decimal) -> Decimal:
        if self.valuation_cost_basis <= 0:
            return Decimal("0")

        return (
            self.unrealized_profit_loss(market_value)
            / self.valuation_cost_basis
        )


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


def list_open_position_symbols(
    session: Session,
    *,
    currency: str | None = None,
) -> list[str]:
    statement = select(OrderExecution)
    normalized_currency = currency.upper() if currency is not None else None
    if normalized_currency is not None:
        statement = statement.where(OrderExecution.currency == normalized_currency)

    executions = list(
        session.scalars(
            statement.order_by(
                OrderExecution.symbol.asc(),
                OrderExecution.currency.asc(),
                OrderExecution.executed_at.asc(),
                OrderExecution.id.asc(),
            )
        ).all()
    )
    holdings_by_symbol_and_currency: dict[
        tuple[str, str],
        HoldingAccumulator,
    ] = {}

    for execution in executions:
        accumulator = holdings_by_symbol_and_currency.setdefault(
            (execution.symbol, execution.currency),
            HoldingAccumulator(
                symbol=execution.symbol,
                currency=execution.currency,
            ),
        )
        accumulator.apply_execution(execution)

    return sorted(
        {
            accumulator.symbol
            for accumulator in holdings_by_symbol_and_currency.values()
            if accumulator.quantity > 0
        }
    )


def _get_current_quote(
    *,
    average_price: Decimal,
    currency: str,
    symbol: str,
) -> MarketQuote:
    quote = get_market_quote(symbol=symbol, currency=currency)
    if quote is not None:
        return quote

    return MarketQuote(
        symbol=symbol,
        currency=currency,
        current_price=average_price,
        source="execution_fallback",
        collected_at=None,
    )


def _get_valuation_fx_rate(
    *,
    quote_currency: str,
    valuation_currency: str,
) -> FxRate | None:
    fx_rate = get_fx_rate(
        base_currency=quote_currency,
        quote_currency=valuation_currency,
    )
    return fx_rate


def list_portfolio_holdings(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    valuation_currency: str,
) -> list[PortfolioHolding]:
    return get_portfolio_position_summary(
        session,
        portfolio_id=portfolio_id,
        valuation_currency=valuation_currency,
    ).holdings


def get_portfolio_position_summary(
    session: Session,
    *,
    portfolio_id: uuid.UUID,
    valuation_currency: str,
) -> PortfolioPositionSummary:
    holdings = []
    invested_value = Decimal("0")
    realized_profit_loss = Decimal("0")
    unrealized_profit_loss = Decimal("0")

    for accumulator in build_holding_accumulators(
        _list_order_executions(session, portfolio_id=portfolio_id)
    ).values():
        realized_profit_loss += accumulator.realized_profit_loss
        if accumulator.quantity <= 0:
            continue

        average_price = accumulator.average_price
        current_quote = _get_current_quote(
            average_price=average_price,
            currency=accumulator.currency,
            symbol=accumulator.symbol,
        )
        valuation_fx_rate = _get_valuation_fx_rate(
            quote_currency=accumulator.currency,
            valuation_currency=valuation_currency,
        )
        valuation_fx_rate_value = (
            valuation_fx_rate.rate
            if valuation_fx_rate is not None
            else VALUATION_FX_RATE_IDENTITY
        )
        market_value = (
            accumulator.quantity
            * current_quote.current_price
            * valuation_fx_rate_value
        )
        holding_unrealized_profit_loss = accumulator.unrealized_profit_loss(
            market_value
        )
        holding_return_rate = accumulator.return_rate(market_value)
        invested_value += market_value
        unrealized_profit_loss += holding_unrealized_profit_loss

        holdings.append(
            PortfolioHolding(
                symbol=accumulator.symbol,
                quantity=accumulator.quantity,
                average_price=average_price,
                current_price=current_quote.current_price,
                market_value=market_value,
                unrealized_profit_loss=holding_unrealized_profit_loss,
                return_rate=holding_return_rate,
                currency=valuation_currency,
                quote_currency=accumulator.currency,
                valuation_currency=valuation_currency,
                valuation_fx_rate=valuation_fx_rate_value,
                current_price_source=current_quote.source,
                current_price_collected_at=current_quote.collected_at,
                valuation_fx_source=(
                    valuation_fx_rate.source
                    if valuation_fx_rate is not None
                    else "unavailable"
                ),
                valuation_fx_collected_at=(
                    valuation_fx_rate.collected_at
                    if valuation_fx_rate is not None
                    else None
                ),
            )
        )

    return PortfolioPositionSummary(
        holdings=holdings,
        invested_value=invested_value,
        realized_profit_loss=realized_profit_loss,
        unrealized_profit_loss=unrealized_profit_loss,
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
