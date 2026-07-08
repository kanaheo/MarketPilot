import uuid
from datetime import datetime, timezone
from decimal import Decimal
from unittest.mock import MagicMock

from marketpilot_api.models import OrderExecution
from marketpilot_api.repositories.positions import list_open_position_symbols


def make_execution(
    *,
    symbol: str,
    side: str,
    quantity: str,
    currency: str = "USD",
) -> OrderExecution:
    return OrderExecution(
        id=uuid.uuid4(),
        order_id=uuid.uuid4(),
        portfolio_id=uuid.uuid4(),
        symbol=symbol,
        side=side,
        quantity=Decimal(quantity),
        price=Decimal("100.0000"),
        gross_amount=Decimal("100.0000"),
        currency=currency,
        portfolio_base_currency=currency,
        execution_fx_rate=Decimal("1.000000"),
        executed_at=datetime(2026, 7, 2, tzinfo=timezone.utc),
    )


def test_list_open_position_symbols_excludes_closed_positions() -> None:
    session = MagicMock()
    session.scalars.return_value.all.return_value = [
        make_execution(symbol="AAPL", side="BUY", quantity="2.00000000"),
        make_execution(symbol="AAPL", side="SELL", quantity="2.00000000"),
        make_execution(symbol="NVDA", side="BUY", quantity="1.00000000"),
    ]

    result = list_open_position_symbols(session)

    assert result == ["NVDA"]


def test_list_open_position_symbols_filters_by_currency() -> None:
    session = MagicMock()
    session.scalars.return_value.all.return_value = [
        make_execution(symbol="7203", side="BUY", quantity="1.00000000", currency="JPY"),
    ]

    result = list_open_position_symbols(session, currency="jpy")

    statement = session.scalars.call_args.args[0]
    assert "order_executions.currency" in str(statement)
    assert "JPY" in statement.compile().params.values()
    assert result == ["7203"]
