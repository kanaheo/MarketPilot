import base64
import binascii
import hashlib
import hmac
import json
import time
import uuid
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from marketpilot_api.core.config import get_settings
from marketpilot_api.db.session import get_db_session
from marketpilot_api.models import User
from marketpilot_api.repositories import get_user_by_id

TOKEN_AUDIENCE = "marketpilot-api"
TOKEN_ISSUER = "marketpilot-web"
TOKEN_TTL_SECONDS = 60
TOKEN_CLOCK_SKEW_SECONDS = 5

bearer_scheme = HTTPBearer(auto_error=False)


def _authentication_error(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def _decode_base64url(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.b64decode(
        value + padding,
        altchars=b"-_",
        validate=True,
    )


def verify_user_api_token(token: str) -> uuid.UUID:
    signing_secret = get_settings().user_api_signing_secret
    if signing_secret is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="User API authentication is not configured",
        )

    try:
        payload_segment, signature_segment = token.split(".")
        supplied_signature = _decode_base64url(signature_segment)
        expected_signature = hmac.new(
            signing_secret.get_secret_value().encode(),
            payload_segment.encode(),
            hashlib.sha256,
        ).digest()

        if not hmac.compare_digest(supplied_signature, expected_signature):
            raise ValueError

        payload = json.loads(_decode_base64url(payload_segment))
        if not isinstance(payload, dict):
            raise ValueError

        subject = payload.get("sub")
        issued_at = payload.get("iat")
        expires_at = payload.get("exp")

        if (
            payload.get("iss") != TOKEN_ISSUER
            or payload.get("aud") != TOKEN_AUDIENCE
            or not isinstance(subject, str)
            or not isinstance(issued_at, int)
            or isinstance(issued_at, bool)
            or not isinstance(expires_at, int)
            or isinstance(expires_at, bool)
        ):
            raise ValueError

        now = int(time.time())
        if (
            expires_at <= now
            or issued_at > now + TOKEN_CLOCK_SKEW_SECONDS
            or expires_at <= issued_at
            or expires_at - issued_at > TOKEN_TTL_SECONDS
        ):
            raise ValueError

        return uuid.UUID(subject)
    except (
        binascii.Error,
        json.JSONDecodeError,
        UnicodeDecodeError,
        ValueError,
    ):
        raise _authentication_error(
            "Invalid user authentication token"
        ) from None


def get_current_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None,
        Depends(bearer_scheme),
    ],
    session: Annotated[Session, Depends(get_db_session)],
) -> User:
    if credentials is None:
        raise _authentication_error("Authentication required")

    user_id = verify_user_api_token(credentials.credentials)
    user = get_user_by_id(session, user_id)
    if user is None:
        raise _authentication_error("Authenticated user does not exist")

    return user
