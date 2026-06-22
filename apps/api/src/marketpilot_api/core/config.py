from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr


class Settings(BaseSettings):
    app_name: str = "MarketPilot API"
    app_version: str = "0.1.0"
    environment: Literal["local", "test", "production"] = "local"
    debug: bool = False
    internal_api_token: SecretStr | None = None
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
