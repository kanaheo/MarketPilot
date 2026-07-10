from datetime import datetime, timezone

from marketpilot_api.core.config import Settings
from marketpilot_api.market_data_scheduler_policy import (
    decide_market_data_scheduler_policy,
)


def test_market_data_scheduler_policy_uses_open_market_settings() -> None:
    settings = Settings(_env_file=None)

    decision = decide_market_data_scheduler_policy(
        now=datetime(2026, 7, 8, 14, 0, tzinfo=timezone.utc),
        settings=settings,
    )

    assert decision.phase == "open"
    assert decision.interval_seconds == 300
    assert decision.freshness_seconds == 300


def test_market_data_scheduler_policy_uses_closed_market_settings() -> None:
    settings = Settings(_env_file=None)

    decision = decide_market_data_scheduler_policy(
        now=datetime(2026, 7, 11, 14, 0, tzinfo=timezone.utc),
        settings=settings,
    )

    assert decision.phase == "closed"
    assert decision.interval_seconds == 3600
    assert decision.freshness_seconds == 3600


def test_market_data_scheduler_policy_marks_after_hours_as_not_open() -> None:
    settings = Settings(_env_file=None)

    decision = decide_market_data_scheduler_policy(
        now=datetime(2026, 7, 8, 22, 0, tzinfo=timezone.utc),
        settings=settings,
    )

    assert decision.phase == "after_hours"
    assert decision.interval_seconds == 3600
    assert decision.freshness_seconds == 3600
