from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from marketpilot_api.core.config import get_settings
from marketpilot_api.core.password_policy import validate_password_policy
from marketpilot_api.db.session import get_db_session
from marketpilot_api.repositories.password_auth import (
    PasswordAuthDuplicateEmailError,
    PasswordAuthEmailNotVerifiedError,
    PasswordAuthInvalidCredentialsError,
    PasswordAuthInvalidTokenError,
    complete_password_reset,
    confirm_email_verification_token,
    create_password_user,
    request_password_reset_token,
    verify_password_user,
)
from marketpilot_api.schemas.auth import (
    AuthActionResponse,
    AuthenticatedUserResponse,
    EmailVerificationConfirmRequest,
    PasswordResetCompleteRequest,
    PasswordResetRequest,
    PasswordSignupRequest,
    PasswordSignupResponse,
    PasswordVerifyRequest,
)

router = APIRouter(prefix="/auth/password", tags=["password-auth"])


def raise_password_policy_error(errors: tuple[str, ...]) -> None:
    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        detail={
            "code": "password_policy_failed",
            "errors": list(errors),
        },
    )


def include_dev_token() -> bool:
    return get_settings().environment != "production"


@router.post(
    "/signup",
    response_model=PasswordSignupResponse,
    status_code=status.HTTP_201_CREATED,
)
def signup_with_password(
    data: PasswordSignupRequest,
    session: Annotated[Session, Depends(get_db_session)],
) -> PasswordSignupResponse:
    policy_result = validate_password_policy(data.password)
    if not policy_result.is_valid:
        raise_password_policy_error(policy_result.errors)

    try:
        user, _credential, verification_token = create_password_user(
            session,
            email=str(data.email),
            password=data.password,
            display_name=data.display_name,
        )
    except PasswordAuthDuplicateEmailError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        ) from exc

    return PasswordSignupResponse(
        user_id=user.id,
        email=user.email or str(data.email),
        email_verification_required=True,
        dev_email_verification_token=(
            verification_token if include_dev_token() else None
        ),
    )


@router.post("/verify", response_model=AuthenticatedUserResponse)
def verify_password_login(
    data: PasswordVerifyRequest,
    session: Annotated[Session, Depends(get_db_session)],
) -> AuthenticatedUserResponse:
    try:
        user = verify_password_user(
            session,
            email=str(data.email),
            password=data.password,
        )
    except PasswordAuthEmailNotVerifiedError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email verification is required",
        ) from exc
    except PasswordAuthInvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        ) from exc

    return AuthenticatedUserResponse.model_validate(user)


@router.post("/email-verification/confirm", response_model=AuthActionResponse)
def confirm_email_verification(
    data: EmailVerificationConfirmRequest,
    session: Annotated[Session, Depends(get_db_session)],
) -> AuthActionResponse:
    try:
        confirm_email_verification_token(session, token=data.token)
    except PasswordAuthInvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        ) from exc

    return AuthActionResponse(message="Email verified")


@router.post("/password-reset/request", response_model=AuthActionResponse)
def request_password_reset(
    data: PasswordResetRequest,
    session: Annotated[Session, Depends(get_db_session)],
) -> AuthActionResponse:
    reset_token = request_password_reset_token(session, email=str(data.email))
    return AuthActionResponse(
        message="If the email exists, password reset instructions will be sent",
        dev_token=reset_token if include_dev_token() else None,
    )


@router.post("/password-reset/complete", response_model=AuthActionResponse)
def complete_password_reset_request(
    data: PasswordResetCompleteRequest,
    session: Annotated[Session, Depends(get_db_session)],
) -> AuthActionResponse:
    policy_result = validate_password_policy(data.new_password)
    if not policy_result.is_valid:
        raise_password_policy_error(policy_result.errors)

    try:
        complete_password_reset(
            session,
            token=data.token,
            new_password=data.new_password,
        )
    except PasswordAuthInvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        ) from exc

    return AuthActionResponse(message="Password reset complete")
