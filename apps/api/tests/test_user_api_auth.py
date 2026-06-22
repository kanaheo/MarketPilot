import base64
import hashlib
import hmac
import json
import time
import uuid
from typing import Annotated
from unittest.mock import MagicMock

from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient

from marketpilot_api.core.config import get_settings
from marketpilot_api.core.user_api_auth import get_current_user
from marketpilot_api.db.session import get_db_session
from marketpilot_api.models import User

TEST_SIGNING_SECRET = "test-user-api-signing-secret"

app_under_test = FastAPI()


@app_under_test.get("/protected")
def protected_route(
    current_user: Annotated[User, Depends(get_current_user)],
) -> dict[str, str]:
    return {"user_id": str(current_user.id)}


def create_token(
    user_id: uuid.UUID,
    *,
    issued_at: int | None = None,
    expires_at: int | None = None,
    signing_secret: str = TEST_SIGNING_SECRET,
) -> str:
    now = int(time.time())
    payload = {
        "aud": "marketpilot-api",
        "exp": expires_at if expires_at is not None else now + 60,
        "iat": issued_at if issued_at is not None else now,
        "iss": "marketpilot-web",
        "sub": str(user_id),
    }
    payload_segment = base64.urlsafe_b64encode(
        json.dumps(payload, separators=(",", ":")).encode()
    ).rstrip(b"=")
    signature_segment = base64.urlsafe_b64encode(
        hmac.new(
            signing_secret.encode(),
            payload_segment,
            hashlib.sha256,
        ).digest()
    ).rstrip(b"=")
    return f"{payload_segment.decode()}.{signature_segment.decode()}"


def configure_auth(monkeypatch) -> None:
    monkeypatch.setenv(
        "MARKETPILOT_USER_API_SIGNING_SECRET",
        TEST_SIGNING_SECRET,
    )
    get_settings.cache_clear()


def clear_auth_state() -> None:
    app_under_test.dependency_overrides.clear()
    get_settings.cache_clear()


def test_protected_route_rejects_missing_authentication() -> None:
    with TestClient(app_under_test) as client:
        response = client.get("/protected")

    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication required"


def test_protected_route_rejects_invalid_signature(monkeypatch) -> None:
    configure_auth(monkeypatch)
    token = create_token(uuid.uuid4(), signing_secret="wrong-secret")

    with TestClient(app_under_test) as client:
        response = client.get(
            "/protected",
            headers={"Authorization": f"Bearer {token}"},
        )

    clear_auth_state()
    assert response.status_code == 401


def test_protected_route_rejects_expired_token(monkeypatch) -> None:
    configure_auth(monkeypatch)
    now = int(time.time())
    token = create_token(
        uuid.uuid4(),
        issued_at=now - 61,
        expires_at=now - 1,
    )

    with TestClient(app_under_test) as client:
        response = client.get(
            "/protected",
            headers={"Authorization": f"Bearer {token}"},
        )

    clear_auth_state()
    assert response.status_code == 401


def test_protected_route_rejects_missing_user(monkeypatch) -> None:
    configure_auth(monkeypatch)
    session = MagicMock()
    session.scalar.return_value = None

    def override_db_session():
        yield session

    app_under_test.dependency_overrides[get_db_session] = override_db_session
    token = create_token(uuid.uuid4())

    with TestClient(app_under_test) as client:
        response = client.get(
            "/protected",
            headers={"Authorization": f"Bearer {token}"},
        )

    clear_auth_state()
    assert response.status_code == 401
    assert response.json()["detail"] == (
        "Authenticated user does not exist"
    )


def test_protected_route_returns_current_user(monkeypatch) -> None:
    configure_auth(monkeypatch)
    user = User(
        id=uuid.uuid4(),
        auth_provider="google",
        auth_subject="google-user-1",
    )
    session = MagicMock()
    session.scalar.return_value = user

    def override_db_session():
        yield session

    app_under_test.dependency_overrides[get_db_session] = override_db_session
    token = create_token(user.id)

    with TestClient(app_under_test) as client:
        response = client.get(
            "/protected",
            headers={"Authorization": f"Bearer {token}"},
        )

    clear_auth_state()
    assert response.status_code == 200
    assert response.json() == {"user_id": str(user.id)}
    session.scalar.assert_called_once()
