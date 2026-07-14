from marketpilot_api.core.password_policy import (
    MAX_PASSWORD_LENGTH,
    validate_password_policy,
)


def test_validate_password_policy_accepts_required_composition() -> None:
    result = validate_password_policy("MarketPilot2026!")

    assert result.is_valid is True
    assert result.errors == ()


def test_validate_password_policy_rejects_short_password() -> None:
    result = validate_password_policy("Aa1!short")

    assert result.is_valid is False
    assert "password_too_short" in result.errors


def test_validate_password_policy_rejects_missing_required_classes() -> None:
    result = validate_password_policy("marketpilotsecure")

    assert result.is_valid is False
    assert "missing_uppercase" in result.errors
    assert "missing_number" in result.errors
    assert "missing_special_character" in result.errors


def test_validate_password_policy_rejects_common_password() -> None:
    result = validate_password_policy("Password123!")

    assert result.is_valid is False
    assert "common_password" in result.errors


def test_validate_password_policy_allows_at_least_64_characters() -> None:
    result = validate_password_policy("A1!" + "a" * 61)

    assert result.is_valid is True


def test_validate_password_policy_rejects_excessively_long_password() -> None:
    result = validate_password_policy("A1!" + "a" * MAX_PASSWORD_LENGTH)

    assert result.is_valid is False
    assert "password_too_long" in result.errors
