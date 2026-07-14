from datetime import datetime, timezone
from unittest.mock import MagicMock
import uuid

import pytest

from marketpilot_api.models import User, UserPasswordCredential
from marketpilot_api.repositories.password_auth import (
    PasswordAuthEmailNotVerifiedError,
    PasswordAuthInvalidCredentialsError,
    create_password_user,
    normalize_email,
    verify_password_user,
)


def test_normalize_email_strips_and_casefolds() -> None:
    assert normalize_email(" Developer@Example.COM ") == "developer@example.com"


def test_create_password_user_adds_user_and_credential() -> None:
    session = MagicMock()

    user, credential = create_password_user(
        session,
        email="Developer@Example.com",
        password="MarketPilot2026!",
        display_name="Market Pilot",
    )

    assert user.email == "developer@example.com"
    assert user.auth_provider == "password"
    assert user.auth_subject == "developer@example.com"
    assert credential.normalized_email == "developer@example.com"
    assert credential.password_hash != "MarketPilot2026!"
    assert credential.password_hash_algorithm == "scrypt"
    assert credential.email_verified_at is None
    assert session.add.call_count == 2
    session.commit.assert_called_once()


def test_verify_password_user_rejects_missing_credential() -> None:
    session = MagicMock()
    session.scalar.return_value = None

    with pytest.raises(PasswordAuthInvalidCredentialsError):
        verify_password_user(
            session,
            email="developer@example.com",
            password="MarketPilot2026!",
        )


def test_verify_password_user_requires_verified_email(monkeypatch) -> None:
    session = MagicMock()
    credential = UserPasswordCredential(
        id=uuid.uuid4(),
        user_id=uuid.uuid4(),
        normalized_email="developer@example.com",
        password_hash="stored",
        password_hash_algorithm="scrypt",
        password_hash_parameters="params",
        email_verified_at=None,
    )
    session.scalar.return_value = credential
    monkeypatch.setattr(
        "marketpilot_api.repositories.password_auth.verify_password",
        MagicMock(return_value=True),
    )

    with pytest.raises(PasswordAuthEmailNotVerifiedError):
        verify_password_user(
            session,
            email="developer@example.com",
            password="MarketPilot2026!",
        )


def test_verify_password_user_returns_user_for_valid_credentials(monkeypatch) -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    credential = UserPasswordCredential(
        id=uuid.uuid4(),
        user_id=user_id,
        normalized_email="developer@example.com",
        password_hash="stored",
        password_hash_algorithm="scrypt",
        password_hash_parameters="params",
        email_verified_at=datetime.now(timezone.utc),
        failed_login_count=2,
    )
    user = User(
        id=user_id,
        auth_provider="password",
        auth_subject="developer@example.com",
        email="developer@example.com",
    )
    session.scalar.side_effect = [credential, user]
    monkeypatch.setattr(
        "marketpilot_api.repositories.password_auth.verify_password",
        MagicMock(return_value=True),
    )

    result = verify_password_user(
        session,
        email="developer@example.com",
        password="MarketPilot2026!",
    )

    assert result is user
    assert credential.failed_login_count == 0
    session.commit.assert_called_once()
    session.refresh.assert_called_once_with(user)
