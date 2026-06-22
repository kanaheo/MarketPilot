"""create orders

Revision ID: 20260622_03
Revises: 20260622_02
Create Date: 2026-06-22
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "20260622_03"
down_revision: str | Sequence[str] | None = "20260622_02"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "orders",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("portfolio_id", sa.Uuid(), nullable=False),
        sa.Column("symbol", sa.String(length=32), nullable=False),
        sa.Column("side", sa.String(length=8), nullable=False),
        sa.Column("order_type", sa.String(length=16), nullable=False),
        sa.Column(
            "quantity",
            sa.Numeric(precision=20, scale=8),
            nullable=False,
        ),
        sa.Column(
            "limit_price",
            sa.Numeric(precision=20, scale=4),
            nullable=True,
        ),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column(
            "strategy_version",
            sa.String(length=120),
            nullable=False,
        ),
        sa.Column("decision_evidence", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "side IN ('BUY', 'SELL')",
            name="order_side",
        ),
        sa.CheckConstraint(
            "order_type IN ('MARKET', 'LIMIT')",
            name="order_type",
        ),
        sa.CheckConstraint(
            "status IN ('PENDING', 'FILLED', 'REJECTED', 'CANCELLED')",
            name="order_status",
        ),
        sa.CheckConstraint(
            "quantity > 0",
            name="order_positive_quantity",
        ),
        sa.CheckConstraint(
            "limit_price IS NULL OR limit_price > 0",
            name="order_positive_limit_price",
        ),
        sa.CheckConstraint(
            "(order_type = 'MARKET' AND limit_price IS NULL) OR "
            "(order_type = 'LIMIT' AND limit_price IS NOT NULL)",
            name="order_limit_price_matches_type",
        ),
        sa.ForeignKeyConstraint(
            ["portfolio_id"],
            ["portfolios.id"],
            name="fk_orders_portfolio_id_portfolios",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_orders"),
    )
    op.create_index(
        "ix_orders_portfolio_id",
        "orders",
        ["portfolio_id"],
        unique=False,
    )
    op.create_index(
        "ix_orders_symbol",
        "orders",
        ["symbol"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_orders_symbol", table_name="orders")
    op.drop_index("ix_orders_portfolio_id", table_name="orders")
    op.drop_table("orders")
