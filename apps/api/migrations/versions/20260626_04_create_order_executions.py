"""create order executions

Revision ID: 20260626_04
Revises: 20260622_03
Create Date: 2026-06-26
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "20260626_04"
down_revision: str | Sequence[str] | None = "20260622_03"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.drop_constraint(
        "cash_transaction_type",
        "cash_transactions",
        type_="check",
    )
    op.create_check_constraint(
        "cash_transaction_type",
        "cash_transactions",
        "transaction_type IN "
        "('INITIAL_DEPOSIT', 'DEPOSIT', 'WITHDRAWAL', 'FEE', "
        "'DIVIDEND', 'TRADE_BUY', 'TRADE_SELL')",
    )

    op.create_table(
        "order_executions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("order_id", sa.Uuid(), nullable=False),
        sa.Column("portfolio_id", sa.Uuid(), nullable=False),
        sa.Column("symbol", sa.String(length=32), nullable=False),
        sa.Column("side", sa.String(length=8), nullable=False),
        sa.Column(
            "quantity",
            sa.Numeric(precision=20, scale=8),
            nullable=False,
        ),
        sa.Column(
            "price",
            sa.Numeric(precision=20, scale=4),
            nullable=False,
        ),
        sa.Column(
            "gross_amount",
            sa.Numeric(precision=20, scale=4),
            nullable=False,
        ),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column(
            "executed_at",
            sa.DateTime(timezone=True),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["order_id"],
            ["orders.id"],
            name="fk_order_executions_order_id_orders",
        ),
        sa.ForeignKeyConstraint(
            ["portfolio_id"],
            ["portfolios.id"],
            name="fk_order_executions_portfolio_id_portfolios",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_order_executions"),
    )
    op.create_index(
        "ix_order_executions_executed_at",
        "order_executions",
        ["executed_at"],
        unique=False,
    )
    op.create_index(
        "ix_order_executions_order_id",
        "order_executions",
        ["order_id"],
        unique=False,
    )
    op.create_index(
        "ix_order_executions_portfolio_id",
        "order_executions",
        ["portfolio_id"],
        unique=False,
    )
    op.create_index(
        "ix_order_executions_symbol",
        "order_executions",
        ["symbol"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_order_executions_symbol", table_name="order_executions")
    op.drop_index(
        "ix_order_executions_portfolio_id",
        table_name="order_executions",
    )
    op.drop_index(
        "ix_order_executions_order_id",
        table_name="order_executions",
    )
    op.drop_index(
        "ix_order_executions_executed_at",
        table_name="order_executions",
    )
    op.drop_table("order_executions")

    op.drop_constraint(
        "cash_transaction_type",
        "cash_transactions",
        type_="check",
    )
    op.create_check_constraint(
        "cash_transaction_type",
        "cash_transactions",
        "transaction_type IN "
        "('INITIAL_DEPOSIT', 'DEPOSIT', 'WITHDRAWAL', 'FEE', 'DIVIDEND')",
    )
