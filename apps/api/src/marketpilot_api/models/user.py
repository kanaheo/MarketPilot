import uuid

from sqlalchemy import String, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from marketpilot_api.db.base import Base, TimestampMixin


class User(TimestampMixin, Base):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint(
            "auth_provider",
            "auth_subject",
            name="uq_users_auth_identity",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    auth_provider: Mapped[str] = mapped_column(String(32), nullable=False)
    auth_subject: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(
        String(320),
        nullable=True,
        index=True,
    )
    display_name: Mapped[str | None] = mapped_column(
        String(120),
        nullable=True,
    )
    image_url: Mapped[str | None] = mapped_column(
        String(2048),
        nullable=True,
    )
