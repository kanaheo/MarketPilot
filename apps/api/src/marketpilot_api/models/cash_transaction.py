import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Numeric, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from marketpilot_api.db.base import Base, CreatedAtMixin


class CashTransaction(CreatedAtMixin, Base):
    __tablename__ = "cash_transactions"
    __table_args__ = (
        CheckConstraint(
            "transaction_type IN "
            "('INITIAL_DEPOSIT', 'DEPOSIT', 'WITHDRAWAL', 'FEE', "
            "'DIVIDEND', 'TRADE_BUY', 'TRADE_SELL')",
            name="cash_transaction_type",
        ),
        CheckConstraint("amount > 0", name="cash_transaction_positive_amount"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    portfolio_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("portfolios.id"),
        nullable=False,
        index=True,
    )
    transaction_type: Mapped[str] = mapped_column(String(32), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(20, 4), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    occurred_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )
    note: Mapped[str | None] = mapped_column(String(500), nullable=True)
