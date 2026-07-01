"""add execution fx snapshot

Revision ID: 20260701_05
Revises: 20260626_04
Create Date: 2026-07-01
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "20260701_05"
down_revision: str | Sequence[str] | None = "20260626_04"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "order_executions",
        sa.Column(
            "portfolio_base_currency",
            sa.String(length=3),
            nullable=True,
        ),
    )
    op.add_column(
        "order_executions",
        sa.Column(
            "execution_fx_rate",
            sa.Numeric(precision=20, scale=6),
            nullable=True,
        ),
    )
    op.execute(
        "UPDATE order_executions "
        "SET portfolio_base_currency = currency, "
        "execution_fx_rate = 1.000000"
    )
    op.alter_column(
        "order_executions",
        "portfolio_base_currency",
        nullable=False,
    )
    op.alter_column(
        "order_executions",
        "execution_fx_rate",
        nullable=False,
    )


def downgrade() -> None:
    op.drop_column("order_executions", "execution_fx_rate")
    op.drop_column("order_executions", "portfolio_base_currency")
