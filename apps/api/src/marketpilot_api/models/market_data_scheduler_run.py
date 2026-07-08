import uuid
from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from marketpilot_api.db.base import Base, CreatedAtMixin


class MarketDataSchedulerRun(CreatedAtMixin, Base):
    __tablename__ = "market_data_scheduler_runs"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
    )
    job_name: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    symbols_source: Mapped[str] = mapped_column(String(32), nullable=False)
    currency: Mapped[str | None] = mapped_column(String(3), nullable=True)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    requested_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    collectable_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    fresh_skipped_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    returned_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    stored_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    skipped_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
