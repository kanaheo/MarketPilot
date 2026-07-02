from __future__ import annotations

import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import select

from marketpilot_api.db.session import SessionLocal
from marketpilot_api.models import CashTransaction, Order, OrderExecution, Portfolio, User

DEMO_PORTFOLIO_NAME = "FX Demo KRW Portfolio"


def main() -> None:
    with SessionLocal() as session:
        user = session.scalar(select(User).order_by(User.created_at.desc()))
        if user is None:
            raise SystemExit(
                "No user found. Sign in once, then run this seed again."
            )

        existing_portfolio = session.scalar(
            select(Portfolio).where(
                Portfolio.user_id == user.id,
                Portfolio.name == DEMO_PORTFOLIO_NAME,
            )
        )
        if existing_portfolio is not None:
            print(f"FX demo portfolio already exists: {existing_portfolio.id}")
            return

        portfolio_id = uuid.uuid4()
        order_id = uuid.uuid4()
        now = datetime.now(timezone.utc)

        portfolio = Portfolio(
            id=portfolio_id,
            user_id=user.id,
            name=DEMO_PORTFOLIO_NAME,
            base_currency="KRW",
        )
        session.add(portfolio)
        session.flush()

        initial_deposit = CashTransaction(
            id=uuid.uuid4(),
            portfolio_id=portfolio_id,
            transaction_type="INITIAL_DEPOSIT",
            amount=Decimal("1000000.0000"),
            currency="KRW",
            occurred_at=now,
            note="FX demo initial funding",
        )
        order = Order(
            id=order_id,
            portfolio_id=portfolio_id,
            symbol="AAPL",
            side="BUY",
            order_type="MARKET",
            quantity=Decimal("1.00000000"),
            limit_price=None,
            currency="USD",
            status="FILLED",
            strategy_version="fx-demo-v1",
            decision_evidence="Development seed for FX valuation display",
        )
        execution = OrderExecution(
            id=uuid.uuid4(),
            order_id=order_id,
            portfolio_id=portfolio_id,
            symbol="AAPL",
            side="BUY",
            quantity=Decimal("1.00000000"),
            price=Decimal("100.0000"),
            gross_amount=Decimal("100.0000"),
            currency="USD",
            portfolio_base_currency="KRW",
            execution_fx_rate=Decimal("1000.000000"),
            executed_at=now,
        )
        trade_cash = CashTransaction(
            id=uuid.uuid4(),
            portfolio_id=portfolio_id,
            transaction_type="TRADE_BUY",
            amount=Decimal("100000.0000"),
            currency="KRW",
            occurred_at=now,
            note="FX demo BUY 1.00000000 AAPL @ 100.0000 USD",
        )

        session.add(order)
        session.flush()
        session.add_all([initial_deposit, execution, trade_cash])
        session.commit()

        print(f"Created FX demo portfolio: {portfolio_id}")


if __name__ == "__main__":
    main()
