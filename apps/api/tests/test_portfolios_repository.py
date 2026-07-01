import uuid
from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock

import pytest

from marketpilot_api.models import CashTransaction, OrderExecution, Portfolio
from marketpilot_api.repositories.portfolios import (
    InsufficientCashError,
    PortfolioHolding,
    PortfolioNotFoundError,
    create_cash_transaction,
    create_portfolio_with_initial_deposit,
    get_portfolio_detail,
    list_portfolios_with_cash,
)
from marketpilot_api.schemas.portfolios import (
    CashTransactionCreateRequest,
    PortfolioCreateRequest,
)


def test_create_portfolio_adds_initial_deposit_in_one_commit() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    data = PortfolioCreateRequest(
        name="Long-term portfolio",
        base_currency="USD",
        initial_capital=Decimal("10000.25"),
    )

    portfolio = create_portfolio_with_initial_deposit(
        session,
        user_id=user_id,
        data=data,
    )

    added_portfolio = session.add.call_args_list[0].args[0]
    initial_deposit = session.add.call_args_list[1].args[0]

    assert portfolio is added_portfolio
    assert isinstance(added_portfolio, Portfolio)
    assert added_portfolio.user_id == user_id
    assert added_portfolio.name == "Long-term portfolio"
    assert isinstance(initial_deposit, CashTransaction)
    assert initial_deposit.portfolio_id == added_portfolio.id
    assert initial_deposit.transaction_type == "INITIAL_DEPOSIT"
    assert initial_deposit.amount == Decimal("10000.25")
    assert initial_deposit.currency == "USD"
    assert initial_deposit.occurred_at.tzinfo is timezone.utc
    assert session.flush.call_count == 2
    session.commit.assert_called_once()
    session.refresh.assert_called_once_with(added_portfolio)
    session.rollback.assert_not_called()


def test_create_portfolio_rolls_back_when_commit_fails() -> None:
    session = MagicMock()
    session.commit.side_effect = RuntimeError("database failure")
    data = PortfolioCreateRequest(
        name="Rollback portfolio",
        base_currency="KRW",
        initial_capital=Decimal("5000000"),
    )

    with pytest.raises(RuntimeError, match="database failure"):
        create_portfolio_with_initial_deposit(
            session,
            user_id=uuid.uuid4(),
            data=data,
        )

    session.rollback.assert_called_once()
    session.refresh.assert_called_once()


def test_list_portfolios_filters_by_user_and_maps_cash_balance() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    created_at = datetime.now(timezone.utc)
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=user_id,
        name="My portfolio",
        base_currency="JPY",
        created_at=created_at,
        updated_at=created_at,
    )
    session.execute.return_value.all.return_value = [
        (portfolio, Decimal("125000.0000")),
    ]

    result = list_portfolios_with_cash(session, user_id=user_id)

    statement = session.execute.call_args.args[0]
    compiled = statement.compile()
    assert "WHERE portfolios.user_id" in str(statement)
    assert "ORDER BY portfolios.created_at ASC" in str(statement)
    assert user_id in compiled.params.values()
    assert result[0].portfolio is portfolio
    assert result[0].current_cash == Decimal("125000.0000")


def test_get_portfolio_detail_filters_owner_and_limits_transactions() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=user_id,
        name="My portfolio",
        base_currency="USD",
    )
    transaction = CashTransaction(
        id=uuid.uuid4(),
        portfolio_id=portfolio.id,
        transaction_type="INITIAL_DEPOSIT",
        amount=Decimal("1000"),
        currency="USD",
        occurred_at=datetime.now(timezone.utc),
    )
    execution = OrderExecution(
        id=uuid.uuid4(),
        order_id=uuid.uuid4(),
        portfolio_id=portfolio.id,
        symbol="AAPL",
        side="BUY",
        quantity=Decimal("2.00000000"),
        price=Decimal("100.0000"),
        gross_amount=Decimal("200.0000"),
        currency="USD",
        executed_at=datetime.now(timezone.utc),
    )
    session.scalar.side_effect = [
        portfolio,
        Decimal("1000.0000"),
        Decimal("1000.0000"),
    ]
    session.scalars.return_value.all.side_effect = [[transaction], [execution]]

    result = get_portfolio_detail(
        session,
        portfolio_id=portfolio.id,
        user_id=user_id,
    )

    portfolio_statement = session.scalar.call_args_list[0].args[0]
    compiled = portfolio_statement.compile()
    transaction_statement = session.scalars.call_args_list[0].args[0]
    assert portfolio.id in compiled.params.values()
    assert user_id in compiled.params.values()
    assert transaction_statement._limit_clause.value == 20
    assert result is not None
    assert result.current_cash == Decimal("1000.0000")
    assert result.invested_value == Decimal("390.000000000000")
    assert result.net_contributions == Decimal("1000.0000")
    assert result.realized_profit_loss == Decimal("0")
    assert result.total_profit_loss == Decimal("390.000000000000")
    assert result.total_return_rate == Decimal("0.390000000000")
    assert result.total_value == Decimal("1390.000000000000")
    assert result.unrealized_profit_loss == Decimal("190.000000000000")
    assert result.recent_cash_transactions == [transaction]
    assert result.holdings == [
        PortfolioHolding(
            symbol="AAPL",
            quantity=Decimal("2.00000000"),
            average_price=Decimal("100.0000"),
            current_price=Decimal("195.0000"),
            market_value=Decimal("390.000000000000"),
            unrealized_profit_loss=Decimal("190.000000000000"),
            return_rate=Decimal("0.950000000000"),
            currency="USD",
        )
    ]


