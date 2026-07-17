import pytest
from pydantic import ValidationError

from marketpilot_api.core.config import Settings


def test_settings_use_safe_defaults() -> None:
    settings = Settings(_env_file=None)

    assert settings.app_name == "MarketPilot API"
    assert settings.app_version == "0.1.0"
    assert settings.environment == "local"
    assert settings.debug is False
    assert settings.internal_api_token is None
    assert settings.user_api_signing_secret is None
    assert settings.finnhub_api_key is None
    assert settings.email_provider == "disabled"
    assert settings.email_from is None
    assert settings.auth_email_base_url == "http://localhost:3000"
    assert settings.smtp_host is None
    assert settings.smtp_port == 587
    assert settings.smtp_username is None
    assert settings.smtp_password is None
    assert settings.smtp_use_tls is True
    assert settings.smtp_timeout_seconds == 10
    assert settings.market_data_quote_provider == "fixture"
    assert settings.market_data_cache_ttl_seconds == 300
    assert settings.market_data_scheduler_open_interval_seconds == 300
    assert settings.market_data_scheduler_closed_interval_seconds == 3600
    assert settings.market_data_scheduler_open_freshness_seconds == 300
    assert settings.market_data_scheduler_closed_freshness_seconds == 3600
    assert settings.market_data_scheduler_market_timezone == "America/New_York"
    assert settings.database_url.startswith("postgresql+psycopg://")


def test_settings_read_prefixed_environment_variables(
    monkeypatch,
) -> None:
    monkeypatch.setenv("MARKETPILOT_ENVIRONMENT", "test")
    monkeypatch.setenv("MARKETPILOT_DEBUG", "true")
    monkeypatch.setenv("MARKETPILOT_INTERNAL_API_TOKEN", "test-token")
    monkeypatch.setenv("MARKETPILOT_FINNHUB_API_KEY", "test-finnhub-key")
    monkeypatch.setenv("MARKETPILOT_EMAIL_PROVIDER", "smtp")
    monkeypatch.setenv("MARKETPILOT_EMAIL_FROM", "no-reply@example.com")
    monkeypatch.setenv(
        "MARKETPILOT_AUTH_EMAIL_BASE_URL",
        "https://app.example.com",
    )
    monkeypatch.setenv("MARKETPILOT_SMTP_HOST", "smtp.example.com")
    monkeypatch.setenv("MARKETPILOT_SMTP_PORT", "2525")
    monkeypatch.setenv("MARKETPILOT_SMTP_USERNAME", "smtp-user")
    monkeypatch.setenv("MARKETPILOT_SMTP_PASSWORD", "smtp-password")
    monkeypatch.setenv("MARKETPILOT_SMTP_USE_TLS", "false")
    monkeypatch.setenv("MARKETPILOT_SMTP_TIMEOUT_SECONDS", "20")
    monkeypatch.setenv("MARKETPILOT_MARKET_DATA_QUOTE_PROVIDER", "finnhub")
    monkeypatch.setenv("MARKETPILOT_MARKET_DATA_CACHE_TTL_SECONDS", "60")
    monkeypatch.setenv(
        "MARKETPILOT_MARKET_DATA_SCHEDULER_OPEN_INTERVAL_SECONDS",
        "120",
    )
    monkeypatch.setenv(
        "MARKETPILOT_MARKET_DATA_SCHEDULER_CLOSED_INTERVAL_SECONDS",
        "7200",
    )
    monkeypatch.setenv(
        "MARKETPILOT_MARKET_DATA_SCHEDULER_OPEN_FRESHNESS_SECONDS",
        "120",
    )
    monkeypatch.setenv(
        "MARKETPILOT_MARKET_DATA_SCHEDULER_CLOSED_FRESHNESS_SECONDS",
        "7200",
    )
    monkeypatch.setenv(
        "MARKETPILOT_MARKET_DATA_SCHEDULER_MARKET_TIMEZONE",
        "America/Chicago",
    )
    monkeypatch.setenv(
        "MARKETPILOT_USER_API_SIGNING_SECRET",
        "test-signing-secret",
    )

    settings = Settings(_env_file=None)

    assert settings.environment == "test"
    assert settings.debug is True
    assert settings.internal_api_token is not None
    assert settings.internal_api_token.get_secret_value() == "test-token"
    assert settings.user_api_signing_secret is not None
    assert (
        settings.user_api_signing_secret.get_secret_value()
        == "test-signing-secret"
    )
    assert settings.finnhub_api_key is not None
    assert settings.finnhub_api_key.get_secret_value() == "test-finnhub-key"
    assert settings.email_provider == "smtp"
    assert settings.email_from == "no-reply@example.com"
    assert settings.auth_email_base_url == "https://app.example.com"
    assert settings.smtp_host == "smtp.example.com"
    assert settings.smtp_port == 2525
    assert settings.smtp_username is not None
    assert settings.smtp_username.get_secret_value() == "smtp-user"
    assert settings.smtp_password is not None
    assert settings.smtp_password.get_secret_value() == "smtp-password"
    assert settings.smtp_use_tls is False
    assert settings.smtp_timeout_seconds == 20
    assert settings.market_data_quote_provider == "finnhub"
    assert settings.market_data_cache_ttl_seconds == 60
    assert settings.market_data_scheduler_open_interval_seconds == 120
    assert settings.market_data_scheduler_closed_interval_seconds == 7200
    assert settings.market_data_scheduler_open_freshness_seconds == 120
    assert settings.market_data_scheduler_closed_freshness_seconds == 7200
    assert settings.market_data_scheduler_market_timezone == "America/Chicago"


def test_production_settings_require_auth_secrets(monkeypatch) -> None:
    monkeypatch.setenv("MARKETPILOT_ENVIRONMENT", "production")
    monkeypatch.delenv("MARKETPILOT_INTERNAL_API_TOKEN", raising=False)
    monkeypatch.delenv("MARKETPILOT_USER_API_SIGNING_SECRET", raising=False)

    with pytest.raises(ValidationError) as exc_info:
        Settings(_env_file=None)

    error_message = str(exc_info.value)
    assert "internal_api_token" in error_message
    assert "user_api_signing_secret" in error_message


def test_production_settings_accept_required_auth_secrets(monkeypatch) -> None:
    monkeypatch.setenv("MARKETPILOT_ENVIRONMENT", "production")
    monkeypatch.setenv("MARKETPILOT_INTERNAL_API_TOKEN", "internal-token")
    monkeypatch.setenv("MARKETPILOT_USER_API_SIGNING_SECRET", "signing-secret")

    settings = Settings(_env_file=None)

    assert settings.environment == "production"
    assert settings.internal_api_token is not None
    assert settings.user_api_signing_secret is not None


def test_production_smtp_settings_require_sender_and_host(monkeypatch) -> None:
    monkeypatch.setenv("MARKETPILOT_ENVIRONMENT", "production")
    monkeypatch.setenv("MARKETPILOT_INTERNAL_API_TOKEN", "internal-token")
    monkeypatch.setenv("MARKETPILOT_USER_API_SIGNING_SECRET", "signing-secret")
    monkeypatch.setenv("MARKETPILOT_EMAIL_PROVIDER", "smtp")
    monkeypatch.delenv("MARKETPILOT_EMAIL_FROM", raising=False)
    monkeypatch.delenv("MARKETPILOT_SMTP_HOST", raising=False)

    with pytest.raises(ValidationError) as exc_info:
        Settings(_env_file=None)

    error_message = str(exc_info.value)
    assert "email_from" in error_message
    assert "smtp_host" in error_message
