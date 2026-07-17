from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic import model_validator
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
    email_provider: Literal["disabled", "smtp"] = "disabled"
    email_from: str | None = None
    auth_email_base_url: str = "http://localhost:3000"
    smtp_host: str | None = None
    smtp_port: int = Field(default=587, ge=1, le=65535)
    smtp_username: SecretStr | None = None
    smtp_password: SecretStr | None = None
    smtp_use_tls: bool = True
    smtp_timeout_seconds: int = Field(default=10, ge=1)
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

    @model_validator(mode="after")
    def validate_production_secrets(self) -> "Settings":
        if self.environment != "production":
            return self

        missing_secrets = [
            name
            for name, value in {
                "internal_api_token": self.internal_api_token,
                "user_api_signing_secret": self.user_api_signing_secret,
            }.items()
            if value is None
        ]
        if missing_secrets:
            raise ValueError(
                "Production settings require: "
                + ", ".join(sorted(missing_secrets))
            )

        if self.email_provider == "smtp":
            missing_email_settings = [
                name
                for name, value in {
                    "email_from": self.email_from,
                    "smtp_host": self.smtp_host,
                }.items()
                if value is None
            ]
            if missing_email_settings:
                raise ValueError(
                    "Production SMTP email settings require: "
                    + ", ".join(sorted(missing_email_settings))
                )

        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