def test_get_portfolio_detail_resets_average_price_after_closed_position() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=user_id,
        name="My portfolio",
        base_currency="USD",
    )
    session.scalar.side_effect = [
        portfolio,
        Decimal("800.0000"),
        Decimal("1000.0000"),
    ]
    session.scalars.return_value.all.side_effect = [
        [],
        [
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
                executed_at=datetime(2026, 1, 1, tzinfo=timezone.utc),
            ),
            OrderExecution(
                id=uuid.uuid4(),
                order_id=uuid.uuid4(),
                portfolio_id=portfolio.id,
                symbol="AAPL",
                side="SELL",
                quantity=Decimal("1.00000000"),
                price=Decimal("110.0000"),
                gross_amount=Decimal("110.0000"),
                currency="USD",
                executed_at=datetime(2026, 1, 2, tzinfo=timezone.utc),
            ),
            OrderExecution(
                id=uuid.uuid4(),
                order_id=uuid.uuid4(),
                portfolio_id=portfolio.id,
                symbol="AAPL",
                side="BUY",
                quantity=Decimal("1.00000000"),
                price=Decimal("200.0000"),
                gross_amount=Decimal("200.0000"),
                currency="USD",
                executed_at=datetime(2026, 1, 3, tzinfo=timezone.utc),
            ),
        ],
    ]

    result = get_portfolio_detail(
        session,
        portfolio_id=portfolio.id,
        user_id=user_id,
    )

    assert result is not None
    assert result.net_contributions == Decimal("1000.0000")
    assert result.realized_profit_loss == Decimal("10.00000000")
    assert result.unrealized_profit_loss == Decimal("-5.000000000000")
    assert result.holdings == [
        PortfolioHolding(
            symbol="AAPL",
            quantity=Decimal("1.00000000"),
            average_price=Decimal("200.0000"),
            current_price=Decimal("195.0000"),
            market_value=Decimal("195.000000000000"),
            unrealized_profit_loss=Decimal("-5.000000000000"),
            return_rate=Decimal("-0.025000000000"),
            currency="USD",
        )
    ]


def test_get_portfolio_detail_falls_back_to_average_price_without_quote() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=user_id,
        name="My portfolio",
        base_currency="USD",
    )
    session.scalar.side_effect = [
        portfolio,
        Decimal("500.0000"),
        Decimal("1000.0000"),
    ]
    session.scalars.return_value.all.side_effect = [
        [],
        [
            OrderExecution(
                id=uuid.uuid4(),
                order_id=uuid.uuid4(),
                portfolio_id=portfolio.id,
                symbol="UNKNOWN",
                side="BUY",
                quantity=Decimal("2.00000000"),
                price=Decimal("75.0000"),
                gross_amount=Decimal("150.0000"),
                currency="USD",
                executed_at=datetime(2026, 1, 1, tzinfo=timezone.utc),
            ),
        ],
    ]

    result = get_portfolio_detail(
        session,
        portfolio_id=portfolio.id,
        user_id=user_id,
    )

    assert result is not None
    assert result.unrealized_profit_loss == Decimal("0E-12")
    assert result.holdings == [
        PortfolioHolding(
            symbol="UNKNOWN",
            quantity=Decimal("2.00000000"),
            average_price=Decimal("75.0000"),
            current_price=Decimal("75.0000"),
            market_value=Decimal("150.000000000000"),
            unrealized_profit_loss=Decimal("0E-12"),
            return_rate=Decimal("0"),
            currency="USD",
        )
    ]


def test_create_deposit_uses_portfolio_currency_and_commits() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=user_id,
        name="Cash portfolio",
        base_currency="JPY",
    )
    session.scalar.return_value = portfolio
    occurred_at = datetime.now(timezone.utc)
    data = CashTransactionCreateRequest(
        transaction_type="DEPOSIT",
        amount=Decimal("5000"),
        occurred_at=occurred_at,
        note="Bonus",
    )

    result = create_cash_transaction(
        session,
        portfolio_id=portfolio.id,
        user_id=user_id,
        data=data,
    )

    statement = session.scalar.call_args.args[0]
    assert statement._for_update_arg is not None
    assert result.currency == "JPY"
    assert result.transaction_type == "DEPOSIT"
    assert result.occurred_at == occurred_at
    session.add.assert_called_once_with(result)
    session.commit.assert_called_once()
    session.rollback.assert_not_called()


def test_create_withdrawal_rejects_insufficient_cash() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    portfolio = Portfolio(
        id=uuid.uuid4(),
        user_id=user_id,
        name="Cash portfolio",
        base_currency="USD",
    )
    session.scalar.side_effect = [portfolio, Decimal("50.0000")]
    data = CashTransactionCreateRequest(
        transaction_type="WITHDRAWAL",
        amount=Decimal("50.0001"),
        occurred_at=datetime.now(timezone.utc),
    )

    with pytest.raises(InsufficientCashError):
        create_cash_transaction(
            session,
            portfolio_id=portfolio.id,
            user_id=user_id,
            data=data,
        )

    session.add.assert_not_called()
    session.commit.assert_not_called()
    session.rollback.assert_called_once()


def test_create_cash_transaction_hides_unowned_portfolio() -> None:
    session = MagicMock()
    session.scalar.return_value = None
    data = CashTransactionCreateRequest(
        transaction_type="DEPOSIT",
        amount=Decimal("100"),
        occurred_at=datetime.now(timezone.utc),
    )

    with pytest.raises(PortfolioNotFoundError):
        create_cash_transaction(
            session,
            portfolio_id=uuid.uuid4(),
            user_id=uuid.uuid4(),
            data=data,
        )

    session.rollback.assert_called_once()
