import uuid
from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock

import pytest

from marketpilot_api.models import CashTransaction, Portfolio
from marketpilot_api.repositories.portfolios import (
    create_portfolio_with_initial_deposit,
    list_portfolios_with_cash,
)
from marketpilot_api.schemas.portfolios import PortfolioCreateRequest


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
