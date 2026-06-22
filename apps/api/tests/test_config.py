from marketpilot_api.core.config import Settings


def test_settings_use_safe_defaults() -> None:
    settings = Settings(_env_file=None)

    assert settings.app_name == "MarketPilot API"
    assert settings.app_version == "0.1.0"
    assert settings.environment == "local"
    assert settings.debug is False


def test_settings_read_prefixed_environment_variables(
    monkeypatch,
) -> None:
    monkeypatch.setenv("MARKETPILOT_ENVIRONMENT", "test")
    monkeypatch.setenv("MARKETPILOT_DEBUG", "true")

    settings = Settings(_env_file=None)

    assert settings.environment == "test"
    assert settings.debug is True
