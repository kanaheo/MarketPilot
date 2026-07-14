import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from marketpilot_api.db.base import Base, TimestampMixin


class UserPasswordCredential(TimestampMixin, Base):
    __tablename__ = "user_password_credentials"
    __table_args__ = (
        UniqueConstraint("user_id", name="uq_user_password_credentials_user_id"),
        UniqueConstraint(
            "normalized_email",
            name="uq_user_password_credentials_normalized_email",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    normalized_email: Mapped[str] = mapped_column(
        String(320),
        nullable=False,
    )
    password_hash: Mapped[str] = mapped_column(String(512), nullable=False)
    password_hash_algorithm: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
    )
    password_hash_parameters: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    email_verified_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    failed_login_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        server_default="0",
    )
    locked_until: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    password_changed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
