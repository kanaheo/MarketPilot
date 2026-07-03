"""create market quote snapshots

Revision ID: 20260703_06
Revises: 20260701_05
Create Date: 2026-07-03
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "20260703_06"
down_revision: str | Sequence[str] | None = "20260701_05"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "market_quote_snapshots",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("symbol", sa.String(length=32), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column(
            "current_price",
            sa.Numeric(precision=20, scale=4),
            nullable=False,
        ),
        sa.Column("source", sa.String(length=32), nullable=False),
        sa.Column(
            "collected_at",
            sa.DateTime(timezone=True),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id", name="pk_market_quote_snapshots"),
    )
    op.create_index(
        "ix_market_quote_snapshots_collected_at",
        "market_quote_snapshots",
        ["collected_at"],
        unique=False,
    )
    op.create_index(
        "ix_market_quote_snapshots_currency",
        "market_quote_snapshots",
        ["currency"],
        unique=False,
    )
    op.create_index(
        "ix_market_quote_snapshots_source",
        "market_quote_snapshots",
        ["source"],
        unique=False,
    )
    op.create_index(
        "ix_market_quote_snapshots_symbol",
        "market_quote_snapshots",
        ["symbol"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_market_quote_snapshots_symbol",
        table_name="market_quote_snapshots",
    )
    op.drop_index(
        "ix_market_quote_snapshots_source",
        table_name="market_quote_snapshots",
    )
    op.drop_index(
        "ix_market_quote_snapshots_currency",
        table_name="market_quote_snapshots",
    )
    op.drop_index(
        "ix_market_quote_snapshots_collected_at",
        table_name="market_quote_snapshots",
    )
    op.drop_table("market_quote_snapshots")
