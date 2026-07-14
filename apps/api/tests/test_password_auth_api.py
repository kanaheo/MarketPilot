from unittest.mock import MagicMock
import uuid

from fastapi.testclient import TestClient

from marketpilot_api.db.session import get_db_session
from marketpilot_api.main import app
from marketpilot_api.models import User
from marketpilot_api.repositories.password_auth import (
    PasswordAuthDuplicateEmailError,
    PasswordAuthEmailNotVerifiedError,
    PasswordAuthInvalidCredentialsError,
    PasswordAuthInvalidTokenError,
)
from marketpilot_api.routers import password_auth as password_auth_router


def override_session(session: MagicMock):
    def dependency_override():
        yield session

    return dependency_override


def clear_dependency_overrides() -> None:
    app.dependency_overrides.clear()


def test_password_signup_rejects_weak_password() -> None:
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.post(
            "/auth/password/signup",
            json={
                "email": "developer@example.com",
                "password": "weak",
            },
        )

    clear_dependency_overrides()
    assert response.status_code == 422
    assert response.json()["detail"]["code"] == "password_policy_failed"


def test_password_signup_returns_created_user(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="password",
        auth_subject="developer@example.com",
        email="developer@example.com",
    )
    create_mock = MagicMock(return_value=(user, object(), "verification-token"))
    monkeypatch.setattr(password_auth_router, "create_password_user", create_mock)
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.post(
            "/auth/password/signup",
            json={
                "email": "Developer@Example.com",
                "password": "MarketPilot2026!",
                "display_name": "Market Pilot",
            },
        )

    clear_dependency_overrides()
    assert response.status_code == 201
    assert response.json() == {
        "user_id": str(user.id),
        "email": "developer@example.com",
        "email_verification_required": True,
    }
    assert create_mock.call_args.kwargs["email"] == "Developer@example.com"


def test_password_signup_rejects_duplicate_email(monkeypatch) -> None:
    create_mock = MagicMock(side_effect=PasswordAuthDuplicateEmailError)
    monkeypatch.setattr(password_auth_router, "create_password_user", create_mock)
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.post(
            "/auth/password/signup",
            json={
                "email": "developer@example.com",
                "password": "MarketPilot2026!",
            },
        )

    clear_dependency_overrides()
    assert response.status_code == 409


def test_password_verify_returns_user(monkeypatch) -> None:
    user = User(
        id=uuid.uuid4(),
        auth_provider="password",
        auth_subject="developer@example.com",
        email="developer@example.com",
        display_name=None,
        image_url=None,
    )
    verify_mock = MagicMock(return_value=user)
    monkeypatch.setattr(password_auth_router, "verify_password_user", verify_mock)
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.post(
            "/auth/password/verify",
            json={
                "email": "developer@example.com",
                "password": "MarketPilot2026!",
            },
        )

    clear_dependency_overrides()
    assert response.status_code == 200
    assert response.json()["id"] == str(user.id)
    assert response.json()["auth_provider"] == "password"


def test_password_verify_rejects_invalid_credentials(monkeypatch) -> None:
    verify_mock = MagicMock(side_effect=PasswordAuthInvalidCredentialsError)
    monkeypatch.setattr(password_auth_router, "verify_password_user", verify_mock)
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.post(
            "/auth/password/verify",
            json={
                "email": "developer@example.com",
                "password": "WrongPassword2026!",
            },
        )

    clear_dependency_overrides()
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_password_verify_requires_email_verification(monkeypatch) -> None:
    verify_mock = MagicMock(side_effect=PasswordAuthEmailNotVerifiedError)
    monkeypatch.setattr(password_auth_router, "verify_password_user", verify_mock)
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.post(
            "/auth/password/verify",
            json={
                "email": "developer@example.com",
                "password": "MarketPilot2026!",
            },
        )

    clear_dependency_overrides()
    assert response.status_code == 403
    assert response.json()["detail"] == "Email verification is required"


def test_email_verification_confirm_returns_success(monkeypatch) -> None:
    confirm_mock = MagicMock(return_value=None)
    monkeypatch.setattr(
        password_auth_router,
        "confirm_email_verification_token",
        confirm_mock,
    )
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.post(
            "/auth/password/email-verification/confirm",
            json={"token": "a" * 48},
        )

    clear_dependency_overrides()
    assert response.status_code == 200
    assert response.json()["message"] == "Email verified"


def test_email_verification_confirm_rejects_invalid_token(monkeypatch) -> None:
    confirm_mock = MagicMock(side_effect=PasswordAuthInvalidTokenError)
    monkeypatch.setattr(
        password_auth_router,
        "confirm_email_verification_token",
        confirm_mock,
    )
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.post(
            "/auth/password/email-verification/confirm",
            json={"token": "a" * 48},
        )

    clear_dependency_overrides()
    assert response.status_code == 400


def test_password_reset_request_returns_generic_response(monkeypatch) -> None:
    reset_mock = MagicMock(return_value=None)
    monkeypatch.setattr(password_auth_router, "request_password_reset_token", reset_mock)
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.post(
            "/auth/password/password-reset/request",
            json={"email": "missing@example.com"},
        )

    clear_dependency_overrides()
    assert response.status_code == 200
    assert "If the email exists" in response.json()["message"]


def test_password_reset_complete_rejects_weak_password() -> None:
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.post(
            "/auth/password/password-reset/complete",
            json={
                "token": "a" * 48,
                "new_password": "weak",
            },
        )

    clear_dependency_overrides()
    assert response.status_code == 422
    assert response.json()["detail"]["code"] == "password_policy_failed"


def test_password_reset_complete_returns_success(monkeypatch) -> None:
    complete_mock = MagicMock(return_value=None)
    monkeypatch.setattr(password_auth_router, "complete_password_reset", complete_mock)
    app.dependency_overrides[get_db_session] = override_session(MagicMock())

    with TestClient(app) as client:
        response = client.post(
            "/auth/password/password-reset/complete",
            json={
                "token": "a" * 48,
                "new_password": "NewMarketPilot2026!",
            },
        )

    clear_dependency_overrides()
    assert response.status_code == 200
    assert response.json()["message"] == "Password reset complete"
