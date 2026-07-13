from dataclasses import dataclass
from datetime import datetime, time
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from marketpilot_api.core.config import Settings


@dataclass(frozen=True)
class MarketDataSchedulerDecision:
    phase: str
    interval_seconds: int
    freshness_seconds: int | None


def decide_market_data_scheduler_policy(
    *,
    now: datetime,
    settings: Settings,
) -> MarketDataSchedulerDecision:
    market_now = _convert_to_market_time(
        now=now,
        timezone_name=settings.market_data_scheduler_market_timezone,
    )
    phase = _determine_market_phase(market_now)
    is_open = phase == "open"

    return MarketDataSchedulerDecision(
        phase=phase,
        interval_seconds=(
            settings.market_data_scheduler_open_interval_seconds
            if is_open
            else settings.market_data_scheduler_closed_interval_seconds
        ),
        freshness_seconds=(
            settings.market_data_scheduler_open_freshness_seconds
            if is_open
            else settings.market_data_scheduler_closed_freshness_seconds
        ),
    )


def _convert_to_market_time(*, now: datetime, timezone_name: str) -> datetime:
    try:
        market_timezone = ZoneInfo(timezone_name)
    except ZoneInfoNotFoundError:
        market_timezone = ZoneInfo("America/New_York")

    if now.tzinfo is None:
        return now.replace(tzinfo=market_timezone)

    return now.astimezone(market_timezone)


def _determine_market_phase(market_now: datetime) -> str:
    if market_now.weekday() >= 5:
        return "closed"

    current_time = market_now.time()
    if time(9, 30) <= current_time < time(16, 0):
        return "open"
    if time(4, 0) <= current_time < time(9, 30):
        return "pre_market"
    if time(16, 0) <= current_time < time(20, 0):
        return "after_hours"

    return "closed"
