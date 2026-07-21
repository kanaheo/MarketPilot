from unittest.mock import MagicMock
import uuid

from fastapi.testclient import TestClient

from marketpilot_api.core.config import get_settings
from marketpilot_api.db.session import get_db_session
from marketpilot_api.main import app
from marketpilot_api.models import User, UserAuthIdentity


def test_user_sync_rejects_invalid_internal_token(monkeypatch) -> None:
    monkeypatch.setenv("MARKETPILOT_INTERNAL_API_TOKEN", "expected-token")
    get_settings.cache_clear()

    with TestClient(app) as client:
        response = client.post(
            "/internal/auth/users/sync",
            headers={"X-MarketPilot-Internal-Token": "wrong-token"},
            json={
                "auth_provider": "google",
                "auth_subject": "google-user-1",
            },
        )

    get_settings.cache_clear()
    assert response.status_code == 401


def test_user_sync_returns_persisted_user(monkeypatch) -> None:
    monkeypatch.setenv("MARKETPILOT_INTERNAL_API_TOKEN", "expected-token")
    get_settings.cache_clear()

    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
        email="developer@example.com",
        display_name="Market Pilot",
        image_url=None,
    )
    identity = UserAuthIdentity(
        id=uuid.uuid4(),
        user_id=user.id,
        auth_provider="google",
        auth_subject="google-user-1",
    )
    session = MagicMock()
    session.scalar.side_effect = [identity, user]

    def override_db_session():
        yield session

    app.dependency_overrides[get_db_session] = override_db_session

    with TestClient(app) as client:
        response = client.post(
            "/internal/auth/users/sync",
            headers={"X-MarketPilot-Internal-Token": "expected-token"},
            json={
                "auth_provider": "google",
                "auth_subject": "google-user-1",
                "email": "developer@example.com",
                "display_name": "Market Pilot",
            },
        )

    app.dependency_overrides.clear()
    get_settings.cache_clear()

    assert response.status_code == 200
    assert response.json()["id"] == str(user.id)
    session.commit.assert_called_once()
    session.refresh.assert_called_once_with(user)


def test_user_sync_creates_identity_for_new_user(monkeypatch) -> None:
    monkeypatch.setenv("MARKETPILOT_INTERNAL_API_TOKEN", "expected-token")
    get_settings.cache_clear()

    session = MagicMock()
    session.scalar.side_effect = [None, None]

    def override_db_session():
        yield session

    app.dependency_overrides[get_db_session] = override_db_session

    with TestClient(app) as client:
        response = client.post(
            "/internal/auth/users/sync",
            headers={"X-MarketPilot-Internal-Token": "expected-token"},
            json={
                "auth_provider": "google",
                "auth_subject": "google-user-1",
                "email": "developer@example.com",
                "display_name": "Market Pilot",
            },
        )

    app.dependency_overrides.clear()
    get_settings.cache_clear()

    assert response.status_code == 200
    user = session.add.call_args_list[0].args[0]
    identity = session.add.call_args_list[1].args[0]
    assert identity.user_id == user.id
    assert identity.auth_provider == "google"
    assert identity.auth_subject == "google-user-1"
    session.commit.assert_called_once()
    session.refresh.assert_called_once_with(user)


def test_user_sync_rejects_existing_email_for_different_provider(
    monkeypatch,
) -> None:
    monkeypatch.setenv("MARKETPILOT_INTERNAL_API_TOKEN", "expected-token")
    get_settings.cache_clear()

    existing_user = User(
        id=uuid.uuid4(),
        auth_provider="password",
        auth_subject="developer@example.com",
        email="developer@example.com",
        display_name="Market Pilot",
        image_url=None,
    )
    session = MagicMock()
    session.scalar.side_effect = [None, existing_user]

    def override_db_session():
        yield session

    app.dependency_overrides[get_db_session] = override_db_session

    with TestClient(app) as client:
        response = client.post(
            "/internal/auth/users/sync",
            headers={"X-MarketPilot-Internal-Token": "expected-token"},
            json={
                "auth_provider": "google",
                "auth_subject": "google-user-1",
                "email": "Developer@Example.com",
                "display_name": "Market Pilot",
            },
        )

    app.dependency_overrides.clear()
    get_settings.cache_clear()

    assert response.status_code == 409
    assert response.json()["detail"] == (
        "Email is already registered with another auth provider"
    )
    session.add.assert_not_called()
    session.commit.assert_not_called()
