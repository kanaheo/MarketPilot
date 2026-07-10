from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MarketPilot API"
    app_version: str = "0.1.0"
    environment: Literal["local", "test", "production"] = "local"
    debug: bool = False
    internal_api_token: SecretStr | None = None
    user_api_signing_secret: SecretStr | None = None
    finnhub_api_key: SecretStr | None = None
    market_data_quote_provider: Literal["fixture", "finnhub"] = "fixture"
    market_data_cache_ttl_seconds: int = Field(default=300, ge=0)
    market_data_scheduler_open_interval_seconds: int = Field(default=300, ge=1)
    market_data_scheduler_closed_interval_seconds: int = Field(default=3600, ge=1)
    market_data_scheduler_open_freshness_seconds: int = Field(default=300, ge=1)
    market_data_scheduler_closed_freshness_seconds: int = Field(default=3600, ge=1)
    market_data_scheduler_market_timezone: str = "America/New_York"
    database_url: str = (
        "postgresql+psycopg://marketpilot:marketpilot@127.0.0.1:5432/"
        "marketpilot"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="MARKETPILOT_",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
