import uuid
from decimal import Decimal

from sqlalchemy import CheckConstraint, ForeignKey, Numeric, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from marketpilot_api.db.base import Base, TimestampMixin


class Order(TimestampMixin, Base):
    __tablename__ = "orders"
    __table_args__ = (
        CheckConstraint(
            "side IN ('BUY', 'SELL')",
            name="order_side",
        ),
        CheckConstraint(
            "order_type IN ('MARKET', 'LIMIT')",
            name="order_type",
        ),
        CheckConstraint(
            "status IN ('PENDING', 'FILLED', 'REJECTED', 'CANCELLED')",
            name="order_status",
        ),
        CheckConstraint("quantity > 0", name="order_positive_quantity"),
        CheckConstraint(
            "limit_price IS NULL OR limit_price > 0",
            name="order_positive_limit_price",
        ),
        CheckConstraint(
            "(order_type = 'MARKET' AND limit_price IS NULL) OR "
            "(order_type = 'LIMIT' AND limit_price IS NOT NULL)",
            name="order_limit_price_matches_type",
        ),
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
    symbol: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    side: Mapped[str] = mapped_column(String(8), nullable=False)
    order_type: Mapped[str] = mapped_column(String(16), nullable=False)
    quantity: Mapped[Decimal] = mapped_column(
        Numeric(20, 8),
        nullable=False,
    )
    limit_price: Mapped[Decimal | None] = mapped_column(
        Numeric(20, 4),
        nullable=True,
    )
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False)
    strategy_version: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )
    decision_evidence: Mapped[str] = mapped_column(Text, nullable=False)
