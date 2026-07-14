from datetime import datetime, timezone
from unittest.mock import MagicMock
import uuid

import pytest

from marketpilot_api.models import User, UserPasswordCredential
from marketpilot_api.repositories.password_auth import (
    PasswordAuthEmailNotVerifiedError,
    PasswordAuthInvalidCredentialsError,
    PasswordAuthInvalidTokenError,
    complete_password_reset,
    confirm_email_verification_token,
    create_password_user,
    normalize_email,
    request_password_reset_token,
    verify_password_user,
)


def test_normalize_email_strips_and_casefolds() -> None:
    assert normalize_email(" Developer@Example.COM ") == "developer@example.com"


def test_create_password_user_adds_user_and_credential() -> None:
    session = MagicMock()

    user, credential, verification_token = create_password_user(
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
    assert credential.password_hash_algorithm == "argon2id"
    assert credential.email_verified_at is None
    assert len(verification_token) >= 32
    assert session.add.call_count == 3
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
        password_hash_algorithm="argon2id",
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
        password_hash_algorithm="argon2id",
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


def test_confirm_email_verification_token_marks_credential_verified() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    _user, credential, verification_token = create_password_user(
        session,
        email="developer@example.com",
        password="MarketPilot2026!",
        display_name=None,
    )
    auth_token = session.add.call_args_list[2].args[0]
    session.reset_mock()
    session.scalar.side_effect = [auth_token, credential]

    confirm_email_verification_token(session, token=verification_token)

    assert credential.email_verified_at is not None
    assert auth_token.used_at is not None
    session.commit.assert_called_once()


def test_confirm_email_verification_token_rejects_used_token() -> None:
    session = MagicMock()
    _user, _credential, verification_token = create_password_user(
        session,
        email="developer@example.com",
        password="MarketPilot2026!",
        display_name=None,
    )
    auth_token = session.add.call_args_list[2].args[0]
    auth_token.used_at = datetime.now(timezone.utc)
    session.reset_mock()
    session.scalar.return_value = auth_token

    with pytest.raises(PasswordAuthInvalidTokenError):
        confirm_email_verification_token(session, token=verification_token)


def test_request_password_reset_token_is_generic_for_unknown_email() -> None:
    session = MagicMock()
    session.scalar.return_value = None

    token = request_password_reset_token(
        session,
        email="missing@example.com",
    )

    assert token is None
    session.add.assert_not_called()
    session.commit.assert_not_called()


def test_complete_password_reset_updates_credential_and_marks_token_used() -> None:
    session = MagicMock()
    user_id = uuid.uuid4()
    credential = UserPasswordCredential(
        id=uuid.uuid4(),
        user_id=user_id,
        normalized_email="developer@example.com",
        password_hash="old-hash",
        password_hash_algorithm="argon2id",
        password_hash_parameters="old-params",
        email_verified_at=datetime.now(timezone.utc),
        failed_login_count=4,
    )
    session.scalar.return_value = credential
    reset_token = request_password_reset_token(
        session,
        email="developer@example.com",
    )
    auth_token = session.add.call_args.args[0]
    session.reset_mock()
    session.scalar.side_effect = [auth_token, credential]

    complete_password_reset(
        session,
        token=reset_token or "",
        new_password="NewMarketPilot2026!",
    )

    assert credential.password_hash != "old-hash"
    assert credential.failed_login_count == 0
    assert credential.password_changed_at is not None
    assert auth_token.used_at is not None
    session.commit.assert_called_once()
