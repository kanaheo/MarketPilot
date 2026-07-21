"""create user auth identities

Revision ID: 20260721_09
Revises: 20260714_08
Create Date: 2026-07-21
"""

from collections.abc import Sequence
import uuid

from alembic import op
import sqlalchemy as sa

revision: str = "20260721_09"
down_revision: str | Sequence[str] | None = "20260714_08"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "user_auth_identities",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("user_id", sa.Uuid(), nullable=False),
        sa.Column("auth_provider", sa.String(length=32), nullable=False),
        sa.Column("auth_subject", sa.String(length=255), nullable=False),
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
            name="fk_user_auth_identities_user_id_users",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_user_auth_identities"),
        sa.UniqueConstraint(
            "auth_provider",
            "auth_subject",
            name="uq_user_auth_identities_auth_identity",
        ),
        sa.UniqueConstraint(
            "user_id",
            "auth_provider",
            name="uq_user_auth_identities_user_provider",
        ),
    )
    op.create_index(
        "ix_user_auth_identities_user_id",
        "user_auth_identities",
        ["user_id"],
        unique=False,
    )

    connection = op.get_bind()
    existing_users = connection.execute(
        sa.text(
            """
            SELECT id, auth_provider, auth_subject
            FROM users
            """
        )
    )
    for user_id, auth_provider, auth_subject in existing_users:
        connection.execute(
            sa.text(
                """
                INSERT INTO user_auth_identities (
                    id,
                    user_id,
                    auth_provider,
                    auth_subject
                )
                VALUES (
                    :id,
                    :user_id,
                    :auth_provider,
                    :auth_subject
                )
                """
            ),
            {
                "id": uuid.uuid4(),
                "user_id": user_id,
                "auth_provider": auth_provider,
                "auth_subject": auth_subject,
            },
        )


def downgrade() -> None:
    op.drop_index(
        "ix_user_auth_identities_user_id",
        table_name="user_auth_identities",
    )
    op.drop_table("user_auth_identities")
