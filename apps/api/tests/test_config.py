from marketpilot_api.core.config import Settings


def test_settings_use_safe_defaults() -> None:
    settings = Settings(_env_file=None)

    assert settings.app_name == "MarketPilot API"
    assert settings.app_version == "0.1.0"
    assert settings.environment == "local"
    assert settings.debug is False
    assert settings.internal_api_token is None
    assert settings.database_url.startswith("postgresql+psycopg://")


def test_settings_read_prefixed_environment_variables(
    monkeypatch,
) -> None:
    monkeypatch.setenv("MARKETPILOT_ENVIRONMENT", "test")
    monkeypatch.setenv("MARKETPILOT_DEBUG", "true")
    monkeypatch.setenv("MARKETPILOT_INTERNAL_API_TOKEN", "test-token")

    settings = Settings(_env_file=None)

    assert settings.environment == "test"
    assert settings.debug is True
    assert settings.internal_api_token is not None
    assert settings.internal_api_token.get_secret_value() == "test-token"
