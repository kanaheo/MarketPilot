import secrets
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from marketpilot_api.core.config import get_settings
from marketpilot_api.db.session import get_db_session
from marketpilot_api.repositories import upsert_user
from marketpilot_api.schemas.auth import (
    AuthenticatedUserResponse,
    UserSyncRequest,
)

router = APIRouter(prefix="/internal/auth", tags=["internal-auth"])


def verify_internal_token(
    x_marketpilot_internal_token: Annotated[str | None, Header()] = None,
) -> None:
    configured_token = get_settings().internal_api_token

    if configured_token is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Internal authentication is not configured",
        )

    supplied_token = x_marketpilot_internal_token or ""
    if not secrets.compare_digest(
        supplied_token,
        configured_token.get_secret_value(),
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal authentication token",
        )


@router.post(
    "/users/sync",
    response_model=AuthenticatedUserResponse,
    dependencies=[Depends(verify_internal_token)],
)
def sync_user(
    data: UserSyncRequest,
    session: Annotated[Session, Depends(get_db_session)],
) -> AuthenticatedUserResponse:
    user = upsert_user(session, data)
    return AuthenticatedUserResponse.model_validate(user)
