"""create market data scheduler runs

Revision ID: 20260708_07
Revises: 20260703_06
Create Date: 2026-07-08
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "20260708_07"
down_revision: str | Sequence[str] | None = "20260703_06"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "market_data_scheduler_runs",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("job_name", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("symbols_source", sa.String(length=32), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=True),
        sa.Column("interval_policy", sa.String(length=32), nullable=False),
        sa.Column("market_phase", sa.String(length=32), nullable=False),
        sa.Column(
            "next_interval_seconds",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column("freshness_seconds", sa.Integer(), nullable=True),
        sa.Column(
            "started_at",
            sa.DateTime(timezone=True),
            nullable=False,
        ),
        sa.Column(
            "completed_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
        sa.Column(
            "requested_count",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column(
            "collectable_count",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column(
            "fresh_skipped_count",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column(
            "returned_count",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column(
            "stored_count",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column(
            "skipped_count",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id", name="pk_market_data_scheduler_runs"),
    )
    op.create_index(
        "ix_market_data_scheduler_runs_job_name",
        "market_data_scheduler_runs",
        ["job_name"],
        unique=False,
    )
    op.create_index(
        "ix_market_data_scheduler_runs_market_phase",
        "market_data_scheduler_runs",
        ["market_phase"],
        unique=False,
    )
    op.create_index(
        "ix_market_data_scheduler_runs_started_at",
        "market_data_scheduler_runs",
        ["started_at"],
        unique=False,
    )
    op.create_index(
        "ix_market_data_scheduler_runs_status",
        "market_data_scheduler_runs",
        ["status"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_market_data_scheduler_runs_status",
        table_name="market_data_scheduler_runs",
    )
    op.drop_index(
        "ix_market_data_scheduler_runs_started_at",
        table_name="market_data_scheduler_runs",
    )
    op.drop_index(
        "ix_market_data_scheduler_runs_market_phase",
        table_name="market_data_scheduler_runs",
    )
    op.drop_index(
        "ix_market_data_scheduler_runs_job_name",
        table_name="market_data_scheduler_runs",
    )
    op.drop_table("market_data_scheduler_runs")
