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
    create_mock = MagicMock(return_value=(user, object()))
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
