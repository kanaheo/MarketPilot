"""create portfolio ledger

Revision ID: 20260622_02
Revises: 20260622_01
Create Date: 2026-06-22
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "20260622_02"
down_revision: str | Sequence[str] | None = "20260622_01"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "portfolios",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("base_currency", sa.String(length=3), nullable=False),
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
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name="fk_portfolios_user_id_users",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_portfolios"),
    )
    op.create_index(
        "ix_portfolios_user_id",
        "portfolios",
        ["user_id"],
        unique=False,
    )

    op.create_table(
        "cash_transactions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("portfolio_id", sa.Uuid(), nullable=False),
        sa.Column("transaction_type", sa.String(length=32), nullable=False),
        sa.Column("amount", sa.Numeric(precision=20, scale=4), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("occurred_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("note", sa.String(length=500), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "amount > 0",
            name="cash_transaction_positive_amount",
        ),
        sa.CheckConstraint(
            "transaction_type IN "
            "('INITIAL_DEPOSIT', 'DEPOSIT', 'WITHDRAWAL', 'FEE', 'DIVIDEND')",
            name="cash_transaction_type",
        ),
        sa.ForeignKeyConstraint(
            ["portfolio_id"],
            ["portfolios.id"],
            name="fk_cash_transactions_portfolio_id_portfolios",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_cash_transactions"),
    )
    op.create_index(
        "ix_cash_transactions_occurred_at",
        "cash_transactions",
        ["occurred_at"],
        unique=False,
    )
    op.create_index(
        "ix_cash_transactions_portfolio_id",
        "cash_transactions",
        ["portfolio_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_cash_transactions_portfolio_id",
        table_name="cash_transactions",
    )
    op.drop_index(
        "ix_cash_transactions_occurred_at",
        table_name="cash_transactions",
    )
    op.drop_table("cash_transactions")
    op.drop_index("ix_portfolios_user_id", table_name="portfolios")
    op.drop_table("portfolios")
