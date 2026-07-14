"""create password auth tables

Revision ID: 20260714_08
Revises: 20260708_07
Create Date: 2026-07-14
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "20260714_08"
down_revision: str | Sequence[str] | None = "20260708_07"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "user_password_credentials",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("normalized_email", sa.String(length=320), nullable=False),
        sa.Column("password_hash", sa.String(length=512), nullable=False),
        sa.Column("password_hash_algorithm", sa.String(length=32), nullable=False),
        sa.Column("password_hash_parameters", sa.String(length=255), nullable=True),
        sa.Column("email_verified_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "failed_login_count",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column("locked_until", sa.DateTime(timezone=True), nullable=True),
        sa.Column("password_changed_at", sa.DateTime(timezone=True), nullable=True),
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
            name="fk_user_password_credentials_user_id_users",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_user_password_credentials"),
        sa.UniqueConstraint(
            "normalized_email",
            name="uq_user_password_credentials_normalized_email",
        ),
        sa.UniqueConstraint("user_id", name="uq_user_password_credentials_user_id"),
    )
    op.create_index(
        "ix_user_password_credentials_user_id",
        "user_password_credentials",
        ["user_id"],
        unique=False,
    )

    op.create_table(
        "user_auth_tokens",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("purpose", sa.String(length=32), nullable=False),
        sa.Column("token_hash", sa.String(length=128), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            name="fk_user_auth_tokens_user_id_users",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_user_auth_tokens"),
        sa.UniqueConstraint("token_hash", name="uq_user_auth_tokens_token_hash"),
    )
    op.create_index(
        "ix_user_auth_tokens_expires_at",
        "user_auth_tokens",
        ["expires_at"],
        unique=False,
    )
    op.create_index(
        "ix_user_auth_tokens_purpose",
        "user_auth_tokens",
        ["purpose"],
        unique=False,
    )
    op.create_index(
        "ix_user_auth_tokens_user_id",
        "user_auth_tokens",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_user_auth_tokens_user_id", table_name="user_auth_tokens")
    op.drop_index("ix_user_auth_tokens_purpose", table_name="user_auth_tokens")
    op.drop_index("ix_user_auth_tokens_expires_at", table_name="user_auth_tokens")
    op.drop_table("user_auth_tokens")
    op.drop_index(
        "ix_user_password_credentials_user_id",
        table_name="user_password_credentials",
    )
    op.drop_table("user_password_credentials")
